(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var cards = document.querySelectorAll('.stack-card');
  var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stack-offset')) || 30;

  cards.forEach(function (card, i) {
    var scaleVal = 1 - (cards.length - i) * 0.03;

    ScrollTrigger.create({
      trigger: card,
      start: 'top 15%',
      end: 'bottom 15%',
      endTrigger: '.stack-wrapper',
      pin: false,
      onUpdate: function (self) {
        var progress = self.progress;
        var scale = gsap.utils.interpolate(1, scaleVal, progress);
        var yShift = progress * offset * 0.5;
        card.style.transform = 'scale(' + scale + ') translateY(-' + yShift + 'px)';
        card.style.opacity = gsap.utils.interpolate(1, 0.6, progress);
      }
    });
  });
})();
