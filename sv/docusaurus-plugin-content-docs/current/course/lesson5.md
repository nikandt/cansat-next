---
sidebar_position: 5
---

# Lektion 5: Spara Bits & Bytes

Ibland är det inte möjligt att få data direkt till en PC, som när vi kastar runt enheten, skjuter upp den med en raket, eller tar mätningar på svåråtkomliga platser. I sådana fall är det bäst att spara den uppmätta datan på ett SD-kort för vidare bearbetning senare. Dessutom kan SD-kortet också användas för att lagra inställningar - till exempel kan vi ha någon typ av tröskelinställning eller adressinställningar lagrade på SD-kortet.

## SD-kort i CanSat NeXT-biblioteket

CanSat NeXT-biblioteket stöder ett stort antal SD-kortoperationer. Det kan användas för att spara och läsa filer, men också för att skapa kataloger och nya filer, flytta dem eller till och med ta bort dem. Alla dessa kan vara användbara i olika situationer, men låt oss fokusera här på de två grundläggande sakerna - läsa en fil och skriva data till en fil.

:::note

Om du vill ha full kontroll över filsystemet kan du hitta kommandona från [Library Specification](./../CanSat-software/library_specification.md#sdcardpresent) eller från biblioteks-exemplet "SD_advanced".

:::

Som en övning, låt oss ändra koden från förra lektionen så att vi istället för att skriva LDR-mätningarna till serien sparar dem på SD-kortet.

Först, låt oss definiera namnet på filen vi kommer att använda. Låt oss lägga till det före setup-funktionen som en **global variabel**.

```Cpp title="Modified Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Nu när vi har en filväg kan vi skriva till SD-kortet. Vi behöver bara två rader för att göra det. Det bästa kommandot att använda för att spara mätdata är `appendFile()`, som bara tar filvägen och skriver den nya datan i slutet av filen. Om filen inte finns skapar den den. Detta gör att kommandot är mycket enkelt (och säkert) att använda. Vi kan bara direkt lägga till datan till den och sedan följa det med en radbrytning så att datan blir lättare att läsa. Och det är allt! Nu lagrar vi mätningarna.

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

Som standard lagrar `appendFile()`-kommandot flyttal med två värden efter decimalpunkten. För mer specifik funktionalitet kan du först skapa en sträng i skissen och använda kommandot `appendFile()` för att lagra den strängen på SD-kortet. Så till exempel:

```Cpp title="Saving LDR data to the SD card"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Här skapas den slutliga strängen först, med `String(LDR_voltage, 6)` som specificerar att vi vill ha 6 decimaler efter punkten. Vi kan använda samma sträng för att skriva ut och lagra datan. (Samt för att sända via radio)

## Läsa Data

Det är ganska ofta användbart att lagra något på SD-kortet för framtida användning i programmet också. Dessa kan till exempel vara inställningar om enhetens nuvarande tillstånd, så att om programmet återställs kan vi ladda det aktuella tillståndet igen från SD-kortet istället för att börja från standardvärden.

För att demonstrera detta, lägg till på PC en ny fil på SD-kortet kallad "delay_time", och skriv ett nummer i filen, som 200. Låt oss försöka ersätta den statiskt inställda fördröjningstiden i vårt program med en inställning läst från en fil.

Låt oss försöka läsa inställningsfilen i setup. Först, låt oss introducera en ny global variabel. Jag gav den ett standardvärde på 1000, så att om vi inte lyckas ändra fördröjningstiden är detta nu standardinställningen.

I setup bör vi först kontrollera om filen ens finns. Detta kan göras med kommandot `fileExists()`. Om den inte finns, låt oss bara använda standardvärdet. Efter detta kan datan läsas med `readFile()`. Vi bör dock notera att det är en sträng - inte ett heltal som vi behöver att det ska vara. Så, låt oss konvertera det med Arduino-kommandot `toInt()`. Slutligen kontrollerar vi om konverteringen lyckades. Om den inte gjorde det kommer värdet att vara noll, i vilket fall vi bara fortsätter att använda standardvärdet.

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

Slutligen, glöm inte att ändra fördröjningen i loopen för att använda den nya variabeln.

```Cpp title="Dynamically set delay value"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Du kan nu prova att ändra värdet på SD-kortet, eller till och med ta bort SD-kortet, i vilket fall det nu borde använda standardvärdet för fördröjningslängden.

:::note

För att skriva om inställningen i ditt program kan du använda kommandot [writeFile](./../CanSat-software/library_specification.md#writefile). Det fungerar precis som [appendFile](./../CanSat-software/library_specification.md#appendfile), men skriver över all befintlig data.

:::

:::tip[Övning]

Fortsätt från din lösning till övningen i lektion 4, så att tillståndet bibehålls även om enheten återställs. D.v.s. lagra det aktuella tillståndet på SD-kortet och läs det i setup. Detta skulle simulera ett scenario där din CanSat plötsligt återställs under flygning eller före flygningen, och med detta program skulle du fortfarande få en lyckad flygning.

:::

---

I nästa lektion kommer vi att titta på att använda radio för att överföra data mellan processorer. Du bör ha någon typ av antenn i din CanSat NeXT och markstationen innan du börjar med dessa övningar. Om du inte redan har gjort det, ta en titt på handledningen för att bygga en grundläggande antenn: [Bygga en antenn](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

[Klicka här för nästa lektion!](./lesson6)