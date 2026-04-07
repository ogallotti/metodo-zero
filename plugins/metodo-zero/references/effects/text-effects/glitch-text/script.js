(function () {
  'use strict';

  document.querySelectorAll('.gl-text').forEach(function (el) {
    /* Set data-text for pseudo-elements */
    el.setAttribute('data-text', el.textContent);

    var hoverOnly = el.dataset.hoverOnly === 'true';

    if (hoverOnly) {
      el.classList.add('gl-paused');
      el.addEventListener('mouseenter', function () {
        el.classList.remove('gl-paused');
        el.classList.add('gl-active');
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('gl-active');
        el.classList.add('gl-paused');
      });
    } else {
      el.classList.add('gl-active');
    }

    /* IntersectionObserver to pause when offscreen */
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!hoverOnly) {
            if (entry.isIntersecting) {
              el.classList.remove('gl-paused');
              el.classList.add('gl-active');
            } else {
              el.classList.remove('gl-active');
              el.classList.add('gl-paused');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
  });
})();
