(function () {
  'use strict';
  // Progressive blur is purely CSS-driven via layered backdrop-filter.
  // This script only handles IntersectionObserver for performance.

  var container = document.querySelector('.pb-container');
  if (!container) return;

  var observer = new IntersectionObserver(function (entries) {
    var overlay = container.querySelector('.pb-overlay');
    if (overlay) {
      overlay.style.visibility = entries[0].isIntersecting ? 'visible' : 'hidden';
    }
  }, { threshold: 0 });

  observer.observe(container);
})();
