(function () {
  'use strict';

  var thumbnail = document.querySelector('.hvd-thumbnail');
  var modal = document.querySelector('.hvd-modal');
  var backdrop = modal ? modal.querySelector('.hvd-modal-backdrop') : null;
  var closeBtn = modal ? modal.querySelector('.hvd-close-btn') : null;
  var video = modal ? modal.querySelector('video') : null;

  if (!thumbnail || !modal) return;

  function openModal() {
    modal.classList.add('hvd-modal--open');
    document.body.style.overflow = 'hidden';
    if (video) video.play();
  }

  function closeModal() {
    modal.classList.remove('hvd-modal--open');
    document.body.style.overflow = '';
    if (video) { video.pause(); video.currentTime = 0; }
  }

  thumbnail.addEventListener('click', openModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
