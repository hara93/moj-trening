// Pitch diagrams for the field sessions, drawn by the app (our own drawings after the published descriptions).
// Units are metres. Full pitch: 105 x 68, x from the left goal line, y from the bottom touchline.
// A small area uses pitch: { w, h }. Path kinds: sprint, run, jog, walk, shuttle, dribble.
// "block" ties a path to the session block(s) it belongs to, so the player can highlight the current one.
window.PITCH = window.PITCH || {};
(function(P){
  const odd = n => Array.from({ length: n }, (_, i) => i).filter(i => i % 2 === 1);
  const even = n => Array.from({ length: n }, (_, i) => i).filter(i => i % 2 === 0);
  const loop = [[52.5,-1.6],[106.6,-1.6],[106.6,69.6],[-1.6,69.6],[-1.6,-1.6],[52.5,-1.6]];

  P['box-to-box-aerobno'] = {
    pitch:'full', alt:'Trčanje od šesnaesterca do šesnaesterca pa sprint natrag',
    markers:[{ kind:'start', x:16.5, y:44, label:'Start' }, { kind:'cone', x:88.5, y:44 }, { kind:'cone', x:88.5, y:28 }, { kind:'cone', x:16.5, y:28 }],
    paths:[
      { kind:'run', points:[[16.5,44],[88.5,44]], label:'40 s tamo-natrag · 60–70 %', order:1, block:even(16) },
      { kind:'walk', points:[[88.5,44],[88.5,28]], label:'20 s hod', order:2, block:even(16) },
      { kind:'sprint', points:[[88.5,28],[16.5,28]], label:'20 s sprint · 90 %', labelSide:'below', order:3, block:odd(16) },
      { kind:'walk', points:[[16.5,28],[16.5,44]], label:'10 s hod', order:4, block:odd(16) }
    ],
    dims:[{ from:[16.5,58], to:[88.5,58], label:'72 m · šesnaesterac – šesnaesterac' }],
    caption:'Ciklus od 90 s, četiri ciklusa u seriji. Trčanje (40 s) i sprint (20 s) idu tamo-natrag između šesnaesteraca: nacrt pokazuje smjer, ne broj duljina.'
  };

  P['brzina-i-brzinska-izdrzljivost'] = {
    pitch:'full', alt:'Tri sprinta s gol-linije: do šesnaesterca, do centra i cijelom duljinom',
    markers:[{ kind:'start', x:0, y:54 }, { kind:'start', x:0, y:36 }, { kind:'start', x:0, y:18 }],
    paths:[
      { kind:'sprint', points:[[0,54],[16.5,54]], label:'16,5 m', order:1, block:[0,3] },
      { kind:'walk', points:[[16.5,51],[1,51]], order:2, block:[0,3] },
      { kind:'sprint', points:[[0,36],[52.5,36]], label:'52,5 m', order:3, block:[1,4] },
      { kind:'walk', points:[[52.5,33],[1,33]], order:4, block:[1,4] },
      { kind:'sprint', points:[[0,18],[105,18]], label:'105 m', order:5, block:[2,5] },
      { kind:'walk', points:[[105,15],[1,15]], order:6, block:[2,5] }
    ],
    caption:'Svaki sprint maksimalno, povratak hodom je jedini odmor. Start s gol-linije: izvor ga ne navodi.'
  };

  P['intervali-15-15'] = {
    pitch:'full', alt:'Tri rute od 15 sekundi',
    markers:[{ kind:'start', x:16.5, y:54, label:'1' }, { kind:'start', x:16.5, y:36, label:'2' }, { kind:'start', x:16.5, y:18, label:'3' }],
    paths:[
      { kind:'shuttle', points:[[16.5,54],[52.5,54],[52.5,51],[16.5,51]], label:'Ruta 1 · 15 s', order:1, block:[0,3,6,9] },
      { kind:'shuttle', points:[[16.5,36],[52.5,36],[52.5,33],[5.5,33]], label:'Ruta 2 · 15 s', order:2, block:[1,4,7,10] },
      { kind:'shuttle', points:[[16.5,18],[61.65,18],[61.65,15],[16.5,15]], label:'Ruta 3 · 15 s', order:3, block:[2,5,8,11] }
    ],
    dims:[{ from:[16.5,62], to:[52.5,62], label:'36 m do centra' }],
    caption:'Redoslijed 1-2-3-1-2-3: svaka ruta 15 s, zatim 15 s oporavka. Ruta 2 završava kod peterca, ruta 3 ide iza centralnog kruga i natrag na šesnaesterac.'
  };

  P['intervali-3-2-1'] = {
    pitch:'full', alt:'Trčanje u krug oko terena',
    markers:[{ kind:'start', x:52.5, y:-1.6, label:'Start' }],
    paths:[{ kind:'run', points:loop, label:'1 krug ≈ 360 m', order:1, block:[0,1,2,3,4,5] }],
    caption:'3 min, 2 min pa 1 min trčanja oko terena s odmorom od 1, 2 i 3 min; cijeli niz još jednom. Trči ujednačeno, oko svoje MAS.'
  };

  P['mas-test-5-min'] = {
    pitch:'full', alt:'Petominutno trčanje oko terena',
    markers:[{ kind:'start', x:52.5, y:-1.6, label:'Start' }],
    paths:[{ kind:'run', points:loop, label:'5 min što dalje', order:1, block:0 }],
    dims:[{ from:[0,8], to:[105,8], label:'oko 360 m po krugu: zbroji metre' }],
    caption:'Trči 5 minuta što dalje možeš. MAS (maksimalna aerobna brzina, m/s) = prijeđeni metri / 300. Točnije je na stazi od 400 m ili s GPS-om.'
  };

  P['izlozenost-maksimalnoj-brzini'] = {
    pitch:'full', alt:'Leteći sprint: zona ubrzanja i ciljna zona',
    markers:[{ kind:'cone', x:14, y:36, label:'Start', labelSide:'left' }, { kind:'cone', x:34, y:36 }, { kind:'cone', x:74, y:36 }, { kind:'cone', x:14, y:32 }, { kind:'cone', x:34, y:32 }, { kind:'cone', x:74, y:32 }],
    paths:[
      { kind:'run', points:[[14,34],[34,34]], label:'ubrzanje', order:1, block:0 },
      { kind:'sprint', points:[[34,34],[74,34]], label:'≥ 95 % maks.', order:2, block:0 },
      { kind:'jog', points:[[74,34],[90,34]], label:'usporavanje', order:3, block:0 }
    ],
    dims:[{ from:[14,26], to:[34,26], label:'20 m' }, { from:[34,26], to:[74,26], label:'40 m' }],
    caption:'Prema izvoru: 20 m zone ubrzanja i 40 m zone maksimalne brzine, zatim usporavanje. Između sprintova odmaraj do punog oporavka.'
  };

  P['maksimalna-brzina-40-20'] = {
    pitch:{ w:50, h:22 }, alt:'Sprintovi na 40 m i 20 m',
    markers:[{ kind:'start', x:5, y:16 }, { kind:'cone', x:25, y:16 }, { kind:'cone', x:45, y:16 }, { kind:'start', x:5, y:6 }, { kind:'cone', x:25, y:6 }],
    paths:[
      { kind:'sprint', points:[[5,16],[45,16]], label:'8 × 40 m · 90 %', order:1, block:0 },
      { kind:'walk', points:[[45,13.5],[6,13.5]], order:2, block:0 },
      { kind:'sprint', points:[[5,6],[25,6]], label:'10 × 20 m · 100 %', order:3, block:1 },
      { kind:'walk', points:[[25,3.5],[6,3.5]], order:4, block:1 }
    ],
    caption:'Odmor 40 s između ponavljanja: hod natrag na start.'
  };

  P['mas-mreze-15-15'] = {
    pitch:{ w:76, h:56 }, alt:'MAS mreža: pravokutnik 60 × 42 m',
    markers:[{ kind:'start', x:8, y:7, label:'Start' }, { kind:'cone', x:68, y:7 }, { kind:'cone', x:68, y:49 }, { kind:'cone', x:8, y:49 }],
    paths:[
      { kind:'run', points:[[8,7],[68,7]], label:'15 s · 100 % MAS', order:1, block:0 },
      { kind:'jog', points:[[68,7],[68,49]], label:'15 s · 70 %', order:2, block:0 },
      { kind:'run', points:[[68,49],[8,49]], label:'15 s · 100 % MAS', order:3, block:0 },
      { kind:'jog', points:[[8,49],[8,7]], label:'15 s · 70 %', order:4, block:0 }
    ],
    dims:[{ from:[8,1.6], to:[68,1.6], label:'MAS × 15 (npr. 60 m)' }, { from:[74,7], to:[74,49], label:'0,7 × MAS × 15 (npr. 42 m)' }],
    caption:'Primjer za MAS (maksimalnu aerobnu brzinu) 4 m/s. Jedan krug mreže traje 1 min; 5 krugova bez stajanja čini seriju. S rezultatom MAS testa nacrt i duljine računaju se iz tvoje MAS.'
  };

  P['mendo-solo-ubrzanje'] = {
    pitch:'full', alt:'Pet vježbi ubrzanja i promjene smjera na jednom terenu',
    markers:[
      { kind:'start', x:16.5, y:58, label:'1' }, { kind:'cone', x:43.4, y:56.5 },
      { kind:'start', x:88.5, y:61, label:'2' }, { kind:'cone', x:83.5, y:63.5 }, { kind:'cone', x:78.5, y:63.5 }, { kind:'cone', x:73.5, y:63.5 },
      { kind:'start', x:16.5, y:34, label:'3' }, { kind:'cone', x:34, y:37 }, { kind:'cone', x:34, y:30.5 }, { kind:'cone', x:61.7, y:32.5 },
      { kind:'start', x:0, y:14, label:'4' },
      { kind:'start', x:64, y:14, label:'5' }, { kind:'cone', x:68, y:12.5 }, { kind:'cone', x:72, y:15.5 }, { kind:'cone', x:76, y:12.5 }, { kind:'cone', x:80, y:15.5 }, { kind:'cone', x:84, y:12.5 }, { kind:'cone', x:88, y:15.5 }
    ],
    paths:[
      { kind:'shuttle', points:[[16.5,58],[43.4,58],[43.4,55],[16.5,55]], label:'sprint i okret', order:1, block:0 },
      { kind:'shuttle', points:[[88.5,61],[83.5,61],[83.5,59],[88.5,59],[88.5,57],[78.5,57],[78.5,55],[88.5,55],[88.5,53],[73.5,53],[73.5,51],[88.5,51]], label:'5-10-15 m s loptom', labelSide:'below', order:2, block:1 },
      { kind:'sprint', points:[[16.5,34],[34,34],[43.4,34],[61.7,34],[61.7,31],[16.5,31]], label:'sprint, kočenje, natrag', order:3, block:2 },
      { kind:'sprint', points:[[0,14],[16.5,14]], label:'16,5 m', order:4, block:3 },
      { kind:'jog', points:[[16.5,11.5],[11,11.5]], order:5, block:3 },
      { kind:'sprint', points:[[11,9],[34,9]], label:'okret i ubrzanje', labelSide:'below', order:6, block:3 },
      { kind:'sprint', points:[[64,14],[68,12.5],[72,15.5],[76,12.5],[80,15.5],[84,12.5],[88,15.5],[92,14]], order:7, block:4 }
    ],
    labels:[{ x:78, y:8, text:'cik-cak 5 m' }],
    caption:'Brojevi su redoslijed vježbi. Udaljenosti su prema izvoru, a raspored na terenu je vlastiti.'
  };

  P['k3-predsezonska-brzina'] = {
    pitch:{ w:34, h:30 }, alt:'Staze za tehniku trčanja, sprintove, trčanje s gumom i reaktivne utrke',
    markers:[
      { kind:'cone', x:4, y:26 }, { kind:'cone', x:14, y:26 },
      { kind:'start', x:4, y:20 }, { kind:'cone', x:24, y:20 },
      { kind:'start', x:4, y:14 }, { kind:'cone', x:24, y:14 },
      { kind:'start', x:4, y:8 }, { kind:'cone', x:24, y:8 },
      { kind:'start', x:4, y:2.6 }, { kind:'cone', x:14, y:2.6 }
    ],
    paths:[
      { kind:'jog', points:[[4,26],[14,26]], label:'A/B hod i skip · 10 m', order:1, block:[0,1,2,3] },
      { kind:'sprint', points:[[4,20],[24,20]], label:'sprint iz 3 položaja · 20 m', order:2, block:[4,5,6] },
      { kind:'sprint', points:[[4,14],[24,14]], label:'padajući start · 20 m', order:3, block:7 },
      { kind:'sprint', points:[[4,8],[24,8]], label:'sprint · 20 m', order:4, block:8 },
      { kind:'sprint', points:[[4,2.6],[14,2.6]], label:'start na znak · 10 m', order:5, block:9 }
    ],
    caption:'Vlastiti prikaz prema savjetima K3 Performance. Točan raspored staza izvor ne propisuje. Treniraš sam, pa umjesto gume i partnera radiš padajuće startove i startove na znak lopte ili aplikacije.'
  };
})(window.PITCH);

