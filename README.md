# Moj trening

Osobna web-aplikacija za trening nogometaša: knjižnica od 153 vježbe za kućnu teretanu (rehabilitacija kuka, aktivacija s elastičnim užetom, snaga, skokovi i bacanja, trup, TRX), protokoli sa supersetovima i različitim ponavljanjima po seriji, player s odbrojavanjem, tjedni plan s danom utakmice, Napredak s prijedlozima za veće opterećenje i Doziranje prema cilju te kondicija na terenu prema treninzima koje je javno objavio STATSports (izvori su navedeni uz svaki trening).

**Otvori:** https://hara93.github.io/moj-trening/

Na iPhoneu: otvori link u Safariju → Dijeli → *Dodaj na početni zaslon*.

- Podaci (vježbe, protokoli, povijest) i videi spremaju se samo na uređaju (localStorage i IndexedDB).
- Sigurnosna kopija: zupčanik na početnom ekranu (*Moji podaci*) → *Izvezi sigurnosnu kopiju* (na iPhoneu se otvori izbornik za dijeljenje: *Spremi u Datoteke*) / *Uvezi kopiju*.
- Radi i bez interneta (service worker).

Vježbe i doze za rehabilitaciju su opće smjernice iz javnih materijala; prije korištenja potvrdi ih s fizioterapeutom.

Na početnoj stranici **Kondicija** otvara terenski katalog. Filtriraj po **Brzina**, **Agilnost**, **Izdržljivost** ili **Testovi**. Predsezonski plan ima zaseban prikaz s izvornim redoslijedom termina.

U protokolu se odmah vide pojedinačne serije. Treća kartica **Doziranje** dostupna je i u knjižnici vježbi i tijekom treninga. Kvačica uz aktivnu seriju na ponavljanja potvrđuje izvedbu. Kod izdržaja oznake prate odrađeno vrijeme i strane. Možeš promijeniti broj preostalih serija te ponavljanja, kilograme ili trajanje buduće serije. Uređivač za to vrijeme pauzira trening. Promjene vrijede za tu izvedbu. Povijest prikazuje odrađene serije s njihovim stvarnim dozama.

U pregledu protokola vježbe su raspoređene u blokove sa sličicama, opremom i svim serijama. Dodirni naziv za panel s demonstracijom, uputama i prethodnom stvarnom izvedbom. Ondje možeš otvoriti punu povijest, urediti serije za to pokretanje ili postaviti ciljani RIR / rezervu u sekundama. Cilj ne zamjenjuje rezervu koju uneseš nakon serije.

**Zamijeni vježbu** nudi odgovarajuće alternative iz tvoje knjižnice. Filter opreme sužava popis prema odabranoj oznaci; nije popis svega što imaš na raspolaganju. Potvrdi novu dozu i kilograme. Zamjena ostaje u toj izvedbi, a izvorni protokol ostaje sačuvan. Tijekom treninga zamjena je dostupna samo za buduću vježbu koja još nije započela. Propisane vježbe programa ne zamjenjuju se. Ako nema odgovarajuće alternative, prikazuje se prazan popis bez pretpostavljene zamjene.

Ako vježba zahtijeva težinu koja još nije upisana, prije prve izvedbe unesi kilograme. Za bučice se upisuje težina jedne bučice, za šipku ukupna masa, a za landmine masa ploča. Spremljena težina odnosi se na taj protokol ili pojedinačnu vježbu.

U **Moj pregled → Napredak** dodirni naslov odjeljka za detalje ili ikonu **ⓘ** za objašnjenje.

## Nadogradnje

Trenutna verzija je 1.16.0. Prva ikona donje trake otvara **Moj pregled**. Dodirni **Danas** za prijedlog iz rasporeda utakmica, današnjeg plana i povijesti. Otvori **Korišteni podaci** za izvor prijedloga. Kad pokreneš kraću izvedbu, izvorni protokol zadržava svoje doze. U povijest ulazi ono što si odradio.

Na **Početnoj** je pozdrav **Bok, Tomislav**, tjedni raspored i velike kartice treninga koje listaš vodoravno. **Danas**, jutarnja provjera i ekipni dnevnik dostupni su u **Moj pregled**.

U **Napretku → Što se promijenilo** uspoređuju se najbolje potpuno odrađene serije iste vježbe pri istoj zabilježenoj težini i načinu izvođenja po stranama. Kartica pokazuje datume, ponavljanja ili sekunde te poznatu rezervu. Promjena broja nije sama po sebi dokaz promjene snage. **Zadnjih 8 tjedana** prikazuje stvarno spremljene treninge, poznate minute i zaseban subjektivni napor. Cijeli trening i povijest vježbe dostupni su iz pregleda. Pokusi iz knjižnice i budući zapisi ne ulaze u ove nove usporedbe.

U **Jutarnjoj provjeri** ocijeni energiju (1–5), težinu nogu (1–5) ili bol (0–10). Neodgovorena polja ostaju nepoznata. **Ekipni dnevnik** prima trening ili odigranu utakmicu, vrijeme završetka, stvarne minute te opcionalnu ocjenu napora (0–10). Uz 80 minuta i napor 7 zapis pokazuje 560 jedinica procijenjenog opterećenja. Ekipni zapis ostaje odvojen od planirane utakmice i od rada po mišićima. Dnevni prijedlog izrađuju pravila na uređaju. Jutarnji i ekipni zapisi ulaze u tvoju sigurnosnu kopiju.

