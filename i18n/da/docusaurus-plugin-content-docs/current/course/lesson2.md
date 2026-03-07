---
sidebar_position: 2
---

# Lektion 2: At mærke trykket

I denne anden lektion begynder vi at bruge sensorerne på CanSat NeXT-boardet. Denne gang vil vi fokusere på at måle det omgivende atmosfæriske tryk. Vi vil bruge den indbyggede barometer [LPS22HB](./../CanSat-hardware/on_board_sensors.md#barometer) til at aflæse trykket samt til at aflæse temperaturen i selve barometeret.

Lad os starte med barometerkoden i bibliotekets eksempler. I Arduino IDE skal du vælge File-> Examples->CanSat NeXT->Baro. 

Begyndelsen af programmet ser ret velkendt ud fra sidste lektion. Igen starter vi med at inkludere CanSat NeXT-biblioteket og opsætte den serielle forbindelse samt initialisere CanSat NeXT-systemerne.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

Funktionskaldet `CanSatInit()` initialiserer alle sensorerne for os, inklusive barometeret. Så vi kan begynde at bruge det i loop-funktionen.

De to linjer nedenfor er der, hvor temperaturen og trykket faktisk aflæses. Når funktionerne `readTemperature()` og `readPressure()` kaldes, sender processoren en kommando til barometeret, som måler trykket eller temperaturen og returnerer resultatet til processoren.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

I eksemplet udskrives værdierne, og derefter følger en forsinkelse på 1000 ms, så loopet gentages cirka én gang i sekundet.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Brug af dataene

Vi kan også bruge dataene i koden, i stedet for kun at udskrive dem eller gemme dem. For eksempel kunne vi lave en kode, der registrerer, om trykket falder med en bestemt mængde, og for eksempel tænder LED'en. Eller hvad som helst andet, du har lyst til at gøre. Lad os prøve at tænde den indbyggede LED.

For at implementere dette skal vi ændre koden i eksemplet en smule. Først skal vi begynde at holde styr på den forrige trykværdi. For at oprette **globale variabler**, dvs. variabler der ikke kun eksisterer, mens vi udfører en bestemt funktion, kan du blot skrive dem uden for enhver specifik funktion. Variablen previousPressure opdateres i hver cyklus af loop-funktionen, helt til sidst. På denne måde holder vi styr på den gamle værdi og kan sammenligne den med den nyere værdi.

Vi kan bruge en if-sætning til at sammenligne de gamle og nye værdier. I koden nedenfor er ideen, at hvis det forrige tryk er 0,1 hPa højere end den nye værdi, tænder vi LED'en, og ellers holdes LED'en slukket.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

Hvis du flasher dette ændrede loop til CanSat NeXT, bør det både udskrive variabelværdierne som før, men nu også kigge efter trykfaldet. Det atmosfæriske tryk falder cirka 0,12 hPa / meter, når man bevæger sig opad, så hvis du prøver hurtigt at løfte CanSat NeXT en meter højere, bør LED'en tænde i én loop-cyklus (1 sekund) og derefter slukke igen. Det er nok bedst at frakoble USB-kablet, før du prøver dette!

Du kan også prøve at ændre koden. Hvad sker der, hvis forsinkelsen ændres? Hvad med hvis **hysterese** på 0,1 hPa ændres, eller endda fjernes helt?

---

I den næste lektion får vi endnu mere fysisk aktivitet, når vi prøver at bruge den anden integrerede sensor-IC - inertimåleenheden.

[Klik her for den næste lektion!](./lesson3)