# Builds the exercise media the app ships, from tools/build/media_sources.json (the only file edited by hand):
#   assets/slike/<id>.webp  two-panel pictures (LEFT start, RIGHT end), 1200 x 800, made with --own from the reviewed 1536 x 1024 JPEGs
#   assets/thumb/<id>.webp  192 x 192 thumbnails for the 72 px rows: a square of the LEFT panel, or the centre of a licensed poster/photo
#   assets/covers/<key>.webp  home slider covers (portrait 800 x 1200), made with --covers from the reviewed cover-<key>.jpg (2:3, e.g. 1024 x 1536)
#   media.js (EXMEDIA with picY / picBox: the crop of each two-panel picture, from tools/build/pic_crop.py; EXCOVERS), MEDIA-LICENSES.md and, when <W> is given, <W>/media_ids.json (exercises that already have media; build_prompts.py skips them)
# Licensed photos and videos in assets/ex are inputs kept in git. A "recut" recipe says how a shipped file was made from a file in git
# history (sha256-checked): --recut remakes those files (videos with tools/build/crop_video.swift: crop, trim, H.264, poster; photos with sips).
# Run --recut only when a recipe changes: the encoder output differs by a few bytes from run to run, so it always shows up in git.
# Files in assets/ex, assets/slike and assets/thumb that nothing references are deleted, so a rebuild gives the same repo every time.
# usage: python3 tools/build/build_media.py <repo> [<W>] [--own <folder with <id>.jpg>] [--covers <folder with cover-<key>.jpg>] [--recut]
# needs cwebp and dwebp (brew install webp); --recut also needs git, swiftc and sips (macOS)
import json, sys, os, subprocess, hashlib, struct, tempfile, shutil

args = [a for a in sys.argv[1:]]
OWN_SRC = COVER_SRC = None
if '--own' in args:
    k = args.index('--own'); OWN_SRC = args[k + 1]; del args[k:k + 2]
if '--covers' in args:
    k = args.index('--covers'); COVER_SRC = args[k + 1]; del args[k:k + 2]
RECUT = '--recut' in args
if RECUT: args.remove('--recut')
REPO = args[0]
W = args[1] if len(args) > 1 else None
man = json.load(open(os.path.join(REPO, 'tools', 'build', 'media_sources.json'), encoding='utf-8'))
EX, OWN, THUMB, COVERS = 'assets/ex', man['own']['dir'], 'assets/thumb', 'assets/covers'
# the home slider cards (VIEWS.home in app.js): a card without a cover keeps its colour and icon
COVER_KEYS = {'rehab': 'Rehab kuka', 'teretana': 'Teretana', 'aktivacija': 'Aktivacija', 'kondicija': 'Kondicija', 'knjiznica': 'Knjižnica'}
covers = man.get('covers') or {}
if covers: os.makedirs(os.path.join(REPO, COVERS), exist_ok=True)
for d in (EX, OWN, THUMB): os.makedirs(os.path.join(REPO, d), exist_ok=True)
P = lambda rel: os.path.join(REPO, rel)

def seed_names():
    src = open(P('data.js'), encoding='utf-8').read()
    i = src.index('window.SEED = ') + len('window.SEED = ')
    return {k: v.get('name') or k for k, v in json.JSONDecoder().raw_decode(src, i)[0]['exercises'].items()}

def run(*cmd):
    subprocess.run(cmd, check=True, capture_output=True)

def size_of(path):
    b = open(path, 'rb').read()
    if b[:4] == b'RIFF' and b[8:12] == b'WEBP':
        c = b[12:16]
        if c == b'VP8X': return 1 + int.from_bytes(b[24:27], 'little'), 1 + int.from_bytes(b[27:30], 'little')
        if c == b'VP8L': v = int.from_bytes(b[21:25], 'little'); return 1 + (v & 0x3FFF), 1 + ((v >> 14) & 0x3FFF)
        if c == b'VP8 ': return struct.unpack('<H', b[26:28])[0] & 0x3FFF, struct.unpack('<H', b[28:30])[0] & 0x3FFF
    i = 2
    while i < len(b):   # JPEG: walk the markers to the frame header
        if b[i] != 0xFF: i += 1; continue
        m = b[i + 1]
        if m in (0xC0, 0xC1, 0xC2): h, w = struct.unpack('>HH', b[i + 5:i + 9]); return w, h
        i += 2 + struct.unpack('>H', b[i + 2:i + 4])[0]
    raise ValueError('unknown image ' + path)

