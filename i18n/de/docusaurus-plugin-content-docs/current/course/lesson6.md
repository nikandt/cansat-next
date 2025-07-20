---
sidebar_position: 6
---

# Lektion 6: Nach Hause telefonieren

Nun haben wir Messungen durchgeführt und sie auch auf einer SD-Karte gespeichert. Der nächste logische Schritt ist, sie drahtlos zur Bodenstation zu übertragen, was eine völlig neue Welt in Bezug auf Messungen und Experimente eröffnet, die wir durchführen können. Zum Beispiel wäre der Versuch des Zero-G-Flugs mit dem IMU viel interessanter (und einfacher zu kalibrieren) gewesen, wenn wir die Daten in Echtzeit hätten sehen können. Schauen wir uns an, wie wir das machen können!

In dieser Lektion werden wir Messungen vom CanSat NeXT an den Empfänger der Bodenstation senden. Später werden wir uns auch ansehen, wie man den CanSat mit Nachrichten von der Bodenstation steuert.

## Antennen

Bevor Sie mit dieser Lektion beginnen, stellen Sie bitte sicher, dass Sie eine Art Antenne an das CanSat NeXT-Board und die Bodenstation angeschlossen haben.

:::note

Sie sollten niemals versuchen, etwas ohne Antenne zu senden. Nicht nur wird es wahrscheinlich nicht funktionieren, es besteht auch die Möglichkeit, dass die reflektierte Leistung den Sender beschädigt.

:::

Da wir das 2,4-GHz-Band verwenden, das von Systemen wie Wi-Fi, Bluetooth, ISM, Drohnen usw. geteilt wird, gibt es viele kommerzielle Antennen. Die meisten Wi-Fi-Antennen funktionieren tatsächlich sehr gut mit CanSat NeXT, aber oft benötigen Sie einen Adapter, um sie mit dem CanSat NeXT-Board zu verbinden. Wir haben auch einige Adaptermodelle getestet, die im Webshop erhältlich sind.

Weitere Informationen zu Antennen finden Sie in der Hardware-Dokumentation: [Kommunikation und Antennen](./../CanSat-hardware/communication). Dieser Artikel enthält auch [Anleitungen](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) zum Bau einer eigenen Antenne aus den Materialien im CanSat NeXT-Kit.

## Daten senden

Nachdem wir die Diskussion über Antennen abgeschlossen haben, beginnen wir mit dem Senden einiger Bits. Wir beginnen erneut mit dem Setup, das diesmal einen entscheidenden Unterschied aufweist - wir haben eine Zahl als **Argument** zum `CanSatInit()`-Befehl hinzugefügt.

```Cpp title="Setup für die Übertragung"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Das Übergeben eines Zahlenwerts an `CanSatInit()` teilt dem CanSat NeXT mit, dass wir jetzt das Radio verwenden möchten. Die Zahl gibt den Wert des letzten Bytes der MAC-Adresse an. Sie können es sich als Schlüssel für Ihr spezifisches Netzwerk vorstellen - Sie können nur mit CanSats kommunizieren, die denselben Schlüssel teilen. Diese Zahl sollte zwischen Ihrem CanSat NeXT und Ihrer Bodenstation geteilt werden. Sie können Ihre Lieblingszahl zwischen 0 und 255 wählen. Ich habe 28 gewählt, da es [perfekt](https://en.wikipedia.org/wiki/Perfect_number) ist.

Mit dem initialisierten Radio ist das Übertragen der Daten wirklich einfach. Es funktioniert tatsächlich genauso wie das `appendFile()`, das wir in der letzten Lektion verwendet haben - Sie können jeden Wert hinzufügen und er wird in einem Standardformat übertragen, oder Sie können einen formatierten String verwenden und diesen stattdessen senden.

```Cpp title="Datenübertragung"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Mit diesem einfachen Code übertragen wir jetzt fast 10 Mal pro Sekunde die LDR-Messung. Als nächstes schauen wir uns an, wie man sie empfängt.

:::note

