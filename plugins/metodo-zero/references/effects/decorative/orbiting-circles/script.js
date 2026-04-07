(function () {
  'use strict';

  var stage = document.querySelector('.oc-stage');
  if (!stage) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var observer = new IntersectionObserver(function (entries) {
    var dots = stage.querySelectorAll('.oc-dot');
    dots.forEach(function (d) {
      d.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });

  observer.observe(stage);
})();
