---
sidebar_position: 5
---

# Lektion 5: Bits & Bytes speichern

Manchmal ist es nicht möglich, die Daten direkt auf einen PC zu übertragen, zum Beispiel wenn wir das Gerät herumwerfen, es mit einer Rakete starten oder Messungen an schwer zugänglichen Orten durchführen. In solchen Fällen ist es am besten, die gemessenen Daten auf einer SD-Karte zu speichern, um sie später weiterzuverarbeiten. Zusätzlich kann die SD-Karte auch verwendet werden, um Einstellungen zu speichern - zum Beispiel könnten wir eine Art Schwellenwert oder Adresseinstellungen auf der SD-Karte speichern.

## SD-Karte in der CanSat NeXT-Bibliothek

Die CanSat NeXT-Bibliothek unterstützt eine Vielzahl von SD-Karten-Operationen. Sie kann verwendet werden, um Dateien zu speichern und zu lesen, aber auch um Verzeichnisse und neue Dateien zu erstellen, sie zu verschieben oder sogar zu löschen. All dies könnte in verschiedenen Situationen nützlich sein, aber konzentrieren wir uns hier auf die beiden grundlegenden Dinge - das Lesen einer Datei und das Schreiben von Daten in eine Datei.

:::note

Wenn Sie die volle Kontrolle über das Dateisystem haben möchten, finden Sie die Befehle in der [Library Specification](./../CanSat-software/library_specification.md#sdcardpresent) oder im Bibliotheksbeispiel "SD_advanced".

:::

Als Übung lassen Sie uns den Code aus der letzten Lektion so ändern, dass wir anstelle der LDR-Messungen, die an die serielle Schnittstelle geschrieben werden, diese auf der SD-Karte speichern.

Zuerst definieren wir den Namen der Datei, die wir verwenden werden. Fügen wir sie vor der Setup-Funktion als **globale Variable** hinzu.

```Cpp title="Geändertes Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Jetzt, da wir einen Dateipfad haben, können wir auf die SD-Karte schreiben. Wir benötigen nur zwei Zeilen, um dies zu tun. Der beste Befehl zum Speichern von Messdaten ist `appendFile()`, der einfach den Dateipfad nimmt und die neuen Daten am Ende der Datei schreibt. Wenn die Datei nicht existiert, wird sie erstellt. Dies macht die Verwendung des Befehls sehr einfach (und sicher). Wir können die Daten einfach direkt hinzufügen und dann mit einem Zeilenumbruch folgen, damit die Daten leichter zu lesen sind. Und das war's! Jetzt speichern wir die Messungen.

```Cpp title="LDR-Daten auf der SD-Karte speichern"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR-Wert:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Standardmäßig speichert der Befehl `appendFile()` Gleitkommazahlen mit zwei Nachkommastellen. Für spezifischere Funktionen könnten Sie zuerst einen String im Sketch erstellen und den Befehl `appendFile()` verwenden, um diesen String auf der SD-Karte zu speichern. Zum Beispiel:

```Cpp title="LDR-Daten auf der SD-Karte speichern"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Hier wird der endgültige String zuerst erstellt, wobei `String(LDR_voltage, 6)` angibt, dass wir 6 Dezimalstellen nach dem Punkt wünschen. Wir können denselben String zum Drucken und Speichern der Daten verwenden. (Sowie zur Übertragung über Funk)

## Daten lesen

Es ist oft nützlich, etwas auf der SD-Karte zu speichern, um es später im Programm zu verwenden. Dies könnten zum Beispiel Einstellungen über den aktuellen Zustand des Geräts sein, sodass wir, wenn das Programm zurückgesetzt wird, den aktuellen Status wieder von der SD-Karte laden können, anstatt mit den Standardwerten zu beginnen.

Um dies zu demonstrieren, fügen Sie auf dem PC eine neue Datei zur SD-Karte hinzu, die "delay_time" heißt, und schreiben Sie eine Zahl in die Datei, wie 200. Versuchen wir, die statisch eingestellte Verzögerungszeit in unserem Programm durch eine Einstellung zu ersetzen, die aus einer Datei gelesen wird.

Versuchen wir, die Einstellungsdatei im Setup zu lesen. Zuerst führen wir eine neue globale Variable ein. Ich habe ihr einen Standardwert von 1000 gegeben, sodass, wenn wir es nicht schaffen, die Verzögerungszeit zu ändern, dies jetzt die Standardeinstellung ist.

Im Setup sollten wir zuerst überprüfen, ob die Datei überhaupt existiert. Dies kann mit dem Befehl `fileExists()` erfolgen. Wenn nicht, verwenden wir einfach den Standardwert. Danach können die Daten mit `readFile()` gelesen werden. Wir sollten jedoch beachten, dass es sich um einen String handelt - nicht um einen Integer, wie wir ihn benötigen. Also konvertieren wir ihn mit dem Arduino-Befehl `toInt()`. Schließlich überprüfen wir, ob die Konvertierung erfolgreich war. Wenn nicht, wird der Wert null sein, in diesem Fall verwenden wir einfach weiterhin den Standardwert.

```Cpp title="Eine Einstellung im Setup lesen"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Vergessen Sie schließlich nicht, die Verzögerung in der Schleife zu ändern, um die neue Variable zu verwenden.

```Cpp title="Dynamisch eingestellter Verzögerungswert"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Sie können jetzt versuchen, den Wert auf der SD-Karte zu ändern oder sogar die SD-Karte zu entfernen, in diesem Fall sollte jetzt der Standardwert für die Verzögerungslänge verwendet werden.

:::note

Um die Einstellung in Ihrem Programm neu zu schreiben, können Sie den Befehl [writeFile](./../CanSat-software/library_specification.md#writefile) verwenden. Er funktioniert genauso wie [appendFile](./../CanSat-software/library_specification.md#appendfile), überschreibt jedoch alle vorhandenen Daten.

:::

:::tip[Übung]

Fahren Sie mit Ihrer Lösung der Übung in Lektion 4 fort, sodass der Zustand beibehalten wird, auch wenn das Gerät zurückgesetzt wird. D.h. speichern Sie den aktuellen Zustand auf der SD-Karte und lesen Sie ihn im Setup. Dies würde ein Szenario simulieren, in dem Ihr CanSat plötzlich im Flug oder vor dem Flug zurückgesetzt wird, und mit diesem Programm hätten Sie dennoch einen erfolgreichen Flug.

:::

---

In der nächsten Lektion werden wir uns mit der Verwendung von Funk zur Datenübertragung zwischen Prozessoren befassen. Sie sollten eine Art Antenne in Ihrem CanSat NeXT und der Bodenstation haben, bevor Sie mit diesen Übungen beginnen. Wenn Sie es noch nicht getan haben, werfen Sie einen Blick auf das Tutorial zum Bau einer einfachen Antenne: [Bau einer Antenne](./../CanSat-hardware/communication#quarter-wave-antenna).

[Hier klicken für die nächste Lektion!](./lesson6)