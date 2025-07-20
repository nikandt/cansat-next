---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

CanSat NeXT Perf Board to akcesorium mające na celu ułatwienie integracji zewnętrznych urządzeń z CanSat oraz uczynienie własnej elektroniki bardziej stabilną mechanicznie i lepiej zorganizowaną. Jest to zasadniczo płytka perforowana, która ma kształt zgodny z płytką CanSat NeXT i zapewnia łatwą łączność z rozszerzonym złączem pinowym.

![CanSat NeXT Perf Board](./img/perfboard.png)

Główną cechą płytki perforowanej są otwory metalizowane, rozmieszczone co 0,1 cala (2,54 mm), co jest standardowym **rozstawem** stosowanym w elektronice, zwłaszcza w elektronice hobbystycznej. Ułatwia to integrację większości komercyjnych modułów i wielu komercyjnych układów scalonych, ponieważ mogą być one bezpośrednio przylutowane do styków na płytce perforowanej.

Na górnej stronie otwory mają mały metalizowany pierścień wspomagający łączność, ale na dolnej stronie znajdują się duże metalizowane prostokąty, które znacznie ułatwiają tworzenie mostków lutowniczych między kwadratami, wspomagając tworzenie połączeń elektrycznych między urządzeniami na płytce oraz między dodanymi urządzeniami a CanSat NeXT.

Ponadto, niektóre z metalizowanych otworów najbliżej złącza są już połączone z rozszerzonymi złączami pinowymi. Pomaga to uniknąć konieczności dodawania kabli między złączem pinowym a głównym obszarem płytki perforowanej, co również ułatwia nakładanie na siebie wielu płytek perforowanych, zwłaszcza przy użyciu [złącz pinowych do nakładania](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header). Aby sprawdzić, który pin rozszerzenia co robi, zapoznaj się z [Pinout](../CanSat-hardware/pin_out)

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />