---
sidebar_position: 1
---

# Raamatukogu spetsifikatsioon

# Funktsioonid

CanSat NeXT-iga saate kasutada kõiki tavalisi Arduino funktsioone, samuti mis tahes Arduino teeke. Arduino funktsioonid leiate siit: https://www.arduino.cc/reference/en/.

CanSat NeXT teek lisab mitmeid lihtsasti kasutatavaid funktsioone erinevate pardal olevate ressursside, nagu sensorid, raadio ja SD-kaart, kasutamiseks. Teek sisaldab komplekti näiteskeeme, mis näitavad, kuidas neid funktsioone kasutada. Allolev loetelu näitab ka kõiki saadaolevaid funktsioone.

## Süsteemi initsialiseerimise funktsioonid

### CanSatInit

| Funktsioon           | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 0, kui initsialiseerimine oli edukas, või mitte-null, kui esines viga. |
| **Parameetrid**      |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-baidine MAC-aadress, mida jagavad satelliit ja maajaam. See on valikuline parameeter - kui seda ei esitata, siis raadiot ei initsialiseerita. Kasutatakse näiteskeemis: Kõik |
| **Kirjeldus**        | See käsk asub peaaegu kõigi CanSat NeXT skriptide `setup()`-is. Seda kasutatakse CanSatNeXT riistvara, sealhulgas sensorite ja SD-kaardi initsialiseerimiseks. Lisaks, kui `macAddress` on esitatud, alustab see raadio ja hakkab kuulama sissetulevaid sõnumeid. MAC-aadress peaks olema jagatud maajaama ja satelliidi vahel. MAC-aadressi saab vabalt valida, kuid on mõned mitte-kehtivad aadressid, nagu kõik baidid on `0x00`, `0x01` ja `0xFF`. Kui init-funktsioon kutsutakse mitte-kehtiva aadressiga, teatab see probleemist Serialile. |

### CanSatInit (lihtsustatud MAC-aadressi spetsifikatsioon)

| Funktsioon           | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 0, kui initsialiseerimine oli edukas, või mitte-null, kui esines viga. |
| **Parameetrid**      |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | MAC-aadressi viimane bait, mida kasutatakse erinevate CanSat-GS paaride eristamiseks. |
| **Kirjeldus**        | See on CanSatInit MAC-aadressiga lihtsustatud versioon, mis seab teised baidid automaatselt teadaolevaks turvaliseks väärtuseks. See võimaldab kasutajatel eristada oma saatja-vastuvõtja paare vaid ühe väärtusega, mis võib olla 0-255. |

### GroundStationInit

| Funktsioon             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|------------------------|--------------------------------------------------------------------|
| **Tagastustüüp**       | `uint8_t`                                                          |
| **Tagastusväärtus**    | Tagastab 0, kui initsialiseerimine õnnestus, või mitte-null väärtuse, kui esines viga. |
| **Parameetrid**        |                                                                    |
|                        | `uint8_t macAddress[6]`                                           |
|                        | 6-baidine MAC-aadress, mida jagavad satelliit ja maajaam.         |
| **Kasutatud näites**   | Groundstation receive                                              |
| **Kirjeldus**          | See on CanSatInit funktsiooni lähedane sugulane, kuid see nõuab alati MAC-aadressi. See funktsioon initsialiseerib ainult raadio, mitte teisi süsteeme. Maajaamaks võib olla ükskõik milline ESP32 plaat, sealhulgas arendusplaat või isegi teine CanSat NeXT plaat. |

### GroundStationInit (lihtsustatud MAC-aadressi määramine)

| Funktsioon             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|------------------------|--------------------------------------------------------------------|
| **Tagastustüüp**       | `uint8_t`                                                          |
| **Tagastusväärtus**    | Tagastab 0, kui initsialiseerimine õnnestus, või mitte-null väärtuse, kui esines viga. |
| **Parameetrid**        |                                                                    |
|                        | `uint8_t macAddress`                                               |
|                        | MAC-aadressi viimane bait, mida kasutatakse erinevate CanSat-GS paaride eristamiseks. |
| **Kirjeldus**          | See on GroundStationInit lihtsustatud versioon MAC-aadressiga, mis määrab teised baidid automaatselt teadaolevaks turvaliseks väärtuseks. See võimaldab kasutajatel eristada oma Saatja-Vastuvõtja paare vaid ühe väärtusega, mis võib olla vahemikus 0-255. |

