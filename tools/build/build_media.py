# Copies openly licensed photos/videos (from the set-aside v2.2.1) into the app for the exercises that match,
# and writes media.js plus MEDIA-LICENSES.md with author, licence, source and changes.
import json, sys, os, shutil
REPO, W, V = sys.argv[1], sys.argv[2], sys.argv[3]
lib = json.load(open(os.path.join(W, 'library_merged.json')))
recs = json.load(open(os.path.join(W, 'v2_media_records.json')))
out, rows = {}, []
os.makedirs(os.path.join(REPO, 'assets', 'ex'), exist_ok=True)
SHORT = lambda lic: 'CC BY-SA 4.0' if 'BY-SA 4.0' in lic else 'CC BY-SA 3.0' if 'BY-SA 3.0' in lic else 'CC BY 2.0' if 'BY 2.0' in lic else 'javno vlasništvo'
for exid, e in sorted(lib.items()):
    key = e.get('v2media')
    if not key or key not in recs: continue
    r = recs[key]; m = {}
    if r.get('poster') and os.path.exists(os.path.join(V, r['poster'])):
        shutil.copyfile(os.path.join(V, r['poster']), os.path.join(REPO, 'assets', 'ex', exid + '.jpg')); m['img'] = 'assets/ex/' + exid + '.jpg'
    if r.get('video') and os.path.exists(os.path.join(V, r['video'])):
        shutil.copyfile(os.path.join(V, r['video']), os.path.join(REPO, 'assets', 'ex', exid + '.mp4')); m['video'] = 'assets/ex/' + exid + '.mp4'
    if not m: continue
    lic = r.get('license') or ''
    author = (r.get('credit') or r.get('author') or '').replace(' / ', ', ')
    m['credit'] = author + ' · ' + SHORT(lic)
    m['url'] = r['page'] if (r.get('page') and 'wger.de/api' not in r['page']) else (r.get('licenseUrl') or '')
    out[exid] = m
    rows.append('| ' + e['name'] + ' | ' + ', '.join(os.path.basename(x) for x in [m.get('img'), m.get('video')] if x) + ' | ' + author + ' | ' + lic + ' | ' + (r.get('page') or '') + ' | ' + (r.get('changes') or 'bez izmjena') + ' |')
open(os.path.join(REPO, 'media.js'), 'w').write('// Openly licensed demonstration photos/videos shipped with the app (details in MEDIA-LICENSES.md).\nwindow.EXMEDIA = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
md = ['# Licence snimki i fotografija', '', 'Slike i videi u mapi `assets/ex/` su slobodno licencirani ili u javnom vlasništvu. Preuzeti su iz provjerenih izvora (wger.de, Wikimedia Commons, DVIDS) i navedeni uz autora i licencu.', '', 'Snimke DVIDS-a su službeni radovi američke vlade (javno vlasništvo); njihovo pojavljivanje ne znači podršku američke vlade ovoj aplikaciji.', '', '| Vježba | Datoteke | Autor | Licenca | Izvor | Izmjene |', '|---|---|---|---|---|---|'] + rows
open(os.path.join(REPO, 'MEDIA-LICENSES.md'), 'w').write('\n'.join(md) + '\n')
print('media.js:', len(out), 'exercises with shipped media')
