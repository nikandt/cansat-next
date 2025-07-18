---
Külgriba_positsioon: 2
---

# Pikenduse liides

Kohandatud seadmeid saab ehitada ja kasutada koos CanSat'iga. Neid saab kasutada huvitavate projektide loomiseks, mille jaoks leiate ideid meie [ajaveeb] (/ajaveeb).

CanSati pikendusliides on tasuta UART -liin, kaks ADC tihvti ja 5 tasuta digitaalset I/O -tihvti. Lisaks on laiendusliidese jaoks saadaval SPI ja I2C read, ehkki neid jagatakse vastavalt SD -kaardi ja anduri komplektiga.

Kasutaja saab kasutada ka UART2 ja ADC tihvte kasutamise digitaalse I/O -na, kui seeriasuhtlus või analoog digitaalse teisenduse jaoks pole nende lahenduses vaja.

| Pin number | PIN -i nimi | Kasutage kui | Märkused |
| ------------ | ---------- | ------------- | --------------------------- |
| 12 | GPIO12 | Digitaalne I/O | Tasuta |
| 15 | GPIO15 | Digitaalne I/O | Tasuta |
| 16 | GPIO16 | UART2 rx | Tasuta |
| 17 | GPIO17 | UART2 TX | Tasuta |
| 18 | Spi_CLK | Spi clk | Kaasakasutamine SD-kaardiga |
| 19 | Spi_miso | Spi Miso | Kaasakasutamine SD-kaardiga |
| 21 | I2c_sda | I2C SDA | Kaasakasutamine anduri sviidiga |
| 22 | I2c_scl | I2C SCL | Kaasakasutamine anduri sviidiga |
| 23 | Spi_mosi | Spi Mosi | Kaasakasutamine SD-kaardiga |
| 25 | GPIO25 | Digitaalne I/O | Tasuta |
| 26 | GPIO26 | Digitaalne I/O | Tasuta |
| 27 | GPIO27 | Digitaalne I/O | Tasuta |
| 32 | GPIO32 | ADC | Tasuta |
| 33 | GPIO33 | ADC | Tasuta |

*Tabel: pikendusliidese PIN -i otsingulaud. PIN -i nimi viitab raamatukogu tihvti nimele.*

# Suhtlusvalikud

CanSat Library ei sisalda kohandatud seadmete suhtlemisümbreid. UART, I2C ja SPI -suhtlus CanSat Next ja teie kohandatud kasuliku koormusega seadme vahel vaadake Arduino vaikimisi [UART] (https://docs.arduino.cc/learn/communication/Uart/), [traadi] (https://docs.arduino.cc/learn/communication/wire/). [SPI] (https://docs.arduino.cc/learn/communication/spi/) raamatukogud. 

## Uart

UART2 liin on hea alternatiiv, kuna see toimib laiendatud kandekoormuste jaotamata suhtlusliides.



Andmete saatmiseks UART liini kaudu lugege palun Arduino 

`` `
       CANSAT järgmine
          ESP32 kasutaja seade
   +----------------++----------------+
   |                |   TX (edastus) |                |
   |       TX O ---- | ----------------> | Rx (vastuvõtu) |
   |                |                 |                |
   |       Rx o <--- | <---------------- | TX |
   |                |   GND (maapind) |                |
   |       GND O --- | ----------------- | GND |
   +----------------++----------------+
`` `
*Pilt: UART protokoll ASCII -s*


## i2c

I2C kasutamist toetatakse, kuid kasutaja peab meeles pidama, et liinil on veel üks alamsüsteem.

Mitme I2C orja korral peab kasutajakood täpsustama, millist i2c orja Cansat konkreetsel ajal kasutab. Seda eristatakse orja aadressiga, mis on iga seadme ainulaadne kuueteistkümnendal kood ja mida võib leida alamsüsteemi seadme andmelehest.

## SPI

Toetatakse ka SPI kasutamist, kuid kasutaja peab meeles pidama, et liinil on veel üks alamsüsteem.

SPI -ga tehakse selle asemel orja eristamine, määrates kiibivaliku tihvti. Kasutaja peab pühendama ühe tasuta GPIO tihvti, et see on oma kohandatud laiendatud kandeadme jaoks valitud. SD -kaardi CHIP Select Pin on määratletud raamatukogu failis `` canSatpins.h`` `` `sd_cs``.

! [Cansat järgmine i2c buss.] (./ img/i2c_bus2.png)

*Pilt: CanSat järgmine I2C buss, kus on mitu sekundaarset või "orja" alamsüsteemi. Selles kontekstis on anduri sviit üks orja alamsüsteeme.*

! [Cansat järgmine i2c buss.] (./ img/spi_bus.png)

*Pilt: CanSat järgmine SPI -siini konfiguratsioon, kui on olemas kaks sekundaarset või "orja" alamsüsteemi. Selles kontekstis on SD -kaart üks orja alamsüsteeme.*