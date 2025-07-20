---
sidebar_position: 4
---

# Lektion 4: Motstånd är inte förgäves

Hittills har vi fokuserat på att använda digitala sensorenheter för att få värden direkt i SI-enheter. Elektriska enheter gör dock vanligtvis mätningen på ett indirekt sätt, och omvandlingen till önskade enheter görs sedan efteråt. Detta gjordes tidigare av själva sensorenheterna (och av CanSat NeXT-biblioteket), men många sensorer vi använder är mycket enklare. En typ av analoga sensorer är resistiva sensorer, där resistansen hos ett sensorelement förändras beroende på vissa fenomen. Resistiva sensorer finns för en mängd olika storheter - inklusive kraft, temperatur, ljusintensitet, kemiska koncentrationer, pH och många andra.

I denna lektion kommer vi att använda den ljusberoende resistorn (LDR) på CanSat NeXT-kortet för att mäta omgivande ljusintensitet. Medan termistorn används på ett mycket liknande sätt, kommer det att vara fokus för en framtida lektion. Samma färdigheter gäller direkt för att använda LDR och termistor, samt många andra resistiva sensorer.

![LDR plats på kortet](./../CanSat-hardware/img/LDR.png)

## Fysik för resistiva sensorer

Istället för att hoppa direkt till mjukvaran, låt oss ta ett steg tillbaka och diskutera hur avläsning av en resistiv sensor generellt fungerar. Tänk på schemat nedan. Spänningen vid LDR_EN är 3,3 volt (driftspänningen för processorn), och vi har två motstånd kopplade i serie på dess väg. Ett av dessa är **LDR** (R402), medan det andra är ett **referensmotstånd** (R402). Referensmotståndets resistans är 10 kilo-ohm, medan LDR:s resistans varierar mellan 5-300 kilo-ohm beroende på ljusförhållandena.

![LDR schema](./img/LDR.png)

Eftersom motstånden är kopplade i serie är den totala resistansen 

$$
R = R_{401} + R_{LDR},
$$

och strömmen genom motstånden är 

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

där $V_{OP}$ är driftspänningen för MCU:n. Kom ihåg att strömmen måste vara densamma genom båda motstånden. Därför kan vi beräkna spänningsfallet över LDR som 

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

Och detta spänningsfall är spänningen hos LDR som vi kan mäta med en analog-till-digital-omvandlare. Vanligtvis kan denna spänning direkt korreleras eller kalibreras för att motsvara uppmätta värden, som till exempel från spänning till temperatur eller ljusstyrka. Ibland är det dock önskvärt att först beräkna den uppmätta resistansen. Om nödvändigt kan den beräknas som:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Avläsning av LDR i praktiken

Att läsa av LDR eller andra resistiva sensorer är mycket enkelt, eftersom vi bara behöver fråga den analog-till-digitala omvandlaren efter spänningen. Låt oss denna gång börja ett nytt Arduino Sketch från början. Fil -> Nytt Sketch.

Först, låt oss starta sketchen som tidigare genom att inkludera biblioteket. Detta görs i början av sketchen. I setup, starta seriell och initiera CanSat, precis som tidigare.

```Cpp title="Grundläggande inställning"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

En grundläggande loop för att läsa av LDR är inte mycket mer komplicerad. Motstånden R401 och R402 är redan på kortet, och vi behöver bara läsa av spänningen från deras gemensamma nod. Låt oss läsa av ADC-värdet och skriva ut det.

```Cpp title="Grundläggande LDR-loop"
void loop() {
    int value = analogRead(LDR);
    Serial.print("LDR-värde:");
    Serial.println(value);
    delay(200);
}
```

Med detta program reagerar värdena tydligt på ljusförhållandena. Vi får lägre värden när LDR utsätts för ljus och högre värden när det är mörkare. Värdena är dock i hundratals och tusentals, inte i ett förväntat spänningsområde. Detta beror på att vi nu läser av den direkta utgången från ADC:n. Varje bit representerar en spänningsjämförelsesteg som är ett eller noll beroende på spänningen. Värdena är nu 0-4095 (2^12-1) beroende på ingångsspänningen. Återigen, denna direkta mätning är förmodligen vad du vill använda om du gör något som [detekterar pulser med LDR](./../../blog/first-project#pulse-detection), men ganska ofta är vanliga volt trevliga att arbeta med. Medan det är en bra övning att beräkna spänningen själv, inkluderar biblioteket en omvandlingsfunktion som också tar hänsyn till ADC:ns icke-linjäritet, vilket innebär att utgången är mer exakt än från en enkel linjär omvandling.

```Cpp title="Läsa av LDR-spänningen"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("LDR-värde:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Denna kod är kompatibel med den seriella plottern i Arduino Code. Prova det!

:::

:::tip[Övning]

Det kan vara användbart att detektera att CanSat har blivit utskjuten från raketen, så att till exempel fallskärmen kan utlösas vid rätt tidpunkt. Kan du skriva ett program som detekterar en simulerad utskjutning? Simulera uppskjutningen genom att först täcka LDR (raketintegration) och sedan avtäcka den (utskjutning). Programmet kan skriva ut utskjutningen till terminalen, eller blinka en LED för att visa att utskjutningen har hänt.

:::

---

Nästa lektion handlar om att använda SD-kortet för att lagra mätningar, inställningar och mer!

[Klicka här för nästa lektion!](./lesson5)