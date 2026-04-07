(function(){
  'use strict';
  var viewport=document.querySelector('.car-viewport');
  if(!viewport)return;
  var track=viewport.querySelector('.car-track');
  var slides=viewport.querySelectorAll('.car-slide');
  var prevBtn=document.querySelector('.car-btn--prev');
  var nextBtn=document.querySelector('.car-btn--next');
  var dotsEl=document.querySelector('.car-dots');
  var current=0,total=slides.length,dragging=false,startX=0,startTranslate=0,autoTimer=null;
  var config={autoplay:0};

  function goTo(i){current=((i%total)+total)%total;track.style.transform='translateX(-'+(current*100)+'%)';updateDots()}
  function next(){goTo(current+1)}
  function prev(){goTo(current-1)}

  function createDots(){
    if(!dotsEl)return;dotsEl.innerHTML='';
    for(var i=0;i<total;i++){var d=document.createElement('button');d.className='car-dot'+(i===0?' car-dot--active':'');d.dataset.i=i;
    d.addEventListener('click',function(){goTo(+this.dataset.i)});dotsEl.appendChild(d)}
  }
  function updateDots(){
    if(!dotsEl)return;var dots=dotsEl.querySelectorAll('.car-dot');
    dots.forEach(function(d,i){d.classList.toggle('car-dot--active',i===current)})
  }
  function resetAuto(){if(autoTimer)clearInterval(autoTimer);if(config.autoplay>0)autoTimer=setInterval(next,config.autoplay)}

  if(prevBtn)prevBtn.addEventListener('click',function(){prev();resetAuto()});
  if(nextBtn)nextBtn.addEventListener('click',function(){next();resetAuto()});

  // Drag
  viewport.addEventListener('mousedown',function(e){dragging=true;startX=e.clientX;track.style.transition='none'});
  viewport.addEventListener('touchstart',function(e){dragging=true;startX=e.touches[0].clientX;track.style.transition='none'},{passive:true});
  window.addEventListener('mousemove',function(e){if(!dragging)return;var dx=e.clientX-startX;track.style.transform='translateX(calc(-'+(current*100)+'% + '+dx+'px))'});
  window.addEventListener('touchmove',function(e){if(!dragging)return;var dx=e.touches[0].clientX-startX;track.style.transform='translateX(calc(-'+(current*100)+'% + '+dx+'px))'},{passive:true});
  function endDrag(e){if(!dragging)return;dragging=false;track.style.transition='';var endX=e.changedTouches?e.changedTouches[0].clientX:e.clientX;var diff=startX-endX;if(Math.abs(diff)>50){diff>0?next():prev()}else{goTo(current)}resetAuto()}
  window.addEventListener('mouseup',endDrag);
  window.addEventListener('touchend',endDrag);

  var observer=new IntersectionObserver(function(entries){entries[0].isIntersecting?resetAuto():autoTimer&&clearInterval(autoTimer)},{threshold:0});
  observer.observe(viewport);

  window.__carouselUpdate=function(k,v){if(k in config){config[k]=v;resetAuto()}};
  createDots();resetAuto();
})();
