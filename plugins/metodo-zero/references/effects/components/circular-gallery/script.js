(function(){
  'use strict';
  var ring=document.querySelector('.cg-ring');
  var cards=document.querySelectorAll('.cg-card');
  var prevBtn=document.querySelector('.cg-btn--prev');
  var nextBtn=document.querySelector('.cg-btn--next');
  if(!ring||!cards.length)return;

  var total=cards.length;
  var angle=360/total;
  var current=0;

  function layout(){
    var radius=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cg-radius'))||300;
    cards.forEach(function(card,i){
      var theta=angle*i;
      card.style.transform='rotateY('+theta+'deg) translateZ('+radius+'px)';
    });
    rotate();
  }

  function rotate(){
    ring.style.transform='rotateY('+(current*-angle)+'deg)';
  }

  function next(){current=(current+1)%total;rotate()}
  function prev(){current=((current-1)%total+total)%total;rotate()}

  if(prevBtn)prevBtn.addEventListener('click',prev);
  if(nextBtn)nextBtn.addEventListener('click',next);

  var startX=0,dragging=false;
  ring.addEventListener('mousedown',function(e){dragging=true;startX=e.clientX});
  ring.addEventListener('touchstart',function(e){dragging=true;startX=e.touches[0].clientX},{passive:true});
  window.addEventListener('mousemove',function(e){
    if(!dragging)return;
    var diff=e.clientX-startX;
    if(Math.abs(diff)>40){diff>0?prev():next();startX=e.clientX}
  });
  window.addEventListener('touchend',function(e){
    if(!dragging)return;dragging=false;
    var diff=startX-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){diff>0?next():prev()}
  });
  window.addEventListener('mouseup',function(){dragging=false});

  layout();
  window.addEventListener('resize',layout);
})();
