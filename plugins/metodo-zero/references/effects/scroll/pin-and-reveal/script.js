(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var wrapper = document.querySelector('.pin-wrapper');
  var section = document.querySelector('.pin-section');
  var steps = document.querySelectorAll('.pin-step');
  var dots = document.querySelectorAll('.pin-dot');
  var stepCount = steps.length;

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: '+=' + (stepCount * 100) + '%',
      pin: section,
      scrub: 0.5,
      onUpdate: function (self) {
        var idx = Math.min(Math.floor(self.progress * stepCount), stepCount - 1);
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i <= idx);
        });
      }
    }
  });

  steps.forEach(function (step, i) {
    if (i === 0) {
      tl.to(step, { opacity: 1, y: 0, duration: 0.1 });
      if (stepCount > 1) {
        tl.to(step, { opacity: 0, y: -40, duration: 1 }, '+=0.5');
      }
    } else {
      tl.fromTo(step,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      );
      if (i < stepCount - 1) {
        tl.to(step, { opacity: 0, y: -40, duration: 1 }, '+=0.5');
      }
    }
  });
})();
