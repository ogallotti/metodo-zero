(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.st-text').forEach(function (el) {
    const splitBy = el.dataset.splitBy || 'chars';
    const direction = el.dataset.direction || 'up';
    const originalText = el.textContent.trim();

    el.setAttribute('data-direction', direction);
    el.innerHTML = '';

    const words = originalText.split(/\s+/);

    words.forEach(function (word, wIndex) {
      if (splitBy === 'words') {
        var span = document.createElement('span');
        span.className = 'st-char';
        span.textContent = word;
        el.appendChild(span);
      } else {
        var wordWrap = document.createElement('span');
        wordWrap.className = 'st-word';
        word.split('').forEach(function (char) {
          var charSpan = document.createElement('span');
          charSpan.className = 'st-char';
          charSpan.textContent = char;
          wordWrap.appendChild(charSpan);
        });
        el.appendChild(wordWrap);
      }

      if (wIndex < words.length - 1) {
        var space = document.createElement('span');
        space.className = 'st-char st-space';
        space.innerHTML = '&nbsp;';
        el.appendChild(space);
      }
    });

    var chars = el.querySelectorAll('.st-char');
    var staggerValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--st-stagger')) || 0.03;

    chars.forEach(function (char, i) {
      char.style.transitionDelay = (i * staggerValue) + 's';
    });

    if (reducedMotion.matches) {
      el.classList.add('st-visible');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            el.classList.add('st-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
  });

  reducedMotion.addEventListener('change', function (e) {
    document.querySelectorAll('.st-text').forEach(function (el) {
      if (e.matches) {
        el.classList.add('st-visible');
      }
    });
  });
})();
