---
sidebar_position: 4
---

# 4. lecke: Az ellenállás nem hiábavaló

Eddig a digitális érzékelő eszközök használatára összpontosítottunk, hogy közvetlenül SI mértékegységekben kapjunk értékeket. Azonban az elektromos eszközök általában közvetett módon végzik a mérést, és az átváltás a kívánt mértékegységekre ezután történik. Ezt korábban maguk az érzékelő eszközök (és a CanSat NeXT könyvtár) végezték, de sok általunk használt érzékelő sokkal egyszerűbb. Az analóg érzékelők egyik típusa az ellenállásos érzékelők, ahol az érzékelő elem ellenállása változik bizonyos jelenségek hatására. Az ellenállásos érzékelők számos mennyiség mérésére léteznek - beleértve az erőt, hőmérsékletet, fényintenzitást, kémiai koncentrációkat, pH-t és sok mást.

Ebben a leckében a CanSat NeXT táblán található fényérzékeny ellenállást (LDR) fogjuk használni a környező fényintenzitás mérésére. Míg a termisztor hasonló módon használható, az egy későbbi lecke tárgya lesz. Ugyanazok a készségek közvetlenül alkalmazhatók az LDR és a termisztor használatára, valamint sok más ellenállásos érzékelőre is.

![LDR helye a táblán](./../CanSat-hardware/img/LDR.png)

## Az ellenállásos érzékelők fizikája

Ahelyett, hogy közvetlenül a szoftverre térnénk, lépjünk egy lépést hátra, és beszéljük meg, hogyan működik általában egy ellenállásos érzékelő leolvasása. Vegyük figyelembe az alábbi kapcsolási rajzot. Az LDR_EN feszültsége 3,3 volt (a processzor üzemi feszültsége), és két ellenállás van sorosan bekötve az útjában. Az egyik ezek közül az **LDR** (R402), míg a másik egy **referencia ellenállás** (R402). A referencia ellenállás ellenállása 10 kilo-ohm, míg az LDR ellenállása 5-300 kilo-ohm között változik a fényviszonyoktól függően.

![LDR kapcsolási rajz](./img/LDR.png)

Mivel az ellenállások sorosan vannak bekötve, a teljes ellenállás

$$
R = R_{401} + R_{LDR},
$$

és az ellenállásokon átfolyó áram

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

ahol $V_{OP}$ az MCU üzemi feszültsége. Ne feledjük, hogy az áramnak ugyanannak kell lennie mindkét ellenálláson keresztül. Ezért az LDR feszültségesését kiszámíthatjuk az alábbiak szerint:

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

És ez a feszültségesés az LDR feszültsége, amelyet analóg-digitális átalakítóval mérhetünk. Általában ez a feszültség közvetlenül korrelálható vagy kalibrálható, hogy megfeleljen a mért értékeknek, például feszültségről hőmérsékletre vagy fényerőre. Azonban néha célszerű először a mért ellenállást kiszámítani. Ha szükséges, kiszámítható:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Az LDR leolvasása a gyakorlatban

Az LDR vagy más ellenállásos érzékelők leolvasása nagyon egyszerű, mivel csak az analóg-digitális átalakítót kell lekérdeznünk a feszültségért. Kezdjük ezúttal egy új Arduino vázlattal a semmiből. Fájl -> Új vázlat.

Először kezdjük a vázlatot, mint korábban, a könyvtár beillesztésével. Ezt a vázlat elején tesszük. Az előkészítés során indítsuk el a soros kommunikációt és inicializáljuk a CanSat-ot, mint korábban.

```Cpp title="Alapvető beállítás"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Egy alapvető ciklus az LDR leolvasásához nem sokkal bonyolultabb. Az R401 és R402 ellenállások már a táblán vannak, és csak a közös csomópontjukról kell leolvasnunk a feszültséget. Olvassuk le az ADC értékét és nyomtassuk ki.

```Cpp title="Alapvető LDR ciklus"
void loop() {
    int value = analogRead(LDR);
    Serial.print("LDR érték:");
    Serial.println(value);
    delay(200);
}
```

Ezzel a programmal az értékek egyértelműen reagálnak a fényviszonyokra. Alacsonyabb értékeket kapunk, amikor az LDR fénynek van kitéve, és magasabb értékeket, amikor sötétebb van. Azonban az értékek százakban és ezrekben vannak, nem a várható feszültségtartományban. Ez azért van, mert most az ADC közvetlen kimenetét olvassuk. Minden bit egy feszültség-összehasonlító létrát képvisel, amely egy vagy nulla a feszültségtől függően. Az értékek most 0-4095 (2^12-1) között vannak a bemeneti feszültségtől függően. Ismét, ez a közvetlen mérés valószínűleg az, amit használni szeretne, ha valami olyasmit csinál, mint például [pulzusok észlelése az LDR-rel](./../../blog/first-project#pulse-detection), de gyakran a szokásos voltokkal könnyebb dolgozni. Bár a feszültség kiszámítása önmagában jó gyakorlat, a könyvtár tartalmaz egy átváltási függvényt, amely figyelembe veszi az ADC nemlinearitását is, ami azt jelenti, hogy a kimenet pontosabb, mint egy egyszerű lineáris átváltás.

```Cpp title="Az LDR feszültség leolvasása"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("LDR érték:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Ez a kód kompatibilis az Arduino Code soros plotterével. Próbálja ki!

:::

:::tip[Feladat]

Hasznos lehet érzékelni, hogy a CanSat ki lett lőve a rakétából, így például az ejtőernyő a megfelelő időben kioldható. Tudsz írni egy programot, amely érzékeli a szimulált kioldást? Szimuláld a kilövést az LDR lefedésével (rakéta integráció) és majd a felfedésével (kioldás). A program kiírhatja a kioldást a terminálra, vagy villogtathat egy LED-et, hogy jelezze, hogy a kioldás megtörtént.

:::

---

A következő lecke az SD-kártya használatáról szól, hogy méréseket, beállításokat és még sok mást tároljunk!

[Kattints ide a következő leckéhez!](./lesson5)