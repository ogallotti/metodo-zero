(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var cells = document.querySelectorAll('.bg-cell');
  if (!cells.length) return;

  var stagger = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bg-stagger')) || 100;

  var observer = new IntersectionObserver(function (entries) {
    var visible = [];
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visible.push(entry.target);
        observer.unobserve(entry.target);
      }
    });

    visible.forEach(function (cell, i) {
      setTimeout(function () {
        cell.classList.add('bg-cell--visible');
      }, i * stagger);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  cells.forEach(function (cell) {
    observer.observe(cell);
  });
})();
