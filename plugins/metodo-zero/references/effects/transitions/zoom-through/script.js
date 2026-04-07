(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var wrappers = document.querySelectorAll('.zoom-wrapper');

  wrappers.forEach(function (wrapper) {
    var frame = wrapper.querySelector('.zoom-frame');
    var revealed = wrapper.querySelector('.zoom-revealed');
    var maxScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom-max-scale')) || 15;

    gsap.to(frame, {
      scale: maxScale,
      opacity: 0,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: wrapper.querySelector('.zoom-stage'),
        onUpdate: function (self) {
          if (self.progress > 0.6 && revealed) {
            revealed.classList.add('visible');
          } else if (revealed) {
            revealed.classList.remove('visible');
          }
        }
      }
    });
  });
})();
