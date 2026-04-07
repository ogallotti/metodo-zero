/* Dark Veil — Dark mist parallax overlay with mouse movement */
(function () {
  'use strict';

  var container = document.getElementById('dkv-container');
  if (!container) return;

  var layers = container.querySelectorAll('.dkv-layer');
  if (!layers.length) return;

  var isVisible = true;
  var mouse = { x: 0.5, y: 0.5 };
  var smooth = { x: 0.5, y: 0.5 };
  var animId = null;

  function getCSS(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // Parallax depths for each layer (deeper = more movement)
  var depths = [0.02, 0.035, 0.05, 0.025];

  function updateLayers() {
    var parallax = parseFloat(getCSS('--dkv-parallax') || '1');
    var opacity = parseFloat(getCSS('--dkv-opacity') || '0.6');

    // Smooth mouse following
    smooth.x += (mouse.x - smooth.x) * 0.04;
    smooth.y += (mouse.y - smooth.y) * 0.04;

    var dx = (smooth.x - 0.5) * 2;
    var dy = (smooth.y - 0.5) * 2;

    for (var i = 0; i < layers.length; i++) {
      var depth = depths[i % depths.length] * parallax;
      var tx = dx * depth * 100;
      var ty = dy * depth * 100;

      // Get current animation transform and add parallax offset
      layers[i].style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
      layers[i].style.opacity = opacity;
    }
  }

  function loop() {
    if (!isVisible) return;
    updateLayers();
    animId = requestAnimationFrame(loop);
  }

  // Mouse tracking
  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });

  container.addEventListener('touchmove', function (e) {
    var rect = container.getBoundingClientRect();
    var touch = e.touches[0];
    mouse.x = (touch.clientX - rect.left) / rect.width;
    mouse.y = (touch.clientY - rect.top) / rect.height;
  }, { passive: true });

  // Visibility
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) loop();
        if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        // Pause/resume CSS animations
        var state = isVisible ? 'running' : 'paused';
        for (var i = 0; i < layers.length; i++) {
          layers[i].style.animationPlayState = state;
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // Apply fog color from CSS var
  function applyColors() {
    var fogColor = getCSS('--dkv-fog-color') || '#0a0a1a';

    // Parse hex to rgb
    var hex = fogColor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);

    var gradients = [
      'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(' + r + ',' + g + ',' + b + ',0.8) 0%, transparent 70%)',
      'radial-gradient(ellipse 70% 50% at 75% 60%, rgba(' + r + ',' + g + ',' + b + ',0.6) 0%, transparent 65%)',
      'radial-gradient(ellipse 90% 40% at 50% 80%, rgba(' + r + ',' + g + ',' + b + ',0.7) 0%, transparent 60%)',
      'radial-gradient(ellipse 60% 70% at 40% 20%, rgba(' + (r + 5) + ',' + g + ',' + (b + 10) + ',0.5) 0%, transparent 55%)',
    ];

    for (var i = 0; i < layers.length; i++) {
      layers[i].style.background = gradients[i % gradients.length];
    }
  }

  // Apply animation speed from CSS var
  function applySpeed() {
    var speed = parseFloat(getCSS('--dkv-speed') || '1');
    var durations = [20, 25, 30, 22];
    for (var i = 0; i < layers.length; i++) {
      layers[i].style.animationDuration = (durations[i % durations.length] / speed) + 's';
    }
  }

  // Param updates
  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css') {
      document.documentElement.style.setProperty(e.data.key, e.data.value);
      if (e.data.key === '--dkv-fog-color') applyColors();
      if (e.data.key === '--dkv-speed') applySpeed();
    }
  });

  applyColors();
  applySpeed();
  loop();
})();
