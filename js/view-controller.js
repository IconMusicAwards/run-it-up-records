(function(){
'use strict';
const ids=['hub','items','contactInbox','financePanel','sheetPanel','permissionsPanel','bannerPanel'];
const $=id=>document.getElementById(id);
function isolate(id){
  ids.forEach(x=>{const el=$(x);if(el)el.classList.toggle('hidden',x!==id)});
  const add=$('newItem');if(add)add.classList.toggle('hidden',id!=='items');
}
function bind(){
  const nav=document.querySelector('#dashboard aside nav');if(!nav||nav.dataset.controller==='1')return;
  nav.dataset.controller='1';
  nav.addEventListener('click',function(e){
    const b=e.target.closest('button');if(!b)return;
    let target=null;
    if(b.id==='hubBtn')target='hub';
    else if(b.id==='inboxBtn')target='contactInbox';
    else if(b.id==='financeBtn')target='financePanel';
    else if(b.id==='sheetBtn')target='sheetPanel';
    else if(b.id==='permissionsBtn')target='permissionsPanel';
    else if(b.id==='bannerBtn')target='bannerPanel';
    else if(b.dataset.view)target='items';
    if(!target)return;
    isolate(target);
    requestAnimationFrame(()=>isolate(target));
    setTimeout(()=>isolate(target),100);
  },true);
}
window.RIUViewController={show:isolate,bind};
bind();
new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
})();