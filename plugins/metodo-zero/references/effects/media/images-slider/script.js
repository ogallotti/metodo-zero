(function () {
  'use strict';

  var slider = document.querySelector('.is-slider');
  if (!slider) return;

  var track = slider.querySelector('.is-track');
  var slides = slider.querySelectorAll('.is-slide');
  var prevBtn = slider.querySelector('.is-nav--prev');
  var nextBtn = slider.querySelector('.is-nav--next');
  var dotsContainer = document.querySelector('.is-dots');
  var captionEl = document.querySelector('.is-caption');
  var current = 0;
  var total = slides.length;
  var autoplayTimer = null;

  var config = { autoplay: 4000 };

  var captions = [];
  slides.forEach(function (s) {
    captions.push(s.getAttribute('data-caption') || '');
  });

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'is-dot' + (i === 0 ? ' is-dot--active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index));
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('.is-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('is-dot--active', i === current);
    });
  }

  function updateCaption() {
    if (captionEl && captions[current]) {
      captionEl.textContent = captions[current];
      captionEl.style.opacity = '1';
    } else if (captionEl) {
      captionEl.style.opacity = '0';
    }
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    updateDots();
    updateCaption();
    resetAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    if (config.autoplay > 0) {
      autoplayTimer = setInterval(next, config.autoplay);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  var startX = 0;
  var dragging = false;

  slider.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    if (!dragging) return;
    dragging = false;
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      resetAutoplay();
    } else {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
  }, { threshold: 0 });
  observer.observe(slider);

  window.__imagesSliderUpdate = function (key, value) {
    if (key in config) {
      config[key] = value;
      resetAutoplay();
    }
  };

  createDots();
  updateCaption();
  resetAutoplay();
})();
