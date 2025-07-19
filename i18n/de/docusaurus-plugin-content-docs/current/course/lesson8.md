---
sidebar_position: 9
---

# Lektion 8: Mit dem Fluss gehen

Das Thema dieser Lektion ist die Flusskontrolle oder wie wir steuern können, was der Prozessor zu verschiedenen Zeitpunkten tut. Bis jetzt haben sich die meisten unserer Programme auf eine einzige Aufgabe konzentriert, was zwar einfach ist, aber das Potenzial des Systems einschränkt. Indem wir verschiedene **Zustände** in unser Programm einführen, können wir seine Fähigkeiten erweitern.

Zum Beispiel könnte das Programm einen Vorstartzustand haben, in dem der Satellit auf den Start wartet. Dann könnte es in den Flugmodus wechseln, in dem es Sensordaten liest und seine Hauptmission ausführt. Schließlich könnte ein Wiederherstellungsmodus aktiviert werden, in dem der Satellit Signale sendet, um bei der Bergung zu helfen – blinkende Lichter, Pieptöne oder das Ausführen von Systemaktionen, die wir entworfen haben.

Der **Auslöser** für den Wechsel zwischen Zuständen kann variieren. Es könnte eine Sensorablesung sein, wie eine Druckänderung, ein externer Befehl, ein internes Ereignis (wie ein Timer) oder sogar ein zufälliges Ereignis, je nach Anforderung. In dieser Lektion bauen wir auf dem auf, was wir zuvor gelernt haben, indem wir einen externen Befehl als Auslöser verwenden.

## Flusskontrolle mit externen Auslösern

Zuerst modifizieren wir den Code der Bodenstation, um Nachrichten vom Seriellen Monitor empfangen zu können, damit wir bei Bedarf benutzerdefinierte Befehle senden können.

Wie Sie sehen können, sind die einzigen Änderungen in der Hauptschleife. Zuerst prüfen wir, ob Daten vom Serial empfangen wurden. Wenn nicht, wird nichts getan und die Schleife läuft weiter. Wenn jedoch Daten vorhanden sind, werden sie in eine Variable gelesen, zur Klarheit ausgegeben und dann über das Funkgerät an den Satelliten gesendet. Wenn Sie das Programm aus der vorherigen Lektion noch auf den Satelliten hochgeladen haben, können Sie es ausprobieren.

```Cpp title="Bodenstation kann Befehle senden"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Empfangener Befehl: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Serial In - Datenquellen

Wenn wir Daten vom `Serial`-Objekt lesen, greifen wir auf die im UART RX-Puffer gespeicherten Daten zu, die über die USB-Virtuelle-Serielle-Verbindung übertragen werden. In der Praxis bedeutet dies, dass jede Software, die über einen virtuellen seriellen Port kommunizieren kann, wie die Arduino IDE, Terminalprogramme oder verschiedene Programmierumgebungen, verwendet werden kann, um Daten an den CanSat zu senden.

Dies eröffnet viele Möglichkeiten zur Steuerung des CanSat von externen Programmen. Zum Beispiel können wir Befehle manuell eingeben, aber auch Skripte in Python oder anderen Sprachen schreiben, um Befehle zu automatisieren, was es ermöglicht, fortschrittlichere Steuerungssysteme zu erstellen. Durch die Nutzung dieser Werkzeuge können Sie präzise Anweisungen senden, Tests durchführen oder den CanSat in Echtzeit überwachen, ohne manuelle Eingriffe.

:::

Als nächstes schauen wir uns die Satellitenseite an. Da wir mehrere Zustände im Programm haben, wird es etwas länger, aber lassen Sie uns es Schritt für Schritt aufschlüsseln.

Zuerst initialisieren wir die Systeme wie gewohnt. Es gibt auch ein paar globale Variablen, die wir oben in der Datei platzieren, damit es einfach ist zu sehen, welche Namen verwendet werden. Die `LED_IS_ON` ist aus unseren vorherigen Codebeispielen bekannt, und zusätzlich haben wir eine globale Zustandsvariable `STATE`, die den... nun ja, Zustand speichert.

```Cpp title="Initialisierung"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Als nächstes prüfen wir in der Schleife einfach, welche Unterroutine entsprechend dem aktuellen Zustand ausgeführt werden soll, und rufen deren Funktion auf:

```Cpp title="Schleife"
void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // unbekannter Modus
    delay(1000);
  }
}
```

In diesem speziellen Fall wird jeder Zustand durch eine separate Funktion dargestellt, die basierend auf dem Zustand aufgerufen wird. Der Inhalt der Funktionen ist hier nicht wirklich wichtig, aber hier sind sie:

```Cpp title="Unterroutinen"
void preLaunch() {
  Serial.println("Warten...");
  sendData("Warten...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}
```

Es gibt auch eine kleine Hilfsfunktion `blinkLED`, die hilft, Codewiederholungen zu vermeiden, indem sie das Umschalten der LED für uns übernimmt.

Schließlich wird der Zustand geändert, wenn die Bodenstation uns dazu auffordert:

```Cpp title="Befehl empfangen Callback"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```

<details>
  <summary>Gesamter Code</summary>
  <p>Hier ist der gesamte Code zu Ihrer Bequemlichkeit.</p>
```Cpp title="Satellit mit mehreren Zuständen"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // unbekannter Modus
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Warten...");
  sendData("Warten...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Damit können wir nun steuern, was der Satellit tut, ohne physischen Zugang zu ihm zu haben. Stattdessen können wir einfach einen Befehl mit der Bodenstation senden und der Satellit tut, was wir wollen.

:::tip[Übung]

Erstellen Sie ein Programm, das einen Sensor mit einer bestimmten Frequenz misst, die mit einem Fernbefehl auf jeden Wert geändert werden kann. Versuchen Sie, anstelle von Unterroutinen einen Verzögerungswert direkt mit einem Befehl zu ändern.

Versuchen Sie auch, es tolerant gegenüber unerwarteten Eingaben zu machen, wie "-1", "ABCDFEG" oder "".

Als Bonusübung machen Sie die neue Einstellung dauerhaft zwischen den Resets, sodass der Satellit, wenn er aus- und wieder eingeschaltet wird, mit der neuen Frequenz weiter sendet, anstatt zur ursprünglichen zurückzukehren. Als Tipp könnte es hilfreich sein, [Lektion 5](./lesson5.md) erneut zu besuchen.

:::

---

In der nächsten Lektion werden wir unsere Datenspeicherung, Kommunikation und Handhabung erheblich effizienter und schneller machen, indem wir Binärdaten verwenden. Obwohl es zunächst abstrakt erscheinen mag, vereinfacht die Behandlung von Daten als Binärdaten anstelle von Zahlen viele Aufgaben, da es die Muttersprache des Computers ist.

[Klicken Sie hier für die nächste Lektion!](./lesson9)