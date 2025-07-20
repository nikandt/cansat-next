---
sidebar_position: 12
---

# 11. lecke: A műholdnak növekednie kell

Bár a CanSat NeXT már számos integrált érzékelővel és eszközzel rendelkezik a műhold paneljén, sok izgalmas CanSat küldetés megköveteli más külső érzékelők, szervók, kamerák, motorok vagy más működtetők és eszközök használatát. Ez a lecke kissé eltér az előzőektől, mivel a különféle külső eszközök CanSat-hoz való integrálásáról fogunk beszélni. Lehet, hogy az Ön konkrét esete nem szerepel itt, de talán valami hasonló igen. Ha azonban úgy érzi, hogy valamit itt le kellene fedni, kérjük, küldjön visszajelzést a samuli@kitsat.fi címre.

Ez a lecke kissé eltér az előzőektől, mivel bár minden információ hasznos, szabadon ugorhat azokra a területekre, amelyek kifejezetten az Ön projektjéhez kapcsolódnak, és használhatja ezt az oldalt referenciaként. Azonban mielőtt folytatná ezt a leckét, kérjük, tekintse át a CanSat NeXT dokumentáció [hardver](./../CanSat-hardware/CanSat-hardware.md) részében bemutatott anyagokat, mivel ezek sok információt tartalmaznak a külső eszközök integrálásához.

## Külső eszközök csatlakoztatása

