(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var cards = document.querySelectorAll('.reflective-card');

  cards.forEach(function (card) {
    var rafId = null;

    card.addEventListener('mousemove', function (e) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI) + 180;

        card.style.setProperty('--ref-mx', x + 'px');
        card.style.setProperty('--ref-my', y + 'px');
        card.style.setProperty('--ref-angle', angle + 'deg');
      });
    });

    card.addEventListener('mouseleave', function () {
      if (rafId) cancelAnimationFrame(rafId);
    });
  });
})();
