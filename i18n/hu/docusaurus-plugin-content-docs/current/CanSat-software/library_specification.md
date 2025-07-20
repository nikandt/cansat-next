---
sidebar_position: 1
---

# Könyvtár specifikáció

# Funkciók

A CanSat NeXT-tel az összes szokásos Arduino funkciót használhatja, valamint bármilyen Arduino könyvtárat. Az Arduino funkciók itt találhatók: https://www.arduino.cc/reference/en/.

A CanSat NeXT könyvtár számos könnyen használható funkciót ad hozzá a különböző fedélzeti erőforrások, például érzékelők, rádió és az SD-kártya használatához. A könyvtár egy sor példa skiccet tartalmaz, amelyek bemutatják, hogyan kell használni ezeket a funkciókat. Az alábbi lista az összes elérhető funkciót is bemutatja.

## Rendszer inicializálási funkciók

### CanSatInit

| Funkció              | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha az inicializálás sikeres volt, vagy nem nulla értéket, ha hiba történt. |
| **Paraméterek**      |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-bájtos MAC cím, amelyet a műhold és a földi állomás oszt meg. Ez egy opcionális paraméter - ha nincs megadva, a rádió nem inicializálódik. Használt példa skiccben: Mind |
| **Leírás**           | Ez a parancs szinte minden CanSat NeXT szkript `setup()` részében megtalálható. A CanSatNeXT hardver, beleértve az érzékelőket és az SD-kártyát, inicializálására szolgál. Továbbá, ha a `macAddress` meg van adva, elindítja a rádiót és elkezdi figyelni a bejövő üzeneteket. A MAC címnek a földi állomás és a műhold között megosztottnak kell lennie. A MAC cím szabadon választható, de vannak nem érvényes címek, mint például az összes bájt `0x00`, `0x01` és `0xFF`. Ha az init függvényt nem érvényes címmel hívják meg, a problémát jelenteni fogja a Soros porton. |

### CanSatInit (egyszerűsített MAC-cím specifikáció)

| Funkció              | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha az inicializálás sikeres volt, vagy nem nulla értéket, ha hiba történt. |
| **Paraméterek**      |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | A MAC-cím utolsó bájtja, amelyet a különböző CanSat-GS párok megkülönböztetésére használnak. |
| **Leírás**           | Ez a CanSatInit egyszerűsített verziója MAC címmel, amely automatikusan beállítja a többi bájtot egy ismert biztonságos értékre. Ez lehetővé teszi a felhasználók számára, hogy csak egy értékkel különböztessék meg az Adó-Vevő párokat, amely 0-255 lehet.|

### GroundStationInit

| Funkció              | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha az inicializálás sikeres volt, vagy nem nulla értéket, ha hiba történt. |
| **Paraméterek**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-bájtos MAC cím, amelyet a műhold és a földi állomás oszt meg.     |
| **Használva példa sketchben** | Groundstation receive                                          |
| **Leírás**            | Ez a CanSatInit függvény közeli rokona, de mindig megköveteli a MAC címet. Ez a függvény csak a rádiót inicializálja, más rendszereket nem. A földi állomás bármilyen ESP32 lap lehet, beleértve bármely fejlesztői lapot vagy akár egy másik CanSat NeXT lapot is. |

### GroundStationInit (egyszerűsített MAC-cím specifikáció)

| Funkció              | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha az inicializálás sikeres volt, vagy nem nulla értéket, ha hiba történt. |
| **Paraméterek**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | A MAC-cím utolsó bájtja, amelyet a különböző CanSat-GS párok megkülönböztetésére használnak. |
| **Leírás**            | Ez a GroundStationInit egyszerűsített verziója MAC címmel, amely automatikusan beállítja a többi bájtot egy ismert biztonságos értékre. Ez lehetővé teszi a felhasználók számára, hogy csak egy értékkel különböztessék meg az Adó-Vevő párokat, amely 0-255 lehet.|

## IMU Funkciók

### readAcceleration

