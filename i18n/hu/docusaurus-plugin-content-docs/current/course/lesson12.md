---
sidebar_position: 13
---

# 12. lecke: Készen állunk a kilövésre?

Ebben az utolsó leckében arról fogunk beszélni, hogyan készítsük fel a műholdat, a földi állomást és a csapatot a kilövésre. Ezen lecke után lesz egy *áttekintés* is, hogy ellenőrizzük a repülési készenlétet, de ez a lecke a sikeres küldetés esélyeinek maximalizálására összpontosít. Ebben a leckében beszélünk az elektronika mechanikai és elektromos előkészítéséről, a rádiókommunikációs rendszer ellenőrzéséről, és végül néhány hasznos előkészületi lépésről, amelyeket jóval a tényleges kilövési esemény előtt el kell végezni.

Ez a lecke ismét egy kicsit más, mivel nem új programozási fogalmakat vizsgálunk, hanem arról beszélünk, hogyan javíthatjuk az eszköz megbízhatóságát a küldetés során. Továbbá, bár valószínűleg még nem fejezted be a műhold küldetésének építését (vagy meghatározását), ha most először végzed a kurzust, jó, ha átolvasod az ezen az oldalon található anyagokat, figyelembe veszed ezeket a szempontokat az eszköz és a küldetés tervezésekor, és visszatérsz hozzájuk, amikor ténylegesen készülsz a kilövésre.

## Mechanikai szempontok

