---
sidebar_position: 1
---

# Biblioteksspecifikation

# Funktioner

Du kan bruge alle almindelige Arduino-funktionaliteter med CanSat NeXT samt alle Arduino-biblioteker. Arduino-funktioner kan findes her: https://www.arduino.cc/reference/en/.

CanSat NeXT-biblioteket tilføjer flere brugervenlige funktioner til at bruge de forskellige indbyggede ressourcer, såsom sensorer, radio og SD-kortet. Biblioteket leveres med et sæt eksempel-sketches, der viser, hvordan man bruger disse funktionaliteter. Listen nedenfor viser også alle tilgængelige funktioner.

## Systeminitialiseringsfunktioner

### CanSatInit

| Function             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returnerer 0, hvis initialiseringen var vellykket, eller en ikke-nul værdi, hvis der opstod en fejl. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC-adresse delt af satellitten og jordstationen. Dette er en valgfri parameter – når den ikke angives, initialiseres radioen ikke. Brugt i eksempel-sketch: All |
| **Description**      | Denne kommando findes i `setup()` i næsten alle CanSat NeXT-scripts. Den bruges til at initialisere CanSatNeXT-hardwaren, herunder sensorerne og SD-kortet. Derudover, hvis `macAddress` angives, starter den radioen og begynder at lytte efter indgående beskeder. MAC-adressen skal deles af jordstationen og satellitten. MAC-adressen kan vælges frit, men der findes nogle ugyldige adresser, såsom at alle bytes er `0x00`, `0x01` og `0xFF`. Hvis init-funktionen kaldes med en ugyldig adresse, vil den rapportere problemet til Serial. |

### CanSatInit (forenklet MAC-adressespecifikation)

| Function             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returnerer 0, hvis initialiseringen var vellykket, eller en ikke-nul værdi, hvis der opstod en fejl. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Sidste byte af MAC-adressen, brugt til at skelne mellem forskellige CanSat-GS-par. |
| **Description**      | Dette er en forenklet version af CanSatInit med MAC-adresse, som automatisk sætter de andre bytes til en kendt sikker værdi. Dette gør det muligt for brugerne at skelne deres Transmitter-Receiver-par med blot én værdi, som kan være 0-255.|

### GroundStationInit

| Funktion             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | Returnerer 0, hvis initialiseringen var vellykket, eller en ikke-nul værdi, hvis der opstod en fejl. |
| **Parametre**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC-adresse delt af satellitten og jordstationen. |
| **Brugt i eksempel-sketch** | Groundstation receive                                          |
| **Beskrivelse**      | Dette er en nær slægtning til funktionen CanSatInit, men den kræver altid MAC-adressen. Denne funktion initialiserer kun radioen, ikke andre systemer. Jordstationen kan være et hvilket som helst ESP32-board, inklusive ethvert devboard eller endda et andet CanSat NeXT-board. |

### GroundStationInit (forenklet MAC-adressespecifikation)

| Funktion             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | Returnerer 0, hvis initialiseringen var vellykket, eller en ikke-nul værdi, hvis der opstod en fejl. |
| **Parametre**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Sidste byte af MAC-adressen, brugt til at skelne mellem forskellige CanSat-GS-par. |
| **Beskrivelse**      | Dette er en forenklet version af GroundStationInit med MAC-adresse, som automatisk sætter de andre bytes til en kendt sikker værdi. Dette gør det muligt for brugerne at skelne deres Sender-Modtager-par med blot én værdi, som kan være 0-255.|

## IMU-funktioner

### readAcceleration

| Funktion             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | Returnerer 0, hvis målingen var vellykket.                           |
| **Parametre**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adressen på en float-variabel, hvor data for x-aksen vil blive gemt. |
| **Brugt i eksempel-sketch** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse acceleration fra den indbyggede IMU. Parametrene er adresser til float-variabler for hver akse. Eksemplet IMU viser, hvordan man bruger denne funktion til at læse accelerationen. Accelerationen returneres i enheder af G (9,81 m/s). |

### readAccelX

| Funktion             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                          |
| **Returværdi**       | Returnerer lineær acceleration på X-aksen i enheder af G.                           |
| **Brugt i eksempel-sketch** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse acceleration fra den indbyggede IMU på en specifik akse. Eksemplet IMU viser, hvordan man bruger denne funktion til at læse accelerationen. Accelerationen returneres i enheder af G (9,81 m/s). |

### readAccelY

