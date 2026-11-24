# Stav projektu – GTA Czech Subtitles

Poslední uložený stav: 24. 11. 2026

## Kde jsme skončili
- Pracujeme na prototypu `GTA Czech Subtitles` v repozitáři `martinkoci88/gta6-czech-translator`.
- Hlavní soubor aplikace je `index.html`.
- Úpravy rychlosti byly sloučeny do hlavní větve `main` přes pull request #1.
- Pull request: https://github.com/martinkoci88/gta6-czech-translator/pull/1
- Aktuální soubor: https://github.com/martinkoci88/gta6-czech-translator/blob/main/index.html

## Co bylo změněno
- Počet souběžně zpracovávaných finálních překladů zvýšen ze 2 na 3 (`MAX_WORKERS = 3`).
- Maximální délka fronty zvýšena z 30 na 50.
- Průběžný náhledový překlad se nespouští, pokud už běží překlady nebo čekají položky ve frontě, aby neubíral prostředky potvrzeným titulkům.
- Změny byly ověřeny opětovným načtením `index.html` z větve `main`.

## Co udělat při pokračování
1. Otevřít aktuální aplikaci na iPhonu a obnovit stránku, aby se načetla verze z `main`.
2. Stisknout Vymazat a spustit poslech.
3. Pustit přibližně minutu anglického dialogu.
4. Zaznamenat zpoždění titulků, zda se přepisuje celá věta a zda se něco opakuje nebo vynechává.
5. Podle výsledku testu znovu upravit `index.html`; před další změnou vždy načíst aktuální verzi souboru.

## Důležité poznámky
- Zatím jde o prototyp rozpoznávání řeči a online překladu.
- Aplikace není přímo propojena s PS5 a neumí posílat zvuk zpět do hry.
- Samotné sloučení změn do GitHubu neznamená automaticky, že je aktualizovaná i otevřená stránka/aplikace; záleží na způsobu nasazení a obnovení stránky.