## IMU Funktsioonid

### readAcceleration

| Funktsioon             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|------------------------|--------------------------------------------------------------------|
| **Tagastustüüp**       | `uint8_t`                                                          |
| **Tagastusväärtus**    | Tagastab 0, kui mõõtmine õnnestus.                                 |
| **Parameetrid**        |                                                                    |
|                        | `float &x, float &y, float &z`                                    |
|                        | `float &x`: Ujukomaväärtuse muutuja aadress, kuhu salvestatakse x-telje andmed. |
| **Kasutatud näites**   | IMU                                                                |
| **Kirjeldus**          | Seda funktsiooni saab kasutada pardal oleva IMU kiirenduse lugemiseks. Parameetrid on ujukomaväärtuse muutujate aadressid iga telje jaoks. Näide IMU näitab, kuidas seda funktsiooni kasutada kiirenduse lugemiseks. Kiirendus tagastatakse ühikutes G (9.81 m/s²). |

### readAccelX

| Funktsioon             | float readAccelX()          |
|------------------------|--------------------------------------------------------------------|
| **Tagastustüüp**       | `float`                                                          |
| **Tagastusväärtus**    | Tagastab lineaarse kiirenduse X-teljel ühikutes G.                           |
| **Kasutatud näites**   | IMU                                                                |
| **Kirjeldus**          | Seda funktsiooni saab kasutada pardal oleva IMU kiirenduse lugemiseks konkreetsel teljel. Näide IMU näitab, kuidas seda funktsiooni kasutada kiirenduse lugemiseks. Kiirendus tagastatakse ühikutes G (9.81 m/s²). |

### readAccelY

| Funktsioon           | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                          |
| **Tagastusväärtus**  | Tagastab lineaarse kiirenduse Y-teljel ühikutes G.                           |
| **Kasutatud näites** | IMU                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada pardal oleva IMU kiirenduse lugemiseks konkreetsel teljel. Näide IMU näitab, kuidas seda funktsiooni kasutada kiirenduse lugemiseks. Kiirendus tagastatakse ühikutes G (9.81 m/s). |

### readAccelZ

| Funktsioon           | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                          |
| **Tagastusväärtus**  | Tagastab lineaarse kiirenduse Z-teljel ühikutes G.                           |
| **Kasutatud näites** | IMU                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada pardal oleva IMU kiirenduse lugemiseks konkreetsel teljel. Näide IMU näitab, kuidas seda funktsiooni kasutada kiirenduse lugemiseks. Kiirendus tagastatakse ühikutes G (9.81 m/s). |

### readGyro

| Funktsioon           | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 0, kui mõõtmine oli edukas.                           |
| **Parameetrid**      |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Ujukomaarvuga muutuja aadress, kuhu salvestatakse x-telje andmed. |
| **Kasutatud näites** | IMU                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada pardal oleva IMU nurkkiiruse lugemiseks. Parameetrid on ujukomaarvuga muutujate aadressid iga telje jaoks. Näide IMU näitab, kuidas seda funktsiooni kasutada nurkkiiruse lugemiseks. Nurkkiirus tagastatakse ühikutes mrad/s. |

### readGyroX

| Funktsioon           | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                          |
| **Tagastusväärtus**  | Tagastab nurkkiiruse X-teljel ühikutes mrad/s.                           |
| **Kasutatud näites** | IMU                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada pardal oleva IMU nurkkiiruse lugemiseks konkreetsel teljel. Parameetrid on ujukomaarvuga muutujate aadressid iga telje jaoks. Nurkkiirus tagastatakse ühikutes mrad/s. |

### readGyroY

| Funktsioon           | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                          |
| **Tagastusväärtus**  | Tagastab nurkkiiruse Y-teljel ühikutes mrad/s.                           |
| **Kasutatud näites** | IMU                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada pardal oleva IMU nurkkiiruse lugemiseks konkreetsel teljel. Parameetrid on ujukomaarvuga muutujate aadressid iga telje jaoks. Nurkkiirus tagastatakse ühikutes mrad/s. |

### readGyroZ

