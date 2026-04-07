(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.bt-text').forEach(function (el) {
    var text = el.textContent.trim();
    el.innerHTML = '';

    var staggerValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bt-stagger')) || 0.04;
    var charIndex = 0;

    text.split('').forEach(function (char) {
      if (char === ' ') {
        var space = document.createElement('span');
        space.className = 'bt-space';
        space.innerHTML = '&nbsp;';
        el.appendChild(space);
      } else {
        var span = document.createElement('span');
        span.className = 'bt-char';
        span.textContent = char;
        span.style.transitionDelay = (charIndex * staggerValue) + 's';
        el.appendChild(span);
        charIndex++;
      }
    });

    if (reducedMotion.matches) {
      el.classList.add('bt-visible');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            el.classList.add('bt-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
  });

  reducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      document.querySelectorAll('.bt-text').forEach(function (el) {
        el.classList.add('bt-visible');
      });
    }
  });
})();
