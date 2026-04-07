(function () {
  'use strict';

  // --- Perlin Noise Class ---
  class PerlinNoise {
    constructor(seed) {
      this.perm = new Uint8Array(512);
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      // Fisher-Yates shuffle with seed
      let s = seed || 0;
      for (let i = 255; i > 0; i--) {
        s = (s * 16807 + 0) % 2147483647;
        const j = s % (i + 1);
        const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
      }
      for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(a, b, t) { return a + t * (b - a); }

    grad(hash, x) {
      return (hash & 1) === 0 ? x : -x;
    }

    noise1D(x) {
      const xi = Math.floor(x) & 255;
      const xf = x - Math.floor(x);
      const u = this.fade(xf);
      return this.lerp(
        this.grad(this.perm[xi], xf),
        this.grad(this.perm[xi + 1], xf - 1),
        u
      );
    }

    fbm(x, octaves, lacunarity, persistence) {
      let val = 0, amp = 1, freq = 1, max = 0;
      for (let i = 0; i < octaves; i++) {
        val += this.noise1D(x * freq) * amp;
        max += amp;
        amp *= persistence;
        freq *= lacunarity;
      }
      return val / max;
    }
  }

  const container = document.querySelector('.wav-container');
  const canvas = document.getElementById('wav-canvas');
  if (!container || !canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  const perlin = new PerlinNoise(42);
  let dpr, W, H;
  let running = false;
  let raf;
  let time = 0;

  const style = getComputedStyle(document.documentElement);

  function hexToRGB(hex) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
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

  function getColors() {
    const defaults = ['#6366f1', '#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6'];
    return defaults.map((def, i) => {
      const val = style.getPropertyValue(`--wav-color-${i + 1}`).trim();
      return hexToRGB(val || def);
    });
  }

  function drawWave(index, totalLayers, t, colors, amplitude) {
    const color = colors[index % colors.length];
    const segments = 200;
    const step = (W + 40) / segments;

    // Each layer at a different vertical position with unique noise offset
    const baseY = H * (0.4 + (index / totalLayers) * 0.45);
    const noiseScale = 0.003 * (1 + index * 0.08);
    const noiseOffset = index * 73.7;
    const amp = amplitude * (1.2 - index * 0.05);

    // Build smooth bezier path from Perlin noise samples
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const x = -20 + i * step;
      const nVal = perlin.fbm(x * noiseScale + t * (0.5 + index * 0.15) + noiseOffset, 4, 2.0, 0.5);
      const y = baseY + nVal * amp;
      points.push({ x, y });
    }

    // Gradient fill from wave crest to bottom
    const minY = Math.min(...points.map(p => p.y));
    const grad = ctx.createLinearGradient(0, minY - 20, 0, H);
    const alpha = 0.08 + (totalLayers - index) * 0.04;
    grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 1.8})`);
    grad.addColorStop(0.3, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
    grad.addColorStop(0.7, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.4})`);
    grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

    // Draw filled area with quadratic bezier curves for smoothness
    ctx.beginPath();
    ctx.moveTo(points[0].x, H + 20);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const cpx = (points[i].x + points[i + 1].x) / 2;
      const cpy = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, cpx, cpy);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.lineTo(last.x, H + 20);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke line along the wave crest
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i++) {
      const cpx = (points[i].x + points[i + 1].x) / 2;
      const cpy = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, cpx, cpy);
    }
    ctx.lineTo(last.x, last.y);

    const strokeAlpha = 0.15 + (totalLayers - index) * 0.06;
    ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${strokeAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Sheen highlights on wave peaks
    for (let i = 2; i < points.length - 2; i++) {
      if (points[i].y < points[i - 1].y && points[i].y < points[i + 1].y &&
          points[i].y < points[i - 2].y && points[i].y < points[i + 2].y) {
        const sheenGrad = ctx.createRadialGradient(
          points[i].x, points[i].y, 0,
          points[i].x, points[i].y, 35
        );
        sheenGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.6})`);
        sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sheenGrad;
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    const speed = parseFloat(style.getPropertyValue('--wav-speed')) || 0.015;
    const amplitude = parseFloat(style.getPropertyValue('--wav-amplitude')) || 60;
    const layers = Math.max(2, Math.min(10, parseInt(style.getPropertyValue('--wav-layers')) || 6));
    const colors = getColors();

    time += speed;

    // Draw back to front
    for (let i = layers - 1; i >= 0; i--) {
      drawWave(i, layers, time, colors, amplitude);
    }
  }

  function loop() {
    if (!running) return;
    render();
    raf = requestAnimationFrame(loop);
  }

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

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      // CSS custom properties are handled via the global listener
    }
  });

  resize();
  observer.observe(container);
})();
