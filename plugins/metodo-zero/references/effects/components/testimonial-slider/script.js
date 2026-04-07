(function(){
  'use strict';
  var track=document.querySelector('.ts-track');
  var slides=document.querySelectorAll('.ts-slide');
  var dotsEl=document.querySelector('.ts-controls');
  var prevBtn=document.querySelector('.ts-nav-btn--prev');
  var nextBtn=document.querySelector('.ts-nav-btn--next');
  if(!track||!slides.length)return;
  var current=0,total=slides.length,autoTimer=null;
  var config={autoplay:5000};

  function goTo(i){current=((i%total)+total)%total;track.style.transform='translateX(-'+(current*100)+'%)';updateDots()}
  function next(){goTo(current+1)}
  function prev(){goTo(current-1)}

  function createDots(){
    if(!dotsEl)return;dotsEl.innerHTML='';
    for(var i=0;i<total;i++){var d=document.createElement('button');d.className='ts-dot'+(i===0?' ts-dot--active':'');d.dataset.i=i;d.addEventListener('click',function(){goTo(+this.dataset.i);resetAuto()});dotsEl.appendChild(d)}
  }
  function updateDots(){if(!dotsEl)return;dotsEl.querySelectorAll('.ts-dot').forEach(function(d,i){d.classList.toggle('ts-dot--active',i===current)})}
  function resetAuto(){if(autoTimer)clearInterval(autoTimer);if(config.autoplay>0)autoTimer=setInterval(next,config.autoplay)}

  if(prevBtn)prevBtn.addEventListener('click',function(){prev();resetAuto()});
  if(nextBtn)nextBtn.addEventListener('click',function(){next();resetAuto()});

  var observer=new IntersectionObserver(function(e){e[0].isIntersecting?resetAuto():autoTimer&&clearInterval(autoTimer)},{threshold:0});
  observer.observe(track);

  window.__testimonialUpdate=function(k,v){if(k in config){config[k]=v;resetAuto()}};
  createDots();resetAuto();
})();
