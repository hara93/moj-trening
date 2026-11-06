# Promjene

## 1.20.1 — 6. 11. 2026.

- Slika u filmskom playeru počinje ispod vremena i napretka treninga. Jedna faza vježbe i dalje zauzima cijelu širinu, uz postupno zatamnjenje gornjeg i donjeg ruba u izvornu podlogu aplikacije.
- Brojač i luk jasno prate stanje: zelena za rad, koraljno crvena za odmor, plava za pripremu i neutralna oznaka pauze. Tekst stanja ostaje vidljiv.
- Moj pregled, Napredak, Opterećenje, dnevnik i povezani prozori koriste iste tamne podloge kao Početna i Knjižnica. Boje ostaju u grafovima i oznakama.
- Oznaka odrađene serije ponovno je krug, bez zelenog pravokutnika iza njega. Povijest vježbe ima uredne rubove i veličinu naslova.
- Dodane su provjere uspravnog vježbača, položaja slike, rubnog prijelaza, boja brojača i oznake serije na ekranima 320 × 568 i 375 × 812.

## 1.20.0 — 6. 11. 2026.

- Filmski player s jednom fazom vježbe preko pune širine, kontrolama pri dnu, brojačem stvarnog trajanja ručne serije i odbrojavanjem vremenskih vježbi. Dodir slike/brojača pauzira; glavna tipka potvrđuje seriju. Slike zadržavaju proporcije i vidljivog vježbača.
- Dnevnik se otvara preko playera, s dijelovima treninga, sažetim vježbama i svim serijama otvorene vježbe. Podržava stvarni RIR/SIR, promjene doze, opremu, zamjenu/vraćanje, povijest, trendove, bilješke i prelazak na dio/vježbu. Otvoreno uređivanje čuva prethodno stanje pauze i ne povećava trajanje treninga.
- Odmor se mijenja za ±15 sekundi; dodatna priprema za 5/10/30/60 sekundi ne stvara odrađene serije. Novi vremenski koraci, težine, bilješke i stvarna rezerva čuvaju se nakon ponovnog otvaranja.
- Izbornik objedinjuje postavke treninga, tempo, zvuk, dijelove, dijeljenje plana, kratki vodič i pregled završetka. Geste imaju vidljive alternative.
- Pregled treninga koristi jednu fazu glavne vježbe. Detalj vježbe prikazuje cijeli dvojni kadar preko širine ekrana.
- Napredak i Opterećenje imaju jedan glavni graf i detalje na klik. Nepoznati podaci ostaju odvojeni od nule; izračuni i izvori podataka ostaju sačuvani. Ikona Napretka prati težinu ostalih ikona.
- Početna sa sliderima, pozdravom i rasporedom ostaje sačuvana. Dodane su provjere playera, kontrola vremena, povijesti i oba mobilna preglednika.

## 1.19.0 — 6. 11. 2026.

- Početna stranica sa sliderima ostaje sačuvana. Donja navigacija ima četiri tipke: **Moj pregled**, **Početna**, **Knjižnica** i **Napredak**.
- **Moj pregled** prikazuje dnevni prijedlog, sažetke plana i bitne prečace. Detaljna analiza mišićnog tjedna, aktivnosti i rasporeda otvara se zasebno. Nova tipka **Napredak** objedinjuje napredak, opterećenje, mišićni tjedan i trendove vježbi.
- Fotografije u pregledu treninga i vježbe prikazuju se cijele. Info ikona na slici je diskretna, uz dodirnu plohu od 44 px.
- Redovi serija prilagođavaju gustoću broju serija i visini ekrana. Unosi zadržavaju tekst od 16 px i dodirne plohe od najmanje 44 px, uključujući prikaz pet serija.
- Player prvo prikazuje vježbu koju pratiš, uz mogućnost otvaranja cijelog popisa. Glavna komanda ima vidljiv naziv radnje. Tijekom prijelaza ostaje dostupan RIR prethodne serije.
- Grafovi koriste tamnu podlogu te cijan, zelenu, tirkiznu i žutu. Detalji i objašnjenja dostupni su na dodir. Izračuni, spremljene doze i povijest ostaju sačuvani.

## 1.18.2 — 6. 11. 2026.

- **Moj pregled** označava svaki odvojeni šrafirani oblik mišića, kao knjižnica. Uklonjen je zajednički okvir oko starih dodirnih ploha; i fokus tipkovnice prati pojedinačne oblike.
- Odabrana skupina bez zabilježenog rada ima plavu oznaku **Odabrano**. Boje izravnog rada, neizravnog rada i plana zadržavaju svoje značenje, a odabir ne mijenja broj serija ni pokrivenost tjedna.

## 1.18.1 — 6. 11. 2026.

- Mišići su zasebni zatvoreni SVG oblici, svaki ispunjen šrafurom i odvojen razmakom. Vanjski obris figure ima jasniji kontrast na tamnoj podlozi. Uklonjeni su vidljivi kružići za kukove iz svih prikaza; područje ostaje dostupno za označavanje i filtriranje preko iste oznake **Kukovi**.
- Figura se crta izravno u aplikaciji i radi offline bez učitavanja slika.

## 1.18.0 — 6. 11. 2026.

