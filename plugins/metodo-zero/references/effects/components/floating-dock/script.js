(function(){
  'use strict';
  var items=document.querySelectorAll('.fd-item');
  items.forEach(function(item){
    item.addEventListener('click',function(){
      items.forEach(function(i){i.classList.remove('fd-item--active')});
      item.classList.add('fd-item--active');
    });
  });
})();
