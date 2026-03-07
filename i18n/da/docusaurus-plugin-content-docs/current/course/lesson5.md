---
sidebar_position: 5
---

# Lektion 5: At gemme Bits & Bytes

Nogle gange er det ikke muligt at få data direkte til en PC, f.eks. når vi kaster enheden rundt, affyrer den med en raket eller foretager målinger på svært tilgængelige steder. I sådanne tilfælde er det bedst at gemme de målte data på et SD-kort til videre behandling senere. Derudover kan SD-kortet også bruges til at gemme indstillinger – for eksempel kunne vi have en form for treshold-indstilling eller adresseindstillinger gemt på SD-kortet.

## SD-kort i CanSat NeXT-biblioteket

CanSat NeXT-biblioteket understøtter et stort udvalg af SD-kortoperationer. Det kan bruges til at gemme og læse filer, men også til at oprette mapper og nye filer, flytte dem rundt eller endda slette dem. Alle disse kan være nyttige i forskellige situationer, men lad os her holde fokus på de to grundlæggende ting – at læse en fil og at skrive data til en fil.

:::note

Hvis du vil have fuld kontrol over filsystemet, kan du finde kommandoerne i [Library Specification](./../CanSat-software/library_specification.md#sdcardpresent) eller i bibliotekseksemplet "SD_advanced".

:::

Som en øvelse kan vi ændre koden fra sidste lektion, så vi i stedet for at skrive LDR-målingerne til serial gemmer dem på SD-kortet.

Først definerer vi navnet på den fil, vi vil bruge. Lad os tilføje det før setup-funktionen som en **global variabel**.

```Cpp title="Modified Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Nu hvor vi har en filepath, kan vi skrive til SD-kortet. Vi skal kun bruge to linjer for at gøre det. Den bedste kommando til at gemme måledata er `appendFile()`, som blot tager filepath og skriver de nye data i slutningen af filen. Hvis filen ikke findes, opretter den den. Det gør kommandoen meget nem (og sikker) at bruge. Vi kan bare direkte tilføje data til den og derefter følge op med et linjeskift, så dataene er lettere at læse. Og det er det! Nu gemmer vi målingerne.

```Cpp title="Saving LDR data to the SD card"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR value:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Som standard gemmer `appendFile()`-kommandoen floating point-tal med to værdier efter decimalpunktet. For mere specifik funktionalitet kan du først oprette en string i sketchen og bruge kommandoen `appendFile()` til at gemme den string på SD-kortet. For eksempel:

```Cpp title="Saving LDR data to the SD card"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Her laves den endelige string først, hvor `String(LDR_voltage, 6)` angiver, at vi ønsker 6 decimaler efter punktummet. Vi kan bruge den samme string til udskrivning og lagring af data. (Samt til at transmittere via radio)

## Læsning af data

Det er ret ofte nyttigt også at gemme noget på SD-kortet til fremtidig brug i programmet. Det kan for eksempel være indstillinger om enhedens aktuelle tilstand, så hvis programmet nulstilles, kan vi indlæse den aktuelle status igen fra SD-kortet i stedet for at starte fra standardværdier.

For at demonstrere dette skal du på PC tilføje en ny fil til SD-kortet med navnet "delay_time" og skrive et tal i filen, f.eks. 200. Lad os prøve at erstatte den statisk satte delay-tid i vores program med en indstilling læst fra en fil.

Lad os prøve at læse indstillingsfilen i setup. Først introducerer vi en ny global variabel. Jeg gav den en standardværdi på 1000, så hvis vi ikke lykkes med at ændre delay-tiden, er dette nu standardindstillingen.

I setup bør vi først tjekke, om filen overhovedet findes. Det kan gøres med kommandoen `fileExists()`. Hvis den ikke gør, bruger vi bare standardværdien. Derefter kan data læses med `readFile()`. Vi skal dog bemærke, at det er en string – ikke et heltal, som vi har brug for. Så lad os konvertere den ved hjælp af Arduino-kommandoen `toInt()`. Til sidst tjekker vi, om konverteringen var succesfuld. Hvis den ikke var, vil værdien være nul, og i så fald fortsætter vi bare med at bruge standardværdien.

```Cpp title="Reading a setting in the setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Til sidst må du ikke glemme at ændre delay i loopet, så den bruger den nye variabel.

```Cpp title="Dynamically set delay value"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Du kan nu prøve at ændre værdien på SD-kortet eller endda fjerne SD-kortet, i hvilket tilfælde den nu bør bruge standardværdien for delay-længden.

:::note

For at overskrive indstillingen i dit program kan du bruge kommandoen [writeFile](./../CanSat-software/library_specification.md#writefile). Den fungerer ligesom [appendFile](./../CanSat-software/library_specification.md#appendfile), men overskriver alle eksisterende data.

:::

:::tip[Exercise]

Fortsæt fra din løsning på øvelsen i lektion 4, så tilstanden bevares, selv hvis enheden nulstilles. Dvs. gem den aktuelle tilstand på SD-kortet og læs den i setup. Dette ville simulere et scenarie, hvor din CanSat pludselig nulstilles under flyvning eller før flyvningen, og med dette program ville du stadig få en succesfuld flyvning.

:::

---

I næste lektion vil vi se på at bruge radio til at transmittere data mellem processorer. Du bør have en form for antenne i din CanSat NeXT og groundstationen, før du starter de øvelser. Hvis du ikke allerede har gjort det, så tag et kig på vejledningen til at bygge en grundlæggende antenne: [Building an antenna](./../CanSat-hardware/communication#quarter-wave-antenna).

[Klik her for den næste lektion!](./lesson6)