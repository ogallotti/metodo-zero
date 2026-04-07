(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var boxes = document.querySelectorAll('.star-bdr');

  boxes.forEach(function (box) {
    var canvas = box.querySelector('.star-bdr__canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var stars = [];
    var count = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--star-bdr-count')) || 15;
    var speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--star-bdr-speed')) || 8;
    var starColor = getComputedStyle(document.documentElement).getPropertyValue('--star-bdr-color').trim() || '#fbbf24';
    var starSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--star-bdr-size')) || 4;

    function resize() {
      var rect = box.getBoundingClientRect();
      canvas.width = rect.width + 16;
      canvas.height = rect.height + 16;
    }

    function getPerimeterPoint(t, w, h, r) {
      // Walk around rectangle perimeter (0-1 maps to full loop)
      var perimeter = 2 * (w + h) - 8 * r + 2 * Math.PI * r;
      var d = t * perimeter;
      var straight = {
        top: w - 2 * r,
        right: h - 2 * r,
        bottom: w - 2 * r,
        left: h - 2 * r
      };
      var cornerArc = (Math.PI / 2) * r;

      // Top edge
      if (d < straight.top) return { x: r + d, y: 0 };
      d -= straight.top;

      // Top-right corner
      if (d < cornerArc) {
        var angle = -Math.PI / 2 + (d / r);
        return { x: w - r + Math.cos(angle) * r, y: r + Math.sin(angle) * r };
      }
      d -= cornerArc;

      // Right edge
      if (d < straight.right) return { x: w, y: r + d };
      d -= straight.right;

      // Bottom-right corner
      if (d < cornerArc) {
        var angle = 0 + (d / r);
        return { x: w - r + Math.cos(angle) * r, y: h - r + Math.sin(angle) * r };
      }
      d -= cornerArc;

      // Bottom edge
      if (d < straight.bottom) return { x: w - r - d, y: h };
      d -= straight.bottom;

      // Bottom-left corner
      if (d < cornerArc) {
        var angle = Math.PI / 2 + (d / r);
        return { x: r + Math.cos(angle) * r, y: h - r + Math.sin(angle) * r };
      }
      d -= cornerArc;

      // Left edge
      if (d < straight.left) return { x: 0, y: h - r - d };
      d -= straight.left;

      // Top-left corner
      if (d < cornerArc) {
        var angle = Math.PI + (d / r);
        return { x: r + Math.cos(angle) * r, y: r + Math.sin(angle) * r };
      }

      return { x: r, y: 0 };
    }

    function initStars() {
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          t: Math.random(),
          speed: (0.5 + Math.random() * 0.5) / speed,
          size: starSize * (0.5 + Math.random() * 1),
          flicker: Math.random() * Math.PI * 2,
          flickerSpeed: 2 + Math.random() * 3
        });
      }
    }

    var animId;
    function draw(time) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var w = canvas.width;
      var h = canvas.height;
      var radius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--star-bdr-radius')) || 16;
      radius = Math.min(radius + 8, Math.min(w, h) / 2);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.t = (s.t + s.speed * 0.001) % 1;

        var pos = getPerimeterPoint(s.t, w, h, radius);
        var alpha = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.001 * s.flickerSpeed + s.flicker));

        // Star glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = starColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, s.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle
        ctx.strokeStyle = starColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.moveTo(pos.x - s.size, pos.y);
        ctx.lineTo(pos.x + s.size, pos.y);
        ctx.moveTo(pos.x, pos.y - s.size);
        ctx.lineTo(pos.x, pos.y + s.size);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    animId = requestAnimationFrame(draw);

    window.addEventListener('resize', function () {
      resize();
    });
  });
})();
