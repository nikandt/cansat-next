---
sidebar_position: 8
---

# Lektion 7: At svare tilbage

CanSats bliver ofte programmeret til at køre på ret simpel logik – for eksempel at tage målinger hver n millisekunder, gemme og transmittere dataene og gentage. I modsætning hertil kan det at sende kommandoer til satellitten for at ændre dens adfærd midt i missionen åbne for mange nye muligheder. Måske vil du tænde eller slukke en sensor, eller give satellitten kommando om at lave en lyd, så du kan finde den. Der er mange muligheder, men måske den mest nyttige er evnen til at tænde strømkrævende enheder i satellitten lige før raketopsendelsen, hvilket giver dig meget mere fleksibilitet og frihed til at operere, efter at satellitten allerede er blevet integreret i raketten.

I denne lektion vil vi prøve at tænde og slukke LED’en på satellitboardet via jordstationen. Dette repræsenterer et scenarie, hvor satellitten ikke gør noget uden at få besked om det, og i praksis har et simpelt kommandosystem.

:::info

## Software-callbacks

Datamodtagelsen i CanSat-biblioteket er programmeret som **callbacks**, hvilket er en funktion, der bliver kaldt... ja, tilbage, når en bestemt hændelse opstår. Hvor vi indtil nu i vores programmer altid har fulgt præcis de linjer, vi har skrevet, ser det nu ud til, at den af og til udfører en anden funktion indimellem, før den fortsætter i hovedløkken. Det kan lyde forvirrende, men det bliver helt klart, når man ser det i praksis.

:::

## Fjernstyret blinky

Til denne øvelse vil vi prøve at genskabe LED-blinket fra den første lektion, men denne gang er LED’en faktisk fjernstyret.

Lad os først se på programmet på satellitsiden. Initialiseringen er efterhånden meget velkendt, men løkken er en smule mere overraskende – der er intet i den. Det skyldes, at al logik håndteres gennem callback-funktionen fjernstyret fra jordstationen, så vi kan bare lade løkken være tom.

De mere interessante ting sker i funktionen `onDataReceived(String data)`. Dette er den førnævnte callback-funktion, som er programmeret i biblioteket til at blive kaldt, hver gang radioen modtager data. Navnet på funktionen er programmeret ind i biblioteket, så så længe du bruger præcis det samme navn som her, vil den blive kaldt, når der er data tilgængelige.

I eksemplet nedenfor bliver dataene udskrevet hver gang blot for at visualisere, hvad der sker, men LED-tilstanden ændres også hver gang en besked modtages, uanset indholdet.

```Cpp title="Satellite code for doing nothing without being told to"
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

Variablen `LED_IS_ON` er gemt som en global variabel, hvilket betyder, at den er tilgængelig fra hvor som helst i koden. Sådanne er typisk ilde set i programmering, og begyndere lærer at undgå dem i deres programmer. Men i _embedded_-programmering som det, vi laver her, er de faktisk en meget effektiv og forventet måde at gøre dette på. Vær bare opmærksom på, at du ikke bruger det samme navn flere steder!

:::

Hvis vi flasher dette til CanSat NeXT-boardet og starter det op... sker der ingenting. Det er selvfølgelig forventet, da vi ikke har nogen kommandoer, der kommer ind i øjeblikket.

På jordstationssiden er koden ikke særlig kompliceret. Vi initialiserer systemet, og derefter sender vi i løkken en besked hver 1000 ms, dvs. én gang i sekundet. I det nuværende program betyder selve beskeden ikke noget, men kun at der bliver sendt noget i det samme netværk.

```Cpp title="Ground station sending messages"
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

Når vi nu programmerer denne kode til jordstationen (glem ikke at trykke på BOOT-knappen), og satellitten stadig er tændt, begynder LED’en på satellitten at blinke og tænder og slukker efter hver besked. Beskeden bliver også udskrevet i terminalen.

:::tip[Øvelse]

Flash kodeudsnittet nedenfor til jordstationsboardet. Hvad sker der på satellitsiden? Kan du ændre satellitprogrammet, så det kun reagerer ved at tænde LED’en, når den modtager `LED ON`, og slukke den med `LED OFF`, og ellers bare udskriver teksten.

```Cpp title="Ground station sending messages"
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
  
  // Generate a random index to pick a message
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Send the randomly selected message
  sendData(messages[randomIndex]);
}
```

:::

Bemærk også, at modtagelse af beskeder ikke blokerer afsendelse af dem, så vi kan (og vil) sende beskeder fra begge ender på samme tid. Satellitten kan transmittere data kontinuerligt, mens jordstationen kan blive ved med at sende kommandoer til satellitten. Hvis beskederne er samtidige (inden for samme millisekund eller deromkring), kan der opstå et sammenstød, og beskeden går ikke igennem. CanSat NeXT vil dog automatisk gensende beskeden, hvis den registrerer et sammenstød. Så vær blot opmærksom på, at det kan ske, men at det højst sandsynligt vil gå ubemærket hen.

---

I den næste lektion vil vi bygge videre på dette for at udføre **flow control** fjernstyret, eller ændre satellittens adfærd baseret på modtagne kommandoer.

[Klik her for den næste lektion!](./lesson8)