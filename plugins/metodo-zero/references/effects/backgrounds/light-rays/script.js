/* Light Rays — IntersectionObserver pause/resume */
(function () {
  'use strict';

  const container = document.querySelector('.lr-container');
  if (!container) return;

  const rays = container.querySelectorAll('.lr-ray');
  const dust = container.querySelector('.lr-dust');
  const allAnimated = [...rays, dust].filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = entry.isIntersecting ? 'running' : 'paused';
        allAnimated.forEach((el) => {
          el.style.animationPlayState = state;
        });
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      // No JS-specific params for this CSS-only effect
    }
  });
})();
