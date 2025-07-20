---
sidebar_position: 10
---

# 9. lecke: Egyesek és nullák

Eddig szöveget használtunk az adatok tárolására vagy továbbítására. Bár ez könnyen értelmezhetővé teszi, ugyanakkor nem hatékony. A számítógépek belsőleg **bináris** adatokat használnak, ahol az adatokat egyesek és nullák halmazaként tárolják. Ebben a leckében megvizsgáljuk, hogyan használhatunk bináris adatokat a CanSat NeXT-tel, és megvitatjuk, hogy hol és miért lehet hasznos ezt tenni.

:::info

## Különböző adattípusok

Bináris formában minden adat - legyen az szám, szöveg vagy szenzorleolvasás - egyesek és nullák sorozataként van ábrázolva. Különböző adattípusok különböző mennyiségű memóriát használnak, és a bináris értékeket specifikus módon értelmezik. Tekintsünk át röviden néhány gyakori adattípust és azt, hogyan tárolják őket binárisan:

- **Egész szám (int)**:  
  Az egész számok egész értékeket képviselnek. Például egy 16 bites egész szám 16 egyes és nulla segítségével \(-32,768\) és \(32,767\) közötti értékeket képviselhet. A negatív számokat egy **kettőskomplementer** nevű módszerrel tárolják.

- **Előjel nélküli egész szám (uint)**:  
  Az előjel nélküli egész számok nem negatív számokat képviselnek. Egy 16 bites előjel nélküli egész szám \(0\) és \(65,535\) közötti értékeket tárolhat, mivel nincs bit fenntartva az előjel számára.

- **Lebegőpontos szám (float)**:  
  A lebegőpontos számok tizedes értékeket képviselnek. Egy 32 bites lebegőpontos szám esetén a bitek egy része az előjelet, a kitevőt és a mantisszát képviseli, lehetővé téve a számítógépek számára nagyon nagy és nagyon kicsi számok kezelését. Ez lényegében a [tudományos jelölés](https://en.wikipedia.org/wiki/Scientific_notation) bináris formája.

- **Karakterek (char)**:  
  A karaktereket kódolási sémák, például **ASCII** vagy **UTF-8** segítségével tárolják. Minden karakter egy adott bináris értékhez tartozik (pl. az 'A' az ASCII-ban `01000001`-ként van tárolva).

- **Stringek**:  
  A stringek egyszerűen karakterek gyűjteményei. Egy string minden karaktere egyenként bináris értékként van tárolva sorban. Például a `"CanSat"` string karakterek sorozataként lenne tárolva, mint `01000011 01100001 01101110 01010011 01100001 01110100` (mindegyik 'C', 'a', 'n', 'S', 'a', 't' karaktereket képvisel). Ahogy látható, a számok stringként való ábrázolása, ahogy eddig tettük, kevésbé hatékony, mint bináris értékként tárolni őket.

- **Tömbök és `uint8_t`**:  
  Bináris adatokkal dolgozva gyakori, hogy `uint8_t` tömböt használunk a nyers byte adatok tárolására és kezelésére. A `uint8_t` típus egy előjel nélküli 8 bites egész számot képvisel, amely 0 és 255 közötti értékeket tarthat. Mivel minden byte 8 bitből áll, ez a típus jól illeszkedik a bináris adatok tárolására.
  A `uint8_t` tömböket gyakran használják byte pufferek létrehozására, hogy nyers bináris adatsorozatokat (pl. csomagokat) tároljanak. Néhányan a `char` vagy más változókat részesítik előnyben, de nem igazán számít, melyiket használják, amíg a változó hossza 1 byte.
:::

## Bináris adatok továbbítása

Kezdjük egy egyszerű program feltöltésével a CanSat-ra, és koncentráljunk inkább a földi állomás oldalára. Itt egy egyszerű kód, amely bináris formátumban továbbít egy leolvasást:

```Cpp title="LDR adatok továbbítása binárisként"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

A kód egyébként nagyon ismerősnek tűnik, de a `sendData` most két argumentumot vesz át, nem csak egyet - először az adatok **memóriacímét**, amelyet továbbítani kell, majd az adatok **hosszát**, amelyet továbbítani kell. Ebben az egyszerűsített esetben csak a `LDR_voltage` változó címét és hosszát használjuk.

Ha megpróbálja ezt fogadni a tipikus földi állomás kóddal, csak zagyvaságot fog kiírni, mivel megpróbálja a bináris adatokat úgy értelmezni, mintha string lenne. Ehelyett meg kell adnunk a földi állomásnak, hogy mit tartalmaznak az adatok.

Először nézzük meg, valójában milyen hosszúak az adatok, amelyeket fogadunk.

```Cpp title="A fogadott adatok hosszának ellenőrzése"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");
}
```

Minden alkalommal, amikor a műhold továbbít, 4 byte-ot kapunk a földi állomáson. Mivel egy 32 bites lebegőpontos számot továbbítunk, ez helyesnek tűnik.

Az adatok olvasásához a bináris adatpuffert kell vennünk a bemeneti áramlamból, és az adatokat egy megfelelő változóba kell másolnunk. Ehhez az egyszerű esethez ezt tehetjük:

```Cpp title="Az adatok tárolása egy változóba"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Data: ");
  Serial.println(LDR_reading);
}
```

Először bevezetjük az `LDR_reading` változót, hogy tároljuk az adatokat, amelyekről *tudjuk*, hogy a pufferben vannak. Ezután a `memcpy` (memóriamásolás) segítségével átmásoljuk a bináris adatokat a `data` pufferből az `LDR_reading` **memóriacímére**. Ez biztosítja, hogy az adatok pontosan úgy legyenek átvive, ahogyan tárolták, megőrizve ugyanazt a formátumot, mint a műholdon.

Most, ha kiírjuk az adatokat, mintha közvetlenül a GS oldalon olvastuk volna. Már nem szöveg, mint korábban, hanem az a tényleges adat, amit a műhold oldalán olvastunk. Most könnyen feldolgozhatjuk a GS oldalon, ahogy szeretnénk.

## Saját protokoll készítése

A bináris adatátvitel valódi ereje akkor válik nyilvánvalóvá, amikor több adatot kell továbbítanunk. Azonban még mindig biztosítanunk kell, hogy a műhold és a földi állomás egyetértsen abban, hogy melyik byte mit képvisel. Ezt **csomagprotokollnak** nevezzük.

Egy csomagprotokoll meghatározza az átvitt adatok szerkezetét, megadva, hogyan kell több adatdarabot egyetlen átvitelbe csomagolni, és hogyan kell a vevőnek értelmeznie a bejövő byte-okat. Készítsünk egy egyszerű protokollt, amely több szenzorleolvasást továbbít strukturált módon.

Először olvassuk le az összes gyorsulásmérő és giroszkóp csatornát, és hozzuk létre az **adatcsomagot** a leolvasásokból.

```Cpp title="LDR adatok továbbítása binárisként"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Hozzunk létre egy tömböt az adatok tárolására
  uint8_t packet[24];

  // Másoljuk az adatokat a csomagba
  memcpy(&packet[0], &ax, 4);  // Másoljuk a gyorsulásmérő X-et a 0-3 byte-ba
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Másoljuk a giroszkóp Z-t a 20-23 byte-ba
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Itt először az adatokat olvassuk le, mint a 3. leckében, de aztán **kódoljuk** az adatokat egy adatcsomagba. Először az aktuális puffer jön létre, amely csak egy üres 24 byte-os halmaz. Minden adatváltozót ezután `memcpy`-vel írunk ebbe az üres pufferbe. Mivel `float`-ot használunk, az adatok hossza 4 byte. Ha bizonytalan a változó hosszában, mindig ellenőrizheti a `sizeof(variable)` segítségével.

