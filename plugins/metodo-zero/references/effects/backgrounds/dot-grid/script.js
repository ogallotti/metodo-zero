(function () {
  'use strict';

  const container = document.querySelector('.dg-container');
  const canvas = document.getElementById('dg-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  const style = getComputedStyle(document.documentElement);

  let dpr, W, H;
  let dots = [];
  let spatialGrid = {};
  let running = false;
  let raf;
  let time = 0;

  // Parse hex color to [r, g, b]
  function hexToRGB(hex) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  const mouse = { x: -9999, y: -9999, active: false };

  function getConfig() {
    return {
      spacing: parseFloat(style.getPropertyValue('--dg-spacing')) || 30,
      baseRadius: parseFloat(style.getPropertyValue('--dg-dot-size')) || 1.5,
      maxRadius: 5,
      mouseRadius: parseFloat(style.getPropertyValue('--dg-mouse-radius')) || 200,
      connectDistance: parseFloat(style.getPropertyValue('--dg-connect-distance')) || 80,
      dotColor: hexToRGB(style.getPropertyValue('--dg-dot-color').trim() || '#ffffff'),
      glowColor: hexToRGB(style.getPropertyValue('--dg-glow-color').trim() || '#6366f1'),
      baseAlpha: 0.2,
      mouseForce: 25,
      returnSpeed: 0.06,
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initDots();
  }

  function initDots() {
    dots = [];
    const cfg = getConfig();
    const sp = cfg.spacing;
    const cols = Math.ceil(W / sp) + 2;
    const rows = Math.ceil(H / sp) + 2;
    const offsetX = (W - (cols - 1) * sp) / 2;
    const offsetY = (H - (rows - 1) * sp) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const ox = offsetX + col * sp;
        const oy = offsetY + row * sp;
        dots.push({
          ox, oy,
          x: ox, y: oy,
          r: cfg.baseRadius,
          alpha: cfg.baseAlpha,
        });
      }
    }
  }

  // Spatial grid for fast neighbor lookup near cursor
  function buildSpatialGrid(cellSize) {
    spatialGrid = {};
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      const cx = Math.floor(d.x / cellSize);
      const cy = Math.floor(d.y / cellSize);
      const key = cx + ',' + cy;
      if (!spatialGrid[key]) spatialGrid[key] = [];
      spatialGrid[key].push(i);
    }
  }

  function getNeighborIndices(px, py, radius, cellSize) {
    const indices = [];
    const minCX = Math.floor((px - radius) / cellSize);
    const maxCX = Math.floor((px + radius) / cellSize);
    const minCY = Math.floor((py - radius) / cellSize);
    const maxCY = Math.floor((py + radius) / cellSize);
    for (let cx = minCX; cx <= maxCX; cx++) {
      for (let cy = minCY; cy <= maxCY; cy++) {
        const key = cx + ',' + cy;
        if (spatialGrid[key]) {
          for (let k = 0; k < spatialGrid[key].length; k++) {
            indices.push(spatialGrid[key][k]);
          }
        }
      }
    }
    return indices;
  }

  function update() {
    const cfg = getConfig();
    time += 0.02;
    const mr = cfg.mouseRadius;
    const mrSq = mr * mr;

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      // Subtle ambient wave
      const wave = Math.sin(d.ox * 0.01 + time * 0.15) * 3;
      let targetX = d.ox;
      let targetY = d.oy + wave;
      let targetR = cfg.baseRadius;
      let targetAlpha = cfg.baseAlpha;

      if (mouse.active) {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mrSq) {
          const dist = Math.sqrt(distSq);
          const factor = 1 - dist / mr;
          const factorSq = factor * factor;

          // Push dots toward cursor slightly
          targetX += (dx / dist) * cfg.mouseForce * factorSq;
          targetY += (dy / dist) * cfg.mouseForce * factorSq;

          targetR = cfg.baseRadius + (cfg.maxRadius - cfg.baseRadius) * factorSq;
          targetAlpha = cfg.baseAlpha + (1 - cfg.baseAlpha) * factorSq;
        }
      }

      d.x += (targetX - d.x) * cfg.returnSpeed;
      d.y += (targetY - d.y) * cfg.returnSpeed;
      d.r += (targetR - d.r) * cfg.returnSpeed;
      d.alpha += (targetAlpha - d.alpha) * cfg.returnSpeed;
    }
  }

  function draw() {
    const cfg = getConfig();
    ctx.clearRect(0, 0, W, H);

    const dc = cfg.dotColor;
    const gc = cfg.glowColor;
    const connectDist = cfg.connectDistance;
    const connectDistSq = connectDist * connectDist;

    // Build spatial grid for connection line optimization
    buildSpatialGrid(connectDist);

    // Draw connection lines between close dots near cursor
    if (mouse.active) {
      const nearCursor = getNeighborIndices(mouse.x, mouse.y, cfg.mouseRadius, connectDist);
      ctx.lineWidth = 0.5;

      for (let a = 0; a < nearCursor.length; a++) {
        const i = nearCursor[a];
        const di = dots[i];
        if (di.alpha <= cfg.baseAlpha + 0.05) continue;

        for (let b = a + 1; b < nearCursor.length; b++) {
          const j = nearCursor[b];
          const dj = dots[j];
          if (dj.alpha <= cfg.baseAlpha + 0.05) continue;

          const dx = di.x - dj.x;
          const dy = di.y - dj.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectDistSq) {
            const lineAlpha = (1 - distSq / connectDistSq) * Math.min(di.alpha, dj.alpha) * 0.6;
            ctx.strokeStyle = `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(di.x, di.y);
            ctx.lineTo(dj.x, dj.y);
            ctx.stroke();
          }
        }
      }
    }

    // Draw dots
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      // Glow for bright dots
      if (d.alpha > 0.4) {
        const glowSize = d.r * 4;
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, glowSize);
        const ga = (d.alpha - 0.4) * 0.3;
        grad.addColorStop(0, `rgba(${gc[0]}, ${gc[1]}, ${gc[2]}, ${ga})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(d.x - glowSize, d.y - glowSize, glowSize * 2, glowSize * 2);
      }

      // Blend dot color toward glow color based on proximity
      const t = Math.min(1, (d.alpha - cfg.baseAlpha) / (1 - cfg.baseAlpha));
      const r = dc[0] + (gc[0] - dc[0]) * t;
      const g = dc[1] + (gc[1] - dc[1]) * t;
      const b = dc[2] + (gc[2] - dc[2]) * t;

      ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${d.alpha})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  // Mouse/touch
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });

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
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      running = true;
      raf = requestAnimationFrame(loop);
    } else {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }
  }, { threshold: 0.01 });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  resize();
  observer.observe(container);
})();