| Funktion             | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                          |
| **Returværdi**       | Returnerer lineær acceleration på Y-aksen i enheder af G.                           |
| **Brugt i eksempel-skitse** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse acceleration fra den indbyggede IMU på en specifik akse. Eksemplet IMU viser, hvordan man bruger denne funktion til at læse accelerationen. Accelerationen returneres i enheder af G (9,81 m/s). |

### readAccelZ

| Funktion             | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                          |
| **Returværdi**       | Returnerer lineær acceleration på Z-aksen i enheder af G.                           |
| **Brugt i eksempel-skitse** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse acceleration fra den indbyggede IMU på en specifik akse. Eksemplet IMU viser, hvordan man bruger denne funktion til at læse accelerationen. Accelerationen returneres i enheder af G (9,81 m/s). |

### readGyro

| Funktion             | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | Returnerer 0, hvis målingen var vellykket.                           |
| **Parametre**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adressen på en float-variabel, hvor data for x-aksen vil blive gemt. |
| **Brugt i eksempel-skitse** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse vinkelhastighed fra den indbyggede IMU. Parametrene er adresser til float-variabler for hver akse. Eksemplet IMU viser, hvordan man bruger denne funktion til at læse vinkelhastigheden. Vinkelhastigheden returneres i enhederne mrad/s. |

### readGyroX

| Funktion             | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                          |
| **Returværdi**       | Returnerer vinkelhastighed på X-aksen i enhederne mrad/s.                           |
| **Brugt i eksempel-skitse** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse vinkelhastighed fra den indbyggede IMU på en specifik akse. Parametrene er adresser til float-variabler for hver akse. Vinkelhastigheden returneres i enhederne mrad/s. |

### readGyroY

| Funktion             | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                          |
| **Returværdi**       | Returnerer vinkelhastighed på Y-aksen i enhederne mrad/s.                           |
| **Brugt i eksempel-skitse** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse vinkelhastighed fra den indbyggede IMU på en specifik akse. Parametrene er adresser til float-variabler for hver akse. Vinkelhastigheden returneres i enhederne mrad/s. |

### readGyroZ

| Funktion             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                          |
| **Returværdi**       | Returnerer vinkelhastighed på Z-aksen i enheder af mrad/s.                           |
| **Brugt i eksempel-sketch** | IMU                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at læse vinkelhastighed fra den indbyggede IMU på en specifik akse. Parametrene er adresser til float-variabler for hver akse. Vinkelhastigheden returneres i enhederne mrad/s. |

## Barometerfunktioner

### readPressure

| Funktion             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                            |
| **Returværdi**       | Tryk i mbar                                                        |
| **Parametre**        | Ingen                                                               |
| **Brugt i eksempel-sketch** | Baro                                                        |
| **Beskrivelse**      | Denne funktion returnerer tryk som rapporteret af det indbyggede barometer. Trykket er i enheder af millibar. |

### readTemperature

| Funktion             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                            |
| **Returværdi**       | Temperatur i Celsius                                            |
| **Parametre**        | Ingen                                                               |
| **Brugt i eksempel-sketch** | Baro                                                        |
| **Beskrivelse**      | Denne funktion returnerer temperatur som rapporteret af det indbyggede barometer. Enheden for målingen er Celsius. Bemærk, at dette er den interne temperatur målt af barometeret, så den afspejler muligvis ikke den eksterne temperatur. |

## SD-kort-/filsystemfunktioner

### SDCardPresent

| Funktion             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `bool`                                                             |
| **Returværdi**       | Returnerer true, hvis den registrerer et SD-kort, false hvis ikke.               |
| **Parametre**        | Ingen                                                               |
| **Brugt i eksempel-sketch** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion kan bruges til at kontrollere, om SD-kortet er mekanisk til stede. SD-kortstikket har en mekanisk kontakt, som aflæses, når denne funktion kaldes. Returnerer true eller false afhængigt af, om SD-kortet registreres. |

### appendFile

| Funktion             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | Returnerer 0, hvis skrivningen var vellykket.                      |
| **Parametre**        |                                                                    |
|                      | `String filename`: Adressen på filen, der skal tilføjes til. Hvis filen ikke findes, oprettes den. |
|                      | `T data`: Data, der skal tilføjes i slutningen af filen.           |
| **Brugt i eksempel-skitse** | SD_write                                               |
| **Beskrivelse**      | Dette er den grundlæggende skrivefunktion, der bruges til at gemme målinger på SD-kortet. |

### printFileSystem

| Funktion             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        | Ingen                                                              |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Dette er en lille hjælpefunktion til at udskrive navne på filer og mapper, der findes på SD-kortet. Kan bruges under udvikling. |