Két nagyszerű módja van a külső eszközök CanSat NeXT-hez való csatlakoztatásának: [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) és egyedi nyomtatott áramkörök (PCB) használatával. Saját PCB készítése könnyebb (és olcsóbb), mint gondolná, és a kezdéshez jó kiindulópont ez a [KiCAD oktatóanyag](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Van egy [sablonunk](../CanSat-hardware/mechanical_design#custom-PCB) is KiCAD-hez, így a panelek azonos formátumú elkészítése nagyon egyszerű.

Ennek ellenére a legtöbb CanSat küldetéshez a külső érzékelők vagy más eszközök perf boardra való forrasztása nagyszerű módja a megbízható, masszív elektronikai halmok létrehozásának.

Még egyszerűbb módja a kezdésnek, különösen az első prototípus készítésekor, ha jumper kábeleket használ (más néven Dupont kábelek vagy breadboard vezetékek). Ezeket általában az érzékelő breakoutekhez is mellékelik, de külön is megvásárolhatók. Ezek ugyanazt a 0,1 hüvelykes osztást használják, mint a bővítő tűfej, ami nagyon egyszerűvé teszi az eszközök kábelekkel való csatlakoztatását. Azonban, bár a kábelek könnyen használhatók, meglehetősen terjedelmesek és megbízhatatlanok. Emiatt melegen ajánlott elkerülni a kábeleket a CanSat repülési modelljéhez.

## Az eszközök áramellátásának megosztása

A CanSat NeXT 3,3 voltot használ az összes saját eszközéhez, ezért ez az egyetlen feszültségvonal, amely a bővítő fejhez is biztosított. Sok kereskedelmi breakout, különösen a régebbiek, támogatják az 5 voltos működést is, mivel ez a feszültség a régi Arduinók által használt. Azonban az eszközök túlnyomó többsége közvetlenül 3,3 volton keresztül is támogatja a működést.

Azokban az esetekben, amikor az 5 volt feltétlenül szükséges, egy **boost konvertert** is beépíthet a panelre. Vannak kész modulok is, de sok eszközt közvetlenül a perf boardra is forraszthat. Ennek ellenére próbálja meg először 3,3 voltról használni az eszközt, mivel jó eséllyel működni fog.

A 3,3 voltos vonal maximálisan ajánlott áramfelvétele 300 mA, így az áraméhes eszközök, például motorok vagy fűtőelemek esetén fontolja meg egy külső áramforrás használatát.

## Adatvonalak

A bővítő fej összesen 16 tűvel rendelkezik, amelyek közül kettő a földelés és a tápvonalak számára van fenntartva. A többi különböző típusú bemenet és kimenet, amelyek többsége többféle felhasználási lehetőséggel rendelkezik. A panel pinoutja megmutatja, hogy melyik tű mit tud.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Az összes kivezetett tű általános célú bemenetként és kimenetként (GPIO) használható, ami azt jelenti, hogy `digitalWrite` és `digitalRead` funkciókat hajthat végre velük a kódban.

### ADC

A 33-as és 32-es tűk analóg-digitális átalakítóval (ADC) rendelkeznek, ami azt jelenti, hogy `analogRead` (és `adcToVoltage`) segítségével olvashatja a feszültséget ezen a tűn.

### DAC

Ezek a tűk használhatók egy adott feszültség létrehozására a kimeneten. Megjegyzendő, hogy a kívánt feszültséget állítják elő, azonban csak nagyon kis mennyiségű áramot tudnak biztosítani. Ezek használhatók referenciapontként érzékelők számára, vagy akár hangkimenetként is, azonban szüksége lesz egy erősítőre (vagy kettőre). Használhatja a `dacWrite`-t a feszültség írására. A CanSat könyvtárban van erre példa is.

### SPI

A soros perifériainterfész (SPI) egy szabványos adatvonal, amelyet gyakran használnak Arduino breakoutek és hasonló eszközök. Egy SPI eszköz négy tűt igényel:

| **Tű neve**   | **Leírás**                                                  | **Használat**                                                      |
|---------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| **MOSI**      | Main Out Secondary In                                        | Az adat, amit a fő eszköz (pl. CanSat) küld a másodlagos eszköznek. |
| **MISO**      | Main In Secondary Out                                        | Az adat, amit a másodlagos eszköz küld vissza a fő eszköznek.       |
| **SCK**       | Soros órajel                                                 | Az órajel, amit a fő eszköz generál a kommunikáció szinkronizálásához. |
| **SS/CS**     | Secondary Select/Chip Select                                 | A fő eszköz által használt, hogy kiválassza, melyik másodlagos eszközzel kommunikáljon. |

Itt a fő a CanSat NeXT panel, és a másodlagos az az eszköz, amellyel kommunikálni szeretne. A MOSI, MISO és SCK tűk megoszthatók több másodlagossal, azonban mindegyiknek szüksége van saját CS tűre. A CS tű bármelyik GPIO tű lehet, ezért nincs dedikált tű a buszon.

(Megjegyzés: A régi anyagok néha a "master" és "slave" kifejezéseket használják a fő és másodlagos eszközök megnevezésére. Ezek a kifejezések ma már elavultnak számítanak.)

A CanSat NeXT panelen az SD kártya ugyanazt az SPI vonalat használja, mint a bővítő fej. Amikor egy másik SPI eszközt csatlakoztat a buszhoz, ez nem számít. Azonban, ha az SPI tűket GPIO-ként használják, az SD kártya gyakorlatilag le van tiltva.

Az SPI használatához gyakran meg kell adnia, hogy melyik tűket használja a processzorból. Egy példa lehet így, ahol a CanSat könyvtárban található **makrók** használatával állítjuk be a többi tűt, és a 12-es tűt állítjuk be chip selectként.

```Cpp title="Az SPI vonal inicializálása egy érzékelőhöz"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

A `SPI_CLK`, `SPI_MOSI` és `SPI_MISO` makrókat a fordító 18, 23 és 19 értékekkel helyettesíti.

### I2C

Az Inter-Integrated Circuit egy másik népszerű adatbusz protokoll, különösen kis integrált érzékelők, például a nyomásérzékelő és az IMU használják a CanSat NeXT panelen.

Az I2C előnye, hogy csak két tűt igényel, SCL és SDA. Nincs külön chip select tű, hanem különböző eszközöket különböző **címek** választanak el, amelyeket a kommunikáció létrehozásához használnak. Így több eszköz is lehet ugyanazon a buszon, amennyiben mindegyiknek egyedi címe van.

| **Tű neve** | **Leírás**               | **Használat**                                                     |
|-------------|--------------------------|-------------------------------------------------------------------|
| **SDA**     | Soros adatvonal          | Kétirányú adatvonal, amelyet a fő és másodlagos eszközök közötti kommunikációhoz használnak. |
| **SCL**     | Soros órajelvonal        | Az órajel, amit a fő eszköz generál az adatátvitel szinkronizálásához a másodlagos eszközökkel. |

A barométer és az IMU ugyanazon az I2C buszon van, mint a bővítő fej. Ellenőrizze ezeknek az eszközöknek a címét az [On-Board érzékelők](../CanSat-hardware/on_board_sensors#IMU) oldalon. Az SPI-hez hasonlóan ezeket a tűket más I2C eszközök csatlakoztatására is használhatja, de ha GPIO tűként használják őket, az IMU és a barométer le van tiltva.

Az Arduino programozásban az I2C-t néha `Wire`-nak hívják. Az SPI-vel ellentétben, ahol a pinoutot gyakran meg kell adni minden érzékelőhöz, az I2C-t gyakran úgy használják az Arduinóban, hogy először létrehoznak egy adatvonalat, majd azt hivatkozzák minden érzékelőhöz. Az alábbi példa mutatja, hogyan inicializálja a barométert a CanSat NeXT könyvtár:

```Cpp title="A második soros vonal inicializálása"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Tehát először egy `Wire`-t inicializálunk az I2C tűk megadásával. A CanSat NeXT könyvtárban beállított `I2C_SDA` és `I2C_SCL` makrókat a fordító 22 és 21 értékekkel helyettesíti.

### UART

Az univerzális aszinkron vevő-adó (UART) bizonyos szempontból a legegyszerűbb adatprotokoll, mivel egyszerűen binárisan küldi az adatokat egy meghatározott frekvencián. Mint ilyen, pont-pont közötti kommunikációra korlátozódik, ami azt jelenti, hogy általában nem lehet több eszköz ugyanazon a buszon.

| **Tű neve** | **Leírás**               | **Használat**                                                     |
|-------------|--------------------------|-------------------------------------------------------------------|
| **TX**      | Adás                     | Adatokat küld a fő eszközről a másodlagos eszközre.               |
| **RX**      | Fogadás                  | Adatokat fogad a másodlagos eszközről a fő eszközre.              |

A CanSat-on a bővítő fej UART-ja nem használatos másra. Van egy másik UART vonal is, de azt a műhold és a számítógép közötti USB kommunikációra használják. Ezt használják, amikor adatokat küldenek a `Serial`-ra.

A másik UART vonalat így lehet inicializálni a kódban:

```Cpp title="A második soros vonal inicializálása"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Néhány eszköz a [szélességmodulált impulzus](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) jelet is használja vezérlő bemenetként. Használható dimmelhető LED-ekhez vagy teljesítménykimenet szabályozásához bizonyos helyzetekben, sok más felhasználási eset mellett.

Az Arduinóval csak bizonyos tűk használhatók PWM-ként. Azonban, mivel a CanSat NeXT egy ESP32 alapú eszköz, az összes kimeneti tű használható PWM kimenet létrehozására. A PWM-et az `analogWrite`-al lehet vezérelni.

## Mi a helyzet (az én konkrét esetemmel)?

A legtöbb eszközhöz sok információ található az interneten. Például keressen rá a konkrét breakoutra, amelyet használ, és használja ezeket a dokumentumokat az interneten talált példák módosítására a CanSat NeXT-hez. Az érzékelőknek és más eszközöknek vannak **adatlapjai**, amelyeknek sok információt kell tartalmazniuk az eszköz használatáról, bár ezek néha nehezen értelmezhetők. Ha úgy érzi, hogy valamit ennek az oldalnak le kellett volna fednie, kérjük, tudassa velem a samuli@kitsat.fi címen.

A következő, utolsó leckében arról fogunk beszélni, hogyan készítse elő műholdját az indításra.

[Kattintson ide a következő leckéhez!](./lesson12)