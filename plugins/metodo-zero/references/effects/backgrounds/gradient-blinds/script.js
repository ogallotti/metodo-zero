/* Gradient Blinds — Venetian blinds with staggered gradient animations */
(function () {
  'use strict';

  var container = document.querySelector('.gbl-container');
  var blindsEl = document.getElementById('gbl-blinds');
  if (!container || !blindsEl) return;

  var strips = [];
  var isVisible = true;

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function buildStrips() {
    var stripHeight = parseInt(getCSS('--gbl-strip-height') || '40');
    var speed = parseFloat(getCSS('--gbl-speed') || '1');
    var color1 = getCSS('--gbl-color-1') || '#667eea';
    var color2 = getCSS('--gbl-color-2') || '#764ba2';
    var color3 = getCSS('--gbl-color-3') || '#f093fb';
    var H = container.clientHeight;
    var count = Math.ceil(H / stripHeight) + 1;

    blindsEl.innerHTML = '';
    strips = [];

    for (var i = 0; i < count; i++) {
      var strip = document.createElement('div');
      strip.className = 'gbl-strip';
      strip.style.height = stripHeight + 'px';

      // Each strip has a slightly different gradient direction and colors
      var ratio = i / count;
      var angle = 90 + Math.sin(ratio * Math.PI) * 15;

      // Stagger gradient: alternate between color combos
      var gradColors;
      if (i % 3 === 0) {
        gradColors = color1 + ', ' + color2 + ', ' + color3 + ', ' + color1;
      } else if (i % 3 === 1) {
        gradColors = color2 + ', ' + color3 + ', ' + color1 + ', ' + color2;
      } else {
        gradColors = color3 + ', ' + color1 + ', ' + color2 + ', ' + color3;
      }

      strip.style.background = 'linear-gradient(' + angle + 'deg, ' + gradColors + ')';
      strip.style.backgroundSize = '300% 100%';

      // Staggered duration: each strip at a different speed
      var duration = (4 + (i % 5) * 1.5) / speed;
      strip.style.animationDuration = duration + 's';

      // Stagger the start with animation-delay
      var delay = -(i * 0.3) / speed;
      strip.style.animationDelay = delay + 's';

      // Alternate direction for neighboring strips
      if (i % 2 === 1) {
        strip.style.animationDirection = 'reverse';
      }

      // Vary opacity slightly per strip
      strip.style.opacity = (0.5 + (Math.sin(i * 0.7) * 0.5 + 0.5) * 0.4).toFixed(2);

      blindsEl.appendChild(strip);
      strips.push(strip);
    }
  }

  // Mouse interaction: tilt strips based on cursor Y
  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    var mouseY = (e.clientY - rect.top) / rect.height;

    for (var i = 0; i < strips.length; i++) {
      var ratio = i / strips.length;
      var dist = Math.abs(ratio - mouseY);
      var scale = 1.0 + Math.max(0, 0.15 - dist) * 2;
      var brightness = 1.0 + Math.max(0, 0.2 - dist) * 1.5;
      strips[i].style.transform = 'scaleY(' + scale.toFixed(3) + ')';
      strips[i].style.filter = 'brightness(' + brightness.toFixed(2) + ')';
    }
  });

  container.addEventListener('mouseleave', function () {
    for (var i = 0; i < strips.length; i++) {
      strips[i].style.transform = 'scaleY(1)';
      strips[i].style.filter = 'brightness(1)';
    }
  });

  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    var mouseY = (touch.clientY - rect.top) / rect.height;
    for (var i = 0; i < strips.length; i++) {
      var ratio = i / strips.length;
      var dist = Math.abs(ratio - mouseY);
      var scale = 1.0 + Math.max(0, 0.15 - dist) * 2;
      strips[i].style.transform = 'scaleY(' + scale.toFixed(3) + ')';
    }
  }, { passive: true });

  // Visibility
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        var state = isVisible ? 'running' : 'paused';
        for (var i = 0; i < strips.length; i++) {
          strips[i].style.animationPlayState = state;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Resize
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(buildStrips, 200);
  });

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(buildStrips, 100);
    }
  });

  buildStrips();
})();
