---
sidebar_position: 10
---

# Lektion 9: Ettor och Nollor

Hittills har vi använt text när vi lagrar eller överför data. Även om detta gör det lätt att tolka, är det också ineffektivt. Datorer använder internt **binär** data, där data lagras som uppsättningar av ettor och nollor. I denna lektion kommer vi att titta på sätt att använda binär data med CanSat NeXT, och diskutera var och varför det kan vara användbart att göra så.

:::info

## Olika datatyper

I binär form representeras all data—oavsett om det är siffror, text eller sensoravläsningar—som en serie av ettor och nollor. Olika datatyper använder olika mängder minne och tolkar de binära värdena på specifika sätt. Låt oss kort granska några vanliga datatyper och hur de lagras i binär form:

- **Heltal (int)**:  
  Heltal representerar hela nummer. I ett 16-bitars heltal kan till exempel 16 ettor och nollor representera värden från \(-32,768\) till \(32,767\). Negativa tal lagras med en metod som kallas **tvåkomplement**.

- **Osignerat heltal (uint)**:  
  Osignerade heltal representerar icke-negativa nummer. Ett 16-bitars osignerat heltal kan lagra värden från \(0\) till \(65,535\), eftersom inga bitar är reserverade för tecknet.

- **Flyttal (Float)**:  
  Flyttal representerar decimaltal. I ett 32-bitars flyttal representerar en del av bitarna tecknet, exponenten och mantissan, vilket gör att datorer kan hantera mycket stora och mycket små tal. Det är i huvudsak en binär form av [vetenskaplig notation](https://en.wikipedia.org/wiki/Scientific_notation).

- **Tecken (char)**:  
  Tecken lagras med kodningsscheman som **ASCII** eller **UTF-8**. Varje tecken motsvarar ett specifikt binärt värde (t.ex. 'A' i ASCII lagras som `01000001`).

- **Strängar**:  
  Strängar är helt enkelt samlingar av tecken. Varje tecken i en sträng lagras i följd som individuella binära värden. Till exempel skulle strängen `"CanSat"` lagras som en serie av tecken som `01000011 01100001 01101110 01010011 01100001 01110100` (varje representerar 'C', 'a', 'n', 'S', 'a', 't'). Som du kan se är det mindre effektivt att representera nummer som strängar, som vi har gjort hittills, jämfört med att lagra dem som binära värden.

- **Arrayer och `uint8_t`**:  
  När man arbetar med binär data är det vanligt att använda en array av `uint8_t` för att lagra och hantera rå byte-data. Typen `uint8_t` representerar ett osignerat 8-bitars heltal, som kan hålla värden från 0 till 255. Eftersom varje byte består av 8 bitar är denna typ väl lämpad för att hålla binär data.
  Arrayer av `uint8_t` används ofta för att skapa byte-buffertar för att hålla sekvenser av rå binär data (t.ex. paket). Vissa föredrar `char` eller andra variabler, men det spelar egentligen ingen roll vilken som används så länge variabeln har längden av 1 byte.
:::

## Överföra binär data

Låt oss börja med att ladda upp ett enkelt program till CanSat och fokusera mer på markstationens sida. Här är en enkel kod som överför en avläsning i binärt format:

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

Koden ser annars mycket bekant ut, men `sendData` tar nu två argument istället för bara ett - först, **minnesadressen** för data som ska överföras, och sedan **längden** på data som ska överföras. I detta förenklade fall använder vi bara adressen och längden på variabeln `LDR_voltage`.

Om du försöker ta emot detta med den typiska markstationskoden kommer det bara att skriva ut nonsens, eftersom den försöker tolka den binära datan som om den vore en sträng. Istället måste vi specificera för markstationen vad datan innehåller.

Först, låt oss kontrollera hur lång datan faktiskt är som vi tar emot.

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

Varje gång satelliten sänder, tar vi emot 4 byte på markstationen. Eftersom vi överför ett 32-bitars flyttal, verkar detta stämma.

För att läsa datan måste vi ta den binära databufferten från ingångsströmmen och kopiera datan till en lämplig variabel. För detta enkla fall kan vi göra så här:

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

Först introducerar vi variabeln `LDR_reading` för att hålla datan vi *vet* vi har i bufferten. Sedan använder vi `memcpy` (minneskopiering) för att kopiera den binära datan från `data`-bufferten till **minnesadressen** för `LDR_reading`. Detta säkerställer att datan överförs exakt som den lagrades, med samma format som på satelliten.

Nu om vi skriver ut datan, är det som om vi läste den direkt på GS-sidan. Det är inte text längre som det brukade vara, utan den faktiska samma datan vi läste på satellitsidan. Nu kan vi enkelt bearbeta den på GS-sidan som vi vill.

## Skapa vårt eget protokoll

Den verkliga styrkan med binär dataöverföring blir uppenbar när vi har mer data att överföra. Vi måste dock fortfarande säkerställa att satelliten och markstationen är överens om vilken byte som representerar vad. Detta kallas för ett **paketprotokoll**.

Ett paketprotokoll definierar strukturen för den data som överförs, specificerar hur man packar flera delar av data i en enda överföring, och hur mottagaren ska tolka de inkommande bytena. Låt oss bygga ett enkelt protokoll som överför flera sensoravläsningar på ett strukturerat sätt.

Först, låt oss läsa alla accelerometer- och gyroskopkanaler och skapa **datapaketet** från avläsningarna.

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

  // Skapa en array för att hålla datan
  uint8_t packet[24];

  // Kopiera data till paketet
  memcpy(&packet[0], &ax, 4);  // Kopiera accelerometer X till byte 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Kopiera gyroskop Z till byte 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Här läser vi först datan precis som i Lektion 3, men sedan **kodar** vi datan till ett datapaket. Först skapas den faktiska bufferten, som bara är en tom uppsättning av 24 byte. Varje datavariabel kan sedan skrivas till denna tomma buffert med `memcpy`. Eftersom vi använder `float`, har datan längden av 4 byte. Om du är osäker på längden av en variabel kan du alltid kontrollera den med `sizeof(variable)`.

:::tip[Övning]

Skapa en markstationsprogramvara för att tolka och skriva ut accelerometer- och gyroskopdata.

:::

## Lagra binär data på SD-kort

Att skriva data som binär till SD-kortet kan vara användbart när man arbetar med mycket stora mängder data, eftersom binär lagring är mer kompakt och effektiv än text. Detta gör att du kan spara mer data med mindre lagringsutrymme, vilket kan vara användbart i system med begränsat minne.

Men att använda binär data för lagring kommer med kompromisser. Till skillnad från textfiler är binära filer inte läsbara för människor, vilket innebär att de inte enkelt kan öppnas och förstås med standardtextredigerare eller importeras till program som Excel. För att läsa och tolka binär data behöver specialiserad programvara eller skript (t.ex. i Python) utvecklas för att korrekt tolka det binära formatet.

För de flesta applikationer, där enkel åtkomst och flexibilitet är viktigt (såsom att analysera data på en dator senare), rekommenderas textbaserade format som CSV. Dessa format är lättare att arbeta med i en mängd olika programverktyg och ger mer flexibilitet för snabb dataanalys.

Om du är fast besluten att använda binär lagring, ta en djupare titt "under huven" genom att granska hur CanSat-biblioteket hanterar datalagring internt. Du kan direkt använda C-stil filhanteringsmetoder för att hantera filer, strömmar och andra lågnivåoperationer effektivt. Mer information kan också hittas från [Arduino SD-kortbiblioteket](https://docs.arduino.cc/libraries/sd/).

---

Våra program börjar bli mer och mer komplicerade, och det finns också några komponenter som skulle vara trevliga att återanvända någon annanstans. För att undvika att göra vår kod svår att hantera, skulle det vara trevligt att kunna dela några komponenter till olika filer och hålla koden läsbar. Låt oss titta på hur detta kan uppnås med Arduino IDE.

[Klicka här för nästa lektion!](./lesson10)