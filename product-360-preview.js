(function () {
  "use strict";

  var controllers = new WeakMap();
  var scanQueued = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function wrapIndex(index, length) {
    if (!length) return 0;
    return (index % length + length) % length;
  }

  function absoluteUrl(value) {
    if (!value) return "";
    try {
      return new URL(String(value), window.location.href).href;
    } catch (error) {
      return String(value);
    }
  }

  function frameUrl(entry) {
    if (!entry) return "";
    if (typeof entry === "string") return absoluteUrl(entry.trim());
    var fields = ["url", "secure_url", "src", "image", "imageUrl", "cdnUrl", "cloudinaryUrl", "preview"];
    for (var index = 0; index < fields.length; index += 1) {
      if (entry[fields[index]]) return frameUrl(entry[fields[index]]);
    }
    return "";
  }

  function normalizeFrames(entries, fallbackAlt) {
    var frames = [];
    var seen = new Set();
    (Array.isArray(entries) ? entries : []).forEach(function (entry, index) {
      var url = frameUrl(entry);
      if (!url || seen.has(url)) return;
      seen.add(url);
      frames.push({
        url: url,
        alt: entry && typeof entry === "object" && (entry.alt || entry.altText || entry.caption)
          ? String(entry.alt || entry.altText || entry.caption)
          : fallbackAlt + " " + (index + 1)
      });
    });
    return frames;
  }

  function findProduct(value, productId, depth, visited) {
    if (!value || typeof value !== "object" || depth > 9 || visited.has(value)) return null;
    visited.add(value);

    if (!Array.isArray(value)) {
      var identity = value.productId || value.sourceKey || value.id || value.key;
      if (identity && String(identity) === productId) return value;
    }

    var children = Array.isArray(value) ? value : Object.keys(value).map(function (key) { return value[key]; });
    for (var index = 0; index < children.length; index += 1) {
      var child = children[index];
      if (!child || typeof child !== "object") continue;
      var match = findProduct(child, productId, depth + 1, visited);
      if (match) return match;
    }
    return null;
  }

  function configuredFrames() {
    var productId = new URLSearchParams(window.location.search).get("id") || "";
    var globalFrames = window.__ARMOR_360_FRAMES__;
    if (globalFrames && !Array.isArray(globalFrames) && productId && globalFrames[productId]) {
      globalFrames = globalFrames[productId];
    }
    if (globalFrames && !Array.isArray(globalFrames)) {
      globalFrames = globalFrames.frames || globalFrames.images || globalFrames.spinImages;
    }
    if (Array.isArray(globalFrames) && globalFrames.length) return globalFrames;

    if (!productId || !window.STORE) return [];
    var product = findProduct(window.STORE, productId, 0, new WeakSet());
    if (!product) return [];
    var fields = ["spinImages", "images360", "frames360", "panoramaFrames", "turntableImages", "spin360"];
    for (var index = 0; index < fields.length; index += 1) {
      if (Array.isArray(product[fields[index]]) && product[fields[index]].length) return product[fields[index]];
    }
    return [];
  }

  function directSourceImage(stage) {
    return Array.from(stage.children).find(function (child) {
      return child.tagName === "IMG" && !child.classList.contains("armor-360-frame");
    }) || null;
  }

  function domFrames(stage, sourceImage) {
    var gallery = stage.closest(".gallery");
    var images = gallery ? Array.from(gallery.querySelectorAll(".thumb img")) : [];
    if (sourceImage) images.push(sourceImage);
    return normalizeFrames(images.map(function (image) {
      return {
        url: image.currentSrc || image.src || image.getAttribute("src"),
        alt: image.alt || (sourceImage && sourceImage.alt) || "ARMOR BIKE product"
      };
    }), (sourceImage && sourceImage.alt) || "ARMOR BIKE product");
  }

  function collectFrames(stage, sourceImage) {
    var fallbackAlt = (sourceImage && sourceImage.alt) || "ARMOR BIKE product";
    var dedicated = normalizeFrames(configuredFrames(), fallbackAlt);
    return dedicated.length ? dedicated : domFrames(stage, sourceImage);
  }

  function svgIcon(name) {
    var icons = {
      play: '<path d="M8 5v14l11-7z"></path>',
      pause: '<path d="M9 5v14M15 5v14"></path>',
      reset: '<path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v6h6"></path>',
      fullscreen: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path>',
      rotate: '<path d="M4 12a8 4 0 1 0 16 0 8 4 0 1 0-16 0"></path><path d="m16 8 4 4-4 4"></path><path d="M8 8 4 12l4 4"></path>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[name] + '</svg>';
  }

  function hudMarkup() {
    return '' +
      '<svg class="armor-360-hud" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">' +
        '<g fill="none" stroke="currentColor">' +
          '<g class="hud-orbit" opacity=".34">' +
            '<ellipse cx="500" cy="325" rx="390" ry="226" stroke-width="1.2" stroke-dasharray="72 18 8 18"></ellipse>' +
            '<path d="M126 260h38M836 390h38M447 100v30M553 520v30" stroke-width="2"></path>' +
          '</g>' +
          '<g class="hud-orbit hud-orbit-reverse" opacity=".24">' +
            '<ellipse cx="500" cy="325" rx="316" ry="184" stroke-width="1" stroke-dasharray="10 20 44 16"></ellipse>' +
            '<circle cx="184" cy="325" r="5" stroke-width="2"></circle>' +
            '<circle cx="816" cy="325" r="5" stroke-width="2"></circle>' +
          '</g>' +
          '<g class="hud-radar" opacity=".28">' +
            '<path d="M500 325L822 211"></path>' +
            '<path d="M500 325L178 439"></path>' +
          '</g>' +
          '<g class="hud-focus" opacity=".42" stroke-width="1.4">' +
            '<path d="M396 210h-54v54M604 210h54v54M396 440h-54v-54M604 440h54v-54"></path>' +
            '<path d="M468 325h64M500 293v64" opacity=".54"></path>' +
          '</g>' +
          '<g class="hud-scan" opacity=".38">' +
            '<path d="M176 325h648" stroke-width="1"></path>' +
            '<path d="M226 319h548" stroke-width="5" opacity=".08"></path>' +
          '</g>' +
          '<g class="hud-corners" opacity=".62" stroke-width="2">' +
            '<path d="M72 118V72h58M870 72h58v46M72 532v46h58M870 578h58v-46"></path>' +
          '</g>' +
          '<path d="M82 325h52M866 325h52" opacity=".6" stroke-width="2"></path>' +
          '<path d="M500 64v28M500 558v28" opacity=".5" stroke-width="2"></path>' +
        '</g>' +
      '</svg>';
  }

  function createExperience() {
    var experience = document.createElement("div");
    experience.className = "armor-360-experience";
    experience.innerHTML = '' +
      hudMarkup() +
      '<div class="armor-360-mode">' + svgIcon("rotate") + '<span>360&deg;</span></div>' +
      '<div class="armor-360-frame-count" aria-hidden="true">01 / 01</div>' +
      '<div class="armor-360-toolbar" role="group" aria-label="360 product image controls">' +
        '<div class="armor-360-toolbar-group">' +
          '<button class="armor-360-control armor-360-auto" type="button" aria-label="Play 360 rotation" aria-pressed="false" title="Play 360 rotation">' + svgIcon("play") + '</button>' +
        '</div>' +
        '<div class="armor-360-scrubber-wrap">' +
          '<input class="armor-360-scrubber" type="range" min="0" max="0" step="1" value="0" aria-label="360 rotation frame">' +
        '</div>' +
        '<div class="armor-360-toolbar-group">' +
          '<button class="armor-360-control armor-360-reset" type="button" aria-label="Reset product view" title="Reset product view">' + svgIcon("reset") + '</button>' +
          '<button class="armor-360-control armor-360-fullscreen" type="button" aria-label="Open full screen" aria-pressed="false" title="Open full screen">' + svgIcon("fullscreen") + '</button>' +
        '</div>' +
      '</div>' +
      '<span class="armor-360-sr-only" role="status" aria-live="polite"></span>';
    return experience;
  }

  function attachStage(stage) {
    var existing = controllers.get(stage);
    if (existing && stage.querySelector(".armor-360-experience")) {
      existing.refresh();
      return;
    }

    var sourceImage = directSourceImage(stage);
    if (!sourceImage) return;

    var viewerImage = document.createElement("img");
    viewerImage.className = "armor-360-frame";
    viewerImage.alt = sourceImage.alt || "ARMOR BIKE product";
    viewerImage.draggable = false;

    var experience = createExperience();
    var frameCount = experience.querySelector(".armor-360-frame-count");
    var autoButton = experience.querySelector(".armor-360-auto");
    var resetButton = experience.querySelector(".armor-360-reset");
    var fullscreenButton = experience.querySelector(".armor-360-fullscreen");
    var scrubber = experience.querySelector(".armor-360-scrubber");
    var status = experience.querySelector(".armor-360-sr-only");
    var frames = [];
    var frameSignature = "";
    var activeIndex = 0;
    var sourceUrl = "";
    var dragging = null;
    var autoSpinning = false;
    var autoFrame = 0;
    var autoTime = 0;

    stage.classList.add("armor-360-stage");
    stage.tabIndex = 0;
    stage.setAttribute("role", "group");
    stage.setAttribute("aria-label", "Interactive 360 product image");
    sourceImage.classList.add("armor-360-source-image");
    stage.appendChild(viewerImage);
    stage.appendChild(experience);

    function imageClassForFit() {
      if (!viewerImage.naturalWidth || !viewerImage.naturalHeight) return;
      var ratio = viewerImage.naturalWidth / viewerImage.naturalHeight;
      viewerImage.classList.toggle("is-portrait", ratio < 0.48);
      viewerImage.classList.toggle("is-wide", ratio > 2.15);
    }

    function currentFrameLabel() {
      var digits = Math.max(2, String(frames.length || 1).length);
      return String(activeIndex + 1).padStart(digits, "0") + " / " + String(frames.length || 1).padStart(digits, "0");
    }

    function markThumbnail() {
      var gallery = stage.closest(".gallery");
      if (!gallery) return;
      gallery.querySelectorAll(".thumb").forEach(function (button) {
        var image = button.querySelector("img");
        var url = image && absoluteUrl(image.currentSrc || image.src || image.getAttribute("src"));
        button.classList.toggle("armor-360-frame-active", Boolean(url && frames[activeIndex] && url === frames[activeIndex].url));
      });
    }

    function preloadNeighbors() {
      if (frames.length < 2) return;
      [activeIndex + 1, activeIndex - 1].forEach(function (index) {
        var image = new Image();
        image.src = frames[wrapIndex(index, frames.length)].url;
      });
    }

    function setFrame(nextIndex, announce) {
      if (!frames.length) return;
      activeIndex = wrapIndex(nextIndex, frames.length);
      var frame = frames[activeIndex];
      var current = absoluteUrl(viewerImage.currentSrc || viewerImage.src);
      if (current !== frame.url) {
        stage.classList.add("is-loading");
        viewerImage.src = frame.url;
      }
      viewerImage.alt = frame.alt;
      scrubber.value = String(activeIndex);
      frameCount.textContent = currentFrameLabel();
      markThumbnail();
      preloadNeighbors();
      if (announce) status.textContent = "Product view " + (activeIndex + 1) + " of " + frames.length;
    }

    function updateTilt(clientX, clientY, strength) {
      var rect = stage.getBoundingClientRect();
      var x = clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      var y = clamp((clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      stage.style.setProperty("--armor-360-tilt-x", ((x - 0.5) * (strength || 5)).toFixed(2) + "deg");
      stage.style.setProperty("--armor-360-tilt-y", ((0.5 - y) * (strength || 3)).toFixed(2) + "deg");
    }

    function resetTilt() {
      stage.style.setProperty("--armor-360-tilt-x", "0deg");
      stage.style.setProperty("--armor-360-tilt-y", "0deg");
    }

    function dragStepSize() {
      if (frames.length <= 2) return clamp(stage.clientWidth / 6, 88, 140);
      if (frames.length <= 6) return 54;
      return 26;
    }

    function syncReactThumbnail() {
      var gallery = stage.closest(".gallery");
      if (!gallery || !frames[activeIndex]) return;
      var button = Array.from(gallery.querySelectorAll(".thumb")).find(function (candidate) {
        var image = candidate.querySelector("img");
        return image && absoluteUrl(image.currentSrc || image.src || image.getAttribute("src")) === frames[activeIndex].url;
      });
      if (button && !button.classList.contains("active")) button.click();
    }

    function setAutoSpinning(nextValue) {
      autoSpinning = Boolean(nextValue) && frames.length > 1;
      autoButton.setAttribute("aria-pressed", String(autoSpinning));
      autoButton.setAttribute("aria-label", autoSpinning ? "Pause 360 rotation" : "Play 360 rotation");
      autoButton.title = autoSpinning ? "Pause 360 rotation" : "Play 360 rotation";
      autoButton.innerHTML = svgIcon(autoSpinning ? "pause" : "play");
      stage.classList.toggle("is-auto-spinning", autoSpinning);
      autoTime = 0;
      if (autoSpinning) {
        autoFrame = window.requestAnimationFrame(runAutoSpin);
      } else if (autoFrame) {
        window.cancelAnimationFrame(autoFrame);
        autoFrame = 0;
        syncReactThumbnail();
      }
    }

    function runAutoSpin(timestamp) {
      if (!autoSpinning || !stage.isConnected) return;
      var delay = frames.length >= 16 ? 90 : frames.length >= 8 ? 140 : 850;
      if (!autoTime) autoTime = timestamp;
      if (timestamp - autoTime >= delay) {
        setFrame(activeIndex + 1, false);
        autoTime = timestamp;
      }
      autoFrame = window.requestAnimationFrame(runAutoSpin);
    }

    function updateFrameControls() {
      var multiple = frames.length > 1;
      scrubber.max = String(Math.max(0, frames.length - 1));
      scrubber.disabled = !multiple;
      autoButton.disabled = !multiple;
      stage.classList.toggle("is-single-frame", !multiple);
    }

    function refresh() {
      var nextSource = directSourceImage(stage);
      if (!nextSource) return;
      if (nextSource !== sourceImage) {
        sourceImage.classList.remove("armor-360-source-image");
        sourceImage = nextSource;
        sourceImage.classList.add("armor-360-source-image");
      }

      var nextFrames = collectFrames(stage, sourceImage);
      var nextSignature = nextFrames.map(function (frame) { return frame.url; }).join("|");
      var nextSourceUrl = absoluteUrl(sourceImage.currentSrc || sourceImage.src || sourceImage.getAttribute("src"));
      if (nextSignature !== frameSignature) {
        frames = nextFrames;
        frameSignature = nextSignature;
        activeIndex = Math.max(0, frames.findIndex(function (frame) { return frame.url === nextSourceUrl; }));
        updateFrameControls();
        setFrame(activeIndex, false);
      } else if (nextSourceUrl && nextSourceUrl !== sourceUrl) {
        var sourceIndex = frames.findIndex(function (frame) { return frame.url === nextSourceUrl; });
        if (sourceIndex >= 0) setFrame(sourceIndex, false);
      }
      sourceUrl = nextSourceUrl;
    }

    viewerImage.addEventListener("load", function () {
      stage.classList.remove("is-loading");
      imageClassForFit();
    });
    viewerImage.addEventListener("error", function () {
      stage.classList.remove("is-loading");
    });

    stage.addEventListener("pointerdown", function (event) {
      if (event.target.closest && event.target.closest(".armor-360-toolbar")) return;
      if (!frames.length) return;
      setAutoSpinning(false);
      dragging = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startIndex: activeIndex,
        moved: false
      };
      stage.classList.add("is-dragging");
      stage.setPointerCapture(event.pointerId);
      updateTilt(event.clientX, event.clientY, 7);
      event.preventDefault();
    });

    stage.addEventListener("pointermove", function (event) {
      if (dragging && event.pointerId === dragging.pointerId) {
        var deltaX = event.clientX - dragging.startX;
        var deltaY = event.clientY - dragging.startY;
        if (Math.hypot(deltaX, deltaY) > 6) dragging.moved = true;
        var steps = Math.trunc(deltaX / dragStepSize());
        if (frames.length > 1) setFrame(dragging.startIndex - steps, false);
        updateTilt(event.clientX, event.clientY, 8);
        event.preventDefault();
        return;
      }
      if (event.pointerType === "mouse") updateTilt(event.clientX, event.clientY, 3.5);
    }, { passive: false });

    function finishDrag(event) {
      if (!dragging || event.pointerId !== dragging.pointerId) return;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      dragging = null;
      stage.classList.remove("is-dragging");
      resetTilt();
      syncReactThumbnail();
    }

    stage.addEventListener("pointerup", finishDrag);
    stage.addEventListener("pointercancel", finishDrag);
    stage.addEventListener("pointerleave", function () {
      if (!dragging) resetTilt();
    });
    stage.addEventListener("dragstart", function (event) { event.preventDefault(); });

    stage.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        setAutoSpinning(false);
        setFrame(activeIndex - 1, true);
        syncReactThumbnail();
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        setAutoSpinning(false);
        setFrame(activeIndex + 1, true);
        syncReactThumbnail();
        event.preventDefault();
      } else if (event.key === " " || event.key === "Spacebar") {
        setAutoSpinning(!autoSpinning);
        event.preventDefault();
      } else if (event.key === "Home") {
        setAutoSpinning(false);
        setFrame(0, true);
        syncReactThumbnail();
        event.preventDefault();
      }
    });

    scrubber.addEventListener("input", function () {
      setAutoSpinning(false);
      setFrame(Number(scrubber.value), false);
    });
    scrubber.addEventListener("change", function () {
      syncReactThumbnail();
      status.textContent = "Product view " + (activeIndex + 1) + " of " + frames.length;
    });
    autoButton.addEventListener("click", function () { setAutoSpinning(!autoSpinning); });
    resetButton.addEventListener("click", function () {
      setAutoSpinning(false);
      setFrame(0, true);
      resetTilt();
      syncReactThumbnail();
    });
    fullscreenButton.addEventListener("click", function () {
      if (document.fullscreenElement === stage) {
        document.exitFullscreen();
      } else if (stage.requestFullscreen) {
        stage.requestFullscreen();
      }
    });
    document.addEventListener("fullscreenchange", function () {
      var active = document.fullscreenElement === stage;
      fullscreenButton.setAttribute("aria-pressed", String(active));
      fullscreenButton.setAttribute("aria-label", active ? "Exit full screen" : "Open full screen");
      fullscreenButton.title = active ? "Exit full screen" : "Open full screen";
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && autoSpinning) setAutoSpinning(false);
    });

    var controller = { refresh: refresh };
    controllers.set(stage, controller);
    refresh();
  }

  function scan() {
    scanQueued = false;
    document.querySelectorAll(".main-image").forEach(attachStage);
  }

  function scheduleScan() {
    if (scanQueued) return;
    scanQueued = true;
    window.requestAnimationFrame(scan);
  }

  var observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "class"]
  });
  scheduleScan();
})();
