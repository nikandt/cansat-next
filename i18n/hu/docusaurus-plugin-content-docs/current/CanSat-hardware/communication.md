---
sidebar_position: 3
---

# Kommunikáció és antennák

Ez a cikk bemutatja a vezeték nélküli adatátvitelhez szükséges kulcsfogalmakat a CanSat NeXT segítségével. Először a kommunikációs rendszert általános szinten tárgyaljuk, majd különböző lehetőségeket mutatunk be az antenna kiválasztására a CanSat NeXT használatakor. Végül a cikk utolsó része egy egyszerű útmutatót mutat be egy negyedhullámú monopól antenna építéséhez a készletben található alkatrészekből.

## Kezdés

A CanSat NeXT szinte készen áll a vezeték nélküli kommunikáció megkezdésére közvetlenül a dobozból. Csak a megfelelő szoftverre és egy antennára van szükség mind a jeladó, mind a vevő számára. Az elsőhöz tekintse meg az ezen az oldalon található szoftveranyagokat. Az utóbbihoz ez az oldal tartalmazza az utasításokat egy külső antenna kiválasztására, valamint egy egyszerű monopól antenna építésére a CanSat NeXT-hez mellékelt anyagokból.

Bár az áramkör elég ellenálló az ilyen dolgokkal szemben a szoftveres ellenőrzéseknek köszönhetően, soha ne próbáljon meg rádióból sugározni antenna nélkül. Bár valószínűtlen a rendszer alacsony teljesítménye miatt, a visszavert rádióhullám valódi kárt okozhat az elektronikában.

## CanSat NeXT kommunikációs rendszer

A CanSat NeXT kicsit másképp kezeli a vezeték nélküli adatátvitelt, mint a régebbi CanSat készletek. Külön rádiómodul helyett a CanSat NeXT az MCU integrált WiFi-rádióját használja a kommunikációhoz. A WiFi-rádiót általában adatok átvitelére használják egy ESP32 és az internet között, lehetővé téve az ESP32 egyszerű szerverként való használatát, vagy akár az ESP32 csatlakoztatását egy Bluetooth eszközhöz, de bizonyos ügyes TCP-IP konfigurációs trükkökkel lehetővé tehetjük az ESP32 eszközök közötti közvetlen peer-to-peer kommunikációt. A rendszert ESP-NOW-nak hívják, és az EspressIf fejleszti és tartja karban, akik az ESP32 hardver fejlesztői. Továbbá vannak speciális alacsony sebességű kommunikációs sémák, amelyek az energia-per-bit növelésével jelentősen növelik a wifi-rádió lehetséges hatótávolságát a szokásos néhány tíz méter felett.

Az ESP-NOW adatátviteli sebessége jelentősen gyorsabb, mint ami a régi rádióval lehetséges lenne. Még az egyszerűen a csomagok közötti idő csökkentésével is a példakódban, a CanSat NeXT képes ~20 teljes csomagot továbbítani a GS-hez egy másodperc alatt. Elméletileg az adatátviteli sebesség akár 250 kbit/s is lehet a hosszú hatótávolságú módban, de ezt nehéz elérni a szoftverben. Ennek ellenére például teljes képek átvitele egy kamerából a repülés során teljesen megvalósítható a megfelelő szoftverrel.

Még egyszerű negyedhullámú monopól antennákkal (egy 31 mm-es drótdarab) mindkét végén a CanSat NeXT képes volt adatokat küldeni a földi állomásra 1,3 km távolságból, ahol a látótávolság elveszett. Drónnal tesztelve a hatótávolság körülbelül 1 km-re korlátozódott. Lehetséges, hogy a drón eléggé zavarta a rádiót ahhoz, hogy némileg korlátozza a hatótávolságot. Azonban egy jobb antennával a hatótávolság még tovább növelhető. Egy kis yagi antenna elméletileg tízszeresére növelhette volna a működési hatótávolságot.

