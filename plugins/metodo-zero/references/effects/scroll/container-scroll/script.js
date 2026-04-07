(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var containers = document.querySelectorAll('.transform-container');
  var maxRotate = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--container-max-rotate')) || 8;

  containers.forEach(function (container, i) {
    var direction = i % 2 === 0 ? 1 : -1;

    gsap.fromTo(container, {
      rotateX: maxRotate,
      rotateY: direction * (maxRotate * 0.5),
      scale: 0.85,
      opacity: 0.5
    }, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'top 20%',
        scrub: 1
      }
    });

    gsap.to(container, {
      rotateX: -maxRotate * 0.5,
      scale: 0.92,
      opacity: 0.6,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: container,
        start: 'bottom 50%',
        end: 'bottom -10%',
        scrub: 1
      }
    });
  });
})();
