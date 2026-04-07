(function () {
  'use strict';

  /* CSS-only effect — JS handles IntersectionObserver pause only */
  var el = document.querySelector('.gt-text');
  if (!el) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          el.style.animationPlayState = 'running';
        } else {
          el.style.animationPlayState = 'paused';
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(el);
})();
