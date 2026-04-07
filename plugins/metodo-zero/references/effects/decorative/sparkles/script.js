(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var config = {
    density: 20,
    speed: 1.5
  };

  var containers = document.querySelectorAll('.sp-container');
  if (!containers.length) return;

  function createSparkleSVG(size, color) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z');
    path.setAttribute('fill', color);
    svg.appendChild(path);

    return svg;
  }

  function getStyle() {
    var cs = getComputedStyle(document.documentElement);
    return {
      color: cs.getPropertyValue('--sp-color').trim() || '#fbbf24',
      sizeMin: parseFloat(cs.getPropertyValue('--sp-size-min')) || 4,
      sizeMax: parseFloat(cs.getPropertyValue('--sp-size-max')) || 12
    };
  }

  function spawnSparkle(container) {
    var style = getStyle();
    var size = Math.random() * (style.sizeMax - style.sizeMin) + style.sizeMin;
    var sparkle = document.createElement('span');
    sparkle.className = 'sp-sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.setProperty('--sp-duration', config.speed + 's');
    sparkle.style.animationDelay = Math.random() * config.speed + 's';
    sparkle.appendChild(createSparkleSVG(size, style.color));
    container.appendChild(sparkle);

    setTimeout(function () {
      if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
    }, config.speed * 2000);
  }

  containers.forEach(function (container) {
    var isVisible = true;

    var observer = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(container);

    for (var i = 0; i < config.density; i++) {
      spawnSparkle(container);
    }

    setInterval(function () {
      if (!isVisible) return;
      var existing = container.querySelectorAll('.sp-sparkle');
      if (existing.length < config.density * 2) {
        spawnSparkle(container);
      }
    }, (config.speed * 1000) / config.density);
  });

  window.__sparklesUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };
})();
