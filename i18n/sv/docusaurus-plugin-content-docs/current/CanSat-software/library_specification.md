---
sidebar_position: 1
---

# Biblioteksspecifikation

# Funktioner

Du kan använda alla vanliga Arduino-funktioner med CanSat NeXT, samt alla Arduino-bibliotek. Arduino-funktioner kan hittas här: https://www.arduino.cc/reference/en/.

CanSat NeXT-biblioteket lägger till flera lättanvända funktioner för att använda de olika inbyggda resurserna, såsom sensorer, radio och SD-kortet. Biblioteket kommer med en uppsättning exempelprogram som visar hur man använder dessa funktioner. Listan nedan visar också alla tillgängliga funktioner.

## Systeminitieringsfunktioner

### CanSatInit

| Funktion             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om initieringen lyckades, eller ett icke-nollvärde om det uppstod ett fel. |
| **Parametrar**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC-adress som delas av satelliten och markstationen. Detta är en valfri parameter - när den inte anges, initieras inte radion. Används i exempelprogram: Alla |
| **Beskrivning**      | Detta kommando finns i `setup()` i nästan alla CanSat NeXT-skript. Det används för att initiera CanSatNeXT-hårdvaran, inklusive sensorerna och SD-kortet. Dessutom, om `macAddress` anges, startar det radion och börjar lyssna efter inkommande meddelanden. MAC-adressen bör delas av markstationen och satelliten. MAC-adressen kan väljas fritt, men det finns några ogiltiga adresser såsom alla byte som är `0x00`, `0x01` och `0xFF`. Om init-funktionen anropas med en ogiltig adress, kommer det att rapportera problemet till Serial. |

### CanSatInit (förenklad MAC-adresspecifikation)

| Funktion             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om initieringen lyckades, eller ett icke-nollvärde om det uppstod ett fel. |
| **Parametrar**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Sista byten av MAC-adressen, används för att särskilja mellan olika CanSat-GS-par. |
| **Beskrivning**      | Detta är en förenklad version av CanSatInit med MAC-adress, som automatiskt ställer in de andra byten till ett känt säkert värde. Detta gör det möjligt för användarna att särskilja sina Sändare-Mottagare-par med bara ett värde, vilket kan vara 0-255.|

### GroundStationInit

| Funktion             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om initialiseringen lyckades, eller ett icke-nollvärde om det uppstod ett fel. |
| **Parametrar**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC-adress som delas av satelliten och markstationen.      |
| **Används i exempelsketch** | Groundstation receive                                          |
| **Beskrivning**      | Detta är en nära släkting till CanSatInit-funktionen, men den kräver alltid MAC-adressen. Denna funktion initierar endast radion, inte andra system. Markstationen kan vara vilken ESP32-kort som helst, inklusive vilken utvecklingskort som helst eller till och med ett annat CanSat NeXT-kort. |

### GroundStationInit (förenklad MAC-adresspecifikation)

| Funktion             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om initialiseringen lyckades, eller ett icke-nollvärde om det uppstod ett fel. |
| **Parametrar**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Sista byten av MAC-adressen, används för att särskilja mellan olika CanSat-GS-par. |
| **Beskrivning**      | Detta är en förenklad version av GroundStationInit med MAC-adress, som automatiskt ställer in de andra byten till ett känt säkert värde. Detta gör det möjligt för användarna att särskilja sina Sändare-Mottagare-par med bara ett värde, som kan vara 0-255.|

## IMU-funktioner

### readAcceleration

| Funktion             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om mätningen lyckades.                           |
| **Parametrar**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adress till en float-variabel där x-axelns data kommer att lagras. |
| **Används i exempelsketch** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa acceleration från den inbyggda IMU:n. Parametrarna är adresser till float-variabler för varje axel. Exemplet IMU visar hur man använder denna funktion för att läsa accelerationen. Accelerationen returneras i enheter av G (9,81 m/s²). |

### readAccelX

| Funktion             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                          |
| **Returvärde**       | Returnerar linjär acceleration på X-axeln i enheter av G.                           |
| **Används i exempelsketch** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa acceleration från den inbyggda IMU:n på en specifik axel. Exemplet IMU visar hur man använder denna funktion för att läsa accelerationen. Accelerationen returneras i enheter av G (9,81 m/s²). |

### readAccelY

