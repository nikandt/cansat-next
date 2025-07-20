---
sidebar_position: 6
---

# Mekanisk Design

## PCB-dimensioner

![CanSat NeXT board dimensions](./img/PCB_dimensions.png)

CanSat NeXT huvudkort är byggt på ett 70 x 50 x 1,6 mm PCB, med elektronik på ovansidan och batteri på undersidan. PCB:n har monteringspunkter i varje hörn, 4 mm från sidorna. Monteringspunkterna har en diameter på 3,2 mm med ett jordad padområde på 6,4 mm, och de är avsedda för M3-skruvar eller distanser. Padområdet är också stort nog för att passa en M3-mutter. Dessutom har kortet två trapetsformade 8 x 1,5 mm utskärningar på sidorna och ett komponentfritt område på ovansidan i mitten, så att en buntband eller annat extra stöd kan läggas till för batterierna för flygoperationer. På liknande sätt finns två 8 x 1,3 mm slitsar bredvid MCU-antennanslutningen så att antennen kan säkras till kortet med ett litet buntband eller en bit snöre. USB-kontakten är något inträngd i kortet för att förhindra några utskjutningar. En liten utskärning är tillagd för att rymma vissa USB-kablar trots inträngningen. Förlängningshuvudena är standard 0,1 tum (2,54 mm) kvinnliga huvuden, och de är placerade så att mitten av monteringshålet är 2 mm från den långa kanten av kortet. Huvudet närmast den korta kanten är 10 mm bort från den. Tjockleken på PCB:n är 1,6 mm, och höjden på batterierna från kortet är ungefär 13,5 mm. Huvudena är ungefär 7,2 mm höga. Detta gör höjden på det omslutande volymen ungefär 22,3 mm. Vidare, om distanser används för att stapla kompatibla kort tillsammans, bör distanserna, distansbrickorna eller andra mekaniska monteringssystem separera korten minst 7,5 mm. Vid användning av standard pinhuvuden är den rekommenderade kortseparationen 12 mm.

Nedan kan du ladda ner en .step-fil av perf-boarden, som kan användas för att lägga till PCB:n i en CAD-design för referens, eller till och med som en startpunkt för ett modifierat kort.

[Ladda ner step-fil](/assets/3d-files/cansat.step)


## Designa ett Anpassat PCB {#custom-PCB}

Om du vill ta din elektronikdesign till nästa nivå bör du överväga att göra ett anpassat PCB för elektroniken. KiCAD är en utmärkt, gratis programvara som kan användas för att designa PCB:er, och att få dem tillverkade är förvånansvärt prisvärt.

Här är resurser för att komma igång med KiCAD: https://docs.kicad.org/#_getting_started

Här är en KiCAD-mall för att starta ditt eget CanSat-kompatibla kretskort: [Ladda ner KiCAD-mall](/assets/kicad/Breakout-template.zip)