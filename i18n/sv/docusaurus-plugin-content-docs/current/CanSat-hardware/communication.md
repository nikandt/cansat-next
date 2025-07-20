---
sidebar_position: 3
---

# Kommunikation och Antenner

Den här artikeln introducerar de viktigaste koncepten som behövs för trådlös dataöverföring med CanSat NeXT. Först diskuteras kommunikationssystemet på en allmän nivå, därefter presenteras några olika alternativ för antennval när man använder CanSat NeXT. Slutligen presenterar den sista delen av artikeln en enkel handledning för att bygga en kvartsvågsmonopolantenn från delarna som ingår i kitet.

## Komma igång

CanSat NeXT är nästan redo att börja med trådlös kommunikation direkt ur lådan. Det enda som behövs är rätt programvara och en antenn för både sändaren och mottagaren. För det första, hänvisa till programvarumaterialen på denna sida. För det senare, innehåller denna sida instruktioner om hur man väljer en extern antenn och hur man konstruerar en enkel monopolantenn från de material som medföljer CanSat NeXT.

Även om kortet är ganska motståndskraftigt mot sådana saker tack vare programvarukontroller, bör du aldrig försöka sända något från en radio utan en antenn. Även om det är osannolikt på grund av de låga effekterna som är involverade i detta system, kan den reflekterade radiovågen orsaka verklig skada på elektroniken.

## CanSat NeXT Kommunikationssystem

CanSat NeXT hanterar den trådlösa dataöverföringen lite annorlunda jämfört med de äldre CanSat-kiten. Istället för en separat radiomodul använder CanSat NeXT MCU:ns integrerade WiFi-radio för kommunikationen. WiFi-radion används normalt för att överföra data mellan en ESP32 och internet, möjliggöra användningen av ESP32 som en enkel server eller till och med ansluta ESP32 till en Bluetooth-enhet, men med vissa smarta TCP-IP-konfigurationstrick kan vi möjliggöra direkt peer-to-peer-kommunikation mellan ESP32-enheter. Systemet kallas ESP-NOW och det utvecklas och underhålls av EspressIf, som är utvecklarna av ESP32-hårdvaran. Dessutom finns det speciella låg-hastighetskommunikationsscheman, som genom att öka energi-per-bit av överföringen, avsevärt ökar den möjliga räckvidden för wifi-radion över de vanliga några tiotals meter.

Datahastigheten för ESP-NOW är avsevärt snabbare än vad som skulle vara möjligt med den gamla radion. Även med att helt enkelt minska tiden mellan paketen i exempelprogrammet, kan CanSat NeXT överföra ~20 fulla paket till GS på en sekund. Teoretiskt kan datahastigheten vara upp till 250 kbit/s i långdistansläge, men detta kan vara svårt att uppnå i programvaran. Det sagt, överföring av till exempel fullständiga bilder från en kamera under flygningen bör vara helt genomförbart med korrekt programvara.

Även med enkla kvartsvågsmonopolantenner (en 31 mm tråd) i båda ändarna, kunde CanSat NeXT skicka data till markstationen från 1,3 km bort, vid vilken punkt siktlinjen förlorades. Vid testning med en drönare var räckvidden begränsad till ungefär 1 km. Det är möjligt att drönaren störde radion tillräckligt för att något begränsa räckvidden. Men med en bättre antenn kunde räckvidden ökas ännu mer. En liten yagi-antenn skulle teoretiskt ha ökat den operativa räckvidden tiofalt.

Det finns ett par praktiska detaljer som skiljer sig från det äldre radiokommunikationssystemet. Först sker "parningen" av satelliter till markstationsmottagare med Media Access Control (MAC)-adresser, som är inställda i koden. WiFi-systemet är tillräckligt smart för att hantera timing-, kollisions- och frekvensproblem bakom kulisserna. Användaren behöver bara se till att GS lyssnar på MAC-adressen som satelliten sänder med. 
För det andra är frekvensen för radion annorlunda. WiFi-radion arbetar på 2,4 GHz-bandet (centerfrekvens är 2,445 GHz), vilket innebär att både utbredningsegenskaper och krav för antenndesign är annorlunda än tidigare. Signalen är något mer känslig för regn och siktlinjeproblem och kanske inte kan sända i vissa fall där det gamla systemet skulle ha fungerat.

Våglängden för radiosignalen är också annorlunda. Eftersom

$$\lambda = \frac{c}{f} \approx \frac{3*10^8 \text{ m/s}}{2.445 * 10^9 \text {Hz}} = 0.12261 \text{ m,}$$

