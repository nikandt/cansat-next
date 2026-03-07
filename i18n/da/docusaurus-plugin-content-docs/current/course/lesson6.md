---
sidebar_position: 6
---

# Lektion 6: Ringe hjem

Nu har vi taget målinger og også gemt dem på et SD-kort. Det næste logiske skridt er at transmittere dem trådløst til jorden, hvilket muliggør en helt ny verden i forhold til målinger og eksperimenter, vi kan udføre. For eksempel ville det have været en del mere interessant (og nemt at kalibrere) at prøve zero-g-flyvningen med IMU, hvis vi kunne have set dataene i realtid. Lad os se på, hvordan vi kan gøre det!

I denne lektion sender vi målinger fra CanSat NeXT til jordstationsmodtageren. Senere vil vi også se på at kommandere CanSat'en med beskeder sendt af jordstationen.

## Antenner

Før du starter denne lektion, skal du sikre dig, at du har en eller anden type antenne tilsluttet CanSat NeXT-boardet og jordstationen.

:::note

Du bør aldrig forsøge at transmittere noget uden en antenne. Ikke alene vil det sandsynligvis ikke virke, der er også en mulighed for, at den reflekterede effekt vil beskadige senderen.

:::

Da vi bruger 2,4 GHz-båndet, som deles af systemer som Wi‑Fi, Bluetooth, ISM, droner osv., findes der mange kommercielle antenner. De fleste Wi‑Fi-antenner fungerer faktisk rigtig godt med CanSat NeXT, men du vil ofte have brug for en adapter for at forbinde dem til CanSat NeXT-boardet. Vi har også testet nogle adaptermodeller, som er tilgængelige i webbutikken.

Mere information om antenner kan findes i hardwaredokumentationen: [Communication and Antennas](./../CanSat-hardware/communication.md). Denne artikel har også [instruktioner](./../CanSat-hardware/communication#quarter-wave-antenna) til at bygge din egen antenne af materialerne i CanSat NeXT-kittet.

## Afsendelse af data

Med diskussionen om antenner af vejen, lad os begynde at sende nogle bits. Vi starter igen med at kigge på opsætningen, som faktisk har en vigtig forskel denne gang - vi har tilføjet et tal som et **argument** til `CanSatInit()`-kommandoen.

```Cpp title="Setup for transmission"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

At sende en talværdi til `CanSatInit()` fortæller CanSat NeXT, at vi nu vil bruge radioen. Tallet angiver værdien af den sidste byte i MAC-adressen. Du kan tænke på det som en nøgle til dit specifikke netværk - du kan kun kommunikere med CanSats, der deler den samme nøgle. Dette tal skal deles mellem din CanSat NeXT og din jordstation. Du kan vælge dit yndlingstal mellem 0 og 255. Jeg valgte 28, da det er [perfekt](https://en.wikipedia.org/wiki/Perfect_number).

Når radioen er initialiseret, er det virkelig enkelt at transmittere data. Det fungerer faktisk ligesom `appendFile()`, som vi brugte i sidste lektion - du kan tilføje enhver værdi, og den vil transmittere den i et standardformat, eller du kan bruge en formateret streng og sende den i stedet.

```Cpp title="Transmitting the data"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Med denne simple kode transmitterer vi nu LDR-målingen næsten 10 gange i sekundet. Lad os nu se på, hvordan man modtager den.

:::note

Dem, der er bekendt med low-level programmering, føler sig måske mere komfortable med at sende data i binær form. Bare rolig, vi har styr på det. De binære kommandoer er listet i [Library Specification](./../CanSat-software/library_specification#sendData-binary).

:::

## Modtagelse af data

Denne kode skal nu programmeres til en anden ESP32. Normalt er det det andet controller-board, der følger med i kittet, men stort set enhver anden ESP32 vil også fungere - inklusive en anden CanSat NeXT.

:::note

Hvis du bruger et ESP32-udviklingsboard som jordstation, så husk at trykke på Boot-knappen på boardet, mens du flasher fra IDE'en. Dette sætter ESP32 i den rigtige boot-tilstand til omprogrammering af processoren. CanSat NeXT gør dette automatisk, men udviklingsboards gør det oftest ikke.

:::

Opsætningskoden er præcis den samme som før. Husk blot at ændre radionøglen til dit yndlingstal.

```Cpp title="Setup for reception"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Men derefter bliver tingene lidt anderledes. Vi laver en helt tom loop-funktion! Det er fordi, vi faktisk ikke har noget at gøre i loopet, men i stedet sker modtagelsen via **callbacks**.

```Cpp title="Setting up a callback"
void loop() {
  // We have nothing to do in the loop.
}

// This is a callback function. It is run every time the radio receives data.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Hvor funktionen `setup()` kun kører én gang ved start, og `loop()` kører kontinuerligt, kører funktionen `onDataReceived()` kun, når radioen har modtaget nye data. På denne måde kan vi håndtere dataene i callback-funktionen. I dette eksempel udskriver vi dem bare, men vi kunne også have ændret dem, som vi ville.

Bemærk, at `loop()`-funktionen ikke *behøver* at være tom; du kan faktisk bruge den til hvad som helst med én undtagelse - delays bør undgås, da `onDataReceived()`-funktionen heller ikke vil køre, før delayet er overstået.

Hvis du nu har begge programmer kørende på forskellige boards på samme tid, burde der blive sendt en hel del målinger trådløst til din PC.

:::note

For binær-orienterede folk - du kan bruge callback-funktionen onBinaryDataReceived.

:::

## Zero-G i realtid

Bare for sjov, lad os gentage zero-g-eksperimentet, men med radioer. Modtagerkoden kan forblive den samme, og det kan opsætningen i CanSat-koden faktisk også.

Som en påmindelse lavede vi et program i IMU-lektionen, der detekterede frit fald og tændte en LED i dette scenarie. Her er den gamle kode:

```Cpp title="Free fall detecting loop function"
unsigned long LEDOnTill = 0;

void loop() {
  // Read Acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculate total acceleration (squared)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Update the timer if we detect a fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Control the LED based on the timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Det er fristende bare at tilføje `sendData()` direkte til det gamle eksempel, men vi skal tage højde for timingen. Vi ønsker normalt ikke at sende beskeder mere end ~20 gange i sekundet, men på den anden side vil vi have, at loopet kører kontinuerligt, så LED'en stadig tænder.

Vi skal tilføje endnu en timer - denne gang til at sende data hver 50 millisekunder. Timeren laves ved at sammenligne den aktuelle tid med den sidste gang, hvor data blev sendt. Den sidste tid opdateres så hver gang data sendes. Kig også på, hvordan strengen laves her. Den kunne også være blevet transmitteret i dele, men på denne måde modtages den som én enkelt besked i stedet for flere beskeder.

```Cpp title="Free fall detection + data transmission"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Read Acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculate total acceleration (squared)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Update the timer if we detect a fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Control the LED based on the timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Update the last send time to the current time
    lastSendTime = millis();
  }

}
```

Dataformatet her er faktisk igen kompatibelt med serial plotter - når man kigger på de data, bliver det ret tydeligt, hvorfor vi kunne detektere frit fald så rent tidligere - værdierne falder virkelig til nul, så snart enheden bliver tabt eller kastet.

---

I næste afsnit tager vi en kort pause for at gennemgå, hvad vi har lært indtil videre, og sikre, at vi er forberedte på at fortsætte med at bygge videre på disse koncepter.

[Klik her for den første gennemgang!](./review1)