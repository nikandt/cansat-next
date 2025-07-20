---
sidebar_position: 3
---

# Lektion 3: Erfassung der Drehung

CanSat NeXT hat zwei Sensor-ICs auf der CanSat NeXT-Platine. Einer davon ist der Barometer, den wir in der letzten Lektion verwendet haben, und der andere ist die _Inertiale Messeinheit_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). Der LSM6DS3 ist ein 6-Achsen-IMU, was bedeutet, dass er 6 verschiedene Messungen durchführen kann. In diesem Fall handelt es sich um die lineare Beschleunigung auf drei Achsen (x, y, z) und die Winkelgeschwindigkeit auf drei Achsen.

In dieser Lektion werden wir uns das IMU-Beispiel in der Bibliothek ansehen und das IMU für ein kleines Experiment verwenden.

## Bibliotheksbeispiel

Beginnen wir damit, uns anzusehen, wie das Bibliotheksbeispiel funktioniert. Laden Sie es aus Datei -> Beispiele -> CanSat NeXT -> IMU.

Das anfängliche Setup ist wieder dasselbe - die Bibliothek einbinden, die serielle Schnittstelle und CanSat initialisieren. Konzentrieren wir uns also auf die Schleife. Die Schleife sieht jedoch auch sehr vertraut aus! Wir lesen die Werte genauso wie in der letzten Lektion, nur dass es diesmal viel mehr davon gibt.

```Cpp title="IMU-Werte lesen"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Jede Achse wird tatsächlich einige hundert Mikrosekunden auseinander gelesen. Wenn Sie möchten, dass sie gleichzeitig aktualisiert werden, schauen Sie sich die Funktionen [readAcceleration](./../CanSat-software/library_specification#readacceleration) und [readGyro](./../CanSat-software/library_specification#readgyro) an.

:::

Nachdem die Werte gelesen wurden, können wir sie wie gewohnt ausdrucken. Dies könnte mit Serial.print und println genauso wie in der letzten Lektion geschehen, aber dieses Beispiel zeigt eine alternative Möglichkeit, die Daten zu drucken, mit viel weniger manuellem Schreiben.

Zuerst wird ein Puffer von 128 Zeichen erstellt. Dann wird dieser zuerst so initialisiert, dass jeder Wert 0 ist, unter Verwendung von memset. Danach werden die Werte mit `snprintf()` in den Puffer geschrieben, einer Funktion, die zum Schreiben von Zeichenfolgen mit einem bestimmten Format verwendet werden kann. Schließlich wird dies einfach mit `Serial.println()` gedruckt.

```Cpp title="Elegantes Drucken"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Wenn das oben Verwirrung stiftet, können Sie einfach den vertrauteren Stil mit print und println verwenden. Dies wird jedoch etwas lästig, wenn viele Werte gedruckt werden müssen.

```Cpp title="Reguläres Drucken"
Serial.print("Ax:");
Serial.println(ay);
// usw.
```

Schließlich gibt es wieder eine kurze Verzögerung, bevor die Schleife erneut gestartet wird. Dies dient hauptsächlich dazu, sicherzustellen, dass die Ausgabe lesbar ist - ohne Verzögerung würden sich die Zahlen so schnell ändern, dass es schwer ist, sie zu lesen.

Die Beschleunigung wird in Gs gelesen, oder Vielfachen von $9.81 \text{ m}/\text{s}^2$. Die Winkelgeschwindigkeit ist in Einheiten von $\text{mrad}/\text{s}$.

:::tip[Übung]

Versuchen Sie, die Achse anhand der Messwerte zu identifizieren!

:::

## Freier Fall Erkennung

Als Übung versuchen wir zu erkennen, ob sich das Gerät im freien Fall befindet. Die Idee ist, dass wir die Platine in die Luft werfen, CanSat NeXT den freien Fall erkennt und die LED für ein paar Sekunden einschaltet, nachdem ein freier Fall erkannt wurde, damit wir sehen können, dass unsere Überprüfung ausgelöst wurde, selbst nachdem wir sie wieder gefangen haben.

