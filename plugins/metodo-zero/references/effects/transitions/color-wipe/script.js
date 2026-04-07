(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sections = document.querySelectorAll('.wipe-section');

  if (reducedMotion) {
    sections.forEach(function (section) {
      var content = section.querySelector('.wipe-content');
      if (content) content.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var section = entry.target;
      var overlay = section.querySelector('.wipe-overlay');
      var content = section.querySelector('.wipe-content');

      if (overlay && !overlay.classList.contains('wiping')) {
        overlay.classList.add('wiping');

        var duration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--wipe-duration')) || 700;

        setTimeout(function () {
          if (content) content.classList.add('visible');
        }, duration * 0.45);
      } else if (content) {
        content.classList.add('visible');
      }

      observer.unobserve(section);
    });
  }, {
    threshold: 0.2
  });

  sections.forEach(function (section, i) {
    if (i === 0) {
      var content = section.querySelector('.wipe-content');
      if (content) content.classList.add('visible');
      return;
    }
    observer.observe(section);
  });
})();
