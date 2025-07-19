---
sidebar_position: 2
---

# Kiterjesztési interfész

Egyedi eszközök építhetők és használhatók a CanSat-tal együtt. Ezekkel érdekes projekteket lehet készíteni, amelyekhez ötleteket találhatsz a [Blogunkban](/blog).

A CanSat kiterjesztési interfésze egy szabad UART vonalat, két ADC lábat és 5 szabad digitális I/O lábat tartalmaz. Ezenkívül SPI és I2C vonalak is elérhetők a kiterjesztési interfészhez, bár ezek megosztottak az SD kártyával és az érzékelő csomaggal.

A felhasználó választhatja azt is, hogy a UART2 és az ADC lábakat digitális I/O-ként használja, ha soros kommunikációra vagy analóg-digitális átalakításra nincs szükség a megoldásában.

| Pin szám | Pin név  | Használat    | Megjegyzések              |
|----------|----------|--------------|---------------------------|
| 12       | GPIO12   | Digitális I/O| Szabad                    |
| 15       | GPIO15   | Digitális I/O| Szabad                    |
| 16       | GPIO16   | UART2 RX     | Szabad                    |
| 17       | GPIO17   | UART2 TX     | Szabad                    |
| 18       | SPI_CLK  | SPI CLK      | Megosztott az SD kártyával|
| 19       | SPI_MISO | SPI MISO     | Megosztott az SD kártyával|
| 21       | I2C_SDA  | I2C SDA      | Megosztott az érzékelő csomaggal |
| 22       | I2C_SCL  | I2C SCL      | Megosztott az érzékelő csomaggal |
| 23       | SPI_MOSI | SPI MOSI     | Megosztott az SD kártyával|
| 25       | GPIO25   | Digitális I/O| Szabad                    |
| 26       | GPIO26   | Digitális I/O| Szabad                    |
| 27       | GPIO27   | Digitális I/O| Szabad                    |
| 32       | GPIO32   | ADC          | Szabad                    |
| 33       | GPIO33   | ADC          | Szabad                    |

*Táblázat: Kiterjesztési interfész pin keresőtábla. A pin név a könyvtári pin nevet jelöli.*

# Kommunikációs lehetőségek

A CanSat könyvtár nem tartalmaz kommunikációs csomagolókat az egyedi eszközökhöz. Az UART, I2C és SPI kommunikációhoz a CanSat NeXT és az egyedi payload eszköz között, kérjük, tekintse meg az Arduino alapértelmezett [UART](https://docs.arduino.cc/learn/communication/uart/), [Wire](https://docs.arduino.cc/learn/communication/wire/), és [SPI](https://docs.arduino.cc/learn/communication/spi/) könyvtárait.

## UART

Az UART2 vonal jó alternatíva, mivel szabadon felhasználható kommunikációs interfészként szolgál a kiterjesztett payloadok számára.

Az adatok UART vonalon történő küldéséhez kérjük, tekintse meg az Arduino

```
       CanSat NeXT
          ESP32                          Felhasználói eszköz
   +----------------+                 +----------------+
   |                |   TX (Küldés)   |                |
   |       TX  o----|---------------->| RX  (Fogadás)  |
   |                |                 |                |
   |       RX  o<---|<----------------| TX             |
   |                |   GND (Föld)    |                |
   |       GND  o---|-----------------| GND            |
   +----------------+                 +----------------+
```
*Kép: UART protokoll ASCII-ban*

## I2C

Az I2C használata támogatott, de a felhasználónak figyelembe kell vennie, hogy egy másik alrendszer is létezik a vonalon.

Több I2C slave esetén a felhasználói kódnak meg kell határoznia, melyik I2C slave-t használja a CanSat adott időpontban. Ezt egy slave cím különbözteti meg, amely minden eszközhöz egyedi hexadecimális kód, és megtalálható az alrendszer eszköz adatlapján.

## SPI

Az SPI használata szintén támogatott, de a felhasználónak figyelembe kell vennie, hogy egy másik alrendszer is létezik a vonalon.

Az SPI esetében a slave megkülönböztetése egy chip select pin megadásával történik. A felhasználónak az egyik szabad GPIO lábat kell chip selectként dedikálnia az egyedi kiterjesztett payload eszközéhez. Az SD kártya chip select pinje a ``CanSatPins.h`` könyvtári fájlban van definiálva ``SD_CS``-ként.

![CanSat NeXT I2C busz.](./img/i2c_bus2.png)

*Kép: a CanSat NeXT I2C busz, amely több másodlagos vagy "slave" alrendszert tartalmaz. Ebben a kontextusban az Érzékelő csomag az egyik slave alrendszer.*

![CanSat NeXT SPI busz.](./img/spi_bus.png)

*Kép: a CanSat NeXT SPI busz konfigurációja, amikor két másodlagos vagy "slave" alrendszer van jelen. Ebben a kontextusban az SD kártya az egyik slave alrendszer.*