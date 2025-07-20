---
sidebar_position: 8
---

# Lektion 7: Zurücksprechen

CanSats sind oft so programmiert, dass sie nach ziemlich einfacher Logik arbeiten - zum Beispiel alle n Millisekunden Messungen durchführen, die Daten speichern und übertragen und dies wiederholen. Im Gegensatz dazu könnte das Senden von Befehlen an den Satelliten, um sein Verhalten mitten in der Mission zu ändern, viele neue Möglichkeiten eröffnen. Vielleicht möchten Sie einen Sensor ein- oder ausschalten oder den Satelliten anweisen, ein Geräusch zu machen, damit Sie ihn finden können. Es gibt viele Möglichkeiten, aber vielleicht ist die nützlichste die Fähigkeit, stromhungrige Geräte im Satelliten erst kurz vor dem Raketenstart einzuschalten, was Ihnen viel mehr Flexibilität und Freiheit gibt, nachdem der Satellit bereits in die Rakete integriert wurde.

In dieser Lektion versuchen wir, die LED auf der Satellitenplatine über die Bodenstation ein- und auszuschalten. Dies stellt ein Szenario dar, in dem der Satellit nichts tut, ohne dazu aufgefordert zu werden, und im Wesentlichen ein einfaches Befehlsystem hat.

:::info

## Software-Callbacks

Der Datenempfang in der CanSat-Bibliothek ist als **Callbacks** programmiert, was eine Funktion ist, die... nun ja, zurückgerufen wird, wenn ein bestimmtes Ereignis eintritt. Während in unseren Programmen der Code bisher immer genau den von uns geschriebenen Zeilen gefolgt ist, scheint er nun gelegentlich eine andere Funktion zwischendurch auszuführen, bevor er in der Hauptschleife fortfährt. Das mag verwirrend klingen, wird aber ganz klar, wenn man es in Aktion sieht.

:::

## Fernsteuerung Blinky

Für diese Übung versuchen wir, das LED-Blinken aus der ersten Lektion zu replizieren, aber diesmal wird die LED tatsächlich ferngesteuert.

Schauen wir uns zuerst das Programm auf der Satellitenseite an. Die Initialisierung ist mittlerweile sehr vertraut, aber die Schleife ist etwas überraschend - es ist nichts drin. Das liegt daran, dass die gesamte Logik über die Callback-Funktion von der Bodenstation aus ferngesteuert wird, sodass wir die Schleife einfach leer lassen können.

Die interessanteren Dinge passieren in der Funktion `onDataReceived(String data)`. Dies ist die bereits erwähnte Callback-Funktion, die in der Bibliothek programmiert ist, um jedes Mal aufgerufen zu werden, wenn das Radio Daten empfängt. Der Name der Funktion ist in der Bibliothek programmiert, sodass sie aufgerufen wird, wenn Daten verfügbar sind, solange Sie den exakt gleichen Namen wie hier verwenden.

In diesem Beispiel unten werden die Daten jedes Mal gedruckt, um zu visualisieren, was passiert, aber der LED-Zustand wird auch jedes Mal geändert, wenn eine Nachricht empfangen wird, unabhängig vom Inhalt.

```Cpp title="Satellitencode, der nichts tut, ohne dazu aufgefordert zu werden"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

Die Variable `LED_IS_ON` wird als globale Variable gespeichert, was bedeutet, dass sie von überall im Code aus zugänglich ist. Diese werden in der Programmierung typischerweise verpönt, und Anfängern wird beigebracht, sie in ihren Programmen zu vermeiden. In der _eingebetteten_ Programmierung, wie wir sie hier durchführen, sind sie jedoch tatsächlich eine sehr effiziente und erwartete Methode, dies zu tun. Seien Sie nur vorsichtig, dass Sie nicht denselben Namen an mehreren Stellen verwenden!

:::

Wenn wir dies auf die CanSat NeXT-Platine flashen und starten... passiert nichts. Das ist natürlich zu erwarten, da wir im Moment keine eingehenden Befehle haben.

Auf der Bodenstationsseite ist der Code nicht sehr kompliziert. Wir initialisieren das System und senden dann in der Schleife alle 1000 ms, d.h. einmal pro Sekunde, eine Nachricht. Im aktuellen Programm spielt die tatsächliche Nachricht keine Rolle, sondern nur, dass etwas im selben Netzwerk gesendet wird.

```Cpp title="Bodenstation sendet Nachrichten"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Wenn wir nun diesen Code auf die Bodenstation programmieren (vergessen Sie nicht, die BOOT-Taste zu drücken) und der Satellit noch eingeschaltet ist, beginnt die LED auf dem Satelliten zu blinken und schaltet sich nach jeder Nachricht ein und aus. Die Nachricht wird auch im Terminal angezeigt.

:::tip[Übung]

Flashen Sie den untenstehenden Code-Schnipsel auf die Bodenstationsplatine. Was passiert auf der Satellitenseite? Können Sie das Satellitenprogramm so ändern, dass es nur reagiert, indem es die LED einschaltet, wenn `LED ON` empfangen wird, und ausschaltet, wenn `LED OFF` empfangen wird, und ansonsten nur den Text druckt.

```Cpp title="Bodenstation sendet Nachrichten"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Generiere einen zufälligen Index, um eine Nachricht auszuwählen
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Sende die zufällig ausgewählte Nachricht
  sendData(messages[randomIndex]);
}
```

:::

Beachten Sie auch, dass das Empfangen von Nachrichten das Senden nicht blockiert, sodass wir (und werden) Nachrichten von beiden Enden gleichzeitig senden können. Der Satellit kann kontinuierlich Daten übertragen, während die Bodenstation weiterhin Befehle an den Satelliten senden kann. Wenn die Nachrichten gleichzeitig (innerhalb derselben Millisekunde oder so) sind, kann es zu einem Konflikt kommen und die Nachricht geht nicht durch. CanSat NeXT wird die Nachricht jedoch automatisch erneut senden, wenn es einen Konflikt erkennt. Seien Sie sich also bewusst, dass es passieren kann, aber dass es höchstwahrscheinlich unbemerkt bleibt.

---

In der nächsten Lektion werden wir dies erweitern, um **Flusskontrolle** aus der Ferne durchzuführen oder das Verhalten des Satelliten basierend auf empfangenen Befehlen zu ändern.

[Klicken Sie hier für die nächste Lektion!](./lesson8)