(function () {
  'use strict';

  var wrapper = document.querySelector('.ic-wrapper');
  if (!wrapper) return;

  var afterImg = wrapper.querySelector('.ic-img--after');
  var divider = wrapper.querySelector('.ic-divider');
  var handle = wrapper.querySelector('.ic-handle');
  var isDragging = false;

  function setPosition(pct) {
    pct = Math.max(0, Math.min(100, pct));
    afterImg.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
    divider.style.left = pct + '%';
    handle.style.left = pct + '%';
  }

  function getPercent(e) {
    var rect = wrapper.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onStart(e) {
    e.preventDefault();
    isDragging = true;
    wrapper.style.cursor = 'col-resize';
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    setPosition(getPercent(e));
  }

  function onEnd() {
    isDragging = false;
    wrapper.style.cursor = 'col-resize';
  }

  handle.addEventListener('mousedown', onStart);
  handle.addEventListener('touchstart', onStart, { passive: false });
  divider.addEventListener('mousedown', onStart);

  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);

  wrapper.addEventListener('click', function (e) {
    if (!isDragging) {
      setPosition(getPercent(e));
    }
  });

  setPosition(50);
})();
