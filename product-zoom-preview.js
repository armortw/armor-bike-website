(function () {
  "use strict";

  var ZOOM_SCALE = 2.65;

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

    function currentImage() {
      return stage.querySelector("img");
    }

    function setLocked(nextLocked) {
      locked = nextLocked;
      button.setAttribute("aria-pressed", String(locked));
      button.setAttribute("aria-label", locked ? "關閉商品圖片放大鏡" : "啟用商品圖片放大鏡");
      button.title = locked ? "關閉商品圖片放大鏡" : "放大商品圖片";
      stage.classList.toggle("is-zoom-locked", locked);
      status.textContent = locked ? "商品圖片放大鏡已啟用" : "商品圖片放大鏡已關閉";

      if (!locked) {
        stage.classList.remove("is-zooming");
        lastPoint = null;
      }
    }

    function updateLens(clientX, clientY, allowClamp) {
      var image = currentImage();
      if (!image || !image.complete || !image.naturalWidth) return false;

      var imageRect = renderedImageRect(image);
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
      var lensSize = lens.getBoundingClientRect().width || 180;
      var lensX = clamp(clientX - stageRect.left, lensSize / 2 + 5, stageRect.width - lensSize / 2 - 5);
      var lensY = clamp(clientY - stageRect.top, lensSize / 2 + 5, stageRect.height - lensSize / 2 - 5);
      var zoomWidth = imageRect.width * ZOOM_SCALE;
      var zoomHeight = imageRect.height * ZOOM_SCALE;
      var source = image.currentSrc || image.src;

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
      if (event.pointerType === "mouse") {
        updateLens(event.clientX, event.clientY, false);
      }
    });

    stage.addEventListener("pointermove", function (event) {
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
      if (event.pointerType === "mouse" && !locked) {
        stage.classList.remove("is-zooming");
      }
    });

    stage.addEventListener("pointerdown", function (event) {
      if (event.target.closest && event.target.closest(".zoom-toggle")) return;

      if (event.pointerType !== "mouse" && locked) {
        event.preventDefault();
        updateLens(event.clientX, event.clientY, true);
      }
    });

    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setLocked(!locked);

      if (locked) {
        var image = currentImage();
        var rect = image ? renderedImageRect(image) : stage.getBoundingClientRect();
        updateLens(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      }
    });

    stage.addEventListener("load", function (event) {
      if (!event.target.matches || !event.target.matches(".main-image > img")) return;
      stage.classList.remove("is-zooming");
      lastPoint = null;

      if (locked) {
        window.requestAnimationFrame(function () {
          var image = currentImage();
          if (!image) return;
          var rect = renderedImageRect(image);
          updateLens(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
        });
      }
    }, true);

    window.addEventListener("resize", function () {
      if (lastPoint && locked) {
        updateLens(lastPoint.x, lastPoint.y, true);
      } else {
        stage.classList.remove("is-zooming");
      }
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && locked) setLocked(false);
    });
  }

  function scan() {
    document.querySelectorAll(".main-image").forEach(attachZoom);
  }

  var observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();