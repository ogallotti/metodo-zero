/* Silk — Flowing fabric simulation using layered sine wave displacement */
(function () {
  'use strict';

  const container = document.querySelector('.slk-container');
  const canvas = document.querySelector('.slk-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = true;
  let time = 0;

  const config = {
    speed: 0.003,
    layers: 5,
    amplitude: 80,
    frequency: 0.003,
    segments: 200,
    colors: [
      [99, 102, 241],   // indigo
      [236, 72, 153],   // pink
      [6, 182, 212],    // cyan
      [168, 85, 247],   // purple
      [59, 130, 246],   // blue
    ],
    layerSpacing: 0.15,
    waveComplexity: 3,
    shadowBlur: 30,
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
  }

  function waveY(x, baseY, t, layerIndex) {
    let y = baseY;
    const li = layerIndex;
    for (let i = 0; i < config.waveComplexity; i++) {
      const f = config.frequency * (1 + i * 0.7) * (1 + li * 0.1);
      const a = config.amplitude / (1 + i * 0.6) * (1 + li * 0.05);
      const phase = t * (1 + i * 0.3 + li * 0.2) + li * 1.5;
      y += Math.sin(x * f + phase) * a;
      y += Math.cos(x * f * 0.7 + phase * 1.3 + i) * a * 0.5;
    }
    return y;
  }

  function drawLayer(layerIndex, t) {
    const color = config.colors[layerIndex % config.colors.length];
    const baseY = H * (0.3 + layerIndex * config.layerSpacing);
    const segments = config.segments;
    const step = (W + 40) / segments;

    // Silk folds — multiple gradient fills
    ctx.beginPath();
    ctx.moveTo(-20, H + 20);

    const points = [];
    for (let i = 0; i <= segments; i++) {
      const x = -20 + i * step;
      const y = waveY(x, baseY, t, layerIndex);
      points.push({ x, y });
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.lineTo(W + 20, H + 20);
    ctx.closePath();

    // Gradient from top of wave to bottom
    const minY = Math.min(...points.map(p => p.y));
    const grad = ctx.createLinearGradient(0, minY - 30, 0, H);
    const alpha = 0.12 + (config.layers - layerIndex) * 0.06;
    grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 1.5})`);
    grad.addColorStop(0.4, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
    grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.3})`);

    ctx.fillStyle = grad;
    ctx.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`;
    ctx.shadowBlur = config.shadowBlur;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Highlight line along the wave crest
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const { x, y } = points[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 2})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle sheen highlights on wave peaks
    for (let i = 1; i < segments - 1; i++) {
      const prev = points[i - 1].y;
      const curr = points[i].y;
      const next = points[i + 1].y;
      // Detect peaks
      if (curr < prev && curr < next) {
        const sheenGrad = ctx.createRadialGradient(
          points[i].x, curr, 0,
          points[i].x, curr, 40
        );
        sheenGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
        sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sheenGrad;
        ctx.beginPath();
        ctx.arc(points[i].x, curr, 40, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < config.layers; i++) {
      drawLayer(i, time);
    }
  }

  function loop() {
    if (!isVisible) return;
    time += config.speed;
    render();
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

  // Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Param updates
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      const { key, value } = e.data;
      if (key in config) {
        config[key] = typeof config[key] === 'number' ? parseFloat(value) : value;
      }
    }
  });

  resize();
  loop();
})();
