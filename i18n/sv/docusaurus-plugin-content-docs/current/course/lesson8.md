---
sidebar_position: 9
---

# Lektion 8: Gå med Flödet

Ämnet för denna lektion är flödeskontroll, eller hur vi kan hantera vad processorn gör vid olika tidpunkter. Hittills har de flesta av våra program fokuserat på en enda uppgift, vilket, även om det är enkelt, begränsar systemets potential. Genom att introducera olika **tillstånd** i vårt program kan vi utöka dess kapacitet.

Till exempel kan programmet ha ett förlanseringstillstånd, där satelliten väntar på uppskjutning. Sedan kan det övergå till flygläge, där det läser sensordata och utför sitt huvuduppdrag. Slutligen kan ett återhämtningsläge aktiveras, där satelliten skickar signaler för att hjälpa till med återhämtning—blinkande ljus, pipande eller utförande av vilka systemåtgärder vi har designat.

**Triggaren** för att byta mellan tillstånd kan variera. Det kan vara en sensoravläsning, som en tryckförändring, ett externt kommando, en intern händelse (som en timer), eller till och med en slumpmässig händelse, beroende på vad som krävs. I denna lektion kommer vi att bygga vidare på vad vi lärt oss tidigare genom att använda ett externt kommando som trigger.

## Flödeskontroll med Externa Triggers

Först, låt oss modifiera markstationskoden för att kunna ta emot meddelanden från Serial monitor, så att vi kan skicka anpassade kommandon vid behov.

Som du kan se är de enda ändringarna i huvudloopen. Först kontrollerar vi om det finns data mottagen från Serial. Om inte, görs inget och loopen fortsätter. Men om det finns data, läses den in i en variabel, skrivs ut för tydlighet och skickas sedan via radion till satelliten. Om du fortfarande har programmet från föregående lektion uppladdat till satelliten kan du prova det.

```Cpp title="Markstation som kan skicka kommandon"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Serial In - Datakällor

När vi läser data från `Serial`-objektet, har vi tillgång till data lagrad i UART RX-bufferten, som överförs via USB Virtual Serial-anslutningen. I praktiken betyder detta att all programvara som kan kommunicera över en virtuell seriell port, såsom Arduino IDE, terminalprogram eller olika programmeringsmiljöer, kan användas för att skicka data till CanSat.

Detta öppnar upp många möjligheter för att styra CanSat från externa program. Till exempel kan vi skicka kommandon genom att manuellt skriva dem, men också skriva skript i Python eller andra språk för att automatisera kommandon, vilket gör det möjligt att skapa mer avancerade kontrollsystem. Genom att utnyttja dessa verktyg kan du skicka precisa instruktioner, köra tester eller övervaka CanSat i realtid utan manuell inblandning.

:::

Nästa, låt oss titta på satellitsidan. Eftersom vi har flera tillstånd i programmet blir det lite längre, men låt oss bryta ner det steg för steg.

Först initierar vi systemen som vanligt. Det finns också ett par globala variabler, som vi placerar högst upp i filen så att det är lätt att se vilka namn som används. `LED_IS_ON` är bekant från våra tidigare kodexempel, och dessutom har vi en global tillståndsvariabel `STATE`, som lagrar... ja, tillståndet.

```Cpp title="Initialisering"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Nästa, i loopen kontrollerar vi helt enkelt vilken subrutin som ska köras enligt det aktuella tillståndet, och anropar dess funktion:

```Cpp title="Loop"
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
```

I detta specifika fall representeras varje tillstånd av en separat funktion som anropas baserat på tillståndet. Innehållet i funktionerna är egentligen inte viktigt här, men här är de:

```Cpp title="Subrutiner"
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
```

Det finns också en liten hjälpfunktion `blinkLED`, som hjälper till att undvika kodupprepning genom att hantera LED-växling åt oss.

Slutligen ändras tillståndet när markstationen säger åt oss att göra det:

```Cpp title="Kommandot mottaget callback"
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

<details>
  <summary>Hela koden</summary>
  <p>Här är hela koden för din bekvämlighet.</p>
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

Med detta kan vi nu kontrollera vad satelliten gör utan att ens ha fysisk tillgång till den. Istället kan vi bara skicka ett kommando med markstationen och satelliten gör vad vi vill.

:::tip[Övning]

Skapa ett program som mäter en sensor med en specifik frekvens, som kan ändras med ett fjärrkommando till vilket värde som helst. Istället för att använda subrutiner, försök att ändra ett fördröjningsvärde direkt med ett kommando.

Försök också göra det tolerant mot oväntade inmatningar, såsom "-1", "ABCDFEG" eller "".

Som en bonusövning, gör den nya inställningen permanent mellan återställningar, så att när satelliten stängs av och på igen, kommer den att återuppta sändningen med den nya frekvensen istället för att återgå till den ursprungliga. Som ett tips kan det vara hjälpsamt att återbesöka [lektion 5](./lesson5.md).

:::

---

I nästa lektion kommer vi att göra vår datalagring, kommunikation och hantering betydligt mer effektiv och snabb genom att använda binär data. Även om det kan verka abstrakt till en början, förenklar hantering av data som binär istället för siffror många uppgifter, eftersom det är datorns modersmål.

[Klicka här för nästa lektion!](./lesson9)