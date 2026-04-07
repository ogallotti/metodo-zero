(function () {
  'use strict';

  // --- 2D Perlin Noise ---
  class Perlin2D {
    constructor() {
      this.perm = new Uint8Array(512);
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      let s = 42;
      for (let i = 255; i > 0; i--) {
        s = (s * 16807) % 2147483647;
        const j = s % (i + 1);
        const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
      }
      for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
      this.grad = [
        [1,1],[-1,1],[1,-1],[-1,-1],
        [1,0],[-1,0],[0,1],[0,-1]
      ];
    }

    dot(gi, x, y) {
      const g = this.grad[gi % 8];
      return g[0] * x + g[1] * y;
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

    noise(x, y) {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = this.fade(xf);
      const v = this.fade(yf);

      const aa = this.perm[this.perm[xi] + yi];
      const ab = this.perm[this.perm[xi] + yi + 1];
      const ba = this.perm[this.perm[xi + 1] + yi];
      const bb = this.perm[this.perm[xi + 1] + yi + 1];

      const x1 = this.dot(aa, xf, yf) * (1 - u) + this.dot(ba, xf - 1, yf) * u;
      const x2 = this.dot(ab, xf, yf - 1) * (1 - u) + this.dot(bb, xf - 1, yf - 1) * u;

      return x1 * (1 - v) + x2 * v;
    }
  }

  const container = document.querySelector('.ptc-container');
  const canvas = document.getElementById('ptc-canvas');
  if (!container || !canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  const perlin = new Perlin2D();
  const style = getComputedStyle(document.documentElement);

  let dpr, W, H;
  let particles = [];
  let running = false;
  let raf;
  let time = 0;

  const mouse = { x: -9999, y: -9999, active: false };

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

    // Adjust count for viewport area
    const area = W * H;
    const targetCount = Math.max(60, Math.min(200, Math.floor(area / 7000)));
    initParticles(targetCount);
  }

  function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        r: 1 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7,
        pulsePhase: Math.random() * Math.PI * 2,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }
  }

  function update() {
    const speed = parseFloat(style.getPropertyValue('--ptc-speed')) || 0.4;
    const mouseRadius = parseFloat(style.getPropertyValue('--ptc-mouse-radius')) || 180;
    const mouseRadiusSq = mouseRadius * mouseRadius;

    time += 0.005;
    const noiseScale = 0.002;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Perlin noise flow field drives velocity
      const nx = perlin.noise(p.x * noiseScale + p.noiseOffsetX + time, p.y * noiseScale + time * 0.3);
      const ny = perlin.noise(p.x * noiseScale + time * 0.3, p.y * noiseScale + p.noiseOffsetY + time);

      p.vx += nx * speed * 0.1;
      p.vy += ny * speed * 0.1;

      // Mouse repulsion with smooth falloff
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouseRadiusSq && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseRadius) * 0.08;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Damping
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Clamp speed
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const maxSpd = speed * 2;
      if (spd > maxSpd) {
        p.vx = (p.vx / spd) * maxSpd;
        p.vy = (p.vy / spd) * maxSpd;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Size pulsing
      p.r = 1 + Math.sin(time * 3 + p.pulsePhase) * 0.5 + 0.5;

      // Wrap around edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }
  }

  function draw() {
    const connectDist = parseFloat(style.getPropertyValue('--ptc-connect-distance')) || 150;
    const connectDistSq = connectDist * connectDist;
    const particleColor = hexToRGB(style.getPropertyValue('--ptc-particle-color').trim() || '#ffffff');
    const lineColor = hexToRGB(style.getPropertyValue('--ptc-line-color').trim() || '#ffffff');
    const glowColor = hexToRGB(style.getPropertyValue('--ptc-glow-color').trim() || '#64c8ff');

    ctx.clearRect(0, 0, W, H);

    // Connection lines (constellation effect)
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < connectDistSq) {
          const alpha = (1 - distSq / connectDistSq) * 0.15;
          ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Mouse glow
    if (mouse.active) {
      const glowRadius = 80;
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      grad.addColorStop(0, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, 0.06)`);
      grad.addColorStop(1, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = `rgba(${particleColor[0]},${particleColor[1]},${particleColor[2]},${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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
