(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  var steps = document.querySelectorAll('.ssr-step');
  var visual = document.querySelector('.ssr-visual');
  var icons = document.querySelectorAll('.ssr-visual-icon');

  function setActiveStep(index) {
    steps.forEach(function (step, i) {
      step.classList.toggle('active', i === index);
    });
    icons.forEach(function (icon, i) {
      icon.classList.toggle('active', i === index);
    });
    if (visual) {
      visual.setAttribute('data-step', index);
    }
  }

  steps.forEach(function (step, i) {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: function () { setActiveStep(i); },
      onEnterBack: function () { setActiveStep(i); }
    });
  });

  setActiveStep(0);
})();
