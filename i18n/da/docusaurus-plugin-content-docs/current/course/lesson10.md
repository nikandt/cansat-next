---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lektion 10: Del og hersk

Efterhånden som vores projekter bliver mere detaljerede, kan koden blive svær at håndtere, medmindre vi er omhyggelige. I denne lektion kigger vi på nogle praksisser, der hjælper med at holde større projekter håndterbare. Det inkluderer at opdele kode i flere filer, håndtere afhængigheder og til sidst introducere versionsstyring til at spore ændringer, tage backup af kode og hjælpe med samarbejde.

## Opdeling af kode i flere filer

I små projekter kan det virke fint at have al kildekoden i én fil, men når projektet skalerer, kan tingene blive rodede og sværere at håndtere. En god praksis er at opdele din kode i forskellige filer baseret på funktionalitet. Når det gøres godt, giver det også små, pæne moduler, som du kan genbruge i forskellige projekter uden at introducere unødvendige komponenter i andre projekter. En stor fordel ved flere filer er også, at det gør samarbejde lettere, da andre personer kan arbejde på andre filer, hvilket hjælper med at undgå situationer, hvor koden er svær at flette.

Den følgende tekst antager, at du bruger Arduino IDE 2. Avancerede brugere føler sig måske mere hjemme med systemer som [Platformio](https://platformio.org/), men de af jer vil allerede være bekendt med disse koncepter.

I Arduino IDE 2 vises alle filer i projektmappen som faner i IDE’en. Nye filer kan oprettes direkte i IDE’en eller via dit operativsystem. Der er tre forskellige typer filer: **headers** `.h`, **source files** `.cpp` og **Arduino-filer** `.ino`.  

Af disse tre er Arduino-filer de nemmeste at forstå. De er simpelthen ekstra filer, som kopieres ind i slutningen af dit primære `.ino`-script ved kompilering. Derfor kan du nemt bruge dem til at skabe mere forståelige kodestrukturer og få al den plads, du har brug for til en kompliceret funktion, uden at gøre kildefilen svær at læse. Den bedste tilgang er som regel at tage én funktionalitet og implementere den i én fil. Så du kunne for eksempel have en separat fil for hver driftstilstand, én fil til dataoverførsler, én fil til kommando-fortolkning, én fil til datalagring og én hovedfil, hvor du samler det hele til et fungerende script.

Headers og source files er lidt mere specialiserede, men heldigvis fungerer de på samme måde som med C++ andre steder, så der er meget materiale skrevet om at bruge dem, for eksempel [her](https://www.learncpp.com/cpp-tutorial/header-files/).

## Eksempelstruktur

Som eksempel tager vi den rodede kode fra [Lektion 8](./lesson8.md) og refaktorerer den.

<details>
  <summary>Original rodet kode fra Lektion 8</summary>
  <p>Her er hele koden til din frustration.</p>
```Cpp title="Satellite with multiple states"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // unknown mode
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Det er endda ikke så slemt, men du kan se, hvordan det hurtigt kan blive alvorligt svært at læse, hvis vi udbyggede funktionaliteterne eller tilføjede nye kommandoer at fortolke. I stedet lad os opdele dette i pæne, separate kodefiler baseret på de forskellige funktionaliteter.

Jeg adskilte hver af driftstilstandene i sin egen fil, tilføjede en fil til kommando-fortolkning og lavede til sidst en lille hjælpefil til at indeholde funktionalitet, der er nødvendig mange steder. Dette er en ret typisk simpel projektstruktur, men gør allerede programmet som helhed meget lettere at forstå. Dette kan yderligere understøttes af god dokumentation og ved for eksempel at lave en graf, der viser, hvordan filerne hænger sammen.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Main sketch"
#include "CanSatNeXT.h"

int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Pre-launch mode"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Flight mode"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Recovery mode"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Command interpretation"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Utilities"
bool LED_IS_ON = false;

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```
  </TabItem>

</Tabs>

Selvom denne tilgang allerede er milevidt bedre end at have én enkelt fil til det hele, kræver den stadig omhyggelig styring. For eksempel deles **namespace** mellem de forskellige filer, hvilket kan skabe forvirring i et større projekt eller ved genbrug af kode. Hvis der er funktioner eller variabler med de samme navne, ved koden ikke, hvilken den skal bruge, hvilket fører til konflikter eller uventet adfærd.

Derudover egner denne tilgang sig ikke godt til **encapsulation**—som er nøglen til at bygge mere modulær og genanvendelig kode. Når dine funktioner og variabler alle findes i det samme globale rum, bliver det sværere at forhindre, at én del af koden utilsigtet påvirker en anden. Det er her mere avancerede teknikker som namespaces, klasser og objektorienteret programmering (OOP) kommer i spil. Disse ligger uden for rammerne af dette kursus, men individuel research i disse emner opfordres.


:::tip[Øvelse]

Tag et af dine tidligere projekter og giv det en makeover! Opdel din kode i flere filer, og organiser dine funktioner efter deres roller (f.eks. sensorhåndtering, datahåndtering, kommunikation). Se hvor meget renere og lettere at håndtere dit projekt bliver!

:::


## Versionsstyring

Efterhånden som projekter vokser — og især når flere personer arbejder på dem — er det let at miste overblikket over ændringer eller ved et uheld at overskrive (eller omskrive) kode. Det er her **versionsstyring** kommer ind. **Git** er branchestandarden for versionsstyring, som hjælper med at spore ændringer, håndtere versioner og organisere store projekter med flere samarbejdspartnere.

At lære Git kan føles skræmmende og endda overflødigt for små projekter, men jeg kan love dig, at du vil takke dig selv for at lære det. Senere vil du undre dig over, hvordan du nogensinde klarede dig uden!




Her er et godt sted at starte: [Getting started with Git](https://docs.github.com/en/get-started/getting-started-with-git).

Der findes flere Git-tjenester, hvor populære inkluderer:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub er et solidt valg på grund af sin popularitet og den store mængde support, der er tilgængelig. Faktisk er denne webside og [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library)-bibliotekerne hostet på GitHub.

Git er ikke bare praktisk — det er en essentiel færdighed for alle, der arbejder professionelt inden for ingeniørvidenskab eller naturvidenskab. De fleste teams, du vil være en del af, vil bruge Git, så det er en god idé at gøre brugen af det til en velkendt vane.

Flere tutorials om Git:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)



:::tip[Øvelse]

Opret et Git-repository til dit CanSat-projekt og push din kode til det nye repository. Dette vil hjælpe dig med at udvikle software til både satellitten og jordstationen på en organiseret, samarbejdsvenlig måde.

:::

---

I den næste lektion taler vi om forskellige måder at udvide CanSat med eksterne sensorer og andre enheder.

[Klik her for den næste lektion!](./lesson11)