(function () {
  'use strict';

  var tracks = document.querySelectorAll('.m3d-track');

  tracks.forEach(function (track) {
    var items = track.querySelectorAll('.m3d-item');
    if (!items.length) return;

    // Duplicate items for seamless infinite scroll
    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  });

  // Pause animations when offscreen
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var scene = document.querySelector('.m3d-scene');
  if (!scene) return;

  var observer = new IntersectionObserver(function (entries) {
    tracks.forEach(function (track) {
      track.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });

  observer.observe(scene);
})();
