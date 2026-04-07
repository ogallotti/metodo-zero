(function () {
  'use strict';

  var overlay = document.querySelector('.exp-overlay');
  var expanded = document.querySelector('.exp-expanded');
  var expandedImage = expanded ? expanded.querySelector('.exp-expanded__image') : null;
  var expandedTag = expanded ? expanded.querySelector('.exp-expanded__tag') : null;
  var expandedTitle = expanded ? expanded.querySelector('.exp-expanded__title') : null;
  var expandedText = expanded ? expanded.querySelector('.exp-expanded__text') : null;
  var closeBtn = expanded ? expanded.querySelector('.exp-expanded__close') : null;

  if (!overlay || !expanded) return;

  var cards = document.querySelectorAll('.exp-card');

  function openCard(card) {
    var img = card.querySelector('.exp-card__image');
    var tag = card.querySelector('.exp-card__tag');
    var title = card.querySelector('.exp-card__title');
    var detail = card.querySelector('.exp-card__detail');

    if (expandedImage && img) expandedImage.src = img.src;
    if (expandedImage && img) expandedImage.alt = img.alt;
    if (expandedTag && tag) expandedTag.textContent = tag.textContent;
    if (expandedTitle && title) expandedTitle.textContent = title.textContent;
    if (expandedText && detail) expandedText.innerHTML = detail.innerHTML;

    overlay.classList.add('exp-overlay--active');
    expanded.classList.add('exp-expanded--active');
    document.body.style.overflow = 'hidden';
  }

  function closeCard() {
    overlay.classList.remove('exp-overlay--active');
    expanded.classList.remove('exp-expanded--active');
    document.body.style.overflow = '';
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      openCard(card);
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCard(card);
      }
    });
  });

  overlay.addEventListener('click', closeCard);
  if (closeBtn) closeBtn.addEventListener('click', closeCard);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCard();
  });
})();
