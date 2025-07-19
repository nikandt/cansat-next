---
sidebar_position: 3
---

# CanSat NeXT Szoftver

A CanSat NeXT használatának ajánlott módja a CanSat NeXT Arduino könyvtár használata, amely elérhető az Arduino könyvtárkezelőből és a Githubról. A CanSat NeXT könyvtár telepítése előtt telepítenie kell az Arduino IDE-t és az ESP32 tábla támogatását.

## Első lépések

### Arduino IDE telepítése

Ha még nem tette meg, töltse le és telepítse az Arduino IDE-t a hivatalos weboldalról: https://www.arduino.cc/en/software.

### ESP32 támogatás hozzáadása

A CanSat NeXT az ESP32 mikrokontrolleren alapul, amely nincs benne az Arduino IDE alapértelmezett telepítésében. Ha még nem használta az ESP32 mikrokontrollereket Arduinóval, először telepíteni kell a tábla támogatását. Ezt az Arduino IDE-ben a *Tools->board->Board Manager* menüpontban lehet megtenni (vagy egyszerűen nyomja meg a (Ctrl+Shift+B) billentyűkombinációt bárhol). A tábla kezelőben keressen rá az ESP32-re, és telepítse az esp32-t az Espressif-től.

### Cansat NeXT könyvtár telepítése

A CanSat NeXT könyvtár letölthető az Arduino IDE Könyvtárkezelőjéből a *Sketch > Include Libraries > Manage Libraries* menüpontból.

![Új könyvtárak hozzáadása az Arduino IDE-vel.](./img/LibraryManager_1.png)

*Kép forrása: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

A Könyvtárkezelő keresősávjába írja be a "CanSatNeXT" kifejezést, és válassza a "Telepítés" lehetőséget. Ha az IDE megkérdezi, hogy szeretné-e telepíteni a függőségeket is, kattintson az igenre.

## Manuális telepítés

A könyvtár saját [GitHub tárhelyén](https://github.com/netnspace/CanSatNeXT_library) is elérhető, és klónozható vagy letölthető, majd forrásból telepíthető.

Ebben az esetben ki kell bontania a könyvtárat, és át kell helyeznie abba a könyvtárba, ahol az Arduino IDE megtalálja. A pontos helyet a *File > Preferences > Sketchbook* menüpontban találja.

![Új könyvtárak hozzáadása az Arduino IDE-vel.](./img/LibraryManager_2.png)

*Kép forrása: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Csatlakozás a PC-hez

A CanSat NeXT szoftver könyvtár telepítése után csatlakoztathatja a CanSat NeXT-et a számítógépéhez. Ha nem észleli, előfordulhat, hogy először telepítenie kell a szükséges illesztőprogramokat. Az illesztőprogram telepítése a legtöbb esetben automatikusan történik, azonban néhány számítógépen manuálisan kell elvégezni. Az illesztőprogramok megtalálhatók a Silicon Labs weboldalán: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
További segítségért az ESP32 beállításához tekintse meg a következő útmutatót: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Készen áll!

Most már megtalálhatja a CanSatNeXT példákat az Arduino IDE-ben a *File->Examples->CanSatNeXT* menüpont alatt.