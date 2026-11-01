/* Original schematic body illustration. Broad exercise regions, not an anatomical diagnosis. */
(function (root) {
  'use strict';
  const known = ['Kuk','Gluteus','Gluteus medius','Aduktori','Fleksori kuka','Stražnja loža','Kvadriceps','Core','Koljeno','Gležanj','Leđa','Ramena','Prsa','Biceps','Triceps','List','Torakalna kralježnica','Cijelo tijelo'];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // A single silhouette keeps the joints and limb proportions consistent in both views.
  const outline = '<ellipse cx="80" cy="30" rx="14" ry="18"/>' +
    '<path d="M66 29c-6-4-5 13 1 14m27-14c6-4 5 13-1 14M71 47v10l-15 6c-9 2-15 8-18 18l-9 33-10 36-6 10-1 17 3 2 3-12 1 15 3 1 3-16 3 12 3-1-1-16 5-14 10-27 8-22 3-10 5 24 1 17-6 26c-2 13 0 24 3 34l5 34 2 25-3 29-5 12 1 5 14 1 5-4 1-23 4-24 1-18 3-30 1-18 3-12 3 12 1 18 3 30 1 18 4 24 1 23 5 4 14-1 1-5-5-12-3-29 2-25 5-34c3-10 5-21 3-34l-6-26 1-17 5-24 3 10 8 22 10 27 5 14-1 16 3 1 3-12 3 16 3-1 1-15 3 12 3-2-1-17-6-10-10-36-9-33c-3-10-9-16-18-18l-15-6V47"/>';

  function diagram(back, active) {
    const has = (...regions) => active.has('Cijelo tijelo') || regions.some(r => active.has(r));
    const muscle = (d, regions) => '<path d="'+d+'" fill="'+(has(...regions)?'#5c89e8':'none')+'" fill-opacity="'+(has(...regions)?'.95':'1')+'"/>';
    const joint = (cx, cy, rx, ry, region) => '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+(has(region)?'#5c89e8':'none')+'"/>';
    let parts = '';
    // Deltoids and upper arms.
    parts += muscle('M54 66c-10 2-14 8-16 18l12 5 7-8 2-12Z', ['Ramena']);
    parts += muscle('M106 66c10 2 14 8 16 18l-12 5-7-8-2-12Z', ['Ramena']);
    parts += muscle('M38 88l-7 25 8 6 12-27-3-2Z', [back?'Triceps':'Biceps']);
    parts += muscle('M122 88l7 25-8 6-12-27 3-2Z', [back?'Triceps':'Biceps']);
    parts += muscle('M31 120l-9 30 6 7 11-33Z', []);
    parts += muscle('M129 120l9 30-6 7-11-33Z', []);

    if (!back) {
      // Chest, abdominal wall and lateral trunk.
      parts += muscle('M61 68l16 5v24c-9 3-18-1-21-8l2-15Z', ['Prsa']);
      parts += muscle('M99 68l-16 5v24c9 3 18-1 21-8l-2-15Z', ['Prsa']);
      parts += muscle('M69 102h9v14h-9l-3-7Zm13 0h9l3 7-3 7h-9Z', ['Core']);
      parts += muscle('M69 119h9v13h-9Zm13 0h9v13h-9Z', ['Core']);
      parts += muscle('M69 135h9v17l-8-5Zm13 0h9l-1 12-8 5Z', ['Core']);
      parts += muscle('M58 100l7 7 1 30-7-7-2-18Zm44 0-7 7-1 30 7-7 2-18Z', ['Core']);
      parts += muscle('M59 134l9 13 9 9-8 6-12-17Zm42 0-9 13-9 9 8 6 12-17Z', ['Kuk','Fleksori kuka']);
      // Quads and adductors remain distinct so inner-thigh work is not shown as quadriceps.
      parts += muscle('M58 150l10 14 5 15-3 30-6 3-6-30-3-16Zm44 0-10 14-5 15 3 30 6 3 6-30 3-16Z', ['Kvadriceps']);
      parts += muscle('M73 160l5 5-2 22-4 17 1-25-4-13Zm14 0-5 5 2 22 4 17-1-25 4-13Z', ['Aduktori']);
      parts += muscle('M64 224l8-1 1 17-6 31-3-2 2-25Zm32 0-8-1-1 17 6 31 3-2-2-25Z', ['List']);
      parts += '<path d="M79 68l-8-9m10 9 8-9M60 96l6 4m34-4-6 4M76 158l4 6 4-6M70 278l-4 7m24-7 4 7"/>';
    } else {
      // Upper back and lats, with a separate lower-back strip.
      parts += muscle('M71 58l7 8v30l-14-13-7-11Zm18 0-7 8v30l14-13 7-11Z', ['Leđa','Torakalna kralježnica']);
      parts += muscle('M58 80l18 21-7 24-10-13-3-18Zm44 0-18 21 7 24 10-13 3-18Z', ['Leđa']);
      parts += muscle('M76 103l2 3v35l-7-5 1-20Zm8 0-2 3v35l7-5-1-20Z', ['Leđa','Core']);
      parts += muscle('M60 118l8 11 1 12-12 9 1-14Zm40 0-8 11-1 12 12 9-1-14Z', ['Core']);
      // Gluteus medius wraps around the upper outer hip; maximus occupies the larger lower region.
      parts += muscle('M60 144l14-3 4 4-12 11-10 4 1-9Zm40 0-14-3-4 4 12 11 10 4-1-9Z', ['Gluteus','Gluteus medius','Kuk']);
      parts += muscle('M77 148v24c-7 6-16 2-20-4l-1-6 12-4Zm6 0v24c7 6 16 2 20-4l1-6-12-4Z', ['Gluteus']);
      parts += muscle('M58 178l8 1 7-3-2 27-5 10-5-11Zm44 0-8 1-7-3 2 27 5 10 5-11Z', ['Stražnja loža']);
      parts += muscle('M74 178l3-3-2 22-3 10Zm12 0-3-3 2 22 3 10Z', ['Aduktori']);
      parts += muscle('M64 224l8-2 2 12-5 20-4-9-2-10Zm32 0-8-2-2 12 5 20 4-9 2-10Z', ['List']);
      parts += '<path d="M80 59v83m0 7v25M69 256l-2 20m24-20 2 20M63 280l9 2m25-2-9 2"/>';
    }
    parts += joint(67,217,5,5,'Koljeno') + joint(93,217,5,5,'Koljeno');
    parts += joint(68,277,4,5,'Gležanj') + joint(92,277,4,5,'Gležanj');
    return '<g fill="none" stroke="#b5bdca" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">'+parts+outline+'</g>';
  }

  function render(zones) {
    const values = Array.isArray(zones) ? zones.filter(z => known.includes(z)) : [];
    const active = new Set(values);
    const label = values.length ? 'Ciljana područja: '+values.join(', ') : 'Prednji i stražnji prikaz tijela';
    return '<svg class="body-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 320" role="img" aria-label="'+escape(label)+'" style="display:block;width:100%;height:auto;max-height:300px">'+
      '<title>'+escape(label)+'</title><desc>Shematski prikaz širih područja uključenih u vježbu.</desc>'+
      '<g transform="translate(10 0)">'+diagram(false,active)+'</g><g transform="translate(190 0)">'+diagram(true,active)+'</g>'+
      '<g fill="#a5adbb" font-family="inherit" font-size="10" text-anchor="middle"><text x="90" y="315">Sprijeda</text><text x="270" y="315">Straga</text></g></svg>';
  }
  root.TrainingBodyMap = Object.freeze({render:render});
})(typeof window !== 'undefined' ? window : globalThis);
