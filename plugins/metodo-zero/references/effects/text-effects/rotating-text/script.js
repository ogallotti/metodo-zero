(function () {
  'use strict';

  document.querySelectorAll('.rt-rotator').forEach(function (rotator) {
    var words = JSON.parse(rotator.dataset.words || '[]');
    var mode = rotator.dataset.mode || 'slide';
    var interval = parseInt(rotator.dataset.interval, 10) || 2500;

    if (!words.length) return;

    rotator.setAttribute('data-mode', mode);
    rotator.innerHTML = '';

    /* Create all word elements */
    var wordEls = words.map(function (word, i) {
      var span = document.createElement('span');
      span.className = 'rt-word';
      span.textContent = word;
      if (i === 0) span.classList.add('rt-current');
      rotator.appendChild(span);
      return span;
    });

    /* Measure max width for the rotator */
    function updateWidth() {
      var maxW = 0;
      wordEls.forEach(function (el) {
        el.style.position = 'relative';
        el.style.visibility = 'hidden';
        var w = el.offsetWidth;
        el.style.position = '';
        el.style.visibility = '';
        if (w > maxW) maxW = w;
      });
      rotator.style.width = maxW + 'px';
    }

    updateWidth();
    window.addEventListener('resize', updateWidth);

    var currentIndex = 0;
    var timerId = null;
    var isVisible = true;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
      reducedMotion = e.matches;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startCycle();
          } else {
            clearInterval(timerId);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(rotator);

    function rotate() {
      if (!isVisible) return;

      var currentEl = wordEls[currentIndex];
      var nextIndex = (currentIndex + 1) % words.length;
      var nextEl = wordEls[nextIndex];

      var dur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rt-duration')) * 1000 || 500;

      currentEl.classList.remove('rt-current');
      currentEl.classList.add('rt-exit');

      nextEl.classList.add('rt-current');

      setTimeout(function () {
        currentEl.classList.remove('rt-exit');
      }, dur);

      currentIndex = nextIndex;
    }

    function startCycle() {
      clearInterval(timerId);
      timerId = setInterval(function () {
        if (reducedMotion) {
          wordEls[currentIndex].classList.remove('rt-current');
          currentIndex = (currentIndex + 1) % words.length;
          wordEls[currentIndex].classList.add('rt-current');
        } else {
          rotate();
        }
      }, interval);
    }

    if (isVisible) startCycle();

    window.addEventListener('message', function (e) {
      if (e.data?.type === 'update-js-param') {
        if (e.data.key === 'interval') {
          interval = e.data.value;
          startCycle();
        }
        if (e.data.key === 'mode') {
          rotator.setAttribute('data-mode', e.data.value);
        }
      }
    });
  });
})();
