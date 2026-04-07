/* Gradient Mesh — IntersectionObserver pause/resume */
(function () {
  'use strict';

  const container = document.querySelector('.gm-container');
  if (!container) return;

  const blobs = container.querySelectorAll('.gm-blob');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = entry.isIntersecting ? 'running' : 'paused';
        blobs.forEach((blob) => {
          blob.style.animationPlayState = state;
        });
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);

  // JS param updates
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key === 'blobCount') {
        // Dynamically adjust blob visibility
        const count = parseInt(value, 10);
        blobs.forEach((blob, i) => {
          blob.style.display = i < count ? '' : 'none';
        });
      }
    }
  });
})();
