---
sidebar_position: 12
---

# Lektion 11: Satellit muss wachsen

Obwohl der CanSat NeXT bereits viele integrierte Sensoren und Geräte auf der Satellitenplatine selbst hat, erfordern viele spannende CanSat-Missionen die Verwendung anderer externer Sensoren, Servos, Kameras, Motoren oder anderer Aktuatoren und Geräte. Diese Lektion unterscheidet sich leicht von den vorherigen, da wir die Integration verschiedener externer Geräte in CanSat besprechen werden. Ihr tatsächlicher Anwendungsfall wird wahrscheinlich nicht berücksichtigt, aber vielleicht etwas Ähnliches. Wenn Sie jedoch der Meinung sind, dass hier etwas behandelt werden sollte, senden Sie bitte Feedback an mich unter samuli@kitsat.fi.

Diese Lektion unterscheidet sich leicht von den vorherigen, da alle Informationen nützlich sind, Sie jedoch frei zu den Bereichen springen können, die für Ihr Projekt spezifisch relevant sind, und diese Seite als Referenz verwenden können. Bevor Sie jedoch mit dieser Lektion fortfahren, schauen Sie sich bitte die Materialien im Abschnitt [Hardware](./../CanSat-hardware/CanSat-hardware.md) der CanSat NeXT-Dokumentation an, da sie viele Informationen zur Integration externer Geräte enthält.

## Anschließen externer Geräte

