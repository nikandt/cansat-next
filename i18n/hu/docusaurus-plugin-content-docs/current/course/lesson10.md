---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 10. lecke: Oszd meg és uralkodj

Ahogy projektjeink részletesebbé válnak, a kód kezelése nehézzé válhat, hacsak nem vagyunk óvatosak. Ebben a leckében megvizsgálunk néhány gyakorlatot, amelyek segítenek a nagyobb projektek kezelhetővé tételében. Ezek közé tartozik a kód több fájlra való bontása, a függőségek kezelése, és végül a verziókezelés bevezetése a változások nyomon követésére, a kód biztonsági mentésére és az együttműködés elősegítésére.

## Kód felosztása több fájlra

Kis projektek esetén úgy tűnhet, hogy minden forráskód egy fájlban van, de ahogy a projekt növekszik, a dolgok zavarossá és nehezen kezelhetővé válhatnak. Jó gyakorlat a kód különböző fájlokra bontása a funkcionalitás alapján. Ha jól csináljuk, ez szép kis modulokat is eredményez, amelyeket újra felhasználhatunk különböző projektekben anélkül, hogy felesleges összetevőket vezetnénk be más projektekbe. A több fájl egyik nagy előnye az is, hogy megkönnyíti az együttműködést, mivel mások dolgozhatnak más fájlokon, segítve elkerülni azokat a helyzeteket, amikor a kód nehezen egyesíthető.