- Nova odobrena figura sprijeda i straga, s cijelim nogama, zadržava izvorne konture i šrafuru. Mišićne skupine imaju zasebne dodirne plohe u filtrima, uređivanju i prikazu vježbe.
- Jedna oznaka **Kukovi** označava oba kuka na obje figure. Kukovi su odvojeno zglobno područje, uz postojeće pregibače kuka, aduktore i gluteuse.
- U uputama za vježbu dodir područja prikazuje naziv i ulogu. Glavni mišići ostaju tamniji, pomoćni svjetliji; povijest i trendovi ostaju na dosadašnjem mjestu.
- Oznaka kuka sama ne donosi mišićne bodove. Postojećih 18 skupina, izračuni ranijih treninga i spremljena povijest zadržavaju svoje značenje. Obje figure spremaju se za offline rad pri instalaciji nadogradnje.
- Početna stranica ostaje kakva je bila.

## 1.17.2 — 5. 11. 2026.

- Pregled treninga i detalj vježbe usklađeni su s odabranim prototipom: ista naslovna fotografija kategorije, izvorna tipografija, razmaci, sličice, ikone, kružne oznake serija i donji gumb.
- Vrijeme, broj vježbi i serija prikazuju se u jednom retku. Uređivanje treninga, raspored i planirani rad dostupni su preko **⋯**, bez dodatnih redaka u početnom pregledu treninga.
- Ciljani RIR i odmor su u istom retku. Dodir na cilj otvara objašnjenje i postojeće postavke serija; prethodna izvedba sažima stvarno zabilježene težine i sva ponavljanja. Redoslijed ostaje serija, ponavljanja ili sekunde, kilogrami i stvarna rezerva.
- Početna stranica i izračuni opterećenja ostali su sačuvani.

## 1.17.1 — 5. 11. 2026.

- Offline instalacija pokreće se nakon pripreme dokumenta, ne čeka dovršetak svih slika. Sporo učitavanje naslovnih slika više ne odgađa spremanje aplikacije za offline rad. Početna stranica zadržava isti izgled.
- Cjelovita preglednička provjera dovršava početnu offline instalaciju prije niza uvoza i osvježavanja. Čekanje ima rok i ispis dijagnostike umjesto neograničenog zastoja.

## 1.17.0 — 5. 11. 2026.

- Zadržana je postojeća početna stranica. Pregled treninga čuva naslovnu fotografiju i opis te dobiva kompaktan popis vježbi s punim sličicama.
- Vježba se otvara preko cijelog ekrana. Sve serije, ponavljanja ili sekunde, kilogrami i stvarna rezerva vidljivi su u urednim redovima prije i tijekom treninga. Upute i figura mišića dostupni su preko ikone na slici, a povijest i novi grafovi ostaju u traci alata.
- Odabir izričito povezanog rekvizita odmah mijenja varijantu vježbe. Težine ostaju zasebne i prije nastavka se traže nepoznati kilogrami. Izvorni protokol, završene serije i započeti vremenski rad ostaju zaštićeni.
- **Moj pregled → Opterećenje** razdvaja rad po mišićima, zabilježeni subjektivni napor te jutarnju energiju, noge i bol. Sedam dana rada uspoređuje se s prethodna četiri tjedna. Nepotpuni podaci ostaju vidljivi; nema izmišljenog optimalnog raspona.
- Subjektivni napor u završnom pregledu, povijesti, ekipnom dnevniku i grafovima koristi isti izračun: ocjena 0–10 × točne spremljene sekunde / 60. Poznata nula razlikuje se od nepoznate ocjene. Novi trening isključuje izričite pauze i vrijeme izvan aplikacije nakon kontrolne točke, uz redovite odmore između serija.
- Očekivani napor protokola temelji se samo na najmanje dvije spremljene izvedbe iste pune doze. LM1 ostaje odvojena, unaprijed zadana procjena koja nije osobno kalibrirana niti računa iz stvarne kilaže.
- Ispravljeni su gubitak nepoznate težine pri promjeni drugog polja, prenošenje nespremljenog unosa u novi trening i čuvanje unosa pri odbijenom spremanju. Proširene su automatske provjere za Chrome i Safari/WebKit.

## 1.16.0 — 5. 11. 2026.

- Pregled treninga sada prikazuje jasne blokove, sličice vježbi, opremu i sve pojedinačne serije. Gumb za pokretanje ostaje dostupan pri dnu.
- Dodir na vježbu otvara panel s demonstracijom, uputama, doziranjima, bilješkama i prethodnom stvarno odrađenom izvedbom. Nepoznate vrijednosti i djelomično odrađene strane jasno su označene.
- Ciljani RIR ili rezerva u sekundama mogu se postaviti za tu izvedbu prije početka. Cilj ostaje odvojen od rezerve zabilježene nakon serije.
- Zamjena vježbe nudi alternative iste kategorije, mjere, glavne mišićne skupine i obrasca, uz filter opreme. Nova doza traži potvrdu; težina prethodne vježbe ne prenosi se. Zamjena vrijedi za tu izvedbu i ne mijenja izvorni protokol.
- Tijekom treninga može se zamijeniti samo buduća, nezapočeta vježba. Već odrađeni koraci, vremena, rezerve i raspodjela mišićnog rada ostaju sačuvani. Zamjena propisanih vježbi programa ostaje zaključana; promjene stvarne doze tijekom izvođenja čuvaju izvorni plan.
- Ako uređaj odbije prvo spremanje treninga, unos ostaje otvoren uz poruku i mogućnost ponovnog pokušaja.

## 1.15.1 — 5. 11. 2026.

