(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var items = document.querySelectorAll('.al-item');
  if (!items.length) return;

  var stagger = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--al-stagger')) || 80;

  var observer = new IntersectionObserver(function (entries) {
    var batch = [];
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        batch.push(entry.target);
        observer.unobserve(entry.target);
      }
    });

    batch.forEach(function (item, i) {
      setTimeout(function () {
        item.classList.add('al-item--visible');
      }, i * stagger);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