| Funktsioon           | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                          |
| **Tagastusväärtus**  | Tagastab nurkkiiruse Z-teljel ühikutes mrad/s.                           |
| **Kasutatud näites** | IMU                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada, et lugeda pardal oleva IMU nurkkiirust konkreetsel teljel. Parameetrid on iga telje jaoks float-tüüpi muutujate aadressid. Nurkkiirus tagastatakse ühikutes mrad/s. |

## Baromeetri Funktsioonid

### readPressure

| Funktsioon           | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                            |
| **Tagastusväärtus**  | Rõhk mbar                                                          |
| **Parameetrid**      | Puuduvad                                                           |
| **Kasutatud näites** | Baro                                                               |
| **Kirjeldus**        | See funktsioon tagastab pardal oleva baromeetri poolt mõõdetud rõhu. Rõhk on ühikutes millibar. |

### readTemperature

| Funktsioon           | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `float`                                                            |
| **Tagastusväärtus**  | Temperatuur Celsiuse kraadides                                     |
| **Parameetrid**      | Puuduvad                                                           |
| **Kasutatud näites** | Baro                                                               |
| **Kirjeldus**        | See funktsioon tagastab pardal oleva baromeetri poolt mõõdetud temperatuuri. Mõõtmise ühik on Celsiuse kraadid. Pange tähele, et see on baromeetri poolt mõõdetud sisetemperatuur, seega ei pruugi see kajastada välist temperatuuri. |

## SD Kaardi / Failisüsteemi Funktsioonid

### SDCardPresent

| Funktsioon           | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `bool`                                                             |
| **Tagastusväärtus**  | Tagastab true, kui SD-kaart on tuvastatud, false, kui mitte.       |
| **Parameetrid**      | Puuduvad                                                           |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Seda funktsiooni saab kasutada, et kontrollida, kas SD-kaart on mehaaniliselt kohal. SD-kaardi pistikul on mehaaniline lüliti, mis loetakse, kui seda funktsiooni kutsutakse. Tagastab true või false sõltuvalt sellest, kas SD-kaart on tuvastatud. |

### appendFile

| Funktsioon           | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 0, kui kirjutamine õnnestus.                             |
| **Parameetrid**      |                                                                    |
|                      | `String filename`: Faili aadress, kuhu lisatakse. Kui faili ei eksisteeri, luuakse see. |
|                      | `T data`: Andmed, mis lisatakse faili lõppu.                      |
| **Kasutatud näites** | SD_write                                                           |
| **Kirjeldus**        | See on põhiline kirjutamisfunktsioon, mida kasutatakse mõõtmistulemuste salvestamiseks SD-kaardile. |

### printFileSystem

| Funktsioon           | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      | Puuduvad                                                           |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | See on väike abifunktsioon, mis prindib SD-kaardil olevate failide ja kaustade nimed. Saab kasutada arendamisel. |

### newDir

| Funktsioon           | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `String path`: Uue kausta tee. Kui see juba eksisteerib, ei tehta midagi. |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Kasutatakse uute kaustade loomiseks SD-kaardil.                    |

### deleteDir

| Funktsioon           | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `String path`: Kustutatava kausta tee.                             |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Kasutatakse kaustade kustutamiseks SD-kaardil.                     |

### fileExists

| Funktsioon           | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `bool`                                                             |
| **Tagastusväärtus**  | Tagastab true, kui fail eksisteerib.                               |
| **Parameetrid**      |                                                                    |
|                      | `String path`: Faili tee.                                          |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Seda funktsiooni saab kasutada, et kontrollida, kas fail eksisteerib SD-kaardil. |

### fileSize

