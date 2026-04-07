(function () {
  'use strict';

  var timeline = document.querySelector('.tl-timeline');
  var lineFill = document.getElementById('tlLineFill');
  var items = document.querySelectorAll('.tl-item');

  if (!timeline || !lineFill || !items.length) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    lineFill.style.height = '100%';
    items.forEach(function (item) {
      item.classList.add('active');
    });
    return;
  }

  var ticking = false;

  function updateLine() {
    var rect = timeline.getBoundingClientRect();
    var timelineTop = rect.top + window.scrollY;
    var timelineH = rect.height;
    var scrollBottom = window.scrollY + window.innerHeight * 0.6;
    var progress = (scrollBottom - timelineTop) / timelineH;
    progress = Math.max(0, Math.min(1, progress));
    lineFill.style.height = (progress * 100) + '%';

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateLine);
      ticking = true;
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -80px 0px'
  });

  items.forEach(function (item) {
    observer.observe(item);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  updateLine();
})();
