/* Grid Distortion — Canvas grid that warps and distorts around cursor */
(function () {
  'use strict';

  const container = document.querySelector('.gd-container');
  const canvas = document.querySelector('.gd-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = true;
  let time = 0;

  const config = {
    spacing: 40,
    mouseRadius: 250,
    mouseForce: 60,
    lineColor: [255, 255, 255],
    lineAlpha: 0.08,
    glowColor: [99, 102, 241],
    lineWidth: 0.8,
    ambientWave: 3,
    ambientSpeed: 0.01,
    ambientFreq: 0.005,
    perspectiveStrength: 0.3,
  };

  const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getDisplacedPoint(ox, oy) {
    let x = ox;
    let y = oy;

    // Ambient wave
    x += Math.sin(oy * config.ambientFreq + time) * config.ambientWave;
    y += Math.cos(ox * config.ambientFreq + time * 0.7) * config.ambientWave;

    // Mouse distortion
    if (mouse.active) {
      const dx = ox - mouse.sx;
      const dy = oy - mouse.sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mr = config.mouseRadius;

      if (dist < mr) {
        const factor = Math.pow(1 - dist / mr, 2);
        // Push away from mouse
        x += (dx / (dist || 1)) * config.mouseForce * factor;
        y += (dy / (dist || 1)) * config.mouseForce * factor;
      }
    }

    return { x, y };
  }

  function getLineAlpha(ox, oy) {
    if (!mouse.active) return config.lineAlpha;
    const dx = ox - mouse.sx;
    const dy = oy - mouse.sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mr = config.mouseRadius;
    if (dist >= mr) return config.lineAlpha;
    const factor = 1 - dist / mr;
    return config.lineAlpha + factor * 0.25;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += config.ambientSpeed;

    const sp = config.spacing;
    const cols = Math.ceil(W / sp) + 4;
    const rows = Math.ceil(H / sp) + 4;
    const startX = -sp * 2;
    const startY = -sp * 2;

    const lc = config.lineColor;
    const gc = config.glowColor;

    // Draw horizontal lines
    for (let row = 0; row <= rows; row++) {
      const oy = startY + row * sp;
      ctx.beginPath();
      let prevAlpha = 0;

      for (let col = 0; col <= cols; col++) {
        const ox = startX + col * sp;
        const p = getDisplacedPoint(ox, oy);
        const alpha = getLineAlpha(ox, oy);

        if (col === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
        prevAlpha = alpha;
      }

      // Use average alpha for stroke
      const midOx = startX + (cols / 2) * sp;
      const midAlpha = getLineAlpha(midOx, oy);
      const t = Math.min(1, (midAlpha - config.lineAlpha) / 0.25);
      const r = lc[0] + (gc[0] - lc[0]) * t;
      const g = lc[1] + (gc[1] - lc[1]) * t;
      const b = lc[2] + (gc[2] - lc[2]) * t;

      ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${midAlpha})`;
      ctx.lineWidth = config.lineWidth;
      ctx.stroke();
    }

    // Draw vertical lines
    for (let col = 0; col <= cols; col++) {
      const ox = startX + col * sp;
      ctx.beginPath();

      for (let row = 0; row <= rows; row++) {
        const oy = startY + row * sp;
        const p = getDisplacedPoint(ox, oy);

        if (row === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }

      const midOy = startY + (rows / 2) * sp;
      const midAlpha = getLineAlpha(ox, midOy);
      const t = Math.min(1, (midAlpha - config.lineAlpha) / 0.25);
      const r = lc[0] + (gc[0] - lc[0]) * t;
      const g = lc[1] + (gc[1] - lc[1]) * t;
      const b = lc[2] + (gc[2] - lc[2]) * t;

      ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${midAlpha})`;
      ctx.lineWidth = config.lineWidth;
      ctx.stroke();
    }

    // Mouse glow
    if (mouse.active) {
      const grad = ctx.createRadialGradient(
        mouse.sx, mouse.sy, 0,
        mouse.sx, mouse.sy, config.mouseRadius * 0.6
      );
      grad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, 0.08)`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function loop() {
    if (!isVisible) return;
    // Smooth mouse tracking
    mouse.sx += (mouse.x - mouse.sx) * 0.08;
    mouse.sy += (mouse.y - mouse.sy) * 0.08;
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Mouse
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  container.addEventListener('mouseleave', () => { mouse.active = false; });
  container.addEventListener('touchmove', (e) => {
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  container.addEventListener('touchend', () => { mouse.active = false; });

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
    resizeTimeout = setTimeout(resize, 150);
  });

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
      }
    }
  });

  resize();
  mouse.sx = W / 2;
  mouse.sy = H / 2;
  loop();
})();
