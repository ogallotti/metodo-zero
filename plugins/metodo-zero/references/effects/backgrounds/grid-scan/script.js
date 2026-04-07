/* Grid Scan — Grid with scanning line that illuminates cells via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.gsc-container');
  var canvas = document.querySelector('.gsc-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;
  var time = 0;

  var cells = []; // Store glow state per cell
  var cols = 0;
  var rowCount = 0;
  var scanY = 0;

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
    var size = parseInt(getCSS('--gsc-grid-size') || '30');
    cols = Math.ceil(W / size) + 1;
    rowCount = Math.ceil(H / size) + 1;

    cells = [];
    for (var r = 0; r < rowCount; r++) {
      cells[r] = [];
      for (var c = 0; c < cols; c++) {
        cells[r][c] = { glow: 0, maxGlow: 0 };
      }
    }
  }

  function render() {
    var size = parseInt(getCSS('--gsc-grid-size') || '30');
    var speed = parseFloat(getCSS('--gsc-scan-speed') || '1');
    var glowDuration = parseFloat(getCSS('--gsc-glow-duration') || '2');
    var glowColor = parseColor(getCSS('--gsc-glow-color') || '#00e5ff');
    var gridColor = parseColor(getCSS('--gsc-grid-color') || '#1a2040');

    var dt = 0.016;
    time += dt;

    // Move scan line
    scanY += speed * 80 * dt;
    if (scanY > H + 60) scanY = -60;

    var fadeRate = dt / glowDuration;

    ctx.clearRect(0, 0, W, H);

    // Draw grid and handle glow
    for (var r = 0; r < rowCount; r++) {
      for (var c = 0; c < cols; c++) {
        var x = c * size;
        var y = r * size;
        var cellCenterY = y + size * 0.5;

        // Activate cell if scan line is near
        var distToScan = Math.abs(cellCenterY - scanY);
        if (distToScan < 30) {
          var activation = 1.0 - distToScan / 30;
          if (cells[r] && cells[r][c]) {
            cells[r][c].glow = Math.max(cells[r][c].glow, activation);
            cells[r][c].maxGlow = Math.max(cells[r][c].maxGlow, activation);
          }
        }

        // Fade glow
        if (cells[r] && cells[r][c] && cells[r][c].glow > 0) {
          cells[r][c].glow = Math.max(0, cells[r][c].glow - fadeRate);
        }

        var glow = (cells[r] && cells[r][c]) ? cells[r][c].glow : 0;
        var gap = 2;

        // Base grid cell
        var baseAlpha = 0.15;
        var alpha = baseAlpha + glow * 0.6;

        var cr = gridColor.r + (glowColor.r - gridColor.r) * glow;
        var cg = gridColor.g + (glowColor.g - gridColor.g) * glow;
        var cb = gridColor.b + (glowColor.b - gridColor.b) * glow;

        ctx.fillStyle = 'rgba(' + Math.round(cr) + ',' + Math.round(cg) + ',' + Math.round(cb) + ',' + alpha + ')';
        ctx.fillRect(x + gap, y + gap, size - gap * 2, size - gap * 2);

        // Glow effect for active cells
        if (glow > 0.1) {
          ctx.shadowColor = 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',' + (glow * 0.5) + ')';
          ctx.shadowBlur = 12 * glow;
          ctx.fillStyle = 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',' + (glow * 0.3) + ')';
          ctx.fillRect(x + gap + 2, y + gap + 2, size - gap * 2 - 4, size - gap * 2 - 4);
          ctx.shadowBlur = 0;
        }
      }
    }

    // Draw scan line
    var scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    scanGrad.addColorStop(0, 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',0)');
    scanGrad.addColorStop(0.4, 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',0.15)');
    scanGrad.addColorStop(0.5, 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',0.4)');
    scanGrad.addColorStop(0.6, 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',0.15)');
    scanGrad.addColorStop(1, 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',0)');

    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 40, W, 80);

    // Bright center line
    ctx.strokeStyle = 'rgba(' + glowColor.r + ',' + glowColor.g + ',' + glowColor.b + ',0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(W, scanY);
    ctx.stroke();
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
      if (e.data.key === '--gsc-grid-size') initGrid();
    }
  });

  resize();
  loop();
})();