// STATSports Pre-Season Training Program (PDF): our own drawings of runs 1A-3D, geometry measured from the PDF
(function(P){
  P['ss-pre-1a'] = {"pitch": "full", "alt": "Run 1A · Izgradnja motora", "markers": [{"kind": "start", "x": 1.2, "y": 49.2, "label": "Start"}], "paths": [{"kind": "run", "points": [[0, 49.2], [105.0, 49.2]], "order": 1, "label": "105 m", "block": 0}, {"kind": "run", "points": [[105.0, 45.8], [0, 45.8]], "order": 2, "block": 0}, {"kind": "run", "points": [[0, 35.9], [88.5, 35.9]], "order": 3, "label": "88,5 m", "block": 0}, {"kind": "run", "points": [[88.5, 32.3], [0, 32.3]], "order": 4, "block": 0}, {"kind": "run", "points": [[0, 21.2], [52.5, 21.2]], "order": 5, "label": "52,5 m", "block": 0}, {"kind": "run", "points": [[52.5, 18.0], [0, 18.0]], "order": 6, "block": 0}], "dims": [], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti.", "labels": [{"x": 34, "y": 10.9, "text": "odmor 2 min · ponovi 4 puta"}]};
  P['ss-pre-1b'] = {"pitch": "full", "alt": "Run 1B · Veliki intervali", "markers": [{"kind": "start", "x": 1.2, "y": 18.9, "label": "Start"}], "paths": [{"kind": "jog", "points": [[0, 19.2], [16.5, 19.2]], "order": 1, "label": "jog", "block": 0}, {"kind": "run", "points": [[16.5, 19.2], [52.5, 19.2]], "order": 2, "label": "tempo", "block": 0}, {"kind": "jog", "points": [[52.5, 19.2], [88.5, 19.2]], "order": 3, "label": "jog", "block": 0}, {"kind": "walk", "points": [[88.5, 19.2], [105.0, 19.2]], "order": 4, "label": "hod", "block": 0}, {"kind": "jog", "points": [[105.0, 10.4], [88.5, 10.4]], "order": 5, "label": "jog", "block": 0}, {"kind": "run", "points": [[88.5, 10.4], [52.5, 10.4]], "order": 6, "label": "tempo", "block": 0}, {"kind": "jog", "points": [[52.5, 10.4], [16.5, 10.4]], "order": 7, "label": "jog", "block": 0}, {"kind": "walk", "points": [[16.5, 10.4], [0, 10.4]], "order": 8, "label": "hod", "block": 0}], "dims": [{"from": [0, 25], "to": [16.5, 25], "label": "16,5 m"}, {"from": [16.5, 25], "to": [52.5, 25], "label": "36 m"}], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
  P['ss-pre-1c'] = {"pitch": "full", "alt": "Run 1C · 320-ice (4 × box-to-box)", "markers": [], "paths": [{"kind": "run", "points": [[88.5, 12.3], [16.5, 12.3]], "order": 1, "block": 0}, {"kind": "run", "points": [[16.5, 9.6], [88.5, 9.6]], "order": 2, "block": 0}, {"kind": "run", "points": [[88.5, 6.9], [16.5, 6.9]], "order": 3, "block": 0}, {"kind": "run", "points": [[16.5, 4.2], [88.5, 4.2]], "order": 4, "block": 0}], "dims": [{"from": [16.5, 16], "to": [88.5, 16], "label": "72 m · 4 × box-to-box"}], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF)."};
  P['ss-pre-2a'] = {"pitch": "full", "alt": "Run 2A · Tempo cijelom duljinom", "markers": [{"kind": "start", "x": 2.7, "y": 49.0}, {"kind": "start", "x": 2.8, "y": 37.4}, {"kind": "start", "x": 2.7, "y": 25.9}], "paths": [{"kind": "run", "points": [[0, 45.7], [105.0, 45.7]], "order": 1, "label": "Run 1 · 22 s", "block": 0}, {"kind": "run", "points": [[0, 34.1], [105.0, 34.1]], "order": 2, "label": "Run 2 · 18 s", "block": 1}, {"kind": "run", "points": [[0, 22.5], [105.0, 22.5]], "order": 3, "label": "Run 3 · 24 s", "block": 2}], "dims": [{"from": [0, 60], "to": [105, 60], "label": "105 m"}], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF)."};
  P['ss-pre-2b'] = {"pitch": "full", "alt": "Run 2B · Single – double – single", "markers": [{"kind": "start", "x": 5.7, "y": 29.9, "label": "Start"}, {"kind": "start", "x": 12.2, "y": 29.9, "label": "1"}, {"kind": "start", "x": 48.7, "y": 39.7, "label": "2"}, {"kind": "start", "x": 93.2, "y": 51.3, "label": "3"}], "paths": [{"kind": "run", "points": [[16.5, 31.8], [88.5, 31.8]], "order": 1, "label": "Single · 15 s", "block": [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33]}, {"kind": "run", "points": [[88.5, 37.6], [52.5, 37.6]], "order": 2, "label": "Double · 16 s", "block": [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]}, {"kind": "run", "points": [[52.5, 44.8], [88.5, 44.8]], "order": 3, "block": [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]}, {"kind": "run", "points": [[88.5, 53.2], [16.5, 53.2]], "order": 4, "label": "Single · 15 s", "block": [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]}], "dims": [{"from": [16.5, 25], "to": [88.5, 25], "label": "72 m"}], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Brojevi 1–3 su Run 1, Run 2 i Run 3: single, double, single. Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
  P['ss-pre-2c'] = {"pitch": "full", "alt": "Run 2C · Speedy Gonzalez", "markers": [{"kind": "start", "x": 0.2, "y": 55.7}, {"kind": "start", "x": 0.2, "y": 33.8}, {"kind": "start", "x": 0.2, "y": 12.4}], "paths": [{"kind": "run", "points": [[0, 55.6], [88.5, 55.6]], "order": 1, "label": "Run 1 · 30–35 s", "block": [0, 3, 6, 9, 12, 15]}, {"kind": "run", "points": [[88.5, 53.3], [0, 53.3]], "order": 2, "block": [0, 3, 6, 9, 12, 15]}, {"kind": "run", "points": [[0, 33.8], [105.0, 33.8]], "order": 3, "label": "Run 2 · 15–17 s", "block": [1, 4, 7, 10, 13, 16]}, {"kind": "run", "points": [[0, 12.3], [52.5, 12.3]], "order": 4, "label": "Run 3 · 8–10 s", "block": [2, 5, 8, 11, 14, 17]}], "dims": [], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
  P['ss-pre-2d'] = {"pitch": "full", "alt": "Run 2D · Brzinska izdržljivost", "markers": [{"kind": "start", "x": 0.2, "y": 56.8}, {"kind": "start", "x": 0.2, "y": 34.4}, {"kind": "start", "x": 0.2, "y": 12.4}], "paths": [{"kind": "run", "points": [[0, 56.7], [105.0, 56.7]], "order": 1, "label": "Run 1 · 15–20 s", "block": 0}, {"kind": "run", "points": [[0, 35.4], [52.5, 35.4]], "order": 2, "label": "Run 2 · 15–17 s", "block": 1}, {"kind": "run", "points": [[52.5, 32.5], [0, 32.5]], "order": 3, "block": 1}, {"kind": "run", "points": [[0, 12.4], [16.5, 12.4]], "order": 4, "block": 2}, {"kind": "run", "points": [[16.5, 10.1], [0, 10.1]], "order": 5, "block": 2}, {"kind": "run", "points": [[0, 7.9], [105.0, 7.9]], "order": 6, "label": "Run 3 · 20–25 s", "block": 2}], "dims": [], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
  P['ss-pre-3a'] = {"pitch": {"w": 80, "h": 52}, "alt": "Run 3A · Mali intervali (trokut)", "markers": [{"kind": "start", "x": 60.0, "y": 5.0, "label": "Start"}, {"kind": "cone", "x": 58.4, "y": 10.03}, {"kind": "cone", "x": 58.4, "y": 15.06}, {"kind": "cone", "x": 58.4, "y": 20.09}, {"kind": "cone", "x": 58.4, "y": 25.12}, {"kind": "ball", "x": 61.6, "y": 45.84}, {"kind": "cone", "x": 56.8, "y": 46.64}, {"kind": "cone", "x": 52.8, "y": 43.84}, {"kind": "cone", "x": 48.8, "y": 46.64}, {"kind": "cone", "x": 44.8, "y": 43.84}, {"kind": "cone", "x": 39.88, "y": 45.24}, {"kind": "cone", "x": 19.76, "y": 45.24}, {"kind": "cone", "x": 33.17, "y": 31.83}, {"kind": "cone", "x": 46.59, "y": 18.41}], "paths": [{"kind": "shuttle", "points": [[60, 5], [60, 20.09], [61.6, 20.09], [61.6, 15.06], [63.2, 15.06], [63.2, 25.12], [60, 25.12]], "order": 1, "label": "shuttle", "block": 0}, {"kind": "jog", "points": [[60.0, 25.12], [60.0, 45.24]], "order": 2, "label": "jog", "block": 0}, {"kind": "dribble", "points": [[60.0, 45.24], [58.4, 47.84], [56.8, 48.24], [55.0, 46.44], [54.2, 44.64], [52.8, 42.24], [51.2, 44.04], [50.4, 46.04], [48.8, 48.24], [47.0, 46.44], [46.2, 44.64], [44.8, 42.24], [43.2, 44.04], [42.4, 45.24], [39.88, 45.24]], "order": 3, "block": 0}, {"kind": "jog", "points": [[39.88, 45.24], [19.76, 45.24]], "order": 4, "label": "jog", "block": 0}, {"kind": "sprint", "points": [[19.76, 45.24], [33.17, 31.83]], "order": 5, "label": "sprint", "block": 0}, {"kind": "jog", "points": [[33.17, 31.83], [46.59, 18.41]], "order": 6, "label": "jog", "block": 0}, {"kind": "walk", "points": [[46.59, 18.41], [60.0, 5.0]], "order": 7, "label": "hod", "block": 0}], "dims": [], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Svaka dionica je 22 jarda (oko 20 m); original nije u mjerilu.", "labels": [{"x": 50, "y": 53, "text": "dribling"}]};
  P['ss-pre-3b'] = {"pitch": "full", "alt": "Run 3B · Srednji intervali", "markers": [{"kind": "start", "x": 36.1, "y": 68.0, "label": "Start"}], "paths": [{"kind": "jog", "points": [[36.1, 68.0], [36.1, 51.5]], "order": 1, "block": 0}, {"kind": "sprint", "points": [[36.1, 51.5], [36.1, 34.0]], "order": 2, "label": "ubrzanje", "block": 0}, {"kind": "jog", "points": [[36.1, 34.0], [36.1, 16.5]], "order": 3, "block": 0}, {"kind": "walk", "points": [[36.1, 16.5], [36.1, 0]], "order": 4, "block": 0}, {"kind": "jog", "points": [[31.5, 0], [31.5, 16.5]], "order": 5, "block": 0}, {"kind": "sprint", "points": [[31.5, 16.5], [31.5, 34.0]], "order": 6, "label": "ubrzanje", "block": 0}, {"kind": "jog", "points": [[31.5, 34.0], [31.5, 51.5]], "order": 7, "block": 0}, {"kind": "walk", "points": [[31.5, 51.5], [31.5, 68.0]], "order": 8, "block": 0}], "dims": [{"from": [22, 0], "to": [22, 68], "label": "68 m · širina terena"}], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
  P['ss-pre-3c'] = {"pitch": "full", "alt": "Run 3C · Speed demon", "markers": [{"kind": "start", "x": 0.2, "y": 58.4}, {"kind": "start", "x": 0.2, "y": 34.4}, {"kind": "start", "x": 0.2, "y": 11.9}], "paths": [{"kind": "run", "points": [[0, 58.4], [105.0, 58.4]], "order": 1, "label": "Run 1 · 30–35 s", "block": [0, 3, 6, 9, 12]}, {"kind": "run", "points": [[105.0, 56.2], [0, 56.2]], "order": 2, "block": [0, 3, 6, 9, 12]}, {"kind": "run", "points": [[0, 35.7], [61.65, 35.7]], "order": 3, "label": "Run 2 · 20–25 s", "block": [1, 4, 7, 10, 13]}, {"kind": "run", "points": [[61.65, 33.3], [43.35, 33.3]], "order": 4, "block": [1, 4, 7, 10, 13]}, {"kind": "run", "points": [[43.35, 30.9], [105.0, 30.9]], "order": 5, "block": [1, 4, 7, 10, 13]}, {"kind": "run", "points": [[0, 11.8], [105.0, 11.8]], "order": 6, "label": "Run 3 · 15–17 s", "block": [2, 5, 8, 11, 14]}], "dims": [], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
  P['ss-pre-3d'] = {"pitch": "full", "alt": "Run 3D · Srednji intervali sa shuttleom", "markers": [{"kind": "start", "x": 40, "y": 68.0, "label": "Start"}, {"kind": "cone", "x": 29.8, "y": 68.0}, {"kind": "cone", "x": 29.8, "y": 51.5, "label": "A", "labelSide": "left"}, {"kind": "cone", "x": 29.8, "y": 45.1, "label": "B", "labelSide": "left"}, {"kind": "cone", "x": 29.8, "y": 38.7, "label": "C", "labelSide": "left"}, {"kind": "cone", "x": 29.8, "y": 32.3, "label": "D", "labelSide": "left"}, {"kind": "cone", "x": 29.8, "y": 16.5, "label": "E", "labelSide": "left"}, {"kind": "cone", "x": 29.8, "y": 0.0}], "paths": [{"kind": "jog", "points": [[40.0, 68], [40.0, 51.5]], "order": 1, "block": 0}, {"kind": "shuttle", "points": [[40.0, 51.5], [40.0, 38.7], [41.6, 38.7], [41.6, 45.1], [43.2, 45.1], [43.2, 32.3], [40.0, 32.3]], "order": 2, "label": "shuttle", "block": 0}, {"kind": "jog", "points": [[40.0, 32.3], [40.0, 16.5]], "order": 3, "block": 0}, {"kind": "walk", "points": [[40.0, 16.5], [40.0, 0]], "order": 4, "block": 0}, {"kind": "jog", "points": [[21, 0], [21, 16.5]], "order": 5, "block": 0}, {"kind": "sprint", "points": [[21, 16.5], [21, 32.3]], "order": 6, "label": "ubrzanje", "block": 0}, {"kind": "jog", "points": [[21, 32.3], [21, 51.5]], "order": 7, "block": 0}, {"kind": "walk", "points": [[21, 51.5], [21, 68.0]], "order": 8, "block": 0}], "dims": [{"from": [32, 45.1], "to": [32, 51.5], "label": "6,4 m"}, {"from": [17, 68], "to": [17, 51.5], "label": "16,5 m"}], "caption": "Vlastiti prikaz prema STATSports Pre-Season Training Program (PDF). Povratne dionice nacrtane su u zasebnoj traci samo radi preglednosti."};
})(window.PITCH);
