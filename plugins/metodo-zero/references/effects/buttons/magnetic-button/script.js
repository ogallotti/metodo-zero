(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var strength = 30;
  var triggerArea = 1.5;

  var areas = document.querySelectorAll('.mag-btn-area');

  areas.forEach(function (area) {
    var btn = area.querySelector('.mag-btn');
    var textEl = btn ? btn.querySelector('.mag-btn__text') : null;
    if (!btn) return;

    area.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;

      var deltaX = e.clientX - centerX;
      var deltaY = e.clientY - centerY;
      var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var triggerDist = Math.max(rect.width, rect.height) * triggerArea;

      if (distance < triggerDist) {
        var pull = 1 - (distance / triggerDist);
        var moveX = deltaX * pull * (strength / 100);
        var moveY = deltaY * pull * (strength / 100);

        btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';

        if (textEl) {
          textEl.style.transform = 'translate(' + (moveX * 0.3) + 'px, ' + (moveY * 0.3) + 'px)';
        }
      }
    });

    area.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate(0, 0)';
      if (textEl) textEl.style.transform = 'translate(0, 0)';
    });
  });

  window.addEventListener('message', function (e) {
    if (e.data?.type === 'update-param' && e.data.scope === 'js') {
      if (e.data.key === 'strength') strength = Number(e.data.value);
      if (e.data.key === 'triggerArea') triggerArea = Number(e.data.value);
    }
  });
})();
