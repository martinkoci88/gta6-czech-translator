# GTA 6 Czech Translator

Projekt zaměřený na české titulky k anglicky mluveným hrám na PlayStation a Xbox.

## Aktuální stav

- Překladový slovník: `translations/translations/translations/strings.csv`
- Formát CSV: `key,english,czech,context,status`
- Zatím jde o malý základní slovník, nikoli o kompletní překlad GTA 6.
- Aplikace pro zachytávání řeči a zobrazování živých titulků zatím není vytvořena.

## Cíl první verze (MVP)

Doprovodná aplikace pro iPhone, která bude vedle hry zobrazovat české titulky. Hra poběží na PS5 v angličtině; telefon bude samostatné zařízení.

Navržený postup:
1. Vytvořit jednoduché mobilní rozhraní pro titulky.
2. Přidat vstup anglického dialogu a zobrazení českého překladu.
3. Otestovat rozpoznávání řeči z mikrofonu iPhonu v prohlížeči.
4. Zlepšit rozpoznávání dialogů a omezit zachytávání okolních zvuků.
5. Teprve potom řešit automatický překlad a případný hlasový výstup.

## Důležitá technická omezení

- Běžná aplikace v iPhonu nemůže přímo číst interní zvuk PS5. První prototyp by proto musel zkoušet zachytit zvuk z reproduktorů televizoru přes mikrofon telefonu.
- Přesnost rozpoznávání může ovlivnit hudba, střelba, hluk a vzdálenost telefonu.
- Samotný CSV slovník neumí rozpoznávat ani překládat libovolné věty. Pro živý překlad bude potřeba řečové rozpoznávání a překladová služba.
- Tento projekt zatím neinstaluje český jazyk přímo do hry ani nemění soubory hry na PS5.

## Struktura překladu

CSV používá pět sloupců:
- `key`: stabilní identifikátor textu
- `english`: původní anglický text
- `czech`: český překlad
- `context`: oblast použití
- `status`: stav překladu (`draft` nebo `reviewed`)

## Další krok

Vytvořit mobilní prototyp titulků a ověřit, co iPhone dokáže zachytit z televizoru. Až bude tento základ fungovat, doplnit živé rozpoznávání a překlad.
