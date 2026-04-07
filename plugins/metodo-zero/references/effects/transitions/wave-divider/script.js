(function () {
  'use strict';

  // Wave dividers are CSS-only animated SVGs
  // This script handles dynamic color updates from parent
  // and ensures proper fill colors match the next section

  var dividers = document.querySelectorAll('.wave-divider');

  dividers.forEach(function (divider) {
    var section = divider.parentElement;
    var nextSection = section.nextElementSibling;
    if (!nextSection) return;

    var fill = getComputedStyle(nextSection).backgroundColor;
    var paths = divider.querySelectorAll('path');

    paths.forEach(function (path) {
      if (!path.getAttribute('data-keep-fill')) {
        path.setAttribute('fill', fill);
      }
    });
  });
})();