| Funkció              | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha a mérés sikeres volt.                           |
| **Paraméterek**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Egy lebegőpontos változó címe, ahol az x-tengely adatai tárolódnak. |
| **Használva példa sketchben** | IMU                                                  |
| **Leírás**            | Ez a függvény az on-board IMU gyorsulásának olvasására használható. A paraméterek lebegőpontos változók címei minden tengelyhez. Az IMU példa megmutatja, hogyan kell használni ezt a függvényt a gyorsulás olvasásához. A gyorsulás G egységekben (9,81 m/s) van visszaadva. |

### readAccelX

| Funkció              | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                          |
| **Visszatérési érték** | Az X-tengely lineáris gyorsulását adja vissza G egységekben.                           |
| **Használva példa sketchben** | IMU                                                  |
| **Leírás**            | Ez a függvény az on-board IMU gyorsulásának olvasására használható egy adott tengelyen. Az IMU példa megmutatja, hogyan kell használni ezt a függvényt a gyorsulás olvasásához. A gyorsulás G egységekben (9,81 m/s) van visszaadva. |

### readAccelY

| Funkció              | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                          |
| **Visszatérési érték** | Visszaadja a lineáris gyorsulást az Y-tengelyen G egységekben.                           |
| **Használva a példaprogramban** | IMU                                                  |
| **Leírás**           | Ez a függvény az IMU fedélzeti gyorsulásmérőjének adott tengelyéről olvassa le a gyorsulást. Az IMU példaprogram megmutatja, hogyan használható ez a függvény a gyorsulás leolvasására. A gyorsulás G egységekben (9.81 m/s) van visszaadva. |

### readAccelZ

| Funkció              | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                          |
| **Visszatérési érték** | Visszaadja a lineáris gyorsulást a Z-tengelyen G egységekben.                           |
| **Használva a példaprogramban** | IMU                                                  |
| **Leírás**           | Ez a függvény az IMU fedélzeti gyorsulásmérőjének adott tengelyéről olvassa le a gyorsulást. Az IMU példaprogram megmutatja, hogyan használható ez a függvény a gyorsulás leolvasására. A gyorsulás G egységekben (9.81 m/s) van visszaadva. |

### readGyro

| Funkció              | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha a mérés sikeres volt.                           |
| **Paraméterek**      |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: A float változó címét adja meg, ahol az x-tengely adatai tárolódnak. |
| **Használva a példaprogramban** | IMU                                                  |
| **Leírás**           | Ez a függvény az IMU fedélzeti giroszkópjának szögsebességét olvassa le. A paraméterek a tengelyenkénti float változók címei. Az IMU példaprogram megmutatja, hogyan használható ez a függvény a szögsebesség leolvasására. A szögsebesség mrad/s egységekben van visszaadva. |

### readGyroX

| Funkció              | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                          |
| **Visszatérési érték** | Visszaadja a szögsebességet az X-tengelyen mrad/s egységekben.                           |
| **Használva a példaprogramban** | IMU                                                  |
| **Leírás**           | Ez a függvény az IMU fedélzeti giroszkópjának adott tengelyéről olvassa le a szögsebességet. A paraméterek a tengelyenkénti float változók címei. A szögsebesség mrad/s egységekben van visszaadva. |

### readGyroY

| Funkció              | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                          |
| **Visszatérési érték** | Visszaadja a szögsebességet az Y-tengelyen mrad/s egységekben.                           |
| **Használva a példaprogramban** | IMU                                                  |
| **Leírás**           | Ez a függvény az IMU fedélzeti giroszkópjának adott tengelyéről olvassa le a szögsebességet. A paraméterek a tengelyenkénti float változók címei. A szögsebesség mrad/s egységekben van visszaadva. |

### readGyroZ

| Funkció              | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                          |
| **Visszatérési érték** | A Z-tengely szögsebességét adja vissza mrad/s egységben.                           |
| **Használt példa vázlatban** | IMU                                                  |
| **Leírás**           | Ez a funkció a fedélzeti IMU-ról olvassa le a szögsebességet egy adott tengelyen. A paraméterek a tengelyekhez tartozó float változók címei. A szögsebesség mrad/s egységben kerül visszaadásra. |

