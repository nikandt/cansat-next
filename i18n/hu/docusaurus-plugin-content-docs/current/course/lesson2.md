---
sidebar_position: 2
---

# 2. Lecke: Érezni a nyomást

Ebben a második leckében elkezdjük használni a CanSat NeXT board szenzorait. Ezúttal a környező légköri nyomás mérésére fogunk összpontosítani. Az integrált [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) barométert fogjuk használni a nyomás és a barométer saját hőmérsékletének mérésére.

Kezdjük a könyvtár példáiban található barométer kóddal. Az Arduino IDE-ben válassza a Fájl-> Példák->CanSat NeXT->Baro lehetőséget.

A program eleje ismerős lehet az előző leckéből. Ismét a CanSat NeXT könyvtárat importáljuk, beállítjuk a soros kapcsolatot, és inicializáljuk a CanSat NeXT rendszereket.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

A `CanSatInit()` függvényhívás inicializálja az összes szenzort, beleértve a barométert is. Így elkezdhetjük használni a loop függvényben.

Az alábbi két sorban történik a hőmérséklet és a nyomás tényleges leolvasása. Amikor a `readTemperature()` és `readPressure()` függvényeket meghívjuk, a processzor parancsot küld a barométernek, amely megméri a nyomást vagy a hőmérsékletet, és visszaküldi az eredményt a processzornak.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

A példában az értékek kiírásra kerülnek, majd ezt követi egy 1000 ms késleltetés, így a ciklus körülbelül másodpercenként ismétlődik.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");

delay(1000);
```

### Az adatok felhasználása

Az adatokat a kódban is felhasználhatjuk, nem csak kiírhatjuk vagy elmenthetjük. Például készíthetünk egy kódot, amely érzékeli, ha a nyomás egy bizonyos mértékben csökken, és például bekapcsolja a LED-et. Vagy bármi mást, amit szeretnél. Próbáljuk meg bekapcsolni a beépített LED-et.

Ehhez kissé módosítanunk kell a példa kódját. Először kezdjük el követni az előző nyomásértéket. **Globális változók** létrehozásához, azaz olyanokhoz, amelyek nem csak egy adott függvény végrehajtása során léteznek, egyszerűen írjuk őket bármely konkrét függvényen kívül. A previousPressure változó minden ciklus végén frissül a loop függvényben. Így nyomon követhetjük a régi értéket, és összehasonlíthatjuk az újabb értékkel.

Használhatunk egy if-utasítást az új és régi értékek összehasonlítására. Az alábbi kódban az az ötlet, hogy ha az előző nyomás 0,1 hPa-val alacsonyabb, mint az új érték, akkor bekapcsoljuk a LED-et, ellenkező esetben a LED kikapcsolva marad.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

Ha ezt a módosított ciklust feltöltöd a CanSat NeXT-re, akkor mind a változók értékeit kiírja, mint korábban, de most a nyomáscsökkenést is figyeli. A légköri nyomás körülbelül 0,12 hPa / méterrel csökken felfelé haladva, így ha megpróbálod gyorsan egy méterrel magasabbra emelni a CanSat NeXT-et, a LED-nek be kell kapcsolnia egy ciklusra (1 másodperc), majd újra kikapcsolnia. Valószínűleg a legjobb, ha előtte lecsatlakoztatod az USB kábelt!

Próbálkozhatsz a kód módosításával is. Mi történik, ha a késleltetést megváltoztatod? Mi van, ha a 0,1 hPa **hiszterézis** megváltozik, vagy teljesen eltávolítod?

---

A következő leckében még több fizikai aktivitás vár ránk, amikor megpróbáljuk használni a másik integrált szenzor IC-t - az inerciális mérőegységet.

[Kattints ide a következő leckéhez!](./lesson3)