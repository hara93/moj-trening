// Resolve an exercise's missing starting load before creating a player checkpoint.
(function(root, factory) {
  const api=factory();
  if (typeof module==='object' && module.exports) module.exports=api;
  if (root) root.StartingLoad=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const labels={db:'Kg po bučici',bar:'Ukupno kg sa šipkom',lm:'Kg ploča na slobodnom kraju',kb:'Kg jedne girje',ball:'Kg medicinke',cable:'Kg na koloturu'};
  function kind(ex, equipment, liftKind) {
    if (!ex || ex.bw===true || /po želji|opcionaln|u početku bez utega/i.test(ex.equipment || '')) return '';
    if (liftKind) return liftKind;
    if (equipment.includes('Medicinka')) return 'ball';
    if (equipment.includes('Kolotur') && !equipment.some(x=>['Mini guma','Elastično uže'].includes(x))) return 'cable';
    return '';
  }
  const positive=value=>Number.isFinite(value) && value>0;
  function setNeedsLoad(item,index,knownZero) {
    const list=Array.isArray(item.kgList)?item.kgList:[];
    const value=list[index];
    if (positive(value)) return false;
    // Mixed explicit per-set loads can intentionally include an unloaded set.
    if (value===0 && (knownZero || positive(item.kg) || list.some(positive))) return false;
    return !positive(item.kg) && !(item.kg===0 && knownZero);
  }
  function missingSet(item,index,kind) {
    return !!kind && setNeedsLoad(item,index,kind==='lm' && item.startingKgKnown===true);
  }
  function requests(items,describe) {
    const out=[];
    for (const [index,item] of items.entries()) {
      const exercise=describe(item.exId);
      if (!exercise?.kind) continue;
      if (Array.from({length:item.sets || 1},(_,i)=>missingSet(item,i,exercise.kind)).some(Boolean)) {
        out.push({index,exId:item.exId,name:exercise.name,kind:exercise.kind});
      }
    }
    return out;
  }
  function parse(raw,kind) {
    const s=String(raw ?? '').trim();
    if (!/^\d+(?:[.,]\d{1,2})?$/.test(s)) return null;
    const kg=Number(s.replace(',','.'));
    return kg<=300 && (kg>0 || kind==='lm' && kg===0) ? kg : null;
  }
  function fill(item,kg) {
    const sets=item.sets || 1;
    const needed=Array.from({length:sets},(_,i)=>setNeedsLoad(item,i,kg===0 && item.startingKgKnown===true));
    if (!needed.some(Boolean)) return item;
    const next={...item};
    if (Array.isArray(item.kgList) && item.kgList.some(Number.isFinite)) {
      next.kgList=needed.map((missing,i)=>missing?kg:item.kgList[i] ?? item.kg);
    }
    if (!positive(item.kg)) next.kg=kg;
    if (kg===0) next.startingKgKnown=true; else delete next.startingKgKnown;
    return next;
  }
  return Object.freeze({labels,kind,missingSet,requests,parse,fill});
});