- Vraćena je izvorna početna stranica s velikim slikovnim karticama, vodoravnim listanjem i tjednim rasporedom.
- Naslov je **Bok, Tomislav**, a ikonica za uvodne upute uklonjena je s početne stranice.
- Novi prikaz Napretka i ispravci podataka iz verzije 1.15.0 ostaju sačuvani.

## 1.15.0 — 5. 11. 2026.

- Početna stranica ističe današnji prijedlog, jutarnju provjeru i unos ekipnog treninga. Pet kategorija treninga dostupno je u vidljivoj mreži, a tjedni raspored, povijest i protokoli ostaju na dodir.
- Napredak prikazuje prethodnu i posljednju usporedivu seriju iste vježbe pri istoj zabilježenoj težini i načinu izvođenja. Promjene ponavljanja i vremena prikazuju se s datumima i kontekstom; različite doze ostaju u punoj povijesti.
- Novi graf aktivnosti prikazuje osam kalendarskih tjedana, odrađene treninge i poznato trajanje. Tablica sadrži iste brojke i zasebne jedinice subjektivnog napora. Nepoznati podaci i tjedan u tijeku jasno su označeni.
- Pokusi pojedinačnih vježbi i budući zapisi ne stvaraju nove usporedbe ili odrađene tjedne. Ispravci i brisanje povijesti odmah mijenjaju pregled.
- Detaljni grafovi, rekordi i postavke doziranja ostaju dostupni u odjeljcima ispod sažetka. Početna i Napredak osvježavaju današnje podatke pri promjeni dana.
- Uređivanje poznate serije u povijesti čuva prazna mjesta drugih serija. Nepoznati broj ponavljanja može ostati nepoznat i nakon ispravka.

## 1.14.1 — 5. 11. 2026.

- MAS test i povezani trening koriste istu prijavljenu udaljenost, uključujući naknadni ispravak u povijesti. Bez rezultata nema izmišljenih metara; prosječna brzina ne stvara pretpostavljene metre sprinta ili brzinskih zona. Raniji pogrešan izračun ispravlja se samo uz pouzdano povezan rezultat testa i bez prepisivanja ručnih ispravaka.
- Stariji terenski zapisi bez sačuvane udaljenosti više ne dobivaju metre prema današnjem predlošku ili MAS-u. Povijest, tjedni grafovi i bodovi dosljedno označavaju nepotpune podatke.
- Izvoz sigurnosne kopije uzima najnovije spremljene treninge i postavke, uključujući promjene iz druge otvorene kartice. Nepoznate vrijednosti u uvezenim serijama zadržavaju svoje mjesto i ne nadopunjavaju se planiranom dozom.
- Povratak preglednikom prolazi zaštitu nespremljenih promjena. Otvoreni nacrt može se vratiti nakon osvježavanja, a novija spremljena izmjena u drugoj kartici ostaje zaštićena.
- Brisanje ili zamjena slike u kopiji vježbe čuva sliku dok je koristi druga spremljena vježba.
- Kartice treninga podržavaju prebacivanje tipkovnicom, a čitači zaslona dobivaju aktualan napredak odbrojavanja. Fokus ostaje unutar otvorenog prozora pomoći.
- Objašnjenja razlikuju volumen rada, procijenjene bodove i subjektivni napor. Bodovi se ne predstavljaju kao naučena osobna mjera ili dokaz napretka. Nepotpuni podaci ne daju privid potpunog izračuna. Subjektivni napor koristi isto zaokruživanje trajanja u završnom pregledu i povijesti.
- Regresijski testovi i pregledničke provjere spremljeni su uz aplikaciju. GitHub ih pokreće za promjene glavne grane i prijedloge izmjena, u Chromiumu i WebKitu.

## 1.14.0 — 4. 11. 2026.

- **Doziranje** prikazuje svaku seriju u svojem retku, u knjižnici prije pokretanja i u aktivnom treningu. U protokolu možeš odmah pregledati cijeli popis. Kvačica potvrđuje aktivnu seriju, a jednostrani dio izdržaja ostaje označen kao djelomična izvedba.
- Prije početka treninga aplikacija traži početnu kilažu za vježbe s vanjskim opterećenjem. Vrijednosti možeš upisati decimalnim zarezom. Spremljena početna težina dostupna je pri sljedećem pokretanju.
- Pri ranom završetku rezerva ponavljanja ili sekundi i unos izvedenih ponavljanja koriste stvarno pokušanu seriju. Ako uređaj odbije spremanje ocjene, aplikacija prikazuje pogrešku i omogućuje ponovni unos.
- Nakon djelomične izvedbe možeš pregledati odrađeno i spremiti trening bez ocjene. Ponovljeni terenski trening zadržava odabranu sezonsku dozu.
- **Napredak** ima sažetak tjedna, odjeljke s trendovima, vježbama i rekordima te kratka objašnjenja na dodir. Tri odredišta u donjoj navigaciji dobila su nazive, a na početnoj stranici dostupan je kratki vodič.

## 1.13.0 — 4. 11. 2026.

- Kartica **Danas** u **Moj pregled** spaja današnji plan, prethodne izvedbe, dnevnik kluba i termine utakmica. Uz prijedlog možeš otvoriti zapise koji su utjecali na njega.
- U **Jutarnjoj provjeri** možeš zabilježiti energiju, osjećaj u nogama i bol. Dovoljan je jedan odgovor. Spremljenu provjeru možeš ispraviti ili izbrisati.
- **Ekipni dnevnik** bilježi trening s klubom ili odigranu utakmicu. Trajanje i osobna ocjena napora ulaze u pregled opterećenja. Zapis možeš urediti ili izbrisati iz povijesti.
- Predloženu dozu pokrećeš u postojećem prikazu treninga. U povijest ulaze izvedene serije. Provjere i ekipni zapisi rade bez mreže i uključeni su u sigurnosnu kopiju.

