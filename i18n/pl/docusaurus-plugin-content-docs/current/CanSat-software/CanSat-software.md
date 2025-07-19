---
sidebar_position: 3
---

# Oprogramowanie CanSat NeXT

Zalecanym sposobem korzystania z CanSat NeXT jest biblioteka CanSat NeXT Arduino, dostępna w menedżerze bibliotek Arduino oraz na Githubie. Przed zainstalowaniem biblioteki CanSat NeXT, musisz zainstalować Arduino IDE oraz wsparcie dla płytek ESP32.

## Pierwsze kroki

### Instalacja Arduino IDE

Jeśli jeszcze tego nie zrobiłeś, pobierz i zainstaluj Arduino IDE z oficjalnej strony https://www.arduino.cc/en/software.

### Dodaj wsparcie dla ESP32

CanSat NeXT opiera się na mikrokontrolerze ESP32, który nie jest uwzględniony w domyślnej instalacji Arduino IDE. Jeśli wcześniej nie używałeś mikrokontrolerów ESP32 z Arduino, wsparcie dla tej płytki musi zostać najpierw zainstalowane. Można to zrobić w Arduino IDE z poziomu *Tools->board->Board Manager* (lub po prostu naciśnij (Ctrl+Shift+B) gdziekolwiek). W menedżerze płytek wyszukaj ESP32 i zainstaluj esp32 by Espressif.

### Instalacja biblioteki CanSat NeXT

Bibliotekę CanSat NeXT można pobrać z Menedżera Bibliotek Arduino IDE z *Sketch > Include Libraries > Manage Libraries*.

![Dodawanie nowych bibliotek w Arduino IDE.](./img/LibraryManager_1.png)

*Źródło obrazu: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

W pasku wyszukiwania Menedżera Bibliotek wpisz "CanSatNeXT" i wybierz "Install". Jeśli IDE zapyta, czy chcesz również zainstalować zależności, kliknij tak.

## Instalacja ręczna

Biblioteka jest również hostowana w swoim własnym [repozytorium GitHub](https://github.com/netnspace/CanSatNeXT_library) i może być sklonowana lub pobrana i zainstalowana ze źródła.

W tym przypadku musisz rozpakować bibliotekę i przenieść ją do katalogu, w którym Arduino IDE może ją znaleźć. Dokładną lokalizację znajdziesz w *File > Preferences > Sketchbook*.

![Dodawanie nowych bibliotek w Arduino IDE.](./img/LibraryManager_2.png)

*Źródło obrazu: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Podłączanie do komputera

Po zainstalowaniu biblioteki oprogramowania CanSat NeXT, możesz podłączyć CanSat NeXT do swojego komputera. W przypadku, gdy nie zostanie wykryty, może być konieczne zainstalowanie niezbędnych sterowników. Instalacja sterowników odbywa się automatycznie w większości przypadków, jednak na niektórych komputerach musi być wykonana ręcznie. Sterowniki można znaleźć na stronie Silicon Labs: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Dla dodatkowej pomocy przy konfiguracji ESP32, zapoznaj się z następującym samouczkiem: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Jesteś gotowy do działania!

Teraz możesz znaleźć przykłady CanSatNeXT w Arduino IDE z *File->Examples->CanSatNeXT*.