A következő szöveg feltételezi, hogy az Arduino IDE 2-t használod. A haladó felhasználók otthonosabban érezhetik magukat olyan rendszerekkel, mint a [Platformio](https://platformio.org/), de azok, akik már ismerik ezeket a fogalmakat.

Az Arduino IDE 2-ben a projekt mappájában található összes fájl fülként jelenik meg az IDE-ben. Új fájlokat közvetlenül az IDE-ben vagy az operációs rendszereden keresztül hozhatsz létre. Három különböző típusú fájl létezik: **fejlécek** `.h`, **forrásfájlok** `.cpp`, és **Arduino fájlok** `.ino`.

E három közül az Arduino fájlok a legkönnyebben érthetők. Egyszerűen extra fájlok, amelyeket a fő `.ino` szkript végére másolnak a fordítás során. Így könnyen használhatók érthetőbb kódstruktúrák létrehozására, és annyi helyet foglalhatnak el, amennyire szükség van egy bonyolult funkcióhoz anélkül, hogy a forrásfájl olvashatatlanná válna. A legjobb megközelítés általában az, hogy egy funkcionalitást egy fájlban valósítunk meg. Így például külön fájl lehet minden üzemmódhoz, egy fájl az adatátvitelhez, egy fájl a parancsértelmezéshez, egy fájl az adattároláshoz, és egy fő fájl, ahol mindezt egy működő szkriptté kombináljuk.

A fejlécek és forrásfájlok kicsit specializáltabbak, de szerencsére ugyanúgy működnek, mint máshol a C++-ban, így sok anyag íródott a használatukról, például [itt](https://www.learncpp.com/cpp-tutorial/header-files/).

## Példa struktúra

Példaként vegyük a [8. leckéből](./lesson8.md) származó rendezetlen kódot, és refaktoráljuk.

<details>
  <summary>Eredeti rendezetlen kód a 8. leckéből</summary>
  <p>Itt van az egész kód a frusztrációdhoz.</p>
```Cpp title="Műhold több állapottal"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // ismeretlen mód
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Várakozás...");
  sendData("Várakozás...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Ez még nem is olyan rossz, de láthatod, hogy mennyire nehéz lenne olvasni, ha kibővítenénk a funkcionalitásokat vagy új parancsokat adnánk hozzá. Ehelyett osszuk fel ezt szép különálló kódfájlokra a különböző funkcionalitások alapján.

Minden üzemmódot külön fájlba választottam szét, hozzáadtam egy fájlt a parancsértelmezéshez, és végül készítettem egy kis segédfájlt, amely tartalmazza azokat a funkciókat, amelyekre sok helyen szükség van. Ez egy elég tipikus egyszerű projektstruktúra, de máris sokkal könnyebben érthetővé teszi a programot. Ezt tovább segítheti a jó dokumentáció, és például egy grafikon készítése, amely megmutatja, hogyan kapcsolódnak egymáshoz a fájlok.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Fő vázlat"
#include "CanSatNeXT.h"

int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Indítás előtti mód"
void preLaunch() {
  Serial.println("Várakozás...");
  sendData("Várakozás...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Repülési mód"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Helyreállítási mód"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Parancsértelmezés"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Segédeszközök"
bool LED_IS_ON = false;

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```
  </TabItem>

</Tabs>

Bár ez a megközelítés már mérföldekkel jobb, mint egyetlen fájlban tartani mindent, még mindig gondos kezelést igényel. Például a **névtér** megosztott a különböző fájlok között, ami zavart okozhat egy nagyobb projektben vagy a kód újrafelhasználásakor. Ha vannak azonos nevű függvények vagy változók, a kód nem tudja, melyiket használja, ami konfliktusokhoz vagy váratlan viselkedéshez vezethet.

Ezenkívül ez a megközelítés nem alkalmas a **kapszulázásra**—ami kulcsfontosságú a modulárisabb és újrafelhasználhatóbb kód építéséhez. Amikor a függvényeid és változóid mind ugyanabban a globális térben léteznek, nehezebb megakadályozni, hogy a kód egyik része véletlenül befolyásolja a másikat. Itt jönnek képbe a fejlettebb technikák, mint a névterek, osztályok és az objektumorientált programozás (OOP). Ezek kívül esnek ennek a kurzusnak a keretein, de egyéni kutatás ezekben a témákban ajánlott.

:::tip[Feladat]

Vedd elő egyik korábbi projektedet, és adj neki egy átalakítást! Oszd fel a kódodat több fájlra, és szervezd a függvényeidet a szerepük alapján (pl. szenzorkezelés, adatkezelés, kommunikáció). Nézd meg, mennyivel tisztábbá és könnyebben kezelhetővé válik a projekted!

:::

## Verziókezelés

Ahogy a projektek növekednek — és különösen, ha több ember dolgozik rajtuk — könnyű elveszíteni a változások nyomon követését vagy véletlenül felülírni (vagy újraírni) a kódot. Itt jön képbe a **verziókezelés**. A **Git** az iparági szabvány verziókezelő eszköz, amely segít nyomon követni a változásokat, kezelni a verziókat, és megszervezni a nagy projekteket több együttműködővel.

A Git megtanulása ijesztőnek és akár feleslegesnek is tűnhet kis projektek esetén, de ígérem, hálás leszel magadnak, hogy megtanultad. Később azon fogsz csodálkozni, hogyan boldogultál nélküle!

Itt egy remek hely a kezdéshez: [Git használatának kezdete](https://docs.github.com/en/get-started/getting-started-with-git).

Számos Git szolgáltatás érhető el, a népszerűek közé tartozik:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

A GitHub jó választás a népszerűsége és a rendelkezésre álló támogatás bősége miatt. Valójában ez a weboldal és a [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) könyvtárak is a GitHubon vannak tárolva.

A Git nemcsak kényelmes — elengedhetetlen készség bárki számára, aki professzionálisan dolgozik mérnöki vagy tudományos területen. A legtöbb csapat, amelynek része leszel, a Git-et fogja használni, ezért érdemes megszokni a használatát.

További Git oktatóanyagok:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)

:::tip[Feladat]

Állíts be egy Git tárolót a CanSat projektedhez, és töltsd fel a kódodat az új tárolóba. Ez segít szervezetten és együttműködően fejleszteni a szoftvert mind a műhold, mind a földi állomás számára.

:::

---

A következő leckében különféle módokat fogunk megvitatni, hogyan bővíthetjük a CanSat-ot külső érzékelőkkel és más eszközökkel.

[Kattints ide a következő leckéhez!](./lesson11)