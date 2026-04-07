(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var easings = {
    linear: function (t) { return t; },
    easeOut: function (t) { return 1 - Math.pow(1 - t, 3); },
    easeInOut: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  };

  function formatNumber(num, decimals, separator) {
    var fixed = num.toFixed(decimals);
    if (!separator) return fixed;
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  }

  document.querySelectorAll('.cn-number').forEach(function (el) {
    var target = parseFloat(el.dataset.target) || 0;
    var duration = parseInt(el.dataset.duration, 10) || 2000;
    var easingName = el.dataset.easing || 'easeOut';
    var decimals = parseInt(el.dataset.decimals, 10) || 0;
    var separator = el.dataset.separator || ',';
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var easing = easings[easingName] || easings.easeOut;

    var valueSpan = el.querySelector('.cn-value');
    if (!valueSpan) {
      /* Build inner structure */
      el.innerHTML = '';
      if (prefix) {
        var pre = document.createElement('span');
        pre.className = 'cn-prefix';
        pre.textContent = prefix;
        el.appendChild(pre);
      }
      valueSpan = document.createElement('span');
      valueSpan.className = 'cn-value';
      valueSpan.textContent = '0';
      el.appendChild(valueSpan);
      if (suffix) {
        var suf = document.createElement('span');
        suf.className = 'cn-suffix';
        suf.textContent = suffix;
        el.appendChild(suf);
      }
    }

    if (reducedMotion.matches) {
      valueSpan.textContent = formatNumber(target, decimals, separator);
      return;
    }

    var animated = false;

    function animateCount() {
      if (animated) return;
      animated = true;

      var start = performance.now();

      function step(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easing(progress);
        var current = easedProgress * target;

        valueSpan.textContent = formatNumber(current, decimals, separator);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          valueSpan.textContent = formatNumber(target, decimals, separator);
        }
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
  });

  reducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      document.querySelectorAll('.cn-number').forEach(function (el) {
        var target = parseFloat(el.dataset.target) || 0;
        var decimals = parseInt(el.dataset.decimals, 10) || 0;
        var separator = el.dataset.separator || ',';
        var valueSpan = el.querySelector('.cn-value');
        if (valueSpan) {
          valueSpan.textContent = formatNumber(target, decimals, separator);
        }
      });
    }
  });
})();
