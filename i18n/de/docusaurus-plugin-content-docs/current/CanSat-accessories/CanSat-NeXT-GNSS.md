---
sidebar_position: 1
---

# CanSat NeXT GNSS-Modul

Das CanSat NeXT GNSS-Modul erweitert CanSat NeXT um Standortverfolgung und präzise Echtzeituhr-Funktionen. Das Modul basiert auf dem U-Blox SAM-M10Q GNSS-Empfänger von U-Blox.

![CanSat NeXT GNSS-Modul](./img/GNSS.png)

## Hardware

Das Modul verbindet den GNSS-Empfänger über die UART im Erweiterungsheader mit dem CanSat NeXT. Das Gerät verwendet die Pins 16 und 17 des Erweiterungsheaders für UART RX und TX und bezieht die Stromversorgung aus der +3V3-Leitung im Erweiterungsheader.

Standardmäßig werden die Backup-Register des GNSS-Moduls aus der +3V3-Leitung gespeist. Dies macht das Modul einfach zu verwenden, bedeutet jedoch, dass das Modul immer von vorne beginnen muss, wenn es versucht, eine Verbindung herzustellen. Um dies zu mildern, ist es möglich, eine externe Stromquelle über die Backup-Spannungsleitung über die J103-Header bereitzustellen. Die an den V_BCK-Pin angelegte Spannung sollte 2-6,5 Volt betragen, und der Stromverbrauch beträgt konstant 65 Mikroampere, selbst wenn die Hauptstromversorgung ausgeschaltet ist. Die Bereitstellung der Backup-Spannung ermöglicht es dem GNSS-Empfänger, alle Einstellungen sowie die Almanach- und Ephemeridendaten beizubehalten - wodurch die Zeit zur Erzielung einer Verbindung von ~30 Sekunden auf 1-2 Sekunden reduziert wird, wenn sich das Gerät zwischen den Stromschaltern nicht wesentlich bewegt hat.

Es gibt viele andere GNSS-Breakouts und -Module von Unternehmen wie Sparkfun und Adafruit, unter anderem. Diese können über die gleiche UART-Schnittstelle oder über SPI und I2C, je nach Modul, mit CanSat NeXT verbunden werden. Die CanSat NeXT-Bibliothek sollte auch andere Breakouts unterstützen, die U-blox-Module verwenden. Bei der Suche nach GNSS-Breakouts sollten Sie versuchen, eines zu finden, bei dem die Basisplatine so groß wie möglich ist - die meisten haben zu kleine Platinen, was ihre Antennenleistung im Vergleich zu Modulen mit größeren Platinen sehr schwach macht. Jede Größe kleiner als 50x50 mm wird die Leistung und die Fähigkeit, eine Verbindung zu finden und aufrechtzuerhalten, beeinträchtigen.

