(function () {
  'use strict';

  var cards = document.querySelectorAll('.mb-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mb-mouse-x', x + 'px');
      card.style.setProperty('--mb-mouse-y', y + 'px');
    });
  });

  // Also track global mouse for proximity effect on all cards
  var grid = document.querySelector('.mb-grid');
  if (grid) {
    grid.addEventListener('mousemove', function (e) {
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mb-mouse-x', x + 'px');
        card.style.setProperty('--mb-mouse-y', y + 'px');
      });
    });
  }
})();