Wir können das Setup so belassen, wie es war, und uns nur auf die Schleife konzentrieren. Lassen Sie uns die alte Schleifenfunktion löschen und neu beginnen. Nur zum Spaß lesen wir die Daten mit der alternativen Methode.

```Cpp title="Beschleunigung lesen"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Lassen Sie uns den freien Fall als ein Ereignis definieren, wenn die Gesamtbeschleunigung unter einem Schwellenwert liegt. Wir können die Gesamtbeschleunigung aus den einzelnen Achsen berechnen als

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Was im Code ungefähr so aussehen würde.

```Cpp title="Gesamtbeschleunigung berechnen"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Und während dies funktionieren würde, sollten wir beachten, dass die Berechnung der Quadratwurzel rechnerisch sehr langsam ist, daher sollten wir sie vermeiden, wenn möglich. Schließlich könnten wir einfach berechnen

$$a^2 = a_x^2+a_y^2+a_z^2$$

und dies mit einem vordefinierten Schwellenwert vergleichen.

```Cpp title="Gesamtbeschleunigung im Quadrat berechnen"
float totalSquared = ax*ax+ay*ay+az*az;
```

Jetzt, da wir einen Wert haben, beginnen wir mit der Steuerung der LED. Wir könnten die LED immer dann einschalten, wenn die Gesamtbeschleunigung unter einem Schwellenwert liegt, jedoch wäre es einfacher zu lesen, wenn die LED nach der Erkennung eine Weile eingeschaltet bleibt. Eine Möglichkeit, dies zu tun, besteht darin, eine weitere Variable zu erstellen, nennen wir sie LEDOnTill, in die wir einfach die Zeit schreiben, bis zu der wir die LED eingeschaltet lassen möchten.

```Cpp title="Timer-Variable"
unsigned long LEDOnTill = 0;
```

Jetzt können wir den Timer aktualisieren, wenn wir ein freier Fall-Ereignis erkennen. Lassen Sie uns vorerst einen Schwellenwert von 0.1 verwenden. Arduino bietet eine Funktion namens `millis()`, die die Zeit seit dem Programmstart in Millisekunden zurückgibt.

```Cpp title="Den Timer aktualisieren"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Schließlich können wir einfach überprüfen, ob die aktuelle Zeit mehr oder weniger als die angegebene `LEDOnTill` ist, und die LED entsprechend steuern. So sieht die neue Schleifenfunktion aus:

```Cpp title="Freier Fall erkennung Schleifenfunktion"
unsigned long LEDOnTill = 0;

void loop() {
  // Beschleunigung lesen
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Gesamtbeschleunigung (im Quadrat) berechnen
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Den Timer aktualisieren, wenn wir einen Fall erkennen
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

Wenn Sie dieses Programm ausprobieren, können Sie sehen, wie schnell es jetzt reagiert, da wir keine Verzögerung in der Schleife haben. Die LED leuchtet sofort auf, nachdem sie die Hand verlässt, wenn sie geworfen wird.

:::tip[Übungen]

1. Versuchen Sie, die Verzögerung in der Schleifenfunktion wieder einzuführen. Was passiert?
2. Derzeit haben wir keine Ausgabe in der Schleife. Wenn Sie einfach eine Druckanweisung zur Schleife hinzufügen, wird die Ausgabe sehr schwer lesbar und das Drucken verlangsamt die Schleifenzykluszeit erheblich. Können Sie sich eine Möglichkeit überlegen, nur einmal pro Sekunde zu drucken, auch wenn die Schleife kontinuierlich läuft? Tipp: Schauen Sie sich an, wie der LED-Timer implementiert wurde.
3. Erstellen Sie Ihr eigenes Experiment, indem Sie entweder die Beschleunigung oder die Drehung verwenden, um eine Art Ereignis zu erkennen.

:::

---

In der nächsten Lektion verlassen wir den digitalen Bereich und versuchen, einen anderen Sensortyp zu verwenden - ein analoges Lichtmessgerät.

[Klicken Sie hier für die nächste Lektion!](./lesson4)