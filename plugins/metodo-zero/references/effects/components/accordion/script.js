(function(){
  'use strict';
  var items=document.querySelectorAll('.acc-item');
  items.forEach(function(item){
    var trigger=item.querySelector('.acc-trigger');
    var content=item.querySelector('.acc-content');
    var inner=item.querySelector('.acc-content-inner');
    if(!trigger||!content||!inner)return;
    trigger.addEventListener('click',function(){
      var isOpen=item.classList.contains('acc-item--open');
      // Close all
      items.forEach(function(it){
        it.classList.remove('acc-item--open');
        it.querySelector('.acc-content').style.maxHeight='0';
      });
      if(!isOpen){
        item.classList.add('acc-item--open');
        content.style.maxHeight=inner.scrollHeight+'px';
      }
    });
  });
})();
