/* Pixel Blast — Pixel explosion that reforms in a loop via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.pxb-container');
  var canvas = document.querySelector('.pxb-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H, cx, cy;
  var animId = null;
  var isVisible = true;
  var time = 0;
  var particles = [];

  var CYCLE_DURATION = 4.0; // seconds per explosion cycle

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function parseColor(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
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
    cx = W * 0.5;
    cy = H * 0.5;
    initParticles();
  }

  function initParticles() {
    var count = parseInt(getCSS('--pxb-particle-count') || '400');
    var colors = [
      getCSS('--pxb-color-1') || '#ff4757',
      getCSS('--pxb-color-2') || '#ffa502',
      getCSS('--pxb-color-3') || '#2ed573',
      getCSS('--pxb-color-4') || '#1e90ff',
    ].map(parseColor);

    particles = [];
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 1 + Math.random() * 3;
      var maxDist = 100 + Math.random() * 250;

      particles.push({
        // Home position (grid-like formation around center)
        homeX: cx + (Math.random() - 0.5) * 60,
        homeY: cy + (Math.random() - 0.5) * 60,
        // Explosion direction
        angle: angle,
        speed: speed,
        maxDist: maxDist,
        // Visual
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        // State
        x: cx,
        y: cy,
        delay: Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 4,
      });
    }
  }

  // Easing: explosion out, gentle return
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function render() {
    var speed = parseFloat(getCSS('--pxb-speed') || '1');
    var radius = parseFloat(getCSS('--pxb-radius') || '300');

    var dt = 0.016 * speed;
    time += dt;

    // Cycle phase: 0..1
    var cycleTime = time % CYCLE_DURATION;
    var phase = cycleTime / CYCLE_DURATION;

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      var delayedPhase = Math.max(0, (phase - p.delay) / (1 - p.delay));

      var explosionEnd = 0.45;
      var reformStart = 0.55;

      var dist;
      if (delayedPhase < explosionEnd) {
        // Exploding outward
        var t = delayedPhase / explosionEnd;
        dist = easeOutExpo(t) * p.maxDist * (radius / 300);
        p.x = cx + Math.cos(p.angle) * dist;
        p.y = cy + Math.sin(p.angle) * dist;
      } else if (delayedPhase < reformStart) {
        // Floating / drifting
        var drift = (delayedPhase - explosionEnd) / (reformStart - explosionEnd);
        dist = p.maxDist * (radius / 300);
        p.x = cx + Math.cos(p.angle) * dist + Math.sin(time * 2 + i) * 5;
        p.y = cy + Math.sin(p.angle) * dist + Math.cos(time * 2 + i) * 5;
      } else {
        // Reforming back to center
        var t2 = (delayedPhase - reformStart) / (1 - reformStart);
        var ease = easeInOutCubic(t2);
        dist = p.maxDist * (radius / 300) * (1 - ease);
        p.x = cx + Math.cos(p.angle) * dist;
        p.y = cy + Math.sin(p.angle) * dist;
      }

      p.rotation += p.rotSpeed * dt;

      // Alpha based on distance from center
      var distFromCenter = Math.sqrt((p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy));
      var maxVisualDist = Math.max(W, H) * 0.5;
      var alpha = Math.max(0.1, 1.0 - (distFromCenter / maxVisualDist) * 0.7);

      // Draw pixel square
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + alpha + ')';
      var half = p.size * 0.5;
      ctx.fillRect(-half, -half, p.size, p.size);
      ctx.restore();
    }

    // Center glow during reform
    if (phase > 0.5) {
      var glowIntensity = Math.sin((phase - 0.5) * 2 * Math.PI) * 0.3;
      if (glowIntensity > 0) {
        var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
        grad.addColorStop(0, 'rgba(255, 255, 255,' + glowIntensity + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - 80, cy - 80, 160, 160);
      }
    }
  }

  function loop() {
    if (!isVisible) return;
    render();
    animId = requestAnimationFrame(loop);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
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

  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
      if (e.data.key === '--pxb-particle-count') initParticles();
    }
  });

  resize();
  loop();
})();
