/* Pixel Snow — Falling square snow particles with accumulation via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.psn-container');
  var canvas = document.querySelector('.psn-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;
  var time = 0;

  var flakes = [];
  var accumulation = []; // height map of accumulated snow at bottom
  var maxAccum = 0;

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

    // Reset accumulation
    accumulation = new Float32Array(Math.ceil(W));
    maxAccum = H * 0.08;
    initFlakes();
  }

  function createFlake() {
    return {
      x: Math.random() * W,
      y: -10 - Math.random() * H,
      size: 1 + Math.random() * 3,
      speedY: 0.3 + Math.random() * 1.0,
      drift: (Math.random() - 0.5) * 0.5,
      wobbleAmp: Math.random() * 0.8,
      wobbleFreq: 1 + Math.random() * 2,
      wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.7,
    };
  }

  function initFlakes() {
    var count = parseInt(getCSS('--psn-density') || '200');
    flakes = [];
    for (var i = 0; i < count; i++) {
      var f = createFlake();
      f.y = Math.random() * H; // Spread across screen initially
      flakes.push(f);
    }
  }

  function render() {
    var fallSpeed = parseFloat(getCSS('--psn-fall-speed') || '1');
    var wind = parseFloat(getCSS('--psn-wind') || '0.3');
    var color = parseColor(getCSS('--psn-snow-color') || '#e8ecf0');

    var dt = 0.016;
    time += dt;

    ctx.clearRect(0, 0, W, H);

    // Global wind oscillation
    var windForce = Math.sin(time * 0.3) * wind + Math.sin(time * 0.7) * wind * 0.3;

    // Update and draw flakes
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];

      // Move
      f.y += f.speedY * fallSpeed;
      f.x += f.drift + windForce + Math.sin(time * f.wobbleFreq + f.wobblePhase) * f.wobbleAmp * 0.3;

      // Wrap horizontally
      if (f.x > W + 10) f.x = -10;
      if (f.x < -10) f.x = W + 10;

      // Check if flake hit accumulation
      var col = Math.floor(f.x);
      if (col >= 0 && col < accumulation.length) {
        var groundY = H - accumulation[col];
        if (f.y >= groundY - f.size) {
          // Accumulate
          if (accumulation[col] < maxAccum) {
            accumulation[col] += f.size * 0.3;
            // Spread to neighbors for smooth pile
            if (col > 0) accumulation[col - 1] = Math.max(accumulation[col - 1], accumulation[col] * 0.8);
            if (col < accumulation.length - 1) accumulation[col + 1] = Math.max(accumulation[col + 1], accumulation[col] * 0.8);
          }

          // Reset flake
          f.y = -10 - Math.random() * 50;
          f.x = Math.random() * W;
          continue;
        }
      }

      // Draw pixel flake
      ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + f.opacity + ')';
      ctx.fillRect(Math.round(f.x), Math.round(f.y), f.size, f.size);
    }

    // Draw accumulated snow at bottom
    ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, H);

    for (var c = 0; c < accumulation.length; c++) {
      ctx.lineTo(c, H - accumulation[c]);
    }

    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Lighter top layer
    ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, H);

    for (var c2 = 0; c2 < accumulation.length; c2++) {
      var topY = H - accumulation[c2];
      // Smooth noise for top surface
      var noise = Math.sin(c2 * 0.1 + time * 0.2) * 1.5;
      ctx.lineTo(c2, topY + noise - 2);
    }

    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Slowly melt accumulation (prevent it from growing forever)
    for (var m = 0; m < accumulation.length; m++) {
      accumulation[m] = Math.max(0, accumulation[m] - 0.005);
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
      if (e.data.key === '--psn-density') initFlakes();
    }
  });

  resize();
  loop();
})();
