(function(){
  'use strict';
  var container=document.querySelector('.es-container');
  if(!container)return;
  var tracks=container.querySelectorAll('.es-track');
  var config={snap:10,elasticity:0.3};

  tracks.forEach(function(track){
    var fill=track.querySelector('.es-fill');
    var thumb=track.querySelector('.es-thumb');
    var valueEl=track.parentElement.querySelector('.es-value');
    var min=parseFloat(track.dataset.min)||0;
    var max=parseFloat(track.dataset.max)||100;
    var dragging=false;

    function setValue(pct){
      pct=Math.max(0,Math.min(100,pct));
      if(config.snap>1){
        var step=100/(config.snap-1);
        pct=Math.round(pct/step)*step;
      }
      fill.style.width=pct+'%';
      thumb.style.left=pct+'%';
      var val=Math.round(min+(max-min)*(pct/100));
      if(valueEl)valueEl.textContent=val;
    }

    function getPct(e){
      var rect=track.getBoundingClientRect();
      var x=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
      return(x/rect.width)*100;
    }

    track.addEventListener('mousedown',function(e){dragging=true;setValue(getPct(e))});
    track.addEventListener('touchstart',function(e){dragging=true;setValue(getPct(e))},{passive:true});
    window.addEventListener('mousemove',function(e){if(dragging)setValue(getPct(e))});
    window.addEventListener('touchmove',function(e){if(dragging)setValue(getPct(e))},{passive:true});
    window.addEventListener('mouseup',function(){dragging=false});
    window.addEventListener('touchend',function(){dragging=false});

    setValue(50);
  });

  window.__elasticSliderUpdate=function(k,v){if(k in config)config[k]=v};
})();