def rows_with_content(path, w, h):
    # decode small and find the rows of the LEFT panel that hold the athlete/equipment (they differ from the plain studio wall/floor)
    with tempfile.TemporaryDirectory() as t:
        ppm = os.path.join(t, 'a.ppm'); run('dwebp', '-quiet', path, '-resize', str(w), str(h), '-ppm', '-o', ppm)
        b = open(ppm, 'rb').read()
    parts = b.split(maxsplit=4); data = parts[4]; half = w // 2
    rows = []
    for y in range(h):
        r = data[y * w * 3:(y + 1) * w * 3]
        ref = [sum(r[x * 3 + c] for x in range(1, 5)) / 4 for c in range(3)]
        n = sum(1 for x in range(6, half - 4) if abs(r[x * 3] - ref[0]) + abs(r[x * 3 + 1] - ref[1]) + abs(r[x * 3 + 2] - ref[2]) > 45)
        rows.append(n)
    return rows, half - 10

def own_thumb_y(path, override):
    # a square of the LEFT panel: the whole content when it fits, otherwise from just above the top (heads stay in)
    if override is not None: return override
    W_, H_ = size_of(path); S = W_ // 2 - 10
    rows, width = rows_with_content(path, 150, 100)
    hits = [y for y, n in enumerate(rows) if n >= max(4, width * 0.035)]
    if not hits: return (H_ - S) // 2
    top, bot = hits[0] * H_ / 100, (hits[-1] + 1) * H_ / 100
    y = (top + bot) / 2 - S / 2 if bot - top <= S - 40 else top - 20
    return int(max(0, min(H_ - S, y)))

def webp(src, dst, q, crop=None, resize=None):
    cmd = ['cwebp', '-quiet', '-q', str(q), '-m', '6', '-sharp_yuv', '-metadata', 'none']
    if crop: cmd += ['-crop'] + [str(int(v)) for v in crop]
    if resize: cmd += ['-resize'] + [str(v) for v in resize]
    run(*(cmd + [src, '-o', dst]))

names = seed_names()
HR = str.maketrans({'č': 'c{', 'ć': 'c|', 'đ': 'd{', 'š': 's{', 'ž': 'z{'})   # Croatian alphabetical order for the tables
by_name = lambda i: names[i].lower().translate(HR)
problems, out, keep = [], {}, set()
own = man['own']['images']
lic = man['licensed']

# 1) two-panel pictures: (re)made only from the reviewed JPEGs, checked against their sha256
for i, o in own.items():
    dst = OWN + '/' + i + '.webp'; keep.add(dst)
    if OWN_SRC:
        src = os.path.join(OWN_SRC, i + '.jpg')
        if not os.path.exists(src): problems.append('missing source ' + src); continue
        if hashlib.sha256(open(src, 'rb').read()).hexdigest() != o['sha256']: problems.append('sha256 differs: ' + src); continue
        if size_of(src) != (1536, 1024): problems.append('not 1536 x 1024: ' + src); continue
        webp(src, P(dst), 80, resize=(1200, 800))
    if not os.path.exists(P(dst)): problems.append('missing ' + dst + ' (run with --own <folder>)')

