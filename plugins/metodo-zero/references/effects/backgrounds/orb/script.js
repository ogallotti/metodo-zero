/* Orb — CSS gradient sphere with mouse parallax */
(function () {
  'use strict';

  const container = document.querySelector('.orb-container');
  const sphere = document.querySelector('.orb-sphere');
  if (!container || !sphere) return;

  const layers = container.querySelectorAll('.orb-layer');
  let isVisible = true;
  let mouse = { x: 0.5, y: 0.5 };
  let current = { x: 0, y: 0 };
  let animId = null;

  /* Parallax depths for each layer */
  const depths = [0.02, 0.035, 0.05];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function render() {
    if (!isVisible) return;

    /* Smooth mouse follow */
    current.x = lerp(current.x, (mouse.x - 0.5) * 2, 0.05);
    current.y = lerp(current.y, (mouse.y - 0.5) * 2, 0.05);

    /* Move sphere slightly with mouse */
    sphere.style.transform = `translate(calc(-50% + ${current.x * 20}px), calc(-50% + ${current.y * 20}px))`;

    /* Each layer has different parallax depth */
    layers.forEach((layer, i) => {
      const depth = depths[i] || 0.03;
      const dx = current.x * depth * 100;
      const dy = current.y * depth * 100;
      const baseScale = 1 + (i - 1) * 0.1;
      layer.style.transform = `translate(${dx}px, ${dy}px) scale(${baseScale})`;
    });

    animId = requestAnimationFrame(render);
  }

  /* Mouse tracking */
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });
  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = (touch.clientY - rect.top) / rect.height;
  }, { passive: true });

  /* IntersectionObserver */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) render();
        if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  /* Param updates */
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      // CSS-only effect; JS handles parallax only
    }
  });

  /* Start */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    render();
  }
})();
