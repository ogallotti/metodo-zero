(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.tg-text').forEach(function (el) {
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    var wordDelay = parseInt(el.dataset.wordDelay, 10) || 80;
    var showCursor = el.dataset.showCursor !== 'false';

    el.innerHTML = '';

    var wordEls = words.map(function (word, i) {
      var span = document.createElement('span');
      span.className = 'tg-word';
      span.textContent = word;
      el.appendChild(span);

      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
      return span;
    });

    var cursor = null;
    if (showCursor) {
      cursor = document.createElement('span');
      cursor.className = 'tg-cursor';
      el.appendChild(cursor);
    }

    if (reducedMotion.matches) {
      wordEls.forEach(function (w) {
        w.classList.add('tg-revealed');
      });
      return;
    }

    var revealed = false;
    var timeoutIds = [];

    function generate() {
      if (revealed) return;
      revealed = true;

      if (cursor) {
        cursor.classList.add('tg-cursor-active');
      }

      wordEls.forEach(function (wordEl, i) {
        var id = setTimeout(function () {
          wordEl.classList.add('tg-revealed');

          /* Move cursor after revealed word */
          if (cursor && wordEl.nextSibling) {
            /* Insert cursor after the space following this word */
            var next = wordEl.nextSibling;
            if (next && next.nextSibling) {
              el.insertBefore(cursor, next.nextSibling);
            }
          }

          /* Last word */
          if (i === wordEls.length - 1 && cursor) {
            el.appendChild(cursor);
            setTimeout(function () {
              cursor.classList.remove('tg-cursor-active');
              cursor.classList.add('tg-cursor-done');
            }, 400);
          }
        }, i * wordDelay + Math.random() * (wordDelay * 0.4));

        timeoutIds.push(id);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            generate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    reducedMotion.addEventListener('change', function (e) {
      if (e.matches) {
        timeoutIds.forEach(clearTimeout);
        wordEls.forEach(function (w) {
          w.classList.add('tg-revealed');
        });
        if (cursor) {
          cursor.style.display = 'none';
        }
      }
    });

    window.addEventListener('message', function (e) {
      if (e.data?.type === 'update-js-param') {
        if (e.data.key === 'wordDelay') {
          wordDelay = e.data.value;
        }
      }
    });
  });
})();
