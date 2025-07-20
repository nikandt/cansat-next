---
sidebar_position: 2
---

# Lektion 2: Känna trycket

I denna andra lektion kommer vi att börja använda sensorerna på CanSat NeXT-kortet. Denna gång kommer vi att fokusera på att mäta det omgivande atmosfärstrycket. Vi kommer att använda den inbyggda barometern [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) för att läsa av trycket, samt för att läsa av temperaturen på själva barometern.

Låt oss börja med barometerkoden i biblioteksexemplen. I Arduino IDE, välj Fil-> Exempel->CanSat NeXT->Baro. 

Programmets början ser ganska bekant ut från förra lektionen. Återigen börjar vi med att inkludera CanSat NeXT-biblioteket och ställa in den seriella anslutningen samt initiera CanSat NeXT-systemen.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

Funktionsanropet `CanSatInit()` initierar alla sensorer åt oss, inklusive barometern. Så vi kan börja använda den i loop-funktionen.

De två raderna nedan är där temperaturen och trycket faktiskt läses. När funktionerna `readTemperature()` och `readPressure()` anropas, skickar processorn ett kommando till barometern, som mäter trycket eller temperaturen och returnerar resultatet till processorn.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

I exemplet skrivs värdena ut, och sedan följs detta av en fördröjning på 1000 ms, så att loopen upprepas ungefär en gång per sekund.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Använda datan

Vi kan också använda datan i koden, snarare än att bara skriva ut den eller spara den. Till exempel skulle vi kunna göra en kod som upptäcker om trycket sjunker med en viss mängd, och till exempel tända LED-lampan. Eller vad som helst annat du vill göra. Låt oss försöka tända den inbyggda LED-lampan.

För att implementera detta behöver vi ändra koden i exemplet något. Först, låt oss börja spåra det tidigare tryckvärdet. För att skapa **globala variabler**, dvs sådana som inte bara existerar medan vi kör en specifik funktion, kan du helt enkelt skriva dem utanför någon specifik funktion. Variabeln previousPressure uppdateras vid varje cykel av loop-funktionen, precis i slutet. På detta sätt håller vi koll på det gamla värdet och kan jämföra det med det nya värdet.

Vi kan använda ett if-uttryck för att jämföra de gamla och nya värdena. I koden nedan är tanken att om det tidigare trycket är 0,1 hPa lägre än det nya värdet, kommer vi att tända LED-lampan, och annars hålls LED-lampan släckt.

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

Om du laddar upp denna modifierade loop till CanSat NeXT, bör den både skriva ut variabelvärdena som tidigare, men nu också leta efter tryckfallet. Det atmosfäriska trycket sjunker ungefär 0,12 hPa / meter när man går upp, så om du försöker lyfta CanSat NeXT snabbt en meter högre, bör LED-lampan tändas för en loopcykel (1 sekund) och sedan släckas igen. Det är förmodligen bäst att koppla bort USB-kabeln innan du provar detta!

Du kan också försöka ändra koden. Vad händer om fördröjningen ändras? Vad händer om **hysteresen** på 0,1 hPa ändras, eller till och med tas bort helt?

---

I nästa lektion kommer vi att få ännu mer fysisk aktivitet, när vi försöker använda den andra integrerade sensor-IC:n - den tröghetsmätningsenheten.

[Klicka här för nästa lektion!](./lesson3)