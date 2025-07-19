---
sidebar_position: 6
---

# Projekt mechaniczny

## Wymiary PCB

![Wymiary płytki CanSat NeXT](./img/PCB_dimensions.png)

Główna płytka CanSat NeXT jest zbudowana na PCB o wymiarach 70 x 50 x 1,6 mm, z elektroniką na górnej stronie i baterią na dolnej stronie. PCB ma punkty montażowe w każdym rogu, 4 mm od krawędzi. Punkty montażowe mają średnicę 3,2 mm z uziemionym obszarem padów o średnicy 6,4 mm i są przeznaczone do śrub lub dystansów M3. Obszar padów jest również wystarczająco duży, aby zmieścić nakrętkę M3. Dodatkowo, płytka ma dwa trapezoidalne wycięcia 8 x 1,5 mm po bokach i obszar bez komponentów na górnej stronie w centrum, aby można było dodać opaskę zaciskową lub inne dodatkowe wsparcie dla baterii podczas operacji lotu. Podobnie, dwa sloty 8 x 1,3 mm znajdują się obok złącza anteny MCU, aby antena mogła być zabezpieczona do płytki za pomocą małej opaski zaciskowej lub kawałka sznurka. Złącze USB jest lekko wcięte w płytkę, aby zapobiec jakimkolwiek wystającym elementom. Dodano małe wycięcie, aby pomieścić niektóre kable USB pomimo wcięcia. Złącza rozszerzeń to standardowe żeńskie złącza 0,1 cala (2,54 mm), a ich umiejscowienie jest takie, że środek otworu montażowego znajduje się 2 mm od długiej krawędzi płytki. Złącze najbliżej krótkiej krawędzi jest oddalone od niej o 10 mm. Grubość PCB wynosi 1,6 mm, a wysokość baterii od płytki to około 13,5 mm. Złącza mają około 7,2 mm wysokości. To sprawia, że wysokość zamykanej objętości wynosi około 22,3 mm. Ponadto, jeśli używane są dystanse do układania kompatybilnych płytek razem, dystanse, przekładki lub inny mechaniczny system montażowy powinny oddzielać płytki co najmniej o 7,5 mm. Przy użyciu standardowych złączy pinowych, zalecane oddzielenie płytek wynosi 12 mm.

Poniżej można pobrać plik .step perf-board, który można użyć do dodania PCB do projektu CAD jako odniesienie lub nawet jako punkt wyjścia dla zmodyfikowanej płytki.

[Pobierz plik step](/assets/3d-files/cansat.step)


## Projektowanie niestandardowego PCB

Jeśli chcesz podnieść swój projekt elektroniki na wyższy poziom, powinieneś rozważyć stworzenie niestandardowego PCB dla elektroniki. KiCAD to świetne, darmowe oprogramowanie, które można wykorzystać do projektowania PCB, a ich produkcja jest zaskakująco przystępna cenowo.

Oto zasoby dotyczące rozpoczęcia pracy z KiCAD: https://docs.kicad.org/#_getting_started

Oto szablon KiCAD do rozpoczęcia własnej płytki zgodnej z CanSat: [Pobierz szablon KiCAD](/assets/kicad/Breakout-template.zip)