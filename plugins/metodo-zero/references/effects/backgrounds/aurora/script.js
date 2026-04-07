/* Aurora — IntersectionObserver pause/resume */
(function () {
  'use strict';

  const container = document.querySelector('.aur-container');
  if (!container) return;

  const bands = container.querySelectorAll('.aur-band');
  const shimmer = container.querySelector('.aur-shimmer');
  const allAnimated = [...bands, shimmer].filter(Boolean);

  // Pause when offscreen
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

  // JS param handler
  window.__auroraUpdateParam = function (key, value) {
    switch (key) {
      case 'intensity':
        document.documentElement.style.setProperty(
          '--aurora-opacity',
          parseFloat(value)
        );
        break;
      case 'speed': {
        const s = parseFloat(value);
        document.documentElement.style.setProperty('--aurora-speed', s + 's');
        break;
      }
    }
  };

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      window.__auroraUpdateParam(e.data.key, e.data.value);
    }
  });
})();
