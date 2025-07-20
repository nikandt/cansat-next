---
sidebar_position: 13
---

# Lektion 12: Bereit zum Abheben?

In dieser letzten Lektion sprechen wir darüber, wie man den Satelliten, die Bodenstation und das Team für den Start vorbereitet. Nach dieser Lektion werden wir auch eine *Überprüfung* durchführen, um die Flugbereitschaft zu überprüfen, aber diese Lektion konzentriert sich darauf, die Chancen auf eine erfolgreiche Mission zu maximieren. In dieser Lektion sprechen wir darüber, wie Sie Ihre Elektronik mechanisch und elektrisch vorbereiten, das Funkkommunikationssystem überprüfen und schließlich einige nützliche Vorbereitungsschritte besprechen, die lange vor dem eigentlichen Startereignis durchgeführt werden sollten.

Diese Lektion ist wieder etwas anders, da wir anstelle neuer Programmierkonzepte darüber sprechen, wie die Zuverlässigkeit des Geräts in der Mission verbessert werden kann. Außerdem, obwohl Sie wahrscheinlich noch nicht mit dem Bau (oder der Definition) der Satellitenmission fertig sind, wenn Sie jetzt zum ersten Mal den Kurs durchgehen, ist es gut, die Materialien auf dieser Seite durchzulesen, diese Aspekte bei der Planung Ihres Geräts und Ihrer Mission zu berücksichtigen und darauf zurückzukommen, wenn Sie sich tatsächlich auf den Start vorbereiten.

## Mechanische Überlegungen