## 1.12.0 — 4. 11. 2026.

- Donja traka ima tri odredišta. Mjesečni planer otvara se ikonom kalendara u **Moj pregled**, a **Napredak** je dostupan iz istog zaslona.
- Terenski treninzi grupirani su po cilju. Katalog uključuje brzinu, agilnost, izdržljivost i testove, uz zaseban pregled četverotjednog predsezonskog plana.
- Treća kartica **Doziranje** u aktivnom treningu prikazuje vježbe i njihove serije. Promjene ponavljanja, trajanja i kilaže spremaju se za pojedine serije te izvedbe. Povijest, ukupni podignuti teret i rekordi koriste podatke odrađene serije.
- Kod obostranih izdržaja vrijeme se bilježi po odrađenim stranama, a puna serija tek kad su obje završene u istom krugu.
- Popravljena su zaglavlja na uskim ekranima i prikaz nepotpunih podataka o opterećenju. Ako uređaj odbije spremanje postavki ili ponovnog početka programa, aplikacija zadržava prethodno stanje i prikazuje poruku.
- Jedan odrađeni trening popunjava jedan termin u programu, čak i kad se isti protokol ponavlja u više tjedana. Ako ažuriranje paketa slika ne uspije, prethodne fotografije ostaju dostupne.

## 1.11.0 — 4. 11. 2026.

- U **Moj pregled → Povijest treninga** možeš pretražiti odrađene treninge i pojedinačne vježbe, od najnovijih prema starijima. Dodir na odrađeni trening u tjednom pregledu otvara isti zapis. U detaljima se vide spremljene serije, ponavljanja, težine, rezerva i podaci o trčanju kada su dostupni.
- **Uredi zapis** omogućuje ispravak treninga. Novi datum, izvedene serije i podaci o terenskom radu ažuriraju odgovarajući tjedan u planeru i grafovima. Raspodjela serija koristi mišiće spremljene uz odrađeni trening.
- **Izbriši zapis** traži potvrdu. Ako trening ima izričito povezan MAS rezultat, brišu se zajedno. Ručno spremljeni testovi čuvaju se zasebno.
- Pojedinosti o vježbama više se ne uklanjaju kad trening navrši godinu dana. Postojeće ograničenje povijesti i dalje iznosi 2000 zapisa.

## 1.10.0 — 4. 11. 2026.

- **Moj pregled** na prvoj ikoni donje trake prikazuje odrađene treninge, tjednu pokrivenost 18 mišićnih skupina i usporedbu rada po skupinama. Dodir na mišić otvara vježbe i treninge iz kojih dolaze njegove serije. **Moji protokoli** dostupni su iz pregleda.
- **Uključi preostali plan** dodaje projekciju preostalih termina iz ovog tjedna. U protokolu možeš otvoriti **Planirani rad po mišićima** prije treninga, a pri završetku **Odrađeno prema planu**.
- Za odrađenu radnu seriju svaka glavna skupina dobiva 1, a svaka pomoćna 0,5 procijenjene serije. Računaju se stvarno odrađene serije. Zagrijavanje se izostavlja. U uređivaču vlastite vježbe biraš mišiće i možeš promijeniti ulazi li vježba u ovaj zbroj.
- Uz završeni trening sprema se tadašnja raspodjela po mišićima. Kasnije izmjene vježbe vrijede za buduće termine. Sigurnosne kopije uključuju raspodjelu, a za starije zapise bez nje pregled označava nedostajuće podatke.

## 1.9.1 — 4. 11. 2026.

- Nova figura tijela sprijeda i straga prikazuje mišićna područja u knjižnici, na kartici vježbe i pri uređivanju vježbe. Postojeće oznake glavnih i pomoćnih mišića vrijede i na novoj figuri.

## 1.9.0 — 4. 11. 2026.

- Gumb **Mjesec** uz tjedni raspored otvara kalendar s treninzima i utakmicama. Dodir na datum prikazuje cijeli raspored i postojeća upozorenja za taj dan.
- Trening možeš dodati, preskočiti ili premjestiti odabirom novog datuma. Poništavanje vraća zadnju izmjenu. Mjesečne izmjene spremaju se na uređaju i ulaze u sigurnosnu kopiju.
- Sažetak prikazuje odabrani tjedan. Pod **Više** možeš ponoviti njegove izmjene do kraja mjeseca ili vratiti buduće datume na tjedni plan.

## 1.8.2 — 4. 11. 2026.

- **Slika vježbe preko cijele širine** (bez tamnih traka), niska, a za svaku sliku posebno namješteno da se ništa važno ne odreže.
- **Do 4 upute:** 119 vježbi dobilo je četvrtu kratku uputu.
- **Propušteni trening:** „Nadoknadi danas” ili „Preskoči”; preskočeni trening ne broji se kao propušten i ne prekida niz; u prozoru dana „Vrati”.
- **Ispravak:** dan maknut iz plana više ne ostaje kao propušten; odrađeni trening ostaje odrađen.

## 1.8.1 — 4. 11. 2026.