Először is, mint ahogy az előző leckében is tárgyaltuk, az elektronikai **verem** úgy kell legyen felépítve, hogy még erős rezgés és ütés esetén is egyben maradjon. Az elektronika tervezésének jó módja a perf boardok használata, amelyeket [távtartók](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) tartanak össze, és elektromosan csatlakoznak vagy csatlakozókon keresztül, vagy jól támogatott kábellel. Végül az egész elektronikai veremnek úgy kell a műhold keretéhez rögzítve lennie, hogy ne mozogjon. A csavarokkal való merev rögzítés mindig egy biztos választás (szójáték szándékos), de ez nem az egyetlen lehetőség. Egy alternatíva lehet a rendszer úgy tervezése, hogy ütközéskor törjön, hasonlóan egy [gyűrődési zónához](https://en.wikipedia.org/wiki/Crumple_zone). Alternatív megoldásként egy párnázott rögzítési rendszer gumival, habbal vagy hasonló rendszerrel csökkentheti az elektronikát érő terheléseket, segítve a többcélú rendszerek létrehozását.

Egy tipikus CanSat esetében vannak olyan elemek, amelyek különösen érzékenyek a kilövés vagy a vártnál gyorsabb leszállás során fellépő problémákra. Ezek az akkumulátorok, az SD kártya és az antenna.

### Az akkumulátorok rögzítése

A CanSat NeXT esetében a lap úgy van tervezve, hogy egy kábelkötegelő rögzíthető legyen a lap köré, hogy biztosítsa az akkumulátorok helyben tartását rezgés esetén. Ellenkező esetben hajlamosak kicsúszni a foglalatokból. Egy másik aggodalom az akkumulátorokkal kapcsolatban, hogy egyes akkumulátorok rövidebbek, mint ami ideális lenne az akkumulátortartóhoz, és lehetséges, hogy egy különösen nagy ütés esetén az akkumulátor érintkezők az akkumulátorok súlya alatt meghajlanak, így az érintkezés megszakad. Ennek enyhítésére az érintkezőket támogathatjuk egy darab kábelkötegelő, hab vagy más töltőanyag hozzáadásával a rugós érintkezők mögé. Véletlen (és szándékos) ejtési tesztek során ez javította a megbízhatóságot, bár a jól megépített CanSatokba integrált CanSat NeXT-ek ejtési teszteket is túlélték akár 1000 méterről (ejtőernyő nélkül) még ezek a védelmi intézkedések nélkül is. Az akkumulátorok támogatásának még jobb módja az, ha közvetlenül a CanSat keretébe tervezünk egy tartószerkezetet, így az ütközéskor az akkumulátorok súlyát az akkumulátortartó helyett az veszi át.

![CanSat kábelkötegelővel](./img/cansat_with_ziptie.png)

### Az antennakábel rögzítése

Az antenna csatlakozója U.Fl, amely egy autóipari minősítésű csatlakozótípus. Jól kezelik a rezgést és az ütést annak ellenére, hogy nincsenek külső mechanikai támaszok. Azonban a megbízhatóság javítható az antenna kis kábelkötegelőkkel történő rögzítésével. A CanSat NeXT lapnak kis nyílásai vannak az antenna mellett erre a célra. Az antenna semleges helyzetben tartásához egy [támaszték nyomtatható](../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) hozzá.

![3D-nyomtatott támasztékkal rögzített antenna](../CanSat-hardware/img/qw_6.png)

### Az SD kártya rögzítése

Az SD kártya kiugorhat a tartóból nagy ütések esetén. Ismételten, a lapok túlélték az ejtéseket és a repüléseket, de a megbízhatóság javítható az SD kártya ragasztásával vagy ragasztásával a tartóhoz. Az újabb CanSat NeXT lapok (≥1.02) magas biztonságú SD kártya tartókkal vannak felszerelve, hogy tovább enyhítsék ezt a problémát.

## Kommunikációs teszt

Az egyik legfontosabb részlet a sikeres küldetéshez, hogy megbízható rádiókapcsolat legyen. További információ az antennák kiválasztásáról és/vagy építéséről a dokumentáció [hardver szekciójában](../CanSat-hardware/communication#antenna-options) található. Azonban, függetlenül a kiválasztott antennától, a tesztelés minden rádiórendszer fontos része.

A megfelelő antenna tesztelése bonyolult lehet, és speciális felszerelést igényel, mint például [VNA-k](https://en.wikipedia.org/wiki/Network_analyzer_(electrical)), de közvetlenül a CanSat NeXT készlettel is végezhetünk funkcionális tesztet.

Először programozd be a műholdat, hogy adatokat küldjön, például egy adatolvasást másodpercenként egyszer. Ezután programozd be a földi állomást, hogy fogadja az adatokat, és nyomtassa ki az **RSSI** (Received signal strength indicator) értékeket, ahogy azt a `getRSSI()` függvény adja, amely a CanSat NeXT könyvtár része.

```Cpp title="Read RSSI"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI: ");
  Serial.println(rssi);
}
```

Ez az érték azt az aktuális elektromos **teljesítményt** képviseli, amelyet a földi állomás az antennáján keresztül kap, amikor üzenetet fogad. Az érték [decibelmilliwatts](https://en.wikipedia.org/wiki/DBm) formában van kifejezve. Egy tipikus olvasás működő antennával mindkét végén, amikor az eszközök ugyanazon az asztalon vannak, -30 dBm (1000 nanowatt), és gyorsan csökken, amikor a távolság növekszik. Szabad térben nagyjából az inverz négyzetes törvényt követi, de nem pontosan a visszaverődések, fresnel zónák és más tökéletlenségek miatt. Az alapértelmezett CanSat NeXT rádióbeállításokkal az RSSI nagyjából -100 dBm-ig (0.1 pikowatt) csökkenthető, és még mindig átjut némi adat.

Ez általában körülbelül egy kilométeres távolságnak felel meg, amikor a monopól antennákat használják, de sokkal több is lehet, ha a földi állomás antennájának jelentős [nyeresége](https://en.wikipedia.org/wiki/Gain_(antenna)) van, ami közvetlenül hozzáadódik a dBm olvasathoz.

## Teljesítmény tesztek

Jó ötlet megmérni a műhold áramfelvételét egy multiméterrel. Ez is egyszerű, csak távolíts el egy akkumulátort, és tartsd manuálisan úgy, hogy a multiméter árammérését használva csatlakoztathasd az akkumulátor egyik végét és az akkumulátor érintkezőt. Ez az olvasás 130-200 mA nagyságrendű kell legyen, ha a CanSat NeXT rádió aktív, és nincsenek külső eszközök. Az áramfelvétel nő, ahogy az akkumulátorok lemerülnek, mivel több áram szükséges a feszültség 3.3 volton tartásához a csökkenő akkumulátor feszültségből.

A tipikus AAA akkumulátorok kapacitása körülbelül 1200 mAh, ami azt jelenti, hogy az eszköz áramfelvétele kevesebb, mint 300 mA kell legyen, hogy biztosítsa, hogy az akkumulátorok a teljes küldetés alatt kitartanak. Ezért is jó ötlet több üzemmódot is használni, ha az eszközön áramigényes eszközök vannak, mivel ezek közvetlenül a repülés előtt bekapcsolhatók, hogy biztosítsák a jó akkumulátor élettartamot.

Bár a matematikai megközelítés az akkumulátor élettartamának becslésére jó kezdet, mégis a legjobb az akkumulátor élettartamának tényleges mérése friss akkumulátorok beszerzésével és egy szimulált küldetés végrehajtásával.

## Repüléstechnikai tesztelés

A repüléstechnikai iparban minden műhold szigorú tesztelésen megy keresztül, hogy biztosítsák, hogy túlélje a kilövés, az űr és néha a visszatérés zord körülményeit. Bár a CanSatok kissé eltérő környezetben működnek, mégis alkalmazhatnál néhány ilyen tesztet a megbízhatóság javítására. Az alábbiakban néhány gyakori repüléstechnikai teszt található, amelyeket CubeSatok és kis műholdak esetében használnak, valamint ötletek arra, hogyan valósíthatnál meg hasonló tesztelést a CanSatod számára.

### Rezgés tesztelés

A rezgés tesztet a kis műhold rendszerekben két okból használják. Az elsődleges ok az, hogy a teszt célja a szerkezet rezonáló frekvenciáinak azonosítása, hogy biztosítsák, hogy a rakéta rezgése ne kezdjen rezonálni a műhold bármely szerkezetében, ami a műhold rendszereinek meghibásodásához vezethet. A másodlagos ok szintén releváns a CanSat rendszerek számára, amely a kézművesség minőségének megerősítése és annak biztosítása, hogy a rendszer túlélje a rakéta kilövését. A műhold rezgés tesztelése speciális rezgés tesztpadokkal történik, de a hatás kreatívabb megoldásokkal is szimulálható. Próbálj meg kitalálni egy módot, hogy igazán megrázd a műholdat (vagy lehetőleg annak tartalékát), és nézd meg, hogy valami eltörik-e. Hogyan lehetne javítani?

### Ütés teszt

A rezgés tesztek unokatestvére, az ütés tesztek a rakéta kilövés során bekövetkező robbanásszerű szakasz elválasztást szimulálják. Az ütés gyorsulás akár 100 G is lehet, ami könnyen tönkreteheti a rendszereket. Ezt ejtési teszttel lehetne szimulálni, de gondold át, hogyan lehetne biztonságosan megtenni, hogy a műhold, te vagy a padló ne törjön el.

### Hőmérsékleti tesztelés

A hőmérsékleti tesztelés magában foglalja az egész műhold kitettségét a tervezett működési tartomány szélsőségeinek, és gyorsan mozogva ezek között a hőmérsékletek között. CanSat kontextusban ez jelentheti a műhold tesztelését egy fagyasztóban, egy hideg napon történő kilövés szimulálásával, vagy egy enyhén fűtött sütőben, hogy szimulálja egy forró kilövési napot. Ügyelj arra, hogy az elektronika, a műanyagok vagy a bőröd ne legyen közvetlenül kitéve szélsőséges hőmérsékleteknek.

## Általános jó ötletek

Itt van néhány további tipp, hogy segítsenek biztosítani a sikeres küldetést. Ezek a technikai előkészületektől a szervezeti gyakorlatokig terjednek, amelyek javítják a CanSat általános megbízhatóságát. Nyugodtan javasolj új ötleteket, amelyeket itt hozzáadhatunk a szokásos csatornán keresztül (samuli@kitsat.fi).

- Fontold meg egy ellenőrző lista készítését, hogy elkerüld, hogy valamit elfelejts közvetlenül a kilövés előtt
- Teszteld az egész repülési szekvenciát előre egy szimulált repülés során
- Teszteld a műholdat hasonló környezeti feltételek között is, mint amilyenek a repülés során várhatók. Biztosítsd, hogy az ejtőernyő is rendben van a várható hőmérsékletekkel.
- Legyen tartalék akkumulátor, és gondold át, hogyan lehet őket szükség esetén telepíteni
- Legyen tartalék SD kártya, néha meghibásodnak
- Legyen tartalék számítógép, és tiltsd le a frissítéseket a számítógépen a kilövés előtt.
- Legyen tartalék kábelkötegelő, csavarok és bármi más, amire szükséged van a műhold összeszereléséhez
- Legyen néhány alapvető eszköz kéznél, hogy segítsen a szétszerelésben és összeszerelésben
- Legyen extra antenna
- Több földi állomás is működhet egyszerre, amelyeket a műhold háromszögelésére is használhatunk, különösen, ha van RSSI elérhető.
- Legyenek világos szerepek minden csapattag számára a kilövés, a műveletek és a visszaszerzés során.

---

Ezek a leckék most véget értek. A következő oldalon egy repülési készenléti áttekintés található, amely egy gyakorlat, amely segít a sikeres küldetések biztosításában.

[Kattints ide a repülési készenléti áttekintéshez!](./review2)