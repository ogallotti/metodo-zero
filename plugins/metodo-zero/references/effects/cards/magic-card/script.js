(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var grids = document.querySelectorAll('.magic-grid');

  grids.forEach(function (grid) {
    var cards = grid.querySelectorAll('.magic-card');

    grid.addEventListener('mousemove', function (e) {
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--magic-x', x + 'px');
        card.style.setProperty('--magic-y', y + 'px');
      });
    });
  });
})();
