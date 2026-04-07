(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var container = document.querySelector('.beam-container');
  var fill = document.querySelector('.beam-line__fill');
  var blocks = document.querySelectorAll('.beam-block');
  var ticking = false;

  function update() {
    if (!container || !fill) return;

    var rect = container.getBoundingClientRect();
    var containerTop = rect.top;
    var containerHeight = rect.height;
    var viewportCenter = window.innerHeight * 0.5;

    var progress = (viewportCenter - containerTop) / containerHeight;
    progress = Math.max(0, Math.min(1, progress));

    fill.style.height = (progress * 100) + '%';

    var beamY = containerTop + containerHeight * progress;

    blocks.forEach(function (block) {
      var blockRect = block.getBoundingClientRect();
      var blockCenter = blockRect.top + blockRect.height * 0.3;
      block.classList.toggle('passed', beamY >= blockCenter);
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
