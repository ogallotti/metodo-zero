(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    document.querySelectorAll('.stagger-item').forEach(function (item) {
      item.classList.add('revealed');
    });
    return;
  }

  var stagger = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-stagger')) || 100;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var grid = entry.target;
      var items = grid.querySelectorAll('.stagger-item:not(.revealed)');

      items.forEach(function (item, i) {
        item.style.transitionDelay = (i * stagger) + 'ms';
        item.classList.add('revealed');
      });

      observer.unobserve(grid);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.stagger-grid').forEach(function (grid) {
    observer.observe(grid);
  });
})();
