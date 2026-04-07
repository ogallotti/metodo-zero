(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  document.querySelectorAll('.sv-section').forEach(function (section) {
    var tracks = section.querySelectorAll('.sv-track');
    var baseSpeed = parseFloat(section.dataset.baseSpeed) || 1;
    var scrollMultiplier = parseFloat(section.dataset.scrollMultiplier) || 3;
    var isVisible = false;

    /* Duplicate items to fill the screen */
    tracks.forEach(function (track) {
      var items = track.innerHTML;
      var copies = 3;
      for (var i = 0; i < copies; i++) {
        track.innerHTML += items;
      }
    });

    var positions = [];
    tracks.forEach(function () {
      positions.push(0);
    });

    var scrollVelocity = 0;
    var lastScrollY = window.scrollY;
    var rafId = null;

    function onScroll() {
      var currentY = window.scrollY;
      scrollVelocity = currentY - lastScrollY;
      lastScrollY = currentY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            animate();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(section);

    function animate() {
      if (!isVisible) {
        rafId = null;
        return;
      }

      var velocity = scrollVelocity * scrollMultiplier;
      scrollVelocity *= 0.95; /* Decay */

      tracks.forEach(function (track, i) {
        var isReverse = track.classList.contains('sv-track-reverse');
        var direction = isReverse ? 1 : -1;
        var speed = baseSpeed * direction + velocity * direction * 0.1;

        positions[i] += speed;

        /* Reset position for seamless loop */
        var trackWidth = track.scrollWidth / 4; /* We have 4x items */
        if (Math.abs(positions[i]) > trackWidth) {
          positions[i] = positions[i] % trackWidth;
        }

        track.style.transform = 'translateX(' + positions[i] + 'px)';
      });

      rafId = requestAnimationFrame(animate);
    }

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
      if (e.matches) {
        cancelAnimationFrame(rafId);
        rafId = null;
        tracks.forEach(function (track) {
          track.style.transform = 'none';
        });
      } else {
        if (isVisible) animate();
      }
    });
  });
})();
