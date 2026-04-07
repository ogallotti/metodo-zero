(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var paths = document.querySelectorAll('.draw-path');

  // Initialize all paths
  paths.forEach(function (path) {
    var length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = reducedMotion ? 0 : length;
  });

  if (reducedMotion) return;

  var ticking = false;

  function update() {
    var viewH = window.innerHeight;

    paths.forEach(function (path) {
      var wrapper = path.closest('.svg-draw-wrapper');
      if (!wrapper) return;

      var rect = wrapper.getBoundingClientRect();
      var start = rect.top - viewH * 0.8;
      var end = rect.bottom - viewH * 0.3;
      var range = end - start;

      if (range <= 0) return;

      var progress = -start / range;
      progress = Math.max(0, Math.min(1, progress));

      var length = path.getTotalLength();
      path.style.strokeDashoffset = length * (1 - progress);
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
  update();
})();