### newDir

| Funktion             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `String path`: Stien til den nye mappe. Hvis den allerede findes, gøres der intet. |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Bruges til at oprette nye mapper på SD-kortet.                     |

### deleteDir

| Funktion             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `String path`: Stien til den mappe, der skal slettes.              |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Bruges til at slette mapper på SD-kortet.                          |

### fileExists

| Funktion             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `bool`                                                             |
| **Returværdi**       | Returnerer true, hvis filen findes.                                |
| **Parametre**        |                                                                    |
|                      | `String path`: Stien til filen.                                    |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion kan bruges til at kontrollere, om en fil findes på SD-kortet. |

### fileSize

| Funktion             | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint32_t`                                                         |
| **Returværdi**       | Filens størrelse i bytes.                                          |
| **Parametre**        |                                                                    |
|                      | `String path`: Sti til filen.                                      |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion kan bruges til at læse størrelsen på en fil på SD-kortet.|

### writeFile

| Funktion             | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | Returnerer 0, hvis skrivningen var vellykket.                       |
| **Parametre**        |                                                                    |
|                      | `String filename`: Adresse på den fil, der skal skrives til.        |
|                      | `T data`: Data, der skal skrives til filen.                     |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion ligner `appendFile()`, men den overskriver eksisterende data på SD-kortet. Til datalagring bør `appendFile` bruges i stedet. Denne funktion kan være nyttig til f.eks. at gemme indstillinger.|

### readFile

| Funktion             | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `String`                                                           |
| **Returværdi**       | Alt indhold i filen.                                               |
| **Parametre**        |                                                                    |
|                      | `String path`: Sti til filen.                                      |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion kan bruges til at læse alle data fra en fil ind i en variabel. Forsøg på at læse store filer kan give problemer, men det er fint til små filer, såsom konfigurations- eller indstillingsfiler.|

### renameFile

| Funktion             | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `String oldpath`: Oprindelig sti til filen.                       |
|                      | `String newpath`: Ny sti til filen.                               |
| **Brugt i eksempel-skitse** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion kan bruges til at omdøbe eller flytte filer på SD-kortet.  |

### deleteFile

| Funktion             | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `String path`: Sti til filen, der skal slettes.                   |
| **Brugt i eksempel-sketch** | SD_advanced                                                |
| **Beskrivelse**      | Denne funktion kan bruges til at slette filer fra SD-kortet.        |

## Radiofunktioner

### onDataReceived

| Funktion             | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `String data`: Modtagne data som en Arduino String.               |
| **Brugt i eksempel-sketch** | Groundstation_receive                                      |
| **Beskrivelse**      | Dette er en callback-funktion, der kaldes, når data modtages. Brugerens kode skal definere denne funktion, og CanSat NeXT vil kalde den automatisk, når data modtages. |

### onBinaryDataReceived

| Funktion             | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `const uint8_t *data`: Modtagne data som et uint8_t-array.         |
|                      | `uint16_t len`: Længden af de modtagne data i bytes.                      |
| **Brugt i eksempel-sketch** | Ingen                                                 |
| **Beskrivelse**      | Dette svarer til funktionen `onDataReceived`, men data leveres som binære data i stedet for et String-objekt. Dette er beregnet til avancerede brugere, som finder String-objektet begrænsende. |

### onDataSent

| Funktion             | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `void`                                                             |
| **Parametre**        |                                                                    |
|                      | `const bool success`: Boolsk værdi, der angiver, om data blev sendt korrekt. |
| **Brugt i eksempel-sketch** | Ingen                                                 |
| **Beskrivelse**      | Dette er en anden callback-funktion, som kan tilføjes til brugerens kode efter behov. Den kan bruges til at kontrollere, om modtagelsen blev bekræftet af en anden radio. |


### getRSSI

| Funktion             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `int8_t`                                                          |
| **Returværdi**       | RSSI for den sidst modtagne besked. Returnerer 1, hvis der ikke er modtaget nogen beskeder siden opstart.                           |
| **Brugt i eksempel-sketch** | Ingen                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at overvåge signalstyrken for modtagelsen. Den kan bruges til at teste antenner eller vurdere radioens rækkevidde. Værdien udtrykkes i [dBm](https://en.wikipedia.org/wiki/DBm), men skalaen er ikke nøjagtig.  |

### sendData (String-variant)

| Funktion             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | 0 hvis data blev sendt (indikerer ikke kvittering).            |
| **Parametre**        |                                                                    |
|                      | `T data`: Data, der skal sendes. Enhver datatype kan bruges, men konverteres internt til en streng.                  |
| **Brugt i eksempel-sketch** | Send_data                                             |
| **Beskrivelse**      | Dette er hovedfunktionen til at sende data mellem jordstationen og satellitten. Bemærk, at returværdien ikke indikerer, om data faktisk blev modtaget, kun at det blev sendt. Callbacken `onDataSent` kan bruges til at kontrollere, om data blev modtaget i den anden ende. |

### sendData (Binær variant) {#sendData-binary}

| Funktion             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                          |
| **Returværdi**       | 0 hvis data blev sendt (indikerer ikke kvittering).            |
| **Parametre**        |                                                                    |
|                      | `T* data`: Data, der skal sendes.                    |
|                      | `uint16_t len`: Længden af data i bytes.                      |
| **Brugt i eksempel-sketch** | Ingen                                                 |
| **Beskrivelse**      | En binær variant af `sendData`-funktionen, leveret til avancerede brugere, der føler sig begrænset af String-objektet. |

### getRSSI

| Funktion             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `int8_t`                                                          |
| **Returværdi**       | RSSI for den sidst modtagne besked. Returnerer 1 hvis ingen beskeder er blevet modtaget siden boot.                           |
| **Brugt i eksempel-sketch** | Ingen                                                  |
| **Beskrivelse**      | Denne funktion kan bruges til at overvåge signalstyrken for modtagelsen. Den kan bruges til at teste antenner eller vurdere radioens rækkevidde. Værdien er angivet i [dBm](https://en.wikipedia.org/wiki/DBm), men skalaen er ikke nøjagtig. 

### setRadioChannel

| Funktion             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Returtype**        | `void`                                                          |
| **Returværdi**       | Ingen                                                            |
| **Parametre**        | `uint8_t newChannel`: Ønsket Wi-Fi-kanalnummer (1–11). Enhver værdi over 11 vil blive begrænset til 11. |
| **Brugt i eksempel-sketch** | Ingen                                                      |
| **Beskrivelse**      | Indstiller ESP-NOW-kommunikationskanalen. Den nye kanal skal være inden for området af standard Wi-Fi-kanaler (1–11), som svarer til frekvenser startende fra 2.412 GHz med trin på 5 MHz. Kanal 1 er 2.412, Kanal 2 er 2.417 og så videre. Kald denne funktion før initialisering af biblioteket. Standardkanalen er 1. |

### getRadioChannel

| Funktion             | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Returtype**        | `uint8_t`                                                       |
| **Returværdi**       | Den aktuelle primære Wi-Fi-kanal. Returnerer 0, hvis der opstår en fejl ved hentning af kanalen. |
| **Brugt i eksempel-skitse** | Ingen                                                      |
| **Beskrivelse**      | Henter den primære Wi-Fi-kanal, der aktuelt er i brug. Denne funktion virker kun efter initialisering af biblioteket. |

### printRadioFrequency

| Funktion             | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Returtype**        | `void`                                                          |
| **Returværdi**       | Ingen                                                            |
| **Brugt i eksempel-skitse** | Ingen                                                      |
| **Beskrivelse**      | Beregner og udskriver den aktuelle frekvens i GHz baseret på den aktive Wi-Fi-kanal. Denne funktion virker kun efter initialisering af biblioteket. |


## ADC-funktioner

### adcToVoltage

| Funktion             | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                            |
| **Returværdi**       | Konverteret spænding i volt.                                      |
| **Parametre**        |                                                                    |
|                      | `int value`: ADC-aflæsning, der skal konverteres til spænding.     |
| **Brugt i eksempel-skitse** | AccurateAnalogRead                                    |
| **Beskrivelse**      | Denne funktion konverterer en ADC-aflæsning til spænding ved hjælp af et kalibreret tredjegradspolynomium for en mere lineær konvertering. Bemærk, at denne funktion beregner spændingen ved indgangsbenet, så for at beregne batterispændingen skal du også tage højde for modstandsnetværket. |

### analogReadVoltage

| Funktion             | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Returtype**        | `float`                                                            |
| **Returværdi**       | ADC-spænding i volt.                                              |
| **Parametre**        |                                                                    |
|                      | `int pin`: Ben, der skal aflæses.                                 |
| **Brugt i eksempel-skitse** | AccurateAnalogRead                                    |
| **Beskrivelse**      | Denne funktion læser spænding direkte i stedet for at bruge `analogRead` og konverterer aflæsningen til spænding internt ved hjælp af `adcToVoltage`. |