---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lektion 10: Teile und Herrsche

Wenn unsere Projekte detaillierter werden, kann der Code schwer zu verwalten sein, es sei denn, wir sind vorsichtig. In dieser Lektion werden wir einige Praktiken betrachten, die helfen, größere Projekte überschaubar zu halten. Dazu gehört das Aufteilen des Codes in mehrere Dateien, das Verwalten von Abhängigkeiten und schließlich die Einführung der Versionskontrolle, um Änderungen zu verfolgen, Code zu sichern und die Zusammenarbeit zu erleichtern.

## Code in mehrere Dateien aufteilen

In kleinen Projekten mag es in Ordnung erscheinen, den gesamten Quellcode in einer Datei zu haben, aber wenn das Projekt wächst, kann es unübersichtlich und schwer zu verwalten werden. Eine gute Praxis ist es, den Code basierend auf der Funktionalität in verschiedene Dateien aufzuteilen. Wenn dies gut gemacht wird, entstehen auch schöne kleine Module, die Sie in verschiedenen Projekten wiederverwenden können, ohne unnötige Komponenten in andere Projekte einzuführen. Ein großer Vorteil von mehreren Dateien ist auch, dass die Zusammenarbeit erleichtert wird, da andere Personen an anderen Dateien arbeiten können, was hilft, Situationen zu vermeiden, in denen der Code schwer zu mergen ist.

