(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var sections = document.querySelectorAll('.parallax-section');
  var ticking = false;

  function getSpeed(prop) {
    var val = getComputedStyle(document.documentElement).getPropertyValue(prop);
    return parseFloat(val) || 0;
  }

  function updateParallax() {
    var scrollY = window.scrollY;
    var speedBg = getSpeed('--parallax-speed-bg');
    var speedMid = getSpeed('--parallax-speed-mid');

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var sectionTop = rect.top + scrollY;
      var offset = scrollY - sectionTop;

      var bgLayer = section.querySelector('.parallax-layer--bg');
      var midLayer = section.querySelector('.parallax-layer--shapes');

      if (bgLayer) {
        bgLayer.style.transform = 'translate3d(0, ' + (offset * speedBg) + 'px, 0)';
      }
      if (midLayer) {
        midLayer.style.transform = 'translate3d(0, ' + (offset * speedMid) + 'px, 0)';
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
  updateParallax();
})();
