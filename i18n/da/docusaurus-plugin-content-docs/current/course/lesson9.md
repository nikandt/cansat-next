---
sidebar_position: 10
---

# Lektion 9: Ettaller og nuller

Indtil nu har vi brugt tekst, når vi lagrer eller transmitterer data. Selvom det gør det nemt at fortolke, er det også ineffektivt. Computere bruger internt **binære** data, hvor data lagres som sæt af ettaller og nuller. I denne lektion ser vi på måder at bruge binære data med CanSat NeXT og diskuterer, hvor og hvorfor det kan være nyttigt at gøre det.

:::info

## Forskellige datatyper

I binær form repræsenteres alle data—uanset om det er tal, tekst eller sensoraflæsninger—som en serie af ettaller og nuller. Forskellige datatyper bruger forskellige mængder hukommelse og fortolker de binære værdier på bestemte måder. Lad os kort gennemgå nogle almindelige datatyper, og hvordan de lagres binært:

- **Heltal (int)**:  
  Heltal repræsenterer hele tal. I et 16-bit heltal kan 16 ettaller og nuller for eksempel repræsentere værdier fra \(-32,768\) til \(32,767\). Negative tal lagres ved hjælp af en metode kaldet **to-komplement**.

- **Usigneret heltal (uint)**:  
  Usignerede heltal repræsenterer ikke-negative tal. Et 16-bit usigneret heltal kan lagre værdier fra \(0\) til \(65,535\), da ingen bits er reserveret til fortegnet.

- **Float**:  
  Flydende kommatal repræsenterer decimale værdier. I en 32-bit float repræsenterer en del af bitsene fortegn, eksponent og mantisse, hvilket gør det muligt for computere at håndtere meget store og meget små tal. Det er i bund og grund en binær form af [videnskabelig notation](https://en.wikipedia.org/wiki/Scientific_notation).

- **Tegn (char)**:  
  Tegn lagres ved hjælp af kodningsskemaer som **ASCII** eller **UTF-8**. Hvert tegn svarer til en specifik binær værdi (f.eks. lagres 'A' i ASCII som `01000001`).

- **Strenge**:  
  Strenge er blot samlinger af tegn. Hvert tegn i en streng lagres i rækkefølge som individuelle binære værdier. For eksempel ville strengen `"CanSat"` blive lagret som en serie af tegn som `01000011 01100001 01101110 01010011 01100001 01110100` (hver repræsenterer 'C', 'a', 'n', 'S', 'a', 't'). Som du kan se, er det mindre effektivt at repræsentere tal som strenge, som vi har gjort indtil nu, sammenlignet med at lagre dem som binære værdier.

- **Arrays og `uint8_t`**:  
  Når man arbejder med binære data, er det almindeligt at bruge et array af `uint8_t` til at lagre og håndtere rå byte-data. Typen `uint8_t` repræsenterer et usigneret 8-bit heltal, som kan indeholde værdier fra 0 til 255. Da hver byte består af 8 bits, er denne type velegnet til at indeholde binære data.
  Arrays af `uint8_t` bruges ofte til at oprette byte-buffere til at holde sekvenser af rå binære data (f.eks. pakker). Nogle foretrækker `char` eller andre variabler, men det betyder ikke rigtig noget, hvilken der bruges, så længe variablen har en længde på 1 byte.
:::

## Transmittering af binære data

Lad os starte med at flashe et simpelt program til CanSat og fokusere mere på jordstationssiden. Her er en simpel kode, der transmitterer en aflæsning i binært format:

```Cpp title="Transmit LDR data as binary"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

Koden ser ellers meget velkendt ud, men `sendData` tager nu to argumenter i stedet for kun ét - først **hukommelsesadressen** på de data, der skal transmitteres, og derefter **længden** af de data, der skal transmitteres. I dette forenklede tilfælde bruger vi blot adressen og længden af variablen `LDR_voltage`.

Hvis du prøver at modtage dette med den typiske jordstationskode, vil den bare udskrive volapyk, da den forsøger at fortolke de binære data, som om det var en streng. I stedet skal vi specificere for jordstationen, hvad dataene indeholder.

Først, lad os tjekke hvor lange de data faktisk er, som vi modtager.

```Cpp title="Check length of the received data"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");
}
```

Hver gang satellitten transmitterer, modtager vi 4 bytes på jordstationen. Da vi transmitterer en 32 bit float, virker det korrekt.

For at læse dataene skal vi tage den binære data-buffer fra inputstrømmen og kopiere dataene til en passende variabel. I dette simple tilfælde kan vi gøre det sådan her:


```Cpp title="Store the data into a variable"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Data: ");
  Serial.println(LDR_reading);
}
```

Først introducerer vi variablen `LDR_reading` til at holde de data, vi *ved*, vi har i bufferen. Derefter bruger vi `memcpy` (memory copy) til at kopiere de binære data fra `data`-bufferen ind i **hukommelsesadressen** på `LDR_reading`. Dette sikrer, at dataene overføres præcis som de blev lagret, og bevarer samme format som på satellitten.

Nu, hvis vi udskriver dataene, er det som om vi læste dem direkte på GS-siden. Det er ikke længere tekst som før, men de faktiske samme data, som vi læste på satellitsiden. Nu kan vi nemt behandle dem på GS-siden, som vi ønsker.

## At lave vores egen protokol

Den virkelige styrke ved binær dataoverførsel bliver tydelig, når vi har flere data at transmittere. Vi skal dog stadig sikre, at satellitten og jordstationen er enige om, hvilken byte der repræsenterer hvad. Dette kaldes en **pakkeprotokol**.

En pakkeprotokol definerer strukturen af de data, der transmitteres, og specificerer, hvordan man pakker flere datastykker ind i en enkelt transmission, og hvordan modtageren skal fortolke de indkommende bytes. Lad os bygge en simpel protokol, der transmitterer flere sensoraflæsninger på en struktureret måde.

Først, lad os læse alle accelerometer- og gyroskopkanaler og oprette **datapakken** ud fra aflæsningerne.

```Cpp title="Transmit LDR data as binary"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Create an array to hold the data
  uint8_t packet[24];

  // Copy data into the packet
  memcpy(&packet[0], &ax, 4);  // Copy accelerometer X into bytes 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copy gyroscope Z into bytes 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Her læser vi først dataene ligesom i Lektion 3, men derefter **koder** vi dataene ind i en datapakke. Først oprettes selve bufferen, som blot er et tomt sæt på 24 bytes. Hver datavariabel kan derefter skrives til denne tomme buffer med `memcpy`. Da vi bruger `float`, har dataene en længde på 4 bytes. Hvis du er i tvivl om længden af en variabel, kan du altid tjekke det med `sizeof(variable)`.

