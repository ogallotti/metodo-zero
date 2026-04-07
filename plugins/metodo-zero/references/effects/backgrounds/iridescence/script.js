/* Iridescence — IntersectionObserver pause/resume */
(function () {
  'use strict';

  const container = document.querySelector('.iri-container');
  if (!container) return;

  const animated = container.querySelectorAll('.iri-base, .iri-shift, .iri-rainbow, .iri-fresnel, .iri-content h1');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = entry.isIntersecting ? 'running' : 'paused';
        animated.forEach((el) => {
          el.style.animationPlayState = state;
        });
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key === 'intensity') {
        document.documentElement.style.setProperty('--iri-intensity', parseFloat(value));
      }
    }
  });
})();
