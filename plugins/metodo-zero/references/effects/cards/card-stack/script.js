(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var containers = document.querySelectorAll('.stack-container[data-scroll-trigger]');

  if (!containers.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('stack--fanned');
          } else {
            entry.target.classList.remove('stack--fanned');
          }
        });
      },
      { threshold: 0.5 }
    );

    containers.forEach(function (c) {
      observer.observe(c);
    });
  }
})();