| Funktsioon           | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint32_t`                                                         |
| **Tagastusväärtus**  | Faili suurus baitides.                                             |
| **Parameetrid**      |                                                                    |
|                      | `String path`: Faili tee.                                          |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Seda funktsiooni saab kasutada faili suuruse lugemiseks SD-kaardilt.|

### writeFile

| Funktsioon           | uint8_t writeFile(String filename, T data)                        |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 0, kui kirjutamine õnnestus.                              |
| **Parameetrid**      |                                                                    |
|                      | `String filename`: Kirjutatava faili aadress.                      |
|                      | `T data`: Andmed, mida faili kirjutada.                            |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | See funktsioon on sarnane `appendFile()`-iga, kuid see kirjutab olemasolevad andmed SD-kaardil üle. Andmete salvestamiseks tuleks kasutada `appendFile`. See funktsioon võib olla kasulik näiteks seadete salvestamiseks.|

### readFile

| Funktsioon           | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `String`                                                           |
| **Tagastusväärtus**  | Kogu faili sisu.                                                   |
| **Parameetrid**      |                                                                    |
|                      | `String path`: Faili tee.                                          |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Seda funktsiooni saab kasutada kogu faili andmete lugemiseks muutujasse. Suurte failide lugemine võib põhjustada probleeme, kuid väikeste failide, nagu konfiguratsiooni- või seadistusfailide puhul, on see sobiv.|

### renameFile

| Funktsioon           | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `String oldpath`: Faili algne tee.                                 |
|                      | `String newpath`: Faili uus tee.                                   |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Seda funktsiooni saab kasutada failide ümbernimetamiseks või teisaldamiseks SD-kaardil.|

### deleteFile

| Funktsioon           | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `String path`: Kustutatava faili tee.                              |
| **Kasutatud näites** | SD_advanced                                                        |
| **Kirjeldus**        | Seda funktsiooni saab kasutada failide kustutamiseks SD-kaardilt.  |

## Raadio Funktsioonid

### onDataReceived

| Funktsioon           | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `String data`: Vastuvõetud andmed Arduino String kujul.            |
| **Kasutatud näites** | Groundstation_receive                                              |
| **Kirjeldus**        | See on tagasikutse funktsioon, mida kutsutakse, kui andmed on vastu võetud. Kasutaja kood peaks selle funktsiooni määratlema ja CanSat NeXT kutsub selle automaatselt, kui andmed on vastu võetud. |

### onBinaryDataReceived

| Funktsioon           | void onBinaryDataReceived(const uint8_t *data, uint16_t len)       |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `const uint8_t *data`: Vastuvõetud andmed uint8_t massiivina.      |
|                      | `uint16_t len`: Vastuvõetud andmete pikkus baitides.               |
| **Kasutatud näites** | Puudub                                                             |
| **Kirjeldus**        | See on sarnane `onDataReceived` funktsiooniga, kuid andmed esitatakse binaarsena, mitte String objektina. See on mõeldud edasijõudnud kasutajatele, kes leiavad, et String objekt on piirav. |

### onDataSent

| Funktsioon           | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                             |
| **Parameetrid**      |                                                                    |
|                      | `const bool success`: Boolean, mis näitab, kas andmed saadeti edukalt. |
| **Kasutatud näites** | Puudub                                                             |
| **Kirjeldus**        | See on veel üks tagasikutse funktsioon, mida saab vajadusel kasutaja koodi lisada. Seda saab kasutada, et kontrollida, kas vastuvõtt oli teise raadio poolt kinnitatud. |

### getRSSI

| Funktsioon           | int8_t getRSSI()                                                   |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `int8_t`                                                           |
| **Tagastusväärtus**  | Viimase vastuvõetud sõnumi RSSI. Tagastab 1, kui alates käivitamisest pole sõnumeid vastu võetud. |
| **Kasutatud näites** | Puudub                                                             |
| **Kirjeldus**        | Seda funktsiooni saab kasutada vastuvõtu signaali tugevuse jälgimiseks. Seda saab kasutada antennide testimiseks või raadio ulatuse hindamiseks. Väärtus on väljendatud [dBm](https://en.wikipedia.org/wiki/DBm), kuid skaala ei ole täpne. |

### sendData (String variant)

| Funktsioon           | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | 0, kui andmed saadeti (ei tähenda kinnitusvastust).               |
| **Parameetrid**      |                                                                    |
|                      | `T data`: Saadetavad andmed. Võib kasutada mis tahes andmetüüpi, kuid need teisendatakse sisemiselt stringiks.                  |
| **Kasutatud näidisketsis** | Send_data                                             |
| **Kirjeldus**        | See on peamine funktsioon andmete saatmiseks maajaama ja satelliidi vahel. Pange tähele, et tagastusväärtus ei näita, kas andmed tegelikult kätte saadi, vaid ainult seda, et need saadeti. Tagasiside `onDataSent` abil saab kontrollida, kas andmed jõudsid teise otsa. |

### sendData (binaarne variant)

| Funktsioon           | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | 0, kui andmed saadeti (ei tähenda kinnitusvastust).               |
| **Parameetrid**      |                                                                    |
|                      | `T* data`: Saadetavad andmed.                    |
|                      | `uint16_t len`: Andmete pikkus baitides.                      |
| **Kasutatud näidisketsis** | Puudub                                                 |
| **Kirjeldus**        | `sendData` funktsiooni binaarne variant, mis on mõeldud edasijõudnud kasutajatele, kes tunnevad end String objekti poolt piiratud. |

### getRSSI

| Funktsioon           | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `int8_t`                                                          |
| **Tagastusväärtus**  | Viimase vastuvõetud sõnumi RSSI. Tagastab 1, kui alates käivitamisest pole sõnumeid vastu võetud.                           |
| **Kasutatud näidisketsis** | Puudub                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada vastuvõtu signaali tugevuse jälgimiseks. Seda saab kasutada antennide testimiseks või raadio ulatuse hindamiseks. Väärtus on väljendatud [dBm](https://en.wikipedia.org/wiki/DBm), kuid skaala ei ole täpne. 

### setRadioChannel

| Funktsioon           | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Tagastustüüp**     | `void`                                                          |
| **Tagastusväärtus**  | Puudub                                                            |
| **Parameetrid**      | `uint8_t newChannel`: Soovitud Wi-Fi kanali number (1–11). Kõik väärtused üle 11 piiratakse 11-ga. |
| **Kasutatud näidisketsis** | Puudub                                                      |
| **Kirjeldus**        | Seadistab ESP-NOW suhtluskanali. Uus kanal peab olema standardsete Wi-Fi kanalite vahemikus (1–11), mis vastavad sagedustele alates 2.412 GHz sammudega 5 MHz. Kanal 1 on 2.412, Kanal 2 on 2.417 ja nii edasi. Kutsuge see funktsioon enne teegi initsialiseerimist. Vaikimisi kanal on 1. |

### getRadioChannel

| Funktsioon            | `uint8_t getRadioChannel()`                                      |
|-----------------------|------------------------------------------------------------------|
| **Tagastustüüp**      | `uint8_t`                                                       |
| **Tagastusväärtus**   | Praegu kasutusel olev Wi-Fi põhikanal. Tagastab 0, kui kanali hankimisel tekib viga. |
| **Kasutatud näites**  | Puudub                                                          |
| **Kirjeldus**         | Hangib praegu kasutusel oleva Wi-Fi põhikanali. See funktsioon töötab ainult pärast teegi initsialiseerimist. |

### printRadioFrequency

| Funktsioon            | `void printRadioFrequency()`                                     |
|-----------------------|------------------------------------------------------------------|
| **Tagastustüüp**      | `void`                                                          |
| **Tagastusväärtus**   | Puudub                                                          |
| **Kasutatud näites**  | Puudub                                                          |
| **Kirjeldus**         | Arvutab ja prindib praeguse sageduse GHz-des, lähtudes aktiivsest Wi-Fi kanalist. See funktsioon töötab ainult pärast teegi initsialiseerimist. |


## ADC Funktsioonid

### adcToVoltage

| Funktsioon            | float adcToVoltage(int value)                                      |
|-----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**      | `float`                                                            |
| **Tagastusväärtus**   | Konverteeritud pinge voltides.                                    |
| **Parameetrid**       |                                                                    |
|                       | `int value`: ADC lugemine, mis tuleb konverteerida pingeks.       |
| **Kasutatud näites**  | AccurateAnalogRead                                                |
| **Kirjeldus**         | See funktsioon konverteerib ADC lugemise pingeks, kasutades kalibreeritud kolmanda järgu polünoomi lineaarsema teisenduse jaoks. Pange tähele, et see funktsioon arvutab pinge sisendpinnil, seega aku pinge arvutamiseks peate arvestama ka takistivõrguga. |

### analogReadVoltage

| Funktsioon            | float analogReadVoltage(int pin)                                  |
|-----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**      | `float`                                                            |
| **Tagastusväärtus**   | ADC pinge voltides.                                               |
| **Parameetrid**       |                                                                    |
|                       | `int pin`: Pin, mida lugeda.                                      |
| **Kasutatud näites**  | AccurateAnalogRead                                                |
| **Kirjeldus**         | See funktsioon loeb pinge otse, selle asemel et kasutada `analogRead`, ja konverteerib lugemise pingeks sisemiselt, kasutades `adcToVoltage`. |