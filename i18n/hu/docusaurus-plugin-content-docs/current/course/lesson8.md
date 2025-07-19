---
sidebar_position: 9
---

# 8. lecke: Áramlásirányítás

A lecke témája az áramlásirányítás, vagyis az, hogyan kezelhetjük, hogy a processzor mit csinál különböző időpontokban. Eddig a legtöbb programunk egyetlen feladatra összpontosított, ami bár egyszerű, korlátozza a rendszer lehetőségeit. Ha különböző **állapotokat** vezetünk be a programunkba, kibővíthetjük annak képességeit.

Például a programnak lehet egy előindítási állapota, ahol a műhold a kilövésre vár. Ezután átválthat repülési módba, ahol érzékelő adatokat olvas és végrehajtja fő küldetését. Végül aktiválódhat egy visszanyerési mód, amelyben a műhold jeleket küld a visszanyerés segítésére - villogó fények, sípolás vagy bármilyen rendszerintézkedés, amit terveztünk.

Az állapotok közötti váltás **kiváltója** változó lehet. Lehet egy érzékelő leolvasás, mint például egy nyomásváltozás, egy külső parancs, egy belső esemény (például egy időzítő), vagy akár egy véletlenszerű esemény, attól függően, hogy mi szükséges. Ebben a leckében az előzőekben tanultakat fogjuk továbbfejleszteni azzal, hogy egy külső parancsot használunk kiváltóként.

## Áramlásirányítás külső kiváltókkal

Először módosítsuk a földi állomás kódját, hogy képes legyen üzeneteket fogadni a Soros monitorról, így szükség esetén egyedi parancsokat küldhetünk.

Amint látható, a változások csak a fő ciklusban vannak. Először ellenőrizzük, hogy érkezett-e adat a Soros porton. Ha nem, semmi nem történik, és a ciklus folytatódik. Ha azonban van adat, azt egy változóba olvassuk be, tisztázásképpen kiírjuk, majd rádión keresztül elküldjük a műholdnak. Ha még mindig a korábbi lecke programja van feltöltve a műholdra, kipróbálhatja.

```Cpp title="Földi állomás, amely képes parancsokat küldeni"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Soros bemenet - Adatforrások

Amikor adatokat olvasunk a `Serial` objektumból, a UART RX pufferben tárolt adatokat érjük el, amelyeket az USB Virtuális Soros kapcsolaton keresztül továbbítanak. Gyakorlatilag ez azt jelenti, hogy bármilyen szoftver, amely képes kommunikálni egy virtuális soros porton keresztül, mint például az Arduino IDE, terminál programok vagy különböző programozási környezetek, használható adatok küldésére a CanSat felé.

Ez számos lehetőséget nyit meg a CanSat külső programokkal történő vezérlésére. Például parancsokat küldhetünk manuálisan begépelve, de írhatunk szkripteket Pythonban vagy más nyelveken is a parancsok automatizálására, lehetővé téve fejlettebb vezérlőrendszerek létrehozását. Ezeket az eszközöket kihasználva pontos utasításokat küldhetünk, teszteket futtathatunk, vagy valós időben figyelhetjük a CanSat működését manuális beavatkozás nélkül.

:::

Most nézzük meg a műhold oldalát. Mivel több állapot van a programban, egy kicsit hosszabb lesz, de bontsuk le lépésről lépésre.

Először a szokásos módon inicializáljuk a rendszereket. Van néhány globális változó is, amelyeket a fájl tetejére helyezünk, hogy könnyen látható legyen, milyen neveket használunk. Az `LED_IS_ON` ismerős az előző kódpéldákból, és van egy globális állapotváltozónk is, `STATE`, amely tárolja az... nos, az állapotot.

```Cpp title="Inicializálás"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Ezután a ciklusban egyszerűen ellenőrizzük, melyik alprogramot kell végrehajtani az aktuális állapot szerint, és meghívjuk annak függvényét:

```Cpp title="Ciklus"
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
```

Ebben az esetben minden állapotot egy külön függvény képvisel, amelyet az állapot alapján hívunk meg. A függvények tartalma itt nem igazán fontos, de itt vannak:

```Cpp title="Alprogramok"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
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
```

Van egy kis segédfüggvény is, `blinkLED`, amely segít elkerülni a kódismétlést azáltal, hogy kezeli az LED kapcsolását.

Végül az állapot megváltozik, amikor a földi állomás ezt mondja:

```Cpp title="Parancs fogadása visszahívás"
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

<details>
  <summary>Teljes kód</summary>
  <p>Itt van a teljes kód a kényelmed érdekében.</p>
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
  Serial.println("Waiting...");
  sendData("Waiting...");
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

Ezzel most már anélkül irányíthatjuk, hogy a műhold mit csinál, hogy fizikailag hozzáférnénk. Ehelyett csak küldhetünk egy parancsot a földi állomással, és a műhold azt teszi, amit akarunk.

:::tip[Feladat]

Hozz létre egy programot, amely egy érzékelőt mér egy adott gyakorisággal, amelyet távoli paranccsal bármilyen értékre meg lehet változtatni. Az alprogramok használata helyett próbáld meg közvetlenül egy késleltetési értéket módosítani egy paranccsal.

Próbáld meg azt is elérni, hogy tolerálja a váratlan bemeneteket, mint például "-1", "ABCDFEG" vagy "".

Bónusz feladatként tedd az új beállítást állandóvá a visszaállítások között, hogy amikor a műholdat kikapcsolják és újra bekapcsolják, az új gyakorisággal folytassa az adást, ahelyett, hogy visszatérne az eredetihez. Tippként érdemes lehet újra átnézni az [5. leckét](./lesson5.md).

:::

---

A következő leckében az adataink tárolását, kommunikációját és kezelését jelentősen hatékonyabbá, gyorsabbá tesszük bináris adatok használatával. Bár először elvontnak tűnhet, a bináris adatok számok helyett történő kezelése sok feladatot leegyszerűsít, mivel ez a számítógép natív nyelve.

[Kattints ide a következő leckéhez!](./lesson9)