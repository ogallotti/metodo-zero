/* Line Waves — Horizontal sine wave lines stacked vertically via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.lwv-container');
  var canvas = document.querySelector('.lwv-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;
  var time = 0;
  var mouse = { x: 0.5, y: 0.5, active: false };

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
  }

  function render() {
    var lineCount = parseInt(getCSS('--lwv-line-count') || '25');
    var amplitude = parseFloat(getCSS('--lwv-amplitude') || '40');
    var speed = parseFloat(getCSS('--lwv-speed') || '0.8');
    var lineWidth = parseFloat(getCSS('--lwv-line-width') || '1.5');
    var color = parseColor(getCSS('--lwv-line-color') || '#6366f1');

    var dt = 0.016;
    time += dt * speed;

    ctx.clearRect(0, 0, W, H);

    var spacing = H / (lineCount + 1);
    var segments = Math.ceil(W / 4);
    var segW = W / segments;

    for (var i = 0; i < lineCount; i++) {
      var baseY = spacing * (i + 1);
      var lineRatio = i / lineCount;

      // Each line has different phase and frequency
      var phase = i * 0.4;
      var freq = 0.008 + lineRatio * 0.003;
      var amp = amplitude * (0.5 + Math.sin(lineRatio * Math.PI) * 0.5);

      // Opacity gradient — center lines are brighter
      var centerDist = Math.abs(lineRatio - 0.5) * 2;
      var alpha = 0.15 + (1 - centerDist) * 0.35;

      ctx.beginPath();

      for (var s = 0; s <= segments; s++) {
        var x = s * segW;
        var xNorm = x / W;

        // Multi-frequency sine composition
        var y = baseY;
        y += Math.sin(x * freq + time + phase) * amp;
        y += Math.sin(x * freq * 2.3 + time * 1.3 + phase * 0.7) * amp * 0.3;
        y += Math.sin(x * freq * 0.5 + time * 0.7 - phase * 1.2) * amp * 0.5;

        // Mouse influence: ripple near cursor
        if (mouse.active) {
          var mx = mouse.x * W;
          var my = mouse.y * H;
          var dx = x - mx;
          var dy = baseY - my;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var influence = Math.exp(-dist * dist / (80000));
          y += Math.sin(dist * 0.05 - time * 3) * amplitude * 0.5 * influence;
        }

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Gradient stroke
      var grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0)');
      grad.addColorStop(0.15, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')');
      grad.addColorStop(0.5, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (alpha * 1.2) + ')');
      grad.addColorStop(0.85, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')');
      grad.addColorStop(1, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function loop() {
    if (!isVisible) return;
    render();
    animId = requestAnimationFrame(loop);
  }

  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
    mouse.active = true;
  });
  container.addEventListener('mouseleave', function () { mouse.active = false; });
  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = (touch.clientY - rect.top) / rect.height;
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
    }
  });

  resize();
  loop();
})();
