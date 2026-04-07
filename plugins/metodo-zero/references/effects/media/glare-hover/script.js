(function () {
  'use strict';

  var cards = document.querySelectorAll('.gh-card');

  cards.forEach(function (card) {
    var glare = card.querySelector('.gh-glare');
    if (!glare) return;

    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      glare.style.setProperty('--gh-x', x + '%');
      glare.style.setProperty('--gh-y', y + '%');
    });
  });
})();
