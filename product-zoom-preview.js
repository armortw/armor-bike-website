(function () {
  "use strict";

  var DESIRED_ZOOM_SCALE = 2;
  var LIGHTBOX_DESIRED_ZOOM_SCALE = 3.25;
  var LIGHTBOX_FALLBACK_ZOOM_SCALE = 2;
  var MIN_USEFUL_ZOOM_SCALE = 1.2;
  var PAN_EDGE_SNAP_MIN = 28;
  var PAN_EDGE_SNAP_MAX = 56;
  var lightboxApi = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function edgeSnappedProgress(position, start, length) {
    var safeLength = Math.max(length, 1);
    var edgeInset = clamp(safeLength * 0.045, PAN_EDGE_SNAP_MIN, PAN_EDGE_SNAP_MAX);
    edgeInset = Math.min(edgeInset, safeLength / 3);
    var relative = clamp(position - start, 0, safeLength);
    if (relative <= edgeInset) return 0;
    if (relative >= safeLength - edgeInset) return 1;
    return (relative - edgeInset) / Math.max(safeLength - edgeInset * 2, 1);
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

  function containedImageRect(container, image) {
    var box = container.getBoundingClientRect();
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

  function supportedZoomScale(image, imageRect, desiredScale) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return 0;
    var horizontalScale = image.naturalWidth / Math.max(imageRect.width, 1);
    var verticalScale = image.naturalHeight / Math.max(imageRect.height, 1);
    return Math.min(desiredScale || DESIRED_ZOOM_SCALE, horizontalScale, verticalScale);
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
        '<div class="product-lightbox-view">' +
          '<img class="product-lightbox-image" alt="">' +
          '<button class="product-lightbox-zoom-toggle" type="button" aria-label="啟用大圖移動放大" aria-pressed="false" title="移動放大">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4.1-4.1"></path><path d="M11 8v6M8 11h6"></path></svg>' +
          '</button>' +
        '</div>' +
        '<aside class="product-lightbox-thumbs" aria-label="其他商品圖片"></aside>' +
      '</div>';
    document.body.appendChild(overlay);

    var previewImage = overlay.querySelector(".product-lightbox-image");
    var closeButton = overlay.querySelector(".product-lightbox-close");
    var stage = overlay.querySelector(".product-lightbox-stage");
    var view = overlay.querySelector(".product-lightbox-view");
    var zoomButton = overlay.querySelector(".product-lightbox-zoom-toggle");
    var thumbnailRail = overlay.querySelector(".product-lightbox-thumbs");
    var lastFocused = null;
    var galleryItems = [];
    var activeIndex = 0;
    var zoomLocked = false;
    var lastPointer = null;

    function absoluteImageUrl(image) {
      if (!image) return "";
      return image.currentSrc || image.src || image.getAttribute("src") || "";
    }

    function collectGallery(sourceImage) {
      var items = [];
      var seen = new Set();
      var fallbackAlt = sourceImage.alt || "商品圖片";

      function append(image, index) {
        var url = absoluteImageUrl(image);
        if (!url || seen.has(url)) return;
        seen.add(url);
        items.push({ url: url, alt: image.alt || fallbackAlt + " " + (index + 1) });
      }

      document.querySelectorAll(".thumb img").forEach(append);
      append(sourceImage, items.length);
      return items;
    }

    function updateThumbnailState(focusActive) {
      thumbnailRail.querySelectorAll(".product-lightbox-thumb").forEach(function (button, index) {
        var isActive = index === activeIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
        if (isActive && focusActive) button.focus({ preventScroll: true });
      });
    }

    function renderThumbnails() {
      thumbnailRail.replaceChildren();
      galleryItems.forEach(function (item, index) {
        var button = document.createElement("button");
        var image = document.createElement("img");
        button.className = "product-lightbox-thumb";
        button.type = "button";
        button.setAttribute("aria-label", "顯示商品圖片 " + (index + 1));
        button.setAttribute("aria-pressed", "false");
        image.src = item.url;
        image.alt = "";
        image.loading = "lazy";
        image.draggable = false;
        button.appendChild(image);
        button.addEventListener("click", function () {
          showImage(index, true);
        });
        thumbnailRail.appendChild(button);
      });
      stage.classList.toggle("is-single-image", galleryItems.length <= 1);
    }

    function updateZoomControl(canMagnify) {
      zoomButton.disabled = !canMagnify;
      zoomButton.setAttribute("aria-pressed", String(canMagnify && zoomLocked));
      zoomButton.setAttribute("aria-label", zoomLocked ? "關閉大圖移動放大" : "啟用大圖移動放大");
      zoomButton.title = canMagnify ? (zoomLocked ? "關閉移動放大" : "移動放大") : "原圖解析度不足";
    }

    function resetPan() {
      lastPointer = null;
      previewImage.style.setProperty("--lightbox-pan-x", "0px");
      previewImage.style.setProperty("--lightbox-pan-y", "0px");
    }

    function setZoomLocked(nextLocked) {
      zoomLocked = Boolean(nextLocked) && !zoomButton.disabled;
      view.classList.toggle("is-zoom-locked", zoomLocked);
      view.classList.toggle("is-zooming", zoomLocked);
      updateZoomControl(!zoomButton.disabled);
      if (!zoomLocked) {
        resetPan();
      }
    }

    function measureZoomQuality() {
      if (!previewImage.complete || !previewImage.naturalWidth) return null;
      var imageRect = containedImageRect(view, previewImage);
      var nativeScale = supportedZoomScale(previewImage, imageRect, LIGHTBOX_DESIRED_ZOOM_SCALE);
      var hasNativeDetail = nativeScale >= MIN_USEFUL_ZOOM_SCALE;
      var scale = hasNativeDetail ? nativeScale : LIGHTBOX_FALLBACK_ZOOM_SCALE;
      var canMagnify = scale > 1;
      view.dataset.zoomScale = scale.toFixed(2);
      view.dataset.nativeZoomScale = nativeScale.toFixed(2);
      view.dataset.zoomQuality = hasNativeDetail ? (scale < LIGHTBOX_DESIRED_ZOOM_SCALE ? "limited" : "full") : "upscaled";
      view.style.setProperty("--lightbox-zoom-scale", canMagnify ? scale.toFixed(3) : "1");
      if (!canMagnify && zoomLocked) setZoomLocked(false);
      updateZoomControl(canMagnify);
      return { rect: imageRect, scale: scale, nativeScale: nativeScale, canMagnify: canMagnify };
    }

    function updatePan(clientX, clientY, allowClamp) {
      var quality = measureZoomQuality();
      if (!quality || !quality.canMagnify) {
        view.classList.remove("is-zooming");
        return false;
      }

      var imageRect = quality.rect;
      var viewRect = view.getBoundingClientRect();
      var outside =
        clientX < imageRect.left ||
        clientX > imageRect.left + imageRect.width ||
        clientY < imageRect.top ||
        clientY > imageRect.top + imageRect.height;
      if (outside && !allowClamp) {
        view.classList.remove("is-zooming");
        return false;
      }

      var progressX = edgeSnappedProgress(clientX, viewRect.left, viewRect.width);
      var progressY = edgeSnappedProgress(clientY, viewRect.top, viewRect.height);
      var maxPanX = Math.max(0, (imageRect.width * quality.scale - viewRect.width) / 2);
      var maxPanY = Math.max(0, (imageRect.height * quality.scale - viewRect.height) / 2);
      var panX = maxPanX * (1 - progressX * 2);
      var panY = maxPanY * (1 - progressY * 2);
      previewImage.style.setProperty("--lightbox-pan-x", panX.toFixed(2) + "px");
      previewImage.style.setProperty("--lightbox-pan-y", panY.toFixed(2) + "px");
      view.classList.add("is-zooming");
      lastPointer = { x: clientX, y: clientY };
      return true;
    }

    function showImage(index, focusThumbnail) {
      if (!galleryItems.length) return;
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      resetPan();
      view.classList.toggle("is-zooming", zoomLocked);
      previewImage.src = galleryItems[activeIndex].url;
      previewImage.alt = galleryItems[activeIndex].alt;
      updateThumbnailState(focusThumbnail);
    }

    function open(sourceImage) {
      if (!sourceImage) return;
      var source = sourceImage.currentSrc || sourceImage.src;
      if (!source) return;

      lastFocused = document.activeElement;
      galleryItems = collectGallery(sourceImage);
      activeIndex = Math.max(0, galleryItems.findIndex(function (item) { return item.url === source; }));
      renderThumbnails();
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("product-lightbox-open");
      document.body.classList.add("product-lightbox-open");
      showImage(activeIndex, false);
      window.requestAnimationFrame(function () {
        closeButton.focus({ preventScroll: true });
      });
    }

    function close() {
      if (!overlay.classList.contains("is-open")) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("product-lightbox-open");
      document.body.classList.remove("product-lightbox-open");
      setZoomLocked(false);
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    }

    closeButton.addEventListener("click", close);
    zoomButton.addEventListener("click", function (event) {
      event.stopPropagation();
      var quality = measureZoomQuality();
      if (!quality || !quality.canMagnify) return;
      setZoomLocked(!zoomLocked);
      if (zoomLocked) {
        updatePan(quality.rect.left + quality.rect.width / 2, quality.rect.top + quality.rect.height / 2, true);
      }
    });

    view.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse" && updatePan(event.clientX, event.clientY, zoomLocked)) {
        setZoomLocked(true);
      }
    });
    view.addEventListener("pointermove", function (event) {
      if (event.pointerType === "mouse") {
        if (updatePan(event.clientX, event.clientY, zoomLocked)) setZoomLocked(true);
        return;
      }
      if (zoomLocked) {
        event.preventDefault();
        updatePan(event.clientX, event.clientY, true);
      }
    }, { passive: false });
    view.addEventListener("pointerdown", function (event) {
      if (event.target.closest && event.target.closest(".product-lightbox-zoom-toggle")) return;
      if (event.pointerType !== "mouse" && zoomLocked) {
        updatePan(event.clientX, event.clientY, true);
      }
    });
    view.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest(".product-lightbox-zoom-toggle")) return;
      close();
    });
    previewImage.addEventListener("load", function () {
      previewImage.draggable = false;
      var quality = measureZoomQuality();
      if (zoomLocked && quality && quality.canMagnify) {
        var target = lastPointer || {
          x: quality.rect.left + quality.rect.width / 2,
          y: quality.rect.top + quality.rect.height / 2
        };
        updatePan(target.x, target.y, true);
      }
    });
    window.addEventListener("resize", function () {
      var quality = measureZoomQuality();
      if (zoomLocked && lastPointer && quality && quality.canMagnify) {
        updatePan(lastPointer.x, lastPointer.y, true);
      } else if (!zoomLocked) {
        view.classList.remove("is-zooming");
      }
    }, { passive: true });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", function (event) {
      if (!overlay.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft" && galleryItems.length > 1) showImage(activeIndex - 1, true);
      if (event.key === "ArrowRight" && galleryItems.length > 1) showImage(activeIndex + 1, true);
      if (event.key === "Tab") {
        var focusable = [closeButton, zoomButton].concat(Array.from(thumbnailRail.querySelectorAll(".product-lightbox-thumb"))).filter(function (element) {
          return !element.disabled;
        });
        var currentIndex = focusable.indexOf(document.activeElement);
        var nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex < 0) nextIndex = focusable.length - 1;
        if (nextIndex >= focusable.length) nextIndex = 0;
        event.preventDefault();
        focusable[nextIndex].focus({ preventScroll: true });
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