U **Povijesti treninga** odaberi trening za detalje, ispravak ili brisanje uz potvrdu. Popis možeš pretraživati po nazivu. Stariji zapisi bez pojedinačnih serija prikazuju spremljeni sažetak.

MAS test čuva udaljenost koju si unio. Prosječna brzina testa ne govori koliko je bilo sprinta, pa te udaljenosti ostaju nepoznate. Stariji zapisi bez sačuvanih metara ne preračunavaju se prema današnjem treningu. Nepotpuni zapisi daju samo poznati dio tjednog rada.

Bodovi opterećenja su model s unaprijed zadanim faktorima, a ocjena napora × minute zaseban je subjektivni pokazatelj. Veći volumen rada sam po sebi ne potvrđuje napredak, dovoljan podražaj ili optimalan oporavak. Prijedlog **Danas** i dalje se temelji na objašnjivim pravilima na uređaju.

Na karti tijela dodirni mišić za izravne i pomoćne serije, dane rada i izvorne vježbe. Uključi plan za očekivani doprinos preostalih termina. U protokolu otvori **Planirani rad po mišićima**. Gumb **Moji protokoli** u pregledu vodi na tvoj postojeći popis.

Odrađene radne serije računaju se za glavne mišiće s faktorom 1 i za pomoćne s faktorom 0,5. Kategorije Snaga i Trup uključene su prema zadanim postavkama. U uređivaču vježbe možeš promijeniti taj izbor. Zagrijavanje se izostavlja. Odrađeni trening čuva tadašnju raspodjelu, pa kasnije uređivanje vježbe mijenja samo plan. Tjedna pokrivenost broji skupine s barem nekim zabilježenim radom. Za starije treninge bez raspodjele prikazuje se napomena.

Ikona kalendara gore desno u **Moj pregled** otvara planer. **Napredak** se otvara iz istog pregleda. Dodirni datum za raspored, a uz trening odaberi **⋯ → Premjesti** i novi datum. Za ponavljanje ili vraćanje mjesečnih izmjena otvori **Više**. Popis promjena je u [CHANGELOG.md](CHANGELOG.md), a broj verzije na dnu prozora *Moji podaci*.

- `app.js`: cijela aplikacija (prikazi, player, spremanje, plan, napredovanje); `data.js`: početne vježbe, protokoli i treninzi na terenu; `pitch.js`: nacrti terena; `media.js`: slike vježbi (`assets/slike/`, vlastite slike izrađene prema [PROMPTI-ZA-SLIKE.md](PROMPTI-ZA-SLIKE.md)) i slobodno licencirane snimke (`assets/ex/`, licence u [MEDIA-LICENSES.md](MEDIA-LICENSES.md)); `style.css`: izgled.
- Podaci na mobitelu (ključ `mt.data.v1`) ostaju pri svakoj nadogradnji. Nove stavke iz `data.js` same se dodaju. Stavke koje nisi mijenjao dobivaju poboljšanja (otisci starih verzija u `seed-history.js`, alat `tools/seed-history.cjs`). Protokol kojemu si mijenjao samo doze (kilograme, serije, ponavljanja, odmor) i napredak dobiva novi raspored, a tvoje doze ostaju. Ostale izmijenjene stavke ostaju tvoje; mijenja se samo stari isporučeni naziv ili opis koji nisi dirao (`SEED_RENAMED` u `data.js`). Obrisane stavke se ne vraćaju.
- Privatne slike (npr. iz kupljenih programa) nikad ne idu u ovaj javni repozitorij: uvoze se na mobitelu kao paket slika.

## Provjere prije objave

Bez dodatnih ovisnosti, uz Node.js 22 ili noviji:

```sh
node --test tools/check-*.cjs
node tools/build/check_load.cjs .
```

Pregledničke provjere koriste izdvojene probne podatke i privremene profile. Ne otvaraju korisnikov profil preglednika. Instalacija alata odvojena je od aplikacije:

```sh
npm ci --prefix tools/browser --ignore-scripts --no-audit --no-fund
npx --prefix tools/browser playwright install chromium webkit
node tools/browser/whole-app.cjs live
node tools/browser/today.cjs
node tools/browser/checklist.cjs
node tools/browser/checklist.cjs just-mixed
node tools/browser/starting-load.cjs
node tools/browser/progress.cjs
node tools/browser/storage.cjs
node tools/browser/field-results.cjs
node tools/browser/navigation.cjs
node tools/browser/home-progress.cjs
node tools/browser/workout.cjs
```

Dodaj `webkit` na kraj naredbe za drugi preglednik. `CHROMIUM_PATH` i `WEBKIT_PATH` mogu zadati već instalirani preglednik; `MT_TEST_OUTPUT` mijenja mapu probnih izvještaja i slika (zadano privremena mapa). Provjere se pokreću i u `.github/workflows/checks.yml`.

Chromium provjerava rad uz isključenu mrežu u pregledniku. WebKit provjerava rad uz stvarno ugašen lokalni poslužitelj, jer njegova [simulacija rada bez mreže ima poznatu grešku](https://github.com/microsoft/playwright/issues/42775). Test potvrđuje da poslužitelj nije dostupan te da aplikaciju isporučuje service worker; zatim provjerava povijest i obnovu sigurnosne kopije.

Nakon objave `node tools/browser/published.cjs` uspoređuje javno isporučene datoteke s lokalnom provjerenom verzijom i prolazi ključne funkcije na postojećoj adresi. `MT_BASE_URL` može zadati drugu adresu za tu provjeru ili ciljane provjere koje koriste zajednički `serve()` alat. Koristi ih samo s izdvojenim probnim profilom, kao što rade priložene skripte.
