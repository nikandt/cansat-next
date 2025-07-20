---
sidebar_position: 6
---

# Lektion 6: Ringa hem

Nu har vi tagit mätningar och även sparat dem på ett SD-kort. Nästa logiska steg är att överföra dem trådlöst till markstationen, vilket möjliggör en helt ny värld av mätningar och experiment vi kan utföra. Till exempel skulle det ha varit mycket mer intressant (och lättare att kalibrera) att testa noll-g-flygning med IMU om vi kunde ha sett data i realtid. Låt oss ta en titt på hur vi kan göra det!

I denna lektion kommer vi att skicka mätningar från CanSat NeXT till markstationsmottagaren. Senare kommer vi också att titta på att styra CanSat med meddelanden som skickas av markstationen.

## Antenner

Innan du börjar denna lektion, se till att du har någon typ av antenn ansluten till CanSat NeXT-kortet och markstationen.

:::note

Du bör aldrig försöka sända något utan en antenn. Inte bara kommer det förmodligen inte att fungera, det finns en möjlighet att den reflekterade kraften skadar sändaren.

:::

Eftersom vi använder 2,4 GHz-bandet, som delas av system som Wi-Fi, Bluetooth, ISM, drönare etc., finns det många kommersiella antenner tillgängliga. De flesta Wi-Fi-antenner fungerar faktiskt riktigt bra med CanSat NeXT, men du behöver ofta en adapter för att ansluta dem till CanSat NeXT-kortet. Vi har också testat några adaptermodeller som finns tillgängliga i webbutiken.

Mer information om antenner finns i hårdvarudokumentationen: [Kommunikation och antenner](./../CanSat-hardware/communication). Denna artikel har också [instruktioner](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) för att bygga din egen antenn från materialen i CanSat NeXT-kitet.

## Skicka data

Med diskussionen om antenner ur vägen, låt oss börja skicka några bitar. Vi börjar igen med att titta på inställningen, som faktiskt har en nyckelskillnad denna gång - vi har lagt till ett nummer som ett **argument** till `CanSatInit()`-kommandot.

```Cpp title="Inställning för överföring"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Genom att skicka ett siffervärde till `CanSatInit()` talar vi om för CanSat NeXT att vi nu vill använda radion. Numret indikerar värdet på den sista byten av MAC-adressen. Du kan tänka på det som en nyckel till ditt specifika nätverk - du kan bara kommunicera med CanSats som delar samma nyckel. Detta nummer bör delas mellan din CanSat NeXT och din markstation. Du kan välja ditt favoritnummer mellan 0 och 255. Jag valde 28, eftersom det är [perfekt](https://en.wikipedia.org/wiki/Perfect_number).

Med radion initierad är det verkligen enkelt att överföra data. Det fungerar faktiskt precis som `appendFile()` som vi använde i förra lektionen - du kan lägga till vilket värde som helst och det kommer att överföra det i ett standardformat, eller så kan du använda en formaterad sträng och skicka det istället.

```Cpp title="Överföra data"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Med denna enkla kod överför vi nu LDR-mätningen nästan 10 gånger per sekund. Nästa steg är att titta på hur man tar emot det.

:::note

De som är bekanta med lågnivåprogrammering kanske känner sig mer bekväma med att skicka data i binär form. Oroa dig inte, vi har dig täckt. De binära kommandona finns listade i [Biblioteksspecifikationen](./../CanSat-software/library_specification.md#senddata-binary-variant).

:::

## Ta emot data

Denna kod bör nu programmeras till en annan ESP32. Vanligtvis är det den andra styrenheten som ingår i kitet, men nästan vilken annan ESP32 som helst fungerar också - inklusive en annan CanSat NeXT.

:::note

Om du använder ett ESP32-utvecklingskort som markstation, kom ihåg att trycka på Boot-knappen på kortet medan du flashar från IDE. Detta ställer in ESP32 till rätt boot-läge för att omprogrammera processorn. CanSat NeXT gör detta automatiskt, men utvecklingskorten gör oftast inte det.

:::

Inställningskoden är exakt densamma som tidigare. Kom bara ihåg att ändra radionyckeln till ditt favoritnummer.

```Cpp title="Inställning för mottagning"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Men efter det blir saker lite annorlunda. Vi gör en helt tom loop-funktion! Detta beror på att vi faktiskt inte har något att göra i loopen, utan istället görs mottagningen genom **callbacks**.

```Cpp title="Ställa in en callback"
void loop() {
  // Vi har inget att göra i loopen.
}

// Detta är en callback-funktion. Den körs varje gång radion tar emot data.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Medan funktionen `setup()` körs bara en gång i början och `loop()` körs kontinuerligt, körs funktionen `onDataReceived()` endast när radion har tagit emot ny data. På detta sätt kan vi hantera data i callback-funktionen. I detta exempel skriver vi bara ut det, men vi skulle också kunna ha modifierat det hur vi ville.

Observera att `loop()`-funktionen inte *måste* vara tom, du kan faktiskt använda den för vad du vill med en förutsättning - fördröjningar bör undvikas, eftersom `onDataReceived()`-funktionen inte heller kommer att köras förrän fördröjningen är över.

Om du nu har båda programmen igång på olika kort samtidigt, bör det finnas ganska många mätningar som skickas trådlöst till din PC.

:::note

För de som föredrar binär form - du kan använda callback-funktionen onBinaryDataReceived.

:::

## Realtid Zero-G

Bara för skojs skull, låt oss upprepa noll-g-experimentet men med radio. Mottagarkoden kan förbli densamma, liksom faktiskt inställningen i CanSat-koden.

Som en påminnelse gjorde vi ett program i IMU-lektionen som upptäckte fritt fall och tände en LED i detta scenario. Här är den gamla koden:

```Cpp title="Fritt fall detekterande loop-funktion"
unsigned long LEDOnTill = 0;

void loop() {
  // Läs acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Beräkna total acceleration (kvadrerad)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Uppdatera timern om vi upptäcker ett fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Styr LED baserat på timern
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Det är frestande att bara lägga till `sendData()` direkt till det gamla exemplet, men vi måste överväga tidpunkten. Vi vill vanligtvis inte skicka meddelanden mer än ~20 gånger per sekund, men å andra sidan vill vi att loopen ska köras kontinuerligt så att LED fortfarande tänds.

Vi behöver lägga till en annan timer - denna gång för att skicka data var 50:e millisekund. Timern görs genom att jämföra den aktuella tiden med den aktuella tiden till den senaste gången när data skickades. Den senaste tiden uppdateras sedan varje gång data skickas. Ta också en titt på hur strängen görs här. Den skulle också kunna överföras i delar, men på detta sätt tas den emot som ett enda meddelande, istället för flera meddelanden.

```Cpp title="Fritt fall detektion + dataöverföring"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Läs acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Beräkna total acceleration (kvadrerad)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Uppdatera timern om vi upptäcker ett fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Styr LED baserat på timern
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Uppdatera den senaste sändningstiden till den aktuella tiden
    lastSendTime = millis();
  }

}
```

Dataformatet här är faktiskt kompatibelt igen med den seriella plottern - att titta på den datan gör det ganska klart varför vi kunde upptäcka fritt fall tidigare så tydligt - värdena sjunker verkligen till noll så snart enheten tappas eller kastas.

---

I nästa avsnitt tar vi en kort paus för att granska vad vi har lärt oss hittills och säkerställa att vi är förberedda för att fortsätta bygga på dessa koncept.

[Klicka här för den första granskningen!](./review1)