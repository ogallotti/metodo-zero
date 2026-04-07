(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var boxes = document.querySelectorAll('.elec-bdr');

  boxes.forEach(function (box) {
    var canvas = box.querySelector('.elec-bdr__canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var color = getComputedStyle(document.documentElement).getPropertyValue('--elec-color').trim() || '#38bdf8';
    var arcCount = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--elec-intensity')) || 6;
    var flickerSpeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--elec-speed')) || 60;

    function resize() {
      var rect = box.getBoundingClientRect();
      canvas.width = rect.width + 12;
      canvas.height = rect.height + 12;
    }

    function getPerimeterPoint(t, w, h, pad) {
      var perim = 2 * (w + h);
      var d = t * perim;
      if (d < w) return { x: d, y: 0 };
      d -= w;
      if (d < h) return { x: w, y: d };
      d -= h;
      if (d < w) return { x: w - d, y: h };
      d -= w;
      return { x: 0, y: h - d };
    }

    function drawLightning(x1, y1, x2, y2, displacement, ctx) {
      if (displacement < 2) {
        ctx.lineTo(x2, y2);
        return;
      }
      var midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
      var midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;
      drawLightning(x1, y1, midX, midY, displacement / 2, ctx);
      drawLightning(midX, midY, x2, y2, displacement / 2, ctx);
    }

    var arcs = [];
    for (var i = 0; i < arcCount; i++) {
      arcs.push({
        t: Math.random(),
        length: 0.05 + Math.random() * 0.1,
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    var lastTime = 0;

    function draw(time) {
      if (time - lastTime < flickerSpeed) {
        requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var w = canvas.width;
      var h = canvas.height;

      for (var i = 0; i < arcs.length; i++) {
        var arc = arcs[i];

        // Randomly reposition arcs
        if (Math.random() < 0.05) {
          arc.t = Math.random();
        }

        var start = getPerimeterPoint(arc.t, w, h);
        var end = getPerimeterPoint((arc.t + arc.length) % 1, w, h);

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = arc.alpha * (0.5 + Math.random() * 0.5);
        ctx.shadowBlur = 6;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        drawLightning(start.x, start.y, end.x, end.y, 15, ctx);
        ctx.stroke();

        // Thinner bright core
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = arc.alpha;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        drawLightning(start.x, start.y, end.x, end.y, 8, ctx);
        ctx.stroke();

        ctx.restore();

        arc.alpha = 0.2 + Math.random() * 0.8;
      }

      requestAnimationFrame(draw);
    }

    resize();
    requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
  });
})();
