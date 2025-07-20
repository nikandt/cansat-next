---
sidebar_position: 1
---

# Bibliotheksspezifikation

# Funktionen

Sie können alle regulären Arduino-Funktionalitäten mit CanSat NeXT nutzen, ebenso wie alle Arduino-Bibliotheken. Arduino-Funktionen finden Sie hier: https://www.arduino.cc/reference/en/.

Die CanSat NeXT-Bibliothek fügt mehrere einfach zu verwendende Funktionen hinzu, um die verschiedenen an Bord befindlichen Ressourcen wie Sensoren, Funk und die SD-Karte zu nutzen. Die Bibliothek wird mit einer Reihe von Beispielskizzen geliefert, die zeigen, wie diese Funktionalitäten genutzt werden. Die folgende Liste zeigt auch alle verfügbaren Funktionen.

## Systeminitialisierungsfunktionen

### CanSatInit

| Funktion             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewerttyp**  | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Initialisierung erfolgreich war, oder einen Wert ungleich Null, wenn ein Fehler aufgetreten ist. |
| **Parameter**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-Byte-MAC-Adresse, die vom Satelliten und der Bodenstation geteilt wird. Dies ist ein optionaler Parameter - wenn er nicht angegeben wird, wird das Funkmodul nicht initialisiert. Verwendet in Beispielskizze: Alle |
| **Beschreibung**     | Dieser Befehl befindet sich im `setup()` fast aller CanSat NeXT-Skripte. Er wird verwendet, um die CanSatNeXT-Hardware zu initialisieren, einschließlich der Sensoren und der SD-Karte. Zusätzlich, wenn die `macAddress` angegeben wird, startet es das Funkmodul und beginnt, eingehende Nachrichten zu empfangen. Die MAC-Adresse sollte von der Bodenstation und dem Satelliten geteilt werden. Die MAC-Adresse kann frei gewählt werden, aber es gibt einige ungültige Adressen, wie alle Bytes `0x00`, `0x01` und `0xFF`. Wenn die Init-Funktion mit einer ungültigen Adresse aufgerufen wird, wird das Problem an die Serial gemeldet. |

### CanSatInit (vereinfachte MAC-Adressenspezifikation)

| Funktion             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewerttyp**  | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Initialisierung erfolgreich war, oder einen Wert ungleich Null, wenn ein Fehler aufgetreten ist. |
| **Parameter**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Letztes Byte der MAC-Adresse, verwendet, um zwischen verschiedenen CanSat-GS-Paaren zu unterscheiden. |
| **Beschreibung**     | Dies ist eine vereinfachte Version der CanSatInit mit MAC-Adresse, die die anderen Bytes automatisch auf einen bekannten sicheren Wert setzt. Dies ermöglicht es den Benutzern, ihre Sender-Empfänger-Paare mit nur einem Wert zu unterscheiden, der zwischen 0 und 255 liegen kann. |

### GroundStationInit

| Funktion             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewerttyp**  | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Initialisierung erfolgreich war, oder einen Wert ungleich Null, wenn ein Fehler aufgetreten ist. |
| **Parameter**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-Byte MAC-Adresse, die vom Satelliten und der Bodenstation gemeinsam genutzt wird. |
| **Verwendet im Beispielsketch** | Groundstation Empfang                                          |
| **Beschreibung**     | Dies ist ein naher Verwandter der CanSatInit-Funktion, erfordert jedoch immer die MAC-Adresse. Diese Funktion initialisiert nur das Funkgerät, nicht andere Systeme. Die Bodenstation kann jedes ESP32-Board sein, einschließlich jedes Entwicklungsboards oder sogar eines anderen CanSat NeXT-Boards. |

### GroundStationInit (vereinfachte MAC-Adressenspezifikation)

| Funktion             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewerttyp**  | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Initialisierung erfolgreich war, oder einen Wert ungleich Null, wenn ein Fehler aufgetreten ist. |
| **Parameter**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Letztes Byte der MAC-Adresse, verwendet zur Unterscheidung zwischen verschiedenen CanSat-GS-Paaren. |
| **Beschreibung**     | Dies ist eine vereinfachte Version der GroundStationInit mit MAC-Adresse, die die anderen Bytes automatisch auf einen bekannten sicheren Wert setzt. Dies ermöglicht es den Benutzern, ihre Sender-Empfänger-Paare mit nur einem Wert zu unterscheiden, der zwischen 0-255 liegen kann. |

## IMU-Funktionen

### readAcceleration