| Funktion             | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                          |
| **Returvärde**       | Returnerar linjär acceleration på Y-axeln i enheter av G.                           |
| **Används i exempelskiss** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa acceleration från den inbyggda IMU:n på en specifik axel. Exemplet IMU visar hur man använder denna funktion för att läsa accelerationen. Accelerationen returneras i enheter av G (9,81 m/s). |

### readAccelZ

| Funktion             | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                          |
| **Returvärde**       | Returnerar linjär acceleration på Z-axeln i enheter av G.                           |
| **Används i exempelskiss** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa acceleration från den inbyggda IMU:n på en specifik axel. Exemplet IMU visar hur man använder denna funktion för att läsa accelerationen. Accelerationen returneras i enheter av G (9,81 m/s). |

### readGyro

| Funktion             | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om mätningen lyckades.                           |
| **Parametrar**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adress till en float-variabel där x-axelns data kommer att lagras. |
| **Används i exempelskiss** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa vinkelhastighet från den inbyggda IMU:n. Parametrarna är adresser till float-variabler för varje axel. Exemplet IMU visar hur man använder denna funktion för att läsa vinkelhastigheten. Vinkelhastigheten returneras i enheter mrad/s. |

### readGyroX

| Funktion             | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                          |
| **Returvärde**       | Returnerar vinkelhastighet på X-axeln i enheter av mrad/s.                           |
| **Används i exempelskiss** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa vinkelhastighet från den inbyggda IMU:n på en specifik axel. Parametrarna är adresser till float-variabler för varje axel. Vinkelhastigheten returneras i enheter mrad/s. |

### readGyroY

| Funktion             | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                          |
| **Returvärde**       | Returnerar vinkelhastighet på Y-axeln i enheter av mrad/s.                           |
| **Används i exempelskiss** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa vinkelhastighet från den inbyggda IMU:n på en specifik axel. Parametrarna är adresser till float-variabler för varje axel. Vinkelhastigheten returneras i enheter mrad/s. |

### readGyroZ

| Funktion             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                          |
| **Returvärde**       | Returnerar vinkelhastighet på Z-axeln i enheter av mrad/s.                           |
| **Används i exempelprogram** | IMU                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa vinkelhastighet från den inbyggda IMU:n på en specifik axel. Parametrarna är adresser till flyttalsvariabler för varje axel. Vinkelhastigheten returneras i enheter mrad/s. |

## Barometerfunktioner

### readPressure

| Funktion             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                            |
| **Returvärde**       | Tryck i mbar                                                   |
| **Parametrar**       | Inga                                                               |
| **Används i exempelprogram** | Baro                                                        |
| **Beskrivning**      | Denna funktion returnerar tryck som rapporteras av den inbyggda barometern. Trycket är i enheter av millibar. |

### readTemperature

| Funktion             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                            |
| **Returvärde**       | Temperatur i Celsius                                            |
| **Parametrar**       | Inga                                                               |
| **Används i exempelprogram** | Baro                                                        |
| **Beskrivning**      | Denna funktion returnerar temperatur som rapporteras av den inbyggda barometern. Enheten för avläsningen är Celsius. Observera att detta är den interna temperaturen mätt av barometern, så den kanske inte återspeglar den externa temperaturen. |

## SD-kort / Filsystemfunktioner

### SDCardPresent

| Funktion             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `bool`                                                             |
| **Returvärde**       | Returnerar true om den upptäcker ett SD-kort, false om inte.               |
| **Parametrar**       | Inga                                                               |
| **Används i exempelprogram** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion kan användas för att kontrollera om SD-kortet är mekaniskt närvarande. SD-kortkontakten har en mekanisk switch, som läses när denna funktion anropas. Returnerar true eller false beroende på om SD-kortet upptäcks. |

### appendFile

| Funktion             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om skrivningen lyckades.                             |
| **Parametrar**       |                                                                    |
|                      | `String filename`: Adress till filen som ska läggas till. Om filen inte finns, skapas den. |
|                      | `T data`: Data som ska läggas till i slutet av filen.             |
| **Används i exempelsketch** | SD_write                                               |
| **Beskrivning**      | Detta är den grundläggande skrivfunktionen som används för att lagra avläsningar på SD-kortet. |

### printFileSystem

| Funktion             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       | Inga                                                               |
| **Används i exempelsketch** | SD_advanced                                                |
| **Beskrivning**      | Detta är en liten hjälpfunktion för att skriva ut namn på filer och mappar som finns på SD-kortet. Kan användas i utveckling. |

### newDir

