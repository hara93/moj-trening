'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),os=require('node:os');
const {execFileSync}=require('node:child_process');
const repo=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(repo,p),'utf8');
const source=JSON.parse(read('tools/build/body-regions.json'));
const context={};vm.runInNewContext(read('body.js'),context);const B=context.BODY;
const legacy=['front_chest','front_shoulders','front_biceps','front_forearms','front_abs','front_obliques','front_hip_flexors','front_adductors','front_quadriceps','front_knees','front_shins_ankles','back_upper_back_trapezius','back_latissimus','back_lower_back','back_rear_shoulders','back_triceps','back_glutes','back_gluteus_medius','back_hamstrings','back_calves'];
const app=read('app.js');
const helpers=new Function('window','BODY',app.slice(app.indexOf('const MUSCLE_ZONE ='),app.indexOf('// 1.8: equipment tiles'))+'\nreturn {exMuscles,musclesZones,bodyFig};')({BODY:B},B);

test('new anatomy retains every stored region ID, with one bilateral hip joint and native artwork frames',()=>{
  assert.deepEqual(Array.from(B.ids),legacy.concat('hip_joints'));
  assert.equal(B.regions.hip_joints.view,'both');assert.equal(B.regions.hip_joints.kind,'joint');
  for(const view of ['front','back']){
    const png=fs.readFileSync(path.join(repo,source.images[view]));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),B.geom.W);assert.equal(png.readUInt32BE(20),B.geom.H);
    const html=B.svg({view,prime:['hip_joints'],tappable:true});
    assert.equal((html.match(/data-region="hip_joints"/g)||[]).length,1);
    assert.match(html,/is-prime[^>]+data-region="hip_joints"[^>]+aria-pressed="true"/);
    assert.match(html,/<image class="body-art"[^>]+pointer-events="none"/);
  }
  const svg=B.svg({prime:['hip_joints'],tappable:true});
  assert.equal((svg.match(/data-region=/g)||[]).length,22);
  assert.equal((svg.match(/data-region="hip_joints"/g)||[]).length,2);
  assert.match(B.svg(),/aria-hidden="true" focusable="false" pointer-events="none"/);
});

test('clearing the new hip selection does not resurrect inferred muscles; old Kuk exercises keep their fallback',()=>{
  assert.equal(JSON.stringify(helpers.exMuscles({zones:['Kuk']})),JSON.stringify({prime:['front_hip_flexors','back_gluteus_medius'],sec:[],own:false}));
  const selected={prime:['hip_joints'],sec:[]};
  assert.deepEqual(helpers.musclesZones(selected,[]),['Kuk']);
  assert.deepEqual(helpers.exMuscles({zones:['Kuk'],muscles:selected}),{...selected,own:true});
  const empty={prime:[],sec:[]};
  assert.deepEqual(helpers.musclesZones(empty,['Kuk']),[]);
  assert.deepEqual(helpers.exMuscles({zones:helpers.musclesZones(empty,['Kuk']),muscles:empty}),{...empty,own:false});
  const html=helpers.bodyFig(selected,{act:'dmus',size:300});
  assert.equal((html.match(/data-region="hip_joints" data-a="dmus"/g)||[]).length,2);
  const touchWidth=Number(/class="body-hit"[^>]+stroke-width="([^"]+)"/.exec(html)[1])*300/B.geom.H;
  assert.ok(touchWidth>16&&touchWidth<18,'expanded hit width stays about 17 screen pixels after resizing the source');
});

test('body generator reproduces the shipped runtime from the editable source',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'body-build-'));
  try{
    const output=path.join(dir,'body.js');
    execFileSync('python3',['tools/build/build_body.py','tools/build/body-regions.json',output],{cwd:repo});
    assert.equal(fs.readFileSync(output,'utf8'),read('body.js'));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
