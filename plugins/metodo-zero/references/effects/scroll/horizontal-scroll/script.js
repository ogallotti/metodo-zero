(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var wrapper = document.querySelector('.hscroll-wrapper');
  var track = document.querySelector('.hscroll-track');
  var panels = document.querySelectorAll('.hscroll-panel');

  function getScrollAmount() {
    return track.scrollWidth - wrapper.offsetWidth;
  }

  gsap.to(track, {
    x: function () { return -getScrollAmount(); },
    ease: 'none',
    scrollTrigger: {
      trigger: wrapper,
      start: 'top top',
      end: function () { return '+=' + getScrollAmount(); },
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1
    }
  });

  panels.forEach(function (panel, i) {
    gsap.fromTo(panel, {
      opacity: i === 0 ? 1 : 0.4,
      scale: i === 0 ? 1 : 0.92
    }, {
      opacity: 1,
      scale: 1,
      scrollTrigger: {
        trigger: panel,
        containerAnimation: gsap.getById ? undefined : undefined,
        start: 'left 80%',
        end: 'left 20%',
        scrub: true,
        horizontal: true
      }
    });
  });
})();
