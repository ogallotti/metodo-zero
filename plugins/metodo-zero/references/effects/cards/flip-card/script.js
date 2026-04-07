(function () {
  'use strict';

  var cards = document.querySelectorAll('.flip-card[data-trigger="click"]');

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flip-card--flipped');
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flip-card--flipped');
      }
    });
  });

  // Listen for trigger mode changes
  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'js' && e.data.key === 'trigger') {
      var allCards = document.querySelectorAll('.flip-card');
      allCards.forEach(function (c) {
        c.setAttribute('data-trigger', e.data.value);
        c.classList.remove('flip-card--flipped');
      });
    }
  });
})();