- **Kartice kao kod GOWOD-a:** prva ima „Podražaj” (jedan redak) i „Upute” (najviše 3 točke), druga ciljana područja, figuru i kratko „Zašto”, treća opterećenje. Kod svih vježbi svaka kartica stane bez skrolanja.
- **Kraći tekstovi** za svih 153 vježbi; upozorenja na bol i ključne upute ostaju.
- **Više mjesta:** niža slika vježbe, manji gumbi doze, gornja traka više, manji „Bok, Tomislav”; početne kartice su više.
- **Početni zaslon:** Teretana je uvijek tu (otvara današnji ili sljedeći trening snage), prva kartica se zove Rehabilitacija.
- **Filter:** prečaci Cijelo tijelo, Gornji dio i Donji dio iznad figure.

## 1.8.0 — 4. 11. 2026.

- **Stranica vježbe u tri kartice koje kližeš:** Upute, Cilj i Opterećenje bez gumba gore; stranica stane na ekran bez skrolanja, duži tekst skrola se unutar kartice.
- **Figura s mišićima:** na kartici Cilj tvoja figura sprijeda i straga s glavnim i pomoćnim mišićima vježbe. Svih 153 vježbi ima precizno određene mišiće.
- **Filter u Knjižnici:** kategorija, oprema kao ikonice i figura na kojoj dodiruješ mišiće; broj vježbi, „Prikaži N vježbi”, aktivni filteri iznad popisa. Filteri se pamte.
- **Uređivač vježbe:** mišiće biraš dodirom na figuri (glavni, pomoćni, ukloni); zone se same usklade.
- Ispravak: nepromijenjene vježbe na mobitelu opet dobivaju novi sadržaj iz nadogradnji (povijest sadržaja do 1.7.1).

## 1.7.1 — 4. 11. 2026.

- **Nova vježba: Landmine Single-Leg Hip Thrust** (jednonožni potisak kuka s landmine šipkom): slika s tvojim sportašem, upute, cilj, faktori opterećenja. Sada je 153 vježbe.

## 1.7.0 — 4. 11. 2026.

Prvi korak modela opterećenja.
- **Koliko si još mogao?** Nakon serije jednim dodirom upišeš rezervu (0 · 1 · 2 · 3 · 4–5 · 6+, kod izdržaja u sekundama). Bez dodira vrijedi uobičajena procjena za tu vježbu.
- **Koliko je bilo teško?** Na kraju treninga klizač 1–10 (ispod piše riječ: lagano, srednje, teško …).
- **Bodovi opterećenja:** svaka serija i cijeli trening dobivaju bodove (ponavljanja, blizina otkaza, težina vježbe za cijelo tijelo, nova vježba vrijedi više), tvrde serije po području, doskoci i metri. Svih 152 vježbi ima svoje faktore; tvoje vlastite vježbe dobivaju procjenu automatski.
- Na kartici Opterećenje vježbe: opterećenje zadnjeg treninga.

## 1.6.11 — 4. 11. 2026.

- **Bez izvora i vanjskih linkova (za sada):** nigdje se više ne prikazuju retci „Izvor: …”, linkovi „Pogledaj demonstraciju” i „Pogledaj kod TAE”, preuzete snimke i fotografije s natpisima autora ni spominjanje izvora u opisima treninga na terenu. Svuda je tvoja slika. Podaci i datoteke ostaju spremljeni; jedna postavka u kodu (SHOW_SOURCES) sve vraća.

## 1.6.10 — 3. 11. 2026.

- **Donja traka na iPhoneu, pravi uzrok:** s prozirnom statusnom trakom („black-translucent”) noviji iOS aplikaciju na početnom zaslonu pomakne gore i donjih 59 pt ostavi praznima; tu aplikacija ne može ništa nacrtati. Statusna traka je sada tamna i neprozirna („black”), pa aplikacija ide do dna ekrana. iOS to čita pri dodavanju na početni zaslon: ikonu treba ukloniti i ponovno dodati (prije toga izvezi sigurnosnu kopiju).
- Vraćeno mjerenje visine iz 1.6.9: na staroj ikoni je gurnulo donji izbornik ispod vidljivog dijela.

## 1.6.9 — 3. 11. 2026.

- **Cijeli ekran na iPhoneu (pravi popravak):** iOS aplikaciji na početnom zaslonu javlja visinu bez statusne trake, pa je sve završavalo 59 pt iznad dna. Aplikacija sada uzima stvarnu visinu ekrana.
- **Donje tipke što niže:** donji izbornik, kontrole na stranici vježbe i u playeru te „Krenimo!” sjede odmah iznad crte za povratak na početni zaslon.

## 1.6.8 — 3. 11. 2026.

- **Naslov na karticama početnog zaslona** spušten je niže, na prazni dio naslovne slike.

## 1.6.7 — 3. 11. 2026.

- **Nove naslovne slike** na svih pet kartica početnog zaslona: prave scene (fizio soba, teretana, teren, kućna teretana) s bojom svake kartice; naslov i podnaslov ostaju kao prije.

## 1.6.6 — 3. 11. 2026.

- **Zupčanik za postavke:** pravilan zupčanik s osam jednakih zubaca (na početnom zaslonu i u playeru) umjesto nepravilne zvijezde.

## 1.6.5 — 3. 11. 2026.

- **Bočno hodanje s gumom:** nova slika (stajno stopalo ostaje na mjestu, glava uspravnija). Svih 152 slika vježbi sada je pregledano i dobro.

## 1.6.4 — 3. 11. 2026.

