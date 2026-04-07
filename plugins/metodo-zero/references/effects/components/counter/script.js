(function(){
  'use strict';
  var config={duration:2000};
  var counters=document.querySelectorAll('.cnt-number');
  if(!counters.length)return;
  var prefersRM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el){
    var target=parseFloat(el.dataset.target)||0;
    var suffix=el.dataset.suffix||'';
    var decimals=parseInt(el.dataset.decimals)||0;
    if(prefersRM){el.textContent=target.toFixed(decimals)+suffix;return}
    var start=0;var startTime=null;
    function step(ts){
      if(!startTime)startTime=ts;
      var progress=Math.min((ts-startTime)/config.duration,1);
      var eased=1-Math.pow(1-progress,3);
      var current=start+eased*(target-start);
      el.textContent=current.toFixed(decimals)+suffix;
      if(progress<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){animateCounter(entry.target);observer.unobserve(entry.target)}
    });
  },{threshold:0.3});
  counters.forEach(function(c){observer.observe(c)});

  window.__counterUpdate=function(k,v){if(k in config)config[k]=v};
})();
