---
sidebar_position: 13
---

# Lektion 12: Redo för uppskjutning?

I denna sista lektion kommer vi att prata om hur man förbereder satelliten, markstationen och teamet för uppskjutningen. Efter denna lektion kommer vi också att ha en *översikt* för att kontrollera flygberedskapen, men denna lektion fokuserar på att maximera chanserna för ett lyckat uppdrag. I denna lektion kommer vi att prata om att förbereda din elektronik mekaniskt och elektriskt, kontrollera radiosystemet och slutligen diskutera några användbara förberedelsesteg som bör göras långt innan själva uppskjutningsevenemanget.

Denna lektion är återigen lite annorlunda, eftersom vi istället för att titta på nya programmeringskoncept diskuterar hur man förbättrar enhetens tillförlitlighet i uppdraget. Dessutom, även om du förmodligen inte är klar med att bygga (eller definiera) satellituppdraget om du nu först går igenom kursen, är det bra att läsa igenom materialet på denna sida, överväga dessa aspekter när du planerar din enhet och ditt uppdrag, och återkomma till dem när du faktiskt förbereder för uppskjutningen.

## Mekaniska överväganden

För det första, som diskuterades i föregående lektion, bör elektronik**stapeln** byggas så att den håller ihop även vid kraftiga vibrationer och stötar. Ett bra sätt att designa elektroniken är att använda perfboards, som hålls ihop av [distanshylsor](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) och ansluts elektriskt antingen genom kontakter eller med en väl stödd kabel. Slutligen bör hela elektronikstapeln fästas vid satellitramen så att den inte rör sig runt. En styv anslutning med skruvar är alltid ett säkert val (ordvits avsedd), men det är inte det enda alternativet. Ett alternativ kan vara att designa systemet för att brytas vid påverkan, liknande en [deformationszon](https://en.wikipedia.org/wiki/Crumple_zone). Alternativt kan ett dämpat monteringssystem med gummi, skum eller liknande system minska påfrestningarna som elektroniken utsätts för, vilket hjälper till att skapa fleranvändningssystem.

I en typisk CanSat finns det några föremål som är särskilt sårbara för problem under uppskjutning eller snabbare än förväntade landningar. Dessa är batterierna, SD-kortet och antennen.

### Säkra batterierna

På CanSat NeXT är kortet designat så att ett buntband kan fästas runt kortet för att säkerställa att batterierna hålls på plats vid vibrationer. Annars har de en tendens att hoppa ur hållarna. En annan oro med batterier är att vissa batterier är kortare än vad som skulle vara idealiskt för batterihållaren, och det är möjligt att vid en särskilt hög stöt kommer batterikontakterna att böjas under batteriernas vikt så att en kontakt förloras. För att mildra detta kan kontakterna stödjas genom att lägga till en bit buntband, skum eller annat fyllmedel bakom fjäderkontakterna. I oavsiktliga (och avsiktliga) falltester har detta förbättrat tillförlitligheten, även om CanSat NeXTs integrerade i välbyggda CanSats har överlevt fall från upp till 1000 meter (utan fallskärm) även utan dessa skyddsåtgärder. Ett ännu bättre sätt att stödja batterierna är att designa en stödstruktur direkt till CanSat-ramen, så att den bär batteriernas vikt vid påverkan istället för batterihållaren.

![CanSat med buntband](./img/cansat_with_ziptie.png)

### Säkra antennkabeln

Antennkontakten är U.Fl, vilket är en bilklassad kontakttyp. De hanterar vibrationer och stötar ganska bra trots att de inte har externa mekaniska stöd. Men tillförlitligheten kan förbättras genom att säkra antennen med små buntband. CanSat NeXT-kortet har små slitsar bredvid antennen för detta ändamål. För att hålla antennen i en neutral position kan ett [stöd skrivas ut](../CanSat-hardware/communication#quarter-wave-antenna) för den.

![Antenn säkrad på plats med ett 3D-utskrivet stöd](../CanSat-hardware/img/qw_6.png)

### Säkra SD-kortet

SD-kortet kan hoppa ur hållaren vid höga stötar. Återigen har korten överlevt fall och flygningar, men tillförlitligheten kan förbättras genom att tejpa eller limma SD-kortet till hållaren. Nyare CanSat NeXT-kort (≥1.02) är utrustade med högsäkerhets SD-korthållare för att ytterligare mildra detta problem.

## Kommunikationstest

En av de mest vitala detaljerna för att få ett lyckat uppdrag är att ha en pålitlig radiolänk. Det finns mer information om att välja och/eller bygga antenner i [hårdvarusektionen](../CanSat-hardware/communication#antenna-options) av dokumentationen. Men oavsett vald antenn är testning en viktig del av alla radiosystem.

Korrekt antenntestning kan vara knepigt och kräver specialutrustning som [VNAs](https://en.wikipedia.org/wiki/Network_analyzer_(electrical)), men vi kan göra ett funktionstest direkt med CanSat NeXT-kitet.

Först, programmera satelliten att skicka data, till exempel en dataläsning en gång i sekunden. Sedan, programmera markstationen att ta emot data och att skriva ut **RSSI** (Received signal strength indicator) värden, som ges av `getRSSI()` funktionen, vilken är en del av CanSat NeXT-biblioteket.

```Cpp title="Läs RSSI"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI: ");
  Serial.println(rssi);
}
```

Detta värde representerar den faktiska elektriska **effekten** som tas emot av markstationen genom dess antenn när den tar emot ett meddelande. Värdet uttrycks i [decibelmilliwatts](https://en.wikipedia.org/wiki/DBm). En typisk avläsning med en fungerande antenn i båda ändarna när enheterna är på samma bord är -30 dBm (1000 nanowatt), och det bör sjunka snabbt när avståndet ökar. I fritt utrymme följer det ungefär inversa kvadratlagen, men inte exakt på grund av ekon, fresnelzoner och andra imperfektioner. Med de radiosinställningar som CanSat NeXT använder som standard kan RSSI tas ner till ungefär -100 dBm (0.1 pikowatt) och fortfarande få igenom viss data.

Detta motsvarar vanligtvis ett avstånd på ungefär en kilometer när man använder monopoleantenner, men kan vara mycket mer om markstationsantennen har betydande [gain](https://en.wikipedia.org/wiki/Gain_(antenna)), vilket direkt läggs till dBm-avläsningen.

## Strömtester

Det är en bra idé att mäta strömförbrukningen av din satellit med en multimeter. Det är också enkelt, ta bara bort ett av batterierna och håll det manuellt så att du kan använda multimeterns strömmätning för att ansluta mellan ena änden av batteriet och batterikontakten. Denna avläsning bör vara i storleksordningen 130-200 mA om CanSat NeXT-radion är aktiv och det inte finns några externa enheter. Strömförbrukningen ökar när batterierna laddas ur, eftersom mer ström behövs för att hålla spänningen vid 3,3 volt från den sjunkande batterispänningen.

Typiska AAA-batterier har en kapacitet på cirka 1200 mAh, vilket innebär att strömförbrukningen av enheten bör vara mindre än 300 mA för att säkerställa att batterierna räcker hela uppdraget. Detta är också varför det är en bra idé att ha flera driftlägen om det finns strömkrävande enheter ombord, eftersom de kan slås på precis före flygningen för att säkerställa god batteritid.

Även om en matematisk metod för att uppskatta batteritiden är en bra start, är det ändå bäst att göra en faktisk mätning av batteritiden genom att skaffa nya batterier och genomföra ett simulerat uppdrag.

## Flygtestning

Inom flygindustrin genomgår varje satellit rigorösa tester för att säkerställa att den kan överleva de hårda förhållandena vid uppskjutning, rymden och ibland återinträde. Även om CanSats verkar i en något annorlunda miljö, kan du ändå anpassa några av dessa tester för att förbättra tillförlitligheten. Nedan finns några vanliga flygtester som används för CubeSats och små satelliter, tillsammans med idéer för hur du kan implementera liknande tester för din CanSat.

### Vibrationstest

Vibrationstest används i små satellitsystem av två skäl. Det primära skälet är att testet syftar till att identifiera resonansfrekvenserna i strukturen för att säkerställa att raketens vibrationer inte börjar resonera i någon del av satelliten, vilket kan leda till ett fel i satellitsystemen. Det sekundära skälet är också relevant för CanSat-system, vilket är att bekräfta hantverkets kvalitet och säkerställa att systemet kommer att överleva raketuppskjutningen. Satellitvibrationstestning görs med specialiserade vibrationstestbänkar, men effekten kan simuleras med mer kreativa lösningar också. Försök komma på ett sätt att verkligen skaka satelliten (eller helst dess reservdel) och se om något går sönder. Hur kan det förbättras?

### Stöttest

En kusin till vibrationstester, stöttester simulerar den explosiva stegsseparationen under raketuppskjutningen. Stötaccelerationen kan vara upp till 100 Gs, vilket lätt kan bryta system. Detta kan simuleras med ett falltest, men överväg hur du gör det säkert så att satelliten, du eller golvet inte går sönder.

### Termiskt test

Termiskt test inkluderar att utsätta hela satelliten för de extrema temperaturerna i det planerade driftområdet och även flytta snabbt mellan dessa temperaturer. I CanSat-sammanhang kan detta innebära att testa satelliten i en frys, simulera en uppskjutning på en kall dag, eller i en mild uppvärmd ugn för att simulera en varm uppskjutningsdag. Var försiktig så att elektroniken, plasten eller din hud inte utsätts direkt för extrema temperaturer.

## Allmänna bra idéer

Här är några ytterligare tips för att hjälpa till att säkerställa ett lyckat uppdrag. Dessa sträcker sig från tekniska förberedelser till organisatoriska metoder som kommer att förbättra den övergripande tillförlitligheten för din CanSat. Känn dig fri att föreslå nya idéer att lägga till här genom den vanliga kanalen (samuli@kitsat.fi).

- Överväg att ha en checklista för att undvika att glömma något precis före uppskjutningen
- Testa hela flygsekvensen i förväg i en simulerad flygning
- Testa satelliten också i liknande miljöförhållanden som förväntas under flygningen. Se till att fallskärmen också är OK med de förväntade temperaturerna.
- Ha reservbatterier och tänk på hur de installeras om det behövs
- Ha ett reserv-SD-kort, de kan ibland gå sönder
- Ha en reservdator och inaktivera uppdateringar på datorn före uppskjutningen.
- Ha reservbuntband, skruvar och vad du än behöver för att montera satelliten
- Ha några grundläggande verktyg till hands för att hjälpa till med demontering och montering
- Ha extra antenner
- Du kan också ha flera markstationer som arbetar samtidigt, vilket också kan användas för att triangulera satelliten, särskilt om det finns RSSI tillgängligt.
- Ha tydliga roller för varje teammedlem under uppskjutningen, operationerna och återhämtningen.

---

Detta är slutet på lektionerna för nu. På nästa sida finns en flygberedskapsöversikt, vilket är en övning som hjälper till att säkerställa lyckade uppdrag.

[Klicka här för flygberedskapsöversikten!](./review2)