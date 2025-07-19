---
sidebar_position: 2
---

# Lekcja 1: Hello World!

Ta pierwsza lekcja wprowadza Cię do CanSat NeXT, pokazując, jak napisać i uruchomić pierwszy program na płytce.

Po tej lekcji będziesz mieć niezbędne narzędzia do rozpoczęcia tworzenia oprogramowania dla Twojego CanSat.

## Instalacja narzędzi

Zaleca się używanie CanSat NeXT z Arduino IDE, więc zacznijmy od zainstalowania tego środowiska oraz niezbędnych bibliotek i płytek.

### Instalacja Arduino IDE

Jeśli jeszcze tego nie zrobiłeś, pobierz i zainstaluj Arduino IDE z oficjalnej strony https://www.arduino.cc/en/software.

### Dodanie wsparcia dla ESP32

CanSat NeXT opiera się na mikrokontrolerze ESP32, który nie jest uwzględniony w domyślnej instalacji Arduino IDE. Jeśli wcześniej nie używałeś mikrokontrolerów ESP32 z Arduino, wsparcie dla płytki musi być najpierw zainstalowane. Można to zrobić w Arduino IDE z *Narzędzia->płytka->Menadżer Płytek* (lub po prostu naciśnij (Ctrl+Shift+B) gdziekolwiek). W menadżerze płytek wyszukaj ESP32 i zainstaluj esp32 od Espressif.

### Instalacja biblioteki Cansat NeXT

Bibliotekę CanSat NeXT można pobrać z Menadżera Bibliotek Arduino IDE z *Szkic > Dołącz Biblioteki > Zarządzaj Bibliotekami*.

![Dodawanie nowych bibliotek w Arduino IDE.](./../CanSat-software/img/LibraryManager_1.png)

*Źródło obrazu: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

W pasku wyszukiwania Menadżera Bibliotek wpisz "CanSatNeXT" i wybierz "Zainstaluj". Jeśli IDE zapyta, czy chcesz również zainstalować zależności, kliknij tak.

## Podłączanie do komputera

Po zainstalowaniu biblioteki oprogramowania CanSat NeXT, możesz podłączyć CanSat NeXT do komputera. W przypadku, gdy nie zostanie wykryty, może być konieczne zainstalowanie niezbędnych sterowników. Instalacja sterowników odbywa się automatycznie w większości przypadków, jednak na niektórych komputerach trzeba to zrobić ręcznie. Sterowniki można znaleźć na stronie Silicon Labs: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Dla dodatkowej pomocy przy konfiguracji ESP32, zapoznaj się z następującym samouczkiem: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

## Uruchamianie pierwszego programu

Teraz, użyjmy świeżo zainstalowanych bibliotek, aby zacząć uruchamiać kod na CanSat NeXT. Jak to tradycja, zacznijmy od migania diodą LED i wypisania "Hello World!" na komputerze.

### Wybór właściwego portu

Po podłączeniu CanSat NeXT do komputera (i włączeniu zasilania), musisz wybrać właściwy port. Jeśli nie wiesz, który jest właściwy, po prostu odłącz urządzenie i zobacz, który port zniknie.

![Wybór właściwej płytki.](./img/selection.png)

Arduino IDE teraz prosi o typ urządzenia. Wybierz ESP32 Dev Module.

![Wybór właściwego typu płytki.](./img/type.png)

### Wybór przykładu

Biblioteka CanSat NeXT zawiera kilka przykładowych kodów pokazujących, jak korzystać z różnych funkcji na płytce. Możesz znaleźć te przykładowe szkice w Plik -> Przykłady -> CanSat NeXT. Wybierz "Hello_world".

Po otwarciu nowego szkicu, możesz go przesłać na płytkę, naciskając przycisk przesyłania.

![Przesyłanie.](./img/upload.png)

Po chwili dioda LED na płytce powinna zacząć migać. Dodatkowo, urządzenie wysyła wiadomość do komputera. Możesz to zobaczyć, otwierając monitor szeregowy i wybierając prędkość transmisji 115200.

Spróbuj także nacisnąć przycisk na płytce. Powinien on zresetować procesor, czyli innymi słowy, uruchomić kod od początku.

### Wyjaśnienie Hello World

Zobaczmy, co właściwie dzieje się w tym kodzie, przechodząc przez niego linia po linii. Najpierw kod zaczyna się od **dołączenia** biblioteki CanSat. Ta linia powinna znajdować się na początku prawie wszystkich programów napisanych dla CanSat NeXT, ponieważ informuje kompilator, że chcemy używać funkcji z biblioteki CanSat NeXT.

```Cpp title="Include CanSat NeXT"
#include "CanSatNeXT.h"
```
Po tym, kod przechodzi do funkcji setup. Tam mamy dwa wywołania - najpierw serial to interfejs, którego używamy do wysyłania wiadomości do komputera przez USB. Liczba wewnątrz wywołania funkcji, 115200, odnosi się do prędkości transmisji, tj. ile jedynek i zer jest wysyłanych każdej sekundy. Następne wywołanie, `CanSatInit()`, pochodzi z biblioteki CanSat NeXT i inicjuje wszystkie czujniki i inne funkcje na płytce. Podobnie jak polecenie `#include`, jest to zazwyczaj znajdowane w szkicach dla CanSat NeXT. Wszystko, co chcesz, aby było uruchomione tylko raz przy starcie, powinno być zawarte w funkcji setup.

```Cpp title="Setup"
void setup() {
  // Rozpocznij linię szeregową do drukowania danych na terminalu
  Serial.begin(115200);
  // Uruchom wszystkie systemy na pokładzie CanSatNeXT.
  CanSatInit();
}
```

Po setup, kod zaczyna powtarzać funkcję loop w nieskończoność. Najpierw program ustawia pin wyjściowy LED na wysoki, tj. ma napięcie 3.3 wolta. To włącza diodę LED na płytce. Po 100 milisekundach napięcie na tym pinie wyjściowym jest z powrotem ustawiane na zero. Teraz program czeka 400 ms, a następnie wysyła wiadomość do komputera. Po wysłaniu wiadomości, funkcja loop zaczyna się od początku.

```Cpp title="Loop"
void loop() {
  // Zmigajmy diodą LED
  digitalWrite(LED, HIGH);
  delay(100);
  digitalWrite(LED, LOW);
  delay(400);
  Serial.println("This is a message!");
}
```

Możesz także spróbować zmienić wartości opóźnień lub wiadomość, aby zobaczyć, co się stanie. Gratulacje za dotarcie tak daleko! Konfiguracja narzędzi może być trudna, ale od tego momentu powinno być bardziej zabawnie.

---

W następnej lekcji zaczniemy odczytywać dane z czujników na pokładzie.

[Kliknij tutaj, aby przejść do drugiej lekcji!](./lesson2)