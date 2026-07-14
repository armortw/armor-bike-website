(function () {
  "use strict";

  var DESIRED_ZOOM_SCALE = 2;
  var MIN_USEFUL_ZOOM_SCALE = 1.2;
  var lightboxApi = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function renderedImageRect(image) {
    var box = image.getBoundingClientRect();
    var naturalWidth = image.naturalWidth || box.width;
    var naturalHeight = image.naturalHeight || box.height;
    var imageRatio = naturalWidth / Math.max(naturalHeight, 1);
    var boxRatio = box.width / Math.max(box.height, 1);
    var width = box.width;
    var height = box.height;
    var left = box.left;
    var top = box.top;

    if (boxRatio > imageRatio) {
      width = height * imageRatio;
      left += (box.width - width) / 2;
    } else {
      height = width / imageRatio;
      top += (box.height - height) / 2;
    }

    return { left: left, top: top, width: width, height: height };
  }

  function safeBackgroundUrl(url) {
    return String(url || "").replace(/(["\\])/g, "\\$1");
  }

  function supportedZoomScale(image, imageRect) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return 0;
    var horizontalScale = image.naturalWidth / Math.max(imageRect.width, 1);
    var verticalScale = image.naturalHeight / Math.max(imageRect.height, 1);
    return Math.min(DESIRED_ZOOM_SCALE, horizontalScale, verticalScale);
  }

  function getLightbox() {
    if (lightboxApi) return lightboxApi;

    var overlay = document.createElement("div");
    overlay.className = "product-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "商品圖片完整預覽");
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<button class="product-lightbox-close" type="button" aria-label="關閉商品圖片預覽" title="關閉">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"></path><path d="M18 6L6 18"></path></svg>' +
      '</button>' +
      '<div class="product-lightbox-stage">' +
        '<img class="product-lightbox-image" alt="">' +
      '</div>';
    document.body.appendChild(overlay);

    var previewImage = overlay.querySelector(".product-lightbox-image");
    var closeButton = overlay.querySelector(".product-lightbox-close");
    var stage = overlay.querySelector(".product-lightbox-stage");
    var lastFocused = null;

    function open(sourceImage) {
      if (!sourceImage) return;
      var source = sourceImage.currentSrc || sourceImage.src;
      if (!source) return;

      lastFocused = document.activeElement;
      previewImage.src = source;
      previewImage.alt = sourceImage.alt || "商品完整圖片";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("product-lightbox-open");
      window.requestAnimationFrame(function () {
        closeButton.focus({ preventScroll: true });
      });
    }

    function close() {
      if (!overlay.classList.contains("is-open")) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("product-lightbox-open");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    }

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target === stage) close();
    });
    document.addEventListener("keydown", function (event) {
      if (!overlay.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.focus({ preventScroll: true });
      }
    });

    lightboxApi = { open: open, close: close, element: overlay };
    return lightboxApi;
  }

  function attachZoom(stage) {
    if (!stage || stage.dataset.zoomReady === "true") return;

    stage.dataset.zoomReady = "true";
    stage.classList.add("zoom-enabled");

    var lens = document.createElement("span");
    lens.className = "zoom-lens";
    lens.setAttribute("aria-hidden", "true");

    var button = document.createElement("button");
    button.className = "zoom-toggle";
    button.type = "button";
    button.title = "放大商品圖片";
    button.setAttribute("aria-label", "啟用商品圖片放大鏡");
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4.1-4.1"></path><path d="M11 8v6M8 11h6"></path></svg>';

    var status = document.createElement("span");
    status.className = "zoom-a11y-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    stage.appendChild(lens);
    stage.appendChild(button);
    stage.appendChild(status);

    var locked = false;
    var lastPoint = null;
    var dragStart = null;
    var dragMoved = false;

    function currentImage() {
      return stage.querySelector("img");
    }

    function updateControlLabels(canMagnify) {
      if (!canMagnify) {
        button.dataset.mode = "lightbox";
        button.title = "開啟完整商品圖片";
        button.setAttribute("aria-label", "開啟完整商品圖片");
        button.setAttribute("aria-pressed", "false");
        return;
      }

      button.dataset.mode = "magnifier";
      button.title = locked ? "關閉商品圖片放大鏡" : "放大商品圖片";
      button.setAttribute("aria-label", locked ? "關閉商品圖片放大鏡" : "啟用商品圖片放大鏡");
      button.setAttribute("aria-pressed", String(locked));
    }

    function setLocked(nextLocked) {
      locked = Boolean(nextLocked);
      stage.classList.toggle("is-zoom-locked", locked);
      updateControlLabels(stage.dataset.zoomQuality !== "low");
      status.textContent = locked ? "商品圖片放大鏡已啟用" : "商品圖片放大鏡已關閉";

      if (!locked) {
        stage.classList.remove("is-zooming");
        lastPoint = null;
      }
    }

    function measureQuality() {
      var image = currentImage();
      if (!image || !image.complete || !image.naturalWidth) return null;

      image.draggable = false;
      image.title = "點擊開啟完整商品圖片";
      var imageRect = renderedImageRect(image);
      var zoomScale = supportedZoomScale(image, imageRect);
      var canMagnify = zoomScale >= MIN_USEFUL_ZOOM_SCALE;

      stage.dataset.zoomScale = zoomScale.toFixed(2);
      stage.dataset.zoomQuality = canMagnify ? (zoomScale < DESIRED_ZOOM_SCALE ? "limited" : "full") : "low";
      stage.classList.toggle("is-low-resolution", !canMagnify);
      if (!canMagnify && locked) setLocked(false);
      updateControlLabels(canMagnify);
      return { image: image, rect: imageRect, scale: zoomScale, canMagnify: canMagnify };
    }

    function updateLens(clientX, clientY, allowClamp) {
      var quality = measureQuality();
      if (!quality || !quality.canMagnify) {
        stage.classList.remove("is-zooming");
        lens.style.backgroundImage = "none";
        return false;
      }

      var imageRect = quality.rect;
      var stageRect = stage.getBoundingClientRect();
      var outside =
        clientX < imageRect.left ||
        clientX > imageRect.left + imageRect.width ||
        clientY < imageRect.top ||
        clientY > imageRect.top + imageRect.height;

      if (outside && !allowClamp) {
        stage.classList.remove("is-zooming");
        return false;
      }

      var x = clamp((clientX - imageRect.left) / Math.max(imageRect.width, 1), 0, 1);
      var y = clamp((clientY - imageRect.top) / Math.max(imageRect.height, 1), 0, 1);
      var lensSize = lens.getBoundingClientRect().width || 240;
      var lensRadius = lensSize / 2 + 5;
      var maxLensX = Math.max(lensRadius, stageRect.width - lensRadius);
      var maxLensY = Math.max(lensRadius, stageRect.height - lensRadius);
      var lensX = clamp(clientX - stageRect.left, Math.min(lensRadius, stageRect.width / 2), maxLensX);
      var lensY = clamp(clientY - stageRect.top, Math.min(lensRadius, stageRect.height / 2), maxLensY);
      var zoomWidth = imageRect.width * quality.scale;
      var zoomHeight = imageRect.height * quality.scale;
      var source = quality.image.currentSrc || quality.image.src;

      lens.style.left = lensX + "px";
      lens.style.top = lensY + "px";
      lens.style.backgroundImage = 'url("' + safeBackgroundUrl(source) + '")';
      lens.style.backgroundSize = zoomWidth + "px " + zoomHeight + "px";
      lens.style.backgroundPosition =
        lensSize / 2 - x * zoomWidth + "px " +
        (lensSize / 2 - y * zoomHeight) + "px";
      stage.classList.add("is-zooming");
      lastPoint = { x: clientX, y: clientY };
      return true;
    }

    stage.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse") updateLens(event.clientX, event.clientY, false);
    });

    stage.addEventListener("pointermove", function (event) {
      if (dragStart && event.pointerId === dragStart.pointerId) {
        var distanceX = event.clientX - dragStart.x;
        var distanceY = event.clientY - dragStart.y;
        if (Math.hypot(distanceX, distanceY) > 8) dragMoved = true;
      }

      if (event.pointerType === "mouse") {
        updateLens(event.clientX, event.clientY, locked);
        return;
      }

      if (locked) {
        event.preventDefault();
        updateLens(event.clientX, event.clientY, true);
      }
    }, { passive: false });

    stage.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse" && !locked) stage.classList.remove("is-zooming");
    });

    stage.addEventListener("pointerdown", function (event) {
      if (event.target.closest && event.target.closest(".zoom-toggle")) return;

      if (event.target.matches && event.target.matches(".main-image > img")) {
        dragStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
        dragMoved = false;
      }

      if (event.pointerType !== "mouse" && locked) {
        event.preventDefault();
        updateLens(event.clientX, event.clientY, true);
      }
    });

    function finishPointer(event) {
      if (!dragStart || event.pointerId !== dragStart.pointerId) return;
      window.setTimeout(function () {
        dragStart = null;
        dragMoved = false;
      }, 0);
    }

    stage.addEventListener("pointerup", finishPointer);
    stage.addEventListener("pointercancel", finishPointer);
    stage.addEventListener("dragstart", function (event) {
      if (event.target.matches && event.target.matches(".main-image > img")) event.preventDefault();
    });

    stage.addEventListener("click", function (event) {
      if (!event.target.matches || !event.target.matches(".main-image > img")) return;
      event.preventDefault();
      if (dragMoved) return;
      setLocked(false);
      getLightbox().open(event.target);
    });

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var quality = measureQuality();
      if (!quality) return;

      if (!quality.canMagnify) {
        setLocked(false);
        getLightbox().open(quality.image);
        return;
      }

      setLocked(!locked);
      if (locked) {
        updateLens(quality.rect.left + quality.rect.width / 2, quality.rect.top + quality.rect.height / 2, true);
      }
    });

    stage.addEventListener("load", function (event) {
      if (!event.target.matches || !event.target.matches(".main-image > img")) return;
      stage.classList.remove("is-zooming");
      lastPoint = null;
      var quality = measureQuality();

      if (locked && quality && quality.canMagnify) {
        window.requestAnimationFrame(function () {
          updateLens(quality.rect.left + quality.rect.width / 2, quality.rect.top + quality.rect.height / 2, true);
        });
      }
    }, true);

    window.addEventListener("resize", function () {
      var quality = measureQuality();
      if (lastPoint && locked && quality && quality.canMagnify) {
        updateLens(lastPoint.x, lastPoint.y, true);
      } else {
        stage.classList.remove("is-zooming");
      }
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && locked) setLocked(false);
    });

    window.requestAnimationFrame(measureQuality);
  }

  function scan() {
    document.querySelectorAll(".main-image").forEach(attachZoom);
  }

  var observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
