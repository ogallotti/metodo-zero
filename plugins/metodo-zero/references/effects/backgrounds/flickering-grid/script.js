/* Flickering Grid — Dynamic cell generation + IntersectionObserver */
(function () {
  'use strict';

  const container = document.querySelector('.fg-container');
  const grid = document.querySelector('.fg-grid');
  if (!container || !grid) return;

  let cellCount = 0;

  function populateGrid() {
    const style = getComputedStyle(document.documentElement);
    const cellSize = parseInt(style.getPropertyValue('--fg-cell-size')) || 24;
    const gap = parseInt(style.getPropertyValue('--fg-gap')) || 2;
    const totalCell = cellSize + gap;

    const cols = Math.ceil(container.clientWidth / totalCell) + 1;
    const rows = Math.ceil(container.clientHeight / totalCell) + 1;
    const needed = cols * rows;

    // Only rebuild if count changed significantly
    if (Math.abs(needed - cellCount) < 20) return;

    // Use DocumentFragment for batch DOM insert
    const frag = document.createDocumentFragment();
    grid.innerHTML = '';

    for (let i = 0; i < needed; i++) {
      const cell = document.createElement('div');
      cell.className = 'fg-cell';
      // Randomize initial opacity for organic feel
      cell.style.opacity = (0.1 + Math.random() * 0.4).toFixed(2);
      frag.appendChild(cell);
    }

    grid.appendChild(frag);
    cellCount = needed;
  }

  // IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const cells = grid.querySelectorAll('.fg-cell');
        const state = entry.isIntersecting ? 'running' : 'paused';
        cells.forEach((cell) => {
          cell.style.animationPlayState = state;
        });
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(populateGrid, 200);
  });

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      // Rebuild grid if cell params change
      populateGrid();
    }
  });

  populateGrid();
})();
