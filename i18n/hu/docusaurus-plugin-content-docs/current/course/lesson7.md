---
sidebar_position: 8
---

# 7. lecke: Visszabeszélés

A CanSatokat gyakran úgy programozzák, hogy egyszerű logikával működjenek - például méréseket végezzenek minden n milliszekundumban, elmentsék és továbbítsák az adatokat, majd ismételjék meg. Ezzel szemben, ha parancsokat küldünk a műholdnak, hogy megváltoztassa viselkedését a küldetés közepén, sok új lehetőséget nyithat meg. Talán szeretnénk bekapcsolni vagy kikapcsolni egy érzékelőt, vagy utasítani a műholdat, hogy adjon ki hangot, hogy megtalálhassuk. Sok lehetőség van, de talán a leghasznosabb az a képesség, hogy a műhold energiaigényes eszközeit csak közvetlenül a rakétaindítás előtt kapcsoljuk be, így sokkal nagyobb rugalmasságot és szabadságot biztosítva a műhold működtetéséhez, miután már integrálták a rakétába.

Ebben a leckében próbáljuk meg a LED-et be- és kikapcsolni a műhold paneljén a földi állomáson keresztül. Ez egy olyan forgatókönyvet képvisel, ahol a műhold nem tesz semmit, amíg nem utasítják erre, és lényegében egy egyszerű parancsrendszerrel rendelkezik.

:::info

## Szoftver visszahívások

A CanSat könyvtárban az adatfogadás **visszahívásokként** van programozva, ami egy olyan függvény, amely... nos, visszahívódik, amikor egy bizonyos esemény bekövetkezik. Míg eddig a programjainkban a kód mindig pontosan követte az általunk írt sorokat, most úgy tűnik, hogy időnként egy másik függvényt hajt végre közben, mielőtt folytatná a fő ciklusban. Ez zavarónak tűnhet, de elég világos lesz, amikor akcióban látjuk.

:::

## Távoli Blinky

Ehhez a gyakorlathoz próbáljuk megismételni az első leckéből a LED villogását, de ezúttal a LED-et valójában távolról vezéreljük.

Először nézzük meg a műhold oldali programot. Az inicializálás már ismerős, de a ciklus kissé meglepő - nincs benne semmi. Ez azért van, mert az összes logikát a visszahívási függvény kezeli távolról a földi állomásról, így a ciklust üresen hagyhatjuk.

Az érdekesebb dolgok a `onDataReceived(String data)` függvényben történnek. Ez a fent említett visszahívási függvény, amely a könyvtárban van programozva, hogy minden alkalommal meghívódjon, amikor a rádió bármilyen adatot kap. A függvény neve a könyvtárba van programozva, így amíg pontosan ugyanazt a nevet használjuk, mint itt, meghívódik, amikor adat érhető el.

Az alábbi példában az adatokat minden alkalommal kiírjuk, hogy vizualizáljuk, mi történik, de a LED állapota is megváltozik minden alkalommal, amikor üzenet érkezik, függetlenül a tartalomtól.

```Cpp title="Műhold kód, amely nem csinál semmit, amíg nem utasítják"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

A `LED_IS_ON` változó globális változóként van tárolva, ami azt jelenti, hogy a kód bármely részéből elérhető. Ezeket általában nem javasolják a programozásban, és a kezdőket arra tanítják, hogy kerüljék őket a programjaikban. Azonban az _beágyazott_ programozásban, mint amit itt csinálunk, valójában nagyon hatékony és elvárt módja ennek. Csak vigyázz, hogy ne használd ugyanazt a nevet több helyen!

:::

Ha ezt feltöltjük a CanSat NeXT panelre és elindítjuk... Semmi sem történik. Ez természetesen várható, mivel jelenleg nincsenek bejövő parancsok.

A földi állomás oldalán a kód nem túl bonyolult. Inicializáljuk a rendszert, majd a ciklusban minden 1000 ms-ként, azaz másodpercenként egyszer küldünk egy üzenetet. A jelenlegi programban az üzenet tényleges tartalma nem számít, csak az, hogy valami küldésre kerül ugyanabban a hálózatban.

```Cpp title="Földi állomás üzenetek küldése"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Most, amikor ezt a kódot feltöltjük a földi állomásra (ne felejtsd el megnyomni a BOOT-gombot), és a műhold még mindig be van kapcsolva, a műhold LED-je elkezd villogni, minden üzenet után be- és kikapcsol. Az üzenet is kiíródik a terminálra.

:::tip[Gyakorlat]

Töltsd fel az alábbi kódrészletet a földi állomás panelre. Mi történik a műhold oldalon? Meg tudod változtatni a műhold programját úgy, hogy csak akkor reagáljon a LED bekapcsolásával, ha `LED ON` üzenetet kap, és kikapcsolással, ha `LED OFF` üzenetet kap, egyébként csak kiírja a szöveget.

```Cpp title="Földi állomás üzenetek küldése"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Véletlenszerű index generálása az üzenet kiválasztásához
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // A véletlenszerűen kiválasztott üzenet küldése
  sendData(messages[randomIndex]);
}
```

:::

Figyelj arra is, hogy az üzenetek fogadása nem blokkolja azok küldését, így mindkét végéről küldhetünk üzeneteket egyszerre. A műhold folyamatosan továbbíthat adatokat, míg a földi állomás folyamatosan küldhet parancsokat a műholdnak. Ha az üzenetek egyidejűek (ugyanabban a milliszekundumban vagy hasonlóan), ütközés lehet, és az üzenet nem megy át. Azonban a CanSat NeXT automatikusan újraküldi az üzenetet, ha ütközést észlel. Tehát csak vigyázz, hogy ez megtörténhet, de valószínűleg észrevétlen marad.

---

A következő leckében ezt kibővítjük, hogy **folyamatvezérlést** hajtsunk végre távolról, vagyis a műhold viselkedésének megváltoztatását a kapott parancsok alapján.

[Kattints ide a következő leckéhez!](./lesson8)