(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  var colors = [
    getComputedStyle(document.documentElement).getPropertyValue('--sp-sparkle-color-1').trim() || '#fbbf24',
    getComputedStyle(document.documentElement).getPropertyValue('--sp-sparkle-color-2').trim() || '#f472b6',
    getComputedStyle(document.documentElement).getPropertyValue('--sp-sparkle-color-3').trim() || '#60a5fa',
  ];

  function createSparkleSVG(color, size) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z');
    path.setAttribute('fill', color);

    svg.appendChild(path);
    return svg;
  }

  document.querySelectorAll('.sp-wrapper').forEach(function (wrapper) {
    var sparkleCount = parseInt(wrapper.dataset.sparkleCount, 10) || 20;
    var sparkleInterval = parseInt(wrapper.dataset.sparkleInterval, 10) || 300;
    var isVisible = false;
    var intervalId = null;
    var activeSparkles = 0;

    function spawnSparkle() {
      if (activeSparkles >= sparkleCount || !isVisible) return;

      var rect = wrapper.getBoundingClientRect();
      var sizeStr = getComputedStyle(document.documentElement).getPropertyValue('--sp-sparkle-size').trim() || '10px';
      var size = parseInt(sizeStr, 10);
      var randomSize = size * (0.5 + Math.random() * 1);

      var color = colors[Math.floor(Math.random() * colors.length)];

      var sparkle = document.createElement('span');
      sparkle.className = 'sp-sparkle';

      var x = Math.random() * (rect.width + 40) - 20;
      var y = Math.random() * (rect.height + 20) - 10;

      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      sparkle.style.width = randomSize + 'px';
      sparkle.style.height = randomSize + 'px';

      var duration = 0.6 + Math.random() * 0.8;
      sparkle.style.animationDuration = duration + 's';

      sparkle.appendChild(createSparkleSVG(color, randomSize));
      wrapper.appendChild(sparkle);
      activeSparkles++;

      setTimeout(function () {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
        activeSparkles--;
      }, duration * 1000);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!intervalId) {
              intervalId = setInterval(spawnSparkle, sparkleInterval);
            }
          } else {
            clearInterval(intervalId);
            intervalId = null;
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(wrapper);

    reducedMotion.addEventListener('change', function (e) {
      if (e.matches) {
        clearInterval(intervalId);
        intervalId = null;
        wrapper.querySelectorAll('.sp-sparkle').forEach(function (s) {
          s.remove();
        });
      } else if (isVisible) {
        intervalId = setInterval(spawnSparkle, sparkleInterval);
      }
    });
  });
})();
