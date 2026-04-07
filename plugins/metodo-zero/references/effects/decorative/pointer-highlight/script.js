(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const spotlight = document.querySelector('.ph-spotlight');
  if (!spotlight) return;

  let isVisible = true;

  window.addEventListener('mousemove', function (e) {
    if (!isVisible) return;
    spotlight.style.setProperty('--ph-x', e.clientX + 'px');
    spotlight.style.setProperty('--ph-y', e.clientY + 'px');
  });

  const observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(spotlight);
})();