| Funktion             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewerttyp**  | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Messung erfolgreich war.                           |
| **Parameter**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adresse einer Float-Variable, in der die Daten der x-Achse gespeichert werden. |
| **Verwendet im Beispielsketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Beschleunigung vom integrierten IMU zu lesen. Die Parameter sind Adressen zu Float-Variablen für jede Achse. Das Beispiel IMU zeigt, wie diese Funktion verwendet wird, um die Beschleunigung zu lesen. Die Beschleunigung wird in Einheiten von G (9,81 m/s) zurückgegeben. |

### readAccelX

| Funktion             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewerttyp**  | `float`                                                          |
| **Rückgabewert**     | Gibt die lineare Beschleunigung auf der X-Achse in Einheiten von G zurück.                           |
| **Verwendet im Beispielsketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Beschleunigung vom integrierten IMU auf einer bestimmten Achse zu lesen. Das Beispiel IMU zeigt, wie diese Funktion verwendet wird, um die Beschleunigung zu lesen. Die Beschleunigung wird in Einheiten von G (9,81 m/s) zurückgegeben. |

### readAccelY

| Funktion             | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `float`                                                          |
| **Rückgabewert**     | Gibt die lineare Beschleunigung auf der Y-Achse in Einheiten von G zurück.                           |
| **Verwendet im Beispiel-Sketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Beschleunigung von der an Bord befindlichen IMU auf einer bestimmten Achse zu lesen. Das Beispiel IMU zeigt, wie diese Funktion verwendet wird, um die Beschleunigung zu lesen. Die Beschleunigung wird in Einheiten von G (9,81 m/s) zurückgegeben. |

### readAccelZ

| Funktion             | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `float`                                                          |
| **Rückgabewert**     | Gibt die lineare Beschleunigung auf der Z-Achse in Einheiten von G zurück.                           |
| **Verwendet im Beispiel-Sketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Beschleunigung von der an Bord befindlichen IMU auf einer bestimmten Achse zu lesen. Das Beispiel IMU zeigt, wie diese Funktion verwendet wird, um die Beschleunigung zu lesen. Die Beschleunigung wird in Einheiten von G (9,81 m/s) zurückgegeben. |

### readGyro

| Funktion             | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn die Messung erfolgreich war.                           |
| **Parameter**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adresse einer Float-Variable, in der die Daten der X-Achse gespeichert werden. |
| **Verwendet im Beispiel-Sketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Winkelgeschwindigkeit von der an Bord befindlichen IMU zu lesen. Die Parameter sind Adressen zu Float-Variablen für jede Achse. Das Beispiel IMU zeigt, wie diese Funktion verwendet wird, um die Winkelgeschwindigkeit zu lesen. Die Winkelgeschwindigkeit wird in Einheiten mrad/s zurückgegeben. |

### readGyroX

| Funktion             | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `float`                                                          |
| **Rückgabewert**     | Gibt die Winkelgeschwindigkeit auf der X-Achse in Einheiten von mrad/s zurück.                           |
| **Verwendet im Beispiel-Sketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Winkelgeschwindigkeit von der an Bord befindlichen IMU auf einer bestimmten Achse zu lesen. Die Parameter sind Adressen zu Float-Variablen für jede Achse. Die Winkelgeschwindigkeit wird in Einheiten mrad/s zurückgegeben. |

### readGyroY

| Funktion             | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `float`                                                          |
| **Rückgabewert**     | Gibt die Winkelgeschwindigkeit auf der Y-Achse in Einheiten von mrad/s zurück.                           |
| **Verwendet im Beispiel-Sketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Winkelgeschwindigkeit von der an Bord befindlichen IMU auf einer bestimmten Achse zu lesen. Die Parameter sind Adressen zu Float-Variablen für jede Achse. Die Winkelgeschwindigkeit wird in Einheiten mrad/s zurückgegeben. |

### readGyroZ

| Funktion             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `float`                                                          |
| **Rückgabewert**     | Gibt die Winkelgeschwindigkeit auf der Z-Achse in Einheiten von mrad/s zurück.                           |
| **Verwendet im Beispiel-Sketch** | IMU                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Winkelgeschwindigkeit von der On-Board-IMU auf einer bestimmten Achse zu lesen. Die Parameter sind Adressen zu Float-Variablen für jede Achse. Die Winkelgeschwindigkeit wird in Einheiten von mrad/s zurückgegeben. |

## Barometer-Funktionen

### readPressure

