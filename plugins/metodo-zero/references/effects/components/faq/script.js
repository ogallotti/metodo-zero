(function(){
  'use strict';
  var items=document.querySelectorAll('.faq-item');
  items.forEach(function(item){
    var q=item.querySelector('.faq-question');
    var a=item.querySelector('.faq-answer');
    var inner=item.querySelector('.faq-answer-inner');
    if(!q||!a||!inner)return;
    q.addEventListener('click',function(){
      var isOpen=item.classList.contains('faq-item--open');
      items.forEach(function(it){it.classList.remove('faq-item--open');it.querySelector('.faq-answer').style.maxHeight='0'});
      if(!isOpen){item.classList.add('faq-item--open');a.style.maxHeight=inner.scrollHeight+'px'}
    });
  });
})();
