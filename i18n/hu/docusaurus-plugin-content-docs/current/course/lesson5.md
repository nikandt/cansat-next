---
sidebar_position: 5
---

# 5. lecke: Bitek és bájtok mentése

Néha nem lehetséges az adatokat közvetlenül egy PC-re juttatni, például amikor a készüléket dobáljuk, rakétával indítjuk, vagy nehezen elérhető helyeken végzünk méréseket. Ilyen esetekben a legjobb, ha a mért adatokat egy SD kártyára mentjük későbbi feldolgozás céljából. Ezenkívül az SD kártya beállítások tárolására is használható - például tárolhatunk rajta küszöbérték beállításokat vagy címbeállításokat.

## SD kártya a CanSat NeXT könyvtárban

A CanSat NeXT könyvtár széles körű SD kártya műveleteket támogat. Használható fájlok mentésére és olvasására, de könyvtárak és új fájlok létrehozására, áthelyezésére vagy akár törlésére is. Mindezek hasznosak lehetnek különböző körülmények között, de itt összpontosítsunk a két alapvető dologra - egy fájl olvasására és adatok írására egy fájlba.

:::note

Ha teljes ellenőrzést szeretnél a fájlrendszer felett, megtalálhatod a parancsokat a [Könyvtár specifikációjában](./../CanSat-software/library_specification.md#sdcardpresent) vagy a "SD_advanced" könyvtári példában.

:::

Gyakorlatként módosítsuk az előző lecke kódját úgy, hogy az LDR méréseket ne a soros porton írjuk ki, hanem az SD kártyára mentsük.

Először határozzuk meg a fájl nevét, amit használni fogunk. Adjuk hozzá a setup függvény elé, mint **globális változó**.

```Cpp title="Módosított Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Most, hogy van egy fájlútvonalunk, írhatunk az SD kártyára. Ehhez csak két sorra van szükség. A legjobb parancs a mérési adatok mentésére az `appendFile()`, amely csak a fájlútvonalat veszi, és az új adatokat a fájl végére írja. Ha a fájl nem létezik, létrehozza azt. Ez a parancs használatát nagyon egyszerűvé (és biztonságossá) teszi. Csak közvetlenül hozzáadhatjuk az adatokat, majd egy sorváltással követhetjük, hogy az adatok könnyebben olvashatók legyenek. És ennyi! Most már tároljuk a méréseket.

```Cpp title="LDR adatok mentése az SD kártyára"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR érték:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Alapértelmezés szerint az `appendFile()` parancs két tizedesjegy pontossággal tárolja a lebegőpontos számokat. Specifikusabb funkcionalitás érdekében először létrehozhatsz egy karakterláncot a vázlatban, és az `appendFile()` parancsot használhatod a karakterlánc SD kártyára történő tárolására. Például:

```Cpp title="LDR adatok mentése az SD kártyára"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Itt a végső karakterlánc először készül el, a `String(LDR_voltage, 6)` megadja, hogy 6 tizedesjegyet szeretnénk a pont után. Ugyanazt a karakterláncot használhatjuk az adatok nyomtatására és tárolására. (Valamint rádión keresztüli továbbításra)

## Adatok olvasása

Gyakran hasznos valamit az SD kártyára menteni a program későbbi használatára is. Ezek lehetnek például a készülék aktuális állapotára vonatkozó beállítások, így ha a program újraindul, az aktuális állapotot újra betölthetjük az SD kártyáról, ahelyett, hogy alapértelmezett értékekkel kezdenénk.

Ennek bemutatására adjunk hozzá a PC-n egy új fájlt az SD kártyához "delay_time" néven, és írjunk bele egy számot, például 200. Próbáljuk meg a programunkban statikusan beállított késleltetési időt egy fájlból olvasott beállítással helyettesíteni.

Próbáljuk meg olvasni a beállítási fájlt a setup-ban. Először vezessünk be egy új globális változót. Alapértelmezett értéket adtam neki, 1000-et, így ha nem sikerül módosítani a késleltetési időt, ez lesz az alapértelmezett beállítás.

A setup-ban először ellenőriznünk kell, hogy a fájl egyáltalán létezik-e. Ezt a `fileExists()` paranccsal tehetjük meg. Ha nem létezik, használjuk az alapértelmezett értéket. Ezután az adatokat a `readFile()` paranccsal olvashatjuk be. Azonban meg kell jegyeznünk, hogy ez egy karakterlánc - nem egy egész szám, amire szükségünk van. Tehát konvertáljuk az Arduino `toInt()` parancsával. Végül ellenőrizzük, hogy a konverzió sikeres volt-e. Ha nem, az érték nulla lesz, ebben az esetben továbbra is az alapértelmezett értéket használjuk.

```Cpp title="Beállítás olvasása a setup-ban"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Végül ne felejtsd el megváltoztatni a késleltetést a loop-ban, hogy az új változót használja.

```Cpp title="Dinamikusan beállított késleltetési érték"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Most megpróbálhatod megváltoztatni az értéket az SD kártyán, vagy akár eltávolítani az SD kártyát, ebben az esetben az alapértelmezett értéket kell használnia a késleltetési időhöz.

:::note

A beállítás újraírásához a programodban használhatod a [writeFile](./../CanSat-software/library_specification.md#writefile) parancsot. Ez ugyanúgy működik, mint az [appendFile](./../CanSat-software/library_specification.md#appendfile), de felülírja a meglévő adatokat.

:::

:::tip[Gyakorlat]

Folytasd a 4. leckében megoldott feladatod alapján, hogy az állapot megmaradjon akkor is, ha az eszköz újraindul. Azaz tárold az aktuális állapotot az SD kártyán, és olvasd be a setup-ban. Ez szimulálná azt a helyzetet, amikor a CanSat hirtelen újraindul repülés közben vagy a repülés előtt, és ezzel a programmal még mindig sikeres repülést érnél el.

:::

---

A következő leckében a rádió használatát fogjuk megvizsgálni az adatok processzorok közötti továbbítására. A CanSat NeXT-ben és a földi állomáson valamilyen típusú antennának kell lennie, mielőtt elkezdenéd ezeket a gyakorlatokat. Ha még nem tetted meg, nézd meg az alapvető antenna építésének útmutatóját: [Antenna építése](./../CanSat-hardware/communication#quarter-wave-antenna).

[Kattints ide a következő leckéhez!](./lesson6)