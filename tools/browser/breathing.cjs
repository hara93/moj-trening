'use strict';
// 1.25.0 Disanje: the five breathing exercises in the library (4-7-8 last, on the circle with its hold), the breathing pacer in the player (circle and square) on a
// fast clock, the bedtime night display (black pixels, a tap that does not pause, no finish tone, the entry saving
// itself), pause and a jump from the background with no tone in the middle of a phase, reduced motion, the breath-hold
// sprints as a plain sets × reps exercise with the player's rest and the one-time safety gate from the library, a
// training and Danas, Dnevnik without kg or reserve, the training editor's breathing chips, the history detail, calm
// breathing carrying no load and no horizontal overflow at 375 and 393 px. Synthetic data only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {artifacts,engine,fixture:baseFixture,launch,serve,openQuit}=require('./runtime.cjs');
const A=(p,n)=>p.locator('[data-a="'+n+'"]');
const by=(p,n,id)=>p.locator('[data-a="'+n+'"][data-id="'+id+'"]');
const store=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.data.v1')));
const settings=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.settings')||'{}'));
const play=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mt.play')));
const START=new Date('2026-11-13T18:30:00+01:00').getTime();   // a Friday
const square={exId:'kvadratno-disanje',measure:'time',sec:64,sets:1,reps:1,rest:0,sides:false,kg:0,breath:{kind:'calm',min:1}};
const sprint={exId:'sprintevi-bez-daha',measure:'sets',sec:30,sets:2,reps:6,rest:180,sides:false,kg:0};
function fixture(){
  const d=baseFixture();d.log=[];d.field={};d.programs={};
  Object.assign(d.settings,{sound:true,vibration:false,planDates:{},matchDates:{},matchDay:-1,playerGuideSeen:true,transSec:10,switchSec:5,
    morningChecks:{'2026-11-13':{date:'2026-11-13',energy:5,legs:4,pain:0}}});
  delete d.settings.rshGate;
  d.protocols={
    'dis-mix':{id:'dis-mix',name:'Izdržaj i disanje',days:[],items:[
      {exId:'plank',measure:'time',sec:20,sets:1,reps:1,rest:0,sides:false,kg:0,section:'Glavni dio'},{...square,section:'Završni dio'}]},
    'dis-krug':{id:'dis-krug',name:'Samo disanje',days:[],items:[
      {exId:'sporo-disanje',measure:'time',sec:300,sets:1,reps:1,rest:0,sides:false,kg:0,breath:{kind:'calm',preset:'svaki-dan',min:5}}]},
    'dis-noc':{id:'dis-noc',name:'Prije spavanja',days:[],items:[
      {exId:'sporo-disanje',measure:'time',sec:600,sets:1,reps:1,rest:0,sides:false,kg:0,breath:{kind:'calm',preset:'spavanje',min:10}}]},
    'dis-sprint':{id:'dis-sprint',name:'Sprintevi bez daha',days:[4],items:[sprint]}};
  return d;
}
// every oscillator the app starts: its first frequency and when it was asked to sound (audio clock), plus the beeps
const AUDIO_PROBE=()=>{
  window.__tones=[];
  const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
  const make=Ctx.prototype.createOscillator;
  Ctx.prototype.createOscillator=function(){
    const o=make.call(this),ctx=this,rec={f:null,at:null,now:null};
    const set=o.frequency.setValueAtTime.bind(o.frequency);
    o.frequency.setValueAtTime=(v,t)=>{if(rec.f==null)rec.f=v;return set(v,t);};
    const start=o.start.bind(o);
    o.start=t=>{if(rec.f==null)rec.f=o.frequency.value;rec.at=t||ctx.currentTime;rec.now=ctx.currentTime;rec.wall=Date.now();window.__tones.push(rec);return start(t);};
    return o;
  };
};
async function overflow(p,label){
  const o=await p.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));
  assert.ok(o.w<=o.v,label+': no horizontal overflow ('+o.w+' > '+o.v+')');
}
// the darkest-lightest pixel in a box of the current screen, decoded in the page from a real screenshot
async function brightest(p,box){
  const png=(await p.screenshot({clip:box})).toString('base64');
  return p.evaluate(async src=>{const img=new Image();img.src='data:image/png;base64,'+src;await img.decode();
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const g=c.getContext('2d');g.drawImage(img,0,0);
    const d=g.getImageData(0,0,c.width,c.height).data;let m=0;for(let i=0;i<d.length;i+=4)m=Math.max(m,d[i],d[i+1],d[i+2]);return m;},png);
}
(async()=>{
  const host=await serve(),browser=await launch(),report={engine,checks:[]};
  const ok=(name,extra)=>report.checks.push({name,...(extra||{})});
  async function session({width=393,height=852,reduced=false}={}){
    const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:2,serviceWorkers:'block',
      locale:'hr-HR',timezoneId:'Europe/Zagreb',reducedMotion:reduced?'reduce':'no-preference'});
    await context.addInitScript(AUDIO_PROBE);
    const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(8000);
    let now=START;
    const clock=async s=>{now+=s*1000;await p.clock.setFixedTime(new Date(now));await p.waitForTimeout(260);};
    await p.clock.setFixedTime(new Date(now));await p.goto(host.url,{waitUntil:'domcontentloaded'});
    await A(p,'dataSheet').click();
    await p.locator('#importFile').setInputFiles({name:'breathing-synthetic.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture()))});
    await A(p,'restoreApply').click();await A(p,'restoreApply').waitFor({state:'hidden'});await p.reload({waitUntil:'domcontentloaded'});
    const home=async()=>{const nav=p.getByRole('button',{name:'Moj pregled',exact:true});
      for(let i=0;i<6&&!await nav.isVisible();i++){await A(p,'back').first().click().catch(()=>{});await p.waitForTimeout(200);}await nav.click();};
    const openPr=async id=>{await home();await A(p,'dashboardProtocols').first().click();await by(p,'openPr',id).click();};
    const library=async id=>{await home();await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();await by(p,'openEx',id).click();};
    const shot=name=>p.screenshot({path:path.join(artifacts,'breathing-'+engine+'-'+name+'.png')});
    const pacer=()=>p.evaluate(()=>{const q=s=>document.querySelector(s);const el=q('.breath-pacer');return el?{word:q('.breath-word').textContent,sec:q('.breath-sec').textContent,
      k:el.dataset.k,lv:el.style.getPropertyValue('--lv'),still:el.classList.contains('is-still'),head:q('.workout-cinema-heading p')?.textContent,
      pill:q('.cinema-work-journal>span')?.textContent,night:!!q('.workout-cinema.is-night'),shape:el.classList.contains('is-square')?'square':'circle'}:null;});
    const tones=()=>p.evaluate(()=>window.__tones.map(t=>({f:Math.round(t.f),at:t.at,now:t.now})));
    const audio=()=>p.evaluate(()=>{try{return document.querySelector('.workout-cinema')&&window.__tones?true:false;}catch{return false;}});
    return {context,p,errors,clock,home,openPr,library,shot,pacer,tones,audio};
  }
  try{
    /* ---------- 1. library, the exercise page, the square pacer, pause and the jump back from the background ---------- */
    {
      const s=await session(),{p}=s;
      try{
        await s.home();await p.getByRole('button',{name:'Knjižnica vježbi',exact:true}).click();
        await p.locator('.chip',{hasText:/^Disanje$/}).first().click();
        const ids=await A(p,'openEx').evaluateAll(n=>n.map(x=>x.dataset.id));
        assert.deepEqual(ids.slice().sort(),['ciklicki-uzdah','disanje-4-7-8','kvadratno-disanje','sporo-disanje','sprintevi-bez-daha'],'the Disanje category lists the five exercises');
        assert.equal(ids[ids.length-1],'disanje-4-7-8','4-7-8 comes after the evidence-based exercises');
        await overflow(p,'library 393');
        await by(p,'openEx','sporo-disanje').click();
        await p.locator('.breath-page').waitFor();
        assert.equal(await p.locator('.breath-presets .chip').count(),3,'Sporo disanje has three presets');
        assert.match(await p.locator('.breath-page').innerText(),/Točno 10:00 · 60 udaha/);
        assert.match(await p.locator('.breath-page').innerText(),/Dokazi: ograničeni/);
        assert.equal(await p.locator('.breath-oprez[open]').count(),0,'Oprez is folded');
        await p.locator('[data-a="exBreath"][data-k="variant"][data-v="laksi-ritam"]').click();
        assert.match(await p.locator('.breath-page').innerText(),/Stvarno 10:04 · 71 udah/,'the real total is whole breaths');
        await p.locator('[data-a="exBreath"][data-k="preset"][data-v="utakmica"]').click();
        assert.match(await p.locator('.breath-pattern-ramp').innerText(),/4\/4\s*›\s*4\/5\s*›\s*4\/6/);
        assert.match(await p.locator('.breath-practice').innerText(),/Uvježbano 0 od 6/);
        await s.shot('page-utakmica');await overflow(p,'exercise page 393');
        ok('library and exercise page');

        // Disanje 4-7-8: very low evidence in words, Lakši 4-6-8, 5 min = 16 breaths; on the circle the hold keeps it full
        // while the rim fills, every phase on time
        await s.library('disanje-4-7-8');await p.locator('.breath-page').waitFor();
        const page478=await p.locator('.breath-page').innerText();
        assert.match(page478,/Dokazi: vrlo slabi/);assert.match(page478,/Stvarno 5:04 · 16 udaha/);assert.match(page478,/Ne dok si zadihan/);
        assert.equal(await p.locator('[data-a="exBreath"][data-k="variant"][data-v="4-6-8"]').innerText(),'Lakši 4-6-8');
        assert.deepEqual(await p.locator('[data-a="exBreath"][data-k="min"]').allInnerTexts(),['2 min','5 min']);
        await s.shot('page-478');await overflow(p,'4-7-8 page 393');
        await A(p,'playEx').click();await p.locator('.workout-cinema').waitFor();
        for(let i=0;i<80&&!await p.locator('.breath-pacer').count();i++)await s.clock(.25);
        let w=await s.pacer();assert.equal(w.shape,'circle');assert.equal(w.word,'Udah');assert.equal(w.pill,'1 od 16');assert.match(w.head,/^Još 5:0[34] · 4-7-8 s$/);
        const ring=()=>p.locator('.breath-ring-fill').evaluate(n=>({d:parseFloat(n.getAttribute('stroke-dasharray')),op:n.style.opacity}));
        assert.equal((await ring()).op,'0','no rim on the inhale');
        await s.clock(4.6);w=await s.pacer();assert.equal(w.word,'Zadrži');assert.equal(w.k,'hold_in');assert.equal(w.lv,'1.0000','full during the hold');
        const r1=await ring();await s.clock(3);const r2=await ring();
        assert.ok(r1.d>0&&r2.d>r1.d&&r2.op==='1','the rim shows the hold\'s progress: '+JSON.stringify([r1,r2]));
        assert.equal((await s.pacer()).lv,'1.0000');
        await s.shot('circle-478-hold');
        await s.clock(3.6);w=await s.pacer();assert.equal(w.word,'Izdah');assert.equal(w.sec,'8');assert.equal((await ring()).op,'0');
        await s.clock(8.1);w=await s.pacer();assert.equal(w.word,'Udah');assert.equal(w.pill,'2 od 16','a whole cycle is 19 s');
        await openQuit(p);await A(p,'quitDiscard').click();await p.locator('.workout-cinema').waitFor({state:'hidden'});
        ok('Disanje 4-7-8');

        // the square on a fast clock, from a training (the plank before it is skipped)
        await s.openPr('dis-mix');await A(p,'startPr').click();await p.locator('.workout-cinema').waitFor();
        // the plank, then the overview of Završni dio (its countdown leads straight into the breathing), then the pacer
        const phase=()=>p.locator('.workout-cinema').getAttribute('data-phase');
        let seenWork=false;
        for(let i=0;i<60;i++){const ph=await phase();if(ph==='work')seenWork=true;if(seenWork&&ph==='section')break;await s.clock(1);}
        assert.equal(await phase(),'section');
        for(let i=0;i<80&&!await p.locator('.breath-pacer').count();i++)await s.clock(.25);
        let v=await s.pacer();assert.equal(v.shape,'square');assert.equal(v.word,'Udah');assert.equal(v.pill,'1 od 4');assert.match(v.head,/^Još 1:0[34] · 4-4-4-4 s$/);
        assert.equal(await p.locator('.workout-cinema-metric').count(),0,'no seconds picker, arc or kg on the breathing step');
        const t0=(await s.tones()).length;
        await s.clock(1.6);v=await s.pacer();assert.equal(v.word,'Udah');assert.equal(v.sec,'3');
        await s.clock(2.6);v=await s.pacer();assert.equal(v.word,'Zadrži');assert.equal(v.k,'hold_in');
        await s.shot('square-hold');
        // a jump (back from the background) into the middle of a phase: no tone until the next boundary
        const beforeJump=(await s.tones()).length;
        await s.clock(5.3);v=await s.pacer();assert.equal(v.word,'Izdah');
        const ctxRunning=await p.evaluate(()=>{const C=window.AudioContext||window.webkitAudioContext;return !!C;});
        assert.equal((await s.tones()).length,beforeJump,'no tone in the middle of a phase after a jump');
        // close to the boundary the next tone is scheduled ahead on the audio clock (when the browser runs audio)
        await s.clock(2.3);const scheduled=(await s.tones()).slice(beforeJump);
        if(t0>0)assert.ok(scheduled.some(t=>t.f===440),'the hold tone at the boundary: '+JSON.stringify(scheduled));
        await s.clock(1.65);v=await s.pacer();assert.equal(v.k,'hold_out');
        // pause: the pacer stands still and the pause layer hides it; on resume in the middle of a phase there is no tone
        const box=await p.locator('.workout-cinema-stage').boundingBox();
        await p.mouse.click(box.x+box.width/2,box.y+box.height/2);await p.locator('.workout-cinema.has-pause-overlay').waitFor();
        const paused=await s.pacer();await s.clock(4);assert.deepEqual(await s.pacer(),paused,'paused: the pacer does not move');
        assert.equal(await p.locator('.breath-pacer').evaluate(n=>getComputedStyle(n).opacity),'0','the pause layer hides the pacer');
        const atResume=(await s.tones()).length;
        await A(p,'cinemaResume').click();await p.locator('.workout-cinema.has-pause-overlay').waitFor({state:'hidden'});
        await s.clock(.3);assert.equal((await s.tones()).length,atResume,'no tone on resume in the middle of a phase');
        // the live region: one, outside #app, polite, never the seconds
        const live=await p.evaluate(()=>{const els=[...document.querySelectorAll('[aria-live]')].filter(e=>e.id==='breath-live');return {n:els.length,outside:els[0]&&!document.getElementById('app').contains(els[0]),text:els[0]?.textContent||'',polite:els[0]?.getAttribute('aria-live')};});
        assert.equal(live.n,1);assert.equal(live.outside,true);assert.equal(live.polite,'polite');assert.doesNotMatch(live.text,/\d+ sekund[aei]?\.$/);
        report.tones={started:t0,scheduledAhead:scheduled.map(t=>({f:t.f,ahead:+(t.at-t.now).toFixed(2)})),contextAvailable:ctxRunning};
        // Dnevnik: one row per set, no kg, reserve, equipment or swap
        await A(p,'cinemaJournal').click();const card=p.locator('.breath-journal-rows').first();await card.waitFor();await p.waitForTimeout(500);
        assert.match(await card.innerText(),/1:04 · 4-4-4-4 s/);
        assert.equal(await p.locator('.sheet[data-kind="cinemaJournal"] .workout-player-exercise[data-current="true"] input').count(),0,'no kg or reserve fields');
        assert.match(await p.locator('.sheet[data-kind="cinemaJournal"]').innerText(),/Još nema prethodne izvedbe/);
        await s.shot('journal');await A(p,'cinemaJournalClose').click();
        await s.clock(70);await A(p,'finishPlay').waitFor();
        // a mixed training: the effort is rated without the breathing minutes
        assert.match(await p.locator('.view').innerText(),/Ocijeni trening bez disanja/);
        await A(p,'finishPlay').click();
        const entry=(await store(p)).log[0];
        assert.equal(entry.calmOnly,undefined,'a mixed training is a training');assert.ok(entry.calmSecs>=60&&entry.calmSecs<=65,'calm seconds '+entry.calmSecs);
        assert.deepEqual(entry.items[1].breath,{kind:'calm',min:1},'the breathing choices are stored with the item');
        ok('square pacer, pause, background jump, Dnevnik, mixed done screen');

        // the history detail draws breathing without kilograms or reserve
        await s.home();await A(p,'historyList').first().click();await by(p,'historyOpen',entry.historyId).click();
        const breathCard=p.locator('.hy-exercise').nth(1);await breathCard.waitFor();
        const text=await breathCard.innerText();
        assert.match(text,/Vrijeme disanja/);assert.match(text,/Disanje nema opterećenje/);assert.doesNotMatch(text,/Teret|RIR/);
        await s.shot('history');await overflow(p,'history 393');
        await A(p,'historyEdit').click();
        const editText=await p.locator('.hy-edit-item').nth(1).innerText();assert.doesNotMatch(editText,/Teret|RIR|Rezerva/,'editing a breathing record asks for no kg or reserve');
        ok('history detail');

        // the training editor: breathing chips instead of Trajanje, the real total in whole breaths, then saved
        await s.openPr('dis-mix');await A(p,'workoutProtocolOptions').click();await by(p,'editPr','dis-mix').first().click();
        await p.locator('[data-a="itOpen"][data-i="1"]').click();
        assert.equal(await p.locator('[data-a="istep"][data-k="sec"][data-i="1"]').count(),0,'no Trajanje stepper');
        await p.locator('[data-a="ibreath"][data-k="min"][data-v="5"][data-i="1"]').click();
        assert.match(await p.locator('.breath-editor').innerText(),/Stvarno 5:04 · 19 udaha/);
        assert.match(await p.locator('#dose-1').innerText(),/5 min · 4-4-4-4 s/);
        await s.shot('editor');await overflow(p,'editor 393');
        await p.locator('.topbar [data-a="savePr"]').click();await p.waitForTimeout(300);
        const saved=(await store(p)).protocols['dis-mix'].items[1];
        assert.equal(saved.sec,304);assert.deepEqual(saved.breath,{kind:'calm',min:5});assert.equal(saved.section,'Završni dio','the item keeps its part');
        ok('training editor');
        assert.deepEqual(s.errors,[]);
      }catch(e){await s.shot('failure-1').catch(()=>{});throw e;}finally{await s.context.close();}
    }

    /* ---------- 2. the circle, the bedtime night display and Danas ---------- */
    {
      const s=await session(),{p}=s;
      try{
        await s.home();await A(p,'todayOpen').click();await p.locator('#today-recommendation').waitFor();
        const todayBefore=await p.locator('#today-recommendation').innerText();
        // calm breathing alone, as a training: the circle
        await s.openPr('dis-krug');await A(p,'startPr').click();await p.locator('.workout-cinema[data-phase="ready"]').waitFor();
        assert.match(await p.locator('.workout-cinema-heading').innerText(),/Sjedni ili lezi, ruka na trbuhu/,'prep says how to sit or lie');
        await s.clock(5.2);await p.locator('.breath-pacer').waitFor();
        let v=await s.pacer();assert.equal(v.shape,'circle');assert.equal(v.word,'Udah');assert.equal(v.pill,'1 od 30');
        const lv0=+v.lv;await s.clock(2);v=await s.pacer();assert.ok(+v.lv>lv0,'the circle grows on the inhale');
        await s.clock(2.5);v=await s.pacer();assert.equal(v.word,'Izdah');assert.equal(v.sec,'6');
        await s.clock(10);v=await s.pacer();assert.equal(v.pill,'2 od 30');
        // the rim stays clear of the word: the smallest disc still holds the text
        const fit=await p.evaluate(()=>{const d=document.querySelector('.breath-track').getBoundingClientRect(),t=document.querySelector('.breath-text b').getBoundingClientRect(),n=document.querySelector('.breath-sec').getBoundingClientRect();
          return {min:d.width*.5,word:t.width,height:n.bottom-t.top};});
        assert.ok(fit.word<fit.min-8&&fit.height<fit.min-8,'the smallest circle holds the word and seconds '+JSON.stringify(fit));
        await s.shot('circle');await overflow(p,'player 393');
        // the (i) sheet: rhythm, Kako, Kad, Zašto with the grade in words, Oprez folded; no muscle figure
        await p.locator('.workout-cinema [data-a="workoutInfo"]').click();const info=p.locator('.breath-info');await info.waitFor();
        assert.match(await info.innerText(),/Udah 4 s · izdah 6 s · 6 udaha u minuti/);assert.match(await info.innerText(),/Dokazi: ograničeni/);
        assert.equal(await info.locator('.breath-oprez[open]').count(),0);assert.equal(await p.locator('.workout-exercise-panel svg.fig, .workout-exercise-panel .figs').count(),0);
        await s.shot('info');await A(p,'workoutPanelBack').click();await info.waitFor({state:'hidden'});
        // under it, the paused exercise page has no set table: no kg, reserve, equipment or swap
        const panel=p.locator('.breath-panel');await panel.waitFor();
        assert.equal(await panel.locator('input').count(),0);assert.doesNotMatch(await panel.innerText(),/Zamjena|SIR|RIR|\bkg\b|Bez opreme/);
        assert.match(await panel.innerText(),/5:00 · Svaki dan · 4\/6 s/);await s.shot('panel');
        await panel.locator('[data-a="workoutClose"]').last().click();await panel.waitFor({state:'hidden'});await p.locator('.breath-pacer').waitFor();
        await s.clock(300);await A(p,'finishPlay').waitFor();
        assert.equal(await p.locator('#srpe').count(),0,'no effort slider after calm breathing alone');
        assert.match(await p.locator('.breath-done').innerText(),/Disanje nema opterećenje/);
        await A(p,'finishPlay').click();
        let entry=(await store(p)).log[0];assert.equal(entry.calmOnly,true);assert.equal(entry.srpe,undefined);
        await s.home();await A(p,'todayOpen').click();await p.locator('#today-recommendation').waitFor();
        assert.equal(await p.locator('#today-recommendation').innerText(),todayBefore,'calm breathing alone does not change Danas');
        ok('circle, calm-only done screen, Danas unchanged');

        // bedtime: black after 8 s, a tap shows the controls without pausing, no finish tone, the entry saves itself
        await s.openPr('dis-noc');await A(p,'startPr').click();await p.locator('.workout-cinema[data-phase="ready"]').waitFor();
        assert.match(await p.locator('.workout-cinema-notice').innerText(),/Ne zaključavaj mobitel/);
        await s.clock(5.2);await p.locator('.breath-pacer').waitFor();
        assert.equal((await s.pacer()).night,false,'the controls show at first');
        await s.clock(8.5);await p.waitForTimeout(1400);
        assert.equal((await s.pacer()).night,true,'black after 8 s without a touch');
        const vp=p.viewportSize();
        const top=await brightest(p,{x:0,y:0,width:vp.width,height:160}),bottom=await brightest(p,{x:0,y:vp.height-120,width:vp.width,height:120});
        assert.equal(top,0,'the header area is pure black');assert.equal(bottom,0,'the bottom area is pure black');
        await s.shot('night');
        const box=await p.locator('.workout-cinema-stage').boundingBox();
        await p.mouse.click(box.x+box.width/2,box.y+box.height*.8);await p.waitForTimeout(400);
        assert.equal((await s.pacer()).night,false,'a tap shows the controls');assert.notEqual((await play(p)).paused,true,'the tap does not pause');assert.equal(await p.locator('.has-pause-overlay').count(),0);
        await s.shot('night-tap');
        const beforeEnd=(await s.tones()).length;
        await s.clock(620);await p.locator('.breath-veil').waitFor();
        assert.equal((await s.tones()).slice(beforeEnd).filter(t=>t.f===988).length,0,'no finish tone at bedtime');
        assert.match(await p.locator('.breath-veil').innerText(),/Spremljeno\. Laku noć\./);
        entry=(await store(p)).log[0];assert.equal(entry.calmOnly,true,'the entry saved itself');assert.ok(entry.calmSecs>=590);
        assert.equal(entry.items[0].breath.preset,'spavanje');
        await A(p,'breathVeil').click();await A(p,'finishPlay').click();
        assert.equal((await store(p)).log.filter(l=>l.refId==='dis-noc').length,1,'finishing does not save it twice');
        ok('bedtime night display');

        // the safety gate from Danas (the sprints are planned for today), once
        await s.home();await A(p,'todayOpen').click();await p.locator('#today-recommendation').waitFor();
        await A(p,'todayAct').click();await p.locator('.breath-gate').waitFor();
        assert.equal(await p.locator('.workout-cinema').count(),0);
        for(const b of await A(p,'breathGateToggle').all())await b.click();
        await A(p,'breathGateGo').click();await p.locator('.workout-cinema').waitFor();
        assert.ok((await settings(p)).rshGate>0,'the confirmation is kept');
        ok('safety gate from Danas');
        await openQuit(p);await A(p,'quitDiscard').click();await p.locator('.workout-cinema').waitFor({state:'hidden'});

        // a backup export and import keeps the new fields (item choices, calm seconds, calmOnly, the gate's date)
        const pick=d=>({log:d.log.filter(l=>/^dis-/.test(l.refId)).map(l=>({refId:l.refId,calmSecs:l.calmSecs,calmOnly:l.calmOnly,breath:l.items.map(x=>x.breath||null)})),
          items:Object.fromEntries(Object.entries(d.protocols).filter(([id])=>/^dis-/.test(id)).map(([id,x])=>[id,x.items])),
          sporo:JSON.stringify(d.exercises['sporo-disanje'])});
        const before=pick(await store(p));
        await s.home();await p.getByRole('button',{name:'Početna',exact:true}).click();await A(p,'dataSheet').click();
        await p.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
        const [download]=await Promise.all([p.waitForEvent('download'),p.locator('.sheet [data-a="exportData"]').click()]);
        const copy=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
        assert.deepEqual(pick(copy),before,'the export keeps the breathing fields');assert.ok(copy.settings.rshGate>0);
        assert.ok(before.log.length>=2&&before.log.every(l=>l.calmOnly===true&&l.breath[0].kind==='calm'));
        await p.reload({waitUntil:'domcontentloaded'});await s.home();await p.getByRole('button',{name:'Početna',exact:true}).click();await A(p,'dataSheet').click();
        await p.locator('#importFile').setInputFiles({name:'breathing-copy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(copy))});
        await A(p,'restoreApply').click();await A(p,'restoreApply').waitFor({state:'hidden'});await p.reload({waitUntil:'domcontentloaded'});
        assert.deepEqual(pick(await store(p)),before,'the import keeps them too');assert.ok((await settings(p)).rshGate>0);
        ok('backup round trip');
        assert.deepEqual(s.errors,[]);
      }catch(e){await s.shot('failure-2').catch(()=>{});throw e;}finally{await s.context.close();}
    }

    /* ---------- 3. the sprints: the gate from the library and a training, sets × reps, the rest, the load ---------- */
    {
      const s=await session({width:375,height:812}),{p}=s;
      try{
        await s.library('sprintevi-bez-daha');await p.locator('.breath-page').waitFor();
        assert.match(await p.locator('.breath-page').innerText(),/Mobitel ti za sprinteve ne treba/);
        await overflow(p,'sprint page 375');
        await A(p,'playEx').click();await p.locator('.breath-gate').waitFor();
        assert.equal(await A(p,'breathGateGo').isDisabled(),true,'the gate needs every check');
        await overflow(p,'gate 375');await s.shot('gate');
        await p.locator('.breath-gate [data-a="sheetDone"]').click();await p.locator('.breath-gate').waitFor({state:'hidden'});
        ok('safety gate from the library');
        await s.openPr('dis-sprint');await A(p,'startPr').click();await p.locator('.breath-gate').waitFor();
        for(const b of await A(p,'breathGateToggle').all())await b.click();
        await A(p,'breathGateGo').click();await p.locator('.workout-cinema').waitFor();
        ok('safety gate from a training');
        assert.match(await p.locator('.workout-cinema-heading').innerText(),/Serija 1 od 2 · 70–80 % brzine/);
        await s.clock(6);await p.locator('.breath-howto').waitFor();
        assert.equal(await p.locator('.breath-pacer').count(),0,'the sprints are not paced');
        assert.match(await p.locator('.breath-howto').innerText(),/Zadrži dah i sprintaj do čunja/);
        assert.match(await p.locator('.breath-howto').innerText(),/Stani odmah kod vrtoglavice/);
        assert.equal(await p.locator('.cinema-weight-unavailable,[data-field="kg"]').count(),0,'no kg on the sprint step');
        await s.shot('sprint-work');await overflow(p,'sprint step 375');
        await p.locator('.workout-cinema [data-a="workoutInfo"]').click();await p.locator('.breath-info').waitFor();
        assert.match(await p.locator('.breath-info').innerText(),/2 × 6 sprinteva · 3 min odmora između serija/);
        await A(p,'workoutPanelBack').click();await p.locator('.breath-info').waitFor({state:'hidden'});
        assert.equal(await p.locator('.breath-panel input').count(),0,'the sprints\' exercise page has no kg or reserve fields');
        await p.locator('.breath-panel [data-a="workoutClose"]').last().click();await p.locator('.breath-howto').waitFor();
        await A(p,'cinemaJournal').click();
        const rows=await p.locator('.breath-journal-row').allInnerTexts();
        assert.equal(rows.length,2);assert.match(rows[0],/Serija 1 · 6 sprinteva/);
        await A(p,'cinemaJournalClose').click();
        await A(p,'workoutSetDone').click();await p.locator('.workout-cinema[data-phase="rest"]').waitFor();
        assert.match(await p.locator('.workout-cinema').innerText(),/3:00/,'the player\'s normal 3-min rest');
        await s.shot('sprint-rest');
        await s.clock(181);await s.clock(6);await A(p,'workoutSetDone').click();await A(p,'finishPlay').waitFor();
        await p.locator('#srpe').waitFor();await A(p,'finishPlay').click();
        const entry=(await store(p)).log[0];
        assert.equal(entry.calmOnly,undefined);assert.equal(entry.calmSecs,undefined);
        assert.ok(Math.abs(entry.load2.m-420)<0.01,'12 sprints × 35 m = 420 m, got '+entry.load2.m);
        ok('sprints as sets × reps with rest and running load',{metres:entry.load2.m});
        assert.deepEqual(s.errors,[]);
      }catch(e){await s.shot('failure-3').catch(()=>{});throw e;}finally{await s.context.close();}
    }

    /* ---------- 4. reduced motion ---------- */
    {
      const s=await session({width:375,height:812,reduced:true}),{p}=s;
      try{
        await s.openPr('dis-krug');await A(p,'startPr').click();await p.locator('.workout-cinema[data-phase="ready"]').waitFor();
        await s.clock(5.2);await p.locator('.breath-pacer').waitFor();
        const a=await s.pacer();await s.clock(2.4);const b=await s.pacer();
        assert.equal(a.still,true);assert.equal(a.lv,'0.8000');assert.equal(b.lv,'0.8000','the circle keeps one size');
        assert.equal(b.word,'Udah');assert.equal(b.sec,'2');
        const ring=await p.locator('.breath-ring-fill').getAttribute('stroke-dasharray');
        assert.match(ring,/^50\.00 100$/,'the ring fills by whole seconds: '+ring);
        await s.shot('reduced');await overflow(p,'reduced 375');
        ok('reduced motion');
        await openQuit(p);await A(p,'quitDiscard').click();await p.locator('.workout-cinema').waitFor({state:'hidden'});

        // "Uredi" on a shipped breathing exercise: the app's rule (his edit is kept as his own), and its breath data stays
        const original=(await store(p)).exercises['sporo-disanje'];
        await s.library('sporo-disanje');await A(p,'editEx').click();await p.locator('#f-feel').waitFor();
        assert.match(await p.locator('.view').innerText(),/Postavku, ritam i trajanje biraš na stranici vježbe i u treningu/);
        assert.equal(await p.locator('[data-a="dstep"][data-k="sec"]').count(),0,'no Trajanje stepper for breathing');
        await p.locator('#f-feel').fill('Mirnije prije spavanja');await A(p,'saveEx').click();await p.locator('.breath-page').waitFor();
        const edited=(await store(p)).exercises['sporo-disanje'];
        assert.equal(edited.feel,'Mirnije prije spavanja');assert.deepEqual(edited.breath,original.breath,'the breath data is not lost');
        assert.equal(edited.cat,'Disanje');assert.equal(await p.locator('.breath-presets .chip').count(),3,'the page still offers the presets');
        ok('Uredi keeps the breath data');
        assert.deepEqual(s.errors,[]);
      }catch(e){await s.shot('failure-4').catch(()=>{});throw e;}finally{await s.context.close();}
    }
    report.passed=true;
    fs.writeFileSync(path.join(artifacts,'breathing-'+engine+'-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();await host.close();}
})().catch(error=>{console.error(error.stack);process.exitCode=1;});
