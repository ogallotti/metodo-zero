(function(){
  'use strict';
  var btns=document.querySelectorAll('.tab-btn');
  var panels=document.querySelectorAll('.tab-panel');
  var indicator=document.querySelector('.tab-indicator');
  if(!btns.length||!indicator)return;

  function activate(i){
    btns.forEach(function(b,j){b.classList.toggle('tab-btn--active',j===i)});
    panels.forEach(function(p,j){p.classList.toggle('tab-panel--active',j===i)});
    var btn=btns[i];
    indicator.style.left=btn.offsetLeft+'px';
    indicator.style.width=btn.offsetWidth+'px';
  }

  btns.forEach(function(btn,i){
    btn.addEventListener('click',function(){activate(i)});
  });

  activate(0);
  window.addEventListener('resize',function(){
    var active=document.querySelector('.tab-btn--active');
    if(active){indicator.style.left=active.offsetLeft+'px';indicator.style.width=active.offsetWidth+'px'}
  });
})();
