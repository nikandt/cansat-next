---
sidebar_position: 10
---

# Lektion 9: Einsen und Nullen

Bisher haben wir Text verwendet, wenn wir Daten speichern oder übertragen. Während dies die Interpretation erleichtert, ist es auch ineffizient. Computer verwenden intern **binäre** Daten, bei denen die Daten als Mengen von Einsen und Nullen gespeichert werden. In dieser Lektion werden wir uns Möglichkeiten ansehen, binäre Daten mit CanSat NeXT zu verwenden, und diskutieren, wo und warum es nützlich sein kann, dies zu tun.

:::info

## Verschiedene Datentypen

In binärer Form werden alle Daten – ob Zahlen, Text oder Sensorwerte – als eine Reihe von Einsen und Nullen dargestellt. Verschiedene Datentypen verwenden unterschiedliche Mengen an Speicher und interpretieren die binären Werte auf spezifische Weise. Lassen Sie uns kurz einige gängige Datentypen und deren Speicherung in binärer Form überprüfen:

- **Integer (int)**:  
  Ganzzahlen repräsentieren ganze Zahlen. In einem 16-Bit-Integer können beispielsweise 16 Einsen und Nullen Werte von \(-32.768\) bis \(32.767\) darstellen. Negative Zahlen werden mit einer Methode namens **Zweierkomplement** gespeichert.

- **Unsigned Integer (uint)**:  
  Unsigned Integers repräsentieren nicht-negative Zahlen. Ein 16-Bit-Unsigned Integer kann Werte von \(0\) bis \(65.535\) speichern, da keine Bits für das Vorzeichen reserviert sind.

- **Float**:  
  Gleitkommazahlen repräsentieren Dezimalwerte. In einem 32-Bit-Float repräsentiert ein Teil der Bits das Vorzeichen, den Exponenten und die Mantisse, wodurch Computer sehr große und sehr kleine Zahlen verarbeiten können. Es ist im Wesentlichen eine binäre Form der [wissenschaftlichen Notation](https://de.wikipedia.org/wiki/Wissenschaftliche_Notation).

- **Zeichen (char)**:  
  Zeichen werden mit Kodierungsschemata wie **ASCII** oder **UTF-8** gespeichert. Jedes Zeichen entspricht einem bestimmten binären Wert (z. B. wird 'A' in ASCII als `01000001` gespeichert).

- **Strings**:  
  Strings sind einfach Sammlungen von Zeichen. Jedes Zeichen in einem String wird in Sequenz als individuelle binäre Werte gespeichert. Zum Beispiel würde der String `"CanSat"` als eine Reihe von Zeichen wie `01000011 01100001 01101110 01010011 01100001 01110100` gespeichert (jeweils repräsentierend 'C', 'a', 'n', 'S', 'a', 't'). Wie Sie sehen können, ist das Darstellen von Zahlen als Strings, wie wir es bisher getan haben, weniger effizient im Vergleich zur Speicherung als binäre Werte.

- **Arrays und `uint8_t`**:  
  Beim Arbeiten mit binären Daten ist es üblich, ein Array von `uint8_t` zu verwenden, um rohe Byte-Daten zu speichern und zu verarbeiten. Der Typ `uint8_t` repräsentiert einen unsignierten 8-Bit-Integer, der Werte von 0 bis 255 halten kann. Da jedes Byte aus 8 Bits besteht, ist dieser Typ gut geeignet, um binäre Daten zu halten.
  Arrays von `uint8_t` werden oft verwendet, um Byte-Puffer zu erstellen, die Sequenzen von rohen binären Daten (z. B. Pakete) halten. Einige Leute bevorzugen `char` oder andere Variablen, aber es spielt keine Rolle, welche verwendet wird, solange die Variable eine Länge von 1 Byte hat.
:::

## Übertragung binärer Daten

Lassen Sie uns mit dem Flashen eines einfachen Programms auf den CanSat beginnen und uns mehr auf die Bodenstation konzentrieren. Hier ein einfacher Code, der eine Messung im binären Format überträgt:

```Cpp title="Übertrage LDR-Daten als binär"
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

Der Code sieht ansonsten sehr vertraut aus, aber `sendData` nimmt jetzt zwei Argumente anstatt nur eines - zuerst die **Speicheradresse** der zu übertragenden Daten und dann die **Länge** der zu übertragenden Daten. In diesem vereinfachten Fall verwenden wir einfach die Adresse und Länge der Variablen `LDR_voltage`.

Wenn Sie versuchen, dies mit dem typischen Bodenstationscode zu empfangen, wird es nur Kauderwelsch ausgeben, da es versucht, die binären Daten so zu interpretieren, als wären sie ein String. Stattdessen müssen wir der Bodenstation angeben, was die Daten enthalten.

Zuerst lassen Sie uns überprüfen, wie lang die Daten tatsächlich sind, die wir empfangen.

```Cpp title="Länge der empfangenen Daten überprüfen"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Empfangen ");
  Serial.print(len);
  Serial.println(" Bytes");
}
```

Jedes Mal, wenn der Satellit sendet, empfangen wir 4 Bytes auf der Bodenstation. Da wir einen 32-Bit-Float übertragen, scheint dies richtig zu sein.

Um die Daten zu lesen, müssen wir den binären Datenpuffer aus dem Eingabestream nehmen und die Daten in eine geeignete Variable kopieren. Für diesen einfachen Fall können wir dies tun:

```Cpp title="Speichern der Daten in eine Variable"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Empfangen ");
  Serial.print(len);
  Serial.println(" Bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Daten: ");
  Serial.println(LDR_reading);
}
```

Zuerst führen wir die Variable `LDR_reading` ein, um die Daten zu halten, von denen wir *wissen*, dass wir sie im Puffer haben. Dann verwenden wir `memcpy` (Speicherkopie), um die binären Daten aus dem `data`-Puffer in die **Speicheradresse** von `LDR_reading` zu kopieren. Dies stellt sicher, dass die Daten genau so übertragen werden, wie sie gespeichert wurden, und das gleiche Format wie auf dem Satelliten beibehalten wird.

Wenn wir nun die Daten ausdrucken, ist es, als hätten wir sie direkt auf der GS-Seite gelesen. Es ist nicht mehr Text wie früher, sondern die tatsächlichen gleichen Daten, die wir auf der Satellitenseite gelesen haben. Jetzt können wir sie auf der GS-Seite leicht nach Belieben verarbeiten.

## Unser eigenes Protokoll erstellen

Die wahre Stärke der binären Datenübertragung wird deutlich, wenn wir mehr Daten zu übertragen haben. Wir müssen jedoch sicherstellen, dass der Satellit und die Bodenstation sich einig sind, welches Byte was darstellt. Dies wird als **Paketprotokoll** bezeichnet.

Ein Paketprotokoll definiert die Struktur der zu übertragenden Daten und legt fest, wie mehrere Datenstücke in eine einzige Übertragung gepackt werden und wie der Empfänger die eingehenden Bytes interpretieren soll. Lassen Sie uns ein einfaches Protokoll erstellen, das mehrere Sensorwerte auf strukturierte Weise überträgt.

Zuerst lesen wir alle Beschleunigungs- und Gyroskopkanäle und erstellen das **Datenpaket** aus den Messwerten.

```Cpp title="Übertrage LDR-Daten als binär"
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

  // Erstellen eines Arrays zur Speicherung der Daten
  uint8_t packet[24];

  // Kopieren der Daten in das Paket
  memcpy(&packet[0], &ax, 4);  // Kopiere Beschleunigung X in Bytes 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Kopiere Gyroskop Z in Bytes 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Hier lesen wir zuerst die Daten wie in Lektion 3, aber dann **kodieren** wir die Daten in ein Datenpaket. Zuerst wird der eigentliche Puffer erstellt, der einfach eine leere Menge von 24 Bytes ist. Jede Datenvariable kann dann mit `memcpy` in diesen leeren Puffer geschrieben werden. Da wir `float` verwenden, haben die Daten eine Länge von 4 Bytes. Wenn Sie sich über die Länge einer Variablen nicht sicher sind, können Sie sie immer mit `sizeof(variable)` überprüfen.

