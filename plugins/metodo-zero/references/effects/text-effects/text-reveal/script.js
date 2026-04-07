(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.tr-container').forEach(function (container) {
    var lines = container.querySelectorAll('.tr-line');
    var direction = container.dataset.direction || 'left';

    lines.forEach(function (line) {
      line.setAttribute('data-direction', direction);
    });

    if (reducedMotion.matches) {
      container.classList.add('tr-visible');
      lines.forEach(function (line) {
        line.classList.add('tr-text-show');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            container.classList.add('tr-visible');

            var durationStr = getComputedStyle(document.documentElement).getPropertyValue('--tr-duration').trim();
            var duration = parseFloat(durationStr) * 1000 || 800;
            var staggerStr = getComputedStyle(document.documentElement).getPropertyValue('--tr-stagger').trim();
            var stagger = parseFloat(staggerStr) * 1000 || 150;

            lines.forEach(function (line, i) {
              var lineDelay = i * stagger;

              /* Phase 1 delay: mask slides in */
              line.style.transitionDelay = lineDelay + 'ms';
              line.querySelector('::after');

              /* Phase 2: after mask reaches full, show text and retract mask */
              setTimeout(function () {
                line.classList.add('tr-text-show');
              }, lineDelay + duration);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
  });

  reducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      document.querySelectorAll('.tr-container').forEach(function (c) {
        c.classList.add('tr-visible');
        c.querySelectorAll('.tr-line').forEach(function (l) {
          l.classList.add('tr-text-show');
        });
      });
    }
  });
})();
