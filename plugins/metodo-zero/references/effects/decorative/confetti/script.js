(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const canvas = document.querySelector('.cf-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let isVisible = true;

  const config = {
    particleCount: 80,
    gravity: 0.5,
    spread: 70
  };

  const colors = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createConfetti(x, y) {
    var newParticles = [];
    for (var i = 0; i < config.particleCount; i++) {
      var angle = ((Math.random() * config.spread * 2 - config.spread) - 90) * (Math.PI / 180);
      var velocity = Math.random() * 8 + 4;
      var shape = Math.random() > 0.5 ? 'rect' : 'circle';
      newParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        life: 1,
        decay: Math.random() * 0.005 + 0.005,
        shape: shape,
        wobble: Math.random() * 10
      });
    }
    particles = particles.concat(newParticles);
  }

  function animate() {
    if (!isVisible) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.vy += config.gravity * 0.1;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;
      p.wobble += 0.1;
      p.x += Math.sin(p.wobble) * 0.5;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  var btn = document.querySelector('.cf-btn');
  if (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      createConfetti(rect.left + rect.width / 2, rect.top);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.cf-btn')) return;
    createConfetti(e.clientX, e.clientY);
  });

  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(canvas);

  window.__confettiUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };

  window.__confettiBurst = function (x, y) {
    createConfetti(x || width / 2, y || height / 2);
  };

  resize();
  window.addEventListener('resize', resize);
  animate();

  setTimeout(function () {
    createConfetti(width / 2, height / 2);
  }, 500);
})();
