---
sidebar_position: 12
---

# Lekcja 11: Satelita musi rosnąć

Chociaż CanSat NeXT ma już wiele zintegrowanych czujników i urządzeń na samej płytce satelitarnej, wiele ekscytujących misji CanSat wymaga użycia innych zewnętrznych czujników, serwomechanizmów, kamer, silników lub innych siłowników i urządzeń. Ta lekcja różni się nieco od poprzednich, ponieważ omówimy integrację różnych urządzeń zewnętrznych z CanSat. Twój rzeczywisty przypadek użycia prawdopodobnie nie został uwzględniony, ale być może coś podobnego tak. Jeśli jednak uważasz, że coś powinno zostać tutaj omówione, proszę o przesłanie opinii na adres samuli@kitsat.fi.

Ta lekcja różni się nieco od poprzednich, ponieważ chociaż wszystkie informacje są przydatne, możesz swobodnie przejść do obszarów, które są istotne dla Twojego projektu, i używać tej strony jako odniesienia. Jednak przed kontynuowaniem tej lekcji, zapoznaj się z materiałami przedstawionymi w sekcji [sprzęt](./../CanSat-hardware/CanSat-hardware.md) dokumentacji CanSat NeXT, ponieważ zawiera ona wiele informacji potrzebnych do integracji urządzeń zewnętrznych.

## Podłączanie urządzeń zewnętrznych

