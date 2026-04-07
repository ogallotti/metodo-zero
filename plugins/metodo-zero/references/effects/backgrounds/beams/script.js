/* Beams — Animated light beams emanating from a focal point */
(function () {
  'use strict';

  const container = document.querySelector('.bm-container');
  const canvas = document.querySelector('.bm-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = true;
  let time = 0;
  let beams = [];

  const config = {
    beamCount: 14,
    speed: 0.005,
    originX: 0.5,  // 0..1
    originY: 0.3,  // 0..1
    minWidth: 0.02,
    maxWidth: 0.12,
    minLength: 0.6,
    maxLength: 1.4,
    colors: [
      [99, 102, 241],
      [168, 85, 247],
      [59, 130, 246],
      [139, 92, 246],
      [79, 70, 229],
      [6, 182, 212],
    ],
    baseAlpha: 0.12,
    pulseAmount: 0.06,
    rotationSpeed: 0.08,
    glowSize: 120,
    glowAlpha: 0.15,
  };

  function initBeams() {
    beams = [];
    for (let i = 0; i < config.beamCount; i++) {
      const angle = (Math.PI * 2 * i) / config.beamCount + Math.random() * 0.3;
      beams.push({
        angle,
        width: config.minWidth + Math.random() * (config.maxWidth - config.minWidth),
        length: config.minLength + Math.random() * (config.maxLength - config.minLength),
        color: config.colors[i % config.colors.length],
        alpha: config.baseAlpha * (0.5 + Math.random() * 0.5),
        phaseOffset: Math.random() * Math.PI * 2,
        speedMult: 0.7 + Math.random() * 0.6,
      });
    }
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
  }

  function drawBeam(beam, t) {
    const ox = W * config.originX;
    const oy = H * config.originY;
    const maxDim = Math.max(W, H) * 1.5;

    const angle = beam.angle + t * config.rotationSpeed * beam.speedMult;
    const halfWidth = beam.width * 0.5;
    const len = beam.length * maxDim;

    // Pulse
    const pulse = Math.sin(t * 3 + beam.phaseOffset) * config.pulseAmount;
    const alpha = beam.alpha + pulse;

    // Beam as a triangle/trapezoid
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const perpCos = Math.cos(angle + Math.PI / 2);
    const perpSin = Math.sin(angle + Math.PI / 2);

    const nearW = maxDim * halfWidth * 0.1;
    const farW = maxDim * halfWidth;

    // Near edge (at origin)
    const n1x = ox + perpCos * nearW;
    const n1y = oy + perpSin * nearW;
    const n2x = ox - perpCos * nearW;
    const n2y = oy - perpSin * nearW;

    // Far edge
    const fx = ox + cos * len;
    const fy = oy + sin * len;
    const f1x = fx + perpCos * farW;
    const f1y = fy + perpSin * farW;
    const f2x = fx - perpCos * farW;
    const f2y = fy - perpSin * farW;

    // Gradient along beam
    const grad = ctx.createLinearGradient(ox, oy, fx, fy);
    const c = beam.color;
    grad.addColorStop(0, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha * 1.5})`);
    grad.addColorStop(0.3, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`);
    grad.addColorStop(0.7, `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha * 0.4})`);
    grad.addColorStop(1, `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0)`);

    ctx.beginPath();
    ctx.moveTo(n1x, n1y);
    ctx.lineTo(f1x, f1y);
    ctx.lineTo(f2x, f2y);
    ctx.lineTo(n2x, n2y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    // Draw beams
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < beams.length; i++) {
      drawBeam(beams[i], time);
    }

    // Origin glow
    ctx.globalCompositeOperation = 'screen';
    const ox = W * config.originX;
    const oy = H * config.originY;
    const glowGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, config.glowSize);
    glowGrad.addColorStop(0, `rgba(200, 200, 255, ${config.glowAlpha})`);
    glowGrad.addColorStop(0.5, `rgba(99, 102, 241, ${config.glowAlpha * 0.5})`);
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, config.glowSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
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
        if (key === 'beamCount') initBeams();
      }
    }
  });

  resize();
  initBeams();
  loop();
})();
