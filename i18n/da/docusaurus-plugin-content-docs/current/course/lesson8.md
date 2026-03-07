---
sidebar_position: 9
---

# Lektion 8: Følg strømmen

Emnet for denne lektion er flow control, eller hvordan vi kan styre, hvad processoren gør på forskellige tidspunkter. Indtil nu har de fleste af vores programmer fokuseret på en enkelt opgave, hvilket, selvom det er ligetil, begrænser systemets potentiale. Ved at introducere forskellige **tilstande** i vores program kan vi udvide dets muligheder.

For eksempel kunne programmet have en før-affyringstilstand, hvor satellitten venter på opsendelse. Derefter kunne den skifte til flyvetilstand, hvor den læser sensordata og udfører sin hovedmission. Til sidst kunne en genopretningstilstand aktiveres, hvor satellitten sender signaler for at hjælpe med genfinding—blinkende lys, bip, eller udførelse af de systemhandlinger, vi har designet.

**Udløseren** for at skifte mellem tilstande kan variere. Det kan være en sensoraflæsning, som en trykændring, en ekstern kommando, en intern hændelse (såsom en timer), eller endda en tilfældig forekomst, afhængigt af hvad der kræves. I denne lektion bygger vi videre på det, vi lærte tidligere, ved at bruge en ekstern kommando som udløser.

## Flow Control med eksterne udløsere

Først skal vi ændre ground station-koden, så den kan modtage beskeder fra Serial monitoren, så vi kan sende brugerdefinerede kommandoer efter behov.

Som du kan se, er de eneste ændringer i hovedløkken. Først tjekker vi, om der er modtaget data fra Serial. Hvis ikke, gøres der ingenting, og løkken fortsætter. Hvis der derimod er data, læses de ind i en variabel, udskrives for tydelighed og sendes derefter via radioen til satellitten. Hvis du stadig har programmet fra den forrige lektion uploadet til satellitten, kan du prøve det.

```Cpp title="Ground station able to send commands"
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

## Serial In - Datakilder

Når vi læser data fra `Serial`-objektet, tilgår vi dataene, der er gemt i UART RX-bufferen, som overføres via USB Virtual Serial-forbindelsen. I praksis betyder det, at enhver software, der kan kommunikere over en virtuel seriel port, såsom Arduino IDE, terminalprogrammer eller forskellige programmeringsmiljøer, kan bruges til at sende data til CanSat.

Dette åbner op for mange muligheder for at styre CanSat fra eksterne programmer. For eksempel kan vi sende kommandoer ved manuelt at skrive dem, men også skrive scripts i Python eller andre sprog for at automatisere kommandoer, hvilket gør det muligt at skabe mere avancerede kontrolsystemer. Ved at udnytte disse værktøjer kan du sende præcise instruktioner, køre tests eller overvåge CanSat i realtid uden manuel indgriben.

:::

Dernæst ser vi på satellitsiden. Da vi har flere tilstande i programmet, bliver det lidt længere, men lad os gennemgå det trin for trin.

Først initialiserer vi systemerne som sædvanligt. TThere er også et par globale variabler, som vi placerer øverst i filen, så det er nemt at se, hvilke navne der bruges. `LED_IS_ON` er velkendt fra vores tidligere kodeeksempler, og derudover har vi en global tilstandsvariabel `STATE`, som gemmer... ja, tilstanden.

```Cpp title="Initialization"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Dernæst tjekker vi i løkken blot, hvilken underrutine der skal udføres i henhold til den aktuelle tilstand, og kalder dens funktion:

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
    // unknown mode
    delay(1000);
  }
}
```

I dette konkrete tilfælde er hver tilstand repræsenteret af en separat funktion, der kaldes baseret på tilstanden. Indholdet af funktionerne er ikke rigtig vigtigt her, men her er de:

```Cpp title="Subroutines"
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

Der er også en lille hjælpefunktion `blinkLED`, som hjælper med at undgå kodegentagelse ved at håndtere LED-toggling for os.

Til sidst ændres tilstanden, når ground station fortæller os det:

```Cpp title="Command received callback"
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
  <summary>Hele koden</summary>
  <p>Her er hele koden for din bekvemmelighed.</p>
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


Med dette kan vi nu styre, hvad satellitten gør, uden overhovedet at have fysisk adgang til den. I stedet kan vi bare sende en kommando med ground station, og satellitten gør, hvad vi vil.

:::tip[Øvelse]


Lav et program, som måler en sensor med en bestemt frekvens, som kan ændres med en fjernkommando til en vilkårlig værdi. I stedet for at bruge underrutiner, prøv at ændre en delay-værdi direkte med en kommando. 

Prøv også at gøre det tolerant over for uventede input, såsom "-1", "ABCDFEG" eller "".

Som en bonusøvelse kan du gøre den nye indstilling permanent mellem resets, så når satellitten slukkes og tændes igen, vil den genoptage transmission med den nye frekvens i stedet for at vende tilbage til den oprindelige. Som et tip kan det være nyttigt at genbesøge [lektion 5](./lesson5.md).

:::

---

I den næste lektion vil vi gøre vores datalagring, kommunikation og håndtering betydeligt mere effektiv og hurtig ved at bruge binære data. Selvom det kan virke abstrakt i starten, forenkler håndtering af data som binær i stedet for tal mange opgaver, da det er computerens modersmål.

[Klik her for den næste lektion!](./lesson9)