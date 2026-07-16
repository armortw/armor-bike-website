(function () {
  "use strict";

  var DESIRED_ZOOM_SCALE = 2;
  var LIGHTBOX_ZOOM_LEVELS = [1, 1.25, 1.5, 2];
  var LIGHTBOX_FALLBACK_MAX_SCALE = 1.25;
  var LIGHTBOX_MAX_SCALE = 2;
  var MIN_USEFUL_ZOOM_SCALE = 1.2;
  var DRAG_THRESHOLD = 5;
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
      '<div class="product-lightbox-stage">' +
        '<div class="product-lightbox-view">' +
          '<div class="product-lightbox-canvas" role="button" tabindex="0" aria-label="商品圖片完整顯示；點一下關閉預覽">' +
            '<img class="product-lightbox-image" alt="">' +
          '</div>' +
        '</div>' +
        '<aside class="product-lightbox-rail" aria-label="商品圖片工具列">' +
          '<div class="product-lightbox-rail-header">' +
            '<button class="product-lightbox-close" type="button" aria-label="關閉商品圖片預覽" title="關閉">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"></path><path d="M18 6L6 18"></path></svg>' +
            '</button>' +
          '</div>' +
          '<div class="product-lightbox-thumbs" aria-label="其他商品圖片"></div>' +
          '<div class="product-lightbox-controls" aria-label="圖片縮放控制">' +
            '<output class="product-lightbox-zoom-value" aria-live="polite">100%</output>' +
            '<button class="product-lightbox-control product-lightbox-zoom-out" type="button" aria-label="縮小商品圖片" title="縮小">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path></svg>' +
            '</button>' +
            '<button class="product-lightbox-control product-lightbox-zoom-in" type="button" aria-label="放大商品圖片" title="放大">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>' +
            '</button>' +
            '<button class="product-lightbox-control product-lightbox-fit" type="button" aria-label="還原完整商品圖片" title="還原完整圖片">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5"></path><path d="M16 3h5v5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path></svg>' +
            '</button>' +
          '</div>' +
        '</aside>' +
      '</div>';
    document.body.appendChild(overlay);

    var previewImage = overlay.querySelector(".product-lightbox-image");
    var closeButton = overlay.querySelector(".product-lightbox-close");
    var stage = overlay.querySelector(".product-lightbox-stage");
    var canvas = overlay.querySelector(".product-lightbox-canvas");
    var thumbnailRail = overlay.querySelector(".product-lightbox-thumbs");
    var zoomOutButton = overlay.querySelector(".product-lightbox-zoom-out");
    var zoomInButton = overlay.querySelector(".product-lightbox-zoom-in");
    var fitButton = overlay.querySelector(".product-lightbox-fit");
    var zoomValue = overlay.querySelector(".product-lightbox-zoom-value");
    var lastFocused = null;
    var galleryItems = [];
    var activeIndex = 0;
    var currentScale = 1;
    var pan = { x: 0, y: 0 };
    var dragState = null;
    var suppressCloseClick = false;

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

    function resetZoomState() {
      currentScale = 1;
      pan.x = 0;
      pan.y = 0;
      canvas.classList.remove("is-zoomed", "is-dragging");
      previewImage.style.setProperty("--lightbox-pan-x", "0px");
      previewImage.style.setProperty("--lightbox-pan-y", "0px");
      previewImage.style.setProperty("--lightbox-zoom-scale", "1");
      canvas.dataset.zoomScale = "1.00";
      zoomValue.value = "100%";
      zoomValue.textContent = "100%";
      zoomOutButton.disabled = true;
      fitButton.disabled = true;
      canvas.setAttribute("aria-label", "商品圖片完整顯示；使用右側加號放大，點一下關閉預覽");
    }

    function measureImage() {
      if (!previewImage.complete || !previewImage.naturalWidth) return null;
      var imageRect = containedImageRect(canvas, previewImage);
      var canvasRect = canvas.getBoundingClientRect();
      var nativeScale = supportedZoomScale(previewImage, imageRect, LIGHTBOX_MAX_SCALE);
      var maxScale = Math.min(
        LIGHTBOX_MAX_SCALE,
        Math.max(LIGHTBOX_FALLBACK_MAX_SCALE, nativeScale || 1)
      );
      return {
        imageRect: imageRect,
        canvasRect: canvasRect,
        nativeScale: nativeScale,
        maxScale: maxScale,
        maxPanX: Math.max(0, (imageRect.width * currentScale - canvasRect.width) / 2),
        maxPanY: Math.max(0, (imageRect.height * currentScale - canvasRect.height) / 2)
      };
    }

    function availableZoomLevels(metrics) {
      var quality = metrics || measureImage();
      if (!quality) return [1];
      var levels = LIGHTBOX_ZOOM_LEVELS.filter(function (level) {
        return level <= quality.maxScale + 0.01;
      });
      if (levels[levels.length - 1] < quality.maxScale - 0.08) {
        levels.push(Number(quality.maxScale.toFixed(2)));
      }
      return levels;
    }

    function applyTransform() {
      var metrics = measureImage();
      if (!metrics) return;
      var levels = availableZoomLevels(metrics);
      currentScale = clamp(currentScale, 1, levels[levels.length - 1]);
      metrics.maxPanX = Math.max(0, (metrics.imageRect.width * currentScale - metrics.canvasRect.width) / 2);
      metrics.maxPanY = Math.max(0, (metrics.imageRect.height * currentScale - metrics.canvasRect.height) / 2);
      pan.x = clamp(pan.x, -metrics.maxPanX, metrics.maxPanX);
      pan.y = clamp(pan.y, -metrics.maxPanY, metrics.maxPanY);

      var isZoomed = currentScale > 1.01;
      canvas.classList.toggle("is-zoomed", isZoomed);
      canvas.dataset.zoomScale = currentScale.toFixed(2);
      canvas.dataset.nativeZoomScale = metrics.nativeScale.toFixed(2);
      canvas.dataset.maxZoomScale = metrics.maxScale.toFixed(2);
      previewImage.style.setProperty("--lightbox-pan-x", pan.x.toFixed(2) + "px");
      previewImage.style.setProperty("--lightbox-pan-y", pan.y.toFixed(2) + "px");
      previewImage.style.setProperty("--lightbox-zoom-scale", currentScale.toFixed(2));

      var percentage = Math.round(currentScale * 100) + "%";
      zoomValue.value = percentage;
      zoomValue.textContent = percentage;
      zoomOutButton.disabled = !isZoomed;
      zoomInButton.disabled = currentScale >= levels[levels.length - 1] - 0.01;
      fitButton.disabled = !isZoomed && Math.abs(pan.x) < 0.5 && Math.abs(pan.y) < 0.5;
      canvas.setAttribute(
        "aria-label",
        isZoomed
          ? "商品圖片已放大至 " + percentage + "；可拖曳查看細節，點一下關閉預覽"
          : "商品圖片完整顯示；使用右側加號放大，點一下關閉預覽"
      );
    }

    function setZoom(nextScale) {
      finishDrag();
      currentScale = nextScale;
      pan.x = 0;
      pan.y = 0;
      applyTransform();
    }

    function changeZoom(direction) {
      var levels = availableZoomLevels();
      var target = currentScale;
      if (direction > 0) {
        for (var i = 0; i < levels.length; i += 1) {
          if (levels[i] > currentScale + 0.01) {
            target = levels[i];
            break;
          }
        }
      } else {
        for (var j = levels.length - 1; j >= 0; j -= 1) {
          if (levels[j] < currentScale - 0.01) {
            target = levels[j];
            break;
          }
        }
      }
      setZoom(target);
    }

    function updateDragPan(clientX, clientY) {
      if (!dragState) return;
      pan.x = dragState.startPanX + clientX - dragState.startX;
      pan.y = dragState.startPanY + clientY - dragState.startY;
      if (Math.hypot(clientX - dragState.startX, clientY - dragState.startY) >= DRAG_THRESHOLD) {
        dragState.moved = true;
      }
      applyTransform();
    }

    function finishDrag(event) {
      if (!dragState) return;
      if (event && Number.isFinite(event.pointerId) && event.pointerId !== dragState.pointerId) return;
      var pointerId = dragState.pointerId;
      var moved = dragState.moved;
      dragState = null;
      canvas.classList.remove("is-dragging");
      if (canvas.hasPointerCapture && canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
      if (moved) {
        suppressCloseClick = true;
        window.setTimeout(function () { suppressCloseClick = false; }, 0);
      }
    }

    function showImage(index, focusThumbnail) {
      if (!galleryItems.length) return;
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      finishDrag();
      resetZoomState();
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
      finishDrag();
      suppressCloseClick = false;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("product-lightbox-open");
      document.body.classList.remove("product-lightbox-open");
      resetZoomState();
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    }

    closeButton.addEventListener("click", close);
    zoomOutButton.addEventListener("click", function () { changeZoom(-1); });
    zoomInButton.addEventListener("click", function () { changeZoom(1); });
    fitButton.addEventListener("click", function () { setZoom(1); });

    canvas.addEventListener("pointermove", function (event) {
      if (dragState && event.pointerId === dragState.pointerId) {
        event.preventDefault();
        updateDragPan(event.clientX, event.clientY);
      }
    }, { passive: false });
    canvas.addEventListener("pointerdown", function (event) {
      if (event.button !== 0 || currentScale <= 1.01) return;
      event.preventDefault();
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        moved: false
      };
      canvas.classList.add("is-dragging");
      if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointerup", finishDrag);
    canvas.addEventListener("pointercancel", finishDrag);
    canvas.addEventListener("lostpointercapture", finishDrag);
    window.addEventListener("pointerup", finishDrag, true);
    window.addEventListener("pointercancel", finishDrag, true);
    canvas.addEventListener("click", function (event) {
      if (suppressCloseClick) {
        suppressCloseClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      close();
    });
    canvas.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        close();
      }
    });
    previewImage.addEventListener("load", function () {
      previewImage.draggable = false;
      resetZoomState();
      applyTransform();
    });
    window.addEventListener("resize", function () {
      if (overlay.classList.contains("is-open")) applyTransform();
    }, { passive: true });
    window.addEventListener("blur", finishDrag);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", function (event) {
      if (!overlay.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft" && galleryItems.length > 1) showImage(activeIndex - 1, true);
      if (event.key === "ArrowRight" && galleryItems.length > 1) showImage(activeIndex + 1, true);
      if (event.key === "+" || event.key === "=") changeZoom(1);
      if (event.key === "-") changeZoom(-1);
      if (event.key === "0") setZoom(1);
      if (event.key === "Tab") {
        var focusable = [closeButton, canvas]
          .concat(Array.from(thumbnailRail.querySelectorAll(".product-lightbox-thumb")))
          .concat([zoomOutButton, zoomInButton, fitButton])
          .filter(function (element) {
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
