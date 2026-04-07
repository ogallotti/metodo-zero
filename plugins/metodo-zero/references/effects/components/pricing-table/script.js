(function(){
  'use strict';
  var toggle=document.querySelector('.pt-switch');
  var labels=document.querySelectorAll('.pt-toggle-label');
  var amounts=document.querySelectorAll('.pt-amount');
  var periods=document.querySelectorAll('.pt-period');
  if(!toggle)return;
  var isYearly=false;

  var prices=[
    {monthly:'$9',yearly:'$7'},
    {monthly:'$29',yearly:'$23'},
    {monthly:'$79',yearly:'$63'}
  ];

  function update(){
    toggle.classList.toggle('pt-switch--active',isYearly);
    labels[0].classList.toggle('pt-toggle-label--active',!isYearly);
    labels[1].classList.toggle('pt-toggle-label--active',isYearly);
    amounts.forEach(function(el,i){
      if(prices[i])el.textContent=isYearly?prices[i].yearly:prices[i].monthly;
    });
    periods.forEach(function(el){el.textContent=isYearly?'/mo (billed yearly)':'/month'});
  }

  toggle.addEventListener('click',function(){isYearly=!isYearly;update()});
  update();
})();
