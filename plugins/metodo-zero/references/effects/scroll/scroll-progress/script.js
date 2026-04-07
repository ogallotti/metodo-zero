(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var track = document.createElement('div');
  track.className = 'scroll-progress-track';
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');
  track.setAttribute('aria-valuenow', '0');
  track.setAttribute('aria-label', 'Page scroll progress');

  var bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  track.appendChild(bar);
  document.body.prepend(track);

  var ticking = false;

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress = Math.min(100, Math.max(0, progress));

    bar.style.width = progress + '%';
    track.setAttribute('aria-valuenow', Math.round(progress).toString());
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      if (reducedMotion) {
        updateProgress();
      } else {
        requestAnimationFrame(updateProgress);
      }
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  updateProgress();
})();