Erstens sollte, wie in der vorherigen Lektion besprochen, der Elektronik-**Stapel** so gebaut werden, dass er auch bei starken Vibrationen und Stößen zusammenhält. Eine gute Möglichkeit, die Elektronik zu entwerfen, besteht darin, Lochrasterplatinen zu verwenden, die durch [Abstandshalter](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) zusammengehalten und elektrisch entweder durch einen Stecker oder mit einem gut unterstützten Kabel verbunden werden. Schließlich sollte der gesamte Elektronikstapel so am Satellitenrahmen befestigt werden, dass er sich nicht bewegt. Eine starre Verbindung mit Schrauben ist immer eine solide Wahl (Wortspiel beabsichtigt), aber das ist nicht die einzige Option. Eine Alternative könnte sein, das System so zu gestalten, dass es beim Aufprall bricht, ähnlich einer [Knautschzone](https://de.wikipedia.org/wiki/Knautschzone). Alternativ könnte ein gepolstertes Montagesystem mit Gummi, Schaumstoff oder einem ähnlichen System die Belastungen, die die Elektronik erfährt, reduzieren und so zur Schaffung von Mehrfachnutzungssystemen beitragen.

In einem typischen CanSat gibt es einige Elemente, die bei Start oder schnelleren als erwarteten Landungen besonders anfällig für Probleme sind. Dazu gehören die Batterien, die SD-Karte und die Antenne.

### Sicherung der Batterien

Beim CanSat NeXT ist die Platine so gestaltet, dass ein Kabelbinder um die Platine angebracht werden kann, um sicherzustellen, dass die Batterien bei Vibrationen an Ort und Stelle gehalten werden. Andernfalls neigen sie dazu, aus den Fassungen zu springen. Ein weiteres Problem bei Batterien ist, dass einige Batterien kürzer sind, als es für den Batteriehalter ideal wäre, und es ist möglich, dass bei einem besonders starken Stoß die Batteriekontakte unter dem Gewicht der Batterien so stark verbiegen, dass ein Kontakt verloren geht. Um dies zu mildern, können die Kontakte unterstützt werden, indem ein Stück Kabelbinder, Schaumstoff oder ein anderes Füllmaterial hinter die Federkontakte gelegt wird. In versehentlichen (und absichtlichen) Falltests hat dies die Zuverlässigkeit verbessert, obwohl CanSat NeXTs, die in gut gebaute CanSats integriert sind, Stürze aus bis zu 1000 Metern (ohne Fallschirm) auch ohne diese Schutzmaßnahmen überlebt haben. Eine noch bessere Möglichkeit, die Batterien zu unterstützen, besteht darin, eine Stützstruktur direkt in den CanSat-Rahmen zu integrieren, sodass sie das Gewicht der Batterien beim Aufprall trägt, anstatt der Batteriehalter.

![CanSat mit Kabelbinder](./img/cansat_with_ziptie.png)

### Sicherung des Antennenkabels

Der Antennenanschluss ist U.Fl, ein für den Automobilbereich geeigneter Steckertyp. Sie halten Vibrationen und Stößen recht gut stand, obwohl sie keine externen mechanischen Stützen haben. Die Zuverlässigkeit kann jedoch verbessert werden, indem die Antenne mit kleinen Kabelbindern gesichert wird. Die CanSat NeXT-Platine hat kleine Schlitze neben der Antenne für diesen Zweck. Um die Antenne in einer neutralen Position zu halten, kann eine [Stütze gedruckt werden](../CanSat-hardware/communication#quarter-wave-antenna).

![Antenne mit einem 3D-gedruckten Stützteil gesichert](../CanSat-hardware/img/qw_6.png)

### Sicherung der SD-Karte

Die SD-Karte kann bei hohen Stößen aus dem Halter springen. Auch hier haben die Platinen Stürze und Flüge überlebt, aber die Zuverlässigkeit kann verbessert werden, indem die SD-Karte am Halter festgeklebt oder geklebt wird. Neuere CanSat NeXT-Platinen (≥1.02) sind mit hochsicheren SD-Kartenhaltern ausgestattet, um dieses Problem weiter zu mildern.

## Kommunikationstest

Eines der wichtigsten Details für eine erfolgreiche Mission ist eine zuverlässige Funkverbindung. Es gibt mehr Informationen zur Auswahl und/oder zum Bau der Antennen im [Hardware-Bereich](../CanSat-hardware/communication#antenna-options) der Dokumentation. Unabhängig von der gewählten Antenne ist das Testen jedoch ein wesentlicher Bestandteil jedes Funksystems.

Ein ordnungsgemäßer Antennentest kann knifflig sein und erfordert spezielle Ausrüstung wie [VNAs](https://de.wikipedia.org/wiki/Netzwerkanalysator_(Elektrik)), aber wir können einen Funktionstest direkt mit dem CanSat NeXT-Kit durchführen.

Zuerst programmieren Sie den Satelliten so, dass er Daten sendet, zum Beispiel eine Datenlesung einmal pro Sekunde. Dann programmieren Sie die Bodenstation, um Daten zu empfangen und die **RSSI**-Werte (Received Signal Strength Indicator) zu drucken, wie sie von der `getRSSI()`-Funktion, die Teil der CanSat NeXT-Bibliothek ist, angegeben werden.

```Cpp title="RSSI lesen"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI: ");
  Serial.println(rssi);
}
```

Dieser Wert repräsentiert die tatsächliche elektrische **Leistung**, die von der Bodenstation durch ihre Antenne empfangen wird, wenn sie eine Nachricht empfängt. Der Wert wird in [Dezibel-Milliwatt](https://de.wikipedia.org/wiki/DBm) ausgedrückt. Eine typische Messung mit einer funktionierenden Antenne an beiden Enden, wenn sich die Geräte auf demselben Tisch befinden, beträgt -30 dBm (1000 Nanowatt), und sie sollte schnell abnehmen, wenn die Entfernung zunimmt. Im freien Raum folgt sie ungefähr dem inversen Quadratgesetz, aber nicht genau aufgrund von Echos, Fresnel-Zonen und anderen Unvollkommenheiten. Mit den Funkeinstellungen, die CanSat NeXT standardmäßig verwendet, kann der RSSI-Wert auf etwa -100 dBm (0,1 Pikowatt) gesenkt werden und dennoch kommen einige Daten durch.

Dies entspricht normalerweise einer Entfernung von etwa einem Kilometer bei Verwendung der Monopolantennen, kann jedoch viel mehr sein, wenn die Bodenstationsantenne einen signifikanten [Gewinn](https://de.wikipedia.org/wiki/Gewinn_(Antenne)) hat, der direkt zum dBm-Wert hinzukommt.

## Leistungstests

Es ist eine gute Idee, den Stromverbrauch Ihres Satelliten mit einem Multimeter zu messen. Es ist auch einfach, entfernen Sie einfach eine der Batterien und halten Sie sie manuell so, dass Sie die Strommessung des Multimeters verwenden können, um zwischen einem Ende der Batterie und dem Batteriekontakt zu verbinden. Diese Messung sollte in der Größenordnung von 130-200 mA liegen, wenn das CanSat NeXT-Radio aktiv ist und keine externen Geräte vorhanden sind. Der Stromverbrauch steigt, wenn die Batterien entladen werden, da mehr Strom benötigt wird, um die Spannung bei 3,3 Volt von der sinkenden Batteriespannung zu halten.

Typische AAA-Batterien haben eine Kapazität von etwa 1200 mAh, was bedeutet, dass der Haltestromverbrauch des Geräts weniger als 300 mA betragen sollte, um sicherzustellen, dass die Batterien die gesamte Mission überdauern. Dies ist auch der Grund, warum es eine gute Idee ist, mehrere Betriebsmodi zu haben, wenn stromhungrige Geräte an Bord sind, da sie kurz vor dem Flug eingeschaltet werden können, um eine gute Batterielebensdauer zu gewährleisten.

Während ein mathematischer Ansatz zur Schätzung der Batterielebensdauer ein guter Anfang ist, ist es dennoch am besten, eine tatsächliche Messung der Batterielebensdauer durchzuführen, indem man frische Batterien besorgt und eine simulierte Mission durchführt.

## Luft- und Raumfahrttests

In der Luft- und Raumfahrtindustrie wird jeder Satellit rigorosen Tests unterzogen, um sicherzustellen, dass er den harten Bedingungen des Starts, des Weltraums und manchmal des Wiedereintritts standhalten kann. Während CanSats in einer etwas anderen Umgebung arbeiten, könnten Sie dennoch einige dieser Tests anpassen, um die Zuverlässigkeit zu verbessern. Nachfolgend sind einige gängige Luft- und Raumfahrttests für CubeSats und kleine Satelliten aufgeführt, zusammen mit Ideen, wie Sie ähnliche Tests für Ihren CanSat implementieren könnten.

### Vibrationstest

Der Vibrationstest wird in kleinen Satellitensystemen aus zwei Gründen verwendet. Der Hauptgrund ist, dass der Test darauf abzielt, die Resonanzfrequenzen der Struktur zu identifizieren, um sicherzustellen, dass die Vibration der Rakete nicht in einer Struktur des Satelliten zu schwingen beginnt, was zu einem Ausfall der Satellitensysteme führen könnte. Der sekundäre Grund ist auch für CanSat-Systeme relevant, nämlich die Qualität der Handwerkskunst zu bestätigen und sicherzustellen, dass das System den Raketenstart überlebt. Satellitenvibrationstests werden mit speziellen Vibrationstestbänken durchgeführt, aber der Effekt kann auch mit kreativeren Lösungen simuliert werden. Versuchen Sie, eine Möglichkeit zu finden, den Satelliten (oder vorzugsweise seinen Ersatz) wirklich zu schütteln, und sehen Sie, ob etwas bricht. Wie könnte es verbessert werden?

### Schocktest

Ein Verwandter der Vibrationstests, Schocktests simulieren die explosive Stufentrennung während des Raketenstarts. Die Schockbeschleunigung kann bis zu 100 Gs betragen, was Systeme leicht zerstören kann. Dies könnte mit einem Falltest simuliert werden, aber überlegen Sie, wie Sie es sicher tun können, damit der Satellit, Sie oder der Boden nicht beschädigt werden.

### Thermischer Test

Thermische Tests umfassen das Aussetzen des gesamten Satelliten an die Extreme des geplanten Betriebsbereichs und auch das schnelle Bewegen zwischen diesen Temperaturen. Im CanSat-Kontext könnte dies bedeuten, den Satelliten in einem Gefrierschrank zu testen, um einen Start an einem kalten Tag zu simulieren, oder in einem leicht beheizten Ofen, um einen heißen Starttag zu simulieren. Achten Sie darauf, dass die Elektronik, Kunststoffe oder Ihre Haut nicht direkt extremen Temperaturen ausgesetzt werden.

## Allgemeine gute Ideen

Hier sind einige zusätzliche Tipps, um eine erfolgreiche Mission zu gewährleisten. Diese reichen von technischen Vorbereitungen bis hin zu organisatorischen Praktiken, die die Gesamtzuverlässigkeit Ihres CanSat verbessern. Fühlen Sie sich frei, neue Ideen hinzuzufügen, indem Sie den üblichen Kanal (samuli@kitsat.fi) verwenden.

- Erwägen Sie, eine Checkliste zu haben, um zu vermeiden, dass Sie kurz vor dem Start etwas vergessen
- Testen Sie die gesamte Flugsequenz im Voraus in einem simulierten Flug
- Testen Sie den Satelliten auch unter ähnlichen Umweltbedingungen, wie sie beim Flug erwartet werden. Stellen Sie sicher, dass der Fallschirm auch mit den erwarteten Temperaturen zurechtkommt.
- Haben Sie Ersatzbatterien und überlegen Sie, wie sie bei Bedarf installiert werden
- Haben Sie eine Ersatz-SD-Karte, sie fallen manchmal aus
- Haben Sie einen Ersatzcomputer und deaktivieren Sie Updates auf dem Computer vor dem Start.
- Haben Sie Ersatzkabelbinder, Schrauben und was auch immer Sie benötigen, um den Satelliten zusammenzubauen
- Haben Sie einige grundlegende Werkzeuge zur Hand, um beim Zerlegen und Zusammenbauen zu helfen
- Haben Sie zusätzliche Antennen
- Sie können auch mehrere Bodenstationen gleichzeitig betreiben, die auch zur Triangulation des Satelliten verwendet werden können, insbesondere wenn RSSI verfügbar ist.
- Haben Sie klare Rollen für jedes Teammitglied während des Starts, der Operationen und der Bergung.

---

Dies ist das Ende der Lektionen für jetzt. Auf der nächsten Seite befindet sich eine Flugbereitschaftsüberprüfung, die eine Praxis zur Sicherstellung erfolgreicher Missionen unterstützt.

[Klicken Sie hier für die Flugbereitschaftsüberprüfung!](./review2)