:::tip[Feladat]

Készítsen földi állomás szoftvert, amely értelmezi és kiírja a gyorsulásmérő és giroszkóp adatokat.

:::

## Bináris adatok tárolása SD kártyán

Az adatok binárisként való írása az SD kártyára hasznos lehet, ha nagyon nagy mennyiségű adattal dolgozunk, mivel a bináris tárolás kompaktabb és hatékonyabb, mint a szöveg. Ez lehetővé teszi, hogy több adatot mentsünk kevesebb tárhely használatával, ami hasznos lehet memória-korlátozott rendszerekben.

Azonban a bináris adatok tárolása kompromisszumokkal jár. A szövegfájlokkal ellentétben a bináris fájlok nem ember által olvashatók, ami azt jelenti, hogy nem nyithatók meg és érthetők meg könnyen szabványos szövegszerkesztőkkel vagy importálhatók olyan programokba, mint az Excel. A bináris adatok olvasásához és értelmezéséhez speciális szoftverekre vagy szkriptekre (pl. Pythonban) van szükség, hogy helyesen elemezzék a bináris formátumot.

A legtöbb alkalmazás esetében, ahol a hozzáférés könnyűsége és a rugalmasság fontos (például az adatok későbbi elemzése számítógépen), a szövegalapú formátumok, mint a CSV ajánlottak. Ezek a formátumok könnyebben kezelhetők különféle szoftvereszközökben, és nagyobb rugalmasságot biztosítanak a gyors adatelemzéshez.

Ha elkötelezett a bináris tárolás használata mellett, nézzen mélyebbre a "motorháztető alatt" azzal, hogy áttekinti, hogyan kezeli a CanSat könyvtár az adatok tárolását belsőleg. Közvetlenül használhatja a C-stílusú fájlkezelési módszereket a fájlok, adatfolyamok és más alacsony szintű műveletek hatékony kezelésére. További információt találhat az [Arduino SD kártya könyvtárban](https://docs.arduino.cc/libraries/sd/).

---

Programjaink egyre bonyolultabbá válnak, és vannak olyan komponensek is, amelyeket jó lenne máshol újra felhasználni. Annak érdekében, hogy kódunk ne váljon nehezen kezelhetővé, jó lenne, ha megoszthatnánk néhány komponenst különböző fájlok között, és olvashatóvá tennénk a kódot. Nézzük meg, hogyan valósítható ez meg az Arduino IDE-vel.

[Kattintson ide a következő leckéhez!](./lesson10)