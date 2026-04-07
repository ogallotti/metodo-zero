(function () {
  'use strict';

  var container = document.getElementById('snapContainer');
  var dotsContainer = document.getElementById('snapDots');
  var sections = document.querySelectorAll('.snap-section');

  if (!container || !dotsContainer || !sections.length) return;

  sections.forEach(function (section, i) {
    var dot = document.createElement('button');
    dot.className = 'snap-dot';
    dot.setAttribute('aria-label', 'Go to section ' + (i + 1));
    dot.addEventListener('click', function () {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });

  var dots = dotsContainer.querySelectorAll('.snap-dot');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sections.forEach(function (s) { s.classList.add('active'); });
    if (dots[0]) dots[0].classList.add('active');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        var index = Array.prototype.indexOf.call(sections, entry.target);
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === index);
        });
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, {
    root: container,
    threshold: 0.6
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
