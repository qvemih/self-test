(function () {
  var groups = document.querySelectorAll(".report-group");

  function createButton(label, className) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.textContent = className.indexOf("prev") > -1 ? "‹" : "›";
    return button;
  }

  function nearestIndex(track) {
    var figures = Array.prototype.slice.call(track.querySelectorAll(".report-figure"));
    if (!figures.length) return 0;
    var left = track.scrollLeft;
    var bestIndex = 0;
    var bestDistance = Infinity;
    figures.forEach(function (figure, index) {
      var distance = Math.abs(figure.offsetLeft - left);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function scrollToIndex(track, index) {
    var figures = track.querySelectorAll(".report-figure");
    var target = figures[index];
    if (!target) return;
    track.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth"
    });
  }

  function buildLightbox() {
    var lightbox = document.createElement("div");
    lightbox.className = "report-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = [
      '<button type="button" class="report-lightbox-close" aria-label="关闭放大图片">×</button>',
      '<img src="" alt="">'
    ].join("");
    document.body.appendChild(lightbox);

    var image = lightbox.querySelector("img");
    var close = lightbox.querySelector("button");

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      image.removeAttribute("src");
      image.alt = "";
      document.body.classList.remove("report-lightbox-open");
    }

    close.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });

    return function openLightbox(source) {
      image.src = source.currentSrc || source.src;
      image.alt = source.alt || "检测报告放大图";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("report-lightbox-open");
      close.focus();
    };
  }

  var openLightbox = buildLightbox();

  groups.forEach(function (group, groupIndex) {
    var track = group.querySelector(".report-image-grid");
    if (!track) return;

    var figures = Array.prototype.slice.call(track.querySelectorAll(".report-figure"));
    if (!figures.length) return;

    var carousel = document.createElement("div");
    carousel.className = "report-carousel";
    track.parentNode.insertBefore(carousel, track);
    carousel.appendChild(track);

    var prev = createButton("上一张检测报告", "report-carousel-arrow report-carousel-prev");
    var next = createButton("下一张检测报告", "report-carousel-arrow report-carousel-next");
    carousel.appendChild(prev);
    carousel.appendChild(next);

    var dots = document.createElement("div");
    dots.className = "report-carousel-dots";
    carousel.appendChild(dots);

    figures.forEach(function (figure, index) {
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", "放大查看" + (figure.querySelector("img").alt || "检测报告"));

      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "report-carousel-dot";
      dot.setAttribute("aria-label", "查看第 " + (index + 1) + " 张检测报告");
      dot.addEventListener("click", function () {
        scrollToIndex(track, index);
      });
      dots.appendChild(dot);

      figure.addEventListener("click", function () {
        openLightbox(figure.querySelector("img"));
      });
      figure.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(figure.querySelector("img"));
        }
      });
    });

    function updateDots() {
      var index = nearestIndex(track);
      Array.prototype.forEach.call(dots.children, function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    prev.addEventListener("click", function () {
      scrollToIndex(track, Math.max(0, nearestIndex(track) - 1));
    });

    next.addEventListener("click", function () {
      scrollToIndex(track, Math.min(figures.length - 1, nearestIndex(track) + 1));
    });

    track.addEventListener("scroll", function () {
      window.clearTimeout(track.reportScrollTimer);
      track.reportScrollTimer = window.setTimeout(updateDots, 80);
    });

    group.dataset.carouselIndex = String(groupIndex + 1);
    updateDots();
  });
})();
