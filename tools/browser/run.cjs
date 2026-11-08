'use strict';
// Runs the browser suites listed in suites.json. Every selected suite runs even
// when an earlier one fails; the summary names each failure and the exit code is
// non-zero if any failed.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const suites=JSON.parse(fs.readFileSync(path.join(__dirname,'suites.json'),'utf8')).suites.map(({name,args=[]})=>[name,...args]);
if(require.main!==module){module.exports={suites};return;}
const engine=process.argv.includes('webkit')?'webkit':'chromium';
const output=process.env.MT_TEST_OUTPUT || fs.mkdtempSync(path.join(os.tmpdir(),'moj-trening-'+engine+'-'));
const requested=process.argv.slice(2).filter(value=>!['webkit','chromium'].includes(value));
const unknown=requested.filter(value=>!suites.some(([name])=>name===value));
if(unknown.length)throw new Error('Unknown suite name: '+unknown.join(', '));
const selected=requested.length?suites.filter(([name])=>requested.includes(name)):suites;
const failed=[];
for(const [name,...args] of selected){
  const label=[name,...args].join('-'),dir=path.join(output,label);fs.mkdirSync(dir,{recursive:true});
  const started=Date.now();console.log('Running '+label+' ('+engine+')');
  const result=spawnSync(process.execPath,[path.join(__dirname,name+'.cjs'),...args,engine],{
    env:{...process.env,MT_TEST_OUTPUT:dir},encoding:'utf8',timeout:240000,maxBuffer:12*1024*1024});
  fs.writeFileSync(path.join(dir,'run.log'),(result.stdout||'')+(result.stderr||''));
  if(result.status!==0){console.error((result.stdout||'').slice(-3000)+(result.stderr||''));if(result.error)console.error(result.error);console.error('Failed '+label+'; evidence: '+dir);failed.push(label);continue;}
  console.log('Passed '+label+' in '+Math.round((Date.now()-started)/1000)+'s');
}
if(failed.length){console.error(failed.length+' of '+selected.length+' browser checks failed: '+failed.join(', ')+'. Evidence: '+output);process.exit(1);}
console.log('All selected browser checks passed. Evidence: '+output);
