(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  var elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  function getThreshold() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reveal-threshold')) || 0.15;
  }

  function getStagger() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reveal-stagger')) || 80;
  }

  var observer = new IntersectionObserver(function (entries) {
    var stagger = getStagger();

    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;
      var customDelay = parseInt(el.getAttribute('data-reveal-delay'), 10) || 0;
      var staggerIndex = parseInt(el.getAttribute('data-reveal-stagger'), 10);
      var totalDelay = customDelay;

      if (!isNaN(staggerIndex)) {
        totalDelay += staggerIndex * stagger;
      }

      if (totalDelay > 0) {
        setTimeout(function () {
          el.classList.add('revealed');
        }, totalDelay);
      } else {
        el.classList.add('revealed');
      }

      observer.unobserve(el);
    });
  }, {
    threshold: getThreshold(),
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();