bör en kvartsvågsmonopolantenn ha en längd på 0,03065 m eller 30,65 mm. Denna längd är också markerad på CanSat NeXT PCB för att göra kapningen av kabeln lite enklare. Antennen bör klippas exakt, men inom ~0,5 mm är fortfarande okej.

En kvartsvågsantenn har tillräcklig RF-prestanda för CanSat-tävlingar. Det sagt, det kan vara av intresse för vissa användare att få ännu bättre räckvidd. En möjlig förbättringspunkt är längden på monopolantennen. I praktiken kanske kvartsvågsresonansen inte är exakt vid rätt frekvens, eftersom andra parametrar som miljö, omgivande metallelement eller den del av tråden som fortfarande är täckt med jordad metall kan påverka resonansen något. Antennen kan justeras med hjälp av en vektornätverksanalysator (VNA). Jag tror att jag borde göra detta vid något tillfälle och korrigera materialen därefter.

En mer robust lösning skulle vara att använda en annan typ av antenn. Vid 2,4 GHz finns det massor av roliga antennidéer på internet. Dessa inkluderar en helixantenn, yagi-antenn, pringles-antenn och många andra. Många av dessa, om de är välkonstruerade, kommer lätt att överträffa den enkla monopolen. Även bara en dipol skulle vara en förbättring över en enkel tråd.

Kontakten som används på de flesta ESP32-moduler är en Hirose U.FL-kontakt. Detta är en högkvalitativ miniatyr RF-kontakt, som ger bra RF-prestanda för svaga signaler. Ett problem med denna kontakt är dock att kabeln är ganska tunn vilket gör den något opraktisk i vissa fall. Det leder också till större än önskade RF-förluster om kabeln är lång, som den kan vara när man använder en extern antenn. I dessa fall kan en U.FL till SMA-adapterkabel användas. Jag ska se om vi kan tillhandahålla dessa i vår webbutik. Detta skulle göra det möjligt för team att använda en mer bekant SMA-kontakt. Det sagt, det är helt möjligt att bygga bra antenner med bara U.FL.

Till skillnad från SMA förlitar sig dock U.FL mekaniskt på snäppfästen för att hålla kontakten på plats. Detta är vanligtvis tillräckligt, men för extra säkerhet är det en bra idé att lägga till en buntband för extra säkerhet. CanSat NeXT PCB har slitsar bredvid antennkontakten för att rymma en liten buntband. Helst skulle ett 3D-utskrivet eller på annat sätt konstruerat stödhylsa läggas till för kabeln innan buntbandet. En fil för det 3D-utskrivna stödet finns tillgänglig från GitHub-sidan.

## Antennalternativ {#antenna-options}

En antenn är i huvudsak en enhet som omvandlar oguidade elektromagnetiska vågor till guidade, och vice versa. På grund av enhetens enkla natur finns det en mängd alternativ att välja antenn för din enhet. Ur en praktisk synvinkel har antennvalet mycket frihet och ganska många saker att överväga. Du behöver åtminstone överväga

1. Antennens driftfrekvens (bör inkludera 2,45 GHz)
2. Antennens bandbredd (minst 35 MHz)
3. Antennens impedans (50 ohm)
4. Kontakt (U.FL eller så kan du använda adaptrar)
5. Fysisk storlek (Passar den i burken)
6. Kostnad
7. Tillverkningsmetoder, om du gör antennen själv.
8. Polarisation av antennen.

Antennval kan verka överväldigande, och det är det ofta, men i detta fall görs det mycket enklare av det faktum att vi faktiskt använder en Wi-Fi-radio - vi kan faktiskt använda nästan vilken 2,4 GHz Wi-Fi-antenn som helst med systemet. De flesta av dem är dock för stora, och de tenderar också att använda kontakter som kallas RP-SMA, snarare än U.FL. Men med en lämplig adapter kan de vara bra val att använda med markstationen. Det finns till och med riktade antenner tillgängliga, vilket innebär att du kan få extra förstärkning för att förbättra radiolänken.

Wi-Fi-antenner är ett stabilt val, men de har en betydande nackdel - polarisation. De är nästan alltid linjärt polariserade, vilket innebär att signalstyrkan varierar avsevärt beroende på sändarens och mottagarens orientering. I värsta fall kan antennerna som är vinkelräta mot varandra till och med se signalen försvinna helt. Därför är ett alternativ att använda drönarantennor, som tenderar att vara cirkulärt polariserade. I praktiken innebär detta att vi har vissa konstanta polarisationförluster, men de är mindre dramatiska. En alternativ smart lösning för att komma runt polarisationproblemet är att använda två mottagare, med antenner monterade vinkelrätt mot varandra. På så sätt kommer åtminstone en av dem alltid ha en lämplig orientering för att ta emot signalen.