- **Cijeli ekran na iPhoneu:** aplikacija otvorena s početnog zaslona više nema praznu traku ispod donjeg izbornika; izbornik je nisko, kao u iOS aplikacijama.
- **Početni zaslon bez skrolanja:** slajderi ispunjavaju sav prostor između tjedna i izbornika (na manjem ekranu ili uz obavijest o kopiji ostaju visoki barem 320 px).

## 1.6.3 — 3. 11. 2026.

- **38 dorađenih slika:** 36 slika iz pregleda (npr. bench press, stražnji čučanj, goblet čučanj, TRX reverse fly, face pull) i obje kopenhaške daske s ispravljenim omjerima nogu. Novi pregled: 151 slika je dobra, za ponoviti je samo bočno hodanje s gumom (uputa u PROMPTI-ZA-SLIKE.md).

## 1.6.2 — 3. 11. 2026.

- **Stranica vježbe u tri kartice: Upute | Cilj | Opterećenje.** Upute imaju opremu na vrhu, upute i link na video. Cilj („Zašto” se sada zove Cilj) ima opis, ciljana područja i osjećaj te izvor. Opterećenje ima zadnji trening, graf i zadnje treninge. Ispod kartica više se ništa ne ponavlja, a pri promjeni kartice stranica ne skače.
- **Player:** kartica vježbe ima Upute | Cilj, a Cilj je kratak (ciljana područja, osjećaj i jedna rečenica).
- **Nove slike:** svih 152 vježbi prikazuje istog sportaša (135 novih, 22 zadržane), prije preuzetog videa; video i slike iz paketa i dalje su na gumbu za zamjenu. Početni zaslon ima naslovne slike na svih pet kartica.
- **PROMPTI-ZA-SLIKE.md:** nakon pregleda svih novih slika 36 ih je za ponoviti (uz svaku piše što ne valja i ispravljena uputa), 116 je dobrih.
- **Bez signala:** prvo pokretanje nakon ažuriranja ne čeka slike koje još nisu spremljene; kartica bez slike ostaje u svojoj boji.

## 1.6.1 — 3. 11. 2026.

- **Dvije utakmice u tjednu:** u prozoru dana (dodir na dan u tjednu) ili u Doziranju možeš označiti dodatnu utakmicu, a stalni dan utakmice možeš za jedan tjedan i ukinuti. Sva upozorenja, najbolji dani i doza za sezonu računaju sa svim utakmicama tog tjedna; u tjednu s dvije utakmice na terenu se predlaže samo lagani trening, a teške noge između utakmica dobivaju upozorenje.
- **Najveća brzina (km/h)** u Doziranju (zadano 28,8 km/h): po njoj se računaju postoci brzine i sprint na terenu.
- **Player:** kartica vježbe ima „Upute” i „Zašto”, kao stranica vježbe.

## 1.6 — 3. 11. 2026.

- **Upute u stilu GOWOD-a:** svaka vježba ima kartice „Upute” (2–4 kratke upute) i „Zašto” (kratko objašnjenje i gdje se osjeća). Česte greške više se ne prikazuju.
- **Opterećenje:** svaka vježba ima graf volumena (serije × ponavljanja × kg, ili ponavljanja i vrijeme) s oznakom raste/stoji/pada i objašnjenjem „Kako se računa?”. Napredak ima tjedno opterećenje za snagu i za teren (metri i brzo trčanje).
- **Teren u sezoni:** svaki trening na terenu pokazuje intenzitet, metre, brzo trčanje i trajanje te najbolje dane prije utakmice. Kad je postavljen dan utakmice, „Kreni” pokreće dozu za sezonu (oko dvije trećine), a „Puna doza” cijeli trening.
- **Vlastite vježbe** računaju se isto kao ostale; vlastite vježbe trčanja mogu imati udaljenost i intenzitet.
- **Slike:** tvoje slike imaju prednost pred snimkama s interneta; slajderi na početnoj mogu dobiti naslovne slike. PROMPTI-ZA-SLIKE.md je novi popis za sve vježbe (57 za ponoviti, 71 novih, 24 dobrih) i 5 naslovnih slika.
- **Nordic** opisuje podstavljeni držač za gležnjeve.
- Privatni TAE paket ima kraće tekstove: nakon nadogradnje ga ponovno uvezi u Mojim podacima.

## 1.5 — 3. 11. 2026.

Provjera cijele aplikacije: popravljeni su gotovo svi nalazi revizije (280; četiri čekaju tvoju odluku) i završnog pregleda (41).

