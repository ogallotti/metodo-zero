(function () {
  'use strict';

  var tracks = document.querySelectorAll('.inf-track');

  tracks.forEach(function (track) {
    var items = track.querySelectorAll('.inf-item');
    if (!items.length) return;
    items.forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });
  });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var containers = document.querySelectorAll('.inf-container');
  containers.forEach(function (container) {
    var observer = new IntersectionObserver(function (entries) {
      var track = container.querySelector('.inf-track');
      if (track) {
        track.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
      }
    }, { threshold: 0 });
    observer.observe(container);
  });
})();