Van néhány gyakorlati részlet, amely eltér a régebbi rádiókommunikációs rendszertől. Először is, a műholdak és a földi állomás vevők "párosítása" a Media Access Control (MAC) címekkel történik, amelyeket a kódban állítanak be. A WiFi rendszer elég okos ahhoz, hogy a háttérben kezelje az időzítési, ütközési és frekvencia problémákat. A felhasználónak csak biztosítania kell, hogy a GS hallgatja azt a MAC címet, amellyel a műhold sugároz.
Másodszor, a rádió frekvenciája eltérő. A WiFi rádió a 2,4 GHz-es sávban működik (a középfrekvencia 2,445 GHz), ami azt jelenti, hogy mind a terjedési jellemzők, mind az antenna tervezési követelmények eltérőek, mint korábban. A jel valamivel érzékenyebb az esőre és a látótávolsági problémákra, és előfordulhat, hogy nem képes sugározni olyan esetekben, amikor a régi rendszer működött volna.

A rádiójel hullámhossza is eltérő. Mivel

$$\lambda = \frac{c}{f} \approx \frac{3*10^8 \text{ m/s}}{2.445 * 10^9 \text {Hz}} = 0.12261 \text{ m,}$$

egy negyed hullámhosszú monopól antennának 0,03065 m vagy 30,65 mm hosszúnak kell lennie. Ez a hossz a CanSat NeXT PCB-n is jelölve van, hogy megkönnyítse a kábel vágását. Az antennát pontosan kell vágni, de ~0,5 mm-en belül még mindig megfelelő.

Egy negyed hullámhosszú antenna elegendő RF teljesítményt nyújt a CanSat versenyekhez. Ennek ellenére érdekelheti néhány felhasználót, hogy még jobb hatótávolságot érjen el. Az egyik lehetséges javítási hely az a monopól antenna hossza. Gyakorlatban a negyed hullámhosszú rezonancia nem feltétlenül pontosan a megfelelő frekvencián van, mivel más paraméterek, mint például a környezet, a környező fém elemek vagy a földelt fémmel még mindig fedett drótrész befolyásolhatják a rezonanciát. Az antennát vektorhálózat-analizátor (VNA) használatával lehetne hangolni. Úgy gondolom, hogy ezt valamikor meg kellene tennem, és ennek megfelelően javítanom az anyagokat.

Egy robusztusabb megoldás egy másik stílusú antenna használata lenne. 2,4 GHz-en rengeteg érdekes antennaötlet található az interneten. Ezek közé tartozik a helix antenna, yagi antenna, pringles antenna és sok más. Ezek közül sok, ha jól van megépítve, könnyen felülmúlja az egyszerű monopólt. Még egy dipól is javulást jelentene egy egyszerű dróthoz képest.

A legtöbb ESP32 modulon használt csatlakozó egy Hirose U.FL csatlakozó. Ez egy jó minőségű miniatűr RF csatlakozó, amely jó RF teljesítményt nyújt gyenge jelek esetén. Az egyik probléma ezzel a csatlakozóval azonban az, hogy a kábel elég vékony, ami néha kicsit gyakorlatlan. Ez nagyobb RF veszteségekhez is vezethet, ha a kábel hosszú, mint például külső antenna használatakor. Ilyen esetekben U.FL-SMA adapter kábel használható. Megnézem, hogy tudnánk-e biztosítani ezeket a webshopunkban. Ez lehetővé tenné a csapatok számára, hogy ismertebb SMA csatlakozót használjanak. Ennek ellenére teljesen lehetséges jó antennákat építeni csak U.FL használatával.

