---
sidebar_position: 12
---

# Lektion 11: Satelliten måste växa

Även om CanSat NeXT redan har många integrerade sensorer och enheter på satellitkortet självt, kräver många spännande CanSat-uppdrag användning av andra externa sensorer, servon, kameror, motorer eller andra ställdon och enheter. Denna lektion skiljer sig något från de tidigare, eftersom vi kommer att diskutera integrationen av olika externa enheter till CanSat. Ditt faktiska användningsfall är förmodligen inte övervägt, men kanske något liknande är det. Om det finns något du tycker borde täckas här, vänligen skicka feedback till mig på samuli@kitsat.fi.

Denna lektion skiljer sig något från de tidigare, eftersom all information är användbar, men du bör känna dig fri att hoppa till de områden som är relevanta för ditt projekt specifikt, och använda denna sida som en referens. Men innan du fortsätter med denna lektion, vänligen titta igenom materialet som presenteras i [hårdvaru](./../CanSat-hardware/CanSat-hardware.md) sektionen av CanSat NeXT-dokumentationen, eftersom den täcker mycket information som krävs för att integrera externa enheter.

## Ansluta externa enheter

Det finns två bra sätt att ansluta externa enheter till CanSat NeXT: Använda [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) och anpassade PCB:er. Att göra din egen PCB är enklare (och billigare) än du kanske tror, och för att komma igång med dem är en bra startpunkt denna [KiCAD-tutorial](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Vi har också en [mall](../CanSat-hardware/mechanical_design.md#designing-a-custom-pcb) tillgänglig för KiCAD, så att göra dina kort i samma format är mycket enkelt.

Med det sagt, för de flesta CanSat-uppdrag är lödning av de externa sensorerna eller andra enheter till ett perf board ett utmärkt sätt att skapa pålitliga, robusta elektronikstackar.

Ett ännu enklare sätt att komma igång, särskilt vid första prototypen, är att använda jumperkablar (även kallade Dupont-kablar eller breadboard-tråd). De tillhandahålls vanligtvis även med sensorbrytare, men kan också köpas separat. Dessa delar samma 0,1-tums pitch som används av förlängningsstiftlisten, vilket gör det mycket enkelt att ansluta enheter med kablar. Men även om kablar är lätta att använda, är de ganska skrymmande och opålitliga. Av denna anledning rekommenderas det varmt att undvika kablar för flygmodellen av din CanSat.

## Dela ström till enheterna

CanSat NeXT använder 3,3 volt för alla sina egna enheter, vilket är anledningen till att det är den enda spänningslinjen som tillhandahålls till förlängningsstiftlisten också. Många kommersiella brytare, särskilt äldre, stöder också 5 volts drift, eftersom det är spänningen som används av äldre Arduinos. Men de allra flesta enheter stöder också drift direkt genom 3,3 volt.

För de få fall där 5 volt absolut krävs kan du inkludera en **boost-omvandlare** på kortet. Det finns färdiga moduler tillgängliga, men du kan också direkt löda många enheter till perf board. Med det sagt, försök först använda enheten från 3,3 volt istället, eftersom det finns en god chans att det kommer att fungera.

Den maximalt rekommenderade strömförbrukningen från 3,3 volts linjen är 300 mA, så för strömkrävande enheter som motorer eller värmare, överväg en extern strömkälla.

## Databussar

Förlängningsstiftlisten har totalt 16 stift, varav två är reserverade för jord- och strömlinjer. Resten är olika typer av ingångar och utgångar, varav de flesta har flera möjliga användningsområden. Kortets stiftkonfiguration visar vad var och en av stiften kan göra.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Alla exponerade stift kan användas som allmänna ingångar och utgångar (GPIO), vilket innebär att du kan utföra `digitalWrite` och `digitalRead` funktioner med dem i koden.

### ADC

Stift 33 och 32 har en analog till digital-omvandlare (ADC), vilket innebär att du kan använda `analogRead` (och `adcToVoltage`) för att läsa spänningen på detta stift.

### DAC

Dessa stift kan användas för att skapa en specifik spänning på utgången. Observera att de producerar den önskade spänningen, men de kan bara ge en mycket liten mängd ström. Dessa kan användas som referenspunkter för sensorer, eller till och med som en ljudutgång, men du behöver en förstärkare (eller två). Du kan använda `dacWrite` för att skriva spänningen. Det finns också ett exempel i CanSat-biblioteket för detta.

### SPI

Serial Peripheral Interface (SPI) är en standard datalinje, ofta använd av Arduino-brytare och liknande enheter. En SPI-enhet behöver fyra stift:

| **Pin Name**    | **Description**                                              | **Usage**                                                       |
|-----------------|--------------------------------------------------------------|-----------------------------------------------------------------|
| **MOSI**        | Main Out Secondary In                                         | Data skickad från huvudenheten (t.ex. CanSat) till sekundärenheten. |
| **MISO**        | Main In Secondary Out                                         | Data skickad från sekundärenheten tillbaka till huvudenheten.      |
| **SCK**         | Serial Clock                                                  | Klocksignal genererad av huvudenheten för att synkronisera kommunikationen. |
| **SS/CS**       | Secondary Select/Chip Select                                  | Används av huvudenheten för att välja vilken sekundärenhet att kommunicera med. |

Här är huvud CanSat NeXT-kortet, och sekundär är vilken enhet du vill kommunicera med. MOSI, MISO och SCK-stiften kan delas av flera sekundärer, men alla behöver sina egna CS-stift. CS-stiftet kan vara vilket GPIO-stift som helst, vilket är anledningen till att det inte finns ett dedikerat i bussen.

(Obs: Äldre material använder ibland termerna "master" och "slave" för att hänvisa till huvud- och sekundärenheterna. Dessa termer anses nu vara föråldrade.)

På CanSat NeXT-kortet använder SD-kortet samma SPI-linje som förlängningsstiftlisten. När du ansluter en annan SPI-enhet till bussen spelar detta ingen roll. Men om SPI-stiften används som GPIO är SD-kortet effektivt inaktiverat.

För att använda SPI behöver du ofta specificera vilka stift från processorn som används. Ett exempel kan vara så här, där **makron** som ingår i CanSat-biblioteket används för att ställa in de andra stiften, och stift 12 är inställt som chip select.

```Cpp title="Initializing the SPI line for a sensor"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Makron `SPI_CLK`, `SPI_MOSI` och `SPI_MISO` ersätts av kompilatorn med 18, 23 och 19, respektive.

### I2C

Inter-Integrated Circuit är en annan populär databussprotokoll, särskilt använd för små integrerade sensorer, såsom trycksensorn och IMU på CanSat NeXT-kortet.

I2C är praktiskt eftersom det bara kräver två stift, SCL och SDA. Det finns inte heller något separat chip select-stift, utan istället skiljs olika enheter åt med olika **adresser**, som används för att etablera kommunikation. På detta sätt kan du ha flera enheter på samma buss, så länge de alla har en unik adress.

| **Pin Name** | **Description**          | **Usage**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **SDA**      | Serial Data Line          | Bi-directional data line used for communication between main and secondary devices. |
| **SCL**      | Serial Clock Line         | Clock signal generated by the main device to synchronize data transfer with secondary devices. |

Barometern och IMU är på samma I2C-buss som förlängningsstiftlisten. Kontrollera adresserna för dessa enheter på sidan [On-Board sensors](../CanSat-hardware/on_board_sensors#inertial-measurement-unit). Liksom SPI kan du använda dessa stift för att ansluta andra I2C-enheter, men om de används som GPIO-stift är IMU och barometern inaktiverade.

I Arduino-programmering kallas I2C ibland `Wire`. Till skillnad från SPI, där stiftkonfigurationen ofta specificeras för varje sensor, används I2C ofta i Arduino genom att först etablera en datalinje och sedan referera till den för varje sensor. Nedan är ett exempel på hur barometern initieras av CanSat NeXT-biblioteket:

```Cpp title="Initializing the second serial line"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Så först initieras en `Wire` genom att ange rätt I2C-stift. Makron `I2C_SDA` och `I2C_SCL` som ställs in i CanSat NeXT-biblioteket ersätts av kompilatorn med 22 och 21, respektive.

### UART

Universal asynchronous receiver-transmitter (UART) är på vissa sätt det enklaste dataprogrammet, eftersom det helt enkelt skickar data som binär vid en specificerad frekvens. Som sådan är det begränsat till punkt-till-punkt-kommunikation, vilket innebär att du vanligtvis inte kan ha flera enheter på samma buss.

| **Pin Name** | **Description**          | **Usage**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **TX**       | Transmit                  | Skickar data från huvudenheten till sekundärenheten.       |
| **RX**       | Receive                   | Tar emot data från sekundärenheten till huvudenheten.    |

På CanSat används UART i förlängningsstiftlisten inte för något annat. Det finns dock en annan UART-linje, men den används för USB-kommunikation mellan satelliten och en dator. Detta är vad som används när data skickas till `Serial`.

Den andra UART-linjen kan initieras i koden så här:

```Cpp title="Initializing the second serial line"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Vissa enheter använder också [pulse-width modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) som sin styrinmatning. Det kan också användas för dimbara lysdioder eller för att styra strömförbrukningen i vissa situationer, bland många andra användningsområden.

Med Arduino kan endast vissa stift användas som PWM. Men eftersom CanSat NeXT är en ESP32-baserad enhet kan alla utgångsstift användas för att skapa en PWM-utgång. PWM styrs med `analogWrite`.

## Vad sägs om (mitt specifika användningsfall)?

För de flesta enheter kan du hitta mycket information från internet. Till exempel, googla den specifika brytaren du har och använd dessa dokument för att modifiera de exempel du hittar för användning med CanSat NeXT. Dessutom har sensorerna och andra enheter **datablad**, som bör ha mycket information om hur man använder enheten, även om de ibland kan vara lite svåra att tyda. Om du känner att det finns något denna sida borde ha täckt, vänligen låt mig veta på samuli@kitsat.fi.

I nästa, sista lektion, kommer vi att diskutera hur du förbereder din satellit för uppskjutning.

[Klicka här för nästa lektion!](./lesson12)