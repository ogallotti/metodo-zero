(function(){
  'use strict';
  // Tooltips are CSS-only with smart positioning
  var targets=document.querySelectorAll('.tt-target');
  targets.forEach(function(target){
    var tip=target.querySelector('.tt-tooltip');
    if(!tip)return;
    target.addEventListener('mouseenter',function(){
      var rect=target.getBoundingClientRect();
      if(rect.top<80){
        tip.classList.remove('tt-tooltip--top');
        tip.classList.add('tt-tooltip--bottom');
      }else{
        tip.classList.remove('tt-tooltip--bottom');
        tip.classList.add('tt-tooltip--top');
      }
    });
  });
})();
