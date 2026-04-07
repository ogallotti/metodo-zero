/* Floating Lines — Gently drifting diagonal lines via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.fln-container');
  var canvas = document.querySelector('.fln-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;
  var lines = [];

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

  function createLine() {
    var angle = (Math.random() * 60 + 15) * (Math.PI / 180); // 15-75 degrees
    if (Math.random() > 0.5) angle = Math.PI - angle;
    var len = 100 + Math.random() * 400;
    var speed = 0.2 + Math.random() * 0.8;
    var drift = (Math.random() - 0.5) * 0.3;
    return {
      x: Math.random() * (W + 400) - 200,
      y: Math.random() * (H + 400) - 200,
      angle: angle,
      length: len,
      width: 0.5 + Math.random() * 1.5,
      speed: speed,
      drift: drift,
      opacity: 0.03 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
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

    var count = parseInt(getCSS('--fln-line-count') || '40');
    while (lines.length < count) lines.push(createLine());
    while (lines.length > count) lines.pop();
  }

  function render() {
    var speedMul = parseFloat(getCSS('--fln-speed') || '0.5');
    var opacityMul = parseFloat(getCSS('--fln-opacity') || '0.12');
    var color = parseColor(getCSS('--fln-line-color') || '#ffffff');

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];

      // Move
      l.x += Math.cos(l.angle + Math.PI * 0.5) * l.speed * speedMul;
      l.y += Math.sin(l.angle + Math.PI * 0.5) * l.speed * speedMul;
      l.x += l.drift * speedMul;

      // Slight angle oscillation
      l.phase += 0.003 * speedMul;
      var currentAngle = l.angle + Math.sin(l.phase) * 0.05;

      // Wrap around
      if (l.x > W + 300) l.x = -300;
      if (l.x < -300) l.x = W + 300;
      if (l.y > H + 300) l.y = -300;
      if (l.y < -300) l.y = H + 300;

      var dx = Math.cos(currentAngle) * l.length * 0.5;
      var dy = Math.sin(currentAngle) * l.length * 0.5;

      var alpha = l.opacity * (opacityMul / 0.12);

      // Gradient along line for soft edges
      var grad = ctx.createLinearGradient(
        l.x - dx, l.y - dy,
        l.x + dx, l.y + dy
      );
      grad.addColorStop(0, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0)');
      grad.addColorStop(0.2, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')');
      grad.addColorStop(0.8, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')');
      grad.addColorStop(1, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = l.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(l.x - dx, l.y - dy);
      ctx.lineTo(l.x + dx, l.y + dy);
      ctx.stroke();
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
    }
  });

  resize();
  loop();
})();