# 1b) slider covers: (re)made only from the reviewed JPEGs, checked against their sha256; the centre 2:3 of the picture, 800 x 1200
for k, o in covers.items():
    if k not in COVER_KEYS: problems.append('unknown cover key ' + k + ' (one of ' + ', '.join(COVER_KEYS) + ')'); continue
    dst = COVERS + '/' + k + '.webp'; keep.add(dst)
    if COVER_SRC:
        src = os.path.join(COVER_SRC, 'cover-' + k + '.jpg')
        if not os.path.exists(src): problems.append('missing source ' + src); continue
        if hashlib.sha256(open(src, 'rb').read()).hexdigest() != o['sha256']: problems.append('sha256 differs: ' + src); continue
        w, h = size_of(src)
        if h <= w or w < 800: problems.append('not a portrait picture at least 800 px wide: ' + src); continue
        cw, ch = (w, w * 3 // 2) if w * 3 // 2 <= h else (h * 2 // 3, h)
        webp(src, P(dst), 80, crop=((w - cw) // 2, (h - ch) // 2, cw, ch), resize=(800, 1200))
    if not os.path.exists(P(dst)): problems.append('missing ' + dst + ' (run with --covers <folder>)')

# 2) licensed media: --recut remakes the files that have a recipe; then every file must be in assets/ex
def git_blob(spec, sha):
    b = subprocess.run(['git', '-C', REPO, 'show', spec], check=True, capture_output=True).stdout
    if hashlib.sha256(b).hexdigest() != sha: sys.exit('source differs from its sha256: ' + spec)
    return b
if RECUT:
    with tempfile.TemporaryDirectory() as t:
        tool = os.path.join(t, 'crop_video')
        run('swiftc', '-O', '-o', tool, P('tools/build/crop_video.swift'), '-module-cache-path', os.path.join(t, 'mc'))
        for i, r in sorted(lic.items()):
            rc = r.get('recut')
            if not rc: continue
            src = os.path.join(t, 'src-' + os.path.basename(rc['from'].split(':')[-1])); open(src, 'wb').write(git_blob(rc['from'], rc['sha256']))   # AVFoundation needs the extension
            if r.get('photo'):
                run('sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', str(rc['jpegQuality']), src, '--out', P(EX + '/' + r['photo'])); continue
            x, y, w, h = rc['crop']; ow, oh = rc.get('size') or (w, h); still = isinstance(rc['poster'], (int, float))
            frame = os.path.join(t, i + '.jpg')
            res = subprocess.run([tool, src, P(EX + '/' + r['video']), frame] + [str(v) for v in (x, y, w, h, rc['start'], rc['end'], rc['kbps'], rc['poster'] if still else 0, ow, oh)],
                                 check=True, capture_output=True, text=True)
            print(res.stdout.strip())
            if still: shutil.copyfile(frame, P(EX + '/' + r['poster']))
            else:   # keep the chosen poster frame, scaled to the new video size
                pj = os.path.join(t, i + '.poster.jpg'); open(pj, 'wb').write(git_blob(rc['poster'], rc['posterSha256']))
                run('sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', '-z', str(oh), str(ow), pj, '--out', P(EX + '/' + r['poster']))
for i, r in lic.items():
    for k in ('video', 'poster', 'photo'):
        if r.get(k):
            keep.add(EX + '/' + r[k])
            if not os.path.exists(P(EX + '/' + r[k])): problems.append('missing ' + EX + '/' + r[k])
for i in list(own) + list(lic):
    if i not in names: problems.append('no exercise with id ' + i + ' in data.js')
if problems:
    print('\n'.join(problems)); sys.exit(1)

# 3) thumbnails, always rebuilt from the shipped files (the priority follows exMedia in app.js: own picture > licensed video > licensed photo)
for i in sorted(set(own) | set(lic)):
    r = lic.get(i) or {}; dst = THUMB + '/' + i + '.webp'; keep.add(dst)
    if i not in own:
        src = P(EX + '/' + (r.get('poster') or r.get('photo'))); w, h = size_of(src); s = min(w, h)
        fx = (r.get('thumb') or {}).get('x', 0.5)
        webp(src, P(dst), 72, crop=(round((w - s) * fx), (h - s) // 2, s, s), resize=(192, 192))
    else:
        src = P(OWN + '/' + i + '.webp'); w, h = size_of(src); s = w // 2 - 10
        webp(src, P(dst), 72, crop=(4, own_thumb_y(src, own[i].get('thumbY')), s, s), resize=(192, 192))

# 4) media.js: what each exercise can show; the app picks the order (see exMedia)
SHORT = lambda r: r['license'] if r['license'].startswith('CC') else 'javno vlasništvo'
for i in sorted(set(own) | set(lic)):
    m = {}; r = lic.get(i)
    if r:
        if r.get('video'): m['video'] = EX + '/' + r['video']
        if r.get('poster') or r.get('photo'): m['img'] = EX + '/' + (r.get('poster') or r.get('photo'))
        m['credit'] = r['credit'] + ' · ' + SHORT(r) + (' · izmijenjeno' if r.get('changed') else '')
        m['url'] = r['source'][0][1]
        m['lic'] = {k: r[k] for k in ('author', 'title', 'license', 'licenseUrl', 'source', 'changes', 'dvids') if r.get(k)}
    if i in own: m['pic'] = OWN + '/' + i + '.webp'
    if i in own:   # 1.8.2: the crop on the exercise page and in the player (tools/build/pic_crop.py): object-position y in %, a taller box
        m['picY'] = own[i].get('picY', 50)
        if own[i].get('picBox'): m['picBox'] = own[i]['picBox']
    m['thumb'] = THUMB + '/' + i + '.webp'
    out[i] = m
js = ('// Generated by tools/build/build_media.py from tools/build/media_sources.json: do not edit.\n'
      '// video / img: openly licensed demo (credit, lic); pic: two-panel picture made for this app (LEFT start, RIGHT end), shown full width in a\n'
      '// 5:3 box (picBox: a taller 16:10 or the whole 3:2) at object-position y picY %; thumb: 192 px square.\n'
      'window.EXMEDIA = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
      'window.EXMEDIA_DVIDS = ' + json.dumps(man['dvids_note'], ensure_ascii=False) + ';\n'
      '// home slider covers by card key (portrait 800 x 1200); a card without one keeps its colour and icon.\n'
      'window.EXCOVERS = ' + json.dumps({k: COVERS + '/' + k + '.webp' for k in sorted(covers) if k in COVER_KEYS}, ensure_ascii=False) + ';\n')
open(P('media.js'), 'w', encoding='utf-8').write(js)

# 5) MEDIA-LICENSES.md
link = lambda t, u: '[' + t + '](' + u + ')'
md = ['# Licence slika i snimki', '',
      'Popis svih slika i snimki vježbi koje dolaze s aplikacijom. Datoteku radi `tools/build/build_media.py` iz `tools/build/media_sources.json`; ne mijenja se ručno.', '',
      '## Slike napravljene za aplikaciju (' + str(len(own)) + ')', '',
      'Dvodijelne slike u mapi `' + OWN + '/` (lijevo početni, desno završni položaj) generirane su umjetnom inteligencijom (generatorom slika) prema uputama iz `PROMPTI-ZA-SLIKE.md`, a prije ugradnje pregledane su radi tehnike, oslonaca i položaja glave (' + man['own']['made'] + '). Nisu preuzete iz tuđih izvora, pa za njih ne vrijedi licenca treće strane. '
      'U aplikaciji su spremljene kao WebP 1200 × 800, a sličice u mapi `' + THUMB + '/` (192 × 192) izrezane su iz lijeve polovice slike.', '',
      '| Vježba | Datoteka |', '|---|---|']
md += ['| ' + names[i] + ' | ' + i + '.webp |' for i in sorted(own, key=by_name)]
md += ['', '## Slobodno licencirane snimke i fotografije u javnom vlasništvu (' + str(len(lic)) + ')', '',
       'Snimke wgera i fotografija s Wikimedia Commonsa koriste se pod navedenom licencom Creative Commons; što je promijenjeno, piše u stupcu Izmjene. '
       'Snimke i fotografije DVIDS-a službeni su radovi američke vlade i u javnom su vlasništvu.', '',
       'Prema uvjetima DVIDS-a navodimo: „' + man['dvids_note']['en'] + '” (' + man['dvids_note']['hr'] + ')', '',
       '| Vježba | Datoteke | Autor | Licenca | Izvor | Izmjene |', '|---|---|---|---|---|---|']
for i in sorted(lic, key=by_name):
    r = lic[i]
    files = [r[k] for k in ('video', 'poster', 'photo') if r.get(k)] + ['thumb/' + i + '.webp']
    src = ' · '.join(link(t, u) for t, u in r['source'])
    if r.get('title'): src = '„' + r['title'] + '”, ' + src
    thumb_note = ' Sličica 192 × 192 izrezana iz ' + ('naslovne slike.' if r.get('video') else 'fotografije.') if i not in own else ''
    md.append('| ' + ' | '.join([names[i], ', '.join(files), r['author'], link(r['license'], r['licenseUrl']), src, r['changes'] + thumb_note]) + ' |')
if covers:
    md += ['', '## Naslovne slike na početnom zaslonu (' + str(len(covers)) + ')', '',
           'Uspravne slike kartica na početnom zaslonu u mapi `' + COVERS + '/` (WebP 800 × 1200) generirane su umjetnom inteligencijom prema uputama iz `PROMPTI-ZA-SLIKE.md` (isti sportaš i stil kao kod vježbi) i pregledane prije ugradnje.', '',
           '| Kartica | Datoteka |', '|---|---|']
    md += ['| ' + COVER_KEYS[k] + ' | ' + k + '.webp |' for k in COVER_KEYS if k in covers]
open(P('MEDIA-LICENSES.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')

# 6) remove media nothing references, so stale files cannot linger in the repo
gone = []
for d in (EX, OWN, THUMB, COVERS):
    if not os.path.isdir(P(d)): continue
    for f in sorted(os.listdir(P(d))):
        rel = d + '/' + f
        if os.path.isfile(P(rel)) and rel not in keep and not f.startswith('.'):
            os.remove(P(rel)); gone.append(rel)

# 7) build_prompts.py lists image prompts only for exercises without shipped media
if W:
    ids = sorted(out); tmp = os.path.join(W, 'media_ids.json.tmp')
    json.dump(ids, open(tmp, 'w')); os.replace(tmp, os.path.join(W, 'media_ids.json'))

tot = lambda d: sum(os.path.getsize(P(d + '/' + f)) for f in os.listdir(P(d)) if not f.startswith('.'))
print('media.js: %d exercises (%d own pictures, %d licensed), %d slider covers' % (len(out), len(own), len(lic), len(covers)))
print('bytes: %s %d, %s %d, %s %d' % (OWN, tot(OWN), THUMB, tot(THUMB), EX, tot(EX)))
if gone: print('removed:', ', '.join(gone))
if W: print('media_ids.json:', len(out))
