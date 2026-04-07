/* Warp Background — Space warp / starfield with depth and trails */
(function () {
  'use strict';

  const container = document.querySelector('.wrp-container');
  const canvas = document.querySelector('.wrp-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H, cx, cy;
  let animId = null;
  let isVisible = true;
  let stars = [];

  const config = {
    starCount: 600,
    speed: 2,
    maxSpeed: 15,
    trailLength: 0.7,   // 0..1, how much of travel to draw as trail
    starColor: [255, 255, 255],
    trailColor: [150, 180, 255],
    maxRadius: 2.5,
    depth: 1500,
    centerX: 0.5,
    centerY: 0.5,
    fadeIn: true,
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W * config.centerX;
    cy = H * config.centerY;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push(createStar(true));
    }
  }

  function createStar(randomZ) {
    return {
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: randomZ ? Math.random() * config.depth : config.depth,
      pz: config.depth, // previous z for trail
    };
  }

  function update() {
    const speed = config.speed;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.pz = s.z;
      s.z -= speed;

      if (s.z <= 0) {
        // Reset star
        s.x = (Math.random() - 0.5) * W * 2;
        s.y = (Math.random() - 0.5) * H * 2;
        s.z = config.depth;
        s.pz = config.depth;
      }
    }
  }

  function draw() {
    // Semi-transparent clear for subtle motion blur
    ctx.fillStyle = 'rgba(0, 0, 8, 0.2)';
    ctx.fillRect(0, 0, W, H);

    cx = W * config.centerX;
    cy = H * config.centerY;

    const sc = config.starColor;
    const tc = config.trailColor;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Project current position
      const sx = (s.x / s.z) * (W * 0.5) + cx;
      const sy = (s.y / s.z) * (H * 0.5) + cy;

      // Project previous position (for trail)
      const px = (s.x / s.pz) * (W * 0.5) + cx;
      const py = (s.y / s.pz) * (H * 0.5) + cy;

      // Skip offscreen
      if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;

      const depth = 1 - s.z / config.depth; // 0 = far, 1 = near
      const radius = depth * config.maxRadius;
      const alpha = depth * 0.9 + 0.1;

      // Trail
      if (config.trailLength > 0 && depth > 0.1) {
        const trailAlpha = alpha * config.trailLength * 0.5;
        ctx.strokeStyle = `rgba(${tc[0]}, ${tc[1]}, ${tc[2]}, ${trailAlpha})`;
        ctx.lineWidth = radius * 0.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      // Star dot
      ctx.fillStyle = `rgba(${sc[0]}, ${sc[1]}, ${sc[2]}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.5, radius), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!isVisible) return;
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

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

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      initStars();
    }, 150);
  });

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
        if (key === 'starCount') initStars();
      }
    }
  });

  resize();
  initStars();
  // Clear canvas fully on first frame
  ctx.fillStyle = '#000008';
  ctx.fillRect(0, 0, W, H);
  loop();
})();
