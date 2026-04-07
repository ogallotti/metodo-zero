(function () {
  'use strict';

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const el = document.querySelector('.ts-text');
  if (!el) return;

  const phrases = JSON.parse(el.dataset.phrases || '[]');
  if (!phrases.length) return;

  const config = {
    scrambleSpeed: parseInt(el.dataset.scrambleSpeed, 10) || 30,
    revealDelay: parseInt(el.dataset.revealDelay, 10) || 50,
    pauseBetween: parseInt(el.dataset.pauseBetween, 10) || 3000,
  };

  let currentPhrase = 0;
  let animFrameId = null;
  let timeoutId = null;
  let isVisible = true;
  let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    reducedMotion = e.matches;
    if (reducedMotion) {
      cancelAnimationFrame(animFrameId);
      clearTimeout(timeoutId);
      el.textContent = phrases[currentPhrase];
    } else {
      scrambleTo(phrases[currentPhrase]);
    }
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible) {
        cancelAnimationFrame(animFrameId);
        clearTimeout(timeoutId);
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(el.closest('.ts-container') || el);

  function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function scrambleTo(target) {
    if (!isVisible || reducedMotion) {
      el.textContent = target;
      return;
    }

    const length = target.length;
    const revealed = new Array(length).fill(false);
    let revealedCount = 0;

    function render() {
      let html = '';
      for (let i = 0; i < length; i++) {
        if (target[i] === ' ') {
          html += ' ';
        } else if (revealed[i]) {
          html += '<span class="ts-char-final">' + target[i] + '</span>';
        } else {
          html += '<span class="ts-char-scramble">' + randomChar() + '</span>';
        }
      }
      el.innerHTML = html;
    }

    const revealOrder = Array.from({ length }, (_, i) => i)
      .filter((i) => target[i] !== ' ')
      .sort(() => Math.random() - 0.5);

    let lastRevealTime = 0;
    let lastScrambleTime = 0;
    const startTime = performance.now();

    function animate(now) {
      if (!isVisible) return;

      if (now - lastScrambleTime >= config.scrambleSpeed) {
        render();
        lastScrambleTime = now;
      }

      if (now - startTime > 200 && now - lastRevealTime >= config.revealDelay && revealedCount < revealOrder.length) {
        revealed[revealOrder[revealedCount]] = true;
        revealedCount++;
        lastRevealTime = now;
      }

      if (revealedCount < revealOrder.length) {
        animFrameId = requestAnimationFrame(animate);
      } else {
        render();
        scheduleNext();
      }
    }

    animFrameId = requestAnimationFrame(animate);
  }

  function scheduleNext() {
    timeoutId = setTimeout(() => {
      currentPhrase = (currentPhrase + 1) % phrases.length;
      scrambleTo(phrases[currentPhrase]);
    }, config.pauseBetween);
  }

  if (reducedMotion) {
    el.textContent = phrases[0];
  } else {
    scrambleTo(phrases[0]);
  }

  window.addEventListener('message', (e) => {
    if (e.data?.type === 'update-js-param') {
      if (e.data.key in config) {
        config[e.data.key] = e.data.value;
      }
    }
  });
})();
