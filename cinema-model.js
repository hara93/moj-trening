/* Player presentation changes preserve the recorded work timeline. No storage. */
(function(root,factory){
  'use strict';const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.CinemaModel=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const finite=n=>typeof n==='number'&&Number.isFinite(n);
  // Parts belong to this occurrence in the authored workout. The exercise's
  // library category (and its warmup metadata) never chooses a part for it.
  // Older sparse plans retain the title until the next authored title.
  function sections(items){
    let label='Glavni dio';
    return (items||[]).map(item=>{
      label=String(item.section||'').trim()||label;
      return label;
    });
  }
  function shifted(map,index){return Object.fromEntries(Object.entries(map||{}).map(([k,v])=>[Number(k)>=index?Number(k)+1:k,v]));}
  function prepare(player,seconds,now){
    const step=player?.steps?.[player.i];
    if(!step||player.done||player.mode!=='ex'||![0,5,10,30,60].includes(seconds)||!finite(now)||now<0)return null;
    if(!seconds)return {...player};
    if(step.kind==='work')return null;
    if(step.kind==='prep'||step.kind==='rest'||step.kind==='switch'){
      const left=player.paused?player.left:Math.max(0,(player.endAt-now)/1000);
      if(!finite(left)||!finite(step.dur)||left+seconds>3600)return null;
      const steps=player.steps.slice();steps[player.i]={...step,dur:step.dur+seconds};
      return {...player,steps,left:left+seconds,endAt:now+(left+seconds)*1000};
    }
    if(!['manual','ready'].includes(step.kind))return null;
    const steps=player.steps.slice();steps.splice(player.i,0,{kind:'prep',dur:seconds,g:step.g,set:step.set,title:'Pripremi se',label:'Priprema'});
    return {...player,steps,doneSteps:shifted(player.doneSteps,player.i),rir:shifted(player.rir,player.i),left:seconds,endAt:now+seconds*1000};
  }
  function rest(player,delta,now){
    const step=player?.steps?.[player.i];
    if(!step||player.done||player.mode!=='ex'||step.kind!=='rest'||![-15,15].includes(delta)||!finite(now)||now<0)return null;
    const left=player.paused?player.left:Math.max(0,(player.endAt-now)/1000);
    if(!finite(left)||!finite(step.dur))return null;
    const next=Math.max(0,Math.min(3600-(step.dur-left),left+delta));
    const steps=player.steps.slice();steps[player.i]={...step,dur:step.dur-left+next};
    return {...player,steps,left:next,endAt:now+next*1000};
  }
  function summary(player,dose){
    let total=0,complete=0,reps=0,seconds=0,volume=0;
    (player?.items||[]).forEach((item,j)=>{
      total+=item.sets||1;complete+=dose.completeSets(player,j);
      dose.rows(player,j,false).forEach(row=>{
        if(item.measure==='time')seconds+=row.sec*row.sides;
        else {reps+=row.reps*row.sides;volume+=row.reps*row.kg*row.sides;}
      });
    });
    return {total,complete,reps,seconds,volume,percent:total?Math.round(complete/total*100):0};
  }
  return Object.freeze({prepare,rest,summary,sections});
});
