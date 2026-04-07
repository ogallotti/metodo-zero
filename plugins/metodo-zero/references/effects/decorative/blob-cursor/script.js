(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const blob = document.querySelector('.bc-blob');
  if (!blob) return;

  const config = { easing: 0.08 };
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: mouse.x, y: mouse.y };
  let isVisible = true;

  function animate() {
    if (isVisible) {
      pos.x += (mouse.x - pos.x) * config.easing;
      pos.y += (mouse.y - pos.y) * config.easing;
      blob.style.transform = 'translate3d(' + (pos.x - blob.offsetWidth / 2) + 'px,' + (pos.y - blob.offsetHeight / 2) + 'px, 0)';
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(blob);

  window.__blobCursorUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };

  animate();
})();
