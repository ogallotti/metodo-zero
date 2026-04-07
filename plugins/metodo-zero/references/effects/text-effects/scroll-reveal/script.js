(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reducedMotion.matches) {
    document.querySelectorAll('.sr-item').forEach(function (el) {
      el.classList.add('sr-visible');
    });
    return;
  }

  /* Group items by their parent section */
  var sections = document.querySelectorAll('.sr-section');

  sections.forEach(function (section) {
    var items = section.querySelectorAll('.sr-item');
    var staggerValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sr-stagger')) || 0.1;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            /* Stagger reveal all items in this section */
            items.forEach(function (item, i) {
              item.style.transitionDelay = (i * staggerValue) + 's';
              /* Use rAF to ensure the transition delay is applied before the class toggle */
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  item.classList.add('sr-visible');
                });
              });
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
  });

  /* Also observe individual items outside sections */
  document.querySelectorAll('.sr-item:not(.sr-section .sr-item)').forEach(function (item) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(item);
  });

  reducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      document.querySelectorAll('.sr-item').forEach(function (el) {
        el.classList.add('sr-visible');
      });
    }
  });
})();
