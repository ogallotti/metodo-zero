/* Spotlight — Cursor-following spotlight with smooth tracking */
(function () {
  'use strict';

  const container = document.querySelector('.spt-container');
  if (!container) return;

  const light = container.querySelector('.spt-light');
  const light2 = container.querySelector('.spt-light-2');
  const ring = container.querySelector('.spt-ring');

  // Smooth position tracking
  const pos = { x: 50, y: 50 }; // percentage
  const target = { x: 50, y: 50 };
  const pos2 = { x: 50, y: 50 }; // delayed secondary
  let animId = null;
  let isVisible = true;
  let mouseActive = false;

  const config = {
    smoothing: 0.08,
    secondaryDelay: 0.04, // slower follow for secondary
    secondaryOffset: 30,  // px offset
  };

  function updatePositions() {
    // Smooth interpolation
    pos.x += (target.x - pos.x) * config.smoothing;
    pos.y += (target.y - pos.y) * config.smoothing;

    // Secondary follows primary with more delay and offset
    const offsetAngle = Math.atan2(target.y - pos.y, target.x - pos.x) + Math.PI;
    const offX = pos.x + Math.cos(offsetAngle) * (config.secondaryOffset / container.clientWidth * 100);
    const offY = pos.y + Math.sin(offsetAngle) * (config.secondaryOffset / container.clientHeight * 100);
    pos2.x += (offX - pos2.x) * config.secondaryDelay;
    pos2.y += (offY - pos2.y) * config.secondaryDelay;

    // Apply via CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--spt-x', pos.x + '%');
    root.style.setProperty('--spt-y', pos.y + '%');
    root.style.setProperty('--spt-x2', pos2.x + '%');
    root.style.setProperty('--spt-y2', pos2.y + '%');
  }

  function loop() {
    if (!isVisible) return;
    updatePositions();
    animId = requestAnimationFrame(loop);
  }

  // Mouse tracking
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    target.x = ((e.clientX - rect.left) / rect.width) * 100;
    target.y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseActive = true;
  });

  container.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  // Touch
  container.addEventListener('touchstart', () => {
    container.classList.add('spt-touch-active');
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    target.x = ((touch.clientX - rect.left) / rect.width) * 100;
    target.y = ((touch.clientY - rect.top) / rect.height) * 100;
    mouseActive = true;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    container.classList.remove('spt-touch-active');
    mouseActive = false;
  });

  // Visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) loop();
        if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Param updates
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
      }
    }
  });

  loop();
})();