Der folgende Text geht davon aus, dass Sie die Arduino IDE 2 verwenden. Fortgeschrittene Benutzer fühlen sich möglicherweise mit Systemen wie [Platformio](https://platformio.org/) wohler, aber diese Konzepte sind Ihnen bereits vertraut.

In der Arduino IDE 2 werden alle Dateien im Projektordner als Tabs in der IDE angezeigt. Neue Dateien können direkt in der IDE oder über Ihr Betriebssystem erstellt werden. Es gibt drei verschiedene Dateitypen, **Header** `.h`, **Quelldateien** `.cpp` und **Arduino-Dateien** `.ino`.

Von diesen dreien sind Arduino-Dateien am einfachsten zu verstehen. Sie sind einfach zusätzliche Dateien, die beim Kompilieren am Ende Ihres Hauptskripts `.ino` kopiert werden. Auf diese Weise können Sie leicht verständlichere Code-Strukturen erstellen und den gesamten Platz nutzen, den Sie für eine komplizierte Funktion benötigen, ohne die Quelldatei schwer lesbar zu machen. Der beste Ansatz ist normalerweise, eine Funktionalität zu nehmen und diese in einer Datei zu implementieren. So könnten Sie beispielsweise eine separate Datei für jeden Betriebsmodus haben, eine Datei für Datenübertragungen, eine Datei für die Befehlsinterpretation, eine Datei für die Datenspeicherung und eine Hauptdatei, in der Sie alles zu einem funktionalen Skript kombinieren.

Header- und Quelldateien sind etwas spezialisierter, aber glücklicherweise funktionieren sie genauso wie in C++ anderswo, sodass es viel Material darüber gibt, wie man sie verwendet, zum Beispiel [hier](https://www.learncpp.com/cpp-tutorial/header-files/).

## Beispielstruktur

Als Beispiel nehmen wir den unordentlichen Code aus [Lektion 8](./lesson8.md) und überarbeiten ihn.

<details>
  <summary>Original unordentlicher Code aus Lektion 8</summary>
  <p>Hier ist der gesamte Code für Ihren Frust.</p>
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

Das ist nicht einmal so schlimm, aber Sie können sehen, wie es ernsthaft schwer lesbar werden könnte, wenn wir die Funktionalitäten erweitern oder neue Befehle zur Interpretation hinzufügen. Stattdessen teilen wir dies in ordentliche separate Code-Dateien basierend auf den separaten Funktionalitäten auf.

Ich habe jeden der Betriebsmodi in eine eigene Datei getrennt, eine Datei für die Befehlsinterpretation hinzugefügt und schließlich eine kleine Dienstprogrammdatei erstellt, um Funktionalitäten zu halten, die an vielen Stellen benötigt werden. Dies ist eine ziemlich typische einfache Projektstruktur, macht das Programm als Ganzes jedoch bereits viel verständlicher. Dies kann durch gute Dokumentation und das Erstellen eines Diagramms, das zeigt, wie die Dateien miteinander verknüpft sind, weiter unterstützt werden.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Hauptskizze"
#include "CanSatNeXT.h"

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
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Vorstartmodus"
void preLaunch() {
  Serial.println("Warten...");
  sendData("Warten...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Flugmodus"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Bergungsmodus"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Befehlsinterpretation"
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
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Dienstprogramme"
bool LED_IS_ON = false;

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
```
  </TabItem>

</Tabs>

Während dieser Ansatz bereits viel besser ist, als alles in einer einzigen Datei zu haben, erfordert er dennoch sorgfältiges Management. Zum Beispiel wird der **Namensraum** zwischen den verschiedenen Dateien geteilt, was in einem größeren Projekt oder beim Wiederverwenden von Code Verwirrung stiften kann. Wenn es Funktionen oder Variablen mit denselben Namen gibt, weiß der Code nicht, welche er verwenden soll, was zu Konflikten oder unerwartetem Verhalten führt.

Darüber hinaus eignet sich dieser Ansatz nicht gut für **Kapselung**—was entscheidend für den Aufbau modularerer und wiederverwendbarer Codes ist. Wenn Ihre Funktionen und Variablen alle im selben globalen Raum existieren, wird es schwieriger, zu verhindern, dass ein Teil des Codes unbeabsichtigt einen anderen beeinflusst. Hier kommen fortgeschrittenere Techniken wie Namensräume, Klassen und objektorientierte Programmierung (OOP) ins Spiel. Diese fallen außerhalb des Umfangs dieses Kurses, aber individuelle Recherche zu diesen Themen wird empfohlen.


:::tip[Übung]

Nehmen Sie eines Ihrer vorherigen Projekte und verpassen Sie ihm ein Makeover! Teilen Sie Ihren Code in mehrere Dateien auf und organisieren Sie Ihre Funktionen basierend auf ihren Rollen (z. B. Sensorverwaltung, Datenverarbeitung, Kommunikation). Sehen Sie, wie viel sauberer und einfacher zu verwalten Ihr Projekt wird!

:::


## Versionskontrolle

Wenn Projekte wachsen — und insbesondere wenn mehrere Personen daran arbeiten — ist es leicht, den Überblick über Änderungen zu verlieren oder versehentlich Code zu überschreiben (oder neu zu schreiben). Hier kommt die **Versionskontrolle** ins Spiel. **Git** ist das Industriestandard-Tool zur Versionskontrolle, das hilft, Änderungen zu verfolgen, Versionen zu verwalten und große Projekte mit mehreren Mitarbeitern zu organisieren.

Git zu lernen mag entmutigend erscheinen und sogar überflüssig für kleine Projekte, aber ich verspreche Ihnen, dass Sie sich selbst dafür danken werden, es zu lernen. Später werden Sie sich fragen, wie Sie jemals ohne es ausgekommen sind!

Hier ist ein großartiger Ausgangspunkt: [Erste Schritte mit Git](https://docs.github.com/en/get-started/getting-started-with-git).

Es gibt mehrere Git-Dienste, darunter beliebte wie:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub ist eine solide Wahl aufgrund seiner Beliebtheit und der Fülle an verfügbarer Unterstützung. Tatsächlich werden diese Webseite und die [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) Bibliotheken auf GitHub gehostet.

Git ist nicht nur praktisch — es ist eine wesentliche Fähigkeit für jeden, der professionell in Ingenieurwesen oder Wissenschaft arbeitet. Die meisten Teams, denen Sie angehören werden, verwenden Git, daher ist es eine gute Idee, es sich zur Gewohnheit zu machen.

Weitere Tutorials zu Git:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)



:::tip[Übung]

Richten Sie ein Git-Repository für Ihr CanSat-Projekt ein und pushen Sie Ihren Code in das neue Repository. Dies wird Ihnen helfen, Software sowohl für den Satelliten als auch für die Bodenstation auf eine organisierte, kollaborative Weise zu entwickeln.

:::

---

In der nächsten Lektion werden wir über verschiedene Möglichkeiten sprechen, den CanSat mit externen Sensoren und anderen Geräten zu erweitern.

[Klicken Sie hier für die nächste Lektion!](./lesson11)