| Funktion             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `String path`: Sökväg till den nya katalogen. Om den redan finns, görs inget. |
| **Används i exempelsketch** | SD_advanced                                                |
| **Beskrivning**      | Används för att skapa nya kataloger på SD-kortet.                  |

### deleteDir

| Funktion             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `String path`: Sökväg till katalogen som ska raderas.              |
| **Används i exempelsketch** | SD_advanced                                                |
| **Beskrivning**      | Används för att radera kataloger på SD-kortet.                     |

### fileExists

| Funktion             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `bool`                                                             |
| **Returvärde**       | Returnerar true om filen finns.                                    |
| **Parametrar**       |                                                                    |
|                      | `String path`: Sökväg till filen.                                  |
| **Används i exempelsketch** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion kan användas för att kontrollera om en fil finns på SD-kortet. |

### fileSize

| Funktion             | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint32_t`                                                         |
| **Returvärde**       | Storleken på filen i byte.                                         |
| **Parametrar**       |                                                                    |
|                      | `String path`: Sökväg till filen.                                  |
| **Används i exempelskiss** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion kan användas för att läsa storleken på en fil på SD-kortet.|

### writeFile

| Funktion             | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om skrivningen lyckades.                              |
| **Parametrar**       |                                                                    |
|                      | `String filename`: Adress till filen som ska skrivas.              |
|                      | `T data`: Data som ska skrivas till filen.                     |
| **Används i exempelskiss** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion liknar `appendFile()`, men den skriver över befintlig data på SD-kortet. För datalagring bör `appendFile` användas istället. Denna funktion kan vara användbar för att lagra inställningar, till exempel.|

### readFile

| Funktion             | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `String`                                                           |
| **Returvärde**       | Allt innehåll i filen.                                             |
| **Parametrar**       |                                                                    |
|                      | `String path`: Sökväg till filen.                                  |
| **Används i exempelskiss** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion kan användas för att läsa all data från en fil till en variabel. Försök att läsa stora filer kan orsaka problem, men det fungerar bra för små filer, såsom konfigurations- eller inställningsfiler.|

### renameFile

| Funktion             | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `String oldpath`: Ursprunglig sökväg till filen.                   |
|                      | `String newpath`: Ny sökväg för filen.                             |
| **Används i exempelskiss** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion kan användas för att byta namn på eller flytta filer på SD-kortet.|

### deleteFile

| Funktion             | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `String path`: Sökvägen till filen som ska raderas.               |
| **Används i exempelsketch** | SD_advanced                                                |
| **Beskrivning**      | Denna funktion kan användas för att radera filer från SD-kortet.   |

## Radiofunktioner

### onDataReceived

| Funktion             | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `String data`: Mottagna data som en Arduino String.               |
| **Används i exempelsketch** | Groundstation_receive                                      |
| **Beskrivning**      | Detta är en callback-funktion som anropas när data tas emot. Användarkoden bör definiera denna funktion, och CanSat NeXT kommer automatiskt att anropa den när data tas emot. |

### onBinaryDataReceived

| Funktion             | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `const uint8_t *data`: Mottagna data som en uint8_t-array.         |
|                      | `uint16_t len`: Längden på mottagna data i byte.                   |
| **Används i exempelsketch** | Ingen                                                 |
| **Beskrivning**      | Detta liknar `onDataReceived`-funktionen, men data tillhandahålls som binär istället för ett String-objekt. Detta erbjuds för avancerade användare som finner String-objektet begränsande. |

### onDataSent

| Funktion             | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `void`                                                             |
| **Parametrar**       |                                                                    |
|                      | `const bool success`: Boolean som indikerar om data skickades framgångsrikt. |
| **Används i exempelsketch** | Ingen                                                 |
| **Beskrivning**      | Detta är en annan callback-funktion som kan läggas till i användarkoden om det behövs. Den kan användas för att kontrollera om mottagningen bekräftades av en annan radio. |

### getRSSI

| Funktion             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `int8_t`                                                          |
| **Returvärde**       | RSSI för det senast mottagna meddelandet. Returnerar 1 om inga meddelanden har mottagits sedan start.                           |
| **Används i exempelsketch** | Ingen                                                  |
| **Beskrivning**      | Denna funktion kan användas för att övervaka signalstyrkan för mottagningen. Den kan användas för att testa antenner eller bedöma radioräckvidden. Värdet uttrycks i [dBm](https://en.wikipedia.org/wiki/DBm), men skalan är inte exakt.  |

### sendData (String-variant)

| Funktion             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | 0 om data skickades (indikerar inte bekräftelse).                  |
| **Parametrar**       |                                                                    |
|                      | `T data`: Data som ska skickas. Alla typer av data kan användas, men konverteras internt till en sträng.                  |
| **Används i exempelsketch** | Send_data                                             |
| **Beskrivning**      | Detta är huvudfunktionen för att skicka data mellan markstationen och satelliten. Observera att returvärdet inte indikerar om data faktiskt mottogs, bara att det skickades. Callback-funktionen `onDataSent` kan användas för att kontrollera om datan mottogs av den andra änden. |

### sendData (Binär variant)

| Funktion             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | 0 om data skickades (indikerar inte bekräftelse).                  |
| **Parametrar**       |                                                                    |
|                      | `T* data`: Data som ska skickas.                    |
|                      | `uint16_t len`: Längden på datan i byte.                      |
| **Används i exempelsketch** | Ingen                                                 |
| **Beskrivning**      | En binär variant av `sendData`-funktionen, tillhandahållen för avancerade användare som känner sig begränsade av String-objektet. |

### getRSSI

| Funktion             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `int8_t`                                                          |
| **Returvärde**       | RSSI för det senast mottagna meddelandet. Returnerar 1 om inga meddelanden har mottagits sedan start.                           |
| **Används i exempelsketch** | Ingen                                                  |
| **Beskrivning**      | Denna funktion kan användas för att övervaka signalstyrkan vid mottagning. Den kan användas för att testa antenner eller bedöma radiotäckningen. Värdet uttrycks i [dBm](https://en.wikipedia.org/wiki/DBm), men skalan är inte exakt. 

### setRadioChannel

| Funktion             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Returtyp**         | `void`                                                          |
| **Returvärde**       | Ingen                                                            |
| **Parametrar**       | `uint8_t newChannel`: Önskat Wi-Fi-kanalnummer (1–11). Alla värden över 11 kommer att begränsas till 11. |
| **Används i exempelsketch** | Ingen                                                      |
| **Beskrivning**      | Ställer in ESP-NOW-kommunikationskanalen. Den nya kanalen måste vara inom standard Wi-Fi-kanalernas intervall (1–11), som motsvarar frekvenser från 2.412 GHz med steg om 5 MHz. Kanal 1 är 2.412, Kanal 2 är 2.417 och så vidare. Anropa denna funktion innan biblioteket initieras. Standardkanalen är 1. |

### getRadioChannel

| Funktion             | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                       |
| **Returvärde**       | Den aktuella primära Wi-Fi-kanalen. Returnerar 0 om det uppstår ett fel vid hämtning av kanalen. |
| **Används i exempelsketch** | Ingen                                                      |
| **Beskrivning**      | Hämtar den primära Wi-Fi-kanalen som för närvarande används. Denna funktion fungerar endast efter att biblioteket har initialiserats. |

### printRadioFrequency

| Funktion             | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Returtyp**         | `void`                                                          |
| **Returvärde**       | Ingen                                                            |
| **Används i exempelsketch** | Ingen                                                      |
| **Beskrivning**      | Beräknar och skriver ut den aktuella frekvensen i GHz baserat på den aktiva Wi-Fi-kanalen. Denna funktion fungerar endast efter att biblioteket har initialiserats. |


## ADC-funktioner

### adcToVoltage

| Funktion             | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                            |
| **Returvärde**       | Omvandlad spänning i volt.                                       |
| **Parametrar**       |                                                                    |
|                      | `int value`: ADC-avläsning som ska omvandlas till spänning.       |
| **Används i exempelsketch** | AccurateAnalogRead                                    |
| **Beskrivning**      | Denna funktion omvandlar en ADC-avläsning till spänning med hjälp av en kalibrerad tredje ordningens polynom för mer linjär omvandling. Observera att denna funktion beräknar spänningen vid ingångsstiftet, så för att beräkna batterispänningen måste du också ta hänsyn till motståndsnätverket. |

### analogReadVoltage

| Funktion             | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `float`                                                            |
| **Returvärde**       | ADC-spänning i volt.                                             |
| **Parametrar**       |                                                                    |
|                      | `int pin`: Stift som ska läsas.                                   |
| **Används i exempelsketch** | AccurateAnalogRead                                    |
| **Beskrivning**      | Denna funktion läser spänning direkt istället för att använda `analogRead` och omvandlar avläsningen till spänning internt med hjälp av `adcToVoltage`. |