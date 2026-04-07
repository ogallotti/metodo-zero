(function () {
  'use strict';

  // Duplicate content for seamless looping
  var tracks = document.querySelectorAll('.mq-track');
  tracks.forEach(function (track) {
    var children = Array.from(track.children);
    children.forEach(function (child) {
      track.appendChild(child.cloneNode(true));
    });
  });

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var containers = document.querySelectorAll('.mq-container');
  containers.forEach(function (container) {
    var observer = new IntersectionObserver(function (entries) {
      var track = container.querySelector('.mq-track');
      if (track) {
        track.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
      }
    }, { threshold: 0 });
    observer.observe(container);
  });
})();
