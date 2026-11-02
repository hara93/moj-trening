# Builds moj-trening/data.js: the v1.0 seed (from git tag v1.0) + new content prepared in the scratchpad.
import json, subprocess, sys, os
REPO, W = sys.argv[1], sys.argv[2]
src = subprocess.run(['git','-C',REPO,'show','v1.0:data.js'], capture_output=True, text=True, check=True).stdout
seed = json.loads(subprocess.run(['node','-e','global.window={};eval(require("fs").readFileSync(0,"utf8"));process.stdout.write(JSON.stringify(window.SEED))'], input=src, capture_output=True, text=True, check=True).stdout)
plan = {}
fp = os.path.join(W, 'field_pre.json')
if os.path.exists(fp):
    d = json.load(open(fp)); seed['field'].update(d['field']); plan.update(d['plan'])
ex = os.path.join(W, 'exercises_final.json')
if os.path.exists(ex): seed['exercises'] = json.load(open(ex))
pr = os.path.join(W, 'protocols_final.json')
if os.path.exists(pr): seed['protocols'] = json.load(open(pr))
fu = os.path.join(W, 'field_updates.json')
if os.path.exists(fu):
    for k, v in json.load(open(fu)).items(): seed['field'][k] = v
out = '// Shipped content: your own changes on the phone always win over this file (see hash.js / seed-history.js).\nwindow.SEED = ' + json.dumps(seed, ensure_ascii=False, indent=1) + ';\nwindow.SEED_PLAN = ' + json.dumps(plan, ensure_ascii=False, indent=1) + ';\nwindow.SEED_RENAMED = ' + json.dumps(json.load(open(os.path.join(W, 'renamed.json'))) if os.path.exists(os.path.join(W, 'renamed.json')) else {}, ensure_ascii=False) + ';\nwindow.SEED_RETIRED = ' + json.dumps(json.load(open(os.path.join(W, 'retired.json'))) if os.path.exists(os.path.join(W, 'retired.json')) else {}) + ';\n'
open(os.path.join(REPO, 'data.js'), 'w').write(out)
print('data.js:', len(seed['exercises']), 'exercises,', len(seed['protocols']), 'protocols,', len(seed['field']), 'field sessions')
