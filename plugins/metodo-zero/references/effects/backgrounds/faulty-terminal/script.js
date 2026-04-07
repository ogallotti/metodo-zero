/* Faulty Terminal — Matrix-like falling characters on CRT display via Canvas 2D */
(function () {
  'use strict';

  const container = document.querySelector('.ftr-container');
  const canvas = document.querySelector('.ftr-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr, W, H;
  let animId = null;
  let isVisible = true;
  let time = 0;

  const config = {
    fontSize: 14,
    speed: 1,
    glow: 0.6,
    charSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=<>{}[]|/\\~^',
    katakana: '\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F3',
  };

  let columns = [];
  let glitchBlocks = [];
  let colCount = 0;
  let rowCount = 0;

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

    var fs = parseFloat(getCSS('--ftr-font-size') || config.fontSize);
    colCount = Math.ceil(W / fs);
    rowCount = Math.ceil(H / fs);

    // Reinitialize columns
    columns = [];
    for (var i = 0; i < colCount; i++) {
      columns.push({
        y: Math.random() * rowCount * -1,
        speed: 0.3 + Math.random() * 1.2,
        chars: [],
        brightness: [],
      });
      // Pre-fill characters
      for (var j = 0; j < rowCount + 10; j++) {
        columns[i].chars.push(randomChar());
        columns[i].brightness.push(Math.random());
      }
    }
  }

  function randomChar() {
    var allChars = config.charSet + config.katakana;
    return allChars[Math.floor(Math.random() * allChars.length)];
  }

  function spawnGlitch() {
    if (glitchBlocks.length > 8) return;
    glitchBlocks.push({
      x: Math.random() * W,
      y: Math.random() * H,
      w: 20 + Math.random() * 120,
      h: 4 + Math.random() * 20,
      life: 0.05 + Math.random() * 0.15,
      color: Math.random() > 0.5 ? 'rgba(255,0,0,0.15)' : 'rgba(0,255,65,0.1)',
      offsetX: (Math.random() - 0.5) * 10,
    });
  }

  function render() {
    var fs = parseFloat(getCSS('--ftr-font-size') || config.fontSize);
    var speedMul = parseFloat(getCSS('--ftr-glitch-speed') || config.speed);
    var glow = parseFloat(getCSS('--ftr-glow') || config.glow);
    var textColor = parseColor(getCSS('--ftr-text-color') || '#00ff41');

    // Fade effect — semi-transparent black overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = fs + 'px "JetBrains Mono", "Courier New", monospace';
    ctx.textBaseline = 'top';

    // Draw falling columns
    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      col.y += col.speed * speedMul;

      // Randomly change a character
      if (Math.random() < 0.02 * speedMul) {
        var idx = Math.floor(Math.random() * col.chars.length);
        col.chars[idx] = randomChar();
        col.brightness[idx] = 1.0;
      }

      var headRow = Math.floor(col.y);

      for (var j = Math.max(0, headRow - rowCount - 5); j <= headRow; j++) {
        var charIdx = ((j % col.chars.length) + col.chars.length) % col.chars.length;
        var screenY = (j - (col.y - rowCount)) * fs;

        if (screenY < -fs || screenY > H + fs) continue;

        var fadePos = (headRow - j) / rowCount;
        var alpha;

        if (j === headRow) {
          // Head character — brightest
          alpha = 1.0;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          if (glow > 0) {
            ctx.shadowColor = 'rgb(' + textColor.r + ',' + textColor.g + ',' + textColor.b + ')';
            ctx.shadowBlur = 15 * glow;
          }
        } else if (j === headRow - 1) {
          alpha = 0.9;
          ctx.fillStyle = 'rgba(' + textColor.r + ',' + textColor.g + ',' + textColor.b + ',' + alpha + ')';
          ctx.shadowBlur = 8 * glow;
        } else {
          alpha = Math.max(0, 1.0 - fadePos * 1.2) * col.brightness[charIdx];
          ctx.fillStyle = 'rgba(' + textColor.r + ',' + textColor.g + ',' + textColor.b + ',' + (alpha * 0.7) + ')';
          ctx.shadowBlur = 0;
        }

        if (alpha > 0.01) {
          ctx.fillText(col.chars[charIdx], i * fs, screenY);
        }
      }

      ctx.shadowBlur = 0;

      // Reset column when it has scrolled far enough
      if (col.y > rowCount * 2) {
        col.y = Math.random() * rowCount * -0.5;
        col.speed = 0.3 + Math.random() * 1.2;
      }
    }

    // Glitch blocks
    if (Math.random() < 0.03 * speedMul) spawnGlitch();

    for (var g = glitchBlocks.length - 1; g >= 0; g--) {
      var blk = glitchBlocks[g];
      ctx.fillStyle = blk.color;
      ctx.fillRect(blk.x + blk.offsetX, blk.y, blk.w, blk.h);
      blk.life -= 0.016;
      if (blk.life <= 0) glitchBlocks.splice(g, 1);
    }

    // Occasional horizontal tear
    if (Math.random() < 0.01 * speedMul) {
      var tearY = Math.random() * H;
      var tearH = 1 + Math.random() * 3;
      var tearData = ctx.getImageData(0, tearY * dpr, W * dpr, tearH * dpr);
      ctx.putImageData(tearData, (Math.random() - 0.5) * 10 * dpr, (tearY + (Math.random() - 0.5) * 2) * dpr);
    }
  }

  function loop() {
    if (!isVisible) return;
    time += 0.016;
    render();
    animId = requestAnimationFrame(loop);
  }

  // Visibility
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

  // Resize
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  // Param updates
  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
    }
  });

  resize();
  // Clear canvas fully on first frame
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);
  loop();
})();
