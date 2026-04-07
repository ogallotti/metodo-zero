/* Noise — IntersectionObserver pause/resume */
(function () {
  'use strict';

  const container = document.querySelector('.nz-container');
  if (!container) return;

  const grains = container.querySelectorAll('.nz-grain, .nz-grain-2');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = entry.isIntersecting ? 'running' : 'paused';
        grains.forEach((el) => {
          el.style.animationPlayState = state;
        });
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      // CSS-only effect; no JS params
    }
  });
})();
