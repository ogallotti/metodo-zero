(function () {
  'use strict';

  var container = document.querySelector('.mt-container');
  if (!container) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var observer = new IntersectionObserver(function (entries) {
    var meteors = container.querySelectorAll('.mt-meteor');
    meteors.forEach(function (m) {
      m.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });

  observer.observe(container);
})();
