---
sidebar_position: 4
---

# Lektion 4: Widerstand ist nicht zwecklos

Bisher haben wir uns darauf konzentriert, digitale Sensorgeräte zu verwenden, um Werte direkt in SI-Einheiten zu erhalten. Elektrische Geräte messen jedoch normalerweise auf indirekte Weise, und die Umwandlung in die gewünschten Einheiten erfolgt anschließend. Dies wurde zuvor von den Sensorgeräten selbst (und von der CanSat NeXT-Bibliothek) durchgeführt, aber viele Sensoren, die wir verwenden, sind viel einfacher. Eine Art von analogen Sensoren sind resistive Sensoren, bei denen sich der Widerstand eines Sensorelements in Abhängigkeit von bestimmten Phänomenen ändert. Resistive Sensoren existieren für eine Vielzahl von Größen - einschließlich Kraft, Temperatur, Lichtintensität, chemische Konzentrationen, pH-Wert und viele andere.

In dieser Lektion werden wir den lichtabhängigen Widerstand (LDR) auf der CanSat NeXT-Platine verwenden, um die umgebende Lichtintensität zu messen. Während der Thermistor auf sehr ähnliche Weise verwendet wird, wird dies der Schwerpunkt einer zukünftigen Lektion sein. Die gleichen Fähigkeiten gelten direkt für die Verwendung des LDR und des Thermistors sowie für viele andere resistive Sensoren.

![LDR-Standort auf der Platine](./../CanSat-hardware/img/LDR.png)

## Physik von resistiven Sensoren

Anstatt direkt zur Software zu springen, lassen Sie uns einen Schritt zurückgehen und besprechen, wie das Lesen eines resistiven Sensors im Allgemeinen funktioniert. Betrachten Sie das untenstehende Schaltbild. Die Spannung bei LDR_EN beträgt 3,3 Volt (Betriebsspannung des Prozessors), und wir haben zwei in Reihe geschaltete Widerstände auf seinem Weg. Einer davon ist der **LDR** (R402), während der andere ein **Referenzwiderstand** (R402) ist. Der Widerstand des Referenzwiderstands beträgt 10 Kiloohm, während der Widerstand des LDR je nach Lichtverhältnissen zwischen 5-300 Kiloohm variiert.

![LDR-Schaltbild](./img/LDR.png)

Da die Widerstände in Reihe geschaltet sind, beträgt der Gesamtwiderstand

$$
R = R_{401} + R_{LDR},
$$

und der Strom durch die Widerstände ist

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

wobei $V_{OP}$ die Betriebsspannung des MCU ist. Denken Sie daran, dass der Strom durch beide Widerstände gleich sein muss. Daher können wir den Spannungsabfall über den LDR berechnen als

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

Und dieser Spannungsabfall ist die Spannung des LDR, die wir mit einem Analog-Digital-Wandler messen können. Normalerweise kann diese Spannung direkt korreliert oder kalibriert werden, um den gemessenen Werten zu entsprechen, wie zum Beispiel von Spannung zu Temperatur oder Helligkeit. Manchmal ist es jedoch wünschenswert, zuerst den gemessenen Widerstand zu berechnen. Falls erforderlich, kann er berechnet werden als:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Den LDR in der Praxis lesen

Das Lesen des LDR oder anderer resistiver Sensoren ist sehr einfach, da wir nur den Analog-Digital-Wandler nach der Spannung abfragen müssen. Lassen Sie uns diesmal ein neues Arduino-Sketch von Grund auf neu starten. Datei -> Neues Sketch.

Zuerst beginnen wir das Sketch wie zuvor, indem wir die Bibliothek einbinden. Dies geschieht am Anfang des Sketches. Im Setup starten Sie die serielle Kommunikation und initialisieren CanSat, genau wie zuvor.

```Cpp title="Grundlegendes Setup"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Eine grundlegende Schleife zum Lesen des LDR ist nicht viel komplizierter. Die Widerstände R401 und R402 sind bereits auf der Platine, und wir müssen nur die Spannung von ihrem gemeinsamen Knoten lesen. Lassen Sie uns den ADC-Wert lesen und ausdrucken.

```Cpp title="Grundlegende LDR-Schleife"
void loop() {
    int value = analogRead(LDR);
    Serial.print("LDR-Wert:");
    Serial.println(value);
    delay(200);
}
```

Mit diesem Programm reagieren die Werte deutlich auf die Lichtverhältnisse. Wir erhalten niedrigere Werte, wenn der LDR Licht ausgesetzt ist, und höhere Werte, wenn es dunkler ist. Die Werte liegen jedoch in Hunderten und Tausenden, nicht in einem erwarteten Spannungsbereich. Dies liegt daran, dass wir jetzt den direkten Ausgang des ADC lesen. Jedes Bit stellt eine Spannungsvergleichsleiter dar, die je nach Spannung eins oder null ist. Die Werte liegen jetzt zwischen 0-4095 (2^12-1) je nach Eingangsspannung. Wiederum ist diese direkte Messung wahrscheinlich das, was Sie verwenden möchten, wenn Sie etwas wie [Pulse mit dem LDR erkennen](./../../blog/first-project#pulse-detection), aber oft sind reguläre Volt angenehm zu arbeiten. Während das Berechnen der Spannung selbst eine gute Übung ist, enthält die Bibliothek eine Umrechnungsfunktion, die auch die Nichtlinearität des ADC berücksichtigt, was bedeutet, dass der Ausgang genauer ist als bei einer einfachen linearen Umrechnung.

```Cpp title="Lesen der LDR-Spannung"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("LDR-Wert:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Dieser Code ist kompatibel mit dem seriellen Plotter in Arduino Code. Probieren Sie es aus!

:::

:::tip[Übung]

Es könnte nützlich sein, den CanSat zu erkennen, der aus der Rakete freigesetzt wurde, damit zum Beispiel der Fallschirm zum richtigen Zeitpunkt ausgelöst werden kann. Können Sie ein Programm schreiben, das eine simulierte Freisetzung erkennt? Simulieren Sie den Start, indem Sie zuerst den LDR abdecken (Raketenintegration) und ihn dann freilegen (Freisetzung). Das Programm könnte die Freisetzung im Terminal ausgeben oder eine LED blinken lassen, um zu zeigen, dass die Freisetzung stattgefunden hat.

:::

---

Die nächste Lektion handelt davon, die SD-Karte zu verwenden, um Messungen, Einstellungen und mehr zu speichern!

[Klicken Sie hier für die nächste Lektion!](./lesson5)