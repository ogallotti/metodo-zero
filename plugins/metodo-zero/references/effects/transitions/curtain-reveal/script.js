(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var wrappers = document.querySelectorAll('.curtain-wrapper');

  wrappers.forEach(function (wrapper) {
    var left = wrapper.querySelector('.curtain-left');
    var right = wrapper.querySelector('.curtain-right');
    var content = wrapper.querySelector('.curtain-content');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: function (self) {
          if (self.progress > 0.5 && content) {
            content.classList.add('revealed');
          } else if (content) {
            content.classList.remove('revealed');
          }
        }
      }
    });

    tl.to(left, {
      xPercent: -100,
      ease: 'power2.inOut',
      duration: 1
    }, 0);

    tl.to(right, {
      xPercent: 100,
      ease: 'power2.inOut',
      duration: 1
    }, 0);
  });
})();
