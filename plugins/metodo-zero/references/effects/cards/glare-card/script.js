(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var cards = document.querySelectorAll('.glare-card');

  cards.forEach(function (card) {
    var wrapper = card.closest('.glare-wrapper');
    var bounds;
    var rafId = null;

    function onEnter() {
      bounds = card.getBoundingClientRect();
    }

    function onMove(e) {
      if (!bounds) return;
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function () {
        var x = e.clientX - bounds.left;
        var y = e.clientY - bounds.top;
        var centerX = bounds.width / 2;
        var centerY = bounds.height / 2;

        var maxTilt = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--glare-tilt')) || 8;
        var rotateX = ((y - centerY) / centerY) * -maxTilt;
        var rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

        var pctX = (x / bounds.width) * 100;
        var pctY = (y / bounds.height) * 100;
        card.style.setProperty('--glare-x', pctX + '%');
        card.style.setProperty('--glare-y', pctY + '%');
      });
    }

    function onLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      bounds = null;
    }

    var target = wrapper || card;
    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mousemove', onMove);
    target.addEventListener('mouseleave', onLeave);
  });
})();
