---
sidebar_position: 2
---

# Erweiterungsschnittstelle

Benutzerdefinierte Geräte können erstellt und zusammen mit CanSat verwendet werden. Diese können verwendet werden, um interessante Projekte zu erstellen, für die Sie Ideen in unserem [Blog](/blog) finden können.

Die Erweiterungsschnittstelle von CanSat verfügt über eine freie UART-Leitung, zwei ADC-Pins und 5 freie digitale I/O-Pins. Zusätzlich sind SPI- und I2C-Leitungen für die Erweiterungsschnittstelle verfügbar, obwohl sie mit der SD-Karte bzw. dem Sensorsystem geteilt werden.

Der Benutzer kann auch wählen, die UART2- und ADC-Pins als digitale I/O zu verwenden, falls serielle Kommunikation oder Analog-Digital-Umwandlung in ihrer Lösung nicht benötigt werden.

| Pin-Nummer | Pin-Name | Verwendung als | Anmerkungen               |
|------------|----------|----------------|---------------------------|
| 12         | GPIO12   | Digital I/O    | Frei                      |
| 15         | GPIO15   | Digital I/O    | Frei                      |
| 16         | GPIO16   | UART2 RX       | Frei                      |
| 17         | GPIO17   | UART2 TX       | Frei                      |
| 18         | SPI_CLK  | SPI CLK        | Mitbenutzung mit SD-Karte |
| 19         | SPI_MISO | SPI MISO       | Mitbenutzung mit SD-Karte |
| 21         | I2C_SDA  | I2C SDA        | Mitbenutzung mit Sensorsystem |
| 22         | I2C_SCL  | I2C SCL        | Mitbenutzung mit Sensorsystem |
| 23         | SPI_MOSI | SPI MOSI       | Mitbenutzung mit SD-Karte |
| 25         | GPIO25   | Digital I/O    | Frei                      |
| 26         | GPIO26   | Digital I/O    | Frei                      |
| 27         | GPIO27   | Digital I/O    | Frei                      |
| 32         | GPIO32   | ADC            | Frei                      |
| 33         | GPIO33   | ADC            | Frei                      |

*Tabelle: Pin-Nachschlagetabelle der Erweiterungsschnittstelle. Pin-Name bezieht sich auf den Bibliothekspin-Namen.*

# Kommunikationsoptionen

Die CanSat-Bibliothek enthält keine Kommunikations-Wrapper für die benutzerdefinierten Geräte. Für UART-, I2C- und SPI-Kommunikation zwischen CanSat NeXT und Ihrem benutzerdefinierten Nutzlastgerät, beziehen Sie sich bitte auf Arduinos Standardbibliotheken [UART](https://docs.arduino.cc/learn/communication/uart/), [Wire](https://docs.arduino.cc/learn/communication/wire/) und [SPI](https://docs.arduino.cc/learn/communication/spi/).

## UART

Die UART2-Leitung ist eine gute Alternative, da sie als nicht zugewiesene Kommunikationsschnittstelle für erweiterte Nutzlasten dient.

Für das Senden von Daten über die UART-Leitung, beziehen Sie sich bitte auf die Arduino

```
       CanSat NeXT
          ESP32                          Benutzergerät
   +----------------+                 +----------------+
   |                |   TX (Transmit) |                |
   |       TX  o----|---------------->| RX  (Receive)  |
   |                |                 |                |
   |       RX  o<---|<----------------| TX             |
   |                |   GND (Ground)  |                |
   |       GND  o---|-----------------| GND            |
   +----------------+                 +----------------+
```
*Bild: UART-Protokoll in ASCII*


## I2C

Die Verwendung von I2C wird unterstützt, aber der Benutzer muss beachten, dass ein weiteres Subsystem auf der Leitung existiert.

Bei mehreren I2C-Slaves muss der Benutzer im Code angeben, welcher I2C-Slave zu einem bestimmten Zeitpunkt von CanSat verwendet wird. Dies wird durch eine Slave-Adresse unterschieden, die ein einzigartiger hexadezimaler Code für jedes Gerät ist und im Datenblatt des Subsystemgeräts gefunden werden kann.

## SPI

Die Verwendung von SPI wird ebenfalls unterstützt, aber der Benutzer muss beachten, dass ein weiteres Subsystem auf der Leitung existiert.

Bei SPI erfolgt die Slave-Unterscheidung stattdessen durch die Angabe eines Chip-Select-Pins. Der Benutzer muss einen der freien GPIO-Pins als Chip-Select für ihr benutzerdefiniertes erweitertes Nutzlastgerät festlegen. Der Chip-Select-Pin der SD-Karte ist in der ``CanSatPins.h``-Bibliotheksdatei als ``SD_CS`` definiert.

![CanSat NeXT I2C-Bus.](./img/i2c_bus2.png)

*Bild: der CanSat NeXT I2C-Bus mit mehreren sekundären oder "Slave"-Subsystemen. In diesem Kontext ist das Sensorsystem eines der Slave-Subsysteme.*

![CanSat NeXT SPI-Bus.](./img/spi_bus.png)

*Bild: die CanSat NeXT SPI-Bus-Konfiguration, wenn zwei sekundäre oder "Slave"-Subsysteme vorhanden sind. In diesem Kontext ist die SD-Karte eines der Slave-Subsysteme.*