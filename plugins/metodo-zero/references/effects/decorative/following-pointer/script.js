(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var follower = document.querySelector('.fp-follower');
  if (!follower) return;

  var config = {
    stiffness: 0.15,
    damping: 0.7
  };

  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var pos = { x: mouse.x, y: mouse.y };
  var vel = { x: 0, y: 0 };

  var TRAIL_COUNT = 5;
  var trailDots = [];
  var trailPositions = [];

  for (var i = 0; i < TRAIL_COUNT; i++) {
    var dot = document.createElement('div');
    dot.className = 'fp-trail-dot';
    dot.style.opacity = (1 - i / TRAIL_COUNT) * 0.3;
    dot.style.width = (6 - i * 0.8) + 'px';
    dot.style.height = (6 - i * 0.8) + 'px';
    document.body.appendChild(dot);
    trailDots.push(dot);
    trailPositions.push({ x: mouse.x, y: mouse.y });
  }

  var isVisible = true;

  function animate() {
    if (isVisible) {
      var dx = mouse.x - pos.x;
      var dy = mouse.y - pos.y;

      vel.x += dx * config.stiffness;
      vel.y += dy * config.stiffness;
      vel.x *= config.damping;
      vel.y *= config.damping;

      pos.x += vel.x;
      pos.y += vel.y;

      follower.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px, 0) translate(-50%, -50%)';

      var speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      var scale = 1 + Math.min(speed * 0.01, 0.3);
      var angle = Math.atan2(vel.y, vel.x) * (180 / Math.PI);
      follower.style.transform = 'translate3d(' + pos.x + 'px,' + pos.y + 'px, 0) translate(-50%, -50%) scaleX(' + scale + ') scaleY(' + (2 - scale) + ') rotate(' + angle + 'deg)';

      for (var i = 0; i < TRAIL_COUNT; i++) {
        var target = i === 0 ? pos : trailPositions[i - 1];
        trailPositions[i].x += (target.x - trailPositions[i].x) * 0.3;
        trailPositions[i].y += (target.y - trailPositions[i].y) * 0.3;
        trailDots[i].style.transform = 'translate3d(' + trailPositions[i].x + 'px,' + trailPositions[i].y + 'px, 0) translate(-50%, -50%)';
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(follower);

  window.__followingPointerUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };

  animate();
})();
