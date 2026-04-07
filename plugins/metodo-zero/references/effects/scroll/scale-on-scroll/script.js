(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var elements = document.querySelectorAll('.scale-element');
  var ticking = false;

  function getVar(name) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function update() {
    var viewH = window.innerHeight;
    var scaleMin = getVar('--scale-min') || 0.7;
    var scaleMax = getVar('--scale-max') || 1.1;

    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var viewCenter = viewH / 2;

      // 0 = element at center of viewport, 1 = far away
      var distance = Math.abs(center - viewCenter) / (viewH * 0.6);
      distance = Math.min(1, distance);

      // Scale: max at center, min at edges
      var scale = lerp(scaleMax, scaleMin, distance);
      var opacity = lerp(1, 0.4, distance);

      el.style.transform = 'scale(' + scale.toFixed(3) + ')';
      el.style.opacity = opacity.toFixed(3);
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
