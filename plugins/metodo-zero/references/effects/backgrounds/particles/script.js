/* Particles Constellation — Interactive Canvas with mouse repulsion */
(function () {
  'use strict';

  const container = document.querySelector('.ptc-container');
  const canvas = document.querySelector('.ptc-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H;
  let particles = [];
  let animId = null;
  let isVisible = true;

  // Config
  const config = {
    count: 120,
    maxSpeed: 0.4,
    minRadius: 1,
    maxRadius: 2.5,
    linkDistance: 150,
    linkWidth: 0.8,
    mouseRadius: 180,
    mouseForce: 0.08,
    returnForce: 0.01,
    particleColor: [255, 255, 255],
    lineAlpha: 0.15,
    glowRadius: 60,
    glowAlpha: 0.06,
  };

  const mouse = { x: -9999, y: -9999, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Adjust count for mobile
    const area = W * H;
    config.count = Math.max(40, Math.min(180, Math.floor(area / 8000)));

    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        ox: 0, // will be set after
        oy: 0,
        vx: (Math.random() - 0.5) * config.maxSpeed * 2,
        vy: (Math.random() - 0.5) * config.maxSpeed * 2,
        r: config.minRadius + Math.random() * (config.maxRadius - config.minRadius),
        alpha: 0.3 + Math.random() * 0.7,
      });
    }
    particles.forEach((p) => {
      p.ox = p.x;
      p.oy = p.y;
    });
  }

  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Natural drift
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouseRadius && dist > 0) {
          const force = (1 - dist / config.mouseRadius) * config.mouseForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > config.maxSpeed * 2) {
        p.vx = (p.vx / speed) * config.maxSpeed * 2;
        p.vy = (p.vy / speed) * config.maxSpeed * 2;
      }

      // Wrap around edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const linkDist = config.linkDistance;
    const linkDistSq = linkDist * linkDist;

    // Draw connections
    ctx.lineWidth = config.linkWidth;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < linkDistSq) {
          const alpha = (1 - distSq / linkDistSq) * config.lineAlpha;
          ctx.strokeStyle = `rgba(${config.particleColor[0]},${config.particleColor[1]},${config.particleColor[2]},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw mouse glow
    if (mouse.active) {
      const grad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, config.glowRadius
      );
      grad.addColorStop(0, `rgba(100, 200, 255, ${config.glowAlpha})`);
      grad.addColorStop(1, 'rgba(100, 200, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, config.glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = `rgba(${config.particleColor[0]},${config.particleColor[1]},${config.particleColor[2]},${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!isVisible) return;
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Mouse tracking
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  container.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Touch
  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    mouse.active = false;
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

  // Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // JS param updates
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
      }
      if (key === 'count') {
        config.count = parseInt(value, 10);
        initParticles();
      }
    }
  });

  // Init
  resize();
  loop();
})();
