---
sidebar_position: 6
---

# 6. lecke: Hazatelefonálás

Most, hogy elvégeztük a méréseket és elmentettük azokat egy SD-kártyára, a következő logikus lépés az, hogy vezeték nélkül továbbítsuk azokat a földre, ami teljesen új világot nyit meg a mérések és kísérletek terén, amelyeket elvégezhetünk. Például a nulla gravitációs repülés kipróbálása az IMU-val sokkal érdekesebb (és könnyebben kalibrálható) lett volna, ha valós időben láthattuk volna az adatokat. Nézzük meg, hogyan tehetjük ezt meg!

Ebben a leckében a CanSat NeXT-ből küldünk méréseket a földi állomás vevőjéhez. Később megnézzük, hogyan lehet a CanSat-ot parancsokkal vezérelni, amelyeket a földi állomás küld.

## Antennák

Mielőtt elkezdenénk ezt a leckét, győződj meg róla, hogy valamilyen típusú antenna csatlakozik a CanSat NeXT táblához és a földi állomáshoz.

:::note

Soha ne próbálj meg semmit sugározni antenna nélkül. Nemcsak hogy valószínűleg nem fog működni, de fennáll annak a lehetősége, hogy a visszavert teljesítmény károsítja az adót.

:::

Mivel a 2,4 GHz-es sávot használjuk, amelyet olyan rendszerek osztanak meg, mint a Wi-Fi, Bluetooth, ISM, drónok stb., sok kereskedelmi antenna áll rendelkezésre. A legtöbb Wi-Fi antenna valójában nagyon jól működik a CanSat NeXT-tel, de gyakran szükséged lesz egy adapterre, hogy csatlakoztasd őket a CanSat NeXT táblához. Teszteltünk néhány adapter modellt is, amelyek elérhetők a webáruházban.

