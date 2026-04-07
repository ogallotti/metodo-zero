/* Grid Motion — Rows of rectangles shifting with mouse X position and inertia via Canvas 2D */
(function () {
  'use strict';

  var container = document.querySelector('.gmo-container');
  var canvas = document.querySelector('.gmo-canvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr, W, H;
  var animId = null;
  var isVisible = true;

  var mouse = { x: 0.5, target: 0.5 };
  var rows = [];

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
    initRows();
  }

  function initRows() {
    var rowCount = parseInt(getCSS('--gmo-row-count') || '8');
    var itemCount = parseInt(getCSS('--gmo-item-count') || '12');
    var rowH = H / rowCount;

    rows = [];
    for (var r = 0; r < rowCount; r++) {
      var speedFactor = (r % 2 === 0 ? 1 : -1) * (0.5 + (r / rowCount) * 1.5);
      var items = [];

      for (var i = 0; i < itemCount + 4; i++) {
        var itemW = 40 + Math.random() * 80;
        items.push({
          width: itemW,
          height: rowH * 0.5 + Math.random() * rowH * 0.3,
          gap: 8 + Math.random() * 16,
          opacity: 0.04 + Math.random() * 0.08,
          radius: 4 + Math.random() * 8,
        });
      }

      rows.push({
        y: r * rowH,
        height: rowH,
        speedFactor: speedFactor,
        offset: 0,
        currentOffset: 0,
        items: items,
      });
    }
  }

  function render() {
    var speedMul = parseFloat(getCSS('--gmo-speed') || '1');
    var inertia = parseFloat(getCSS('--gmo-inertia') || '0.92');
    var color = parseColor(getCSS('--gmo-item-color') || '#ffffff');

    // Update mouse with inertia
    mouse.x += (mouse.target - mouse.x) * (1 - inertia);

    ctx.clearRect(0, 0, W, H);

    var mouseOffset = (mouse.x - 0.5) * W * 0.6 * speedMul;

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];

      // Target offset based on mouse with row-specific speed
      row.offset = mouseOffset * row.speedFactor;
      row.currentOffset += (row.offset - row.currentOffset) * (1 - inertia * 0.98);

      var y = row.y + row.height * 0.25;
      var x = row.currentOffset;

      // Calculate total row width for seamless looping
      var totalW = 0;
      for (var i = 0; i < row.items.length; i++) {
        totalW += row.items[i].width + row.items[i].gap;
      }

      // Ensure we start far enough left to fill the screen
      var startX = x % totalW;
      if (startX > 0) startX -= totalW;

      var drawX = startX - totalW;
      while (drawX < W + totalW) {
        for (var j = 0; j < row.items.length; j++) {
          var item = row.items[j];

          if (drawX + item.width > -100 && drawX < W + 100) {
            // Distance from center for brightness variation
            var centerDist = Math.abs((drawX + item.width * 0.5) / W - 0.5);
            var brightness = 1.0 - centerDist * 0.5;

            ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (item.opacity * brightness) + ')';

            // Rounded rectangle
            var rx = drawX;
            var ry = y;
            var rw = item.width;
            var rh = item.height;
            var rad = item.radius;

            ctx.beginPath();
            ctx.moveTo(rx + rad, ry);
            ctx.lineTo(rx + rw - rad, ry);
            ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
            ctx.lineTo(rx + rw, ry + rh - rad);
            ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
            ctx.lineTo(rx + rad, ry + rh);
            ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
            ctx.lineTo(rx, ry + rad);
            ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
            ctx.closePath();
            ctx.fill();
          }

          drawX += item.width + item.gap;
        }
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
    mouse.target = (e.clientX - rect.left) / rect.width;
  });
  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.target = (touch.clientX - rect.left) / rect.width;
  }, { passive: true });

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
