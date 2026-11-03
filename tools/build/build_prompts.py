# Writes PROMPTI-ZA-SLIKE.md: ready-to-paste ChatGPT image prompts for every exercise that has no photo or video yet.
# The shared style matches the approved series (the 81 exercise images of 2 Nov 2026), so new images fit beside them.
# Optional img_prompt keys: 'exercise' replaces the "Exercise:" label (e.g. to keep brand names out of the prompt),
# 'notes' is appended after the RIGHT panel (geometry clarification, ground of field drills).
import json, sys, os
REPO, W = sys.argv[1], sys.argv[2]
lib = json.load(open(os.path.join(W, 'library_merged.json')))
media = json.load(open(os.path.join(W, 'media_ids.json'))) if os.path.exists(os.path.join(W, 'media_ids.json')) else []
STYLE = ("Use case: scientific-educational. Professional two-panel exercise demonstration for a football training app, in the same series as the attached reference image. "
 "Character: keep EXACTLY the approved athlete of the reference image (face, tousled wavy dark-brown hair with a textured forward fringe, short beard, skin tone, "
 "lean normally fit football-player physique with modest natural muscle definition), in an azure-blue regular-fit technical T-shirt, navy shorts, white crew socks "
 "and modern off-white training shoes with teal/cobalt panels and a tiny lime accent. "
 "Studio: medium slate-grey backdrop (about #596570), matte medium-grey floor (about #515B65), soft bright studio light, subtle contact shadows, "
 "thin light-grey divider between the panels, detailed realistic photographic rendering. "
 "One 3:2 landscape image (1536 x 1024) with two equal panels side by side: LEFT = start position, RIGHT = end position; "
 "same athlete, camera, distance, scale, equipment and floor level in both; whole body, hands, feet and all equipment fully visible with safe margins. "
 "Use only the equipment named below, realistically built and correctly oriented to the body: coral/teal/blue weights and balls, teal mats, "
 "unbranded yellow/black suspension straps where needed, metallic bar shafts, dark bench and rack frames. "
 "No text, numbers, logos, labels or watermark. Anatomically correct joints, hands and grip; no equipment passing through the body, "
 "no floating weights, disconnected cords or extra limbs.")
CATS = ['Snaga', 'Eksplozivnost', 'Trup', 'Mobilnost', 'Aktivacija', 'Rehab', 'Kondicija']
todo = [(k, e) for k, e in lib.items() if not e.get('tae') and not e.get('v2media') and k not in media and e.get('img_prompt')]
todo.sort(key=lambda kv: (CATS.index(kv[1].get('cat')) if kv[1].get('cat') in CATS else 99, kv[1].get('order', 999), kv[1]['name']))
md = ['# Upute za ChatGPT: slike vježbi', '',
 'Za vježbe koje u aplikaciji još nemaju fotografiju ni video. Svaka uputa je spremna za kopiranje u ChatGPT (generiranje slika).', '',
 '1. Kopiraj cijeli blok jedne vježbe i zalijepi ga u ChatGPT, a uz njega priloži jednu od odobrenih slika vježbi (npr. goblet-squat.jpg) kao uzor za lik i stil.',
 '2. Provjeri sliku: položaj tijela, hvat, stopala i oprema moraju odgovarati uputama u aplikaciji. Ako nešto nije točno, napiši ChatGPT-u što da ispravi.',
 '3. Spremi sliku i dodaj je u aplikaciji (vježba → Uredi → Dodaj svoj video ili sliku), ili mi pošalji slike s nazivom datoteke kao u zagradi pa ih ugradim u aplikaciju za sve uređaje.', '',
 'Zajednički stil (već je u svakoj uputi): ' + STYLE, '', '---', '']
def block(k, e, before=None):
    p = e['img_prompt']
    alt = (' (' + e['alt'] + ')') if e.get('alt') else ''
    prompt = (STYLE + ' Exercise: ' + (p.get('exercise') or e['name'] + alt) + '. Equipment in frame: ' + (p.get('props') or 'none') + '. Camera: ' + (p.get('view') or 'side') + ' view. '
              'LEFT panel (start): ' + p.get('start', '') + ' RIGHT panel (end): ' + p.get('end', ''))
    if p.get('notes'):
        prompt = prompt.rstrip().rstrip('.') + '. ' + p['notes']
    return ['### ' + e['name'] + alt + '  `' + k + '.jpg`', ''] + ([before, ''] if before else []) + ['```text', prompt, '```', '']
cur = None
for k, e in todo:
    if e.get('cat') != cur:
        cur = e.get('cat'); md += ['## ' + (cur or 'Ostalo'), '']
    md += block(k, e)
# an own image that contradicts the corrected text (img_prompt.redo says how): its prompt stays listed until it is redone
redo = [(k, e) for k, e in lib.items() if k in media and (e.get('img_prompt') or {}).get('redo')]
redo.sort(key=lambda kv: (CATS.index(kv[1].get('cat')) if kv[1].get('cat') in CATS else 99, kv[1].get('order', 999), kv[1]['name']))
if redo:
    md += ['## Slike za ponoviti', '', 'Ove slike već su u aplikaciji, ali ne odgovaraju uputama vježbe. Napravi ih ponovno prema ispravljenoj uputi i pošalji ih pod istim nazivom datoteke.', '']
    for k, e in redo: md += block(k, e, 'Postojeća slika: ' + e['img_prompt']['redo'])
open(os.path.join(REPO, 'PROMPTI-ZA-SLIKE.md'), 'w').write('\n'.join(md))
print('prompts:', len(todo), '+ to redo:', len(redo))
