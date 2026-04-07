/* Dot Grid — Interactive canvas dot grid with mouse influence */
(function () {
  'use strict';

  const container = document.querySelector('.dg-container');
  const canvas = document.querySelector('.dg-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = true;
  let dots = [];
  let time = 0;

  const config = {
    spacing: 30,
    baseRadius: 1.5,
    maxRadius: 5,
    mouseRadius: 200,
    mouseForce: 25,
    dotColor: [255, 255, 255],
    glowColor: [99, 102, 241],
    baseAlpha: 0.2,
    pulseSpeed: 0.02,
    returnSpeed: 0.06,
    waveAmplitude: 3,
    waveSpeed: 0.003,
    waveFreq: 0.01,
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
    initDots();
  }

  function initDots() {
    dots = [];
    const sp = config.spacing;
    const cols = Math.ceil(W / sp) + 2;
    const rows = Math.ceil(H / sp) + 2;
    const offsetX = ((W - (cols - 1) * sp) / 2);
    const offsetY = ((H - (rows - 1) * sp) / 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          ox: offsetX + col * sp,
          oy: offsetY + row * sp,
          x: offsetX + col * sp,
          y: offsetY + row * sp,
          r: config.baseRadius,
          alpha: config.baseAlpha,
        });
      }
    }
  }

  function update() {
    time += config.pulseSpeed;
    const mr = config.mouseRadius;
    const mrSq = mr * mr;

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      // Subtle ambient wave
      const wave = Math.sin(d.ox * config.waveFreq + time * (config.waveSpeed / config.pulseSpeed)) * config.waveAmplitude;
      let targetX = d.ox;
      let targetY = d.oy + wave;
      let targetR = config.baseRadius;
      let targetAlpha = config.baseAlpha;

      // Mouse influence
      if (mouse.active) {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mrSq) {
          const dist = Math.sqrt(distSq);
          const factor = 1 - dist / mr;
          const factorSq = factor * factor;

          // Push dots away from mouse
          targetX += (dx / dist) * config.mouseForce * factorSq;
          targetY += (dy / dist) * config.mouseForce * factorSq;

          // Scale up and brighten near mouse
          targetR = config.baseRadius + (config.maxRadius - config.baseRadius) * factorSq;
          targetAlpha = config.baseAlpha + (1 - config.baseAlpha) * factorSq;
        }
      }

      // Smooth interpolation
      d.x += (targetX - d.x) * config.returnSpeed;
      d.y += (targetY - d.y) * config.returnSpeed;
      d.r += (targetR - d.r) * config.returnSpeed;
      d.alpha += (targetAlpha - d.alpha) * config.returnSpeed;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const gc = config.glowColor;
    const dc = config.dotColor;

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

      // Dot
      // Blend between base color and glow color based on proximity
      const t = Math.min(1, (d.alpha - config.baseAlpha) / (1 - config.baseAlpha));
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
    if (!isVisible) return;
    update();
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
        if (key === 'spacing') initDots();
      }
    }
  });

  resize();
  loop();
})();