Az SMA-val ellentétben azonban az U.FL mechanikailag a bepattanó rögzítő elemekre támaszkodik, hogy a csatlakozót a helyén tartsa. Ez általában elegendő, azonban extra biztonság érdekében jó ötlet egy kábelkötegelőt hozzáadni extra biztonság érdekében. A CanSat NeXT PCB-n vannak nyílások az antenna csatlakozó mellett, hogy elférjen egy kis kábelkötegelő. Ideális esetben egy 3D-nyomtatott vagy más módon elkészített támogató hüvelyt kellene hozzáadni a kábelhez a kábelkötegelő előtt. A 3D-nyomtatott támogatás fájlja elérhető a GitHub oldalról.

## Antenna lehetőségek

Az antenna lényegében egy eszköz, amely az irányítatlan elektromágneses hullámokat irányítottá alakítja, és fordítva. Az eszköz egyszerű természete miatt számos lehetőség közül választhatja ki az eszközéhez megfelelő antennát. Gyakorlati szempontból az antenna kiválasztása sok szabadságot biztosít, és sok szempontot kell figyelembe venni. Legalább a következőket kell figyelembe venni:

1. Az antenna működési frekvenciája (tartalmaznia kell a 2,45 GHz-et)
2. Az antenna sávszélessége (legalább 35 MHz)
3. Az antenna impedanciája (50 ohm)
4. Csatlakozó (U.FL vagy használhat adaptereket)
5. Fizikai méret (Belefér-e a dobozba)
6. Költség
7. Gyártási módszerek, ha saját maga készíti az antennát.
8. Az antenna polarizációja.

Az antenna kiválasztása túlterhelőnek tűnhet, és gyakran az is, azonban ebben az esetben sokkal könnyebbé válik az a tény, hogy valójában Wi-Fi-rádiót használunk - szinte bármilyen 2,4 GHz-es Wi-Fi antennát használhatunk a rendszerrel. A legtöbbjük azonban túl nagy, és általában RP-SMA csatlakozókat használnak, nem pedig U.FL-t. Azonban megfelelő adapterrel jó választások lehetnek a földi állomás használatához. Vannak még irányított antennák is, ami azt jelenti, hogy extra nyereséget kaphat a rádiókapcsolat javításához.

A Wi-Fi antennák szilárd választás, azonban van egy jelentős hátrányuk - a polarizáció. Szinte mindig lineárisan polarizáltak, ami azt jelenti, hogy a jel erőssége jelentősen változik a jeladó és a vevő tájolásától függően. A legrosszabb esetekben, amikor az antennák merőlegesek egymásra, a jel akár teljesen el is tűnhet. Ezért egy alternatív lehetőség a drón antennák használata, amelyek általában körkörösen polarizáltak. Gyakorlatban ez azt jelenti, hogy van némi állandó polarizációs veszteség, de ezek kevésbé drámaiak. Egy alternatív ügyes megoldás a polarizációs probléma megkerülésére két vevő használata, az antennákat egymásra merőlegesen szerelve. Így legalább az egyik mindig megfelelő tájolásban lesz a jel fogadásához.

Természetesen egy igazi készítő mindig saját antennát akar készíteni. Néhány érdekes konstrukció, amely alkalmas DIY-gyártásra, magában foglalja a helix-antennát, "pringles" antennát, yagi, dipól vagy monopól antennát. Az interneten sok utasítás található a legtöbbjük építéséhez. A cikk utolsó része bemutatja, hogyan készíthet saját monopól antennát, amely alkalmas a CanSat versenyekre, a CanSat NeXT-hez mellékelt anyagokból.

## Negyedhullámú monopól antenna építése

A cikk ezen része leírja, hogyan építhetünk egy ésszerűen hatékony negyedhullámú monopól antennát a készletben található anyagokból. Az antennát így hívják, mivel csak egy pólusa van (összehasonlítva egy dipóllal), és hossza a sugárzott hullámhossz negyede.

A koaxiális kábel és a zsugorcső darab mellett szüksége lesz valamilyen huzalcsupaszítóra és huzalvágóra. Szinte bármilyen típus működni fog. Ezenkívül szüksége lesz egy hőforrásra a zsugorcsőhöz, például hőlégfúvóra, forrasztópákára vagy akár öngyújtóra.

