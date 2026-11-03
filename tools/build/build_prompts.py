# Writes PROMPTI-ZA-SLIKE.md: one image prompt for EVERY exercise, so every exercise can show the same athlete.
# The ChatGPT project already holds the approved athlete and the style, so each prompt describes only the movement
# (camera, start and end position, form, equipment).
# Inputs (W): library_merged.json → img_prompt = {prompt, camera, status: OK|PONOVI|NOVO, issues: [Croatian reasons]},
#             covers.json → {covers: [{key, card, file, prompt}]} (portrait covers of the home sliders).
# Every exercise appears exactly once: "Za ponoviti" (PONOVI), "Nove" (NOVO) or "Dobre slike" (OK).
import json, sys, os
REPO, W = sys.argv[1], sys.argv[2]
lib = json.load(open(os.path.join(W, 'library_merged.json')))
cpath = os.path.join(W, 'covers.json')
covers = json.load(open(cpath))['covers'] if os.path.exists(cpath) else []
CATS = ['Snaga', 'Eksplozivnost', 'Trup', 'Mobilnost', 'Aktivacija', 'Rehab', 'Kondicija']
SECTIONS = [
 ('PONOVI', 'Za ponoviti', 'Ove slike već su u aplikaciji, ali ih treba napraviti ponovno. Ispod naziva piše što na postojećoj slici ne valja; '
            'nova uputa to već ispravlja. Spremi novu sliku pod istim nazivom datoteke.'),
 ('NOVO', 'Nove', 'Ove vježbe još nemaju sliku tvog sportaša (sad pokazuju preuzetu fotografiju ili video, ili nemaju sliku).'),
 ('OK', 'Dobre slike', 'Ove slike su dobre i ostaju. Uputa je tu samo ako neku ipak poželiš napraviti ponovno.'),
]
missing = [k for k, e in lib.items() if not isinstance(e.get('img_prompt'), dict) or e['img_prompt'].get('status') not in ('OK', 'PONOVI', 'NOVO')]
if missing:
    sys.exit('img_prompt missing or without a status: ' + ', '.join(sorted(missing)))
def pl(n, one, few, many):  # Croatian plural after a number
    return '%d %s' % (n, one if n % 10 == 1 and n % 100 != 11 else few if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14 else many)
key = lambda kv: (CATS.index(kv[1].get('cat')) if kv[1].get('cat') in CATS else 99, kv[1].get('order', 999), kv[1]['name'])
count = {s: sum(1 for e in lib.values() if e['img_prompt']['status'] == s) for s, _, _ in SECTIONS}
md = ['# Upute za ChatGPT: slike vježbi', '',
 'Jedna uputa za svaku vježbu, da u aplikaciji svuda bude isti sportaš. Lik i stil već su spremljeni u tvom ChatGPT projektu, '
 'pa svaka uputa opisuje samo izvođenje: kameru, početni i završni položaj, držanje tijela i opremu.', '',
 '1. Otvori ChatGPT projekt u kojem su odobreni sportaš i stil, kopiraj cijeli blok jedne vježbe i zalijepi ga.',
 '2. Za svaku vježbu jedna slika 1536 × 1024 s dva panela: LIJEVO početni položaj, DESNO završni. Kamera je ista u oba panela.',
 '3. Provjeri sliku: ista kamera u oba panela, glava i vrat u liniji s trupom, pogled nikad u kameru, stopala i oprema kao u uputi. '
 'Ako nešto ne valja, napiši ChatGPT-u što da ispravi.',
 '4. Spremi sliku pod nazivom datoteke koji piše uz vježbu (npr. `goblet-squat.jpg`) i pošalji mi je, pa je ugradim u aplikaciju za sve uređaje.', '',
 'Pregled: %d za ponoviti, %s, %s (ukupno %s) i %s.' % (count['PONOVI'], pl(count['NOVO'], 'nova', 'nove', 'novih'), pl(count['OK'], 'dobra', 'dobre', 'dobrih'),
     pl(len(lib), 'vježba', 'vježbe', 'vježbi'), pl(len(covers), 'naslovna slika', 'naslovne slike', 'naslovnih slika')), '']
if covers:
    md += ['## Naslovne slike za slajdere', '',
           'Pet uspravnih slika 1024 × 1536 (2 : 3) za kartice na početnom zaslonu. Ista uputa kao gore: zalijepi blok u isti ChatGPT projekt i spremi sliku pod navedenim nazivom.', '']
    for c in covers:
        md += ['### ' + c['card'], '', '- Datoteka: `' + c['file'] + '`', '- Veličina: 1024 × 1536, uspravno', '', '```text', c['prompt'], '```', '']
for status, title, intro in SECTIONS:
    rows = sorted([(k, e) for k, e in lib.items() if e['img_prompt']['status'] == status], key=key)
    if not rows: continue   # e.g. no exercise without a picture of his athlete any more
    md += ['## %s (%d)' % (title, len(rows)), '', intro, '']
    cur = None
    for k, e in rows:
        if e.get('cat') != cur:
            cur = e.get('cat'); md += ['### ' + (cur or 'Ostalo'), '']
        p = e['img_prompt']
        md += ['#### ' + e['name'] + ((' (' + e['alt'] + ')') if e.get('alt') else ''), '',
               '- Datoteka: `' + k + '.jpg`', '- Kamera: ' + p.get('camera', '')]
        if status == 'PONOVI' and p.get('issues'):
            md += ['- Što ne valja na postojećoj slici:'] + ['  - ' + x for x in p['issues']]
        md += ['', '```text', p['prompt'], '```', '']
open(os.path.join(REPO, 'PROMPTI-ZA-SLIKE.md'), 'w').write('\n'.join(md))
print('prompts: %d (ponoviti %d, nove %d, dobre %d), covers: %d' % (len(lib), count['PONOVI'], count['NOVO'], count['OK'], len(covers)))
