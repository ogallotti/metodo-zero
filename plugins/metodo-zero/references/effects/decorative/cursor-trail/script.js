(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const canvas = document.querySelector('.ct-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animId = null;
  let isVisible = true;

  const config = {
    trailLength: 30,
    particleCount: 3
  };

  const mouse = { x: -100, y: -100 };
  const particles = [];

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 99, g: 102, b: 241 };
  }

  function getConfig() {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue('--ct-color').trim() || '#6366f1';
    const glowSize = parseFloat(style.getPropertyValue('--ct-glow-size')) || 30;
    const fadeSpeed = parseFloat(style.getPropertyValue('--ct-fade-speed')) || 0.92;
    return { color: hexToRgb(color), glowSize, fadeSpeed };
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    return {
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: Math.random() * 4 + 2
    };
  }

  function animate() {
    if (!isVisible) { animId = requestAnimationFrame(animate); return; }

    const { color, glowSize, fadeSpeed } = getConfig();

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(9, 9, 11, ${1 - fadeSpeed})`;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < config.particleCount; i++) {
      if (mouse.x > 0 && mouse.y > 0) {
        particles.push(createParticle(mouse.x, mouse.y));
      }
    }

    while (particles.length > config.trailLength * config.particleCount * 2) {
      particles.shift();
    }

    ctx.globalCompositeOperation = 'lighter';

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= 0.015;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = p.life * 0.6;
      const size = p.size * p.life;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * (glowSize / 15));

      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * (glowSize / 15), 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', resize);

  const observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(canvas);

  window.__cursorTrailUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };

  resize();
  animate();
})();
