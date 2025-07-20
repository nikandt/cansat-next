---
sidebar_position: 8
---

# Lektion 7: Svara tillbaka

CanSats är ofta programmerade att fungera med ganska enkel logik - till exempel att ta mätningar var n:e millisekund, spara och överföra data och upprepa. Däremot kan det öppna upp många nya möjligheter att skicka kommandon till satelliten för att ändra dess beteende mitt under uppdraget. Kanske vill du slå på eller av en sensor, eller beordra satelliten att ge ifrån sig ett ljud så att du kan hitta den. Det finns många möjligheter, men kanske den mest användbara är förmågan att slå på strömkrävande enheter i satelliten precis innan raketuppskjutningen, vilket ger dig mycket mer flexibilitet och frihet att agera efter att satelliten redan har integrerats i raketen.

I denna lektion ska vi försöka slå på och av LED-lampan på satellitkortet via markstationen. Detta representerar ett scenario där satelliten inte gör något utan att bli tillsagd att göra det, och i huvudsak har ett enkelt kommandosystem.

:::info

## Programvaruåterkopplingar

Datamottagningen i CanSat-biblioteket är programmerad som **återkopplingar**, vilket är en funktion som anropas... ja, tillbaka, när en viss händelse inträffar. Medan vi hittills i våra program alltid har följt exakt de rader vi har skrivit, verkar det nu ibland utföra en annan funktion emellan innan det fortsätter i huvudloopen. Detta kan låta förvirrande, men det kommer att bli ganska tydligt när det ses i praktiken.

:::

## Fjärrstyrd Blinky

För denna övning ska vi försöka replikera LED-blinkningen från den första lektionen, men denna gång styrs LED-lampan faktiskt på distans.

Låt oss först titta på programmet på satellitsidan. Initialiseringen är mycket bekant vid det här laget, men loopen är något överraskande - det finns inget där. Detta beror på att all logik hanteras genom återkopplingsfunktionen på distans från markstationen, så vi kan bara lämna loopen tom.

Det mer intressanta händer i funktionen `onDataReceived(String data)`. Detta är den tidigare nämnda återkopplingsfunktionen, som är programmerad i biblioteket att anropas varje gång radion tar emot någon data. Namnet på funktionen är programmerat i biblioteket, så så länge du använder exakt samma namn som här, kommer den att anropas när det finns data tillgänglig.

I exemplet nedan skrivs datan ut varje gång bara för att visualisera vad som händer, men LED-tillståndet ändras också varje gång ett meddelande tas emot, oavsett innehållet.

```Cpp title="Satellitkod för att inte göra något utan att bli tillsagd"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

Variabeln `LED_IS_ON` lagras som en global variabel, vilket innebär att den är tillgänglig från var som helst i koden. Dessa ses vanligtvis inte med blida ögon i programmering, och nybörjare lärs att undvika dem i sina program. Men i _inbäddad_ programmering som vi gör här, är de faktiskt ett mycket effektivt och förväntat sätt att göra detta. Var bara försiktig så att du inte använder samma namn på flera ställen!

:::

Om vi laddar upp detta på CanSat NeXT-kortet och startar det... händer ingenting. Detta är naturligtvis förväntat, eftersom vi inte har några kommandon som kommer in för tillfället.

På markstationssidan är koden inte särskilt komplicerad. Vi initierar systemet och skickar sedan ett meddelande var 1000:e ms, dvs. en gång per sekund. I det nuvarande programmet spelar det faktiska meddelandet ingen roll, utan bara att något skickas i samma nätverk.

```Cpp title="Markstation som skickar meddelanden"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Nu när vi programmerar denna kod till markstationen (glöm inte att trycka på BOOT-knappen) och satelliten fortfarande är på, börjar LED-lampan på satelliten blinka, tändas och släckas efter varje meddelande. Meddelandet skrivs också ut till terminalen.

:::tip[Övning]

Ladda upp kodsnutten nedan till markstationskortet. Vad händer på satellitsidan? Kan du ändra satellitprogrammet så att det bara reagerar genom att tända LED-lampan när det tar emot `LED ON` och släcka med `LED OFF`, och annars bara skriver ut texten.

```Cpp title="Markstation som skickar meddelanden"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Generera ett slumpmässigt index för att välja ett meddelande
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Skicka det slumpmässigt valda meddelandet
  sendData(messages[randomIndex]);
}
```

:::

Notera också att mottagning av meddelanden inte blockerar sändning av dem, så vi skulle (och kommer) att skicka meddelanden från båda ändarna samtidigt. Satelliten kan kontinuerligt överföra data, medan markstationen kan fortsätta skicka kommandon till satelliten. Om meddelandena är samtidiga (inom samma millisekund eller så), kan det uppstå en kollision och meddelandet går inte igenom. Men CanSat NeXT kommer automatiskt att sända om meddelandet om det upptäcker en kollision. Så var bara medveten om att det kan hända, men att det förmodligen kommer att gå obemärkt förbi.

---

I nästa lektion kommer vi att bygga vidare på detta för att utföra **flödeskontroll** på distans, eller ändra satellitens beteende baserat på mottagna kommandon.

[Klicka här för nästa lektion!](./lesson8)