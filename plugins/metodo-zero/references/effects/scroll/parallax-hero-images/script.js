(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var hero = document.querySelector('.phero');
  var layers = document.querySelectorAll('.phero-layer');
  if (!hero || !layers.length) return;

  var ticking = false;

  function getSpeed(index) {
    var prop = '--hero-speed-' + (index + 1);
    var val = getComputedStyle(document.documentElement).getPropertyValue(prop);
    return parseFloat(val) || 0;
  }

  function update() {
    var scrollY = window.scrollY;
    var heroRect = hero.getBoundingClientRect();
    var heroTop = heroRect.top + scrollY;
    var offset = scrollY - heroTop;

    layers.forEach(function (layer, i) {
      var speed = getSpeed(i);
      layer.style.transform = 'translate3d(0, ' + (offset * speed) + 'px, 0)';
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();