Diejenigen, die mit der Low-Level-Programmierung vertraut sind, fühlen sich möglicherweise wohler, die Daten in binärer Form zu senden. Keine Sorge, wir haben Sie abgedeckt. Die binären Befehle sind in der [Bibliotheksspezifikation](./../CanSat-software/library_specification.md#senddata-binary-variant) aufgeführt.

:::

## Daten empfangen

Dieser Code sollte jetzt auf einen anderen ESP32 programmiert werden. Normalerweise ist es die zweite Controller-Platine, die im Kit enthalten ist, aber so ziemlich jeder andere ESP32 funktioniert ebenfalls - einschließlich eines weiteren CanSat NeXT.

:::note

Wenn Sie ein ESP32-Entwicklungsboard als Bodenstation verwenden, denken Sie daran, die Boot-Taste auf der Platine zu drücken, während Sie aus der IDE flashen. Dadurch wird der ESP32 in den richtigen Boot-Modus für die Neuprogrammierung des Prozessors versetzt. CanSat NeXT macht dies automatisch, aber die Entwicklungsboards meistens nicht.

:::

Der Setup-Code ist genau derselbe wie zuvor. Denken Sie nur daran, den Funk-Schlüssel auf Ihre Lieblingszahl zu ändern.

```Cpp title="Setup für den Empfang"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Danach wird es jedoch etwas anders. Wir erstellen eine komplett leere Schleifenfunktion! Dies liegt daran, dass wir eigentlich nichts in der Schleife zu tun haben, sondern der Empfang über **Callbacks** erfolgt.

```Cpp title="Einrichten eines Callbacks"
void loop() {
  // Wir haben nichts in der Schleife zu tun.
}

// Dies ist eine Callback-Funktion. Sie wird jedes Mal ausgeführt, wenn das Radio Daten empfängt.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Während die Funktion `setup()` nur einmal zu Beginn ausgeführt wird und `loop()` kontinuierlich läuft, wird die Funktion `onDataReceived()` nur ausgeführt, wenn das Radio neue Daten empfangen hat. Auf diese Weise können wir die Daten in der Callback-Funktion verarbeiten. In diesem Beispiel drucken wir sie einfach aus, aber wir könnten sie auch nach Belieben modifizieren.

Beachten Sie, dass die `loop()`-Funktion nicht *leer* sein muss, Sie können sie tatsächlich für alles verwenden, was Sie möchten, mit einer Einschränkung - Verzögerungen sollten vermieden werden, da die `onDataReceived()`-Funktion auch nicht ausgeführt wird, bis die Verzögerung vorbei ist.

Wenn Sie jetzt beide Programme gleichzeitig auf verschiedenen Boards laufen haben, sollten ziemlich viele Messungen drahtlos an Ihren PC gesendet werden.

:::note

Für binär orientierte Leute - Sie können die Callback-Funktion onBinaryDataReceived verwenden.

:::

## Echtzeit Zero-G

Nur zum Spaß, lassen Sie uns das Zero-G-Experiment mit Radios wiederholen. Der Empfängercode kann gleich bleiben, ebenso wie das Setup im CanSat-Code.

Zur Erinnerung, wir haben ein Programm in der IMU-Lektion erstellt, das freien Fall erkennt und in diesem Szenario eine LED einschaltet. Hier ist der alte Code:

```Cpp title="Freifall-erkennende Schleifenfunktion"
unsigned long LEDOnTill = 0;

void loop() {
  // Beschleunigung lesen
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Gesamte Beschleunigung (quadriert) berechnen
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Timer aktualisieren, wenn wir einen Fall erkennen
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Die LED basierend auf dem Timer steuern
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Es ist verlockend, einfach die `sendData()` direkt zum alten Beispiel hinzuzufügen, jedoch müssen wir das Timing berücksichtigen. Wir möchten normalerweise keine Nachrichten mehr als ~20 Mal pro Sekunde senden, aber andererseits möchten wir, dass die Schleife kontinuierlich läuft, damit die LED immer noch eingeschaltet wird.

Wir müssen einen weiteren Timer hinzufügen - diesmal, um alle 50 Millisekunden Daten zu senden. Der Timer wird durch den Vergleich der aktuellen Zeit mit der letzten Zeit, zu der Daten gesendet wurden, erstellt. Die letzte Zeit wird dann jedes Mal aktualisiert, wenn Daten gesendet werden. Schauen Sie sich auch an, wie der String hier erstellt wird. Er könnte auch in Teilen übertragen werden, aber auf diese Weise wird er als einzelne Nachricht empfangen, anstatt als mehrere Nachrichten.

```Cpp title="Freifall-Erkennung + Datenübertragung"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Beschleunigung lesen
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Gesamte Beschleunigung (quadriert) berechnen
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Timer aktualisieren, wenn wir einen Fall erkennen
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Die LED basierend auf dem Timer steuern
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Die letzte Sendezeit auf die aktuelle Zeit aktualisieren
    lastSendTime = millis();
  }

}
```

Das Datenformat hier ist tatsächlich wieder mit dem seriellen Plotter kompatibel - wenn man sich diese Daten ansieht, wird ziemlich klar, warum wir den freien Fall früher so sauber erkennen konnten - die Werte fallen wirklich auf null, sobald das Gerät fallen gelassen oder geworfen wird.

---

Im nächsten Abschnitt werden wir eine kurze Pause einlegen, um zu überprüfen, was wir bisher gelernt haben, und sicherzustellen, dass wir bereit sind, auf diesen Konzepten weiter aufzubauen.

[Klicken Sie hier für die erste Überprüfung!](./review1)