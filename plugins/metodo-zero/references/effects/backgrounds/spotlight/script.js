(function () {
  'use strict';

  const container = document.querySelector('.spt-container');
  if (!container) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Smooth position tracking
  const pos = { x: 50, y: 50 };
  const target = { x: 50, y: 50 };
  const pos2 = { x: 50, y: 50 };
  let running = false;
  let raf;

  const smoothing = 0.08;
  const secondarySmoothing = 0.04;
  const secondaryOffset = 30;

  function updatePositions() {
    // Primary — smooth follow
    pos.x += (target.x - pos.x) * smoothing;
    pos.y += (target.y - pos.y) * smoothing;

    // Secondary — delayed trailing with offset
    const angle = Math.atan2(target.y - pos.y, target.x - pos.x) + Math.PI;
    const offX = pos.x + Math.cos(angle) * (secondaryOffset / container.clientWidth * 100);
    const offY = pos.y + Math.sin(angle) * (secondaryOffset / container.clientHeight * 100);
    pos2.x += (offX - pos2.x) * secondarySmoothing;
    pos2.y += (offY - pos2.y) * secondarySmoothing;

    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--spt-x', pos.x + '%');
    root.style.setProperty('--spt-y', pos.y + '%');
    root.style.setProperty('--spt-x2', pos2.x + '%');
    root.style.setProperty('--spt-y2', pos2.y + '%');
  }

  function loop() {
    if (!running) return;
    updatePositions();
    raf = requestAnimationFrame(loop);
  }

  // Mouse tracking
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    target.x = ((e.clientX - rect.left) / rect.width) * 100;
    target.y = ((e.clientY - rect.top) / rect.height) * 100;
  }, { passive: true });

  // Touch support
  container.addEventListener('touchstart', () => {
    container.classList.add('spt-touch-active');
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    target.x = ((touch.clientX - rect.left) / rect.width) * 100;
    target.y = ((touch.clientY - rect.top) / rect.height) * 100;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    container.classList.remove('spt-touch-active');
  });

  // Visibility
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      running = true;
      raf = requestAnimationFrame(loop);
    } else {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }
  }, { threshold: 0.01 });

  observer.observe(container);
})();