- **Tvoje slike:** 81 vježba ima tvoju sliku početnog i završnog položaja, uvijek cijelu, u knjižnici, na stranici vježbe, u zaglavlju protokola i u playeru. U PROMPTI-ZA-SLIKE.md ostale su upute za 10 novih slika i 3 za ponoviti.
- **Sigurnosna kopija:** izvoz na iPhoneu otvara izbornik za dijeljenje (*Spremi u Datoteke*) i javlja pravi ishod. Na početnoj se pojavi podsjetnik kad kopije nema ili je starija od 30 dana. Uvoz prvo pokaže što će se zamijeniti, odbija TAE paket i čuva podatke od prije uvoza, pa ih možeš vratiti.
- **Zaštita podataka:** neuspjelo spremanje ostaje vidljivo, oštećeni podaci čuvaju se sa strane, dvije otvorene kopije aplikacije više ne brišu jedna drugoj treninge, a trening u tijeku preživi ponovno učitavanje.
- **Ažuriranja na mobitelu:** protokoli koje treniraš ili kojima si mijenjao samo kilograme, serije i ponavljanja dobivaju poboljšanja, a tvoje doze i napredak ostaju. Isto vrijedi za vježbe kojima si dodao svoju sliku ili video.
- **Player:** „Spremi i ponovi”; strelica natrag pita prije izlaska i može spremiti odrađeno; preskočene vježbe ne računaju se kao odrađene, a djelomično odrađene ne guraju napredak. Vrijeme je točno i nakon zaključanog ekrana, supersetovi s različitim brojem serija imaju odmor, a signali se mogu čuti i kad je iPhone na nečujnom (postavke playera).
- **Builder:** različita ponavljanja po seriji (npr. 6/5/5/4) i naslovi dijelova; kilograme upisuješ izravno; koraci prate tvoju opremu (bučice 2,5–20 kg, girja 20 kg, šipka po 10 kg, landmine po 5 kg); prije odbacivanja izmjena pita.
- **Napredovanje i Doziranje:** postavka najmanjih ploča na šipki (zadano 5 kg); na šipci prvo više ponavljanja, pa +10 kg; bučice idu do stvarnog para; skokovi i bacanja ne dobivaju dodatna ponavljanja; postoci prate stvarni izračun; cilj se nudi samo za treninge u teretani.
- **Tjedni plan i Napredak:** dan utakmice u tjednu i upozorenja prije nje (i za sprintove na terenu); kartica Teretana sa sljedećim treningom; TAE treninzi računaju se u plan; tjedni i mreža dosljednosti točni su i nakon pomicanja sata; vježba isprobana iz knjižnice i rezultati testova ne računaju se kao trening; grafovi i rekordi bez nula kilograma.
- **TAE program:** kartica Testovi za rezultate i „Kreni ispočetka”. Novi privatni paket ažurira treninge koje nisi mijenjao: nakon nadogradnje ga ponovno uvezi u Mojim podacima.
- **Teren:** čitljiviji nacrti; MAS test bilježi rezultat i daje tvoje udaljenosti; STATSports plan pokazuje odrađena trčanja i sljedeće; Zagrijavanje za teren počinje laganim trčanjem i završava progresivnim ubrzanjima; vježbe za rad bez partnera.
- **Knjižnica i protokoli:** 152 vježbe (nove: jednonožni most s petom na kutiji, hip airplane, adukcija na boku, depth drop, ubrzanje i zaustavljanje, lagano trčanje i progresivna ubrzanja); pretraga razumije sinonime; Trening A, B i C prvi su u Mojim protokolima i počinju zagrijavanjem; „Eksplozivnost” se sada zove „Skokovi i bacanja”; tjedni volumen nordijskog pregiba i kopenhagena je uravnotežen.
- **Licence, izgled i pristupačnost:** puni podaci o autoru i licenci za svaku licenciranu snimku; veće tipke i bolji kontrast; popis blokova treninga na terenu opet je ispravan; nijedan zaslon ne klizi u stranu.
- **Rad bez interneta:** na slabom signalu aplikacija se otvori iz spremljene kopije, slike ostaju dostupne i nakon nadogradnje, a ostaci verzije 2.x su obrisani.

## 1.4.1 — 2. 11. 2026.

- Treninzi u teretani više se ne zovu po cilju: **Trening A · noge i kukovi**, **Trening B · gornji dio i trup** i **Trening C · noge i stražnja loža** (prije Snaga A/B/C). Svaki od njih možeš raditi kao snagu, hipertrofiju, izdržljivost ili eksplozivnost; cilj razdoblja biraš u Napretku → Doziranje i primijeniš ga u treningu, a popis protokola ga pokazuje uz naziv.
- Na mobitelu se mijenjaju samo nazivi i opisi koje nisi dirao. Tvoji kilogrami, dani, cilj i napredak ostaju, a protokol koji si sam preimenovao zadržava tvoj naziv. Već odrađeni treninzi u povijesti dobivaju novi naziv.
- Ni ostali tekstovi više ne pretpostavljaju cilj: savjet u Doziranju govori o treninzima u teretani, a Eksplozivnost ima oznaku Teretana umjesto Snaga.

## 1.4 — 2. 11. 2026.

- **Doziranje** (Napredak → Doziranje):
  - cilj razdoblja: Snaga (4–6 pon., 85–100 %), Hipertrofija (8–12, 70–80 %), Izdržljivost (12–15+, 65–70 %) ili Eksplozivnost (3–5, lakše i brzo);
  - nogometni tjedan: broj treninga s loptom i dan utakmice daju preporuku koliko treninga snage i kada (teški najkasnije 4 dana prije utakmice, dan prije bez teških nogu);
  - moje težine: iz odrađenih serija procjenjuje se maksimum i kilogrami za svaki cilj, zaokruženi na šipku (2,5 kg) i tvoje bučice.
- Protokol snage dobiva prijedlog serija, ponavljanja, odmora i kilograma za odabrani cilj, s pregledom promjena prije potvrde.
- Treninzi TAE programa mogu jednim dodirom dobiti kilograme iz tvojih težina; ponavljanja i serije ostaju kao u programu.

## 1.3 — 2. 11. 2026.

