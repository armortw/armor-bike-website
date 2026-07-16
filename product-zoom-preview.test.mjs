import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const script = await readFile(new URL("./product-zoom-preview.js", import.meta.url), "utf8");
const styles = await readFile(new URL("./product-zoom-preview.css", import.meta.url), "utf8");
const lightboxSource = script.slice(
  script.indexOf("function getLightbox"),
  script.indexOf("function attachZoom")
);

test("full-screen preview starts inside a definite image canvas", () => {
  assert.match(lightboxSource, /product-lightbox-canvas/);
  assert.match(styles, /\.product-lightbox-canvas\s*\{[^}]*position:\s*absolute[^}]*inset:/s);
  assert.match(styles, /\.product-lightbox-image\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0/s);
});

test("zoom is explicit and provides minus, plus, percentage and fit controls", () => {
  assert.match(lightboxSource, /product-lightbox-zoom-out/);
  assert.match(lightboxSource, /product-lightbox-zoom-in/);
  assert.match(lightboxSource, /product-lightbox-zoom-value/);
  assert.match(lightboxSource, /product-lightbox-fit/);
});

test("legacy hover-follow and viewport-exit zoom state are removed", () => {
  assert.doesNotMatch(lightboxSource, /pointerenter/);
  assert.doesNotMatch(lightboxSource, /pointerout/);
  assert.doesNotMatch(lightboxSource, /snapPanAtViewportExit/);
  assert.doesNotMatch(lightboxSource, /product-lightbox-zoom-toggle/);
});

test("drag state is released even when the pointer ends outside the image canvas", () => {
  assert.match(lightboxSource, /window\.addEventListener\("pointerup", finishDrag, true\)/);
  assert.match(lightboxSource, /window\.addEventListener\("pointercancel", finishDrag, true\)/);
});
