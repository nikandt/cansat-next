---
sidebar_position: 2
---

# Lektion 1: Hallo Welt!

Diese erste Lektion zeigt Ihnen, wie Sie mit CanSat NeXT beginnen, indem Sie Ihr erstes Programm auf der Platine schreiben und ausführen.

Nach dieser Lektion haben Sie die notwendigen Werkzeuge, um Software für Ihren CanSat zu entwickeln.

## Installation der Werkzeuge

Es wird empfohlen, CanSat NeXT mit der Arduino IDE zu verwenden. Beginnen wir also mit der Installation dieser und der notwendigen Bibliotheken und Boards.

### Arduino IDE installieren

Falls Sie es noch nicht getan haben, laden Sie die Arduino IDE von der offiziellen Website https://www.arduino.cc/en/software herunter und installieren Sie sie.

### ESP32-Unterstützung hinzufügen

CanSat NeXT basiert auf dem ESP32-Mikrocontroller, der in der Standardinstallation der Arduino IDE nicht enthalten ist. Falls Sie ESP32-Mikrocontroller noch nicht mit Arduino verwendet haben, muss die Unterstützung für das Board zuerst installiert werden. Dies kann in der Arduino IDE unter *Werkzeuge->Board->Boardverwalter* (oder einfach (Strg+Umschalt+B) überall drücken) erfolgen. Im Boardverwalter suchen Sie nach ESP32 und installieren Sie esp32 von Espressif.

### CanSat NeXT-Bibliothek installieren

Die CanSat NeXT-Bibliothek kann über den Bibliotheksverwalter der Arduino IDE unter *Sketch > Bibliotheken einbinden > Bibliotheken verwalten* heruntergeladen werden.

![Neue Bibliotheken mit der Arduino IDE hinzufügen.](./../CanSat-software/img/LibraryManager_1.png)

*Bildquelle: Arduino-Dokumentation, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

Geben Sie in der Suchleiste des Bibliotheksverwalters "CanSatNeXT" ein und wählen Sie "Installieren". Wenn die IDE fragt, ob Sie auch die Abhängigkeiten installieren möchten, klicken Sie auf Ja.

## Verbindung zum PC herstellen

Nach der Installation der CanSat NeXT-Softwarebibliothek können Sie den CanSat NeXT an Ihren Computer anschließen. Falls er nicht erkannt wird, müssen Sie möglicherweise zuerst die notwendigen Treiber installieren. Die Treiberinstallation erfolgt in den meisten Fällen automatisch, jedoch muss sie auf einigen PCs manuell durchgeführt werden. Treiber finden Sie auf der Website von Silicon Labs: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Für zusätzliche Hilfe beim Einrichten des ESP32, siehe folgendes Tutorial: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

## Ihr erstes Programm ausführen

Nun, lassen Sie uns die frisch installierten Bibliotheken nutzen, um etwas Code auf dem CanSat NeXT auszuführen. Wie es Tradition ist, beginnen wir damit, die LED blinken zu lassen und "Hallo Welt!" an den Computer zu schreiben.

### Den richtigen Port auswählen

Nachdem Sie den CanSat NeXT an Ihren Computer angeschlossen (und eingeschaltet) haben, müssen Sie den richtigen Port auswählen. Wenn Sie nicht wissen, welcher der richtige ist, ziehen Sie einfach das Gerät ab und sehen Sie, welcher Port verschwindet.

![Das richtige Board auswählen.](./img/selection.png)

Die Arduino IDE fordert Sie nun auf, den Gerätetyp auszuwählen. Wählen Sie ESP32 Dev Module.

![Den richtigen Boardtyp auswählen.](./img/type.png)

### Ein Beispiel auswählen

Die CanSat NeXT-Bibliothek enthält mehrere Beispielcodes, die zeigen, wie man die verschiedenen Funktionen auf dem Board nutzt. Sie finden diese Beispielskizzen unter Datei -> Beispiele -> CanSat NeXT. Wählen Sie "Hello_world".

Nachdem Sie die neue Skizze geöffnet haben, können Sie sie auf das Board hochladen, indem Sie die Upload-Schaltfläche drücken.

![Hochladen.](./img/upload.png)

Nach einer Weile sollte die LED auf dem Board zu blinken beginnen. Zusätzlich sendet das Gerät eine Nachricht an den PC. Sie können dies sehen, indem Sie den seriellen Monitor öffnen und die Baudrate 115200 wählen.

Versuchen Sie auch, die Taste auf dem Board zu drücken. Sie sollte den Prozessor zurücksetzen, oder mit anderen Worten, den Code von Anfang an neu starten.

### Hallo Welt erklärt

Sehen wir uns an, was in diesem Code tatsächlich passiert, indem wir ihn Zeile für Zeile durchgehen. Zuerst beginnt der Code mit dem **Einbinden** der CanSat-Bibliothek. Diese Zeile sollte am Anfang fast aller Programme stehen, die für CanSat NeXT geschrieben wurden, da sie dem Compiler mitteilt, dass wir die Funktionen der CanSat NeXT-Bibliothek nutzen möchten.

```Cpp title="Include CanSat NeXT"
#include "CanSatNeXT.h"
```
Danach springt der Code zur Setup-Funktion. Dort haben wir zwei Aufrufe - zuerst ist Serial die Schnittstelle, die wir verwenden, um Nachrichten über USB an den PC zu senden. Die Zahl innerhalb des Funktionsaufrufs, 115200, bezieht sich auf die Baudrate, d.h. wie viele Einsen und Nullen jede Sekunde gesendet werden. Der nächste Aufruf, `CanSatInit()`, stammt aus der CanSat NeXT-Bibliothek und initialisiert alle On-Board-Sensoren und andere Funktionen. Ähnlich wie der `#include`-Befehl wird dies normalerweise in Skizzen für CanSat NeXT gefunden. Alles, was Sie nur einmal beim Start ausführen möchten, sollte in der Setup-Funktion enthalten sein.

```Cpp title="Setup"
void setup() {
  // Starten Sie die serielle Leitung, um Daten an das Terminal zu senden
  Serial.begin(115200);
  // Starten Sie alle CanSatNeXT On-Board-Systeme.
  CanSatInit();
}
```

Nach dem Setup beginnt der Code, die Loop-Funktion endlos zu wiederholen. Zuerst schreibt das Programm den Ausgangspin LED auf high, d.h. es hat eine Spannung von 3,3 Volt. Dies schaltet die On-Board-LED ein. Nach 100 Millisekunden wird die Spannung an diesem Ausgangspin wieder auf null gesetzt. Nun wartet das Programm 400 ms und sendet dann eine Nachricht an den PC. Nachdem die Nachricht gesendet wurde, beginnt die Loop-Funktion wieder von vorne.

```Cpp title="Loop"
void loop() {
  // Lassen Sie uns die LED blinken
  digitalWrite(LED, HIGH);
  delay(100);
  digitalWrite(LED, LOW);
  delay(400);
  Serial.println("Dies ist eine Nachricht!");
}
```

Sie können auch versuchen, die Verzögerungswerte oder die Nachricht zu ändern, um zu sehen, was passiert. Herzlichen Glückwunsch, dass Sie es so weit geschafft haben! Das Einrichten der Werkzeuge kann knifflig sein, aber ab diesem Punkt sollte es mehr Spaß machen.

---

In der nächsten Lektion werden wir beginnen, Daten von den On-Board-Sensoren zu lesen.

[Klicken Sie hier für die zweite Lektion!](./lesson2)