## Barométer Funkciók

### readPressure

| Funkció              | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                            |
| **Visszatérési érték** | Nyomás mbar-ban                                                   |
| **Paraméterek**      | Nincs                                                               |
| **Használt példa vázlatban** | Baro                                                        |
| **Leírás**           | Ez a funkció a fedélzeti barométer által jelentett nyomást adja vissza. A nyomás millibar egységben van. |

### readTemperature

| Funkció              | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                            |
| **Visszatérési érték** | Hőmérséklet Celsius-ban                                            |
| **Paraméterek**      | Nincs                                                               |
| **Használt példa vázlatban** | Baro                                                        |
| **Leírás**           | Ez a funkció a fedélzeti barométer által jelentett hőmérsékletet adja vissza. A leolvasás egysége Celsius. Megjegyzendő, hogy ez a barométer által mért belső hőmérséklet, így nem feltétlenül tükrözi a külső hőmérsékletet. |

## SD Kártya / Fájlrendszer Funkciók

### SDCardPresent

| Funkció              | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `bool`                                                             |
| **Visszatérési érték** | Igaz értéket ad vissza, ha érzékeli az SD-kártyát, hamisat, ha nem.               |
| **Paraméterek**      | Nincs                                                               |
| **Használt példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció arra használható, hogy ellenőrizze, az SD-kártya mechanikailag jelen van-e. Az SD-kártya csatlakozónak van egy mechanikus kapcsolója, amelyet a funkció meghívásakor olvas le. Igaz vagy hamis értéket ad vissza attól függően, hogy az SD-kártya érzékelhető-e. |

### appendFile

| Funkció              | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha az írás sikeres volt.                           |
| **Paraméterek**      |                                                                    |
|                      | `String filename`: A fájl címe, amelyhez hozzá kell fűzni. Ha a fájl nem létezik, létrejön. |
|                      | `T data`: Az adatok, amelyeket a fájl végére kell fűzni.         |
| **Használva a példa vázlatban** | SD_write                                               |
| **Leírás**           | Ez az alapvető írási funkció, amelyet az olvasások SD-kártyára történő tárolására használnak. |

### printFileSystem

| Funkció              | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      | Nincs                                                               |
| **Használva a példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez egy kis segédfunkció, amely az SD-kártyán található fájlok és mappák neveit nyomtatja ki. Fejlesztés során használható. |

### newDir

| Funkció              | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      |                                                                    |
|                      | `String path`: Az új könyvtár útvonala. Ha már létezik, nem történik semmi. |
| **Használva a példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Új könyvtárak létrehozására használják az SD-kártyán.               |

### deleteDir

| Funkció              | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      |                                                                    |
|                      | `String path`: A törlendő könyvtár útvonala.                        |
| **Használva a példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Könyvtárak törlésére használják az SD-kártyán.                       |

### fileExists

| Funkció              | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `bool`                                                             |
| **Visszatérési érték** | Igazat ad vissza, ha a fájl létezik.                              |
| **Paraméterek**      |                                                                    |
|                      | `String path`: A fájl útvonala.                                     |
| **Használva a példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció használható annak ellenőrzésére, hogy egy fájl létezik-e az SD-kártyán. |

### fileSize

