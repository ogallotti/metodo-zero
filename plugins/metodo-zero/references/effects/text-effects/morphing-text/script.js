(function () {
  'use strict';

  var wrapper = document.querySelector('.mt-wrapper');
  if (!wrapper) return;

  var phrases = JSON.parse(wrapper.dataset.phrases || '[]');
  if (!phrases.length) return;

  var config = {
    pauseBetween: parseInt(wrapper.dataset.pauseBetween, 10) || 2500,
  };

  var currentEl = wrapper.querySelector('.mt-text-current');
  var nextEl = wrapper.querySelector('.mt-text-next');
  if (!currentEl || !nextEl) return;

  var currentIndex = 0;
  var timeoutId = null;
  var isVisible = true;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  currentEl.textContent = phrases[0];

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
    reducedMotion = e.matches;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          scheduleNext();
        } else {
          clearTimeout(timeoutId);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(wrapper);

  function morphTo(nextIndex) {
    if (!isVisible) return;

    var nextPhrase = phrases[nextIndex];

    if (reducedMotion) {
      currentEl.textContent = nextPhrase;
      currentIndex = nextIndex;
      scheduleNext();
      return;
    }

    nextEl.textContent = nextPhrase;

    currentEl.classList.add('mt-out');
    nextEl.classList.add('mt-in');

    var duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mt-duration')) || 0.8;

    setTimeout(function () {
      currentEl.textContent = nextPhrase;
      currentEl.classList.remove('mt-out');
      nextEl.classList.remove('mt-in');
      nextEl.textContent = '';
      currentIndex = nextIndex;
      scheduleNext();
    }, duration * 1000);
  }

  function scheduleNext() {
    clearTimeout(timeoutId);
    if (!isVisible) return;
    timeoutId = setTimeout(function () {
      var next = (currentIndex + 1) % phrases.length;
      morphTo(next);
    }, config.pauseBetween);
  }

  scheduleNext();

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-js-param') {
      if (e.data.key in config) {
        config[e.data.key] = e.data.value;
      }
    }
  });
})();
