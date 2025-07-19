---
sidebar_position: 2
---

# 1. lecke: Hello World!

Ez az első lecke bemutatja, hogyan kezdheted el a munkát a CanSat NeXT-tel azáltal, hogy megmutatja, hogyan írj és futtass egy egyszerű programot a táblán.

A lecke végére meglesznek a szükséges eszközök ahhoz, hogy elkezdj szoftvert fejleszteni a CanSat-hoz.

## Eszközök telepítése

A CanSat NeXT használatához az Arduino IDE ajánlott, így kezdjük azzal, hogy telepítjük azt, valamint a szükséges könyvtárakat és táblákat.

### Arduino IDE telepítése

Ha még nem tetted meg, töltsd le és telepítsd az Arduino IDE-t a hivatalos weboldalról: https://www.arduino.cc/en/software.

### ESP32 támogatás hozzáadása

A CanSat NeXT az ESP32 mikrokontrollerre épül, amely nem része az Arduino IDE alapértelmezett telepítésének. Ha még nem használtál ESP32 mikrokontrollereket az Arduino-val, először telepíteni kell a táblához szükséges támogatást. Ezt az Arduino IDE-ben a *Tools->board->Board Manager* menüpont alatt lehet megtenni (vagy csak nyomd meg a (Ctrl+Shift+B) billentyűkombinációt bárhol). A tábla kezelőben keresd meg az ESP32-t, és telepítsd az esp32-t az Espressif-től.

### CanSat NeXT könyvtár telepítése

A CanSat NeXT könyvtár letölthető az Arduino IDE Könyvtárkezelőjéből a *Sketch > Include Libraries > Manage Libraries* menüpont alatt.

![Új könyvtárak hozzáadása az Arduino IDE-vel.](./../CanSat-software/img/LibraryManager_1.png)

*Kép forrása: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

A Könyvtárkezelő keresősávjába írd be a "CanSatNeXT" kifejezést, és válaszd az "Install" lehetőséget. Ha az IDE megkérdezi, hogy szeretnéd-e a függőségeket is telepíteni, kattints az igenre.

## Csatlakozás a számítógéphez

A CanSat NeXT szoftver könyvtár telepítése után csatlakoztathatod a CanSat NeXT-et a számítógépedhez. Ha nem észleli, előfordulhat, hogy először telepítened kell a szükséges illesztőprogramokat. Az illesztőprogramok telepítése a legtöbb esetben automatikusan megtörténik, azonban néhány számítógépen manuálisan kell elvégezni. Az illesztőprogramok megtalálhatók a Silicon Labs weboldalán: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
További segítség az ESP32 beállításához a következő útmutatóban található: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

## Az első program futtatása

Most, hogy telepítettük a könyvtárakat, kezdjünk el kódot futtatni a CanSat NeXT-en. Ahogy az szokás, kezdjük azzal, hogy villogtatjuk az LED-et és kiírjuk a "Hello World!" üzenetet a számítógépre.

### A megfelelő port kiválasztása

Miután csatlakoztattad a CanSat NeXT-et a számítógépedhez (és bekapcsoltad), ki kell választanod a megfelelő portot. Ha nem tudod, melyik a megfelelő, egyszerűen húzd ki az eszközt, és nézd meg, melyik port tűnik el.

![A megfelelő tábla kiválasztása.](./img/selection.png)

Az Arduino IDE most megkérdezi az eszköz típusát. Válaszd az ESP32 Dev Module-t.

![A megfelelő tábla típus kiválasztása.](./img/type.png)

### Példa kiválasztása

A CanSat NeXT könyvtár több példa kódot is tartalmaz, amelyek bemutatják, hogyan használhatók a különböző funkciók a táblán. Ezeket a példa skicceket a File -> Examples -> CanSat NeXT menüpont alatt találod. Válaszd a "Hello_world" lehetőséget.

Miután megnyitottad az új skiccet, feltöltheted a táblára az upload gomb megnyomásával.

![Feltöltés.](./img/upload.png)

Egy idő után a tábla LED-je elkezd villogni. Ezenkívül az eszköz üzenetet küld a számítógépnek. Ezt a soros monitor megnyitásával és a 115200 baud rate kiválasztásával láthatod.

Próbáld megnyomni a táblán lévő gombot is. Ennek újra kell indítania a processzort, vagyis újra kell indítania a kódot az elejéről.

### Hello World magyarázata

Nézzük meg, mi történik valójában ebben a kódban, soronként végigmenve rajta. Először a kód a CanSat könyvtár **beillesztésével** kezdődik. Ennek a sornak szinte minden CanSat NeXT-re írt program elején ott kell lennie, mivel ez jelzi a fordítónak, hogy használni szeretnénk a CanSat NeXT könyvtár funkcióit.

```Cpp title="Include CanSat NeXT"
#include "CanSatNeXT.h"
```
Ezután a kód az setup függvényre ugrik. Ott két hívás található - először a serial az az interfész, amelyet az üzenetek USB-n keresztüli küldésére használunk a számítógépnek. A függvényhívásban szereplő szám, 115200, a baud-rate-re utal, azaz hány egyes és nullák kerülnek elküldésre másodpercenként. A következő hívás, `CanSatInit()`, a CanSat NeXT könyvtárból származik, és elindítja az összes fedélzeti érzékelőt és egyéb funkciókat. Hasonlóan az `#include` parancshoz, ez általában megtalálható a CanSat NeXT skiccekben. Bármit, amit csak egyszer szeretnél futtatni az indításkor, az setup-függvénybe kell beilleszteni.

```Cpp title="Setup"
void setup() {
  // Indítsd el a soros vonalat az adatok terminálra nyomtatásához
  Serial.begin(115200);
  // Indítsd el az összes CanSatNeXT fedélzeti rendszert.
  CanSatInit();
}
```

Az setup után a kód végtelenül ismétli a loop függvényt. Először a program az output pin LED-et magasra állítja, azaz 3,3 voltos feszültséget ad neki. Ez bekapcsolja a fedélzeti LED-et. 100 milliszekundum után az adott kimeneti pin feszültsége visszaáll nullára. Most a program 400 ms-ig vár, majd üzenetet küld a számítógépnek. Miután az üzenet elküldésre került, a loop függvény újraindul az elejéről.

```Cpp title="Loop"
void loop() {
  // Villogtassuk az LED-et
  digitalWrite(LED, HIGH);
  delay(100);
  digitalWrite(LED, LOW);
  delay(400);
  Serial.println("This is a message!");
}
```

Próbáld megváltoztatni a késleltetési értékeket vagy az üzenetet, hogy lásd, mi történik. Gratulálok, hogy idáig eljutottál! Az eszközök beállítása nehéz lehet, de innentől kezdve szórakoztatóbb lesz.

---

A következő leckében elkezdjük olvasni az adatokat a fedélzeti érzékelőkről.

[Kattints ide a második leckéhez!](./lesson2)