# Builds the PRIVATE photo pack from Tomislav's purchased TAE PDFs. It is written only to his own iCloud folder,
# never to the public repository. The app imports it once (Moji podaci -> Uvezi paket slika) into the phone's storage.
import json, sys, os, base64, io
from PIL import Image, ImageCms
W, OUT = sys.argv[1], sys.argv[2]
lib = json.load(open(os.path.join(W, 'library_merged.json')))
cat = {r['slug']: r for r in json.load(open(os.path.join(W, 'lib', 'tae_catalog.json')))}
srgb = ImageCms.createProfile('sRGB')
items, used = [], []
for exid, e in sorted(lib.items()):
    for slug in e.get('tae') or []:
        r = cat.get(slug)
        if not r or not r.get('img') or not os.path.exists(r['img']): continue
        im = Image.open(r['img'])
        icc = im.info.get('icc_profile')
        if icc:
            try: im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), srgb, outputMode='RGB')
            except Exception: im = im.convert('RGB')
        im = im.convert('RGB')
        if max(im.size) > 900: im.thumbnail((900, 900), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=84, optimize=True, progressive=True)
        items.append({'ex': exid, 'type': 'image/jpeg', 'data': base64.b64encode(buf.getvalue()).decode('ascii')})
        used.append((exid, slug, im.size, len(buf.getvalue())))
        break
pack = {'kind': 'moj-trening-media-pack', 'v': 1, 'title': 'TAE slike (privatno)', 'credit': 'TAE · privatna kopija', 'items': items}
open(OUT, 'w').write(json.dumps(pack))
print('pack:', len(items), 'photos,', round(os.path.getsize(OUT) / 1e6, 1), 'MB ->', OUT)
for u in used: print('  ', u[0], '<-', u[1], u[2], round(u[3] / 1024), 'KB')
