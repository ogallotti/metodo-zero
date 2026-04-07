/* Hyperspeed — Hyperspace speed lines with radial blur and color layers */
(function () {
  'use strict';

  const container = document.querySelector('.hs-container');
  const canvas = document.querySelector('.hs-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H, cx, cy;
  let animId = null;
  let isVisible = true;
  let lines = [];
  let time = 0;

  const config = {
    lineCount: 300,
    speed: 8,
    minLength: 50,
    maxLength: 400,
    minWidth: 0.5,
    maxWidth: 3,
    colors: [
      [120, 160, 255],  // blue
      [200, 220, 255],  // white-blue
      [80, 120, 255],   // deep blue
      [160, 100, 255],  // purple
      [100, 200, 255],  // cyan
      [255, 255, 255],  // white
    ],
    spread: 1.2,        // radial spread multiplier
    fadeSpeed: 0.15,     // bg fade per frame
    centerX: 0.5,
    centerY: 0.5,
    bloom: true,
    bloomRadius: 200,
    bloomAlpha: 0.08,
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

  function initLines() {
    lines = [];
    for (let i = 0; i < config.lineCount; i++) {
      lines.push(createLine(true));
    }
  }

  function createLine(randomProgress) {
    const angle = Math.random() * Math.PI * 2;
    const maxDim = Math.max(W, H);
    const distance = 20 + Math.random() * maxDim * config.spread;

    return {
      angle,
      distance: randomProgress ? Math.random() * distance : 0,
      maxDistance: distance,
      speed: config.speed * (0.5 + Math.random() * 1),
      length: config.minLength + Math.random() * (config.maxLength - config.minLength),
      width: config.minWidth + Math.random() * (config.maxWidth - config.minWidth),
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      alpha: 0.3 + Math.random() * 0.7,
    };
  }

  function update() {
    cx = W * config.centerX;
    cy = H * config.centerY;

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      l.distance += l.speed;

      // Reset when past max distance
      if (l.distance > l.maxDistance + l.length) {
        lines[i] = createLine(false);
      }
    }
  }

  function draw() {
    // Fade background
    ctx.fillStyle = `rgba(3, 0, 20, ${config.fadeSpeed})`;
    ctx.fillRect(0, 0, W, H);

    // Center bloom
    if (config.bloom) {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, config.bloomRadius);
      grad.addColorStop(0, `rgba(150, 180, 255, ${config.bloomAlpha})`);
      grad.addColorStop(0.5, `rgba(100, 120, 255, ${config.bloomAlpha * 0.3})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, config.bloomRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw lines
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const cos = Math.cos(l.angle);
      const sin = Math.sin(l.angle);

      // Line start and end (radial from center)
      const startDist = Math.max(0, l.distance - l.length);
      const endDist = l.distance;

      const x1 = cx + cos * startDist;
      const y1 = cy + sin * startDist;
      const x2 = cx + cos * endDist;
      const y2 = cy + sin * endDist;

      // Fade in from center, fade out at edge
      const progress = l.distance / l.maxDistance;
      let alpha = l.alpha;
      if (progress < 0.1) alpha *= progress / 0.1;
      if (progress > 0.8) alpha *= (1 - progress) / 0.2;

      const c = l.color;

      // Gradient along line
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);
      grad.addColorStop(0.3, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha * 0.5})`);
      grad.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = l.width * (0.5 + progress * 0.5);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function loop() {
    if (!isVisible) return;
    time++;
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
      initLines();
    }, 150);
  });

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
        if (key === 'lineCount') initLines();
      }
    }
  });

  resize();
  initLines();
  ctx.fillStyle = '#030014';
  ctx.fillRect(0, 0, W, H);
  loop();
})();
