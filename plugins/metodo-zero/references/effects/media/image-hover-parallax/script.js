(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var config = { intensity: 15, scale: 1.05 };
  var cards = document.querySelectorAll('.ihp-card');

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;

      var rotateY = (x - 0.5) * config.intensity;
      var rotateX = (0.5 - y) * config.intensity;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(' + config.scale + ',' + config.scale + ',' + config.scale + ')';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });

  window.__ihpUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };
})();
