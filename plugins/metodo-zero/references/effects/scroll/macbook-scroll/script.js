(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  var device = document.querySelector('.macbook-device');
  var wrapper = document.querySelector('.macbook-pin-wrapper');
  if (!device || !wrapper) return;

  function getCSSVar(prop) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(prop)) || 0;
  }

  var rotX = getCSSVar('--macbook-rotation-x');
  var rotY = getCSSVar('--macbook-rotation-y');
  var scaleStart = getCSSVar('--macbook-scale-start');
  var scaleEnd = getCSSVar('--macbook-scale-end');
  var pinDur = getCSSVar('--macbook-pin-duration');

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: '+=' + pinDur,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1
    }
  });

  tl.fromTo(device, {
    scale: scaleStart,
    rotateX: 0,
    rotateY: 0,
    y: 0
  }, {
    scale: scaleEnd,
    rotateX: rotX,
    rotateY: rotY,
    y: -60,
    ease: 'power2.inOut'
  });

  tl.to(device, {
    opacity: 0.3,
    scale: scaleEnd * 0.8,
    y: -120,
    ease: 'power2.in'
  }, '>-0.2');
})();
