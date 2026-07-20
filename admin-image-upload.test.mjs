import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./admin-app.jsx", import.meta.url), "utf8");

test("local product images are converted to WebP before Cloudinary upload", () => {
  assert.match(source, /async function convertImageToWebp\(/);
  assert.match(source, /canvas\.toBlob\([^;]+"image\/webp"/s);
  assert.match(source, /blob\.type !== "image\/webp"/);
  assert.match(source, /\.webp/);
});

test("oversized WebP output is reduced below a safe Cloudinary upload size", () => {
  assert.match(source, /const CLOUDINARY_IMAGE_MAX_BYTES = 9000000/);
  assert.match(source, /while \(blob\.size > CLOUDINARY_IMAGE_MAX_BYTES/);
  assert.match(source, /scale \*= 0\.85/);
});

test("Cloudinary upload receives the converted blob and WebP filename", () => {
  assert.match(source, /fd\.append\("file", converted\.blob, converted\.fileName\)/);
  assert.match(source, /async function uploadLocalImageToCloudinary\(/);
});

test("the admin upload button uses a local file picker instead of the widget size gate", () => {
  assert.match(source, /type: "file"/);
  assert.match(source, /accept: "image\/\*"/);
  assert.doesNotMatch(source, /maxFileSize:\s*10000000/);
});