![Eszközök a negyedhullámú antenna készítéséhez](./img/qw_1.png)

Először vágja el a kábelt nagyjából félbe.

![Kábel félbevágva](./img/qw_2.png)

Ezután építjük meg a tényleges antennát. Ezt a részt a lehető legpontosabban kell elvégezni. Körülbelül 0,2 mm-en belül megfelelő lesz, de próbálja meg a lehető legközelebb a helyes hosszhoz, mivel ez segít a teljesítményben.

A koaxiális kábel négy részből áll - egy központi vezetőből, dielektrikumból, árnyékolásból és egy külső burkolatból. Általában ezeket a kábeleket rádiófrekvenciás jelek továbbítására használják az eszközök között, így a központi vezetőn lévő áramok kiegyenlítődnek az árnyékolásban lévőkkel. Azonban az árnyékoló vezető eltávolításával a belső vezetőn lévő áramok antennát hoznak létre. Az expozíciós terület hossza határozza meg az antenna hullámhosszát vagy működési frekvenciáját, és most azt akarjuk, hogy megfeleljen a 2,445 GHz-es működési frekvenciánknak, ezért el kell távolítanunk az árnyékolást 30,65 mm hosszúságban.

![Koaxiális kábel szerkezete](./img/qw_3.png)

Óvatosan csupaszítsa le a kábel külső burkolatát. Ideális esetben próbálja meg csak a burkolatot és az árnyékolást eltávolítani a kívánt hosszúságból. Azonban az szigetelő vágása nem katasztrófa. Általában könnyebb a külső burkolatot részenként eltávolítani, mint egyszerre. Továbbá, könnyebb lehet először túl sokat eltávolítani, majd a belső vezetőt a megfelelő hosszúságra vágni, mint megpróbálni azonnal pontosan eltalálni.

Az alábbi kép a csupaszított kábeleket mutatja. Próbálja meg úgy készíteni, mint a felső, de az alsó is működni fog - csak érzékenyebb lehet a nedvességre. Ha maradtak lógó árnyékoló darabok, óvatosan vágja le őket. Győződjön meg róla, hogy nincs lehetőség arra, hogy a belső vezető és az árnyékolás érintkezzenek egymással - még egyetlen szál is használhatatlanná tenné az antennát.

![Csupaszított kábelek](./img/qw_4.png)

Az antenna most már teljesen működőképes, azonban érzékeny lehet a nedvességre. Ezért most új burkolatot szeretnénk hozzáadni, amihez a zsugorcső szolgál. Vágjon két darabot, amelyek kissé hosszabbak, mint az elkészített antenna, és helyezze az antennára, majd használjon hőforrást, hogy zsugorítsa a helyére. Ügyeljen arra, hogy ne égesse meg a zsugorcsövet, különösen, ha nem hőlégfúvót használ.

![Kész antennák](./img/qw_5.png)

Ezek után az antennák készen állnak. A földi állomás oldalán az antenna valószínűleg így is rendben van. Másrészt, bár a csatlakozó meglehetősen biztonságos, jó ötlet valahogy megtámasztani a csatlakozót a CanSat oldalán. Egy nagyon robusztus módja ennek egy 3D-nyomtatott támasz és néhány kábelkötegelő használata, azonban sok más módszer is működni fog. Ne feledje azt is figyelembe venni, hogyan lesz az antenna elhelyezve a dobozban. Ideális esetben olyan helyen kell lennie, ahol az átvitel nincs blokkolva semmilyen fém alkatrész által.

![Antenna rögzítve 3D-nyomtatott támasztékkal](./img/qw_6.png)

### Antenna támasz

Végül itt van a képen látható támasz step-fájlja. Importálhatja ezt a legtöbb CAD szoftverbe, és módosíthatja, vagy kinyomtathatja 3D-nyomtatóval.

[Step-fájl letöltése](/assets/3d-files/uFl-support.step)