| Funktion             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `float`                                                            |
| **Rückgabewert**     | Druck in mbar                                                      |
| **Parameter**        | Keine                                                              |
| **Verwendet im Beispiel-Sketch** | Baro                                                        |
| **Beschreibung**     | Diese Funktion gibt den Druck zurück, wie er vom On-Board-Barometer gemeldet wird. Der Druck ist in Einheiten von Millibar. |

### readTemperature

| Funktion             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `float`                                                            |
| **Rückgabewert**     | Temperatur in Celsius                                             |
| **Parameter**        | Keine                                                              |
| **Verwendet im Beispiel-Sketch** | Baro                                                        |
| **Beschreibung**     | Diese Funktion gibt die Temperatur zurück, wie sie vom On-Board-Barometer gemeldet wird. Die Einheit der Messung ist Celsius. Beachten Sie, dass dies die interne Temperatur ist, die vom Barometer gemessen wird, sodass sie möglicherweise nicht die Außentemperatur widerspiegelt. |

## SD-Karten- / Dateisystem-Funktionen

### SDCardPresent

| Funktion             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `bool`                                                             |
| **Rückgabewert**     | Gibt true zurück, wenn eine SD-Karte erkannt wird, andernfalls false.               |
| **Parameter**        | Keine                                                              |
| **Verwendet im Beispiel-Sketch** | SD_advanced                                                |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um zu überprüfen, ob die SD-Karte mechanisch vorhanden ist. Der SD-Kartensteckplatz verfügt über einen mechanischen Schalter, der gelesen wird, wenn diese Funktion aufgerufen wird. Gibt true oder false zurück, je nachdem, ob die SD-Karte erkannt wird. |

### appendFile

| Funktion             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn das Schreiben erfolgreich war.                 |
| **Parameter**        |                                                                    |
|                      | `String filename`: Adresse der Datei, die angehängt werden soll. Wenn die Datei nicht existiert, wird sie erstellt. |
|                      | `T data`: Daten, die am Ende der Datei angehängt werden sollen.    |
| **Verwendet im Beispiel-Sketch** | SD_write                                               |
| **Beschreibung**     | Dies ist die grundlegende Schreibfunktion, die verwendet wird, um Messwerte auf der SD-Karte zu speichern. |

### printFileSystem

| Funktion             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `void`                                                             |
| **Parameter**        | Keine                                                              |
| **Verwendet im Beispiel-Sketch** | SD_advanced                                                |
| **Beschreibung**     | Dies ist eine kleine Hilfsfunktion, um die Namen von Dateien und Ordnern auf der SD-Karte auszugeben. Kann in der Entwicklung verwendet werden. |

### newDir

| Funktion             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `String path`: Pfad des neuen Verzeichnisses. Wenn es bereits existiert, wird nichts unternommen. |
| **Verwendet im Beispiel-Sketch** | SD_advanced                                                |
| **Beschreibung**     | Wird verwendet, um neue Verzeichnisse auf der SD-Karte zu erstellen. |

### deleteDir

| Funktion             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `String path`: Pfad des zu löschenden Verzeichnisses.              |
| **Verwendet im Beispiel-Sketch** | SD_advanced                                                |
| **Beschreibung**     | Wird verwendet, um Verzeichnisse auf der SD-Karte zu löschen.      |

### fileExists

| Funktion             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert-Typ** | `bool`                                                             |
| **Rückgabewert**     | Gibt true zurück, wenn die Datei existiert.                        |
| **Parameter**        |                                                                    |
|                      | `String path`: Pfad zur Datei.                                     |
| **Verwendet im Beispiel-Sketch** | SD_advanced                                                |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um zu überprüfen, ob eine Datei auf der SD-Karte existiert. |

### fileSize

