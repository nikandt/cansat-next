---
sidebar_position: 3
---

# CanSat NeXT Tarkvara

Soovitatav viis CanSat NeXT kasutamiseks on CanSat NeXT Arduino teek, mis on saadaval Arduino teegihalduris ja Githubis. Enne CanSat NeXT teegi installimist peate installima Arduino IDE ja ESP32 plaadi toe.

## Alustamine

### Arduino IDE installimine

Kui te pole seda veel teinud, laadige alla ja installige Arduino IDE ametlikult veebisaidilt https://www.arduino.cc/en/software.

### ESP32 toe lisamine

CanSat NeXT põhineb ESP32 mikrokontrolleril, mis ei kuulu Arduino IDE vaikimisi installi. Kui te pole varem ESP32 mikrokontrollereid Arduinoga kasutanud, tuleb esmalt paigaldada plaadi tugi. Seda saab teha Arduino IDE-s *Tools->board->Board Manager* (või vajutage lihtsalt (Ctrl+Shift+B) ükskõik kus). Plaadihalduris otsige ESP32 ja installige esp32 Espressif poolt.

### Cansat NeXT teegi installimine

CanSat NeXT teegi saab alla laadida Arduino IDE teegihaldurist *Sketch > Include Libraries > Manage Libraries*.

![Uute teekide lisamine Arduino IDE-ga.](./img/LibraryManager_1.png)

*Pildi allikas: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

Teegihalduri otsinguribale kirjutage "CanSatNeXT" ja valige "Install". Kui IDE küsib, kas soovite installida ka sõltuvused, klõpsake jah.

## Käsitsi installimine

Teek on samuti majutatud oma [GitHubi repositooriumis](https://github.com/netnspace/CanSatNeXT_library) ja seda saab kloonida või alla laadida ja installida lähtekoodist.

Sellisel juhul peate teegi lahti pakkima ja viima selle kataloogi, kus Arduino IDE seda leiab. Täpse asukoha leiate *File > Preferences > Sketchbook*.

![Uute teekide lisamine Arduino IDE-ga.](./img/LibraryManager_2.png)

*Pildi allikas: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Ühendamine arvutiga

Pärast CanSat NeXT tarkvara teegi installimist saate CanSat NeXT arvutiga ühendada. Kui seda ei tuvastata, peate võib-olla esmalt vajalikud draiverid installima. Draiverite installimine toimub enamasti automaatselt, kuid mõnel arvutil tuleb see teha käsitsi. Draiverid leiate Silicon Labs veebisaidilt: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Lisaks ESP32 seadistamise abistamiseks vaadake järgmist juhendit: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Olete valmis alustama!

Nüüd leiate CanSatNeXT näited Arduino IDE-st *File->Examples->CanSatNeXT*.