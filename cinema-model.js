/* Player presentation changes preserve the recorded work timeline. No storage. */
(function(root,factory){
  'use strict';const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.CinemaModel=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const finite=n=>typeof n==='number'&&Number.isFinite(n);
  const isWork=step=>step.kind==='work'||step.kind==='manual';
  function upcoming(player){
    const current=player.steps[player.i];
    if(!current)return null;
    const duringWork=isWork(current);
    for(let i=player.i+1;i<player.steps.length;i++){
      const step=player.steps[i];
      if(isWork(step))return step;
      // Setup before a different exercise still previews that exercise.
      const sideChange=step.kind==='switch'&&!step.go&&!step.nextEx;
      if(duringWork&&step.dur>0&&(step.kind==='rest'||sideChange))return step;
    }
    return null;
  }
  // Parts belong to this occurrence in the authored workout. The exercise's
  // library category (and its warmup metadata) never chooses a part for it.
  // Older sparse plans retain the title until the next authored title.
  const DEFAULT_PART='Glavni dio';
  function sections(items){
    let label=DEFAULT_PART;
    return (items||[]).map(item=>{
      label=String(item.section||'').trim()||label;
      return label;
    });
  }
  // One part per exercise group: a superset takes the part of its first exercise, as the builder and the journal do.
  function groupSections(items){
    const list=items||[],parts=sections(list);
    for(let j=1;j<list.length;j++)if(list[j]&&list[j].ss&&list[j-1]&&list[j-1].ss===list[j].ss)parts[j]=parts[j-1];
    return parts;
  }
  // A workout really has parts when its names give more than one part, or one part that is not the default.
  function hasParts(parts){
    const names=new Set(parts||[]);
    return names.size>1||names.size===1&&!names.has(DEFAULT_PART);
  }
  // The part overview opens the workout (the start countdown) and every pause before an exercise of another part.
  // parts: one name per item (groupSections). Returns the item that opens the part, or -1.
  function partOpening(steps,index,parts){
    const list=Array.isArray(steps)?steps:[],step=list[index];
    if(!step||!hasParts(parts)||!(step.kind==='prep'||step.kind==='rest'&&step.trans))return -1;
    let before=null,after=null;
    for(let k=index-1;k>=0&&!before;k--)if(list[k]&&isWork(list[k]))before=list[k];
    for(let k=index+1;k<list.length&&!after;k++)if(list[k]&&isWork(list[k]))after=list[k];
    if(!after||!Number.isInteger(after.g)||after.g<0||after.g>=parts.length)return -1;
    // only the start countdown (step 0): preparation added later before a set (prepare) never reopens the overview
    if(step.kind==='prep')return before||index>0?-1:after.g;
    return !before||parts[before.g]!==parts[after.g]?after.g:-1;
  }
  // 1.23.0: the first set of a group (superset, triset, circuit): its first exercise in round 1.
  const firstOfGroup=step=>!!step&&isWork(step)&&Number.isInteger(step.g)&&!!step.ss&&step.ss.k===1&&step.ss.size>1&&(step.round||step.set)===1;
  // 1.23.0: one overview before each part, and before each group that does not open a part. It shows on the steps the
  // part overview uses: the start countdown and the pause before the next exercise (a transition step). A part that
  // starts with a group shows the part overview; a workout without parts that starts with a group shows the group's.
  // Returns {kind:'part', j} (the item opening the part), {kind:'group', j} (the group's first item) or null.
  function overviewAt(steps,index,parts){
    const j=partOpening(steps,index,parts);
    if(j>=0)return {kind:'part',j};
    const list=Array.isArray(steps)?steps:[],step=list[index];
    if(!step||!(step.kind==='prep'||step.kind==='rest'&&step.trans))return null;
    let before=null,after=null;
    for(let k=index-1;k>=0&&!before;k--)if(list[k]&&isWork(list[k]))before=list[k];
    for(let k=index+1;k<list.length&&!after;k++)if(list[k]&&isWork(list[k]))after=list[k];
    if(step.kind==='prep'&&(before||index>0))return null;
    return firstOfGroup(after)?{kind:'group',j:after.g}:null;
  }
  // 1.23.0: where an overview's skip button lands: the pause before item j's first set (k), as when the workout reaches
  // it, so the next part's or group's overview shows with its clock and a timed first set never starts at once.
  // Returns that step, or k when no pause lies before it.
  function skipLanding(steps,k){
    const list=Array.isArray(steps)?steps:[];
    for(let x=k-1;x>=0&&list[x]&&!isWork(list[x]);x--)if(list[x].trans)return x;
    return k;
  }
  // 1.23.0: a jump inside the group on screen keeps the round: item j's first step in round `round` (A2 from A1 round
  // 2 lands on A2 round 2), or, when j has fewer sets, the first step of its last set (its left side). -1: no set.
  function roundLanding(steps,j,round){
    const list=Array.isArray(steps)?steps:[],own=list.filter(st=>st&&isWork(st)&&st.g===j);
    if(!own.length)return -1;
    const last=Math.max.apply(null,own.map(st=>st.set||1)),set=Math.min(Math.max(1,round||1),last);
    return list.findIndex(st=>st&&isWork(st)&&st.g===j&&(st.set||1)>=set);
  }
  // 1.23.0: the one line on the work screen of an exercise inside a group, from what really follows in the step list.
  // null: not a group's set, the left side of a set whose right side follows, or the end of the workout. Otherwise
  // {kind, word, g, at} (at = the next set's step, g = the item the line names):
  // - the next set in the same group: 'Sljedeća' when nothing or only a side change or a setup countdown lies between,
  //   'Nakon odmora' after a rest (the round rest or the exercise's own rest);
  // - after the group's last set the overview that comes next decides (overviewAt on the pause between, so the line
  //   promises exactly the screen that follows): kind 'part' 'Sljedeći dio' (g opens the part), kind 'group'
  //   'Sljedeći' (g = the group's first item), else kind 'exercise' 'Sljedeća'.
  function nextLine(steps,at,parts){
    const list=Array.isArray(steps)?steps:[],st=list[at];
    if(!st||!isWork(st)||!st.ss)return null;
    let nx=-1;
    for(let k=at+1;k<list.length;k++)if(list[k]&&isWork(list[k])){nx=k;break;}
    if(nx<0)return null;
    const to=list[nx];
    if(to.g===st.g&&to.set===st.set)return null;
    let trans=-1,rest=false;
    for(let k=at+1;k<nx;k++)if(list[k].kind==='rest'){if(list[k].trans){trans=k;break;}rest=true;}
    if(trans<0)return {kind:'exercise',word:rest?'Nakon odmora':'Sljedeća',g:to.g,at:nx};
    const o=overviewAt(list,trans,parts);
    if(o)return {kind:o.kind,word:o.kind==='part'?'Sljedeći dio':'Sljedeći',g:o.j,at:nx};
    return {kind:'exercise',word:'Sljedeća',g:to.g,at:nx};
  }
  // 1.23.0: a jump that lands on a group's first set from outside the group lands on the group's overview (the pause
  // before it), so the group is announced as when the workout reaches it. k: the step the jump lands on; from: the step
  // it starts at. From inside the group (the overview itself included) the set stays the landing; a part's first set
  // stays the landing as in 1.22.1, also when the part starts with a group (its overview is the part's).
  function landing(steps,k,parts,from){
    const list=Array.isArray(steps)?steps:[],st=list[k];
    if(!firstOfGroup(st))return k;
    let t=-1;
    for(let x=k-1;x>=0&&list[x]&&!isWork(list[x]);x--){
      const o=overviewAt(list,x,parts);
      if(o){if(o.kind==='group'&&o.j===st.g)t=x;break;}
    }
    if(t<0)return k;
    let end=list.length-1;
    for(let x=k+1;x<list.length;x++)if(list[x]&&list[x].trans){end=x-1;break;}
    return Number.isInteger(from)&&from>=t&&from<=end?k:t;
  }
  // Rest phase 1 is the time alone: the first 3 s of a rest between sets, unless a tap, a pause or a sheet revealed
  // the rest (phase 2). The pause before the next exercise has no phases (0).
  const REST_ALONE_S=3;
  function restPhase(step,elapsed,revealed){
    if(!step||step.kind!=='rest'||step.trans)return 0;
    return revealed||!(finite(elapsed)&&elapsed<REST_ALONE_S)?2:1;
  }
  // The top bar's dashes: one per exercise. index is the current step, frac how far it has run (0–1). Exercises
  // whose steps interleave (a superset) share their dashes and the dot crosses them step by step, so it only moves
  // forward and always lies inside the current dash. Returns the current dash and the dot's place in it (0–1).
  function progress(steps,index,frac,count){
    const n=Math.max(1,Math.floor(count)||1),list=Array.isArray(steps)?steps:[],first=Array(n).fill(-1),last=Array(n).fill(-1);
    list.forEach((step,k)=>{const g=step&&step.g;if(Number.isInteger(g)&&g>=0&&g<n){if(first[g]<0)first[g]=k;last[g]=k;}});
    const groups=[];
    for(let j=0;j<n;j++){
      const group=groups[groups.length-1];
      if(first[j]<0)groups.push({a:j,b:j,f:-1,l:-1});
      else if(group&&group.f>=0&&first[j]<=group.l){group.b=j;group.l=Math.max(group.l,last[j]);}
      else groups.push({a:j,b:j,f:first[j],l:last[j]});
    }
    const timed=groups.filter(group=>group.f>=0);
    if(!timed.length||!finite(index)||index<timed[0].f)return {n,current:0,within:0};
    const group=timed.find(entry=>index<=entry.l);
    if(!group)return {n,current:n-1,within:1};
    if(index<group.f)return {n,current:group.a,within:0};
    const part=Math.max(0,Math.min(1,(index-group.f+Math.max(0,Math.min(1,finite(frac)?frac:0)))/(group.l-group.f+1)));
    const at=group.a+(group.b-group.a+1)*part,current=Math.min(group.b,Math.floor(at));
    return {n,current,within:Math.max(0,Math.min(1,at-current))};
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
  // The journal footer line: "25 pon. · 2 500 kg" (thousands grouped by a narrow no-break space), never "kg × pon.".
  // Repetitions show while the workout has rep sets (0 at the start), kilograms once lifted, seconds only for holds.
  function totals(stats,items){
    const list=Array.isArray(items)?items:[],timed=list.some(item=>item?.measure==='time'),counted=list.some(item=>item?.measure!=='time');
    const group=n=>String(Math.round(Math.max(0,n)||0)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
    const clock=s=>{s=Math.max(0,Math.ceil(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
    const reps=stats?.reps||0,volume=stats?.volume||0,seconds=stats?.seconds||0,parts=[];
    if(counted||!timed||reps>0)parts.push(group(reps)+' pon.');
    if(volume>0)parts.push(group(volume)+' kg');
    if(seconds>0||timed&&!counted)parts.push(clock(seconds)+' rada');
    return parts.join(' · ');
  }
  return Object.freeze({prepare,rest,summary,totals,sections,groupSections,hasParts,partOpening,overviewAt,nextLine,landing,skipLanding,roundLanding,restPhase,upcoming,progress});
});