:::tip[Übung]

Erstellen Sie eine Bodenstationssoftware, um die Beschleunigungs- und Gyroskopdaten zu interpretieren und auszugeben.

:::

## Binäre Daten auf SD-Karte speichern

Das Schreiben von Daten als binär auf die SD-Karte kann nützlich sein, wenn mit sehr großen Datenmengen gearbeitet wird, da die binäre Speicherung kompakter und effizienter als Text ist. Dies ermöglicht es Ihnen, mehr Daten mit weniger Speicherplatz zu speichern, was in speicherbeschränkten Systemen nützlich sein kann.

Die Verwendung binärer Daten zur Speicherung bringt jedoch Kompromisse mit sich. Im Gegensatz zu Textdateien sind Binärdateien nicht menschenlesbar, was bedeutet, dass sie nicht einfach mit Standard-Texteditoren geöffnet und verstanden oder in Programme wie Excel importiert werden können. Um binäre Daten zu lesen und zu interpretieren, müssen spezialisierte Software oder Skripte (z.B. in Python) entwickelt werden, um das binäre Format korrekt zu parsen.

Für die meisten Anwendungen, bei denen der einfache Zugriff und die Flexibilität wichtig sind (wie z.B. die Analyse von Daten auf einem Computer später), werden textbasierte Formate wie CSV empfohlen. Diese Formate sind einfacher mit einer Vielzahl von Softwaretools zu verwenden und bieten mehr Flexibilität für eine schnelle Datenanalyse.

Wenn Sie sich für die Verwendung der binären Speicherung entscheiden, werfen Sie einen genaueren Blick "unter die Haube", indem Sie überprüfen, wie die CanSat-Bibliothek die Datenspeicherung intern handhabt. Sie können direkt C-Style-Dateiverwaltungsmethoden verwenden, um Dateien, Streams und andere Low-Level-Operationen effizient zu verwalten. Weitere Informationen finden Sie auch in der [Arduino SD-Kartenbibliothek](https://docs.arduino.cc/libraries/sd/).

---

Unsere Programme werden immer komplizierter, und es gibt auch einige Komponenten, die es wert wären, anderswo wiederverwendet zu werden. Um zu vermeiden, dass unser Code schwer zu verwalten wird, wäre es schön, einige Komponenten in verschiedene Dateien zu teilen und den Code lesbar zu halten. Lassen Sie uns sehen, wie dies mit der Arduino IDE erreicht werden kann.

[Klicken Sie hier für die nächste Lektion!](./lesson10)