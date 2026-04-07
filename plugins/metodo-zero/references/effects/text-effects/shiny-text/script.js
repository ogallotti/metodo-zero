(function () {
  'use strict';

  /* CSS-only effect — JS handles IntersectionObserver pause only */
  document.querySelectorAll('.sn-text').forEach(function (el) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            el.style.animationPlayState = 'running';
            var pseudo = el.querySelector('::before');
            el.classList.remove('sn-paused');
          } else {
            el.classList.add('sn-paused');
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
  });

  /* Control animation via class for ::before */
  var style = document.createElement('style');
  style.textContent = '.sn-paused::before { animation-play-state: paused !important; }';
  document.head.appendChild(style);
})();
