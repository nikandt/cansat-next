---
sidebar_position: 2
---

# Metasurface Resonator Antenne

Die CanSat NeXT Metasurface Resonator Antenne ist ein externes Antennenmodul, das am Bodenstationsende verwendet werden kann, um die Kommunikationsreichweite zu erhöhen und die Kommunikation zuverlässiger zu machen.

![CanSat NeXT Metasurface Resonator Antenne](./img/resonator_antenna.png)

Die [Bausatzantenne](./../CanSat-hardware/communication#quarter-wave-antenna) von CanSat NeXT wurde erfolgreich für CanSat-Missionen eingesetzt, bei denen der CanSat auf eine Höhe von 1 Kilometer gebracht wurde. Bei diesen Entfernungen beginnt die Monopolantenne jedoch an die Grenze der Betriebsreichweite zu stoßen und kann das Signal manchmal aufgrund von Polarisationsfehlern verlieren, die durch die lineare Polarisation der Monopolantenne entstehen. Das Metasurface Resonator Antennenkit ist so konzipiert, dass es einen zuverlässigeren Betrieb unter solchen extremen Bedingungen ermöglicht und auch den Betrieb mit deutlich längeren Reichweiten erlaubt.

Die Metasurface Resonator Antenne besteht aus zwei Platinen. Die Hauptantenne befindet sich auf der Radiatorplatine, auf der eine Schlitzantenne in die Leiterplatte geätzt wurde. Diese Platine allein bietet etwa 3 dBi Gewinn und verfügt über [zirkulare Polarisation](https://en.wikipedia.org/wiki/Circular_polarization), was in der Praxis bedeutet, dass die Signalstärke nicht mehr von der Ausrichtung der Satellitenantenne abhängt. Diese Platine kann daher selbst als Antenne verwendet werden, wenn eine größere *Strahlbreite* gewünscht wird.

Die andere Platine, von der die Antenne ihren Namen hat, ist das besondere Merkmal dieses Antennenbausatzes. Sie sollte 10-15 mm von der ersten Platine entfernt platziert werden und verfügt über ein Array von Resonatorelementen. Die Elemente werden von der darunter liegenden Schlitzantenne angeregt, was die Antenne wiederum *richtungsweisender* macht. Mit dieser Ergänzung verdoppelt sich der Gewinn auf 6 dBi.

Das folgende Bild zeigt den *Reflexionskoeffizienten* der Antenne, gemessen mit einem Vektornetzwerkanalysator (VNA). Das Diagramm zeigt die Frequenzen, bei denen die Antenne Energie übertragen kann. Obwohl die Antenne eine recht gute Breitbandleistung aufweist, zeigt das Diagramm eine gute Impedanzanpassung im Betriebsfrequenzbereich von 2400-2490 MHz. Dies bedeutet, dass bei diesen Frequenzen der größte Teil der Leistung als Funkwellen übertragen wird, anstatt zurückreflektiert zu werden. Die niedrigsten Reflexionswerte in der Mitte des Bandes liegen bei etwa -18,2 dB, was bedeutet, dass nur 1,51 % der Leistung von der Antenne zurückreflektiert wurde. Obwohl schwieriger zu messen, deuten Simulationen darauf hin, dass zusätzliche 3 % der Übertragungsleistung in der Antenne selbst in Wärme umgewandelt werden, aber die anderen 95,5 % - die Strahlungseffizienz der Antenne - werden als elektromagnetische Strahlung abgestrahlt.

![CanSat NeXT Metasurface Resonator Antenne](./img/antenna_s11.png)

Wie bereits erwähnt, beträgt der Gewinn der Antenne etwa 6 dBi. Dieser kann weiter erhöht werden, indem ein *Reflektor* hinter der Antenne verwendet wird, der die Funkwellen zurück in die Antenne reflektiert und die Richtwirkung verbessert. Während eine parabolische Scheibe einen idealen Reflektor darstellen würde, kann selbst eine flache Metallfläche sehr hilfreich sein, um die Antennenleistung zu steigern. Laut Simulationen und Feldtests erhöht eine Metallfläche - wie ein Stück Stahlblech - die 50-60 mm hinter der Antenne platziert wird, den Gewinn auf etwa 10 dBi. Die Metallfläche sollte mindestens 200 x 200 mm groß sein - größere Flächen sollten besser sein, aber nur marginal. Sie sollte jedoch nicht viel kleiner sein. Die Fläche sollte idealerweise aus massivem Metall bestehen, wie ein Stahlblech, aber selbst ein Drahtgitter funktioniert, solange die Löcher weniger als 1/10 Wellenlänge (~1,2 cm) groß sind.