További információ az antennákról a hardver dokumentációban található: [Kommunikáció és Antennák](./../CanSat-hardware/communication). Ez a cikk [útmutatást](./../CanSat-hardware/communication#quarter-wave-antenna) is tartalmaz arról, hogyan építhetsz saját antennát a CanSat NeXT készlet anyagaiból.

## Adatok küldése

Miután megbeszéltük az antennákat, kezdjük el küldeni a biteket. Ismét a beállítással kezdjük, amelynek ezúttal van egy kulcsfontosságú különbsége - egy számot adtunk hozzá **argumentumként** a `CanSatInit()` parancshoz.

```Cpp title="Beállítás az adásra"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Egy számérték átadása a `CanSatInit()`-nek azt jelzi a CanSat NeXT-nek, hogy most a rádiót szeretnénk használni. A szám a MAC cím utolsó byte-jának értékét jelzi. Gondolhatsz rá úgy, mint a saját hálózatod kulcsára - csak azokkal a CanSat-okkal tudsz kommunikálni, amelyek ugyanazt a kulcsot osztják meg. Ezt a számot meg kell osztani a CanSat NeXT és a földi állomás között. Kiválaszthatod kedvenc számodat 0 és 255 között. Én a 28-at választottam, mivel ez [tökéletes](https://en.wikipedia.org/wiki/Perfect_number).

A rádió inicializálása után az adatok továbbítása igazán egyszerű. Valójában ugyanúgy működik, mint az előző leckében használt `appendFile()` - bármilyen értéket hozzáadhatsz, és az alapértelmezett formátumban továbbítja, vagy használhatsz formázott karakterláncot, és azt küldheted el helyette.

```Cpp title="Az adatok továbbítása"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Ezzel az egyszerű kóddal most majdnem 10-szer másodpercenként továbbítjuk az LDR mérést. Most nézzük meg, hogyan lehet fogadni.

:::note

Az alacsony szintű programozásban jártasak kényelmesebben érezhetik magukat, ha az adatokat bináris formában küldik. Ne aggódj, erre is van megoldásunk. A bináris parancsok a [Könyvtár Specifikációban](./../CanSat-software/library_specification#sendData-binary) találhatók.

:::

## Adatok fogadása

Ezt a kódot most egy másik ESP32-re kell programozni. Általában ez a készletben található második vezérlőpanel, de szinte bármely más ESP32 is működni fog - beleértve egy másik CanSat NeXT-et is.

:::note

Ha egy ESP32 fejlesztői táblát használsz földi állomásként, ne felejtsd el megnyomni a Boot-gombot a táblán, miközben az IDE-ből villogtatod. Ez beállítja az ESP32-t a megfelelő boot-módba a processzor újraprogramozásához. A CanSat NeXT ezt automatikusan elvégzi, de a fejlesztői táblák általában nem.

:::

A beállító kód pontosan ugyanaz, mint korábban. Csak ne felejtsd el megváltoztatni a rádió kulcsot a kedvenc számodra.

```Cpp title="Beállítás a fogadáshoz"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Azonban ezután a dolgok kicsit másképp alakulnak. Egy teljesen üres loop függvényt készítünk! Ez azért van, mert valójában nincs semmi tennivalónk a loop-ban, hanem a fogadás **visszahívásokon** keresztül történik.

```Cpp title="Visszahívás beállítása"
void loop() {
  // Nincs semmi tennivalónk a loop-ban.
}

// Ez egy visszahívási függvény. Minden alkalommal fut, amikor a rádió adatokat fogad.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Míg a `setup()` függvény csak egyszer fut a kezdetekkor, és a `loop()` folyamatosan fut, az `onDataReceived()` függvény csak akkor fut, amikor a rádió új adatokat fogadott. Ily módon a visszahívási függvényben kezelhetjük az adatokat. Ebben a példában csak kiírjuk, de módosíthattuk volna bármilyen módon is.

Ne feledd, hogy a `loop()` függvénynek nem *kell* üresnek lennie, valójában használhatod bármire, amit szeretnél, egy kivétellel - a késleltetéseket kerülni kell, mivel az `onDataReceived()` függvény sem fog futni, amíg a késleltetés véget nem ér.

Ha most mindkét program különböző táblákon fut egyszerre, akkor elég sok mérésnek kell vezeték nélkül a PC-re érkeznie.

:::note

A bináris orientált emberek számára - használhatod a callback függvényt az onBinaryDataReceived-hez.

:::

## Valós idejű Zero-G

Csak a móka kedvéért ismételjük meg a nulla gravitációs kísérletet, de rádiókkal. A vevő kódja maradhat ugyanaz, mint ahogy a CanSat kódjában a beállítás is.

Emlékeztetőül, az IMU leckében készítettünk egy programot, amely érzékelte a szabad esést, és bekapcsolt egy LED-et ebben az esetben. Itt van a régi kód:

```Cpp title="Szabad esés érzékelő loop függvény"
unsigned long LEDOnTill = 0;

void loop() {
  // Olvasd be a gyorsulást
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Számítsd ki a teljes gyorsulást (négyzetre emelve)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Frissítsd az időzítőt, ha esést érzékelünk
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Vezéreld a LED-et az időzítő alapján
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Csábító, hogy csak közvetlenül hozzáadjuk a `sendData()`-t a régi példához, azonban figyelembe kell vennünk az időzítést. Általában nem akarunk több mint ~20 üzenetet küldeni másodpercenként, de másrészt azt szeretnénk, hogy a loop folyamatosan fusson, hogy a LED még mindig bekapcsoljon.

Szükségünk van egy másik időzítőre - ezúttal, hogy 50 milliszekundumonként küldjünk adatokat. Az időzítőt úgy készítjük el, hogy összehasonlítjuk az aktuális időt az utolsó küldés idejével. Az utolsó küldés idejét minden adatküldéskor frissítjük. Nézd meg, hogyan készül itt a karakterlánc. Részekben is továbbítható lenne, de így egyetlen üzenetként érkezik, ahelyett, hogy több üzenet lenne.

```Cpp title="Szabad esés érzékelés + adatátvitel"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Olvasd be a gyorsulást
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Számítsd ki a teljes gyorsulást (négyzetre emelve)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Frissítsd az időzítőt, ha esést érzékelünk
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Vezéreld a LED-et az időzítő alapján
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Frissítsd az utolsó küldési időt az aktuális időre
    lastSendTime = millis();
  }

}
```

Az adatformátum itt ismét kompatibilis a soros plotterrel - az adatok megtekintése világossá teszi, miért tudtuk korábban olyan tisztán érzékelni a szabad esést - az értékek valóban nullára esnek, amint az eszközt ledobják vagy eldobják.

---

A következő részben rövid szünetet tartunk, hogy áttekintsük, mit tanultunk eddig, és megbizonyosodjunk arról, hogy készen állunk ezekre a fogalmakra építeni.

[Kattints ide az első áttekintéshez!](./review1)