(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var paragraphs = document.querySelectorAll('.th-highlight-text');
  var ticking = false;

  function wrapWords(el) {
    var text = el.textContent;
    var words = text.split(/\s+/);
    el.innerHTML = '';
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'th-word';
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
  }

  paragraphs.forEach(wrapWords);

  function getSpeed() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--highlight-speed')) || 1;
  }

  function updateHighlights() {
    var speed = getSpeed();
    var viewH = window.innerHeight;

    paragraphs.forEach(function (p) {
      var rect = p.getBoundingClientRect();
      var words = p.querySelectorAll('.th-word');
      var sectionTop = rect.top;
      var sectionHeight = rect.height;

      var triggerStart = viewH * 0.75;
      var triggerEnd = viewH * 0.25;
      var scrollRange = (triggerStart - triggerEnd) * speed;
      var scrollProgress = (triggerStart - sectionTop) / (scrollRange + sectionHeight);
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      var activeCount = Math.floor(scrollProgress * words.length);

      words.forEach(function (word, i) {
        if (i < activeCount) {
          word.classList.add('active');
        } else {
          word.classList.remove('active');
        }
      });
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHighlights);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHighlights();
})();
