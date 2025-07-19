---
sidebar_position: 2
---

# Lektion 2: Den Druck spüren

In dieser zweiten Lektion werden wir beginnen, die Sensoren auf der CanSat NeXT-Platine zu verwenden. Diesmal konzentrieren wir uns darauf, den umgebenden atmosphärischen Druck zu messen. Wir werden das an Bord befindliche Barometer [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) verwenden, um den Druck sowie die Temperatur des Barometers selbst zu messen.

Beginnen wir mit dem Barometer-Code in den Bibliotheksbeispielen. Wählen Sie in der Arduino IDE Datei -> Beispiele -> CanSat NeXT -> Baro.

Der Anfang des Programms sieht ziemlich vertraut aus der letzten Lektion aus. Wieder beginnen wir mit dem Einbinden der CanSat NeXT-Bibliothek und dem Einrichten der seriellen Verbindung sowie der Initialisierung der CanSat NeXT-Systeme.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Serielle Verbindung initialisieren
  Serial.begin(115200);

  // Die CanSatNeXT-Systeme an Bord initialisieren
  CanSatInit();
}
```

Der Funktionsaufruf `CanSatInit()` initialisiert alle Sensoren für uns, einschließlich des Barometers. So können wir es in der Schleifenfunktion verwenden.

Die folgenden zwei Zeilen sind dort, wo die Temperatur und der Druck tatsächlich gelesen werden. Wenn die Funktionen `readTemperature()` und `readPressure()` aufgerufen werden, sendet der Prozessor einen Befehl an das Barometer, das den Druck oder die Temperatur misst und das Ergebnis an den Prozessor zurückgibt.

```Cpp title="Lesen in Variablen"
float t = readTemperature();
float p = readPressure(); 
```

Im Beispiel werden die Werte gedruckt, gefolgt von einer Verzögerung von 1000 ms, sodass die Schleife ungefähr einmal pro Sekunde wiederholt wird.

```Cpp title="Drucken der Variablen"
Serial.print("Druck: ");
Serial.print(p);
Serial.print("hPa\tTemperatur: ");
Serial.print(t);
Serial.println("*C\n");

delay(1000);
```

### Verwendung der Daten

Wir können die Daten auch im Code verwenden, anstatt sie nur zu drucken oder zu speichern. Zum Beispiel könnten wir einen Code erstellen, der erkennt, ob der Druck um einen bestimmten Betrag abfällt, und zum Beispiel die LED einschaltet. Oder alles andere, was Sie tun möchten. Versuchen wir, die an Bord befindliche LED einzuschalten.

Um dies zu implementieren, müssen wir den Code im Beispiel leicht modifizieren. Zuerst beginnen wir, den vorherigen Druckwert zu verfolgen. Um **globale Variablen** zu erstellen, d.h. solche, die nicht nur existieren, während wir eine bestimmte Funktion ausführen, können Sie sie einfach außerhalb einer bestimmten Funktion schreiben. Die Variable previousPressure wird bei jedem Zyklus der Schleifenfunktion aktualisiert, direkt am Ende. Auf diese Weise behalten wir den alten Wert im Auge und können ihn mit dem neueren Wert vergleichen.

Wir können eine if-Anweisung verwenden, um die alten und neuen Werte zu vergleichen. Im folgenden Code ist die Idee, dass, wenn der vorherige Druck 0,1 hPa niedriger als der neue Wert ist, wir die LED einschalten, und ansonsten bleibt die LED aus.

```Cpp title="Reagieren auf Druckabfälle"
float previousPressure = 1000;

void loop() {

  // Temperatur in eine Float-Variable lesen
  float t = readTemperature();

  // Druck in eine Float-Variable lesen
  float p = readPressure(); 

  // Druck und Temperatur drucken
  Serial.print("Druck: ");
  Serial.print(p);
  Serial.print("hPa\tTemperatur: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Eine Sekunde warten, bevor die Schleife erneut startet
  delay(1000);

  previousPressure = p;
}
```

Wenn Sie diese modifizierte Schleife auf den CanSat NeXT flashen, sollte sie sowohl die Variablenwerte wie zuvor drucken, aber jetzt auch nach dem Druckabfall suchen. Der atmosphärische Druck fällt ungefähr um 0,12 hPa / Meter beim Aufsteigen, also wenn Sie versuchen, den CanSat NeXT schnell einen Meter höher zu heben, sollte die LED für einen Schleifenzyklus (1 Sekunde) eingeschaltet werden und dann wieder ausgehen. Es ist wahrscheinlich am besten, das USB-Kabel zu trennen, bevor Sie dies versuchen!

Sie können auch versuchen, den Code zu modifizieren. Was passiert, wenn die Verzögerung geändert wird? Was ist, wenn die **Hysterese** von 0,1 hPa geändert oder sogar vollständig entfernt wird?

---

In der nächsten Lektion werden wir noch mehr körperliche Aktivität bekommen, da wir versuchen, den anderen integrierten Sensor-IC - die Inertialmesseinheit - zu verwenden.

[Klicken Sie hier für die nächste Lektion!](./lesson3)