- **Napredak** je nova, četvrta tipka dolje: treninzi ovaj tjedan, niz tjedana, prijedlozi, krivulje glavnih vježbi, rekordi i kalendar dosljednosti zadnjih 12 tjedana.
- **Prijedlozi umjesto automatike:** kad 2 (ili 3, po izboru) treninga zaredom odradiš sve serije, aplikacija predloži veće opterećenje, a ti ga prihvatiš ili odgodiš. Ako nova težina dvaput zaredom ne ide, nudi povratak na prethodnu.
- **Kraj treninga:** svaka vježba je unaprijed „Sve odrađeno”; ako nisi uspio, to označiš i upišeš koliko si napravio u zadnjoj seriji.
- Vježbe sa šipkom ili bučicama bez kilograma dobivaju podsjetnik „Upiši početne težine”.

## 1.2.1 — 2. 11. 2026.

- Čip „TAE” u knjižnici prikazuje sve vježbe iz uvezenog programa. TAE-ovi video linkovi iz PDF-a više ne rade (njihova stranica je ugašena, a videi se puštaju samo kod njih), pa ih aplikacija ne prikazuje; gdje postoji arhivirana TAE stranica s opisom i rasporedom, vježba ima taj link.

## 1.2 — 2. 11. 2026.

- **Programi:** novi odjeljak u Protokolima. Kupljeni TAE 6-tjedni program (24 treninga, raspored po tjednima, njihove slike i video linkovi) uvozi se iz privatnog paketa i nikad nije u ovom javnom repozitoriju. Program pokazuje odrađene treninge i sljedeći trening.
- Naslovi dijelova treninga (zagrijavanje, snaga, pliometrija…), triseti i serije s različitim brojem ponavljanja (npr. 6/5/5/4).
- **Nacrti terena:** natpisi se više ne preklapaju; stoje na tamnoj podlozi uz svoju liniju, a ako nema mjesta, izostave se.
- Bicikl ostaje u knjižnici za kasnije, bez protokola; trčanje 30/30 je zasebna vježba.
- Plyo box 40 / 50 / 60 cm u uputama; Renegade row sa šesterokutnim bučicama; Nordic s petama ispod druge prečke ljestava.
- Protokoli dolaze bez kilograma: početne težine upisuješ sam.
- „Recipročne škare s užetom” su uklonjene (uže preko kolotura samo klizi, nema opterećenja).

## 1.1 — 2. 11. 2026.

Isti izgled i struktura kao 1.0, uz ove nadogradnje:

- **Knjižnica: 145 vježbi** za opremu u tvojoj teretani (šipka, kavez, landmine, bučice, girje, TRX, medicinke, plyo box, švedske ljestve, užad, mini gume, pilates lopte, kotač). Svaka ima upute korak po korak, česte greške s ispravkom, dulju napomenu (nogomet, lakša i teža varijanta, sigurnost) i provjeren izvor. Nazivi su engleski gdje je to uobičajeno, uz hrvatski drugi naziv; pretraga radi s oba i bez kvačica. Nove kategorije Eksplozivnost i Trup, čip TRX i filtar po opremi.
- **Sastavljanje treninga:** supersetovi i krugovi (prekidač „Superset sa sljedećom vježbom”), kilogrami po vježbi u protokolu, kopiranje protokola. Player izmjenjuje vježbe u supersetu po krugovima.
- **Napredovanje opterećenja:** na kraju treninga označiš vježbe koje su bile lake; nakon dva takva treninga zaredom aplikacija sama podigne opterećenje (pravilo „2 za 2”: šipka +2,5/+5 kg, bučice i TRX prvo ponavljanja). Izvori: ACSM 2009, Plotkin i sur. 2022.
- **Plan i napredak:** dani u tjednu za svaki protokol i trening na terenu, tjedna traka i kartica „Danas” na početnoj, niz tjedana po planu, kartica „Napredak” u svakoj vježbi.
- **Kondicija na terenu:** STATSports predsezonski plan (11 trčanja, raspored za 4 tjedna) i vlastiti nacrti terena s dimenzijama i animiranom putanjom za svaki od 21 treninga; nacrt je i u playeru.
- **Slike i videi:** slobodno licencirane snimke za 18 vježbi (izvori u MEDIA-LICENSES.md); privatni paket slika uvozi se u Mojim podacima (zupčanik na početnoj, „Uvezi paket slika”) i ostaje samo na mobitelu; upute za ChatGPT za ostale vježbe u PROMPTI-ZA-SLIKE.md.
- **10 gotovih protokola**, od toga 7 novih: Snaga B i C, TRX krug, Eksplozivnost, Prevencija ozljeda, Zagrijavanje za teren, Mobilnost i oporavak.
- Vježbe i protokoli koje nisi mijenjao dobivaju poboljšanja automatski; tvoje izmjene, favoriti, brisanja, videi i povijest uvijek ostaju.

## 1.0 — 1. 11. 2026. (baza)

Prva samostalna verzija, osnova za sve daljnje nadogradnje.

Verzije 2.0–2.2.1 su odložene i sačuvane pod git oznakom `v2.2.1`; aplikacija se dalje razvija od ove verzije.

- Knjižnica: 36 vježbi (rehabilitacija kuka u 3 faze, aktivacija s elastičnim užetom Ø6/Ø8 preko kolotura, mobilnost, snaga, kondicija), pretraga, filtri, favoriti, vlastite vježbe s videom.
- Protokoli: Rehab kuka, Aktivacija s užetom, Snaga A; sastavljanje, uređivanje doza, promjena redoslijeda.
- Player: odbrojavanje, promjena strane, pauze, zvučni signali, vibracija, ekran ostaje upaljen.
- Kondicija na terenu: 10 treninga prema javnim objavama STATSportsa, s izvorima.
- Podaci na uređaju, izvoz i uvoz sigurnosne kopije, rad bez interneta.
