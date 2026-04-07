(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(function (card) {
    const wrapper = card.closest('.tilt-card-wrapper');
    let bounds;
    let rafId = null;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 150ms ease, box-shadow 150ms ease';
    }

    function onMouseMove(e) {
      if (!bounds) return;
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function () {
        var x = e.clientX - bounds.left;
        var y = e.clientY - bounds.top;
        var centerX = bounds.width / 2;
        var centerY = bounds.height / 2;

        var maxTilt = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tilt-max')) || 15;
        var scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tilt-scale')) || 1.05;

        var rotateX = ((y - centerY) / centerY) * -maxTilt;
        var rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform =
          'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(' + scale + ',' + scale + ',' + scale + ')';

        var percentX = (x / bounds.width) * 100;
        var percentY = (y / bounds.height) * 100;
        card.style.setProperty('--mouse-x', percentX + '%');
        card.style.setProperty('--mouse-y', percentY + '%');
      });
    }

    function onMouseLeave() {
      if (rafId) cancelAnimationFrame(rafId);
      var transition = getComputedStyle(document.documentElement).getPropertyValue('--tilt-transition').trim() || '400ms';
      card.style.transition = 'transform ' + transition + ' cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow ' + transition + ' ease';
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      bounds = null;
    }

    (wrapper || card).addEventListener('mouseenter', onMouseEnter);
    (wrapper || card).addEventListener('mousemove', onMouseMove);
    (wrapper || card).addEventListener('mouseleave', onMouseLeave);
  });
})();
