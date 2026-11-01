/* Moj trening: reproducible pitch geometry, not an estimate of an athlete's movement. */
(function (global) {
  'use strict';
  let serial = 0;
  const C = {work:'#F4C96D', jog:'#7BC9BE', walk:'#A9B8D3', rest:'#A9B8D3', runner:'#FFFFFF', ink:'#EDF3F0', muted:'#A4B8AF'};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = n => Number(n).toLocaleString('hr-HR',{maximumFractionDigits:1});
  const finite = n => Number.isFinite(Number(n)) && Number(n) > 0;
  const words = (value, max) => {
    const out=[]; let line='';
    String(value || '').split(/\s+/).forEach(w => { if ((line+' '+w).trim().length > max && line) {out.push(line); line=w;} else line=(line+' '+w).trim(); });
    if (line) out.push(line); return out;
  };
  const text = (x,y,s,sz,fill,anchor,more) => '<text x="'+x+'" y="'+y+'" font-size="'+(sz||18)+'" fill="'+(fill||C.ink)+'" text-anchor="'+(anchor||'start')+'" '+(more||'')+'>'+esc(s)+'</text>';
  const getId = f => String(typeof f==='string' ? f : (f.id || f.slug || ''));
  const sourceImage = f => {
    const s=String(f.diagram_image||f.diagramImage||'');
    return /^(?:https?:\/\/|\/?assets\/|\.\/assets\/)/.test(s) ? s : '';
  };
  function routeFor(field, options, L, W) {
    const id=getId(field), i=Math.max(0,Math.floor(Number(options.block)||0));
    const rep=Math.max(1,Math.floor(Number(options.rep)||1));
    const b=(field.blocks||[])[i]||{};
    const out={id,segments:[],cones:[],note:'',caption:'',distance:null,distanceLabel:'',schematic:false,sourceOnly:false};
    const line=(xs,modes) => {
      out.segments=xs.slice(1).map((x,n)=>({from:[xs[n],W/2],to:[x,W/2],mode:(modes&&modes[n])||'work',n:n+1}));
      out.lanes=xs.length>2;
    };
    const straight=(dist,caption) => { const x=(L-dist)/2; line([x,x+dist]); out.cones=[[x,W/2],[x+dist,W/2]]; out.distance=dist; out.caption=caption||('Dionica '+num(dist)+' m'); };
    const fall=(note,useSource) => {out.schematic=true;out.sourceOnly=!!useSource;out.note='Shematski prikaz; provjeri postavke. '+note;return out;};
    const perimeter=()=>{
      out.segments=[{from:[0,0],to:[L,0],mode:'jog',n:1},{from:[L,0],to:[L,W],mode:'jog',n:2},{from:[L,W],to:[0,W],mode:'jog',n:3},{from:[0,W],to:[0,0],mode:'jog',n:4}];
      out.caption='Opseg označenog terena: '+num(2*(L+W))+' m';
      out.note='Putanja uz linije prikazuje geometrijski opseg. Izmjeri stvarnu stazu i upiši stvarno prijeđene metre.';
    };
    switch(id) {
      case 'box-to-box-aerobno':
        if(i%2===1) return fall('Smjer 20-sekundnog sprinta nije preciziran u izvoru. Postavi dionicu prije pokretanja.');
        line([16.5,L-16.5,16.5],['jog','jog']);out.distance=L-33;out.distanceLabel='Jedna dužina';
        out.caption='Kontinuirano između šesnaesteraca';out.note='Ponavljaj putanju tijekom radnog intervala. Ukupni metri ovise o stvarno odrađenim dužinama.'; break;
      case 'brzina-i-brzinska-izdrzljivost': {
        const j=i%3,end=[16.5,L/2,L][j];line([0,end]);out.distance=end;out.caption=['Do šesnaesterca','Do centra','Cijeli teren'][j];
        out.schematic=true;out.note='Shematski prikaz; provjeri postavke. Start s gol-linije je pretpostavka postojećeg plana, nije preciziran u izvoru.'; break;
      }
      case 'intervali-15-15': {
        const j=(rep-1)%3;
        if(j===0){line([16.5,L/2,16.5]);out.distance=L-33;out.caption='Ruta 1 · šesnaesterac → centar → natrag';}
        if(j===1){line([16.5,L/2,0,5.5]);out.distance=L-11;out.caption='Ruta 2 · centar → gol-linija → peterac';}
        if(j===2) return fall('Ruta 3 završava „iza središnjeg kruga”; točna točka okreta nije određena. Označi je čunjem i izmjeri dionicu.');
        out.note='Redoslijed ruta u seriji: 1–2–3–1–2–3. Udaljenost je izračunata iz dimenzija terena.';break;
      }
      case 'intervali-3-2-1': perimeter();break;
      case 'mas-test-5-min': perimeter();out.note='Izmjeri stazu. Rezultat testa = stvarno prijeđeni metri / 300 s. Animacija ne mjeri udaljenost.';break;
      case 'maksimalna-brzina-40-20': straight(i%2===0?40:20,'Čunjevi na '+(i%2===0?'40':'20')+' m');out.note='Dionica završava prolaskom cilja. Ciljano vrijeme nije mjerenje tvoje brzine.';break;
      case 'k3-predsezonska-brzina': {
        const d=Number(b.distance_m)||(i<4||i===9?10:20);straight(d,b.label_hr||'Tehnička dionica');
        out.note=(i===7||i===8)?'Odabrana dionica '+num(d)+' m; izvor dopušta 15–25 m. Za otpor gume provjeri sigurno sidrište i raspoloživu duljinu.':'Putanja prikazuje izmjerenu dionicu; položaj starta i tehniku pokaži prema uputama vježbe.';break;
      }
      case 'izlozenost-maksimalnoj-brzini': {
        const a=Number(options.acceleration_m||field.acceleration_m||field.accelerationDistance),f=Number(options.flying_m||field.flying_m||field.flyingDistance);
        if(!finite(a)||!finite(f))return fall('Duljina zone ubrzanja i leteće dionice nije unesena. Unesi obje izmjerene udaljenosti.');
        if(a+f>L)return fall('Zone ubrzanja i leteće dionice ne stanu u odabranu duljinu terena. Dodaj i siguran prostor za usporavanje.');
        const x=(L-a-f)/2;line([x,x+a,x+a+f],['jog','work']);out.cones=[[x,W/2],[x+a,W/2],[x+a+f,W/2]];
        out.caption='Ubrzanje '+num(a)+' m → leteća dionica '+num(f)+' m';out.note='Prikazane udaljenosti su tvoje postavke. Osiguraj dodatni prostor za postupno usporavanje.';break;
      }
      case 'mas-mreze-15-15': {
        const mas=Number(options.mas_mps||options.mas||field.mas_mps||field.mas), a=Number(options.work_m||field.work_m)||(mas>0?mas*15:0),r=Number(options.recovery_m||field.recovery_m)||(mas>0?mas*.7*15:0);
        if(!finite(a)||!finite(r))return fall('Najprije upiši rezultat MAS testa. Dionice se računaju iz osobne brzine, bez zadane tuđe vrijednosti.');
        if(a>L||r>W)return fall('Mreža '+num(a)+' × '+num(r)+' m ne stane u odabrani teren. Potrebna je veća izmjerena površina ili druga organizacija treninga.');
        const x=(L-a)/2,y=(W-r)/2,p=[[x,y],[x+a,y],[x+a,y+r],[x,y+r],[x,y]];
        out.segments=p.slice(1).map((q,n)=>({from:p[n],to:q,mode:n%2?'jog':'work',n:n+1}));out.cones=p.slice(0,4);
        out.caption='100 % MAS: '+num(a)+' m · 70 % MAS: '+num(r)+' m';out.note='Svaka stranica traje 15 s. Zlatno: rad; tirkizno: aktivni oporavak. Završna stranica pripada ciklusu.';break;
      }
      case 'mendo-solo-ubrzanje':
        if(i===1){const x=(L-15)/2;line([x,x+5,x,x+10,x,x+15,x]);out.cones=[0,5,10,15].map(d=>[x+d,W/2]);out.caption='Dio vježbe · shuttle 5 / 10 / 15 m';out.schematic=true;out.note='Shematski prikaz; provjeri postavke. Prikazan je samo shuttle. Završni sprint prema šesnaestercu nije dovoljno definiran za točnu ukupnu udaljenost.';}
        else if(i===3){line([0,16.5]);out.caption='Prvi dio · sprint do šesnaesterca';out.schematic=true;out.note='Shematski prikaz; provjeri postavke. Dio unatrag traje 2–3 s, a završni cilj nije prostorno određen.';}
        else return fall('Raspored okreta, završnog cilja ili svih čunjeva nije dovoljno određen za točnu putanju. Koristi izvornu demonstraciju i izmjeri postav.' );
        break;
      case 'pdf-run-1a':line([0,L,0,L-16.5,0,L/2,0]);out.distance=5*L-33;out.caption='Puna dužina + suprotni šesnaesterac + centar';out.note='Jedno ponavljanje ima svih šest dionica. Smjerovi su grafički razmaknuti radi čitljivosti.';break;
      case 'pdf-run-1b':line([0,16.5,L/2,L-16.5,L,L-16.5,L/2,16.5,0],['jog','work','jog','walk','jog','work','jog','walk']);out.caption='Jog → tempo → jog → hod, u oba smjera';out.note='Ponavljaj slijed tijekom petominutnog bloka. Zlatno: tempo; tirkizno: jog; svijetloplavo: hod.';break;
      case 'pdf-run-1c':line([16.5,L-16.5,16.5,L-16.5,16.5]);out.distance=4*(L-33);out.caption='Četiri dužine između šesnaesteraca';out.note='Izvorni naziv „320s” nije jednak udaljenosti na svakom terenu. Prikazan je stvaran izračun za unesenu duljinu.';break;
      case 'pdf-run-2a':line([0,L]);out.distance=L;out.caption='Blok '+((i%3)+1)+' · jedna puna dužina';out.note='Sljedeće ponavljanje može krenuti sa suprotne gol-linije. Deset dužina = '+num(L*10)+' m.';break;
      case 'pdf-run-2b':{
        const j=i%3;line(j===0?[16.5,L-16.5]:j===1?[L-16.5,L/2,L-16.5]:[L-16.5,16.5]);out.distance=L-33;out.caption=['Single · prema drugom šesnaestercu','Double · do centra i natrag','Single · povratak'][j];out.note='Jedan ciklus čine sva tri koraka. Dodatni odmor između serija nije propisan u PDF-u.';break;
      }
      case 'pdf-run-2c':{
        const j=i%3;line(j===0?[0,L-16.5,0]:j===1?[0,L]:[0,L/2]);out.distance=[2*(L-16.5),L,L/2][j];out.caption=['Run 1 · suprotni šesnaesterac i natrag','Run 2 · cijeli teren','Run 3 · pola terena'][j];out.note='Putanja prema crtežu PDF-a. Izvorni navodi o odmorima proturječni su; potvrdi ih prije pokretanja.';break;
      }
      case 'pdf-run-2d':{
        const j=i%3;line(j===0?[0,L]:j===1?[0,L/2,0]:[0,16.5,0,L]);out.distance=[L,L,L+33][j];out.caption=['Run 1 · cijeli teren','Run 2 · pola terena i natrag','Run 3 · kratki okret i cijeli teren'][j];out.note='Svaki blok ima pet ponavljanja. Broj dionica unutar ponavljanja prati numerirane strelice.';break;
      }
      case 'pdf-run-3a':return fall('Izvor označava segmente od 22 yd (20,1 m), ali ne sve razmake čunjeva. Upotrijebi izvorni prikaz.',true);
      case 'pdf-run-3b':return fall('Duljine pojedinih zona preko širine terena nisu navedene. Upotrijebi izvorni prikaz.',true);
      case 'pdf-run-3c':{
        const j=i%3;line(j===0?[0,L,0]:j===1?[0,L/2+9.15,L/2-9.15,L]:[0,L]);out.distance=[2*L,L+36.6,L][j];out.caption=['Run 1 · cijeli teren i natrag','Run 2 · preko rubova središnjeg kruga','Run 3 · cijeli teren'][j];out.note=(j===1?'Ruta 2 očitana je iz strelica crteža. ':'')+'PDF ne određuje broj ponavljanja i završni odmor; postavi ih prije treninga.';out.schematic=j===1;break;
      }
      case 'pdf-run-3d':return fall('Za shuttle tekst propisuje 1→2→1→3 uz 7 yd (6,4 m) između čunjeva. Ostale zone i trajanje imaju nejasnoće.',true);
      default:return fall('Za ovu vježbu nema potvrđene putanje. Postavi čunjeve prema provjerenoj uputi.');
    }
    return out;
  }
  function render(field, opts) {
    field=typeof field==='string'?{id:field}:field||{};opts=opts||{};
    let L=Number(opts.length||field.pitch_length_m||105),W=Number(opts.width||field.pitch_width_m||68),dimensionNote='';
    if(!Number.isFinite(L)||!Number.isFinite(W)||L<60||L>130||W<45||W>100){L=105;W=68;dimensionNote='Prikazane su zadane dimenzije 105 × 68 m; provjeri unesene dimenzije. ';}
    const R=routeFor(field,opts,L,W),id='pv-'+(++serial),width=640,px=48,py=84,scale=Math.min(548/L,366/W),pw=L*scale,ph=W*scale;
    const x=m=>px+m*scale,y=m=>py+m*scale,cy=W/2;
    const imageSrc=sourceImage(field),useImage=R.sourceOnly&&imageSrc;
    const title=field.code||field.name_hr||field.name||'Putanja treninga';
    let notes=dimensionNote+R.note;
    if(R.schematic&&!/^Shematski prikaz/.test(notes))notes='Shematski prikaz; provjeri postavke. '+notes;
    const footer=useImage?470:py+ph+62;
    const caption=R.caption||(useImage?'Izvorni prikaz iz STATSports PDF-a':'Postav terena');
    const caps=words(caption+(R.distance?' · '+(R.distanceLabel?R.distanceLabel+': ':'')+num(R.distance)+' m':''),58);
    const noteLines=words(notes,64);
    const H=Math.max(530,footer+caps.length*24+14+noteLines.length*24+22);
    let s='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="pitch-visual" viewBox="0 0 '+width+' '+H+'" role="img" aria-labelledby="'+id+'-title '+id+'-desc" style="width:100%;height:auto;display:block;border-radius:20px;background:#152B25;font-family:inherit">';
    s+='<title id="'+id+'-title">'+esc(title)+' — prikaz terena i putanje</title><desc id="'+id+'-desc">'+esc(caption+'. '+notes+(R.distance?' '+(R.distanceLabel||'Duljina prikazanog ponavljanja')+': '+num(R.distance)+' m.':''))+'</desc>';
    s+='<rect width="640" height="'+H+'" rx="20" fill="#152B25"/>';
    s+='<defs><marker id="'+id+'-dim" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#9DB2A8"/></marker>';
    ['work','jog','walk'].forEach(k=>s+='<marker id="'+id+'-'+k+'" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8Z" fill="'+C[k]+'"/></marker>');
    s+='</defs><style>#'+id+'-moving{display:block}#'+id+'-still{display:none}@media(prefers-reduced-motion:reduce){#'+id+'-moving{display:none}#'+id+'-still{display:block}}</style>';
    s+=text(28,31,words(title,49)[0],22,C.ink,'start','font-weight="650"');
    if(useImage){
      s+='<image href="'+esc(imageSrc)+'" xlink:href="'+esc(imageSrc)+'" x="24" y="62" width="592" height="376" preserveAspectRatio="xMidYMid meet"/>';
    } else {
      s+='<rect x="'+(px-12)+'" y="'+(py-12)+'" width="'+(pw+24)+'" height="'+(ph+24)+'" rx="10" fill="#234C3C"/>';
      for(let q=0;q<10;q++) s+='<rect x="'+(px+pw*q/10)+'" y="'+py+'" width="'+(pw/10)+'" height="'+ph+'" fill="'+(q%2?'#28553F':'#214A38')+'"/>';
      s+='<g fill="none" stroke="#CEE1D4" stroke-width="1.5" opacity=".85"><rect x="'+px+'" y="'+py+'" width="'+pw+'" height="'+ph+'"/><path d="M'+x(L/2)+' '+py+'V'+y(W)+'"/><circle cx="'+x(L/2)+'" cy="'+y(cy)+'" r="'+(9.15*scale)+'"/>';
      [false,true].forEach(right=>{
        const pX=right?L-16.5:0,gX=right?L-5.5:0;
        s+='<rect x="'+x(pX)+'" y="'+y(cy-20.16)+'" width="'+(16.5*scale)+'" height="'+(40.32*scale)+'"/><rect x="'+x(gX)+'" y="'+y(cy-9.16)+'" width="'+(5.5*scale)+'" height="'+(18.32*scale)+'"/>';
        s+='<rect x="'+(right?x(L):x(0)-6)+'" y="'+y(cy-3.66)+'" width="6" height="'+(7.32*scale)+'"/>';
        const a=Math.sqrt(9.15*9.15-5.5*5.5),ax=right?L-16.5:16.5;
        s+='<path d="M'+x(ax)+' '+y(cy-a)+' A'+(9.15*scale)+' '+(9.15*scale)+' 0 0 '+(right?0:1)+' '+x(ax)+' '+y(cy+a)+'"/>';
      });
      s+='</g><g fill="#CEE1D4"><circle cx="'+x(L/2)+'" cy="'+y(cy)+'" r="2.3"/><circle cx="'+x(11)+'" cy="'+y(cy)+'" r="2.3"/><circle cx="'+x(L-11)+'" cy="'+y(cy)+'" r="2.3"/></g>';
      s+='<path d="M'+px+' '+(py-25)+'H'+x(L)+'" fill="none" stroke="#9DB2A8" stroke-width="1.2" marker-start="url(#'+id+'-dim)" marker-end="url(#'+id+'-dim)"/>';
      s+='<rect x="'+(px+pw/2-42)+'" y="'+(py-40)+'" width="84" height="26" rx="8" fill="#152B25"/>'+text(px+pw/2,py-21,num(L)+' m',19,C.ink,'middle');
      s+='<path d="M'+(px-25)+' '+py+'V'+y(W)+'" fill="none" stroke="#9DB2A8" stroke-width="1.2" marker-start="url(#'+id+'-dim)" marker-end="url(#'+id+'-dim)"/>';
      s+=text(px-30,py+ph/2,num(W)+' m',18,C.ink,'middle','transform="rotate(-90 '+(px-30)+' '+(py+ph/2)+')"');
      s+=text(px,py+ph+28,'Šesnaesterac 16,5 m · peterac 5,5 m · krug r = 9,15 m',15,C.muted);
      if(!R.segments.length){
        s+='<rect x="'+(px+22)+'" y="'+(py+ph/2-45)+'" width="'+(pw-44)+'" height="90" rx="14" fill="#102C26" opacity=".95"/>';
        s+=text(px+pw/2,py+ph/2-7,'PUTANJA NIJE PRECIZIRANA',19,C.ink,'middle','font-weight="650"');
        s+=text(px+pw/2,py+ph/2+22,'Provjeri izvor i postavke dionice',17,C.muted,'middle');
      }else{
        const n=R.segments.length;
        R.segments.forEach((seg,k)=>{
          let p1=[x(seg.from[0]),y(seg.from[1])],p2=[x(seg.to[0]),y(seg.to[1])];
          if(R.lanes){const offset=(k-(n-1)/2)*13;p1[1]+=offset;p2[1]+=offset;}
          const col=C[seg.mode]||C.work;
          s+='<path d="M'+p1.join(' ')+'L'+p2.join(' ')+'" fill="none" stroke="#122D26" stroke-width="6" stroke-linecap="round"/>';
          s+='<path d="M'+p1.join(' ')+'L'+p2.join(' ')+'" fill="none" stroke="'+col+'" stroke-width="3.1" stroke-linecap="round" marker-end="url(#'+id+'-'+(seg.mode==='rest'?'walk':seg.mode)+')"/>';
          if(n>1){const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2; s+='<circle cx="'+mx+'" cy="'+my+'" r="10" fill="#13372C" stroke="'+col+'" stroke-width="1.4"/>'+text(mx,my+4,String(k+1),12,col,'middle','font-weight="700"');}
        });
        R.cones.forEach(p=>s+='<path d="M'+(x(p[0])-5)+' '+(y(p[1])+7)+'L'+x(p[0])+' '+(y(p[1])-4)+'L'+(x(p[0])+5)+' '+(y(p[1])+7)+'Z" fill="#F1E3A6" stroke="#26362B" stroke-width="1.2"/>');
        const first=R.segments[0].from,last=R.segments[n-1].to,same=first[0]===last[0]&&first[1]===last[1];
        const mark=(p,label,color,dy)=>{const X=x(p[0]),Y=y(p[1]),anchor=p[0]<L*.15?'start':p[0]>L*.85?'end':'middle';s+='<circle cx="'+X+'" cy="'+Y+'" r="5.5" fill="'+color+'" stroke="#FFF" stroke-width="1.5"/>';s+=text(X,Y+dy,label,16,C.ink,anchor,'font-weight="700" paint-order="stroke" stroke="#183B2D" stroke-width="4" stroke-linejoin="round"');};
        mark(first,same?'START / CILJ':'START','#EF816F',-(R.lanes?n*6.5+15:17));
        if(!same)mark(last,'CILJ','#7AD8B0',R.lanes?n*6.5+24:28);
        const path=R.segments.map((g,k)=>(k===0?'M':'L')+x(g.from[0])+','+y(g.from[1])+'L'+x(g.to[0])+','+y(g.to[1])).join(' ');
        const runner='<circle r="8" fill="#FFFFFF" stroke="#173B31" stroke-width="2"/><circle cy="-2.7" r="1.4" fill="#234F40"/><path d="M-1 0L1 1.5L3 -1M0 .5L-2 3M1 1.5L2 4" fill="none" stroke="#234F40" stroke-width="1.2" stroke-linecap="round"/>';
        if(opts.animate!==false){s+='<g id="'+id+'-moving">'+runner+'<animateMotion dur="'+Math.max(4,Math.min(16,n*2.1))+'s" repeatCount="indefinite" path="'+path+'" calcMode="paced"/></g>';s+='<g id="'+id+'-still" transform="translate('+x(first[0])+' '+y(first[1])+')">'+runner+'</g>';}
        else s+='<g transform="translate('+x(first[0])+' '+y(first[1])+')">'+runner+'</g>';
      }
    }
    caps.forEach((l,k)=>s+=text(28,footer+k*24,l,19,C.ink,'start','font-weight="600"'));
    const noteY=footer+caps.length*24+14;
    noteLines.forEach((l,k)=>s+=text(28,noteY+k*24,l,17,C.muted));
    s+='</svg>';
    return s;
  }
  global.PitchVisuals={render,describe:(field,options)=>routeFor(field||{},options||{},Number((options||{}).length||105),Number((options||{}).width||68))};
})(window);
