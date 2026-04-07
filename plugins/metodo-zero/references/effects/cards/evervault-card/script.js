(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]+=~^';

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  var cards = document.querySelectorAll('.ev-card');

  cards.forEach(function (card) {
    var matrix = card.querySelector('.ev-card__matrix');
    if (!matrix) return;

    var charSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ev-char-size')) || 12;
    var rect = card.getBoundingClientRect();
    var cols = Math.floor(rect.width / charSize);
    var rows = Math.floor(rect.height / (charSize * 1.4));
    var total = cols * rows;

    var charEls = [];
    var frag = document.createDocumentFragment();

    for (var i = 0; i < total; i++) {
      var span = document.createElement('span');
      span.className = 'ev-card__char';
      span.textContent = randomChar();
      charEls.push(span);
      frag.appendChild(span);
    }

    matrix.appendChild(frag);

    if (reducedMotion) return;

    var mouseX = -1000;
    var mouseY = -1000;
    var scrambleRadius = 150;
    var scrambleSpeed = 80;
    var intervalId = null;

    card.addEventListener('mouseenter', function () {
      intervalId = setInterval(function () {
        var cardRect = card.getBoundingClientRect();
        charEls.forEach(function (el, idx) {
          var col = idx % cols;
          var row = Math.floor(idx / cols);
          var cx = col * charSize + charSize / 2;
          var cy = row * (charSize * 1.4) + (charSize * 1.4) / 2;
          var dx = mouseX - cx;
          var dy = mouseY - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < scrambleRadius) {
            el.textContent = randomChar();
            el.classList.add('ev-card__char--lit');
          } else {
            el.classList.remove('ev-card__char--lit');
          }
        });
      }, scrambleSpeed);
    });

    card.addEventListener('mousemove', function (e) {
      var cardRect = card.getBoundingClientRect();
      mouseX = e.clientX - cardRect.left;
      mouseY = e.clientY - cardRect.top;
      card.style.setProperty('--ev-mx', mouseX + 'px');
      card.style.setProperty('--ev-my', mouseY + 'px');
    });

    card.addEventListener('mouseleave', function () {
      mouseX = -1000;
      mouseY = -1000;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      charEls.forEach(function (el) {
        el.classList.remove('ev-card__char--lit');
      });
    });

    // Listen for jsParam updates
    window.addEventListener('message', function (e) {
      if (e.data?.type === 'update-param' && e.data.scope === 'js') {
        if (e.data.key === 'scrambleRadius') scrambleRadius = Number(e.data.value);
        if (e.data.key === 'scrambleSpeed') {
          scrambleSpeed = Number(e.data.value);
          if (intervalId) {
            clearInterval(intervalId);
            card.dispatchEvent(new Event('mouseenter'));
          }
        }
      }
    });
  });
})();
