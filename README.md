# Moj trening

Osobna aplikacija za planiranje i bilježenje treninga uz nogomet. Zadržan je tamni mobilni izgled; aplikacija radi kao statička stranica i PWA na GitHub Pages.

## Verzija 2

- 114 vježbi, od toga 16 TRX. Filter opreme prema popisu teretane prikazuje 103; kolotur, trap bar, bicikl i nepotvrđeni Nordic oslonac označeni su kao dodatna oprema.
- 9 prilagodljivih treninga: Snaga A/B, kontrola kuka i trupa, aktivacija, mobilnost, priprema za teren, TRX i eksplozivnost.
- 21 terenski trening, uključujući 11 treninga i 14 termina iz dostavljenog četverotjednog STATSports plana.
- Različite SVG sheme pokreta i opreme, kontrolirane animacije, izvori te službene demonstracije gdje su provjerene. Sheme nisu biomehanička snimka niti klinički validirana demonstracija.
- Terenski nacrti prikazuju dimenzije, putanju i start/cilj. Neodređene putanje ostaju označene, uz izvorne slike PDF-a. Osobni MAS i dimenzije terena mijenjaju izračun.
- Svaka serija i strana imaju svoj zapis: ponavljanja, kg, RIR, postav opreme i odrađeno/preskočeno. Slijede ocjena treninga i reakcija sljedeći dan.
- Progresija traži dva odgovarajuća zapisa, kontroliranu izvedbu i urednu reakciju. Prijedlog se primjenjuje korisničkom odlukom. Vlastiti utezi, velike razlike između bučica, TRX kut i otpor gume imaju zasebna pravila. Povratak nakon ozljede nema automatsko odobrenje faze ili sprinta.
- Plan, klupski treninzi, utakmice, opisni tjedni volumen i upozorenja na preklapanje.
- Pauza pri odlasku u pozadinu, nastavak nakon ponovnog otvaranja, izvoz/uvoz podataka i lokalnih snimki, pregled uvoza i kopija prije zamjene.

## Prvi koraci

1. U postavkama odaberi razdoblje, dan utakmice, dimenzije terena i raspoloživ korak šipke. MAS unesi iz testa.
2. Odaberi trening i pregledaj dozu. Nula kg znači da opterećenje trebaš odabrati sam; bučice se bilježe po bučici, šipka ukupno, landmine prema oznaci vježbe.
3. Odrađene serije potvrdi u playeru. Preskočene se ne računaju kao potpuni trening.
4. Nakon treninga spremi napor i zabilješke; reakciju unesi sljedeći dan. Pregled progresije dostupan je u treningu i svakoj vježbi.
5. Redovito izvezi kopiju. Za osobne snimke koristi izvoz sa snimkama.

## Podaci i izvori

Treninzi, profili i reakcije ostaju u pregledniku; snimke su u IndexedDB-u. Nema poslužiteljskog računa, sinkronizacije, GPS mjerenja ili automatskog medicinskog odobrenja. Vanjske demonstracije otvaraju se kod izdavača.

`data.js` sadrži izvore s opisom dosega dokaza. Početne doze i pravilo dviju sesija programski su prijedlog, a ne zasebno dokazan terapijski protokol. Upute iz PDF-a s nedosljednostima traže pregled prije pokretanja.

`legacy.js` služi samo migraciji stare verzije. Neizmijenjeni tvornički zapisi dobivaju ispravke; korisnički izmijenjene vrijednosti, favoriti, snimke i povijest čuvaju se. Kopija starog spremišta ostaje dostupna.

## Razvoj i provjera

Aplikacija je običan HTML/CSS/JavaScript bez build koraka. Poslužiti direktorij statičkim HTTP poslužiteljem; HTTPS je potreban za PWA izvan localhosta.

```sh
node --test tests/engine.test.cjs
```

Provjere obuhvaćaju migraciju, pune MAS cikluse, zasebne strane, djelomične treninge, progresiju, realne korake utega, TRX postav, PDF krugove/udaljenosti i validaciju kopije. Sučelje je provjereno u pregledniku: filteri, vježbe, nastavak treninga, dnevnik, izvoz/uvoz, plan i PDF postavke. Potrebno je dodatno ispitivanje na stvarnom iPhone/Android uređaju za zvuk, wake lock i ponašanje zaključanog zaslona.


## Jednostavniji prikaz (2.1)

Početna stranica, knjižnica, detalj vježbe i player prikazuju samo glavne kontrole. Tehnika, upozorenja, izvori i napredovanje otvaraju se pod „Prikaži više”. Osobni podaci, doze, favoriti i povijest ostaju sačuvani.

Stvarni prikazi povezani su po točnoj šifri vježbe u real-media.js. Izvori, autori, licence i promjene nalaze se u MEDIA-LICENSES.json. Nema GOWOD snimki, sintetiziranog pokreta ni zamjena drugim varijantama. Dio knjižnice još nema provjeren vlastiti prikaz; to je jasno označeno. Vlastitu snimku moguće je dodati uređivanjem vježbe.

Aplikacija i naslovni kadrovi dostupni su izvan mreže nakon prvog otvaranja. Videozapisi zahtijevaju vezu; nisu dio izvanmrežne predmemorije.

Provjere: `node --test tests/*.test.cjs`. Obuhvaćaju migraciju, progresiju, mjerenje, pauzu/nastavak, kvar spremanja, vraćanje kopije sa snimkama, nepravilne kopije, prikaz kataloga, medijske putanje i predmemoriju.
