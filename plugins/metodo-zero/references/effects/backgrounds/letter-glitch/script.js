/* Letter Glitch — Grid of random characters with color glitch blocks via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.lgl-container');
  var canvas = document.querySelector('.lgl-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;
  var time = 0;
  var lastGlitchTime = 0;

  var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?<>{}[]=/\\|~^*.+-:;';
  var grid = [];
  var glitchBlocks = [];
  var cols = 0;
  var rowCount = 0;

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

  function randomChar() {
    return charSet[Math.floor(Math.random() * charSet.length)];
  }

  function initGrid() {
    var fs = parseInt(getCSS('--lgl-font-size') || '12');
    var cellW = fs * 0.7;
    var cellH = fs * 1.2;
    cols = Math.ceil(W / cellW) + 1;
    rowCount = Math.ceil(H / cellH) + 1;

    grid = [];
    for (var r = 0; r < rowCount; r++) {
      grid[r] = [];
      for (var c = 0; c < cols; c++) {
        grid[r][c] = {
          char: randomChar(),
          brightness: 0.15 + Math.random() * 0.3,
          changeRate: 0.001 + Math.random() * 0.01,
        };
      }
    }
  }

  function spawnGlitchBlock() {
    var colors = [
      getCSS('--lgl-color-1') || '#ff003c',
      getCSS('--lgl-color-2') || '#00ff87',
      getCSS('--lgl-color-3') || '#0088ff',
      getCSS('--lgl-color-4') || '#ff00ff',
    ];

    var blockW = 30 + Math.random() * 200;
    var blockH = 8 + Math.random() * 40;

    glitchBlocks.push({
      x: Math.random() * W,
      y: Math.random() * H,
      w: blockW,
      h: blockH,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.1 + Math.random() * 0.3,
      life: 0.05 + Math.random() * 0.2,
      hasText: Math.random() > 0.4,
    });
  }

  function render() {
    var fs = parseInt(getCSS('--lgl-font-size') || '12');
    var speed = parseFloat(getCSS('--lgl-glitch-speed') || '1');
    var textColor = parseColor(getCSS('--lgl-text-color') || '#2a3a2a');

    var dt = 0.016;
    time += dt;

    ctx.fillStyle = getCSS('--lgl-bg') || '#0a0f0a';
    ctx.fillRect(0, 0, W, H);

    var cellW = fs * 0.7;
    var cellH = fs * 1.2;

    ctx.font = fs + 'px "JetBrains Mono", "Courier New", monospace';
    ctx.textBaseline = 'top';

    // Draw character grid
    for (var r = 0; r < rowCount; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = grid[r][c];

        // Randomly change characters
        if (Math.random() < cell.changeRate * speed) {
          cell.char = randomChar();
          cell.brightness = Math.min(0.6, cell.brightness + 0.1);
        }

        // Fade brightness back
        cell.brightness = Math.max(0.1, cell.brightness - 0.001);

        var alpha = cell.brightness;
        ctx.fillStyle = 'rgba(' + textColor.r + ',' + textColor.g + ',' + textColor.b + ',' + alpha + ')';
        ctx.fillText(cell.char, c * cellW, r * cellH);
      }
    }

    // Spawn glitch blocks
    if (time - lastGlitchTime > 0.1 / speed && Math.random() < 0.3 * speed) {
      var burstCount = 1 + Math.floor(Math.random() * 4);
      for (var b = 0; b < burstCount; b++) {
        spawnGlitchBlock();
      }
      lastGlitchTime = time;
    }

    // Draw glitch blocks
    for (var g = glitchBlocks.length - 1; g >= 0; g--) {
      var blk = glitchBlocks[g];
      var col = parseColor(blk.color);

      // Colored rectangle
      ctx.fillStyle = 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + blk.alpha + ')';
      ctx.fillRect(blk.x, blk.y, blk.w, blk.h);

      // Draw characters on top of glitch block if flagged
      if (blk.hasText) {
        ctx.fillStyle = 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (blk.alpha * 2) + ')';
        ctx.font = (fs + 2) + 'px "JetBrains Mono", monospace';
        var textCols = Math.floor(blk.w / (fs * 0.7));
        var textRows = Math.floor(blk.h / (fs * 1.2));
        for (var tr = 0; tr < Math.max(1, textRows); tr++) {
          for (var tc = 0; tc < textCols; tc++) {
            ctx.fillText(randomChar(), blk.x + tc * fs * 0.7, blk.y + tr * fs * 1.2);
          }
        }
        ctx.font = fs + 'px "JetBrains Mono", "Courier New", monospace';
      }

      // Border on some blocks
      if (Math.random() > 0.5) {
        ctx.strokeStyle = 'rgba(' + col.r + ',' + col.g + ',' + col.b + ',' + (blk.alpha * 1.5) + ')';
        ctx.lineWidth = 1;
        ctx.strokeRect(blk.x, blk.y, blk.w, blk.h);
      }

      blk.life -= dt;
      if (blk.life <= 0) glitchBlocks.splice(g, 1);
    }

    // Occasional horizontal shift glitch
    if (Math.random() < 0.015 * speed) {
      var shiftY = Math.random() * H;
      var shiftH = 2 + Math.random() * 15;
      var shiftX = (Math.random() - 0.5) * 20;
      try {
        var shiftData = ctx.getImageData(0, shiftY * dpr, W * dpr, shiftH * dpr);
        ctx.putImageData(shiftData, shiftX * dpr, shiftY * dpr);
      } catch (e) { /* ignore security errors */ }
    }

    // Keep glitch blocks under control
    while (glitchBlocks.length > 30) glitchBlocks.shift();
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
      if (e.data.key === '--lgl-font-size') initGrid();
    }
  });

  resize();
  loop();
})();
