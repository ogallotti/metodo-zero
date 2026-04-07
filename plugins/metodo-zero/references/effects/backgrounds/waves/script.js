/* Waves — Layered sine wave animation */
(function () {
  'use strict';

  const container = document.querySelector('.wav-container');
  const canvas = document.querySelector('.wav-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = true;
  let time = 0;

  const config = {
    speed: 0.015,
    waveCount: 6,
    segmentCount: 150,
    baseAmplitude: 50,
    baseFrequency: 0.008,
    verticalSpread: 0.4,   // how much vertical space waves span (0-1)
    verticalCenter: 0.55,  // center point of wave group (0-1)
    strokeWidth: 1.8,
    fillOpacity: 0.06,
    colors: [
      [99, 102, 241],   // indigo
      [139, 92, 246],   // violet
      [168, 85, 247],   // purple
      [59, 130, 246],   // blue
      [6, 182, 212],    // cyan
      [34, 211, 238],   // light cyan
    ],
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

  function drawWave(index, t) {
    const color = config.colors[index % config.colors.length];
    const segments = config.segmentCount;
    const step = (W + 40) / segments;

    // Each wave has unique characteristics
    const phase = index * 0.8 + t * (0.8 + index * 0.15);
    const freq = config.baseFrequency * (1 + index * 0.12);
    const amp = config.baseAmplitude * (1 - index * 0.08);
    const baseY = H * config.verticalCenter +
      (index - config.waveCount / 2) * H * config.verticalSpread / config.waveCount;

    // Build path
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const x = -20 + i * step;
      const nx = x * freq;
      const y = baseY +
        Math.sin(nx + phase) * amp +
        Math.sin(nx * 2.1 + phase * 1.3 + index) * amp * 0.3 +
        Math.cos(nx * 0.5 + phase * 0.7) * amp * 0.5;
      points.push({ x, y });
    }

    // Filled area
    ctx.beginPath();
    ctx.moveTo(points[0].x, H + 20);
    for (let i = 0; i <= segments; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[segments].x, H + 20);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, baseY - amp, 0, H);
    grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${config.fillOpacity * 1.5})`);
    grad.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${config.fillOpacity})`);
    grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    const alpha = 0.25 + (config.waveCount - index) * 0.08;
    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    ctx.lineWidth = config.strokeWidth;
    ctx.stroke();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    for (let i = config.waveCount - 1; i >= 0; i--) {
      drawWave(i, time);
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
  loop();
})();
