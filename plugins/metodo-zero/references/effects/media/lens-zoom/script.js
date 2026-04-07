(function () {
  'use strict';

  var container = document.querySelector('.lz-container');
  if (!container) return;

  var img = container.querySelector('img');
  var lens = container.querySelector('.lz-lens');
  if (!img || !lens) return;

  var config = { zoom: 2.5 };

  function initLens() {
    lens.style.backgroundImage = 'url(' + img.src + ')';
  }

  img.addEventListener('load', initLens);
  if (img.complete) initLens();

  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var lensSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lz-lens-size')) || 180;

    lens.style.left = x + 'px';
    lens.style.top = y + 'px';

    var bgW = rect.width * config.zoom;
    var bgH = rect.height * config.zoom;
    var bgX = -(x * config.zoom - lensSize / 2);
    var bgY = -(y * config.zoom - lensSize / 2);

    lens.style.backgroundSize = bgW + 'px ' + bgH + 'px';
    lens.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
  });

  window.__lensZoomUpdate = function (key, value) {
    if (key in config) config[key] = value;
  };
})();
