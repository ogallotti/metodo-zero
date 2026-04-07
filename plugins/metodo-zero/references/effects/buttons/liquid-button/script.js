(function () {
  'use strict';

  // Update SVG filter blur value from CSS custom property
  var blur = document.getElementById('liq-blur');
  if (blur) {
    var intensity = getComputedStyle(document.documentElement).getPropertyValue('--liq-goo-intensity').trim() || '12';
    blur.setAttribute('stdDeviation', intensity);
  }

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'css' && e.data.key === '--liq-goo-intensity') {
      if (blur) blur.setAttribute('stdDeviation', e.data.value);
    }
  });
})();
