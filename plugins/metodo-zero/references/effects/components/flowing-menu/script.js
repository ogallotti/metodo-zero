(function(){
  'use strict';
  var navs=document.querySelectorAll('.fm-nav');
  navs.forEach(function(nav){
    var highlight=nav.querySelector('.fm-highlight');
    var items=nav.querySelectorAll('.fm-item');
    if(!highlight||!items.length)return;

    function moveHighlight(el){
      var navRect=nav.getBoundingClientRect();
      var elRect=el.getBoundingClientRect();
      highlight.style.top=(elRect.top-navRect.top)+'px';
      highlight.style.left=(elRect.left-navRect.left)+'px';
      highlight.style.width=elRect.width+'px';
      highlight.style.height=elRect.height+'px';
    }

    items.forEach(function(item){
      item.addEventListener('mouseenter',function(){moveHighlight(item)});
    });

    nav.addEventListener('mouseleave',function(){
      highlight.style.opacity='0';
    });
    nav.addEventListener('mouseenter',function(){
      highlight.style.opacity='';
    });
  });
})();