Naturligtvis kommer en sann skapare alltid vilja göra sin egen antenn. Några intressanta konstruktioner som är lämpliga för DIY-tillverkning inkluderar en helix-antenn, "pringles"-antenn, yagi, dipol eller en monopolantenn. Det finns många instruktioner online för att bygga de flesta av dessa. Den sista delen av denna artikel visar hur du gör din egen monopolantenn, lämplig för CanSat-tävlingar, från de material som skickas med CanSat NeXT.

## Bygga en kvartsvågsmonopolantenn {#quarter-wave-antenna}

Denna del av artikeln beskriver hur man bygger en rimligt effektiv kvartsvågsmonopolantenn från de material som ingår i kitet. Antennen kallas så eftersom den bara har en pol (jämför med en dipol), och dess längd är en fjärdedel av våglängden som vi sänder.

Förutom koaxialkabeln och en bit krympslang behöver du någon typ av kabelskalare och kabelsax. Nästan vilken typ som helst kommer att fungera. Dessutom behöver du en värmekälla för krympslangen, såsom en varmluftspistol, lödkolv eller till och med en tändare.

![Verktyg som behövs för att göra en kvartsvågsantenn](./img/qw_1.png)

Först, börja med att klippa kabeln ungefär i hälften.

![Kabel klippt i hälften](./img/qw_2.png)

Nästa steg är att bygga själva antennen. Denna del bör göras så noggrant som möjligt. Inom 0,2 mm eller så fungerar bra, men försök att få det så nära rätt längd som möjligt, eftersom det kommer att hjälpa med prestandan.

En koaxialkabel består av fyra delar - en mittledare, dielektrikum, skärm och ett yttre hölje. Vanligtvis används dessa kablar för att överföra radiofrekvenssignaler mellan enheter, så att strömmarna på mittledaren balanseras av dem i skärmen. Men genom att ta bort skärmledaren kommer strömmarna på innerledaren att skapa en antenn. Längden på detta exponerade område kommer att bestämma våglängden eller driftfrekvensen för antennen, och vi vill nu att den ska matcha vår driftfrekvens på 2,445 GHz, så vi behöver ta bort skärmen från en längd av 30,65 mm.

![Konstruktion av en koaxialkabel](./img/qw_3.png)

Skala försiktigt bort det yttre höljet från kabeln. Försök idealt att bara ta bort höljet och skärmen från önskad längd. Men att skära isolatorn är inte en katastrof. Det är vanligtvis lättare att ta bort det yttre höljet i delar, snarare än allt på en gång. Dessutom kan det vara lättare att först ta bort för mycket och sedan klippa innerledaren till rätt längd, snarare än att försöka få det exakt rätt på första försöket.

Bilden nedan visar de avskalade kablarna. Försök att göra det som den övre, men den nedre kommer också att fungera - den kan bara vara mer känslig för fukt. Om det finns dinglande delar av skärmen kvar, klipp försiktigt bort dem. Se till att det inte finns någon möjlighet att innerledaren och skärmen rör vid varandra - även en enda tråd skulle göra antennen oanvändbar.

![Avskalade kablar](./img/qw_4.png)

Antennen är nu helt funktionell vid denna punkt, men den kan vara känslig för fukt. Därför vill vi nu lägga till ett nytt hölje till detta, vilket är vad krympslangen är till för. Klipp två bitar, något längre än antennen du har gjort, och placera den över antennen och använd en värmekälla för att krympa den på plats. Var försiktig så att du inte bränner krympslangen, särskilt om du använder något annat än en varmluftspistol.

![Färdiga antenner](./img/qw_5.png)

Efter detta är antennerna klara. På markstationssidan är antennen förmodligen bra som den är. Å andra sidan, medan kontakten är ganska säker, är det en bra idé att stödja kontakten på något sätt på CanSat-sidan. Ett mycket robust sätt är att använda ett 3D-utskrivet stöd och en buntband, men många andra metoder fungerar också. Kom ihåg att också överväga hur antennen kommer att placeras inuti burken. Helst bör den vara på en plats där överföringen inte blockeras av några metalldelar.

![Antenn säkrad på plats med ett 3D-utskrivet stöd](./img/qw_6.png)

### Antennstöd

Slutligen, här är en step-fil av stödet som visas på bilden. Du kan importera detta till de flesta CAD-program och modifiera det, eller skriva ut det med en 3D-skrivare.

[Hämta step-fil](/assets/3d-files/uFl-support.step)