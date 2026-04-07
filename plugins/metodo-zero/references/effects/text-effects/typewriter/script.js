(function () {
  'use strict';

  const el = document.querySelector('.tw-text');
  if (!el) return;

  const phrases = JSON.parse(el.dataset.phrases || '[]');
  if (!phrases.length) return;

  const config = {
    typeSpeed: parseInt(el.dataset.typeSpeed, 10) || 80,
    deleteSpeed: parseInt(el.dataset.deleteSpeed, 10) || 50,
    pauseBetween: parseInt(el.dataset.pauseBetween, 10) || 2000,
    loop: el.dataset.loop !== 'false',
  };

  let currentPhrase = 0;
  let currentChar = 0;
  let isDeleting = false;
  let isPaused = false;
  let timeoutId = null;
  let isVisible = true;
  let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    reducedMotion = e.matches;
    if (reducedMotion) {
      clearTimeout(timeoutId);
      el.textContent = phrases[currentPhrase];
    } else {
      tick();
    }
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !isPaused && !reducedMotion) {
        tick();
      } else if (!isVisible) {
        clearTimeout(timeoutId);
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(el.closest('.tw-container') || el);

  function tick() {
    if (!isVisible || isPaused || reducedMotion) return;
    clearTimeout(timeoutId);

    const phrase = phrases[currentPhrase];

    if (!isDeleting) {
      currentChar++;
      el.textContent = phrase.substring(0, currentChar);

      if (currentChar === phrase.length) {
        if (!config.loop && currentPhrase === phrases.length - 1) return;
        isPaused = true;
        timeoutId = setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          tick();
        }, config.pauseBetween);
        return;
      }

      timeoutId = setTimeout(tick, config.typeSpeed + Math.random() * 40);
    } else {
      currentChar--;
      el.textContent = phrase.substring(0, currentChar);

      if (currentChar === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
        timeoutId = setTimeout(tick, config.typeSpeed);
        return;
      }

      timeoutId = setTimeout(tick, config.deleteSpeed);
    }
  }

  if (reducedMotion) {
    el.textContent = phrases[0];
  } else {
    tick();
  }

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-js-param') {
      if (e.data.key in config) {
        config[e.data.key] = e.data.value;
      }
    }
  });
})();
