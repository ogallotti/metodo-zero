(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var sections = document.querySelectorAll('.clip-reveal');

  function getClipPath(section, progress) {
    if (section.classList.contains('clip-reveal--inset')) {
      var insetTop = 100 - (progress * 100);
      return 'inset(' + insetTop + '% 0 0 0)';
    }
    if (section.classList.contains('clip-reveal--polygon')) {
      var spread = progress * 100;
      return 'polygon(' +
        (50 - spread) + '% ' + (100 - progress * 100) + '%, ' +
        (50 + spread) + '% ' + (100 - progress * 100) + '%, ' +
        '100% 100%, 0% 100%)';
    }
    // Default: circle reveal
    var radius = progress * 75;
    return 'circle(' + radius + '% at 50% 50%)';
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target._clipActive = true;
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(function (section) {
    section._clipActive = false;
    observer.observe(section);
  });

  var ticking = false;

  function updateClips() {
    sections.forEach(function (section) {
      if (!section._clipActive) return;

      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight;
      var progress = 1 - (rect.top / viewH);
      progress = Math.max(0, Math.min(1, progress));

      var bg = section.querySelector('.clip-reveal__background');
      var content = section.querySelector('.clip-reveal__content');

      if (bg) {
        bg.style.clipPath = getClipPath(section, progress);
      }

      if (content && progress > 0.4) {
        content.classList.add('visible');
      }
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateClips);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateClips();
})();