:::tip[Øvelse]

Lav en jordstationssoftware til at fortolke og udskrive accelerometer- og gyroskopdata.

:::

## Lagring af binære data på SD-kort

At skrive data som binært til SD-kortet kan være nyttigt, når man arbejder med meget store mængder data, da binær lagring er mere kompakt og effektiv end tekst. Det gør det muligt at gemme flere data med mindre lagerplads, hvilket kan være nyttigt i et system med begrænsede hukommelsesressourcer.

Brug af binære data til lagring kommer dog med kompromiser. I modsætning til tekstfiler er binære filer ikke menneskeligt læsbare, hvilket betyder, at de ikke nemt kan åbnes og forstås med standard teksteditorer eller importeres til programmer som Excel. For at læse og fortolke binære data skal der udvikles specialiseret software eller scripts (f.eks. i Python) til at parse det binære format korrekt.

Til de fleste anvendelser, hvor nem adgang og fleksibilitet er vigtigt (såsom at analysere data på en computer senere), anbefales tekstbaserede formater som CSV. Disse formater er nemmere at arbejde med i en række softwareværktøjer og giver mere fleksibilitet til hurtig dataanalyse.

Hvis du er fast besluttet på at bruge binær lagring, så kig dybere "under motorhjelmen" ved at gennemgå, hvordan CanSat-biblioteket håndterer datalagring internt. Du kan direkte bruge C-style filhåndteringsmetoder til at håndtere filer, streams og andre low-level operationer effektivt. Mere information kan også findes i [Arduino SD card libary](https://docs.arduino.cc/libraries/sd/).

---

Vores programmer begynder at blive mere og mere komplicerede, og der er også nogle komponenter, som ville være rare at genbruge andre steder. For at undgå at gøre vores kode svær at håndtere, ville det være rart at kunne dele nogle komponenter på tværs af forskellige filer og holde koden læsbar. Lad os se på, hvordan dette kan opnås med Arduino IDE.

[Klik her for den næste lektion!](./lesson10)