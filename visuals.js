/* Original code-native exercise diagrams. Schematic movement references, not motion capture. */
(function(root){
'use strict';
const V={};
const C={skin:'#d9c6ab',skin2:'#a89377',shirt:'#8fa9b3',shorts:'#3b4b59',shoe:'#e9e3d8',gear:'#65808c',gearHi:'#a7bec7',line:'#aab9be',accent:'#d7b894',bg:'#1d2530',muted:'#92a0aa'};
const copy=(p,o)=>Object.assign({},p,o||{});
const P=(h,s,p,k1,a1,k2,a2,e1,w1,e2,w2)=>({h,s,p,k1,a1,k2,a2,e1,w1,e2,w2});
const ST=P([195,52],[191,83],[184,147],[177,192],[169,233],[205,192],[212,233],[166,113],[163,146],[217,112],[220,145]);
const SQ=P([207,96],[197,126],[151,172],[211,181],[199,233],[179,190],[166,233],[224,143],[248,133],[211,155],[235,145]);
const HINGE=P([246,111],[219,127],[163,155],[178,194],[181,233],[197,191],[211,233],[218,166],[214,203],[237,160],[235,197]);
const SPLIT=P([185,77],[180,108],[171,167],[224,170],[237,233],[128,204],[95,231],[154,134],[157,163],[205,130],[209,161]);
const LUNGE=P([183,91],[179,122],[176,181],[231,184],[236,235],[137,228],[99,234],[157,145],[158,178],[203,148],[210,180]);
const SUP=P([78,213],[106,216],[182,218],[230,172],[270,233],[221,186],[254,233],[117,231],[151,237],[117,221],[148,228]);
const BR=P([78,214],[106,215],[181,168],[231,172],[270,233],[221,184],[254,233],[117,232],[151,237],[117,222],[148,228]);
const PRONE=P([91,156],[121,167],[214,187],[262,204],[309,222],[259,213],[305,232],[125,204],[147,238],[137,201],[163,233]);
const PLANK=P([84,158],[115,168],[208,187],[257,206],[305,232],[254,211],[296,235],[119,232],[155,234],[128,228],[166,231]);
const QUAD=P([101,126],[125,145],[216,148],[220,220],[272,232],[204,220],[258,231],[125,187],[129,235],[142,188],[147,231]);
const SIDE=P([81,164],[112,179],[201,196],[252,216],[307,235],[250,221],[299,236],[112,233],[151,235],[150,185],[185,174]);
const ROW=P([152,112],[170,135],[220,185],[261,211],[303,235],[252,216],[290,237],[194,114],[226,87],[205,124],[238,96]);
function add(key,label,a,b,equip,cue,opt){V[key]={key,label,a,b:b||a,equip:equip||'',cue:cue||'',opt:opt||{}};}
add('squat','Čučanj',copy(ST,{e1:[163,91],w1:[170,74],e2:[220,92],w2:[229,76]}),copy(SQ,{e1:[170,128],w1:[184,110],e2:[212,145],w2:[225,122]}),'backbar','Stabilno stopalo · kontrolirano spuštanje');
add('goblet-squat','Goblet čučanj',copy(ST,{e1:[170,112],w1:[203,99],e2:[220,113],w2:[203,99]}),copy(SQ,{e1:[182,151],w1:[218,140],e2:[224,165],w2:[218,140]}),'goblet','Uteg uz prsa · koljena prate stopala');
add('split-squat','Split čučanj',SPLIT,LUNGE,'dumbbells','Spuštanje između stopala');
add('bulgarian','Bugarski čučanj',copy(SPLIT,{k2:[122,176],a2:[91,183]}),copy(LUNGE,{k2:[127,218],a2:[91,183]}),'rearbench','Oslonac prednjeg stopala');
add('lateral-lunge','Bočni iskorak',copy(ST,{k1:[160,190],a1:[126,234],k2:[225,190],a2:[272,234],e1:[166,110],w1:[190,117],e2:[218,110],w2:[196,117]}),P([154,83],[159,115],[153,169],[121,190],[111,233],[222,207],[285,235],[139,143],[175,148],[188,138],[181,148]),'','Kuk unatrag · druga noga ispružena',{front:true});
add('step-up','Penjanje na povišenje',copy(ST,{h:[178,69],s:[178,100],p:[174,158],k1:[232,160],a1:[245,195],k2:[164,199],a2:[156,235]}),copy(ST,{h:[229,26],s:[225,57],p:[223,116],k1:[228,155],a1:[245,195],k2:[186,137],a2:[177,171]}),'step','Pritisni stopalom na povišenju');
add('step-down','Spuštanje s povišenja',copy(ST,{h:[207,31],s:[204,62],p:[204,121],k1:[211,156],a1:[215,195],k2:[175,153],a2:[171,197]}),copy(ST,{h:[197,61],s:[194,91],p:[189,147],k1:[216,166],a1:[215,195],k2:[157,188],a2:[142,231]}),'step-down','Spusti slobodnu petu · zdjelica mirna');
add('deadlift','Mrtvo dizanje',HINGE,ST,'barbell','Uteg blizu tijela · kuk i ramena zajedno');
add('rdl','Rumunjsko mrtvo dizanje',ST,HINGE,'barbell','Kuk unatrag · mekana koljena');
add('kb-deadlift','Mrtvo dizanje girjom',HINGE,copy(ST,{w1:[179,159],w2:[195,159]}),'kettlebell','Stopala čvrsto · girja između stopala');
add('single-rdl','Jednonožni RDL',copy(ST,{k2:[221,175],a2:[239,202]}),P([257,140],[229,147],[165,154],[168,193],[176,234],[113,151],[62,144],[231,178],[223,211],[244,173],[238,205]),'dumbbell-one','Zdjelica prema podu · oslonac na jednoj nozi');
add('hip-airplane','Hip airplane',P([265,137],[237,145],[172,152],[178,192],[182,233],[117,151],[65,150],[220,120],[195,100],[256,163],[282,184]),P([265,137],[237,145],[172,152],[178,192],[182,233],[117,135],[65,120],[217,167],[194,191],[258,119],[282,94]),'','Rotacija iz kuka uz kontrolu');
add('bridge','Most',SUP,BR,'mat','Podigni zdjelicu · rebra mirna');
add('single-bridge','Jednonožni most',copy(SUP,{k2:[219,176],a2:[260,139]}),copy(BR,{k2:[221,137],a2:[261,108]}),'mat','Radna peta na podu · zdjelica ravna');
add('hip-thrust','Hip thrust',P([84,140],[109,160],[185,204],[235,188],[266,235],[223,201],[251,237],[133,185],[175,203],[141,177],[187,203]),P([83,142],[108,159],[185,155],[241,174],[266,235],[228,184],[251,237],[139,158],[176,155],[141,153],[188,155]),'thrust','Lopatice na klupi · završetak u ravnoj liniji');
add('hamstring-roller','Pregib stražnje lože rolerom',P([70,211],[98,214],[170,199],[229,208],[294,221],[220,214],[285,227],[112,232],[147,237],[112,222],[146,229]),P([70,211],[98,214],[169,171],[208,151],[238,221],[200,161],[230,227],[112,232],[147,237],[112,222],[146,229]),'roller','Povuci pete · zadrži kukove podignute');
add('hamstring-ball','Pregib na velikoj lopti',P([66,210],[94,211],[165,181],[225,163],[291,159],[223,174],[281,167],[108,229],[140,234],[111,219],[143,226]),P([66,210],[94,211],[165,161],[204,115],[239,160],[192,126],[229,168],[108,229],[140,234],[111,219],[143,226]),'ball-feet','Pete na lopti · kontroliraj povratak');
add('hamstring-iso','Izometrija stražnje lože',P([68,212],[97,213],[166,188],[226,199],[286,227],[220,208],[277,232],[111,232],[145,237],[115,223],[149,228]),null,'mat','Pritisak petama · mirna zdjelica');
add('nordic','Potpomognuti Nordic',P([195,69],[194,100],[195,164],[198,230],[279,236],[210,232],[288,240],[177,128],[201,143],[216,125],[209,144]),P([105,145],[132,158],[164,193],[198,230],[279,236],[210,232],[288,240],[113,186],[104,220],[131,188],[129,224]),'nordic','Kontrolirano spuštanje · ruke za prihvat');
add('calf-raise','Podizanje na prste',ST,copy(ST,{h:[195,39],s:[191,70],p:[184,134],k1:[177,179],a1:[169,220],k2:[205,179],a2:[212,220]}),'calf','Podigni pete · kontroliran povratak');
add('soleus-raise','Sjedeće podizanje peta',P([177,64],[174,95],[169,165],[231,165],[238,233],[219,177],[224,235],[189,122],[230,150],[201,126],[224,158]),P([177,64],[174,95],[169,165],[231,154],[238,221],[219,165],[224,223],[189,122],[230,140],[201,126],[224,148]),'seated-calf','Koljeno savijeno · podizanje pete');
add('tibialis','Podizanje prednjeg dijela stopala',copy(ST,{h:[162,51],s:[166,82],p:[184,145],k1:[202,190],a1:[220,233],k2:[220,189],a2:[238,233]}),copy(ST,{h:[162,51],s:[166,82],p:[184,145],k1:[202,190],a1:[220,233],k2:[220,189],a2:[238,233]}),'wall-toe','Pete na podu · prste povuci prema sebi');
add('bench-press','Potisak s klupe',P([84,153],[111,160],[192,160],[233,191],[252,235],[223,199],[236,236],[137,191],[154,143],[137,171],[155,129]),P([84,153],[111,160],[192,160],[233,191],[252,235],[223,199],[236,236],[131,116],[152,76],[145,114],[162,75]),'bench-bar','Lopatice na klupi · stopala na podu');
add('push-up','Sklek',PRONE,copy(PRONE,{h:[91,197],s:[121,205],p:[214,216],k1:[262,224],k2:[259,230],e1:[151,207],w1:[147,238],e2:[163,201],w2:[163,233]}),'mat','Tijelo u ravnoj liniji');
add('overhead-press','Potisak iznad glave',copy(ST,{e1:[162,105],w1:[170,72],e2:[222,105],w2:[232,72]}),copy(ST,{e1:[171,58],w1:[170,25],e2:[219,57],w2:[232,25]}),'overhead-bar','Rebra mirna · potisak iznad ramena');
add('pull-up','Zgib',P([201,110],[200,139],[199,192],[218,220],[260,229],[205,225],[247,236],[162,92],[146,48],[239,92],[256,48]),P([201,44],[200,73],[199,128],[218,165],[260,174],[205,170],[247,181],[163,83],[146,48],[238,82],[256,48]),'rack','Kontroliran povratak · bez zamaha');
add('row','Veslanje u pretklonu',HINGE,copy(HINGE,{e1:[167,156],w1:[197,147],e2:[189,154],w2:[216,146]}),'barbell','Povuci prema donjim rebrima');
add('landmine-press','Landmine potisak',copy(SPLIT,{h:[196,57],s:[191,87],p:[185,148],k1:[233,172],a1:[252,235],k2:[160,230],a2:[112,235],e1:[211,122],w1:[224,88],e2:[177,124],w2:[177,158]}),copy(SPLIT,{h:[196,57],s:[191,87],p:[185,148],k1:[233,172],a1:[252,235],k2:[160,230],a2:[112,235],e1:[225,71],w1:[260,48],e2:[177,124],w2:[177,158]}),'landmine','Stabilan trup · potisak u luku');
add('landmine-row','Jednoručno landmine veslanje',copy(HINGE,{e2:[193,147],w2:[180,181]}),copy(HINGE,{e1:[168,151],w1:[196,148],e2:[193,147],w2:[180,181]}),'landmine-one-row','Kuk u pregibu · povuci ručku');
add('landmine-squat','Landmine čučanj',copy(ST,{e1:[174,110],w1:[217,100],e2:[216,119],w2:[217,100]}),copy(SQ,{e1:[188,147],w1:[226,139],e2:[222,159],w2:[226,139]}),'landmine','Drži kraj šipke uz prsa');
add('landmine-rotation','Landmine rotacija',copy(ST,{e1:[144,109],w1:[125,138],e2:[163,122],w2:[125,138],k1:[163,193],a1:[145,234],k2:[219,193],a2:[244,234]}),copy(ST,{e1:[224,120],w1:[266,138],e2:[245,109],w2:[266,138],k1:[163,193],a1:[145,234],k2:[219,193],a2:[244,234]}),'landmine-front','Rotiraj stopala i kukove zajedno',{front:true});
add('kettlebell-swing','Zamah girjom',copy(HINGE,{e1:[188,170],w1:[162,195],e2:[205,168],w2:[174,195]}),copy(ST,{e1:[234,91],w1:[278,94],e2:[239,101],w2:[280,105]}),'kettlebell','Pogon iz kukova · ruke prate');
add('farmer-carry','Nošenje utega',copy(ST,{k1:[165,190],a1:[152,232],k2:[215,189],a2:[230,227]}),copy(ST,{k1:[210,189],a1:[226,227],k2:[168,190],a2:[155,232]}),'dumbbells','Uspravan trup · mirni koraci');
add('suitcase-carry','Jednostrano nošenje',copy(ST,{k1:[165,190],a1:[152,232],k2:[215,189],a2:[230,227]}),copy(ST,{k1:[210,189],a1:[226,227],k2:[168,190],a2:[155,232]}),'dumbbell-one','Bez naginjanja prema utegu');
add('pallof','Pallof potisak',copy(ST,{e1:[168,109],w1:[198,111],e2:[218,109],w2:[198,111]}),copy(ST,{e1:[227,100],w1:[266,108],e2:[239,111],w2:[266,108]}),'band-side','Odupri se rotaciji trupa');
add('dead-bug','Dead bug',P([73,216],[101,216],[181,217],[184,159],[241,157],[198,167],[252,167],[113,172],[125,126],[130,172],[146,126]),P([73,216],[101,216],[181,217],[230,214],[286,219],[198,167],[252,167],[69,207],[25,201],[130,172],[146,126]),'mat','Suprotna ruka i noga · miran trup');
add('bird-dog','Bird dog',QUAD,copy(QUAD,{e1:[92,142],w1:[51,138],k2:[260,148],a2:[310,146]}),'mat','Dosegni · bez rotacije zdjelice');
add('plank','Plank',PLANK,null,'mat','Rebra i zdjelica u ravnini · diši');
add('side-plank','Bočni plank',SIDE,null,'mat','Podigni kuk · rame iznad lakta');
add('side-plank-leg','Bočni plank s odnoženjem',SIDE,copy(SIDE,{k2:[245,151],a2:[294,121]}),'mat','Stabilan donji kuk · gornja noga gore');
add('copenhagen-short','Kopenhagen · kratka poluga',copy(SIDE,{p:[196,177],k1:[248,153],a1:[300,176],k2:[239,213],a2:[281,231]}),copy(SIDE,{p:[196,177],k1:[248,153],a1:[300,176],k2:[239,173],a2:[281,190]}),'copenhagen-short','Gornje koljeno oslonjeno na klupu');
add('copenhagen-long','Kopenhagen · duga poluga',copy(SIDE,{p:[196,164],k1:[251,153],a1:[308,150],k2:[242,205],a2:[287,231]}),copy(SIDE,{p:[196,164],k1:[251,153],a1:[308,150],k2:[247,165],a2:[299,161]}),'copenhagen-long','Gornji gležanj na klupi · zdjelica gore');
add('clamshell','Školjka',P([81,179],[109,196],[190,209],[236,234],[288,219],[230,222],[279,213],[102,226],[143,238],[140,215],[180,215]),P([81,179],[109,196],[190,209],[236,234],[288,219],[231,168],[279,213],[102,226],[143,238],[140,215],[180,215]),'miniband-knees','Pete zajedno · zdjelica mirna');
add('side-abduction','Bočno podizanje noge',P([77,174],[104,191],[190,210],[241,220],[297,233],[242,208],[300,216],[102,222],[140,237],[141,208],[180,210]),P([77,174],[104,191],[190,210],[241,220],[297,233],[242,169],[292,132],[102,222],[140,237],[141,208],[180,210]),'mat','Podigni gornju nogu bez rotacije trupa');
add('side-adduction','Bočno privlačenje noge',P([76,175],[103,191],[184,208],[236,223],[294,234],[229,191],[230,235],[103,224],[141,237],[140,209],[180,210]),P([76,175],[103,191],[184,208],[236,200],[294,190],[229,191],[230,235],[103,224],[141,237],[140,209],[180,210]),'mat','Donja noga se podiže · druga kao oslonac');
add('band-walk','Bočno hodanje s trakom',copy(SQ,{h:[195,87],s:[193,117],p:[190,169],k1:[162,193],a1:[149,235],k2:[216,193],a2:[229,235]}),copy(SQ,{h:[218,87],s:[216,117],p:[213,169],k1:[181,193],a1:[164,235],k2:[254,193],a2:[273,235]}),'miniband-knees','Mali koraci · traka stalno napeta',{front:true});
add('hip-abduction','Odnoženje uz otpor',ST,copy(ST,{k2:[240,178],a2:[282,209]}),'low-cord-left','Odmakni nogu · trup uspravan',{front:true});
add('hip-adduction','Privlačenje uz otpor',copy(ST,{k2:[240,178],a2:[282,209]}),copy(ST,{k2:[176,190],a2:[152,232]}),'low-cord','Privuci radnu nogu preko sredine',{front:true});
add('hip-flexion','Fleksija kuka uz otpor',ST,copy(ST,{k2:[252,151],a2:[288,187]}),'cord-rear','Noga naprijed · zdjelica mirna');
add('hip-extension','Ekstenzija kuka uz otpor',ST,copy(ST,{k2:[147,177],a2:[111,213]}),'low-cord','Noga unatrag · bez izvijanja leđa');
add('hip-circle','Kruženje kukom',copy(ST,{k2:[245,153],a2:[282,188]}),copy(ST,{k2:[236,177],a2:[274,218]}),'low-cord','Kontroliran krug u ugodnom rasponu',{front:true});
add('leg-swing','Njihanje noge',copy(ST,{k2:[145,180],a2:[99,213]}),copy(ST,{k2:[248,162],a2:[292,187]}),'low-cord','Postupno povećaj raspon');
add('scissors','Recipročni pokret nogu',copy(ST,{k1:[152,181],a1:[122,223],k2:[238,183],a2:[270,224]}),copy(ST,{k1:[234,182],a1:[263,222],k2:[157,185],a2:[125,225]}),'low-cord','Naizmjeničan rad · oslonac rukom');
add('hip-90-90','90/90 kukovi',P([194,78],[191,108],[187,173],[235,210],[292,211],[140,211],[131,238],[161,144],[137,190],[221,144],[248,191]),P([194,78],[191,108],[187,173],[236,211],[247,239],[141,210],[84,211],[161,144],[137,190],[221,144],[248,191]),'mat','Oba koljena pod kontrolom · ne forsiraj',{front:true});
add('hip-flexor-stretch','Istezanje pregibača kuka',copy(SPLIT,{k2:[145,234],a2:[92,237],e1:[168,138],w1:[196,156],e2:[210,139],w2:[225,158]}),copy(SPLIT,{h:[199,77],s:[194,108],p:[185,166],k1:[238,170],a1:[246,234],k2:[145,234],a2:[92,237],e1:[182,138],w1:[209,156],e2:[224,139],w2:[237,158]}),'mat','Blagi pomak zdjelice · bez izvijanja');
add('figure-four','Figure-4',copy(SUP,{k1:[191,153],a1:[249,178],k2:[235,145],a2:[202,171],e1:[135,188],w1:[181,174],e2:[145,183],w2:[192,169]}),null,'mat','Gležanj preko koljena · ugodno istezanje');
add('adductor-rock','Njihanje aduktora',copy(QUAD,{k2:[266,182],a2:[320,230]}),copy(QUAD,{h:[137,148],s:[163,164],p:[232,188],k1:[220,220],a1:[272,232],k2:[279,202],a2:[320,230],e1:[145,199],w1:[129,235],e2:[163,200],w2:[147,231]}),'mat','Jedna noga u stranu · kukovi natrag');
add('quadruped-rock','Njihanje na sve četiri',QUAD,copy(QUAD,{h:[144,145],s:[165,167],p:[242,202],e1:[148,201],e2:[167,200]}),'mat','Pomak iz kukova · neutralna leđa');
add('heel-slide','Klizanje pete',copy(SUP,{k1:[237,220],a1:[296,232],k2:[229,226],a2:[286,235]}),SUP,'mat','Peta ostaje na podlozi');
add('balance-reach','Ravnoteža s dosezanjem',copy(ST,{k2:[225,172],a2:[245,197]}),copy(SQ,{h:[212,88],s:[199,118],p:[165,164],k1:[193,194],a1:[192,235],k2:[243,195],a2:[295,232]}),'reach','Stajna noga kontrolira zdjelicu');
add('thoracic-rotation','Torakalna rotacija',copy(QUAD,{e2:[101,142],w2:[108,121]}),copy(QUAD,{e2:[150,100],w2:[109,121]}),'mat','Rotacija prsnog dijela · kukovi mirni');
add('open-book','Otvaranje knjige',P([83,176],[111,192],[190,208],[232,230],[284,215],[223,221],[272,209],[144,207],[181,225],[144,207],[181,225]),P([83,176],[111,192],[190,208],[232,230],[284,215],[223,221],[272,209],[144,207],[181,225],[107,149],[105,106]),'mat','Koljena zajedno · gornja ruka otvara prsa');
add('ankle-rock','Mobilnost gležnja',copy(SPLIT,{h:[199,84],s:[196,114],p:[174,172],k1:[238,179],a1:[249,235],k2:[147,235],a2:[98,238],e1:[217,148],w1:[249,169],e2:[227,147],w2:[258,167]}),copy(SPLIT,{h:[214,86],s:[210,117],p:[184,177],k1:[262,180],a1:[249,235],k2:[147,235],a2:[98,238],e1:[230,150],w1:[268,171],e2:[239,149],w2:[279,168]}),'ankle-wall','Koljeno naprijed · peta na podu');
add('adductor-squeeze','Stisak lopte koljenima',SUP,null,'small-ball','Ujednačen pritisak · normalno disanje');
add('trx-row','TRX veslanje',ROW,P([198,72],[208,102],[245,165],[274,201],[303,235],[265,209],[290,237],[184,123],[224,94],[207,130],[236,102]),'trx-hands','Tijelo ravno · povuci prsa prema ručkama');
add('trx-high-row','TRX visoko veslanje',ROW,P([198,72],[208,102],[245,165],[274,201],[303,235],[265,209],[290,237],[175,87],[224,75],[235,83],[244,75]),'trx-hands','Laktovi više · ramena bez podizanja');
add('trx-press','TRX potisak',P([226,83],[215,113],[180,171],[155,202],[133,235],[169,205],[147,237],[247,141],[266,173],[252,132],[278,164]),P([260,133],[239,153],[189,190],[161,214],[133,235],[174,218],[147,237],[248,192],[266,173],[264,184],[278,164]),'trx-away','Lice od sidra · čvrst trup');
add('trx-squat','TRX potpomognuti čučanj',copy(ST,{e1:[219,108],w1:[249,105],e2:[227,116],w2:[259,113]}),copy(SQ,{e1:[232,130],w1:[271,114],e2:[239,142],w2:[281,126]}),'trx-hands','Koristi ručke za ravnotežu');
add('trx-lunge','TRX iskorak unatrag',copy(SPLIT,{e1:[210,109],w1:[243,105],e2:[215,122],w2:[252,116]}),copy(LUNGE,{e1:[209,128],w1:[248,115],e2:[218,141],w2:[260,127]}),'trx-hands','Oslonac kroz prednje stopalo');
add('trx-single-squat','TRX jednonožni čučanj',copy(ST,{e1:[220,102],w1:[256,103],e2:[230,114],w2:[266,114],k2:[241,182],a2:[270,204]}),copy(SQ,{e1:[229,126],w1:[266,109],e2:[240,138],w2:[276,120],k1:[191,190],a1:[180,234],k2:[240,175],a2:[296,183]}),'trx-hands','Ručke pomažu · jedna noga nosi');
add('trx-lateral-lunge','TRX bočni iskorak',copy(ST,{k1:[160,190],a1:[126,234],k2:[225,190],a2:[272,234],e1:[172,101],w1:[199,88],e2:[213,102],w2:[213,88]}),P([151,83],[159,115],[153,169],[121,190],[111,233],[222,207],[285,235],[170,103],[210,88],[184,115],[224,99]),'trx-front','Kuk prema radnoj nozi · kontrola koljena',{front:true});
add('trx-y','TRX Y podizanje',ROW,P([213,69],[214,100],[244,163],[272,202],[303,235],[262,208],[290,237],[180,75],[147,47],[250,69],[274,41]),'trx-hands','Ruke u Y · mali kontrolirani nagib');
add('trx-t','TRX T podizanje',ROW,P([213,69],[214,100],[244,163],[272,202],[303,235],[262,208],[290,237],[175,100],[133,101],[254,101],[295,101]),'trx-hands','Ruke u T · kontrola lopatica');
add('trx-curl','TRX pregib stražnje lože',V['hamstring-roller'].a,V['hamstring-roller'].b,'trx-feet','Pete u omčama · povuci pete prema sebi');
add('trx-single-curl','TRX jednonožni pregib',copy(V['hamstring-roller'].a,{k2:[207,155],a2:[245,117]}),copy(V['hamstring-roller'].b,{k2:[196,126],a2:[235,87]}),'trx-foot','Jedna peta u omči · kukovi ravni');
add('trx-bridge','TRX most',copy(V['hamstring-roller'].a,{p:[169,220]}),V['hamstring-roller'].a,'trx-feet','Pete u omčama · podigni kukove');
add('trx-plank','TRX plank',copy(PLANK,{a1:[305,203],a2:[297,210],k1:[258,194],k2:[253,201]}),null,'trx-feet','Stopala u omčama · laktovi ispod ramena');
add('trx-push-up','TRX sklek',copy(PRONE,{a1:[309,203],a2:[301,210],k1:[262,195],k2:[257,202]}),copy(V['push-up'].b,{a1:[309,203],a2:[301,210],k1:[262,211],k2:[257,218]}),'trx-feet','Stopala vise · čvrst položaj trupa');
add('trx-knee-tuck','TRX privlačenje koljena',copy(PRONE,{a1:[309,203],a2:[301,210],k1:[262,195],k2:[257,202]}),copy(PRONE,{p:[195,163],k1:[177,210],a1:[242,214],k2:[184,217],a2:[249,222]}),'trx-feet','Koljena prema prsima · bez propadanja');
add('trx-body-saw','TRX body saw',copy(PLANK,{a1:[305,203],a2:[297,210],k1:[258,194],k2:[253,201]}),copy(PLANK,{h:[105,158],s:[136,168],p:[229,187],a1:[325,203],a2:[317,210],k1:[278,194],k2:[273,201]}),'trx-feet','Mali pomak tijela · neutralan trup');
add('trx-fallout','TRX fallout',P([216,65],[212,96],[192,159],[179,198],[161,235],[194,201],[177,237],[245,101],[280,110],[251,113],[288,122]),P([271,112],[245,132],[206,174],[182,207],[161,235],[196,210],[177,237],[278,102],[312,70],[284,117],[324,85]),'trx-away','Ruke naprijed · trup bez izvijanja');
add('trx-power-pull','TRX power pull',copy(ROW,{e2:[138,162],w2:[105,189]}),copy(V['trx-row'].b,{e2:[244,81],w2:[275,60]}),'trx-one','Kontrolirana rotacija · jedna ručka');
add('box-jump','Skok na kutiju',copy(SQ,{h:[139,93],s:[131,122],p:[104,166],k1:[144,189],a1:[126,234],k2:[121,196],a2:[103,235],e1:[101,147],w1:[72,175],e2:[111,155],w2:[85,181]}),P([262,55],[251,84],[221,132],[264,143],[263,184],[246,156],[245,184],[278,103],[303,88],[269,116],[293,104]),'box','Tih doskok · siđi korakom');
add('drop-landing','Doskok s niskog povišenja',copy(ST,{h:[133,15],s:[129,46],p:[122,108],k1:[115,152],a1:[107,194],k2:[143,152],a2:[150,194],e1:[105,80],w1:[101,112],e2:[156,79],w2:[159,111]}),copy(SQ,{h:[249,96],s:[239,126],p:[193,172],k1:[253,181],a1:[241,233],k2:[221,190],a2:[208,233],e1:[266,143],w1:[290,133],e2:[253,155],w2:[277,145]}),'dropbox','Meko prihvati · zaustavi položaj');
add('pogo','Niski poskoci',ST,copy(ST,{h:[195,31],s:[191,62],p:[184,126],k1:[177,171],a1:[169,212],k2:[205,171],a2:[212,212],e1:[166,92],w1:[163,125],e2:[217,91],w2:[220,124]}),'','Kratak kontakt · mali odraz');
add('lateral-hop','Bočni preskok',copy(ST,{h:[154,54],s:[154,85],p:[151,148],k1:[144,192],a1:[140,234],k2:[180,175],a2:[195,208],e1:[128,113],w1:[115,146],e2:[184,107],w2:[209,128]}),copy(ST,{h:[254,54],s:[254,85],p:[251,148],k1:[244,192],a1:[240,234],k2:[280,175],a2:[295,208],e1:[228,113],w1:[215,146],e2:[284,107],w2:[309,128]}),'hopline','Doskoči i zadrži kontrolu');
add('broad-jump','Skok u dalj',copy(V['box-jump'].a,{h:[118,93],s:[110,122],p:[83,166],k1:[123,189],a1:[105,234],k2:[100,196],a2:[82,235]}),copy(SQ,{h:[301,96],s:[291,126],p:[245,172],k1:[305,181],a1:[293,233],k2:[273,190],a2:[260,233],e1:[318,143],w1:[342,133],e2:[305,155],w2:[329,145]}),'jumpmarks','Doskok na oba stopala · kontrola');
add('snap-down','Brzo spuštanje u stav',copy(ST,{e1:[167,55],w1:[152,25],e2:[222,55],w2:[237,25],h:[195,41],s:[191,72],p:[184,136],k1:[177,181],a1:[169,222],k2:[205,181],a2:[212,222]}),SQ,'','Brz prijelaz u stabilan niski stav');
add('medicine-slam','Bacanje medicinke o pod',copy(ST,{e1:[171,54],w1:[202,26],e2:[229,54],w2:[202,26]}),copy(HINGE,{e1:[238,163],w1:[259,194],e2:[250,158],w2:[268,189]}),'medball','Bacanje prema podu · siguran prostor');
add('medicine-rotation','Rotacijsko bacanje medicinke',copy(ST,{e1:[142,109],w1:[129,138],e2:[172,124],w2:[140,138],k1:[164,192],a1:[141,235],k2:[220,191],a2:[249,235]}),copy(ST,{e1:[232,102],w1:[278,107],e2:[245,113],w2:[288,117],k1:[164,192],a1:[141,235],k2:[220,191],a2:[249,235]}),'medball','Pokret stopala i kukova · baci u zid',{front:true});
add('medicine-chest','Bacanje medicinke s prsa',copy(ST,{e1:[167,113],w1:[210,101],e2:[226,117],w2:[210,101]}),copy(ST,{e1:[239,94],w1:[282,92],e2:[249,109],w2:[290,108]}),'medball','Snažan potisak · prostor ispred slobodan');
add('band-pull-apart','Razvlačenje trake',copy(ST,{e1:[169,99],w1:[183,104],e2:[215,99],w2:[204,104]}),copy(ST,{e1:[144,92],w1:[102,93],e2:[240,92],w2:[283,93]}),'band-hands','Lopatice pod kontrolom · ramena dolje',{front:true});
add('bike','Bicikl intervali',P([201,71],[182,95],[154,158],[214,167],[212,211],[178,194],[137,208],[211,111],[245,120],[211,124],[245,130]),P([201,71],[182,95],[154,158],[180,194],[137,208],[214,167],[212,211],[211,111],[245,120],[211,124],[245,130]),'bike','Jednoliko okretanje · intenzitet prema planu');

add('glute-set','Izometrijsko stezanje stražnjice',SUP,null,'mat','Stisni stražnjicu bez podizanja zdjelice');
add('wall-abduction','Izometrijska abdukcija uz zid',copy(ST,{h:[218,52],s:[214,83],p:[207,147],k1:[200,192],a1:[192,233],k2:[259,158],a2:[252,207],e1:[189,113],w1:[186,146],e2:[241,112],w2:[260,134]}),null,'wall-side','Pritisni vanjsku stranu koljena u zid');
add('ab-wheel','Klečeće izvaljivanje rolerom',P([191,86],[181,115],[170,172],[195,232],[260,235],[207,234],[271,238],[214,146],[243,179],[224,151],[255,182]),P([260,163],[232,177],[183,201],[195,232],[260,235],[207,234],[271,238],[273,196],[309,228],[282,202],[321,231]),'ab-roller','Koljeno na podlozi · samo kontroliran raspon');
add('trap-bar','Trap bar mrtvo dizanje',HINGE,ST,'trapbar','Neutralan hvat · kuk i ramena zajedno');
// Equipment and position variants are separate drawings, never a relabeled picture.
add('front-squat','Prednji čučanj',copy(ST,{e1:[231,83],w1:[198,79],e2:[240,92],w2:[209,88]}),copy(SQ,{e1:[240,123],w1:[205,121],e2:[247,133],w2:[214,130]}),'frontbar','Laktovi naprijed · šipka na prednjem ramenu');
add('box-squat','Čučanj do kutije',copy(V.squat.a),copy(V.squat.b),'boxsquat','Dotakni kutiju · zadrži kontrolu');
add('dumbbell-rdl','RDL s bučicama',ST,HINGE,'dumbbells','Kuk unatrag · bučice uz noge');
add('landmine-rdl','Landmine RDL',copy(ST,{w1:[205,151],w2:[219,152]}),copy(HINGE,{w1:[226,202],w2:[237,201]}),'landmine-row','Pregib iz kukova · kraj šipke blizu tijela');
add('single-roller','Jednonožni pregib na roleru',copy(V['hamstring-roller'].a,{k2:[207,155],a2:[245,117]}),copy(V['hamstring-roller'].b,{k2:[196,126],a2:[235,87]}),'roller-single','Jedna peta na roleru · zdjelica mirna');
add('ball-bridge','Most s petama na lopti',copy(V['hamstring-ball'].a,{p:[165,218]}),V['hamstring-ball'].a,'ball-feet','Koljena ispružena · podigni kukove');
add('dumbbell-bench','Potisak bučicama na klupi',V['bench-press'].a,V['bench-press'].b,'bench-dumbbell','Lopatice oslonjene · oba utega pod kontrolom');
add('incline-bench','Potisak na kosoj klupi',P([129,96],[149,120],[199,166],[245,190],[259,234],[231,199],[246,237],[169,155],[190,113],[174,137],[200,101]),P([129,96],[149,120],[199,166],[245,190],[259,234],[231,199],[246,237],[172,80],[194,45],[185,80],[209,46]),'incline-dumbbell','Leđa na naslonu · stopala čvrsto');
add('dumbbell-overhead','Potisak bučicama iznad glave',V['overhead-press'].a,V['overhead-press'].b,'dumbbells','Potisni oba utega · kontroliraj rebra');
add('dumbbell-row','Jednoručno veslanje uz klupu',P([252,107],[225,122],[156,148],[164,189],[172,233],[118,182],[82,179],[223,163],[218,204],[255,157],[279,185]),P([252,107],[225,122],[156,148],[164,189],[172,233],[118,182],[82,179],[174,148],[203,147],[255,157],[279,185]),'row-bench','Slobodna ruka i koljeno na klupi');
add('incline-push-up','Sklek na povišenju',P([116,109],[140,132],[222,177],[263,204],[306,232],[259,212],[298,235],[129,169],[116,201],[145,174],[136,201]),P([95,158],[120,174],[215,205],[262,221],[306,232],[258,226],[298,235],[147,181],[116,201],[165,181],[136,201]),'pushup-bench','Dlanovi na klupi · trup u liniji');
add('band-pull-up','Zgib uz pomoć gume',V['pull-up'].a,V['pull-up'].b,'rack-band','Guma pod koljenom · kontroliraj povratak');
add('single-calf','Jednonožno podizanje na prste',copy(ST,{k2:[225,175],a2:[251,199]}),copy(V['calf-raise'].b,{k2:[225,162],a2:[251,186]}),'calf','Stajna peta gore · druga noga slobodna',{calf:true,single:true});
add('landmine-standing-press','Landmine potisak iz stava',copy(ST,{h:[194,59],s:[189,90],p:[181,151],k1:[155,193],a1:[136,234],k2:[222,192],a2:[252,235],e1:[215,120],w1:[230,86],e2:[174,126],w2:[171,157]}),copy(ST,{h:[201,53],s:[197,84],p:[190,145],k1:[166,192],a1:[146,234],k2:[223,190],a2:[252,235],e1:[235,69],w1:[273,47],e2:[177,122],w2:[171,157]}),'landmine','Rotiraj kroz stopalo i kuk · kontroliran potisak');
add('pallof-kneeling','Pallof iz polukleka',copy(V['landmine-press'].a,{e1:[167,117],w1:[196,113],e2:[217,117],w2:[196,113]}),copy(V['landmine-press'].a,{e1:[227,107],w1:[265,113],e2:[238,120],w2:[265,113]}),'band-side','Poluklek stabilan · odupri se rotaciji');
add('lat-ladder','Istezanje uz švedske ljestve',P([209,121],[187,140],[130,178],[145,207],[165,234],[176,206],[201,236],[222,118],[255,95],[229,129],[269,108]),null,'ladder','Hvat iznad ramena · kukove odmakni natrag');
add('high-knee','Visoko koljeno uz otpor',ST,copy(ST,{k2:[252,144],a2:[254,201]}),'cord-rear','Koljeno gore · trup uspravan');
add('lateral-leg-swing','Bočno njihanje noge',copy(ST,{k2:[157,180],a2:[113,211],e1:[160,104],w1:[127,96]}),copy(ST,{k2:[247,177],a2:[292,207],e1:[160,104],w1:[127,96]}),'support-cord','Njihanje preko sredine i u stranu',{front:true});
add('free-leg-swing','Zamah noge uz oslonac',copy(V['leg-swing'].a,{e1:[167,104],w1:[136,95]}),copy(V['leg-swing'].b,{e1:[167,104],w1:[136,95]}),'support','Slobodna noga naprijed i natrag');
add('supported-airplane','Hip airplane uz oslonac',copy(V['hip-airplane'].a,{e1:[257,178],w1:[287,208]}),copy(V['hip-airplane'].b,{e1:[257,178],w1:[287,208]}),'support-airplane','Pridrži se · rotiraj zdjelicu kroz stajni kuk');
add('scissors','Recipročne škare na leđima',P([72,214],[101,216],[181,219],[227,174],[269,126],[239,214],[298,215],[117,232],[151,237],[117,222],[148,228]),P([72,214],[101,216],[181,219],[239,214],[298,215],[227,174],[269,126],[117,232],[151,237],[117,222],[148,228]),'supine-cords','Leđa oslonjena · naizmjeničan pokret nogu');
add('trx-bridge-single','TRX jednonožni most',copy(V['trx-bridge'].a,{k2:[207,155],a2:[245,117]}),copy(V['trx-bridge'].b,{k2:[207,145],a2:[245,107]}),'trx-foot','Jedna peta u omči · druga noga slobodna');
add('squat-jump','Skok iz čučnja',SQ,copy(ST,{h:[195,31],s:[191,62],p:[184,126],k1:[177,171],a1:[169,212],k2:[205,171],a2:[212,212],e1:[219,80],w1:[245,56],e2:[231,90],w2:[255,67]}),'','Kontroliran odraz i tih doskok');
V['calf-raise'].opt.calf=true;V['soleus-raise'].opt.calf=true;V.tibialis.opt.toeRaise=true;
add('lateral-step-up','Bočno penjanje na povišenje',P([151,68],[151,99],[151,159],[138,199],[125,235],[218,159],[224,195],[125,127],[119,160],[177,124],[190,149]),P([220,27],[220,58],[220,122],[184,155],[173,181],[227,159],[224,195],[194,86],[183,113],[247,85],[258,113]),'step','Radna noga na kutiji · podigni se bočno',{front:true});
const VARIANTS={
 'step-up:lateral':'lateral-step-up',
 'squat:front-rack':'front-squat','squat:back-rack':'squat','squat:box-touch':'box-squat',
 'rdl:dumbbell':'dumbbell-rdl','rdl:landmine':'landmine-rdl',
 'hamstring-roller:single-leg':'single-roller','hamstring-ball:bridge-static':'ball-bridge','hamstring-ball:static-bridge':'ball-bridge',
 'bench-press:barbell':'bench-press','bench-press:dumbbell-flat':'dumbbell-bench','bench-press:dumbbell-incline':'incline-bench',
 'calf-raise:single-leg':'single-calf','overhead-press:dumbbell':'dumbbell-overhead','push-up:incline':'incline-push-up','pull-up:band-assisted':'band-pull-up','row:dumbbell-supported':'dumbbell-row',
 'landmine-press:standing-rotation':'landmine-standing-press','pallof:half-kneeling':'pallof-kneeling','hip-airplane:supported':'supported-airplane','hip-flexion:high-knee':'high-knee','leg-swing:lateral':'lateral-leg-swing','leg-swing:unloaded':'free-leg-swing'
};

const ALIAS={
 'hamstring-roller-eccentric':'hamstring-roller','lateral-bound':'lateral-hop','glute-set':'bridge','glute-squeeze':'glute-set','wall-abduction':'hip-abduction','hip-isometric':'wall-abduction','trx-bridge-single':'trx-single-curl','trx-single-leg-squat':'trx-single-squat','trx-chest-press':'trx-press','trx-hamstring-curl':'trx-curl','trx-low-row':'trx-row','trx-y-raise':'trx-y','trx-reverse-lunge':'trx-lunge','trx-assisted-squat':'trx-squat','ab-wheel':'trx-fallout','squat-jump':'pogo','countermovement-jump':'squat-jump','medball-slam':'medicine-slam','medball-rotation':'medicine-rotation','medball-chest':'medicine-chest','hip-adductor-squeeze':'adductor-squeeze','t-spine-rotation':'thoracic-rotation','heel-raise':'calf-raise','seated-calf':'soleus-raise','single-leg-rdl':'single-rdl','romanian-deadlift':'rdl','barbell-squat':'squat','dumbbell-row':'row','trap-bar':'deadlift','walking-lunge':'split-squat','reverse-lunge':'split-squat','side-lying-abduction':'side-abduction','side-lying-adduction':'side-adduction','hip-flexor':'hip-flexor-stretch','skoljka':'clamshell','90-90':'hip-90-90','most':'bridge','jednonozni-most':'single-bridge','bugarski':'bulgarian','kopenhagen-kratka':'copenhagen-short','kopenhagen-duga':'copenhagen-long'
};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let serial=0;
function avg(a,b){return[(a[0]+b[0])/2,(a[1]+b[1])/2];}
function shift(a,x,y){return[a[0]+x,a[1]+y];}
function values(a,b){return a+';'+a+';'+b+';'+b+';'+a;}
function anim(name,a,b,on,dur){if(!on||String(a)===String(b))return'';return'<animate attributeName="'+name+'" values="'+values(a,b)+'" keyTimes="0;0.16;0.50;0.66;1" dur="'+dur+'s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1"/>';}
function shape(tag,a,b,on,dur){let s='<'+tag;for(const k in a)s+=' '+k+'="'+esc(a[k])+'"';s+='>';if(b)for(const k in b)s+=anim(k,a[k],b[k],on,dur);return s+'</'+tag+'>';}
function line(a,b,a2,b2,color,w,on,dur,extra){return shape('line',Object.assign({x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:color,'stroke-width':w,'stroke-linecap':'round'},extra||{}),{x1:a2[0],y1:a2[1],x2:b2[0],y2:b2[1]},on,dur);}
function dot(a,b,r,color,on,dur){return shape('circle',{cx:a[0],cy:a[1],r,fill:color},{cx:b[0],cy:b[1]},on,dur);}
function torso(p,front){let s=p.s,h=p.p,dx=h[0]-s[0],dy=h[1]-s[1],l=Math.hypot(dx,dy)||1,n=[-dy/l,dx/l],w=front?24:16,q=15;return'M '+(s[0]+n[0]*w)+' '+(s[1]+n[1]*w)+' Q '+(s[0]-dx*.08)+' '+(s[1]-dy*.08)+' '+(s[0]-n[0]*w)+' '+(s[1]-n[1]*w)+' L '+(h[0]-n[0]*q)+' '+(h[1]-n[1]*q)+' Q '+(h[0]+dx*.1)+' '+(h[1]+dy*.1)+' '+(h[0]+n[0]*q)+' '+(h[1]+n[1]*q)+' Z';}
function human(a,b,on,dur,opt){
 const front=!!opt.front;
 let s='';const far=C.skin2,near=C.skin;
 const shoulder=(p,back)=>shift(p.s,front?(back?14:-14):(back?7:0),back?-2:2);
 const hip=(p,back)=>shift(p.p,front?(back?10:-10):(back?6:0),back?-2:2);
 const limb=(back)=>{const i=back?'2':'1',c=back?far:near,sa=shoulder(a,back),sb=shoulder(b,back),pa=hip(a,back),pb=hip(b,back),ka=a['k'+i],kb=b['k'+i],aa=a['a'+i],ab=b['a'+i],ea=a['e'+i],eb=b['e'+i],wa=a['w'+i],wb=b['w'+i];
 let out=line(pa,ka,pb,kb,c,19,on,dur)+line(ka,aa,kb,ab,c,13,on,dur);let ta=avg(pa,ka),tb=avg(pb,kb);out+=line(pa,ta,pb,tb,C.shorts,23,on,dur);let taS=shift(aa,14,4),tbS=shift(ab,14,4);if(opt.calf&&(!opt.single||i==='1')){taS[1]=237;tbS[1]=237;}if(opt.toeRaise){tbS=shift(ab,12,-10);if(!on)taS=tbS;}out+=line(shift(aa,-4,1),taS,shift(ab,-4,1),tbS,back?'#9ca8aa':C.shoe,10,on,dur);out+=line(sa,ea,sb,eb,c,12,on,dur)+line(ea,wa,eb,wb,c,9,on,dur)+dot(wa,wb,5,c,on,dur);return out;};
 s+=limb(true);s+=line(a.h,a.s,b.h,b.s,C.skin2,13,on,dur);
 s+=shape('path',{d:torso(a,front),fill:C.shirt},{d:torso(b,front)},on,dur);
 s+=line(shift(a.s,-3,7),shift(a.p,-3,-11),shift(b.s,-3,7),shift(b.p,-3,-11),'#aac0c8',2,on,dur,{'opacity':.5});
 s+=limb(false);
 const aa=Math.atan2(a.s[1]-a.h[1],a.s[0]-a.h[0])*180/Math.PI-90,ab=Math.atan2(b.s[1]-b.h[1],b.s[0]-b.h[0])*180/Math.PI-90;
 s+='<g transform="translate('+a.h.join(' ')+')">'+(on?'<animateTransform attributeName="transform" type="translate" values="'+values(a.h.join(' '),b.h.join(' '))+'" keyTimes="0;.16;.5;.66;1" dur="'+dur+'s" repeatCount="indefinite"/>':'')+'<g transform="rotate('+aa+')">'+(on?'<animateTransform attributeName="transform" type="rotate" values="'+values(aa,ab)+'" keyTimes="0;.16;.5;.66;1" dur="'+dur+'s" repeatCount="indefinite"/>':'')+'<ellipse cx="0" cy="0" rx="15" ry="18" fill="'+C.skin+'"/><path d="M -14 -2 Q -18 -18 0 -19 Q 13 -19 15 -7 L 7 -9 Q 0 -14 -10 -7 Z" fill="#4a4d4a"/><path d="M 13 -2 l 5 6 -6 2" fill="'+C.skin+'"/><circle cx="7" cy="0" r="1.4" fill="#5a5b54"/></g></g>';
 return s;
}
function equipment(v,a,b,on,dur,front){
 const eq=v.equip;let s='';const L=(p,q,p2,q2,c,w,extra)=>line(p,q,p2||p,q2||q,c||C.gear,w||5,on,dur,extra),R=(x,y,w,h,r,col)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||2)+'" fill="'+(col||C.gear)+'"/>',D=(p,q,r,c)=>dot(p,q,r,c||C.gear,on,dur);
 const handle=(p,q)=>L(shift(p,-7,3),shift(p,7,3),shift(q,-7,3),shift(q,7,3),C.gearHi,6);
 const bell=(p,q)=>D(shift(p,0,15),shift(q,0,15),13,'#688692')+shape('ellipse',{cx:p[0],cy:p[1]+3,rx:8,ry:9,fill:'none',stroke:C.gearHi,'stroke-width':4},{cx:q[0],cy:q[1]+3},on,dur);
 const dumb=(p,q)=>L(shift(p,-12,4),shift(p,12,4),shift(q,-12,4),shift(q,12,4),C.gearHi,5)+L(shift(p,-13,-4),shift(p,-13,12),shift(q,-13,-4),shift(q,-13,12),C.gear,9)+L(shift(p,13,-4),shift(p,13,12),shift(q,13,-4),shift(q,13,12),C.gear,9);
 const bar=(p,q,w)=>L(shift(p,-w,0),shift(p,w,0),shift(q,-w,0),shift(q,w,0),C.gearHi,5)+L(shift(p,-w+8,-17),shift(p,-w+8,17),shift(q,-w+8,-17),shift(q,-w+8,17),C.gear,12)+L(shift(p,w-8,-17),shift(p,w-8,17),shift(q,w-8,-17),shift(q,w-8,17),C.gear,12);
 if(!front){
  if(eq==='mat'||eq==='small-ball'||eq==='roller'||eq.indexOf('trx-f')===0||eq==='nordic'||eq==='ball-feet'||eq==='miniband-knees')s+=R(49,241,294,5,3,'#334b55');
  if(eq==='rearbench')s+=R(59,182,66,12,4)+R(70,194,7,45)+R(111,194,7,45);
  if(eq==='thrust'||eq==='bench-bar'||eq==='bench-dumbbell')s+=R(eq==='thrust'?70:75,eq==='thrust'?165:170,eq==='thrust'?70:143,12,4)+R(87,182,7,57)+R(eq==='thrust'?126:199,182,7,57);
  if(eq==='step'||eq==='step-down')s+=R(eq==='step'?215:188,197,82,42,4)+L([eq==='step'?215:188,197],[eq==='step'?297:270,197],null,null,C.gearHi,2);
  if(eq==='box'||eq==='dropbox')s+=R(eq==='box'?218:87,eq==='box'?187:197,93,52,3)+L([eq==='box'?218:87,eq==='box'?187:197],[eq==='box'?311:180,eq==='box'?187:197],null,null,C.gearHi,2);
  if(eq==='boxsquat')s+=R(113,191,59,12,3)+R(120,203,7,36)+R(158,203,7,36);
  if(eq==='incline-dumbbell')s+=L([122,108],[193,175],null,null,C.gear,12)+L([193,175],[226,175],null,null,C.gear,12)+L([153,138],[153,238],null,null,C.gear,7)+L([216,181],[216,238],null,null,C.gear,7);
  if(eq==='row-bench')s+=R(76,191,231,12,3)+R(92,203,7,36)+R(287,203,7,36);
  if(eq==='pushup-bench')s+=R(80,207,83,11,3)+R(91,218,7,21)+R(148,218,7,21);
  if(eq==='support'||eq==='support-cord')s+=L([120,78],[120,239],null,null,C.gear,5);
  if(eq==='support-airplane')s+=L([288,187],[288,240],null,null,C.gear,6);
  if(eq==='ladder'){s+=L([264,30],[264,239],null,null,C.gear,7)+L([303,30],[303,239],null,null,C.gear,7);for(let y=46;y<239;y+=29)s+=L([264,y],[303,y],null,null,C.gearHi,4);}
  if(eq==='rack-band')s+=L([202,46],a.k2,[202,46],b.k2,C.accent,4);
  if(eq==='supine-cords'){s+=L([350,220],a.a1,[350,220],b.a1,C.accent,2)+L([350,226],a.a2,[350,226],b.a2,C.accent,2)+D([350,223],[350,223],6);}
  if(eq==='seated-calf')s+=R(128,172,62,10,3)+R(137,182,7,57)+R(179,182,7,57);
  if(eq==='copenhagen-short')s+=R(238,153,91,11,3)+R(247,164,7,75)+R(315,164,7,75);
  if(eq==='copenhagen-long')s+=R(291,151,58,11,3)+R(299,162,7,77)+R(337,162,7,77);
  if(eq==='rack'||eq==='rack-band')s+=L([89,239],[89,36],null,null,C.gear,8)+L([313,239],[313,36],null,null,C.gear,8)+L([89,42],[313,42],null,null,C.gearHi,8);
  if(eq==='wall-toe')s+=R(143,37,6,200,3);if(eq==='wall-side')s+=R(269,35,7,206,3);
  if(eq==='ankle-wall')s+=R(284,65,7,176,3);
  if(eq==='nordic')s+=R(265,227,35,14,3)+L([281,235],[322,235],null,null,C.gearHi,8);
  if(eq==='bike')s+=D([122,217],[122,217],23,'#30414d')+D([258,217],[258,217],23,'#30414d')+L([122,217],[169,176])+L([169,176],[218,217])+L([218,217],[122,217])+L([169,176],[155,160])+L([144,158],[168,158],null,null,C.gearHi,6)+L([218,217],[245,124])+L([234,122],[256,122],null,null,C.gearHi,6);
  if(eq.indexOf('trx')===0){let anchor=eq==='trx-away'?[73,31]:eq==='trx-front'?[206,29]:[340,28];s+=D(anchor,anchor,7,C.gearHi)+L(shift(anchor,-13,-8),shift(anchor,13,-8),null,null,C.gearHi,4);let points=eq==='trx-feet'?['a1','a2']:eq==='trx-foot'?['a1']:eq==='trx-one'?['w1']:['w1','w2'];points.forEach((k,i)=>{let ap=shift(anchor,i?-5:5,8);s+=L(ap,a[k],ap,b[k],C.accent,3)+handle(a[k],b[k]);});}
  if(eq==='low-cord'||eq==='low-cord-left'||eq==='cord-rear'||eq==='support-cord'){let anch=eq==='cord-rear'||eq==='low-cord-left'?[54,220]:[346,219];s+=D(anch,anch,7,C.gearHi)+L(anch,a.a2,anch,b.a2,C.accent,3,{'stroke-dasharray':'6 3'});}
  if(eq==='band-side')s+=D([62,108],[62,108],7,C.gearHi)+L([62,108],avg(a.w1,a.w2),[62,108],avg(b.w1,b.w2),C.accent,3);
 }
 if(front){
  if(eq==='frontbar')s+=bar(shift(a.s,12,1),shift(b.s,12,1),66);
  if(eq==='barbell')s+=bar(avg(a.w1,a.w2),avg(b.w1,b.w2),60);
  if(eq==='backbar'||eq==='boxsquat')s+=bar(shift(a.s,5,-6),shift(b.s,5,-6),66);
  if(eq==='overhead-bar'||eq==='bench-bar')s+=bar(avg(a.w1,a.w2),avg(b.w1,b.w2),67);
  if(eq==='dumbbells'||eq==='rearbench'||eq==='bench-dumbbell'||eq==='incline-dumbbell')s+=dumb(a.w2,b.w2)+dumb(a.w1,b.w1);
  if(eq==='dumbbell-one'||eq==='row-bench')s+=dumb(a.w1,b.w1);
  if(eq==='kettlebell')s+=bell(avg(a.w1,a.w2),avg(b.w1,b.w2));
  if(eq==='goblet')s+=bell(shift(avg(a.w1,a.w2),0,-10),shift(avg(b.w1,b.w2),0,-10));
  if(eq==='thrust')s+=bar(shift(a.p,0,-2),shift(b.p,0,-2),45);
  if(eq==='seated-calf')s+=dumb(shift(a.k1,-6,-12),shift(b.k1,-6,-12));
  if(eq==='ab-roller'){let x=avg(a.w1,a.w2),y=avg(b.w1,b.w2);s+=D(shift(x,0,6),shift(y,0,6),13,C.gear)+L(shift(x,-18,0),shift(x,18,0),shift(y,-18,0),shift(y,18,0),C.gearHi,5);}
  if(eq==='trapbar'){let x=avg(a.w1,a.w2),y=avg(b.w1,b.w2);s+=bar(shift(x,0,9),shift(y,0,9),69)+L(shift(x,-45,9),shift(x,-25,-7),shift(y,-45,9),shift(y,-25,-7),C.gearHi,4)+L(shift(x,-25,-7),shift(x,40,-7),shift(y,-25,-7),shift(y,40,-7),C.gearHi,4)+L(shift(x,40,-7),shift(x,60,9),shift(y,40,-7),shift(y,60,9),C.gearHi,4);}
  if(eq==='roller'||eq==='roller-single'){const x=eq==='roller-single'?a.a1:avg(a.a1,a.a2),y=eq==='roller-single'?b.a1:avg(b.a1,b.a2);s+=L(shift(x,-16,9),shift(x,16,9),shift(y,-16,9),shift(y,16,9),C.gearHi,7)+D(shift(x,-13,13),shift(y,-13,13),6)+D(shift(x,13,13),shift(y,13,13),6);}
  if(eq==='ball-feet'){let x=shift(avg(a.a1,a.a2),0,35),y=shift(avg(b.a1,b.a2),0,35);s+=D(x,y,37,'#566d77')+shape('ellipse',{cx:x[0],cy:x[1],rx:20,ry:37,fill:'none',stroke:C.gearHi,'stroke-width':1.4},{cx:y[0],cy:y[1]},on,dur);}
  if(eq==='small-ball')s+=D(avg(a.k1,a.k2),avg(b.k1,b.k2),13,C.gearHi);
  if(eq==='miniband-knees'){let a1=avg(a.p,a.k1),a2=avg(a.p,a.k2),b1=avg(b.p,b.k1),b2=avg(b.p,b.k2);s+=L(a1,a2,b1,b2,C.accent,5);}
  if(eq==='band-hands')s+=L(a.w1,a.w2,b.w1,b.w2,C.accent,3);
  if(eq==='medball')s+=D(avg(a.w1,a.w2),avg(b.w1,b.w2),18,'#aa8c6c')+L(shift(avg(a.w1,a.w2),-14,-10),shift(avg(a.w1,a.w2),14,10),shift(avg(b.w1,b.w2),-14,-10),shift(avg(b.w1,b.w2),14,10),'#d0b596',2);
  if(eq.indexOf('landmine')===0){const anchor=eq==='landmine-front'?[200,241]:[350,239],wa=eq==='landmine-row'?avg(a.w1,a.w2):a.w1,wb=eq==='landmine-row'?avg(b.w1,b.w2):b.w1;s+=D(anchor,anchor,9,'#3b4f5b')+L(anchor,wa,anchor,wb,C.gearHi,5);let pa=[wa[0]*.8+anchor[0]*.2,wa[1]*.8+anchor[1]*.2],pb=[wb[0]*.8+anchor[0]*.2,wb[1]*.8+anchor[1]*.2];s+=D(pa,pb,13,C.gear);}
  if(eq==='hopline')s+='<path d="M 200 213 v 28" stroke="'+C.accent+'" stroke-width="2" stroke-dasharray="4 4"/>';
  if(eq==='jumpmarks')s+='<path d="M 103 246 h 197 m -197 -4 v 8 m 197 -8 v 8" fill="none" stroke="'+C.accent+'" stroke-width="1.5"/>';
 }
 return s;
}
function render(key,options){
 const o=options||{},resolved=VARIANTS[key+':'+o.variant]||key,v=V[resolved]||V[ALIAS[resolved]];
 if(!v)return'<div class="exercise-visual-unavailable" role="img" aria-label="Prikaz pokreta nije dostupan">Prati opis i izvornu demonstraciju.</div>';
 const compact=!!o.compact,reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const on=o.animate!==false&&!compact&&!reduce,dur=Math.max(2,Number(o.duration)||4.8),uid='ev'+(++serial),a=on?v.a:(o.phase==='start'?v.a:v.b),b=on?v.b:a;
 const title=o.title||v.label;let s='<svg class="exercise-visual" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" role="img" aria-labelledby="'+uid+'-title '+uid+'-desc" preserveAspectRatio="xMidYMid meet"><title id="'+uid+'-title">'+esc(title)+' — shematski prikaz</title><desc id="'+uid+'-desc">'+esc(v.cue)+'. Ilustracija prikazuje osnovni obrazac pokreta. Detaljnu tehniku provjeri u uputama i izvornoj demonstraciji.</desc><defs><radialGradient id="'+uid+'-bg"><stop stop-color="#2b3744"/><stop offset="1" stop-color="#1d2530"/></radialGradient><linearGradient id="'+uid+'-ground" x2="1"><stop stop-color="#8197a1" stop-opacity="0"/><stop offset=".5" stop-color="#8197a1" stop-opacity=".45"/><stop offset="1" stop-color="#8197a1" stop-opacity="0"/></linearGradient></defs><rect width="400" height="280" rx="22" fill="url(#'+uid+'-bg)"/><ellipse cx="202" cy="243" rx="151" ry="10" fill="#10171e" opacity=".45"/><path d="M 34 243 H 366" stroke="url(#'+uid+'-ground)" stroke-width="1.5"/>';
 s+=equipment(v,a,b,on,dur,false);
 if(!compact&&o.ghost!==false&&JSON.stringify(v.a)!==JSON.stringify(v.b))s+='<g opacity=".12">'+human(v.a,v.a,false,dur,v.opt)+'</g>';
 s+=human(a,b,on,dur,v.opt)+equipment(v,a,b,on,dur,true);
 if(!compact)s+='<text x="18" y="20" fill="'+C.muted+'" font-family="system-ui,sans-serif" font-size="9" letter-spacing="1.1">SHEMA POKRETA</text><text x="200" y="268" text-anchor="middle" fill="#a8b1b6" font-family="system-ui,sans-serif" font-size="9.5">Shematski prikaz'+(on?' · kontrolirani ciklus':'')+'</text>';
 return s+'</svg>';
}
root.ExerciseVisuals={render,keys:[...new Set(Object.keys(V).concat(Object.keys(ALIAS)))],variants:VARIANTS,distinctCount:Object.keys(V).length,has:key=>!!(V[key]||V[ALIAS[key]]),meta:key=>{const v=V[key]||V[ALIAS[key]];return v?{label:v.label,cue:v.cue,schematic:true}:null;},version:2};
})(typeof window!=='undefined'?window:globalThis);
