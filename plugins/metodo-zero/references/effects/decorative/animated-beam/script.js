(function () {
  'use strict';

  var scene = document.querySelector('.ab-scene');
  if (!scene) return;

  var svg = scene.querySelector('.ab-svg');
  var nodes = scene.querySelectorAll('.ab-node');
  if (!svg || nodes.length < 3) return;

  function updateBeams() {
    var sceneRect = scene.getBoundingClientRect();

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    var center = nodes[1];
    var centerRect = center.getBoundingClientRect();
    var cx = centerRect.left + centerRect.width / 2 - sceneRect.left;
    var cy = centerRect.top + centerRect.height / 2 - sceneRect.top;

    for (var i = 0; i < nodes.length; i++) {
      if (i === 1) continue;
      var nodeRect = nodes[i].getBoundingClientRect();
      var nx = nodeRect.left + nodeRect.width / 2 - sceneRect.left;
      var ny = nodeRect.top + nodeRect.height / 2 - sceneRect.top;

      var midX = (cx + nx) / 2;
      var cpY = Math.min(cy, ny) - 40;

      var d = 'M ' + nx + ' ' + ny + ' Q ' + midX + ' ' + cpY + ' ' + cx + ' ' + cy;

      var glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glow.setAttribute('d', d);
      glow.setAttribute('class', 'ab-beam-glow');
      svg.appendChild(glow);

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'ab-beam-path');
      svg.appendChild(path);
    }
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      updateBeams();
    }
  }, { threshold: 0 });
  observer.observe(scene);

  window.addEventListener('resize', updateBeams);

  setTimeout(updateBeams, 100);
})();