Für weitere Informationen über das GNSS-Modul und die Vielzahl an verfügbaren Einstellungen und Funktionen, lesen Sie das Datenblatt des GNSS-Empfängers auf der [U-Blox-Website](https://www.u-blox.com/en/product/sam-m10q-module).

Die Hardware-Integration des Moduls in CanSat NeXT ist wirklich einfach - nach dem Hinzufügen von Abstandshaltern zu den Schraubenlöchern, stecken Sie die Header-Pins vorsichtig in die Pin-Sockel. Wenn Sie beabsichtigen, einen mehrschichtigen Elektronikstapel zu erstellen, stellen Sie sicher, dass Sie das GNSS als oberstes Modul platzieren, um 

![CanSat NeXT GNSS-Modul](./img/stack.png)

## Software

Der einfachste Weg, um mit dem CanSat NeXT GNSS zu beginnen, ist unsere eigene Arduino-Bibliothek, die Sie im Arduino-Bibliotheksmanager finden können. Anweisungen zur Installation der Bibliothek finden Sie auf der [Erste Schritte](./../course/lesson1) Seite.

Die Bibliothek enthält Beispiele, wie man die Position und die aktuelle Zeit liest sowie wie man die Daten mit CanSat NeXT überträgt.

Ein kurzer Hinweis zu den Einstellungen - dem Modul muss mitgeteilt werden, in welcher Art von Umgebung es verwendet wird, damit es die Position des Benutzers am besten approximieren kann. Typischerweise wird angenommen, dass sich der Benutzer auf Bodenhöhe befindet und sich möglicherweise bewegt, die Beschleunigung jedoch wahrscheinlich nicht sehr hoch ist. Dies ist natürlich nicht der Fall bei CanSats, die möglicherweise mit Raketen gestartet werden oder mit ziemlich hohen Geschwindigkeiten auf den Boden treffen. Daher setzt die Bibliothek standardmäßig die Position auf die Annahme einer hochdynamischen Umgebung, was es ermöglicht, die Verbindung zumindest teilweise während schneller Beschleunigung aufrechtzuerhalten, aber es macht die Position am Boden deutlich weniger präzise. Wenn stattdessen eine hohe Genauigkeit nach der Landung wünschenswerter ist, können Sie das GNSS-Modul mit dem Befehl `GNSS_init(DYNAMIC_MODEL_GROUND)` initialisieren, indem Sie das Standard-`GNSS_init(DYNAMIC_MODEL_ROCKET)` = `GNSS_init()` ersetzen. Zusätzlich gibt es `DYNAMIC_MODEL_AIRBORNE`, das etwas genauer ist als das Raketenmodell, aber nur moderate Beschleunigung annimmt.

Diese Bibliothek priorisiert Benutzerfreundlichkeit und bietet nur grundlegende Funktionen wie das Abrufen von Standort und Zeit vom GNSS. Für Benutzer, die nach fortgeschritteneren GNSS-Funktionen suchen, könnte die ausgezeichnete SparkFun_u-blox_GNSS_Arduino_Library eine bessere Wahl sein.

## Bibliotheksspezifikation

Hier sind die verfügbaren Befehle aus der CanSat GNSS-Bibliothek.

### GNSS_Init

| Funktion             | uint8_t GNSS_Init(uint8_t dynamic_model)                          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 1 zurück, wenn die Initialisierung erfolgreich war, oder 0, wenn ein Fehler aufgetreten ist. |
| **Parameter**        |                                                                    |
|                      | `uint8_t dynamic_model`                                           |
|                      | Wählt das dynamische Modell oder die Umgebung, die das GNSS-Modul annimmt. Mögliche Optionen sind DYNAMIC_MODEL_GROUND, DYNAMIC_MODEL_AIRBORNE und DYNAMIC_MODEL_ROCKET. |
| **Beschreibung**     | Dieser Befehl initialisiert das GNSS-Modul, und Sie sollten ihn in der Setup-Funktion aufrufen. |

### readPosition

| Funktion             | uint8_t readPosition(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Messung erfolgreich war.                           |
| **Parameter**        |                                                                    |
|                      | `float &latitude, float &longitude, float &altitude`                                    |
|                      | `float &x`: Adresse einer Float-Variablen, in der die Daten gespeichert werden. |
| **Verwendet im Beispielsketch** | Alle                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Position des Geräts als Koordinaten zu lesen. Die Werte sind halbzufällig, bevor die Verbindung hergestellt wird. Die Höhe ist in Metern über dem Meeresspiegel, obwohl sie nicht sehr genau ist. |


### getSIV

| Funktion             | uint8_t getSIV()                  |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | Anzahl der sichtbaren Satelliten |
| **Verwendet im Beispielsketch** | AdditionalFunctions                                          |
| **Beschreibung**     | Gibt die Anzahl der sichtbaren Satelliten zurück. Typischerweise deuten Werte unter 3 auf keine Verbindung hin. |

### getTime

| Funktion             | uint32_t getTime()                  |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint32_t`                                                          |
| **Rückgabewert**     | Aktuelle Epoch-Zeit |
| **Verwendet im Beispielsketch** | AdditionalFunctions                                          |
| **Beschreibung**     | Gibt die aktuelle Epoch-Zeit zurück, wie sie von den Signalen der GNSS-Satelliten angezeigt wird. Mit anderen Worten, dies ist die Anzahl der Sekunden, die seit 00:00:00 UTC, Donnerstag, dem ersten Januar 1970, vergangen sind. |