(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getDuration() {
    return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--counter-duration')) || 1500;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (el.getAttribute('data-decimals') || '0');
    var decimalCount = parseInt(decimals);
    var duration = getDuration();

    if (reducedMotion) {
      el.textContent = prefix + formatNumber(target, decimalCount) + suffix;
      return;
    }

    var startTime = null;

    function formatNumber(num, dec) {
      if (dec > 0) return num.toFixed(dec);
      return Math.round(num).toLocaleString('en-US');
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = easedProgress * target;

      el.textContent = prefix + formatNumber(current, decimalCount) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var counters = entry.target.querySelectorAll('.stat-number[data-target]');
      counters.forEach(function (counter) {
        if (counter._counted) return;
        counter._counted = true;
        animateCounter(counter);
      });

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3
  });

  document.querySelectorAll('.stats-grid').forEach(function (grid) {
    observer.observe(grid);
  });
})();
