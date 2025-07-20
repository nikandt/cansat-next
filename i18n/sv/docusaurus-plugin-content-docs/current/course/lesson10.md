---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lektion 10: Dela och erövra

När våra projekt blir mer detaljerade kan koden bli svår att hantera om vi inte är försiktiga. I denna lektion kommer vi att titta på några metoder som hjälper till att hålla större projekt hanterbara. Dessa inkluderar att dela upp koden i flera filer, hantera beroenden och slutligen introducera versionskontroll för att spåra ändringar, säkerhetskopiera kod och underlätta samarbete.

## Dela upp koden i flera filer

I små projekt kan det verka okej att ha all källkod i en fil, men när projektet växer kan det bli rörigt och svårare att hantera. En bra praxis är att dela upp din kod i olika filer baserat på funktionalitet. När det görs väl, skapar detta också trevliga små moduler som du kan återanvända i olika projekt utan att införa onödiga komponenter i andra projekt. En stor fördel med flera filer är också att det gör samarbetet enklare, eftersom andra personer kan arbeta på andra filer, vilket hjälper till att undvika situationer där koden är svår att slå samman.

Följande text förutsätter att du använder Arduino IDE 2. Avancerade användare kanske känner sig mer hemma med system som [Platformio](https://platformio.org/), men de av er kommer redan att vara bekanta med dessa koncept.

I Arduino IDE 2 visas alla filer i projektmappen som flikar i IDE:n. Nya filer kan skapas direkt i IDE:n eller via ditt operativsystem. Det finns tre olika typer av filer, **headers** `.h`, **källfiler** `.cpp` och **Arduino-filer** `.ino`.

Av dessa tre är Arduino-filerna de enklaste att förstå. De är helt enkelt extra filer som kopieras i slutet av ditt huvudskript `.ino` vid kompilering. På så sätt kan du enkelt använda dem för att skapa mer förståeliga kodstrukturer och ta allt utrymme du behöver för en komplicerad funktion utan att göra källfilen svår att läsa. Det bästa tillvägagångssättet är vanligtvis att ta en funktionalitet och implementera den i en fil. Så du kan till exempel ha en separat fil för varje driftläge, en fil för dataöverföringar, en fil för kommandotolkning, en fil för datalagring och en huvudfil där du kombinerar allt detta till ett funktionellt skript.

Headers och källfiler är lite mer specialiserade, men lyckligtvis fungerar de precis som med C++ på andra ställen, så det finns mycket material skrivet om att använda dem, till exempel [här](https://www.learncpp.com/cpp-tutorial/header-files/).

## Exempelstruktur

Som ett exempel, låt oss ta den röriga koden från [Lektion 8](./lesson8.md) och omstrukturera den.

<details>
  <summary>Original rörig kod från Lektion 8</summary>
  <p>Här är hela koden för din frustration.</p>
```Cpp title="Satellit med flera tillstånd"
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
    // okänt läge
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Väntar...");
  sendData("Väntar...");
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

Detta är inte ens så illa, men du kan se hur det skulle kunna bli allvarligt svårt att läsa om vi utvecklade funktionerna eller lade till nya kommandon att tolka. Istället låt oss dela upp detta i snygga separata kodfiler baserat på de separata funktionaliteterna.

Jag separerade varje driftläge i sin egen fil, lade till en fil för kommandotolkning och slutligen gjorde en liten verktygsfil för att hålla funktionalitet som behövs på många ställen. Detta är en ganska typisk enkel projektstruktur, men gör redan programmet som helhet mycket lättare att förstå. Detta kan ytterligare underlättas av bra dokumentation och att göra en graf till exempel som visar hur filerna länkar till varandra.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Huvudskiss"
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

```Cpp title="Förlanseringsläge"
void preLaunch() {
  Serial.println("Väntar...");
  sendData("Väntar...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Flygläge"
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

```Cpp title="Återhämtningsläge"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Kommandotolkning"
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

```Cpp title="Verktyg"
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

Även om detta tillvägagångssätt redan är mycket bättre än att ha en enda fil för allt, kräver det fortfarande noggrann hantering. Till exempel delas **namnrymden** mellan de olika filerna, vilket kan orsaka förvirring i ett större projekt eller när man återanvänder kod. Om det finns funktioner eller variabler med samma namn vet inte koden vilken som ska användas, vilket leder till konflikter eller oväntat beteende.

Dessutom lånar sig detta tillvägagångssätt inte väl till **inkapsling**—vilket är nyckeln till att bygga mer modulär och återanvändbar kod. När dina funktioner och variabler alla finns i samma globala utrymme blir det svårare att förhindra att en del av koden oavsiktligt påverkar en annan. Det är här mer avancerade tekniker som namnrymder, klasser och objektorienterad programmering (OOP) kommer in i bilden. Dessa faller utanför ramen för denna kurs, men individuell forskning om dessa ämnen uppmuntras.


:::tip[Övning]

Ta ett av dina tidigare projekt och ge det en makeover! Dela upp din kod i flera filer och organisera dina funktioner baserat på deras roller (t.ex. sensorförvaltning, datahantering, kommunikation). Se hur mycket renare och lättare att hantera ditt projekt blir!

:::


## Versionskontroll

När projekten växer — och särskilt när flera personer arbetar med dem — är det lätt att tappa bort ändringar eller av misstag skriva över (eller skriva om) kod. Det är där **versionskontroll** kommer in. **Git** är branschstandarden för versionskontrollverktyg som hjälper till att spåra ändringar, hantera versioner och organisera stora projekt med flera medarbetare.

Att lära sig Git kan kännas skrämmande och till och med överflödigt för små projekt, men jag kan lova att du kommer att tacka dig själv för att du lärde dig det. Senare kommer du att undra hur du någonsin klarade dig utan det!

Här är en bra plats att börja: [Kom igång med Git](https://docs.github.com/en/get-started/getting-started-with-git).

Det finns flera Git-tjänster tillgängliga, med populära som inkluderar:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub är ett bra val på grund av dess popularitet och det överflöd av stöd som finns tillgängligt. Faktum är att denna webbsida och [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) biblioteken är värd på GitHub.

Git är inte bara bekvämt — det är en viktig färdighet för alla som arbetar professionellt inom teknik eller vetenskap. De flesta team du kommer att vara en del av kommer att använda Git, så det är en bra idé att göra det till en bekant vana att använda det.

Fler handledningar om Git:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)



:::tip[Övning]

Ställ in ett Git-repository för ditt CanSat-projekt och skicka din kod till det nya repositoryt. Detta kommer att hjälpa dig att utveckla programvara för både satelliten och markstationen på ett organiserat, samarbetsinriktat sätt.

:::

---

I nästa lektion kommer vi att prata om olika sätt att utöka CanSat med externa sensorer och andra enheter.

[Klicka här för nästa lektion!](./lesson11)