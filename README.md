# Moj trening

Osobna web-aplikacija za trening: vlastite vježbe (rehabilitacija kuka, aktivacija s elastičnim užetom preko kolotura, snaga), protokoli, player s odbrojavanjem te kondicija na terenu prema treninzima koje je javno objavio STATSports (izvori su navedeni uz svaki trening).

**Otvori:** https://hara93.github.io/moj-trening/

Na iPhoneu: otvori link u Safariju → Dijeli → *Dodaj na početni zaslon*.

- Podaci (vježbe, protokoli, povijest) i videi spremaju se samo na uređaju (localStorage i IndexedDB).
- Sigurnosna kopija: zupčanik na početnom ekranu → *Izvezi sigurnosnu kopiju* / *Uvezi kopiju*.
- Radi i bez interneta (service worker).

Vježbe i doze za rehabilitaciju su opće smjernice iz javnih materijala; prije korištenja potvrdi ih s fizioterapeutom.

## Nadogradnje

Verzija 1.0 je baza (git oznaka `v1.0`); trenutna je 1.2. Popis promjena je u [CHANGELOG.md](CHANGELOG.md), a trenutna verzija piše na dnu prozora *Moji podaci*.

- `app.js`: cijela aplikacija (prikazi, player, spremanje, plan, napredovanje); `data.js`: početne vježbe, protokoli i treninzi na terenu; `pitch.js`: nacrti terena; `media.js`: slobodno licencirane snimke (`assets/ex/`, licence u [MEDIA-LICENSES.md](MEDIA-LICENSES.md)); `style.css`: izgled.
- Podaci na mobitelu (ključ `mt.data.v1`) ostaju pri svakoj nadogradnji. Nove stavke iz `data.js` same se dodaju. Stavke koje nisi mijenjao dobivaju poboljšanja (otisci starih verzija u `seed-history.js`, alat `tools/seed-history.cjs`); izmijenjene i obrisane se ne diraju.
- Privatne slike (npr. iz kupljenih programa) nikad ne idu u ovaj javni repozitorij: uvoze se na mobitelu kao paket slika.