Es gibt zwei großartige Möglichkeiten, externe Geräte an den CanSat NeXT anzuschließen: Verwenden von [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) und benutzerdefinierten PCBs. Eigene PCBs zu erstellen ist einfacher (und günstiger) als man denkt, und um damit zu beginnen, ist dieses [KiCAD-Tutorial](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html) ein guter Ausgangspunkt. Wir haben auch eine [Vorlage](../CanSat-hardware/mechanical_design#custom-PCB) für KiCAD verfügbar, sodass das Erstellen Ihrer Platinen im gleichen Format sehr einfach ist.

Das gesagt, für die meisten CanSat-Missionen ist das Löten der externen Sensoren oder anderer Geräte auf eine Perf-Platine eine großartige Möglichkeit, zuverlässige, robuste Elektronikstapel zu erstellen.

Ein noch einfacherer Weg, um zu beginnen, insbesondere beim ersten Prototyping, ist die Verwendung von Jumper-Kabeln (auch Dupont-Kabel oder Breadboard-Draht genannt). Sie werden typischerweise sogar mit den Sensor-Breakouts geliefert, können aber auch separat gekauft werden. Diese haben denselben 0,1-Zoll-Raster, der vom Erweiterungs-Pin-Header verwendet wird, was das Anschließen von Geräten mit Kabeln sehr einfach macht. Obwohl Kabel einfach zu verwenden sind, sind sie jedoch ziemlich sperrig und unzuverlässig. Aus diesem Grund wird dringend empfohlen, Kabel für das Flugmodell Ihres CanSat zu vermeiden.

## Stromversorgung der Geräte

CanSat NeXT verwendet 3,3 Volt für alle seine eigenen Geräte, weshalb es die einzige Spannungsleitung ist, die auch zum Erweiterungs-Header bereitgestellt wird. Viele kommerzielle Breakouts, insbesondere ältere, unterstützen auch den Betrieb mit 5 Volt, da dies die Spannung ist, die von älteren Arduinos verwendet wird. Die überwiegende Mehrheit der Geräte unterstützt jedoch auch den Betrieb direkt über 3,3 Volt.

Für die wenigen Fälle, in denen 5 Volt absolut erforderlich sind, können Sie einen **Boost-Konverter** auf der Platine einbauen. Es gibt fertige Module, aber Sie können auch viele Geräte direkt auf die Perf-Platine löten. Das gesagt, versuchen Sie zuerst, das Gerät mit 3,3 Volt zu betreiben, da es eine gute Chance gibt, dass es funktioniert.

Der maximal empfohlene Stromverbrauch von der 3,3-Volt-Leitung beträgt 300 mA. Für stromhungrige Geräte wie Motoren oder Heizungen sollten Sie eine externe Stromquelle in Betracht ziehen.

## Datenleitungen

Der Erweiterungs-Header hat insgesamt 16 Pins, von denen zwei für Masse- und Stromleitungen reserviert sind. Der Rest sind verschiedene Arten von Eingängen und Ausgängen, von denen die meisten mehrere Verwendungsmöglichkeiten haben. Das Board-Pinout zeigt, was jeder der Pins tun kann.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Alle freigelegten Pins können als allgemeine Eingänge und Ausgänge (GPIO) verwendet werden, was bedeutet, dass Sie `digitalWrite`- und `digitalRead`-Funktionen mit ihnen im Code ausführen können.

### ADC

Pins 33 und 32 haben einen Analog-Digital-Wandler (ADC), was bedeutet, dass Sie `analogRead` (und `adcToVoltage`) verwenden können, um die Spannung an diesem Pin zu lesen.

### DAC

Diese Pins können verwendet werden, um eine bestimmte Spannung am Ausgang zu erzeugen. Beachten Sie, dass sie die gewünschte Spannung erzeugen, jedoch nur eine sehr geringe Strommenge liefern können. Diese könnten als Referenzpunkte für Sensoren oder sogar als Audioausgang verwendet werden, jedoch benötigen Sie einen Verstärker (oder zwei). Sie können `dacWrite` verwenden, um die Spannung zu schreiben. Es gibt auch ein Beispiel in der CanSat-Bibliothek dafür.

### SPI

Serial Peripheral Interface (SPI) ist eine Standard-Datenleitung, die häufig von Arduino-Breakouts und ähnlichen Geräten verwendet wird. Ein SPI-Gerät benötigt vier Pins:

| **Pin-Name**   | **Beschreibung**                                              | **Verwendung**                                                  |
|----------------|--------------------------------------------------------------|-----------------------------------------------------------------|
| **MOSI**       | Main Out Secondary In                                         | Daten, die vom Hauptgerät (z. B. CanSat) an das Sekundärgerät gesendet werden. |
| **MISO**       | Main In Secondary Out                                         | Daten, die vom Sekundärgerät zurück an das Hauptgerät gesendet werden. |
| **SCK**        | Serial Clock                                                  | Vom Hauptgerät erzeugtes Taktsignal zur Synchronisierung der Kommunikation. |
| **SS/CS**      | Secondary Select/Chip Select                                  | Wird vom Hauptgerät verwendet, um auszuwählen, mit welchem Sekundärgerät kommuniziert werden soll. |

Hier ist das Hauptgerät die CanSat NeXT-Platine, und das Sekundärgerät ist das Gerät, mit dem Sie kommunizieren möchten. Die MOSI-, MISO- und SCK-Pins können von mehreren Sekundärgeräten gemeinsam genutzt werden, jedoch benötigt jedes von ihnen seinen eigenen CS-Pin. Der CS-Pin kann jeder GPIO-Pin sein, weshalb es keinen dedizierten im Bus gibt.

(Hinweis: In älteren Materialien werden manchmal die Begriffe "Master" und "Slave" verwendet, um die Haupt- und Sekundärgeräte zu bezeichnen. Diese Begriffe gelten mittlerweile als veraltet.)

Auf der CanSat NeXT-Platine verwendet die SD-Karte dieselbe SPI-Leitung wie der Erweiterungs-Header. Wenn ein weiteres SPI-Gerät an den Bus angeschlossen wird, spielt das keine Rolle. Wenn die SPI-Pins jedoch als GPIO verwendet werden, ist die SD-Karte effektiv deaktiviert.

Um SPI zu verwenden, müssen Sie oft angeben, welche Pins vom Prozessor verwendet werden. Ein Beispiel könnte so aussehen, wobei **Makros** aus der CanSat-Bibliothek verwendet werden, um die anderen Pins zu setzen, und der Pin 12 als Chip-Select festgelegt wird.

```Cpp title="Initialisierung der SPI-Leitung für einen Sensor"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Die Makros `SPI_CLK`, `SPI_MOSI` und `SPI_MISO` werden vom Compiler durch 18, 23 und 19 ersetzt.

### I2C

Inter-Integrated Circuit ist ein weiteres beliebtes Datenbusprotokoll, das besonders für kleine integrierte Sensoren verwendet wird, wie den Drucksensor und das IMU auf der CanSat NeXT-Platine.

I2C ist praktisch, da es nur zwei Pins benötigt, SCL und SDA. Es gibt auch keinen separaten Chip-Select-Pin, sondern verschiedene Geräte werden durch verschiedene **Adressen** getrennt, die zur Herstellung der Kommunikation verwendet werden. Auf diese Weise können Sie mehrere Geräte im selben Bus haben, solange sie alle eine eindeutige Adresse haben.

| **Pin-Name** | **Beschreibung**          | **Verwendung**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **SDA**      | Serial Data Line          | Bidirektionale Datenleitung zur Kommunikation zwischen Haupt- und Sekundärgeräten. |
| **SCL**      | Serial Clock Line         | Vom Hauptgerät erzeugtes Taktsignal zur Synchronisierung der Datenübertragung mit Sekundärgeräten. |

Das Barometer und das IMU befinden sich im selben I2C-Bus wie der Erweiterungs-Header. Überprüfen Sie die Adressen dieser Geräte auf der Seite [On-Board-Sensoren](../CanSat-hardware/on_board_sensors#IMU). Ähnlich wie bei SPI können Sie diese Pins zum Anschließen anderer I2C-Geräte verwenden, aber wenn sie als GPIO-Pins verwendet werden, sind das IMU und das Barometer deaktiviert.

In der Arduino-Programmierung wird I2C manchmal `Wire` genannt. Im Gegensatz zu SPI, wo das Pinout oft für jeden Sensor spezifiziert wird, wird I2C oft in Arduino verwendet, indem zuerst eine Datenleitung hergestellt und dann für jeden Sensor darauf verwiesen wird. Unten ist ein Beispiel, wie das Barometer von der CanSat NeXT-Bibliothek initialisiert wird:

```Cpp title="Initialisierung der zweiten seriellen Leitung"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Zuerst wird ein `Wire` initialisiert, indem ihm die richtigen I2C-Pins mitgeteilt werden. Die in der CanSat NeXT-Bibliothek gesetzten Makros `I2C_SDA` und `I2C_SCL` werden vom Compiler durch 22 und 21 ersetzt.

### UART

Universal Asynchronous Receiver-Transmitter (UART) ist in gewisser Weise das einfachste Datenprotokoll, da es die Daten einfach als Binärdaten mit einer bestimmten Frequenz sendet. Als solches ist es auf Punkt-zu-Punkt-Kommunikation beschränkt, was bedeutet, dass Sie normalerweise keine mehreren Geräte im selben Bus haben können.

| **Pin-Name** | **Beschreibung**          | **Verwendung**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **TX**       | Transmit                  | Sendet Daten vom Hauptgerät an das Sekundärgerät.       |
| **RX**       | Receive                   | Empfängt Daten vom Sekundärgerät an das Hauptgerät.    |

Auf CanSat wird der UART im Erweiterungs-Header für nichts anderes verwendet. Es gibt jedoch eine andere UART-Leitung, die für die USB-Kommunikation zwischen Satellit und Computer verwendet wird. Dies wird verwendet, wenn Daten an den `Serial` gesendet werden.

Die andere UART-Leitung kann im Code so initialisiert werden:

```Cpp title="Initialisierung der zweiten seriellen Leitung"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Einige Geräte verwenden auch [Pulsweitenmodulation](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) als Steuereingang. Es kann auch für dimmbare LEDs oder zur Steuerung der Leistungsabgabe in einigen Situationen verwendet werden, unter vielen anderen Anwendungsfällen.

Bei Arduino können nur bestimmte Pins als PWM verwendet werden. Da CanSat NeXT jedoch ein auf ESP32 basierendes Gerät ist, können alle Ausgangspins verwendet werden, um einen PWM-Ausgang zu erzeugen. Die PWM wird mit `analogWrite` gesteuert.

## Was ist mit (meinem spezifischen Anwendungsfall)?

Für die meisten Geräte können Sie viele Informationen im Internet finden. Beispielsweise können Sie das spezifische Breakout googeln, das Sie haben, und diese Dokumente verwenden, um die Beispiele, die Sie finden, für die Verwendung mit CanSat NeXT zu modifizieren. Auch die Sensoren und anderen Geräte haben **Datenblätter**, die viele Informationen darüber enthalten sollten, wie das Gerät verwendet wird, obwohl sie manchmal etwas schwer zu entschlüsseln sein können. Wenn Sie der Meinung sind, dass diese Seite etwas hätte behandeln sollen, lassen Sie es mich bitte unter samuli@kitsat.fi wissen.

In der nächsten, letzten Lektion werden wir besprechen, wie Sie Ihren Satelliten für den Start vorbereiten.

[Klicken Sie hier für die nächste Lektion!](./lesson12)