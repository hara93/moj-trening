# Writes PROMPTI-ZA-SLIKE.md: ready-to-paste ChatGPT image prompts for every exercise that has no photo or video yet.
import json, sys, os
REPO, W = sys.argv[1], sys.argv[2]
lib = json.load(open(os.path.join(W, 'library_merged.json')))
media = json.load(open(os.path.join(W, 'media_ids.json'))) if os.path.exists(os.path.join(W, 'media_ids.json')) else []
STYLE = ("Photorealistic studio photograph for a professional football training app (not an illustration). "
 "One athletic male football player, about 28 years old, short dark hair, plain dark-navy training T-shirt, black shorts, white socks, black training shoes. "
 "No logos, no text, no watermark. Dark charcoal studio background (#1F232B), soft even light, subtle floor shadow. "
 "One 3:2 landscape image (1536 x 1024) with two panels side by side: LEFT = start position, RIGHT = end position, "
 "same camera angle and framing in both, whole body and all equipment fully visible. "
 "Anatomically correct joints and proportions, correct grip and foot placement, realistic equipment.")
CATS = ['Snaga', 'Eksplozivnost', 'Trup', 'Mobilnost', 'Aktivacija', 'Rehab', 'Kondicija']
todo = [(k, e) for k, e in lib.items() if not e.get('tae') and not e.get('v2media') and k not in media and e.get('img_prompt')]
todo.sort(key=lambda kv: (CATS.index(kv[1].get('cat')) if kv[1].get('cat') in CATS else 99, kv[1].get('order', 999), kv[1]['name']))
md = ['# Upute za ChatGPT: slike vježbi', '',
 'Za vježbe koje u aplikaciji još nemaju fotografiju ni video. Svaka uputa je spremna za kopiranje u ChatGPT (generiranje slika).', '',
 '1. Kopiraj cijeli blok jedne vježbe i zalijepi ga u ChatGPT.',
 '2. Provjeri sliku: položaj tijela, hvat, stopala i oprema moraju odgovarati uputama u aplikaciji. Ako nešto nije točno, napiši ChatGPT-u što da ispravi.',
 '3. Spremi sliku i dodaj je u aplikaciji (vježba → Uredi → Dodaj svoj video ili sliku), ili mi pošalji slike s nazivom datoteke kao u zagradi pa ih ugradim u aplikaciju za sve uređaje.', '',
 'Zajednički stil (već je u svakoj uputi): ' + STYLE, '', '---', '']
cur = None
for k, e in todo:
    if e.get('cat') != cur:
        cur = e.get('cat'); md += ['## ' + (cur or 'Ostalo'), '']
    p = e['img_prompt']
    alt = (' (' + e['alt'] + ')') if e.get('alt') else ''
    prompt = (STYLE + ' Exercise: ' + e['name'] + alt + '. Equipment in frame: ' + (p.get('props') or 'none') + '. Camera: ' + (p.get('view') or 'side') + ' view. '
              'LEFT panel (start): ' + p.get('start', '') + ' RIGHT panel (end): ' + p.get('end', ''))
    md += ['### ' + e['name'] + alt + '  `' + k + '.jpg`', '', '```text', prompt, '```', '']
open(os.path.join(REPO, 'PROMPTI-ZA-SLIKE.md'), 'w').write('\n'.join(md))
print('prompts:', len(todo))
