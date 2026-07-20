import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { onRequestPost } from "./functions/api/publish.js";

const adminSource = await readFile(new URL("./admin-app.jsx", import.meta.url), "utf8");
const publishSource = await readFile(new URL("./functions/api/publish.js", import.meta.url), "utf8");

test("the image library recovers images already referenced by products and Hero", () => {
  assert.match(adminSource, /function collectReferencedImages\(/);
  assert.match(adminSource, /category\.products/);
  assert.match(adminSource, /data\.hero/);
  assert.match(adminSource, /mergeLibraryImages\(/);
});

test("image library additions and deletions are saved to the cloud immediately", () => {
  assert.match(adminSource, /async function saveLibraryImages\(/);
  assert.match(adminSource, /publishImageLibraryData\(/);
  assert.match(adminSource, /imageDeletions/);
  assert.match(adminSource, /儲存至雲端中/);
});

test("concurrent image library publishes merge by URL without reviving stale snapshots", () => {
  assert.match(publishSource, /keyFor = \(img\) => String\(\(img && \(img\.url \|\| img\.id\)\)/);
  assert.match(publishSource, /mergeImages\(current\.images, incoming\.images, imageDeletions\)/);
  assert.match(publishSource, /current\.images \|\| incoming\.images \|\| \[\]/);
  assert.match(publishSource, /images: storeCommit\.images/);
});

test("the image library can search names, products, and URLs", () => {
  assert.match(adminSource, /const \[searchQuery, setSearchQuery\] = useState\(''\)/);
  assert.match(adminSource, /function imageSearchText\(/);
  assert.match(adminSource, /const filteredImages/);
  assert.match(adminSource, /搜尋圖片名稱、產品或網址/);
  assert.match(adminSource, /filteredImages\.map/);
});

function storeSource(images) {
  return [
    "(function () {",
    "var categories = [];",
    `var images = ${JSON.stringify(images)};`,
    "var badges = [];",
    "var hero = [];",
    "window.STORE = { categories: categories, images: images, badges: badges, hero: hero };",
    "})();"
  ].join("\n");
}

test("the publish API keeps concurrent images, removes explicit deletions, and deduplicates by URL", async () => {
  const currentImages = [
    { id: "keep-old", url: "https://cdn.example/keep.webp", alt: "Keep" },
    { id: "remove", url: "https://cdn.example/remove.webp", alt: "Remove" }
  ];
  const incomingImages = [
    { id: "keep-new", url: "https://cdn.example/keep.webp", alt: "Keep updated" },
    { id: "new", url: "https://cdn.example/new.webp", alt: "New" }
  ];
  const originalFetch = globalThis.fetch;
  let committedContent = "";
  globalThis.fetch = async (_url, options = {}) => {
    if (options.method === "PUT") {
      const body = JSON.parse(options.body);
      committedContent = Buffer.from(body.content, "base64").toString("utf8");
      return new Response("{}", { status: 200 });
    }
    return new Response(JSON.stringify({
      sha: "current-sha",
      content: Buffer.from(storeSource(currentImages), "utf8").toString("base64")
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const data = {
      categories: [],
      images: incomingImages,
      badges: [],
      hero: [],
      imageDeletions: [{ id: "remove", url: "https://cdn.example/remove.webp" }]
    };
    const response = await onRequestPost({
      request: new Request("https://example.test/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: [{
            path: "store-data.js",
            content: storeSource(incomingImages),
            mergeStrategy: "owned-products",
            data,
            contentChanges: { imagesChanged: true },
            publisher: { id: "tester", username: "tester", role: "admin" }
          }]
        })
      }),
      env: { GITHUB_TOKEN: "test-token" }
    });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.deepEqual(result.images.map(img => img.url).sort(), [
      "https://cdn.example/keep.webp",
      "https://cdn.example/new.webp"
    ]);
    assert.equal(result.images.find(img => img.url.endsWith("keep.webp")).id, "keep-new");
    assert.doesNotMatch(committedContent, /remove\.webp/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
