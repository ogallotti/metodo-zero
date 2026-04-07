/* Shape Grid — Geometric shapes reacting to mouse with glowing trail via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.shg-container');
  var canvas = document.querySelector('.shg-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;
  var time = 0;

  var cells = [];
  var cols = 0;
  var rowCount = 0;
  var mouse = { x: -1000, y: -1000, active: false };
  var trail = []; // History of mouse positions

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
    initGrid();
  }

  function initGrid() {
    var size = parseInt(getCSS('--shg-grid-size') || '50');
    cols = Math.ceil(W / size) + 1;
    rowCount = Math.ceil(H / size) + 1;

    cells = [];
    for (var r = 0; r < rowCount; r++) {
      cells[r] = [];
      for (var c = 0; c < cols; c++) {
        cells[r][c] = {
          x: c * size + size * 0.5,
          y: r * size + size * 0.5,
          rotation: 0,
          targetRotation: 0,
          scale: 1,
          targetScale: 1,
          glow: 0,
          hue: 0,
        };
      }
    }
  }

  function drawShape(x, y, size, shapeType, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    var half = size * 0.35;

    switch (shapeType) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, half, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'square':
        ctx.beginPath();
        ctx.rect(-half, -half, half * 2, half * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half, half);
        ctx.lineTo(-half, half);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half, 0);
        ctx.lineTo(0, half);
        ctx.lineTo(-half, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      default:
        ctx.beginPath();
        ctx.arc(0, 0, half, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    ctx.restore();
  }

  function render() {
    var size = parseInt(getCSS('--shg-grid-size') || '50');
    var trailLength = parseInt(getCSS('--shg-trail-length') || '15');
    var hoverColor = parseColor(getCSS('--shg-hover-color') || '#8b5cf6');
    var baseColor = parseColor(getCSS('--shg-base-color') || '#1e293b');
    var shapeType = getCSS('--shg-shape') || 'circle';

    var dt = 0.016;
    time += dt;

    // Update trail
    if (mouse.active) {
      trail.unshift({ x: mouse.x, y: mouse.y });
      while (trail.length > trailLength) trail.pop();
    } else {
      // Fade trail
      if (trail.length > 0) trail.pop();
    }

    ctx.clearRect(0, 0, W, H);

    var influenceRadius = size * 3;

    for (var r = 0; r < rowCount; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = cells[r][c];

        // Calculate influence from trail
        var maxInfluence = 0;
        for (var t = 0; t < trail.length; t++) {
          var dx = cell.x - trail[t].x;
          var dy = cell.y - trail[t].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var age = t / trail.length;
          var influence = Math.max(0, 1 - dist / influenceRadius) * (1 - age);
          maxInfluence = Math.max(maxInfluence, influence);
        }

        // Direct mouse influence (strongest)
        if (mouse.active) {
          var mdx = cell.x - mouse.x;
          var mdy = cell.y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          var mInfluence = Math.max(0, 1 - mdist / influenceRadius);
          maxInfluence = Math.max(maxInfluence, mInfluence);
        }

        // Animate towards targets
        cell.targetRotation = maxInfluence * Math.PI * 0.5;
        cell.targetScale = 1 + maxInfluence * 0.5;
        cell.rotation += (cell.targetRotation - cell.rotation) * 0.1;
        cell.scale += (cell.targetScale - cell.scale) * 0.1;
        cell.glow += (maxInfluence - cell.glow) * 0.15;

        // Color interpolation
        var cr = baseColor.r + (hoverColor.r - baseColor.r) * cell.glow;
        var cg = baseColor.g + (hoverColor.g - baseColor.g) * cell.glow;
        var cb = baseColor.b + (hoverColor.b - baseColor.b) * cell.glow;
        var alpha = 0.3 + cell.glow * 0.5;

        ctx.fillStyle = 'rgba(' + Math.round(cr) + ',' + Math.round(cg) + ',' + Math.round(cb) + ',' + (alpha * 0.4) + ')';
        ctx.strokeStyle = 'rgba(' + Math.round(cr) + ',' + Math.round(cg) + ',' + Math.round(cb) + ',' + alpha + ')';
        ctx.lineWidth = 1;

        // Glow effect
        if (cell.glow > 0.1) {
          ctx.shadowColor = 'rgba(' + hoverColor.r + ',' + hoverColor.g + ',' + hoverColor.b + ',' + (cell.glow * 0.4) + ')';
          ctx.shadowBlur = 10 * cell.glow;
        } else {
          ctx.shadowBlur = 0;
        }

        var drawSize = size * cell.scale;
        drawShape(cell.x, cell.y, drawSize, shapeType, cell.rotation);
        ctx.shadowBlur = 0;
      }
    }
  }

  function loop() {
    if (!isVisible) return;
    render();
    animId = requestAnimationFrame(loop);
  }

  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  container.addEventListener('mouseleave', function () { mouse.active = false; });
  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });
  container.addEventListener('touchend', function () { mouse.active = false; });

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
      if (e.data.key === '--shg-grid-size') initGrid();
    }
  });

  resize();
  loop();
})();
