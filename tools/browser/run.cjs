'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const engine=process.argv.includes('webkit')?'webkit':'chromium';
const output=process.env.MT_TEST_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(),'moj-trening-'+engine+'-'));
const suites=[['whole-app','live'],['today'],['checklist'],['checklist','just-mixed'],['starting-load'],['progress'],['storage'],['field-results'],['navigation'],['home-progress']];
const requested=process.argv.slice(2).filter(value=>!['webkit','chromium'].includes(value));
const selected=requested.length?suites.filter(([name])=>requested.includes(name)):suites;
if(!selected.length)throw new Error('Unknown suite name');
for(const [name,...args] of selected){
  const label=[name,...args].join('-'),dir=path.join(output,label);fs.mkdirSync(dir,{recursive:true});
  const started=Date.now();console.log('Running '+label+' ('+engine+')');
  const result=spawnSync(process.execPath,[path.join(__dirname,name+'.cjs'),...args,engine],{
    env:{...process.env,MT_TEST_OUTPUT:dir},encoding:'utf8',timeout:240000,maxBuffer:12*1024*1024});
  fs.writeFileSync(path.join(dir,'run.log'),(result.stdout||'')+(result.stderr||''));
  if(result.status!==0){console.error((result.stdout||'').slice(-3000)+(result.stderr||''));if(result.error)console.error(result.error);console.error('Failed '+label+'; evidence: '+dir);process.exit(result.status||1);}
  console.log('Passed '+label+' in '+Math.round((Date.now()-started)/1000)+'s');
}
console.log('All selected browser checks passed. Evidence: '+output);
