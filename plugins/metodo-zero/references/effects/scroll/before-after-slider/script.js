(function () {
  'use strict';

  var sliders = document.querySelectorAll('.ba-slider');

  sliders.forEach(function (slider) {
    var afterLayer = slider.querySelector('.ba-slider__after');
    var handle = slider.querySelector('.ba-slider__handle');
    var isDragging = false;

    function setPosition(x) {
      var rect = slider.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0.02, Math.min(0.98, pos));
      var pct = pos * 100;

      afterLayer.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }

    function onPointerDown(e) {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      setPosition(e.clientX);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(e.clientX);
    }

    function onPointerUp() {
      isDragging = false;
    }

    slider.addEventListener('pointerdown', onPointerDown);
    slider.addEventListener('pointermove', onPointerMove);
    slider.addEventListener('pointerup', onPointerUp);
    slider.addEventListener('pointercancel', onPointerUp);

    // Keyboard support
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('aria-label', 'Before and after comparison slider');

    slider.addEventListener('keydown', function (e) {
      var rect = slider.getBoundingClientRect();
      var currentLeft = parseFloat(handle.style.left) || 50;
      var step = 2;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        var newVal = Math.max(2, currentLeft - step);
        setPosition(rect.left + (newVal / 100) * rect.width);
        slider.setAttribute('aria-valuenow', Math.round(newVal));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        var newValR = Math.min(98, currentLeft + step);
        setPosition(rect.left + (newValR / 100) * rect.width);
        slider.setAttribute('aria-valuenow', Math.round(newValR));
      }
    });
  });
})();
