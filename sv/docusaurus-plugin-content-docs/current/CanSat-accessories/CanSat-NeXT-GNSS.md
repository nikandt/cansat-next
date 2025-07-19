---
sidebar_position: 1
---

# CanSat NeXT GNSS-modul

CanSat NeXT GNSS-modul utökar CanSat NeXT med platsövervakning och exakt realtidsklocka. Modulen är baserad på U-Blox SAM-M10Q GNSS-mottagare från U-Blox.

![CanSat NeXT GNSS-modul](./img/GNSS.png)

## Hårdvara

Modulen ansluter GNSS-mottagaren till CanSat NeXT genom UART i förlängningshuvudet. Enheten använder förlängningshuvudets stift 16 och 17 för UART RX och TX, och tar också strömförsörjning från +3V3-linjen i förlängningshuvudet.

Som standard drivs GNSS-modulens backupregister från +3V3-linjen. Även om detta gör modulen lätt att använda, innebär det att modulen alltid måste börja från början när den försöker hitta en fix. För att mildra detta är det möjligt att tillhandahålla en extern strömkälla genom backup-spänningslinjen via J103-huvuden. Spänningen som tillhandahålls till V_BCK-stiftet bör vara 2-6,5 volt, och strömförbrukningen är konstant 65 mikroampere, även när huvudströmmen är avstängd. Att tillhandahålla backup-spänningen gör det möjligt för GNSS-mottagaren att behålla alla inställningar, men också avgörande almanacka och efemerisdata - vilket minskar tiden för att få en fix från ~30 sekunder till 1-2 sekunder om enheten inte har flyttat sig avsevärt mellan strömbrytare.

Det finns många andra GNSS-breakouts och moduler tillgängliga från företag som Sparkfun och Adafruit, bland andra. Dessa kan anslutas till CanSat NeXT genom samma UART-gränssnitt, eller med hjälp av SPI och I2C, beroende på modulen. CanSat NeXT-biblioteket bör också stödja andra breakouts som använder U-blox-moduler. När du letar efter GNSS-breakouts, försök att hitta en där bas-PCB:n är så stor som möjligt - de flesta har för små PCB:er, vilket gör deras antennprestanda mycket svag jämfört med moduler med större PCB:er. Alla storlekar mindre än 50x50 mm kommer att börja hindra prestandan och förmågan att hitta och behålla en fix.

För mer information om GNSS-modulen och det stora antalet inställningar och funktioner som finns tillgängliga, se databladet för GNSS-mottagaren från [U-Blox webbplats](https://www.u-blox.com/en/product/sam-m10q-module).

Hårdvaruintegrationen av modulen till CanSat NeXT är verkligen enkel - efter att ha lagt till distanser till skruvhålen, sätt försiktigt in huvudstiften i stiftsocklarna. Om du tänker göra en flerskikts elektronisk stapel, se till att placera GNSS som den översta modulen för att tillåta

![CanSat NeXT GNSS-modul](./img/stack.png)

## Mjukvara

Det enklaste sättet att komma igång med CanSat NeXT GNSS är med vårt eget Arduino-bibliotek, som du kan hitta i Arduino-bibliotekshanteraren. För instruktioner om hur du installerar biblioteket, se sidan [komma igång](./../course/lesson1).

Biblioteket inkluderar exempel på hur man läser positionen och aktuell tid, samt hur man överför data med CanSat NeXT.

En snabb notering om inställningarna - modulen behöver informeras om vilken typ av miljö den kommer att användas i, så den kan bäst approximera användarens position. Typiskt är antagandet att användaren kommer att vara på marknivå, och även om de kan röra sig, är accelerationen förmodligen inte särskilt hög. Detta är naturligtvis inte fallet med CanSats, som kan skjutas upp med raketer, eller träffa marken med ganska höga hastigheter. Därför ställer biblioteket som standard in positionen att beräknas med antagande om en högdynamisk miljö, vilket gör det möjligt att behålla fixen åtminstone något under snabb acceleration, men det gör också positionen på marken märkbart mindre exakt. Om istället hög noggrannhet när den landat är mer önskvärt, kan du initiera GNSS-modulen med kommandot `GNSS_init(DYNAMIC_MODEL_GROUND)`, och ersätta standarden `GNSS_init(DYNAMIC_MODEL_ROCKET)` = `GNSS_init()`. Dessutom finns det `DYNAMIC_MODEL_AIRBORNE`, som är något mer exakt än raketmodellen, men antar endast måttlig acceleration.

Detta bibliotek prioriterar användarvänlighet och har endast grundläggande funktioner som att få plats och tid från GNSS. För användare som letar efter mer avancerade GNSS-funktioner kan det utmärkta SparkFun_u-blox_GNSS_Arduino_Library vara ett bättre val.

## Biblioteksspecifikation

Här är de tillgängliga kommandona från CanSat GNSS-biblioteket.

### GNSS_Init

| Funktion             | uint8_t GNSS_Init(uint8_t dynamic_model)                          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 1 om initialiseringen lyckades, eller 0 om det fanns ett fel. |
| **Parametrar**       |                                                                    |
|                      | `uint8_t dynamic_model`                                           |
|                      | Detta väljer den dynamiska modellen, eller miljön som GNSS-modulen antar. Möjliga val är DYNAMIC_MODEL_GROUND, DYNAMIC_MODEL_AIRBORNE och DYNAMIC_MODEL_ROCKET. |
| **Beskrivning**      | Detta kommando initialiserar GNSS-modulen, och du bör anropa detta i setup-funktionen. |

### readPosition

| Funktion             | uint8_t readPosition(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Returnerar 0 om mätningen lyckades.                           |
| **Parametrar**       |                                                                    |
|                      | `float &latitude, float &longitude, float &altitude`                                    |
|                      | `float &x`: Adressen till en flytande variabel där data kommer att lagras. |
| **Används i exempelsketch** | Alla                                                  |
| **Beskrivning**      | Denna funktion kan användas för att läsa enhetens position som koordinater. Värdena kommer att vara semi-slumpmässiga innan fixen erhålls. Höjden är meter över havet, även om den inte är särskilt exakt. |

### getSIV

| Funktion             | uint8_t getSIV()                  |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint8_t`                                                          |
| **Returvärde**       | Antal satelliter i sikte |
| **Används i exempelsketch** | AdditionalFunctions                                          |
| **Beskrivning**      | Returnerar antalet satelliter i sikte. Typiskt indikerar värden under 3 ingen fix. |

### getTime

| Funktion             | uint32_t getTime()                  |
|----------------------|--------------------------------------------------------------------|
| **Returtyp**         | `uint32_t`                                                          |
| **Returvärde**       | Aktuell epoktids |
| **Används i exempelsketch** | AdditionalFunctions                                          |
| **Beskrivning**      | Returnerar den aktuella epoktiden, som indikeras av signalerna från GNSS-satelliter. Med andra ord är detta antalet sekunder som förflutit sedan 00:00:00 UTC, torsdagen den första januari 1970. |