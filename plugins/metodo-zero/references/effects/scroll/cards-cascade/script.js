(function () {
  'use strict';

  var cards = document.querySelectorAll('.cascade-card');
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (card) {
      card.classList.add('cascaded');
    });
    return;
  }

  function getStagger() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cascade-stagger')) || 80;
  }

  var visibleCount = 0;

  var observer = new IntersectionObserver(function (entries) {
    var stagger = getStagger();

    var newEntries = entries
      .filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });

    newEntries.forEach(function (entry, i) {
      var delay = i * stagger;
      setTimeout(function () {
        entry.target.classList.add('cascaded');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(function (card) {
    observer.observe(card);
  });
})();
