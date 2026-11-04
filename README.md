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

Ako vježba zahtijeva težinu koja još nije upisana, prije prve izvedbe unesi kilograme. Za bučice se upisuje težina jedne bučice, za šipku ukupna masa, a za landmine masa ploča. Spremljena težina odnosi se na taj protokol ili pojedinačnu vježbu.

U **Moj pregled → Napredak** dodirni naslov odjeljka za detalje ili ikonu **ⓘ** za objašnjenje.

## Nadogradnje

Trenutna verzija je 1.14.0. Prva ikona donje trake otvara **Moj pregled**. Dodirni **Danas** za prijedlog iz rasporeda utakmica, današnjeg plana i povijesti. Otvori **Korišteni podaci** za izvor prijedloga. Kad pokreneš kraću izvedbu, izvorni protokol zadržava svoje doze. U povijest ulazi ono što si odradio.

U **Jutarnjoj provjeri** ocijeni energiju (1–5), težinu nogu (1–5) ili bol (0–10). Neodgovorena polja ostaju nepoznata. **Ekipni dnevnik** prima trening ili odigranu utakmicu, vrijeme završetka, stvarne minute te opcionalnu ocjenu napora (0–10). Uz 80 minuta i napor 7 zapis pokazuje 560 jedinica procijenjenog opterećenja. Ekipni zapis ostaje odvojen od planirane utakmice i od rada po mišićima. Dnevni prijedlog izrađuju pravila na uređaju. Jutarnji i ekipni zapisi ulaze u tvoju sigurnosnu kopiju.

U **Povijesti treninga** odaberi trening za detalje, ispravak ili brisanje uz potvrdu. Popis možeš pretraživati po nazivu. Stariji zapisi bez pojedinačnih serija prikazuju spremljeni sažetak.

Na karti tijela dodirni mišić za izravne i pomoćne serije, dane rada i izvorne vježbe. Uključi plan za očekivani doprinos preostalih termina. U protokolu otvori **Planirani rad po mišićima**. Gumb **Moji protokoli** u pregledu vodi na tvoj postojeći popis.

Odrađene radne serije računaju se za glavne mišiće s faktorom 1 i za pomoćne s faktorom 0,5. Kategorije Snaga i Trup uključene su prema zadanim postavkama. U uređivaču vježbe možeš promijeniti taj izbor. Zagrijavanje se izostavlja. Odrađeni trening čuva tadašnju raspodjelu, pa kasnije uređivanje vježbe mijenja samo plan. Tjedna pokrivenost broji skupine s barem nekim zabilježenim radom. Za starije treninge bez raspodjele prikazuje se napomena.

Ikona kalendara gore desno u **Moj pregled** otvara planer. **Napredak** se otvara iz istog pregleda. Dodirni datum za raspored, a uz trening odaberi **⋯ → Premjesti** i novi datum. Za ponavljanje ili vraćanje mjesečnih izmjena otvori **Više**. Popis promjena je u [CHANGELOG.md](CHANGELOG.md), a broj verzije na dnu prozora *Moji podaci*.

- `app.js`: cijela aplikacija (prikazi, player, spremanje, plan, napredovanje); `data.js`: početne vježbe, protokoli i treninzi na terenu; `pitch.js`: nacrti terena; `media.js`: slike vježbi (`assets/slike/`, vlastite slike izrađene prema [PROMPTI-ZA-SLIKE.md](PROMPTI-ZA-SLIKE.md)) i slobodno licencirane snimke (`assets/ex/`, licence u [MEDIA-LICENSES.md](MEDIA-LICENSES.md)); `style.css`: izgled.
- Podaci na mobitelu (ključ `mt.data.v1`) ostaju pri svakoj nadogradnji. Nove stavke iz `data.js` same se dodaju. Stavke koje nisi mijenjao dobivaju poboljšanja (otisci starih verzija u `seed-history.js`, alat `tools/seed-history.cjs`). Protokol kojemu si mijenjao samo doze (kilograme, serije, ponavljanja, odmor) i napredak dobiva novi raspored, a tvoje doze ostaju. Ostale izmijenjene stavke ostaju tvoje; mijenja se samo stari isporučeni naziv ili opis koji nisi dirao (`SEED_RENAMED` u `data.js`). Obrisane stavke se ne vraćaju.
- Privatne slike (npr. iz kupljenih programa) nikad ne idu u ovaj javni repozitorij: uvoze se na mobitelu kao paket slika.
