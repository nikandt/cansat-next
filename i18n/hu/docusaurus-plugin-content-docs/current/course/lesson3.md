---
sidebar_position: 3
---

# 3. Lecke: A forgás érzékelése

A CanSat NeXT két érzékelő IC-vel rendelkezik a CanSat NeXT panelen. Az egyik a barométer, amit az előző leckében használtunk, a másik pedig az _inerciális mérőegység_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). Az LSM6DS3 egy 6 tengelyes IMU, ami azt jelenti, hogy 6 különböző mérést tud végezni. Ebben az esetben lineáris gyorsulást mér három tengelyen (x, y, z) és szögsebességet három tengelyen.

Ebben a leckében megnézzük a könyvtárban található IMU példát, és egy kis kísérletet is végzünk az IMU-val.

## Könyvtári példa

Kezdjük azzal, hogy megnézzük, hogyan működik a könyvtári példa. Töltsük be a File -> Examples -> CanSat NeXT -> IMU menüpontból.

A kezdeti beállítás ismét ugyanaz - a könyvtár beillesztése, a soros port és a CanSat inicializálása. Tehát koncentráljunk a ciklusra. Azonban a ciklus is nagyon ismerősnek tűnik! Az értékeket ugyanúgy olvassuk ki, mint az előző leckében, csak most sokkal több van belőlük.

```Cpp title="IMU értékek olvasása"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Minden tengelyt valójában néhány száz mikroszekundum különbséggel olvasunk. Ha egyszerre szeretné frissíteni őket, nézze meg a [readAcceleration](./../CanSat-software/library_specification#readacceleration) és a [readGyro](./../CanSat-software/library_specification#readgyro) függvényeket.

:::

Az értékek kiolvasása után szokás szerint ki is nyomtathatjuk őket. Ezt megtehetjük a Serial.print és println használatával, mint az előző leckében, de ez a példa egy alternatív módot mutat az adatok nyomtatására, sokkal kevesebb kézi írással.

Először egy 128 karakteres puffer jön létre. Ezután először inicializáljuk úgy, hogy minden érték 0 legyen, a memset használatával. Ezután az értékeket a pufferbe írjuk `snprintf()` segítségével, ami egy olyan függvény, amelyet formázott szövegek írására lehet használni. Végül ezt egyszerűen kinyomtatjuk a `Serial.println()` segítségével.

```Cpp title="Különleges nyomtatás"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Ha a fenti zavarosnak tűnik, használhatja a megszokottabb stílust a print és println használatával. Azonban ez kissé bosszantóvá válik, amikor sok értéket kell kinyomtatni.

```Cpp title="Hagyományos nyomtatás"
Serial.print("Ax:");
Serial.println(ay);
// stb.
```

Végül ismét van egy rövid késleltetés, mielőtt a ciklus újraindulna. Ez elsősorban azért van, hogy az output olvasható legyen - késleltetés nélkül a számok olyan gyorsan változnának, hogy nehéz lenne olvasni őket.

A gyorsulást G-ben, vagy $9.81 \text{ m}/\text{s}^2$ többszöröseként olvassuk. A szögsebesség egysége $\text{mrad}/\text{s}$.

:::tip[Gyakorlat]

Próbálja meg azonosítani a tengelyeket a leolvasások alapján!

:::

## Szabadesés érzékelése

Gyakorlatként próbáljuk meg érzékelni, ha az eszköz szabadesésben van. Az ötlet az, hogy a panelt a levegőbe dobjuk, a CanSat NeXT érzékeli a szabadesést, és néhány másodpercig bekapcsolja a LED-et a szabadesés esemény érzékelése után, hogy meg tudjuk állapítani, hogy az ellenőrzésünk aktiválódott, még akkor is, ha újra elkapjuk.

A beállítást megtarthatjuk úgy, ahogy volt, és csak a ciklusra koncentráljunk. Tisztítsuk meg a régi ciklusfüggvényt, és kezdjük újra. Csak a móka kedvéért olvassuk ki az adatokat az alternatív módszerrel.

```Cpp title="Gyorsulás olvasása"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Határozzuk meg a szabadesést úgy, mint egy eseményt, amikor a teljes gyorsulás egy küszöbérték alá esik. A teljes gyorsulást az egyes tengelyekből így számíthatjuk ki:

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Ami a kódban valahogy így nézne ki.

```Cpp title="Teljes gyorsulás számítása"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

És bár ez működne, meg kell jegyeznünk, hogy a négyzetgyök számítása nagyon lassú számítási szempontból, ezért ha lehet, kerüljük el. Végül is csak kiszámíthatjuk

$$a^2 = a_x^2+a_y^2+a_z^2$$

és összehasonlíthatjuk egy előre meghatározott küszöbértékkel.

```Cpp title="Teljes gyorsulás négyzetének számítása"
float totalSquared = ax*ax+ay*ay+az*az;
```

Most, hogy van egy értékünk, kezdjük el vezérelni a LED-et. A LED mindig bekapcsolva lehetne, amikor a teljes gyorsulás egy küszöbérték alá esik, azonban könnyebb lenne olvasni, ha a LED egy ideig bekapcsolva maradna az érzékelés után. Az egyik módja ennek az, hogy készítünk egy másik változót, nevezzük LEDOnTill-nek, ahol egyszerűen megadjuk az időt, ameddig a LED-et bekapcsolva akarjuk tartani.

```Cpp title="Időzítő változó"
unsigned long LEDOnTill = 0;
```

Most frissíthetjük az időzítőt, ha szabadesés eseményt érzékelünk. Használjunk most 0.1-es küszöbértéket. Az Arduino biztosít egy `millis()` nevű függvényt, amely visszaadja az időt a program indítása óta milliszekundumban.

```Cpp title="Az időzítő frissítése"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Végül csak ellenőriznünk kell, hogy az aktuális idő több vagy kevesebb, mint a megadott `LEDOnTill`, és ennek alapján vezérelhetjük a LED-et. Íme, hogyan néz ki az új ciklusfüggvény:

```Cpp title="Szabadesés érzékelő ciklusfüggvény"
unsigned long LEDOnTill = 0;

void loop() {
  // Gyorsulás olvasása
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Teljes gyorsulás (négyzetének) számítása
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Az időzítő frissítése, ha esést érzékelünk
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // A LED vezérlése az időzítő alapján
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Ezt a programot kipróbálva láthatja, milyen gyorsan reagál most, mivel nincs késleltetés a ciklusban. A LED azonnal bekapcsol, miután elhagyja a kezet, amikor eldobja.

:::tip[Gyakorlatok]

1. Próbálja meg újra bevezetni a késleltetést a ciklusfüggvényben. Mi történik?
2. Jelenleg nincs semmilyen nyomtatás a ciklusban. Ha csak hozzáad egy nyomtatási utasítást a ciklushoz, a kimenet nagyon nehezen olvasható lesz, és a nyomtatás jelentősen lelassítja a ciklus futási idejét. Kitalálhat egy módot arra, hogy csak egyszer nyomtasson másodpercenként, még akkor is, ha a ciklus folyamatosan fut? Tipp: nézze meg, hogyan valósították meg a LED időzítőt.
3. Készítsen saját kísérletet, amelyben vagy a gyorsulást, vagy a forgást használja valamilyen esemény érzékelésére.

:::

---

A következő leckében elhagyjuk a digitális világot, és megpróbálunk egy másik típusú érzékelőt használni - egy analóg fényérzékelőt.

[Kattintson ide a következő leckéhez!](./lesson4)