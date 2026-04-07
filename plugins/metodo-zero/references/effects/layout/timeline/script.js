(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var entries = document.querySelectorAll('.tl-entry');
  var lineFill = document.querySelector('.tl-line-fill');
  var timeline = document.querySelector('.tl-timeline');

  if (!entries.length || !timeline) return;

  if (prefersReducedMotion) {
    entries.forEach(function (e) { e.classList.add('tl-entry--visible'); });
    if (lineFill) lineFill.style.height = '100%';
    return;
  }

  function updateLineFill() {
    if (!lineFill) return;
    var timelineRect = timeline.getBoundingClientRect();
    var lastVisible = null;

    entries.forEach(function (entry) {
      if (entry.classList.contains('tl-entry--visible')) {
        lastVisible = entry;
      }
    });

    if (lastVisible) {
      var entryRect = lastVisible.getBoundingClientRect();
      var bottom = entryRect.top + entryRect.height / 2 - timelineRect.top;
      lineFill.style.height = Math.max(0, bottom) + 'px';
    }
  }

  var observer = new IntersectionObserver(function (obs) {
    obs.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-entry--visible');
        observer.unobserve(entry.target);
        setTimeout(updateLineFill, 50);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  entries.forEach(function (entry) {
    observer.observe(entry);
  });
})();
