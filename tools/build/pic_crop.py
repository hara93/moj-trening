# 1.8.2: how each two-panel picture (assets/slike/<id>.webp, 3:2) is cropped on the exercise page and in the player. The picture spans
# the full width in a lower box (object-fit: cover), so a strip at the top and/or bottom is cut; this finds, per picture, the rows that
# hold the athlete and the equipment, the box it needs and the vertical position (CSS object-position y, in %) that keeps them whole.
#   content: on a 600 x 400 grid, pixels of the athlete's colours and the usual equipment (blue shirt and shoes, skin, hair, red / orange
#     cones and plates, teal / green plates and mats; ath_hit below), rows with at least 3 such pixels; dark equipment the colours miss
#     (a black box, the bike's stand) is added by hand in media_sources.json as "picBot" / "picTop" (rows of the same grid). The racks,
#     wall bars and TRX anchors that run off the picture's edge are background: cutting a little more of them cuts nothing.
#   box: 5:3 (360 of the 400 rows visible) when the content fits with 6 rows (or at least 3) to spare at both ends, else 16:10 (375
#     rows), else the whole 3:2. A sided exercise's "Lijeva i desna" pill sits on the bottom edge (10 px inside, x 220..380 of 600):
#     the content in that strip must end at least 18 rows above the box's bottom.
#   picY: the content centred in the box, as far as the picture allows.
# usage: python3 tools/build/pic_crop.py <repo> [--write]   (prints what changes; --write stores picY / picBox in media_sources.json;
#   then run build_media.py, which copies them into media.js). Needs dwebp (brew install webp).
import json, os, subprocess, sys, tempfile

REPO = sys.argv[1]; WRITE = '--write' in sys.argv
SRC = os.path.join(REPO, 'tools', 'build', 'media_sources.json')
man = json.load(open(SRC, encoding='utf-8')); own = man['own']['images']; DIR = os.path.join(REPO, man['own']['dir'])
W, H = 600, 400
BOX = [('5:3', 360), ('16:10', 375), ('3:2', 400)]

def ath_hit(r, g, b):
    if b > r + 45 and b > g + 10 and b > 100: return 1                  # blue shirt, blue shoes, blue plates
    if r > 125 and r - g > 18 and g - b > 8 and r - b > 45: return 1    # skin, a wooden box, orange
    if r > 170 and g < 120 and b < 120: return 1                       # red / orange cones, red plates
    if 40 < r < 115 and r - b > 18 and r - g > 6: return 1             # brown hair
    if g > r + 40 and g > b + 10 and b > 60 and not (g > 90 and r < 90 and b < 70): return 1   # teal / green plates, mats (not grass)
    return 0

def pixels(path):
    with tempfile.TemporaryDirectory() as t:
        ppm = os.path.join(t, 'a.ppm')
        subprocess.run(['dwebp', '-quiet', path, '-resize', str(W), str(H), '-ppm', '-o', ppm], check=True, capture_output=True)
        b = open(ppm, 'rb').read()
    return b.split(maxsplit=4)[4]

def sides():
    src = open(os.path.join(REPO, 'data.js'), encoding='utf-8').read(); i = src.index('window.SEED = ') + len('window.SEED = ')
    return {k for k, v in json.JSONDecoder().raw_decode(src, i)[0]['exercises'].items() if v.get('sides')}

def crop(i, o, sided):
    d = pixels(os.path.join(DIR, i + '.webp'))
    hit = lambda x, y: ath_hit(d[(y * W + x) * 3], d[(y * W + x) * 3 + 1], d[(y * W + x) * 3 + 2])
    xs = list(range(4, 296)) + list(range(304, 596))   # both panels, not the divider
    rows = [y for y in range(H) if sum(hit(x, y) for x in xs) >= 3]
    t, b = rows[0], rows[-1]
    if 'picTop' in o: t = min(t, o['picTop'])
    if 'picBot' in o: b = max(b, o['picBot'])
    bc = max([y for y in range(H) if any(hit(x, y) for x in range(220, 380))] or [-1]) if sided else -1
    for name, vis in BOX:
        ov = H - vis
        if not ov: return name, 50, (t, b)
        for m in (6, 3):
            hi = max(0, t - m); need = max(b + m, bc + 18)   # window top w0: w0 <= hi, w0 + vis >= need, 0 <= w0 <= ov
            a, z = max(0, need - vis), min(ov, hi)
            if a > z: continue
            y = round(100 * (a + z) / 2 / ov)
            if ov * y / 100 <= hi + 0.5 and ov * y / 100 + vis >= need - 0.5: return name, y, (t, b)

S = sides(); changed = []
for i in sorted(own):
    box, y, tb = crop(i, own[i], i in S)
    new = {'picY': y};
    if box != '5:3': new['picBox'] = box
    old = {k: own[i][k] for k in ('picY', 'picBox') if k in own[i]}
    if old != new:
        changed.append((i, old, new, tb))
        own[i].pop('picBox', None); own[i].update(new)
for c in changed: print(c[0], c[1], '->', c[2], 'content rows', c[3])
print(len(own), 'pictures,', len(changed), 'changed;', ', '.join(k + ' ' + own[k]['picBox'] for k in sorted(own) if 'picBox' in own[k]) or 'all 5:3')
if WRITE and changed:
    open(SRC, 'w', encoding='utf-8').write(json.dumps(man, ensure_ascii=False, indent=1) + '\n')
    print('written', SRC)
