(function(){
  'use strict';
  var prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReducedMotion)return;

  var dock=document.querySelector('.dk-dock');
  if(!dock)return;
  var items=dock.querySelectorAll('.dk-item');
  var config={magnification:1.6,range:2};

  function applyMagnification(mouseX){
    items.forEach(function(item){
      var icon=item.querySelector('.dk-icon');
      if(!icon)return;
      var rect=item.getBoundingClientRect();
      var center=rect.left+rect.width/2;
      var dist=Math.abs(mouseX-center);
      var iconSize=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dk-icon-size'))||48;
      var maxDist=iconSize*config.range;
      var scale=1;
      if(dist<maxDist){
        scale=1+(config.magnification-1)*(1-dist/maxDist);
      }
      icon.style.transform='scale('+scale+')';
    });
  }

  function resetMagnification(){
    items.forEach(function(item){
      var icon=item.querySelector('.dk-icon');
      if(icon)icon.style.transform='scale(1)';
    });
  }

  dock.addEventListener('mousemove',function(e){applyMagnification(e.clientX)});
  dock.addEventListener('mouseleave',resetMagnification);

  window.__dockUpdate=function(k,v){if(k in config)config[k]=v};
})();