| Funktion             | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint32_t`                                                         |
| **Rückgabewert**     | Größe der Datei in Bytes.                                          |
| **Parameter**        |                                                                    |
|                      | `String path`: Pfad zur Datei.                                     |
| **Verwendet im Beispielsketch** | SD_advanced                                           |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Größe einer Datei auf der SD-Karte zu lesen. |

### writeFile

| Funktion             | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | Gibt 0 zurück, wenn das Schreiben erfolgreich war.                 |
| **Parameter**        |                                                                    |
|                      | `String filename`: Adresse der zu schreibenden Datei.              |
|                      | `T data`: Daten, die in die Datei geschrieben werden sollen.       |
| **Verwendet im Beispielsketch** | SD_advanced                                           |
| **Beschreibung**     | Diese Funktion ist ähnlich wie `appendFile()`, überschreibt jedoch vorhandene Daten auf der SD-Karte. Für die Datenspeicherung sollte stattdessen `appendFile` verwendet werden. Diese Funktion kann nützlich sein, um z.B. Einstellungen zu speichern. |

### readFile

| Funktion             | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `String`                                                           |
| **Rückgabewert**     | Gesamter Inhalt der Datei.                                         |
| **Parameter**        |                                                                    |
|                      | `String path`: Pfad zur Datei.                                     |
| **Verwendet im Beispielsketch** | SD_advanced                                           |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um alle Daten aus einer Datei in eine Variable zu lesen. Der Versuch, große Dateien zu lesen, kann Probleme verursachen, aber für kleine Dateien wie Konfigurations- oder Einstellungsdateien ist es in Ordnung. |

### renameFile

| Funktion             | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `String oldpath`: Ursprünglicher Pfad zur Datei.                   |
|                      | `String newpath`: Neuer Pfad der Datei.                            |
| **Verwendet im Beispielsketch** | SD_advanced                                           |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um Dateien auf der SD-Karte umzubenennen oder zu verschieben. |

### deleteFile

| Funktion             | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert**     | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `String path`: Pfad der zu löschenden Datei.                       |
| **Verwendet im Beispiel-Sketch** | SD_advanced                                                |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um Dateien von der SD-Karte zu löschen.        |

## Radiofunktionen

### onDataReceived

| Funktion             | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert**     | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `String data`: Empfangene Daten als Arduino-String.                |
| **Verwendet im Beispiel-Sketch** | Groundstation_receive                                      |
| **Beschreibung**     | Dies ist eine Callback-Funktion, die aufgerufen wird, wenn Daten empfangen werden. Der Benutzer-Code sollte diese Funktion definieren, und der CanSat NeXT wird sie automatisch aufrufen, wenn Daten empfangen werden. |

### onBinaryDataReceived

| Funktion             | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert**     | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `const uint8_t *data`: Empfangene Daten als uint8_t-Array.          |
|                      | `uint16_t len`: Länge der empfangenen Daten in Bytes.                      |
| **Verwendet im Beispiel-Sketch** | Keine                                                 |
| **Beschreibung**     | Dies ist ähnlich der Funktion `onDataReceived`, aber die Daten werden als Binärdaten anstelle eines String-Objekts bereitgestellt. Dies ist für fortgeschrittene Benutzer gedacht, die das String-Objekt als einschränkend empfinden. |

### onDataSent

| Funktion             | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert**     | `void`                                                             |
| **Parameter**        |                                                                    |
|                      | `const bool success`: Boolean, der angibt, ob die Daten erfolgreich gesendet wurden. |
| **Verwendet im Beispiel-Sketch** | Keine                                                 |
| **Beschreibung**     | Dies ist eine weitere Callback-Funktion, die bei Bedarf zum Benutzer-Code hinzugefügt werden kann. Sie kann verwendet werden, um zu überprüfen, ob der Empfang von einem anderen Radio bestätigt wurde. |

### getRSSI

| Funktion             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabewert**     | `int8_t`                                                          |
| **Rückgabewert**     | RSSI der zuletzt empfangenen Nachricht. Gibt 1 zurück, wenn seit dem Start keine Nachrichten empfangen wurden.                           |
| **Verwendet im Beispiel-Sketch** | Keine                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Signalstärke des Empfangs zu überwachen. Sie kann verwendet werden, um Antennen zu testen oder die Funkreichweite zu beurteilen. Der Wert wird in [dBm](https://en.wikipedia.org/wiki/DBm) ausgedrückt, jedoch ist die Skala nicht genau.  |

### sendData (String-Variante)

| Funktion             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | 0, wenn Daten gesendet wurden (zeigt keine Bestätigung an).        |
| **Parameter**        |                                                                    |
|                      | `T data`: Zu sendende Daten. Jeder Datentyp kann verwendet werden, wird jedoch intern in einen String konvertiert.                  |
| **Verwendet im Beispielsketch** | Send_data                                             |
| **Beschreibung**     | Dies ist die Hauptfunktion zum Senden von Daten zwischen der Bodenstation und dem Satelliten. Beachten Sie, dass der Rückgabewert nicht anzeigt, ob die Daten tatsächlich empfangen wurden, sondern nur, dass sie gesendet wurden. Der Callback `onDataSent` kann verwendet werden, um zu überprüfen, ob die Daten vom anderen Ende empfangen wurden. |

### sendData (Binäre Variante) {#sendData-binary}

| Funktion             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                          |
| **Rückgabewert**     | 0, wenn Daten gesendet wurden (zeigt keine Bestätigung an).        |
| **Parameter**        |                                                                    |
|                      | `T* data`: Zu sendende Daten.                    |
|                      | `uint16_t len`: Länge der Daten in Bytes.                      |
| **Verwendet im Beispielsketch** | Keine                                                 |
| **Beschreibung**     | Eine binäre Variante der `sendData`-Funktion, bereitgestellt für fortgeschrittene Benutzer, die sich durch das String-Objekt eingeschränkt fühlen. |

### getRSSI

| Funktion             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `int8_t`                                                          |
| **Rückgabewert**     | RSSI der zuletzt empfangenen Nachricht. Gibt 1 zurück, wenn seit dem Start keine Nachrichten empfangen wurden.                           |
| **Verwendet im Beispielsketch** | Keine                                                  |
| **Beschreibung**     | Diese Funktion kann verwendet werden, um die Signalstärke des Empfangs zu überwachen. Sie kann verwendet werden, um Antennen zu testen oder die Funkreichweite zu beurteilen. Der Wert wird in [dBm](https://en.wikipedia.org/wiki/DBm) ausgedrückt, jedoch ist die Skala nicht genau. 

### setRadioChannel

| Funktion             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Rückgabetyp**      | `void`                                                          |
| **Rückgabewert**     | Keine                                                            |
| **Parameter**        | `uint8_t newChannel`: Gewünschte Wi-Fi-Kanalnummer (1–11). Jeder Wert über 11 wird auf 11 begrenzt. |
| **Verwendet im Beispielsketch** | Keine                                                      |
| **Beschreibung**     | Setzt den ESP-NOW-Kommunikationskanal. Der neue Kanal muss innerhalb des Bereichs der Standard-Wi-Fi-Kanäle (1–11) liegen, die Frequenzen ab 2,412 GHz mit Schritten von 5 MHz entsprechen. Kanal 1 ist 2,412, Kanal 2 ist 2,417 und so weiter. Rufen Sie diese Funktion vor der Initialisierung der Bibliothek auf. Der Standardkanal ist 1. |

### getRadioChannel

| Funktion             | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Rückgabetyp**      | `uint8_t`                                                       |
| **Rückgabewert**     | Der aktuelle primäre Wi-Fi-Kanal. Gibt 0 zurück, wenn beim Abrufen des Kanals ein Fehler auftritt. |
| **Verwendet im Beispiel-Sketch** | Keine                                                      |
| **Beschreibung**     | Ruft den derzeit verwendeten primären Wi-Fi-Kanal ab. Diese Funktion funktioniert nur nach der Initialisierung der Bibliothek. |

### printRadioFrequency

| Funktion             | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Rückgabetyp**      | `void`                                                          |
| **Rückgabewert**     | Keine                                                           |
| **Verwendet im Beispiel-Sketch** | Keine                                                      |
| **Beschreibung**     | Berechnet und druckt die aktuelle Frequenz in GHz basierend auf dem aktiven Wi-Fi-Kanal. Diese Funktion funktioniert nur nach der Initialisierung der Bibliothek. |


## ADC-Funktionen

### adcToVoltage

| Funktion             | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `float`                                                            |
| **Rückgabewert**     | Umgewandelte Spannung in Volt.                                     |
| **Parameter**        |                                                                    |
|                      | `int value`: Zu konvertierender ADC-Wert.                         |
| **Verwendet im Beispiel-Sketch** | AccurateAnalogRead                                    |
| **Beschreibung**     | Diese Funktion konvertiert einen ADC-Wert in Spannung unter Verwendung eines kalibrierten Polynoms dritten Grades für eine linearere Umwandlung. Beachten Sie, dass diese Funktion die Spannung am Eingangspin berechnet. Um die Batteriespannung zu berechnen, müssen Sie auch das Widerstandsnetzwerk berücksichtigen. |

### analogReadVoltage

| Funktion             | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Rückgabetyp**      | `float`                                                            |
| **Rückgabewert**     | ADC-Spannung in Volt.                                              |
| **Parameter**        |                                                                    |
|                      | `int pin`: Zu lesender Pin.                                        |
| **Verwendet im Beispiel-Sketch** | AccurateAnalogRead                                    |
| **Beschreibung**     | Diese Funktion liest die Spannung direkt, anstatt `analogRead` zu verwenden, und konvertiert die Messung intern mit `adcToVoltage` in Spannung. |