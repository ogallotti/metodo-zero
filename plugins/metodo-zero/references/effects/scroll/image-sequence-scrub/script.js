(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.getElementById('seqCanvas');
  var progressFill = document.getElementById('seqProgressFill');
  var frameCounter = document.getElementById('seqFrameCounter');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var size = 600;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  function getCSSVar(prop) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop)) || 0;
  }

  function getCSSColor(prop) {
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || '#6366f1';
  }

  var currentFrame = 0;
  var targetFrame = 0;
  var running = true;

  function project(x, y, z) {
    var perspective = 400;
    var scale = perspective / (perspective + z);
    return {
      x: x * scale + size / 2,
      y: y * scale + size / 2,
      scale: scale
    };
  }

  function rotateY(x, y, z, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
      x: x * cos - z * sin,
      y: y,
      z: x * sin + z * cos
    };
  }

  function rotateX(x, y, z, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
      x: x,
      y: y * cos - z * sin,
      z: y * sin + z * cos
    };
  }

  function drawFrame(progress) {
    var accent = getCSSColor('--seq-accent');
    var angleY = progress * Math.PI * 2;
    var angleX = progress * Math.PI * 0.6 + 0.3;
    var cubeSize = 120;
    var half = cubeSize / 2;

    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, size, size);

    var gridSpacing = 40;
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= size; i += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    var vertices = [
      [-half, -half, -half],
      [ half, -half, -half],
      [ half,  half, -half],
      [-half,  half, -half],
      [-half, -half,  half],
      [ half, -half,  half],
      [ half,  half,  half],
      [-half,  half,  half]
    ];

    var edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    var projected = vertices.map(function (v) {
      var r = rotateY(v[0], v[1], v[2], angleY);
      r = rotateX(r.x, r.y, r.z, angleX);
      return project(r.x, r.y, r.z);
    });

    ctx.lineWidth = 2;
    edges.forEach(function (edge) {
      var a = projected[edge[0]];
      var b = projected[edge[1]];
      var alpha = (a.scale + b.scale) / 2;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = Math.max(0.2, Math.min(1, alpha * 0.8));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    projected.forEach(function (p) {
      var r = 4 * p.scale;
      ctx.fillStyle = accent;
      ctx.globalAlpha = Math.max(0.4, p.scale);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    var particleCount = 12;
    for (var j = 0; j < particleCount; j++) {
      var pAngle = (j / particleCount) * Math.PI * 2 + progress * Math.PI * 4;
      var pRadius = 180 + Math.sin(progress * Math.PI * 3 + j) * 30;
      var px = Math.cos(pAngle) * pRadius + size / 2;
      var py = Math.sin(pAngle) * pRadius + size / 2;
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function getScrollProgress() {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.max(0, Math.min(1, window.scrollY / docHeight));
  }

  function animate() {
    if (!running) return;

    var frameCount = getCSSVar('--seq-frame-count') || 60;
    var smoothing = getCSSVar('--seq-smoothing') || 0.08;

    targetFrame = getScrollProgress() * (frameCount - 1);
    currentFrame += (targetFrame - currentFrame) * smoothing;

    var progress = currentFrame / (frameCount - 1);
    drawFrame(progress);

    if (progressFill) {
      progressFill.style.width = (progress * 100) + '%';
    }
    if (frameCounter) {
      frameCounter.textContent = 'Frame ' + Math.round(currentFrame) + ' / ' + Math.round(frameCount);
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