| Funkció              | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint32_t`                                                         |
| **Visszatérési érték** | A fájl mérete bájtokban.                                          |
| **Paraméterek**       |                                                                    |
|                      | `String path`: A fájl elérési útja.                                 |
| **Használt példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció a fájl méretének olvasására használható az SD-kártyán. |

### writeFile

| Funkció              | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0-t ad vissza, ha az írás sikeres volt.                            |
| **Paraméterek**       |                                                                    |
|                      | `String filename`: A fájl címzése, amelybe írni kell.               |
|                      | `T data`: Az adatok, amelyeket a fájlba kell írni.                 |
| **Használt példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció hasonló az `appendFile()`-hoz, de felülírja a meglévő adatokat az SD-kártyán. Adattároláshoz az `appendFile` használata javasolt. Ez a funkció hasznos lehet például beállítások tárolására. |

### readFile

| Funkció              | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `String`                                                           |
| **Visszatérési érték** | A fájl összes tartalma.                                           |
| **Paraméterek**       |                                                                    |
|                      | `String path`: A fájl elérési útja.                                 |
| **Használt példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció a fájl összes adatának változóba olvasására használható. Nagy fájlok olvasása problémákat okozhat, de kis fájlok, például konfigurációs vagy beállítási fájlok esetén megfelelő. |

### renameFile

| Funkció              | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**       |                                                                    |
|                      | `String oldpath`: A fájl eredeti elérési útja.                      |
|                      | `String newpath`: A fájl új elérési útja.                           |
| **Használt példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció a fájlok átnevezésére vagy áthelyezésére használható az SD-kártyán.  |

### deleteFile

| Funkció              | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      |                                                                    |
|                      | `String path`: A törlendő fájl elérési útja.                    |
| **Használt példa vázlatban** | SD_advanced                                                |
| **Leírás**           | Ez a funkció használható fájlok törlésére az SD-kártyáról.        |

## Rádió Funkciók

### onDataReceived

| Funkció              | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      |                                                                    |
|                      | `String data`: Fogadott adat Arduino Stringként.                |
| **Használt példa vázlatban** | Groundstation_receive                                      |
| **Leírás**           | Ez egy visszahívási funkció, amelyet akkor hívnak meg, amikor adat érkezik. A felhasználói kódnak kell definiálnia ezt a funkciót, és a CanSat NeXT automatikusan meghívja, amikor adat érkezik. |

### onBinaryDataReceived

| Funkció              | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      |                                                                    |
|                      | `const uint8_t *data`: Fogadott adat uint8_t tömbként.          |
|                      | `uint16_t len`: A fogadott adat hossza bájtokban.                      |
| **Használt példa vázlatban** | Nincs                                                 |
| **Leírás**           | Ez hasonló az `onDataReceived` funkcióhoz, de az adat bináris formában van megadva a String objektum helyett. Ez haladó felhasználóknak van biztosítva, akik korlátozónak találják a String objektumot. |

### onDataSent

| Funkció              | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                             |
| **Paraméterek**      |                                                                    |
|                      | `const bool success`: Logikai érték, amely jelzi, hogy az adat sikeresen lett-e elküldve. |
| **Használt példa vázlatban** | Nincs                                                 |
| **Leírás**           | Ez egy másik visszahívási funkció, amely hozzáadható a felhasználói kódhoz, ha szükséges. Használható annak ellenőrzésére, hogy a vételt egy másik rádió elismerte-e. |

### getRSSI

| Funkció              | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `int8_t`                                                          |
| **Visszatérési érték** | Az utoljára fogadott üzenet RSSI értéke. 1-et ad vissza, ha az indítás óta nem érkezett üzenet.                           |
| **Használt példa vázlatban** | Nincs                                                  |
| **Leírás**           | Ez a funkció használható a vétel jelerősségének figyelésére. Használható antennák tesztelésére vagy a rádió hatótávolságának felmérésére. Az érték [dBm](https://en.wikipedia.org/wiki/DBm)-ben van kifejezve, azonban a skála nem pontos. |

### sendData (String változat)

| Funkció              | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0, ha az adat elküldésre került (nem jelzi a visszaigazolást).            |
| **Paraméterek**       |                                                                    |
|                      | `T data`: Az elküldendő adat. Bármilyen típusú adat használható, de belsőleg sztringgé konvertálódik.                  |
| **Használt példa vázlatban** | Send_data                                             |
| **Leírás**            | Ez a fő funkció az adatok küldésére a földi állomás és a műhold között. Vegye figyelembe, hogy a visszatérési érték nem jelzi, hogy az adatot ténylegesen fogadták-e, csak azt, hogy elküldték. Az `onDataSent` visszahívás használható annak ellenőrzésére, hogy az adatot fogadta-e a másik végpont. |

### sendData (Bináris változat) {#sendData-binary}

| Funkció              | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                          |
| **Visszatérési érték** | 0, ha az adat elküldésre került (nem jelzi a visszaigazolást).            |
| **Paraméterek**       |                                                                    |
|                      | `T* data`: Az elküldendő adat.                    |
|                      | `uint16_t len`: Az adat hossza bájtokban.                      |
| **Használt példa vázlatban** | Nincs                                                 |
| **Leírás**            | A `sendData` funkció bináris változata, amelyet haladó felhasználóknak biztosítanak, akik korlátozottnak érzik magukat a String objektum által. |

### getRSSI

| Funkció              | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `int8_t`                                                          |
| **Visszatérési érték** | Az utoljára fogadott üzenet RSSI-je. 1-et ad vissza, ha az indítás óta nem érkezett üzenet.                           |
| **Használt példa vázlatban** | Nincs                                                  |
| **Leírás**            | Ez a funkció használható a vétel jelerősségének figyelésére. Használható antennák tesztelésére vagy a rádió hatótávolságának mérésére. Az érték [dBm](https://en.wikipedia.org/wiki/DBm)-ben van kifejezve, azonban a skála nem pontos. 

### setRadioChannel

| Funkció              | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                          |
| **Visszatérési érték** | Nincs                                                            |
| **Paraméterek**       | `uint8_t newChannel`: A kívánt Wi-Fi csatornaszám (1–11). Bármely 11 feletti érték 11-re lesz korlátozva. |
| **Használt példa vázlatban** | Nincs                                                      |
| **Leírás**            | Beállítja az ESP-NOW kommunikációs csatornát. Az új csatornának a szabványos Wi-Fi csatornák (1–11) tartományában kell lennie, amelyek frekvenciái 2,412 GHz-től indulnak 5 MHz-es lépésekkel. Az 1-es csatorna 2,412, a 2-es csatorna 2,417 és így tovább. Ezt a funkciót a könyvtár inicializálása előtt hívja meg. Az alapértelmezett csatorna 1. |

### getRadioChannel

| Funkció              | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Visszatérési típus** | `uint8_t`                                                       |
| **Visszatérési érték** | Az aktuális elsődleges Wi-Fi csatorna. 0-t ad vissza, ha hiba lép fel a csatorna lekérésekor. |
| **Használt példa sketchben** | Nincs                                                      |
| **Leírás**           | Lekéri az aktuálisan használt elsődleges Wi-Fi csatornát. Ez a funkció csak a könyvtár inicializálása után működik. |

### printRadioFrequency

| Funkció              | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Visszatérési típus** | `void`                                                          |
| **Visszatérési érték** | Nincs                                                            |
| **Használt példa sketchben** | Nincs                                                      |
| **Leírás**           | Kiszámítja és kiírja az aktuális frekvenciát GHz-ben az aktív Wi-Fi csatorna alapján. Ez a funkció csak a könyvtár inicializálása után működik. |


## ADC Funkciók

### adcToVoltage

| Funkció              | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                            |
| **Visszatérési érték** | Átalakított feszültség voltban.                                       |
| **Paraméterek**      |                                                                    |
|                      | `int value`: Az átalakítandó ADC olvasás.              |
| **Használt példa sketchben** | AccurateAnalogRead                                    |
| **Leírás**           | Ez a funkció egy kalibrált harmadrendű polinom segítségével alakítja át az ADC olvasást feszültséggé a lineárisabb átalakítás érdekében. Vegye figyelembe, hogy ez a funkció a bemeneti tűnél lévő feszültséget számítja ki, így az akkumulátor feszültségének kiszámításához figyelembe kell venni az ellenálláshálózatot is. |

### analogReadVoltage

| Funkció              | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Visszatérési típus** | `float`                                                            |
| **Visszatérési érték** | ADC feszültség voltban.                                             |
| **Paraméterek**      |                                                                    |
|                      | `int pin`: A beolvasandó tű.                                        |
| **Használt példa sketchben** | AccurateAnalogRead                                    |
| **Leírás**           | Ez a funkció közvetlenül olvassa a feszültséget az `analogRead` használata helyett, és belsőleg átalakítja az olvasást feszültséggé az `adcToVoltage` segítségével. |