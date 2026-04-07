(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var buttons = document.querySelectorAll('.ripple-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var size = Math.max(rect.width, rect.height) * 2;

      var wave = document.createElement('span');
      wave.className = 'ripple-btn__wave';
      wave.style.width = size + 'px';
      wave.style.height = size + 'px';
      wave.style.left = (x - size / 2) + 'px';
      wave.style.top = (y - size / 2) + 'px';

      btn.appendChild(wave);

      var duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ripple-duration')) || 600;

      setTimeout(function () {
        wave.remove();
      }, duration);
    });
  });
})();