Istnieją dwa świetne sposoby podłączania urządzeń zewnętrznych do CanSat NeXT: użycie [płytek perforowanych](../CanSat-accessories/CanSat-NeXT-perf.md) i niestandardowych PCB. Tworzenie własnego PCB jest łatwiejsze (i tańsze) niż mogłoby się wydawać, a aby zacząć, dobrym punktem wyjścia jest ten [samouczek KiCAD](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Mamy również dostępny [szablon](../CanSat-hardware/mechanical_design.md#designing-a-custom-pcb) dla KiCAD, dzięki czemu tworzenie płytek w tym samym formacie jest bardzo proste.

To powiedziawszy, dla większości misji CanSat lutowanie zewnętrznych czujników lub innych urządzeń do płytki perforowanej jest świetnym sposobem na stworzenie niezawodnych, solidnych stosów elektronicznych.

Jeszcze łatwiejszym sposobem na rozpoczęcie, zwłaszcza podczas pierwszego prototypowania, jest użycie kabli zworkowych (nazywanych również kablami Dupont lub przewodami do płytki stykowej). Zwykle są one dostarczane z czujnikami, ale można je również kupić osobno. Mają ten sam skok 0,1 cala używany przez nagłówek pinów rozszerzenia, co ułatwia podłączanie urządzeń za pomocą kabli. Jednak chociaż kable są łatwe w użyciu, są dość obszerne i zawodzące. Z tego powodu unikanie kabli w modelu lotnym CanSat jest gorąco zalecane.

## Udostępnianie zasilania urządzeniom

CanSat NeXT używa 3,3 wolta dla wszystkich swoich urządzeń, dlatego jest to jedyna linia napięcia dostarczana do nagłówka rozszerzenia. Wiele komercyjnych czujników, zwłaszcza starszych, obsługuje również działanie na 5 woltach, ponieważ jest to napięcie używane przez starsze Arduina. Jednak zdecydowana większość urządzeń obsługuje również działanie bezpośrednio przy 3,3 wolta.

W nielicznych przypadkach, gdy 5 woltów jest absolutnie wymagane, można na płytce umieścić **przetwornicę podwyższającą**. Dostępne są gotowe moduły, ale można również bezpośrednio przylutować wiele urządzeń do płytki perforowanej. Niemniej jednak, spróbuj najpierw użyć urządzenia z 3,3 wolta, ponieważ istnieje duża szansa, że będzie działać.

Maksymalny zalecany pobór prądu z linii 3,3 wolta wynosi 300 mA, więc dla urządzeń o dużym zapotrzebowaniu na prąd, takich jak silniki czy grzałki, rozważ zewnętrzne źródło zasilania.

## Linie danych

Nagłówek rozszerzenia ma łącznie 16 pinów, z których dwa są zarezerwowane dla linii masy i zasilania. Reszta to różne typy wejść i wyjść, z których większość ma wiele możliwych zastosowań. Rozkład pinów na płytce pokazuje, co każdy z pinów może robić.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Wszystkie odsłonięte piny mogą być używane jako ogólne wejścia i wyjścia (GPIO), co oznacza, że możesz wykonywać funkcje `digitalWrite` i `digitalRead` z nimi w kodzie.

### ADC

Piny 33 i 32 mają przetwornik analogowo-cyfrowy (ADC), co oznacza, że możesz użyć `analogRead` (i `adcToVoltage`) do odczytu napięcia na tym pinie.

### DAC

Te piny mogą być używane do tworzenia określonego napięcia na wyjściu. Należy zauważyć, że produkują one pożądane napięcie, jednak mogą dostarczyć tylko bardzo małą ilość prądu. Mogą być używane jako punkty odniesienia dla czujników lub nawet jako wyjście audio, jednak będziesz potrzebować wzmacniacza (lub dwóch). Możesz użyć `dacWrite` do zapisu napięcia. W bibliotece CanSat jest również przykład tego.

### SPI

Interfejs szeregowy SPI (Serial Peripheral Interface) to standardowa linia danych, często używana przez czujniki Arduino i podobne urządzenia. Urządzenie SPI potrzebuje czterech pinów:

| **Nazwa pinu** | **Opis**                                                    | **Zastosowanie**                                               |
|----------------|-------------------------------------------------------------|----------------------------------------------------------------|
| **MOSI**       | Główne Wyjście, Wtórne Wejście                              | Dane wysyłane z głównego urządzenia (np. CanSat) do urządzenia wtórnego. |
| **MISO**       | Główne Wejście, Wtórne Wyjście                              | Dane wysyłane z urządzenia wtórnego z powrotem do głównego urządzenia. |
| **SCK**        | Zegar szeregowy                                             | Sygnał zegara generowany przez główne urządzenie do synchronizacji komunikacji. |
| **SS/CS**      | Wybór Wtórnego/Chip Select                                  | Używane przez główne urządzenie do wyboru, z którym urządzeniem wtórnym komunikować się. |

Tutaj głównym urządzeniem jest płytka CanSat NeXT, a urządzeniem wtórnym jest dowolne urządzenie, z którym chcesz się komunikować. Piny MOSI, MISO i SCK mogą być współdzielone przez wiele urządzeń wtórnych, jednak każde z nich potrzebuje własnego pinu CS. Pin CS może być dowolnym pinem GPIO, dlatego nie ma dedykowanego pinu w magistrali.

(Uwaga: W materiałach starszych czasami używa się terminów "master" i "slave" do określenia głównych i wtórnych urządzeń. Te terminy są obecnie uważane za przestarzałe.)

Na płytce CanSat NeXT karta SD używa tej samej linii SPI co nagłówek rozszerzenia. Podłączając inne urządzenie SPI do magistrali, nie ma to znaczenia. Jednak jeśli piny SPI są używane jako piny GPIO, karta SD jest efektywnie wyłączona.

Aby używać SPI, często trzeba określić, które piny z procesora są używane. Przykład może wyglądać tak, gdzie **makra** zawarte w bibliotece CanSat są używane do ustawienia innych pinów, a pin 12 jest ustawiony jako wybór chipu.

```Cpp title="Inicjalizacja linii SPI dla czujnika"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Makra `SPI_CLK`, `SPI_MOSI` i `SPI_MISO` są zastępowane przez kompilator odpowiednio przez 18, 23 i 19.

### I2C

Inter-Integrated Circuit to kolejny popularny protokół magistrali danych, szczególnie używany do małych zintegrowanych czujników, takich jak czujnik ciśnienia i IMU na płytce CanSat NeXT.

I2C jest wygodny, ponieważ wymaga tylko dwóch pinów, SCL i SDA. Nie ma również osobnego pinu wyboru chipu, ale zamiast tego różne urządzenia są rozdzielane przez różne **adresy**, które są używane do nawiązania komunikacji. W ten sposób można mieć wiele urządzeń na tej samej magistrali, o ile wszystkie mają unikalny adres.

| **Nazwa pinu** | **Opis**                                                    | **Zastosowanie**                                               |
|----------------|-------------------------------------------------------------|----------------------------------------------------------------|
| **SDA**        | Linia danych szeregowych                                    | Dwukierunkowa linia danych używana do komunikacji między głównymi i wtórnymi urządzeniami. |
| **SCL**        | Linia zegara szeregowego                                    | Sygnał zegara generowany przez główne urządzenie do synchronizacji transferu danych z urządzeniami wtórnymi. |

Barometr i IMU znajdują się na tej samej magistrali I2C co nagłówek rozszerzenia. Sprawdź adresy tych urządzeń na stronie [Czujniki na pokładzie](../CanSat-hardware/on_board_sensors#inertial-measurement-unit). Podobnie jak w przypadku SPI, możesz używać tych pinów do podłączania innych urządzeń I2C, ale jeśli są one używane jako piny GPIO, IMU i barometr są wyłączone.

W programowaniu Arduino, I2C czasami nazywane jest `Wire`. W przeciwieństwie do SPI, gdzie rozkład pinów jest często określany dla każdego czujnika, I2C jest często używane w Arduino przez najpierw ustanowienie linii danych, a następnie odniesienie się do niej dla każdego czujnika. Poniżej znajduje się przykład, jak barometr jest inicjalizowany przez bibliotekę CanSat NeXT:

```Cpp title="Inicjalizacja drugiej linii szeregowej"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Więc najpierw `Wire` jest inicjalizowany przez podanie odpowiednich pinów I2C. Makra `I2C_SDA` i `I2C_SCL` ustawione w bibliotece CanSat NeXT są zastępowane przez kompilator odpowiednio przez 22 i 21.

### UART

Uniwersalny asynchroniczny odbiornik-nadajnik (UART) jest w pewien sposób najprostszym protokołem danych, ponieważ po prostu wysyła dane jako binarne z określoną częstotliwością. Jako taki, jest ograniczony do komunikacji punkt-punkt, co oznacza, że zazwyczaj nie można mieć wielu urządzeń na tej samej magistrali.

| **Nazwa pinu** | **Opis**                                                    | **Zastosowanie**                                               |
|----------------|-------------------------------------------------------------|----------------------------------------------------------------|
| **TX**         | Transmisja                                                  | Wysyła dane z głównego urządzenia do urządzenia wtórnego.      |
| **RX**         | Odbiór                                                      | Odbiera dane z urządzenia wtórnego do głównego urządzenia.     |

Na CanSat, UART w nagłówku rozszerzenia nie jest używany do niczego innego. Istnieje jednak inna linia UART, ale jest używana do komunikacji USB między satelitą a komputerem. To jest to, co jest używane podczas wysyłania danych do `Serial`.

Druga linia UART może być inicjalizowana w kodzie w ten sposób:

```Cpp title="Inicjalizacja drugiej linii szeregowej"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Niektóre urządzenia używają również [modulacji szerokości impulsu](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) jako swojego wejścia sterującego. Może być również używana do ściemniania diod LED lub kontrolowania mocy wyjściowej w niektórych sytuacjach, wśród wielu innych zastosowań.

W Arduino tylko niektóre piny mogą być używane jako PWM. Jednakże, ponieważ CanSat NeXT jest urządzeniem opartym na ESP32, wszystkie piny wyjściowe mogą być używane do tworzenia wyjścia PWM. PWM jest kontrolowane za pomocą `analogWrite`.

## A co z (moim konkretnym przypadkiem użycia)?

Dla większości urządzeń można znaleźć wiele informacji w internecie. Na przykład, wyszukaj w Google konkretny czujnik, który posiadasz, i użyj tych dokumentów, aby zmodyfikować znalezione przykłady do użycia z CanSat NeXT. Ponadto, czujniki i inne urządzenia mają **karty katalogowe**, które powinny zawierać wiele informacji na temat używania urządzenia, chociaż czasami mogą być trudne do rozszyfrowania. Jeśli uważasz, że coś powinno zostać omówione na tej stronie, proszę daj mi znać na samuli@kitsat.fi.

W następnej, ostatniej lekcji omówimy, jak przygotować satelitę do startu.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson12)