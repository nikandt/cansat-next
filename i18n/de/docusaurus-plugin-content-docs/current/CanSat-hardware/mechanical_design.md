---
sidebar_position: 6
---

# Mechanisches Design

## PCB-Abmessungen

![CanSat NeXT Platinenabmessungen](./img/PCB_dimensions.png)

Die Hauptplatine des CanSat NeXT basiert auf einer 70 x 50 x 1,6 mm großen Leiterplatte, mit Elektronik auf der Oberseite und Batterie auf der Unterseite. Die Leiterplatte hat Befestigungspunkte an jeder Ecke, 4 mm von den Seiten entfernt. Die Befestigungspunkte haben einen Durchmesser von 3,2 mm mit einer geerdeten Pad-Fläche von 6,4 mm und sind für M3-Schrauben oder Abstandshalter vorgesehen. Die Pad-Fläche ist auch groß genug, um eine M3-Mutter aufzunehmen. Zusätzlich hat die Platine zwei trapezförmige 8 x 1,5 mm Aussparungen an den Seiten und einen komponentenfreien Bereich auf der Oberseite in der Mitte, sodass ein Kabelbinder oder eine andere zusätzliche Unterstützung für die Batterien für Flugoperationen hinzugefügt werden kann. Ebenso befinden sich zwei 8 x 1,3 mm Schlitze neben dem MCU-Antennenanschluss, sodass die Antenne mit einem kleinen Kabelbinder oder einem Stück Schnur an der Platine befestigt werden kann. Der USB-Anschluss ist leicht in die Platine eingedrungen, um jegliche Vorsprünge zu verhindern. Eine kleine Aussparung wurde hinzugefügt, um bestimmte USB-Kabel trotz der Eindringung aufzunehmen. Die Erweiterungssteckverbinder sind Standard 0,1 Zoll (2,54 mm) weibliche Steckverbinder und sie sind so platziert, dass die Mitte des Befestigungslochs 2 mm von der langen Kante der Platine entfernt ist. Der dem kurzen Rand am nächsten gelegene Steckverbinder ist 10 mm davon entfernt. Die Dicke der Leiterplatte beträgt 1,6 mm und die Höhe der Batterien von der Platine beträgt ungefähr 13,5 mm. Die Steckverbinder sind ungefähr 7,2 mm hoch. Dies macht die Höhe des umschließenden Volumens ungefähr 22,3 mm. Wenn Abstandshalter verwendet werden, um kompatible Platinen zusammenzustapeln, sollten die Abstandshalter, Distanzstücke oder andere mechanische Befestigungssysteme die Platinen mindestens 7,5 mm trennen. Bei Verwendung von Standard-Pin-Headern wird eine Platinenabstand von 12 mm empfohlen.

Unten können Sie eine .step-Datei der Lochrasterplatine herunterladen, die verwendet werden kann, um die Leiterplatte in ein CAD-Design als Referenz hinzuzufügen oder sogar als Ausgangspunkt für eine modifizierte Platine zu verwenden.

[Step-Datei herunterladen](/assets/3d-files/cansat.step)


## Entwerfen einer kundenspezifischen Leiterplatte

Wenn Sie Ihr Elektronikdesign auf die nächste Stufe heben möchten, sollten Sie in Betracht ziehen, eine kundenspezifische Leiterplatte für die Elektronik zu erstellen. KiCAD ist eine großartige, kostenlose Software, die zum Entwerfen von Leiterplatten verwendet werden kann, und deren Herstellung ist überraschend erschwinglich.

Hier sind Ressourcen, um mit KiCAD zu beginnen: https://docs.kicad.org/#_getting_started

Hier ist eine KiCAD-Vorlage, um Ihre eigene CanSat-kompatible Schaltung zu starten: [KiCAD-Vorlage herunterladen](/assets/kicad/Breakout-template.zip)