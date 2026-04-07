(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('vsyncCanvas');
  var fillEl = document.getElementById('vsyncFill');
  var timeEl = document.getElementById('vsyncTime');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W = 800;
  var H = 450;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  var currentProgress = 0;
  var targetProgress = 0;
  var totalDuration = 10;

  function getCSSVar(prop) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop)) || 0;
  }

  function getCSSColor(prop) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#ec4899';
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 236, g: 72, b: 153 };
  }

  var particles = [];
  for (var i = 0; i < 80; i++) {
    particles.push({
      baseX: Math.random() * W,
      baseY: Math.random() * H,
      radius: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    });
  }

  function drawScene(progress) {
    var accent = getCSSColor('--vsync-accent');
    var rgb = hexToRgb(accent);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);

    var cx = W / 2;
    var cy = H / 2;
    var maxRadius = Math.min(W, H) * 0.35;

    var ringCount = 5;
    for (var r = 0; r < ringCount; r++) {
      var ringProgress = (progress * 3 + r * 0.2) % 1;
      var ringRadius = ringProgress * maxRadius;
      var ringAlpha = 1 - ringProgress;
      ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + (ringAlpha * 0.3) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    var orbitCount = 6;
    for (var o = 0; o < orbitCount; o++) {
      var angle = (o / orbitCount) * Math.PI * 2 + progress * Math.PI * 4;
      var orbitR = 80 + Math.sin(progress * Math.PI * 2 + o) * 40;
      var ox = cx + Math.cos(angle) * orbitR;
      var oy = cy + Math.sin(angle) * orbitR;
      var size = 5 + Math.sin(progress * Math.PI * 6 + o * 1.3) * 3;

      ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.8)';
      ctx.beginPath();
      ctx.arc(ox, oy, size, 0, Math.PI * 2);
      ctx.fill();

      if (o > 0) {
        var prevAngle = ((o - 1) / orbitCount) * Math.PI * 2 + progress * Math.PI * 4;
        var prevR = 80 + Math.sin(progress * Math.PI * 2 + (o - 1)) * 40;
        var px = cx + Math.cos(prevAngle) * prevR;
        var py = cy + Math.sin(prevAngle) * prevR;
        ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }
    }

    particles.forEach(function (p) {
      var t = progress * p.speed;
      var px = p.baseX + Math.sin(t * Math.PI * 2 + p.phase) * 30;
      var py = p.baseY + Math.cos(t * Math.PI * 2 + p.phase * 0.7) * 20;
      var alpha = 0.1 + Math.sin(progress * Math.PI * 4 + p.phase) * 0.1;

      ctx.fillStyle = 'rgba(255,255,255,' + Math.max(0.05, alpha) + ')';
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    var centerSize = 12 + Math.sin(progress * Math.PI * 8) * 4;
    var glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerSize * 3);
    glow.addColorStop(0, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.4)');
    glow.addColorStop(1, 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, centerSize * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx, cy, centerSize, 0, Math.PI * 2);
    ctx.fill();
  }

  function getScrollProgress() {
    var wrapper = document.querySelector('.vsync-sticky-wrapper');
    if (!wrapper) return 0;
    var rect = wrapper.getBoundingClientRect();
    var wrapperTop = rect.top + window.scrollY;
    var wrapperH = rect.height - window.innerHeight;
    if (wrapperH <= 0) return 0;
    var p = (window.scrollY - wrapperTop) / wrapperH;
    return Math.max(0, Math.min(1, p));
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function animate() {
    var smoothing = getCSSVar('--vsync-smoothing') || 0.06;
    var speed = getCSSVar('--vsync-speed') || 1;

    targetProgress = getScrollProgress();
    currentProgress += (targetProgress - currentProgress) * smoothing;

    var scaledProgress = currentProgress * speed;
    drawScene(scaledProgress % 1);

    if (fillEl) {
      fillEl.style.width = (currentProgress * 100) + '%';
    }
    if (timeEl) {
      var current = currentProgress * totalDuration;
      timeEl.textContent = formatTime(current) + ' / ' + formatTime(totalDuration);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
