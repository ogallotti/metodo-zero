(function(){
  'use strict';
  var trigger=document.querySelector('.mod-trigger');
  var overlay=document.querySelector('.mod-overlay');
  if(!trigger||!overlay)return;
  var backdrop=overlay.querySelector('.mod-backdrop');
  var closeBtn=overlay.querySelector('.mod-close');

  function open(){overlay.classList.add('mod-overlay--open');document.body.style.overflow='hidden'}
  function close(){overlay.classList.remove('mod-overlay--open');document.body.style.overflow=''}

  trigger.addEventListener('click',open);
  if(backdrop)backdrop.addEventListener('click',close);
  if(closeBtn)closeBtn.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();
