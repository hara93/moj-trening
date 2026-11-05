/* Home is presentation only. Suggestions and the plan come from the existing
   daily/weekly models; selecting a suggestion opens its review before starting. */
(function(root,factory){
  const api=factory();
  if(root)root.HomeView=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(vm){
    const daily=vm.daily, rec=daily?.recommendation, last=vm.last;
    const attrs=o=>Object.keys(o).map(k=>(k==='a'?'data-a':'data-'+k)+'="'+esc(o[k])+'"').join(' ');
    return '<div class="view home home-simple">'+vm.topbarHtml+
      '<header class="home-heading"><div><p class="home-date">'+esc(vm.dateLabel)+'</p><h1>Spreman za danas?</h1></div><button type="button" class="ib" data-a="homeGuide" aria-label="Kako koristiti aplikaciju">'+vm.infoIcon+'</button></header>'+
      (vm.stateHtml||'')+
      (rec?'<section class="home-today" aria-labelledby="home-today-title" data-kind="'+esc(rec.kind)+'"><div class="home-today-label"><span class="home-signal" aria-hidden="true"></span>Danas za tebe</div><h2 id="home-today-title">'+esc(rec.title)+'</h2><p>'+esc(rec.summary)+'</p><button type="button" class="home-primary" data-a="todayOpen">Pogledaj prijedlog <span aria-hidden="true">↗</span></button></section>':'')+
      '<div class="home-checks"><button type="button" data-a="morningOpen"><span class="home-small-icon" aria-hidden="true">☀</span><span><strong>Jutarnja provjera</strong><small>'+esc(daily?.checkin?'Spremljeno · uredi odgovore':'Kako se danas osjećaš?')+'</small></span></button><button type="button" data-a="teamNew"><span class="home-small-icon" aria-hidden="true">+</span><span><strong>Ekipni trening</strong><small>Upiši trening ili utakmicu</small></span></button></div>'+
      '<section class="home-week" aria-label="Tvoj tjedan"><div class="home-section-head"><h2>Tvoj tjedan</h2><button type="button" data-a="dashboardProgress">Napredak ↗</button></div>'+vm.weekHtml+'</section>'+
      '<section class="home-choose" aria-labelledby="home-choose-title"><div class="home-section-head"><h2 id="home-choose-title">Odaberi trening</h2><button type="button" data-a="tab" data-tab="protocols">Moji protokoli ↗</button></div><div class="home-categories" aria-label="Kategorije treninga">'+
      vm.cards.map(c=>'<button type="button" class="hcard" data-category="'+esc(c.k)+'" '+attrs(c.a)+'><span class="home-category-icon" aria-hidden="true">'+c.iconHtml+'</span><span class="home-category-text"><strong>'+esc(c.t)+'</strong><small>'+esc(c.s)+'</small></span><span class="home-category-arrow" aria-hidden="true">›</span></button>').join('')+'</div></section>'+
      '<section class="home-recent"><div class="home-section-head"><h2>Zadnji trening</h2><button type="button" data-a="historyList">Povijest ↗</button></div>'+
      (last?'<button type="button" class="home-last" data-a="historyOpen" data-id="'+esc(last.historyId)+'"><span><strong>'+esc(last.name)+'</strong><small>'+esc(vm.lastDate)+(Number.isFinite(last.secs)&&last.secs>=0?' · '+esc(last.secs<60?Math.round(last.secs)+' s':Math.round(last.secs/60)+' min'):'')+'</small></span><span aria-hidden="true">›</span></button>':'<p class="home-empty">Kad spremiš prvi trening, ovdje će biti tvoja zadnja izvedba.</p>')+'</section>'+
      (vm.dataHintHtml||'')+'</div>';
  }
  return {render};
});
