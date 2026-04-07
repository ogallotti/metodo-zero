(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var dividers = document.querySelectorAll('.morph-divider');
  if (!dividers.length) return;

  var ticking = false;

  var shapePresets = [
    // Wave
    function (t) {
      var points = [];
      var steps = 12;
      for (var i = 0; i <= steps; i++) {
        var x = (i / steps) * 100;
        var y = 30 + Math.sin((i / steps) * Math.PI * 2 + t * Math.PI * 2) * 25;
        points.push(x + '% ' + y + '%');
      }
      points.push('100% 100%', '0% 100%');
      return 'polygon(' + points.join(', ') + ')';
    },
    // Blob
    function (t) {
      var points = [];
      var steps = 10;
      for (var i = 0; i <= steps; i++) {
        var x = (i / steps) * 100;
        var y = 40 + Math.sin((i / steps) * Math.PI * 3 + t * Math.PI * 2) * 15
                   + Math.cos((i / steps) * Math.PI * 1.5 + t * Math.PI) * 10;
        points.push(x + '% ' + y + '%');
      }
      points.push('100% 100%', '0% 100%');
      return 'polygon(' + points.join(', ') + ')';
    },
    // Steps
    function (t) {
      var points = [];
      var steps = 8;
      for (var i = 0; i <= steps; i++) {
        var x = (i / steps) * 100;
        var base = 35 + Math.sin(t * Math.PI * 2 + i * 0.8) * 20;
        var y = Math.round(base / 10) * 10;
        points.push(x + '% ' + y + '%');
        if (i < steps) {
          points.push(((i + 1) / steps) * 100 + '% ' + y + '%');
        }
      }
      points.push('100% 100%', '0% 100%');
      return 'polygon(' + points.join(', ') + ')';
    },
    // Zigzag
    function (t) {
      var points = [];
      var teeth = 6;
      for (var i = 0; i <= teeth; i++) {
        var x = (i / teeth) * 100;
        var yTop = 20 + Math.sin(t * Math.PI * 2) * 10;
        var yBot = 60 + Math.cos(t * Math.PI * 2) * 10;
        if (i > 0) {
          points.push(x + '% ' + (i % 2 === 0 ? yTop : yBot) + '%');
        } else {
          points.push('0% ' + yTop + '%');
        }
      }
      points.push('100% 100%', '0% 100%');
      return 'polygon(' + points.join(', ') + ')';
    }
  ];

  function getSpeed() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--morph-speed')) || 1;
  }

  function update() {
    var scrollY = window.scrollY;
    var viewH = window.innerHeight;
    var speed = getSpeed();

    dividers.forEach(function (div, i) {
      var section = div.parentElement;
      var rect = section.getBoundingClientRect();
      var sectionTop = rect.top + scrollY;
      var sectionH = rect.height;

      var progress = (scrollY - sectionTop + viewH) / (sectionH + viewH);
      progress = Math.max(0, Math.min(1, progress));

      var t = progress * speed;
      var shapeIndex = i % shapePresets.length;
      var clipPath = shapePresets[shapeIndex](t);
      div.style.clipPath = clipPath;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();
