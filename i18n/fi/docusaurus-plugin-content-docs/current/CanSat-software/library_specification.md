---
sidebar_position: 1
---

# Kirjaston määrittely

# Toiminnot

Voit käyttää kaikkia tavallisia Arduino-toimintoja CanSat NeXT:in kanssa, sekä mitä tahansa Arduino-kirjastoja. Arduino-toiminnot löytyvät täältä: https://www.arduino.cc/reference/en/.

CanSat NeXT -kirjasto lisää useita helppokäyttöisiä toimintoja eri sisäänrakennettujen resurssien, kuten antureiden, radion ja SD-kortin, käyttämiseen. Kirjaston mukana tulee joukko esimerkkiohjelmia, jotka näyttävät, kuinka näitä toimintoja käytetään. Alla oleva lista näyttää myös kaikki saatavilla olevat toiminnot.

## Järjestelmän alustustoiminnot

### CanSatInit

| Toiminto             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos alustus onnistui, tai nollasta poikkeavan arvon, jos tapahtui virhe. |
| **Parametrit**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-tavuinen MAC-osoite, joka on jaettu satelliitin ja maa-aseman kesken. Tämä on valinnainen parametri - kun sitä ei anneta, radiota ei alusteta. Käytetty esimerkkiohjelmassa: Kaikki |
| **Kuvaus**           | Tämä komento löytyy lähes kaikista CanSat NeXT -skripteistä `setup()`-kohdasta. Sitä käytetään CanSatNeXT-laitteiston, mukaan lukien antureiden ja SD-kortin, alustamiseen. Lisäksi, jos `macAddress` on annettu, se käynnistää radion ja alkaa kuunnella saapuvia viestejä. MAC-osoitteen tulisi olla jaettu maa-aseman ja satelliitin kesken. MAC-osoitteen voi valita vapaasti, mutta on olemassa joitakin ei-sallittuja osoitteita, kuten kaikki tavut `0x00`, `0x01` ja `0xFF`. Jos alustusfunktio kutsutaan ei-sallitulla osoitteella, se raportoi ongelman sarjaporttiin. |

### CanSatInit (yksinkertaistettu MAC-osoitteen määrittely)

| Toiminto             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos alustus onnistui, tai nollasta poikkeavan arvon, jos tapahtui virhe. |
| **Parametrit**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | MAC-osoitteen viimeinen tavu, jota käytetään erottamaan eri CanSat-GS-parit. |
| **Kuvaus**           | Tämä on yksinkertaistettu versio CanSatInit:stä MAC-osoitteella, joka asettaa muut tavut automaattisesti tunnettuun turvalliseen arvoon. Tämä mahdollistaa käyttäjien erottavan lähettimen-vastaanottimen parit vain yhdellä arvolla, joka voi olla 0-255.|

### GroundStationInit

| Toiminto             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos alustus onnistui, tai ei-nolla, jos tapahtui virhe. |
| **Parametrit**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-tavun MAC-osoite, jonka satelliitti ja maa-asema jakavat.       |
| **Käytetty esimerkkiohjelmassa** | Groundstation receive                                          |
| **Kuvaus**           | Tämä on läheinen sukulainen CanSatInit-funktiolle, mutta se vaatii aina MAC-osoitteen. Tämä funktio alustaa vain radion, ei muita järjestelmiä. Maa-asema voi olla mikä tahansa ESP32-lauta, mukaan lukien mikä tahansa kehityslauta tai jopa toinen CanSat NeXT -lauta. |

### GroundStationInit (yksinkertaistettu MAC-osoitteen määrittely)

| Toiminto             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos alustus onnistui, tai ei-nolla, jos tapahtui virhe. |
| **Parametrit**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | MAC-osoitteen viimeinen tavu, jota käytetään erottamaan eri CanSat-GS-parit. |
| **Kuvaus**           | Tämä on yksinkertaistettu versio GroundStationInit-funktiosta MAC-osoitteella, joka asettaa muut tavut automaattisesti tunnettuun turvalliseen arvoon. Tämä mahdollistaa käyttäjien erottavan lähettimen-vastaanottimen parit vain yhdellä arvolla, joka voi olla 0-255. |

## IMU-funktiot

### readAcceleration

| Toiminto             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos mittaus onnistui.                                 |
| **Parametrit**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Kelluvan muuttujan osoite, johon x-akselin data tallennetaan. |
| **Käytetty esimerkkiohjelmassa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kiihtyvyyttä sisäiseltä IMU:lta. Parametrit ovat osoitteita kelluville muuttujille jokaiselle akselille. Esimerkki IMU näyttää, kuinka tätä funktiota käytetään lukemaan kiihtyvyyttä. Kiihtyvyys palautetaan G-yksiköissä (9.81 m/s). |

### readAccelX

| Toiminto             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                          |
| **Palautusarvo**     | Palauttaa lineaarisen kiihtyvyyden X-akselilla G-yksiköissä.                           |
| **Käytetty esimerkkiohjelmassa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kiihtyvyyttä sisäiseltä IMU:lta tietyllä akselilla. Esimerkki IMU näyttää, kuinka tätä funktiota käytetään lukemaan kiihtyvyyttä. Kiihtyvyys palautetaan G-yksiköissä (9.81 m/s). |

### readAccelY

| Funktio              | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                          |
| **Palautusarvo**     | Palauttaa lineaarisen kiihtyvyyden Y-akselilla yksiköissä G.                           |
| **Käytetty esimerkkiluonnoksessa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kiihtyvyyttä sisäisestä IMU:sta tietyllä akselilla. Esimerkki IMU näyttää, kuinka tätä funktiota käytetään kiihtyvyyden lukemiseen. Kiihtyvyys palautetaan yksiköissä G (9.81 m/s). |

### readAccelZ

| Funktio              | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                          |
| **Palautusarvo**     | Palauttaa lineaarisen kiihtyvyyden Z-akselilla yksiköissä G.                           |
| **Käytetty esimerkkiluonnoksessa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kiihtyvyyttä sisäisestä IMU:sta tietyllä akselilla. Esimerkki IMU näyttää, kuinka tätä funktiota käytetään kiihtyvyyden lukemiseen. Kiihtyvyys palautetaan yksiköissä G (9.81 m/s). |

### readGyro

| Funktio              | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos mittaus onnistui.                           |
| **Parametrit**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Osoite float-muuttujaan, johon x-akselin data tallennetaan. |
| **Käytetty esimerkkiluonnoksessa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kulmanopeutta sisäisestä IMU:sta. Parametrit ovat osoitteita float-muuttujiin jokaiselle akselille. Esimerkki IMU näyttää, kuinka tätä funktiota käytetään kulmanopeuden lukemiseen. Kulmanopeus palautetaan yksiköissä mrad/s. |

### readGyroX

| Funktio              | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                          |
| **Palautusarvo**     | Palauttaa kulmanopeuden X-akselilla yksiköissä mrad/s.                           |
| **Käytetty esimerkkiluonnoksessa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kulmanopeutta sisäisestä IMU:sta tietyllä akselilla. Parametrit ovat osoitteita float-muuttujiin jokaiselle akselille. Kulmanopeus palautetaan yksiköissä mrad/s. |

### readGyroY

| Funktio              | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                          |
| **Palautusarvo**     | Palauttaa kulmanopeuden Y-akselilla yksiköissä mrad/s.                           |
| **Käytetty esimerkkiluonnoksessa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kulmanopeutta sisäisestä IMU:sta tietyllä akselilla. Parametrit ovat osoitteita float-muuttujiin jokaiselle akselille. Kulmanopeus palautetaan yksiköissä mrad/s. |

### readGyroZ

| Funktio              | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                          |
| **Palautusarvo**     | Palauttaa kulmanopeuden Z-akselilla yksiköissä mrad/s.                           |
| **Käytetty esimerkkiohjelmassa** | IMU                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kulmanopeus tietyn akselin piirilevyllä olevasta IMU:sta. Parametrit ovat osoitteita float-muuttujiin jokaiselle akselille. Kulmanopeus palautetaan yksiköissä mrad/s. |

## Barometrifunktiot

### readPressure

| Funktio              | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                            |
| **Palautusarvo**     | Paine mbar                                                         |
| **Parametrit**       | Ei mitään                                                          |
| **Käytetty esimerkkiohjelmassa** | Baro                                                        |
| **Kuvaus**           | Tämä funktio palauttaa piirilevyllä olevan barometrin ilmoittaman paineen. Paine on yksiköissä millibaari. |

### readTemperature

| Funktio              | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                            |
| **Palautusarvo**     | Lämpötila Celsius-asteina                                         |
| **Parametrit**       | Ei mitään                                                          |
| **Käytetty esimerkkiohjelmassa** | Baro                                                        |
| **Kuvaus**           | Tämä funktio palauttaa piirilevyllä olevan barometrin ilmoittaman lämpötilan. Lukeman yksikkö on Celsius. Huomaa, että tämä on barometrin mittaama sisäinen lämpötila, joten se ei välttämättä vastaa ulkoista lämpötilaa. |

## SD-kortti / Tiedostojärjestelmäfunktiot

### SDCardPresent

| Funktio              | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `bool`                                                             |
| **Palautusarvo**     | Palauttaa true, jos SD-kortti havaitaan, false, jos ei.            |
| **Parametrit**       | Ei mitään                                                          |
| **Käytetty esimerkkiohjelmassa** | SD_advanced                                                |
| **Kuvaus**           | Tätä funktiota voidaan käyttää tarkistamaan, onko SD-kortti mekaanisesti paikalla. SD-kortin liittimessä on mekaaninen kytkin, joka luetaan, kun tätä funktiota kutsutaan. Palauttaa true tai false riippuen siitä, havaitaanko SD-kortti. |

### appendFile

| Function             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Palauttaa 0, jos kirjoitus onnistui.                               |
| **Parameters**       |                                                                    |
|                      | `String filename`: Lisättävän tiedoston osoite. Jos tiedostoa ei ole, se luodaan. |
|                      | `T data`: Data, joka lisätään tiedoston loppuun.                   |
| **Used in example sketch** | SD_write                                               |
| **Description**      | Tämä on peruskirjoitustoiminto, jota käytetään lukemien tallentamiseen SD-kortille. |

### printFileSystem

| Function             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       | Ei mitään                                                          |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Tämä on pieni apufunktio, joka tulostaa SD-kortilla olevien tiedostojen ja kansioiden nimet. Voidaan käyttää kehityksessä. |

### newDir

| Function             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Uuden hakemiston polku. Jos se on jo olemassa, mitään ei tehdä. |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Käytetään uusien hakemistojen luomiseen SD-kortille.               |

### deleteDir

| Function             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Poistettavan hakemiston polku.                      |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Käytetään hakemistojen poistamiseen SD-kortilta.                   |

### fileExists

| Function             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `bool`                                                             |
| **Return Value**     | Palauttaa true, jos tiedosto on olemassa.                          |
| **Parameters**       |                                                                    |
|                      | `String path`: Tiedoston polku.                                    |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Tätä funktiota voidaan käyttää tarkistamaan, onko tiedosto olemassa SD-kortilla. |

### fileSize

| Funktio              | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint32_t`                                                         |
| **Palautusarvo**     | Tiedoston koko tavuina.                                            |
| **Parametrit**       |                                                                    |
|                      | `String path`: Tiedoston polku.                                    |
| **Käytetty esimerkkiohjelmassa** | SD_advanced                                                |
| **Kuvaus**           | Tätä funktiota voidaan käyttää tiedoston koon lukemiseen SD-kortilta.|

### writeFile

| Funktio              | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | Palauttaa 0, jos kirjoitus onnistui.                               |
| **Parametrit**       |                                                                    |
|                      | `String filename`: Kirjoitettavan tiedoston osoite.                |
|                      | `T data`: Tiedostoon kirjoitettava data.                           |
| **Käytetty esimerkkiohjelmassa** | SD_advanced                                                |
| **Kuvaus**           | Tämä funktio on samanlainen kuin `appendFile()`, mutta se korvaa olemassa olevan datan SD-kortilla. Datan tallennukseen tulisi käyttää `appendFile`. Tämä funktio voi olla hyödyllinen esimerkiksi asetusten tallentamiseen.|

### readFile

| Funktio              | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `String`                                                           |
| **Palautusarvo**     | Kaikki tiedoston sisältö.                                          |
| **Parametrit**       |                                                                    |
|                      | `String path`: Tiedoston polku.                                    |
| **Käytetty esimerkkiohjelmassa** | SD_advanced                                                |
| **Kuvaus**           | Tätä funktiota voidaan käyttää lukemaan kaikki data tiedostosta muuttujaan. Suurten tiedostojen lukeminen voi aiheuttaa ongelmia, mutta se on sopiva pienille tiedostoille, kuten konfiguraatio- tai asetustiedostoille.|

### renameFile

| Funktio              | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                             |
| **Parametrit**       |                                                                    |
|                      | `String oldpath`: Tiedoston alkuperäinen polku.                    |
|                      | `String newpath`: Tiedoston uusi polku.                            |
| **Käytetty esimerkkiohjelmassa** | SD_advanced                                                |
| **Kuvaus**           | Tätä funktiota voidaan käyttää tiedostojen uudelleennimeämiseen tai siirtämiseen SD-kortilla.|

### deleteFile

| Funktio              | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                             |
| **Parametrit**       |                                                                    |
|                      | `String path`: Poistettavan tiedoston polku.                      |
| **Käytetty esimerkkiluonnoksessa** | SD_advanced                                                |
| **Kuvaus**           | Tätä funktiota voidaan käyttää tiedostojen poistamiseen SD-kortilta.        |

## Radiofunktiot

### onDataReceived

| Funktio              | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                             |
| **Parametrit**       |                                                                    |
|                      | `String data`: Vastaanotettu data Arduino Stringinä.                |
| **Käytetty esimerkkiluonnoksessa** | Groundstation_receive                                      |
| **Kuvaus**           | Tämä on palautefunktio, joka kutsutaan, kun dataa vastaanotetaan. Käyttäjän koodin tulee määritellä tämä funktio, ja CanSat NeXT kutsuu sitä automaattisesti, kun dataa vastaanotetaan. |

### onBinaryDataReceived

| Funktio              | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                             |
| **Parametrit**       |                                                                    |
|                      | `const uint8_t *data`: Vastaanotettu data uint8_t-taulukkona.          |
|                      | `uint16_t len`: Vastaanotetun datan pituus tavuina.                      |
| **Käytetty esimerkkiluonnoksessa** | Ei käytössä                                                 |
| **Kuvaus**           | Tämä on samanlainen kuin `onDataReceived`-funktio, mutta data tarjotaan binäärimuodossa String-objektin sijaan. Tämä on tarkoitettu edistyneille käyttäjille, jotka kokevat String-objektin rajoittavaksi. |

### onDataSent

| Funktio              | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                             |
| **Parametrit**       |                                                                    |
|                      | `const bool success`: Boolen arvo, joka osoittaa, lähetettiinkö data onnistuneesti. |
| **Käytetty esimerkkiluonnoksessa** | Ei käytössä                                                 |
| **Kuvaus**           | Tämä on toinen palautefunktio, joka voidaan lisätä käyttäjän koodiin tarvittaessa. Sitä voidaan käyttää tarkistamaan, tunnustettiinko vastaanotto toisella radiolla. |


### getRSSI

| Funktio              | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `int8_t`                                                          |
| **Palautusarvo**     | Viimeksi vastaanotetun viestin RSSI. Palauttaa 1, jos viestejä ei ole vastaanotettu käynnistyksen jälkeen.                           |
| **Käytetty esimerkkiluonnoksessa** | Ei käytössä                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää vastaanoton signaalin voimakkuuden seuraamiseen. Sitä voidaan käyttää antennien testaamiseen tai radiokantaman arvioimiseen. Arvo ilmaistaan [dBm](https://en.wikipedia.org/wiki/DBm)-yksiköissä, mutta asteikko ei ole tarkka.  |

### sendData (String-muunnelma)

| Toiminto             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | 0, jos data lähetettiin (ei osoita kuittausta).                   |
| **Parametrit**       |                                                                    |
|                      | `T data`: Lähetettävä data. Mitä tahansa datatyyppiä voidaan käyttää, mutta se muunnetaan sisäisesti merkkijonoksi.                  |
| **Käytetty esimerkkiohjelmassa** | Send_data                                             |
| **Kuvaus**           | Tämä on päätoiminto datan lähettämiseen maanpäällisen aseman ja satelliitin välillä. Huomaa, että palautusarvo ei osoita, vastaanotettiinko data, vaan ainoastaan, että se lähetettiin. Callback-funktiota `onDataSent` voidaan käyttää tarkistamaan, vastaanotettiinko data toisessa päässä. |

### sendData (Binäärinen variantti)

| Toiminto             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                          |
| **Palautusarvo**     | 0, jos data lähetettiin (ei osoita kuittausta).                   |
| **Parametrit**       |                                                                    |
|                      | `T* data`: Lähetettävä data.                    |
|                      | `uint16_t len`: Datan pituus tavuina.                             |
| **Käytetty esimerkkiohjelmassa** | Ei käytetty                                                 |
| **Kuvaus**           | `sendData`-funktion binäärinen variantti, joka on tarkoitettu edistyneille käyttäjille, jotka kokevat String-objektin rajoittavaksi. |

### getRSSI

| Toiminto             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `int8_t`                                                          |
| **Palautusarvo**     | Viimeksi vastaanotetun viestin RSSI. Palauttaa 1, jos viestejä ei ole vastaanotettu käynnistyksen jälkeen.                           |
| **Käytetty esimerkkiohjelmassa** | Ei käytetty                                                  |
| **Kuvaus**           | Tätä funktiota voidaan käyttää vastaanoton signaalin voimakkuuden seuraamiseen. Sitä voidaan käyttää antennien testaamiseen tai radioalueen arvioimiseen. Arvo ilmaistaan [dBm](https://en.wikipedia.org/wiki/DBm), mutta asteikko ei ole tarkka. 

### setRadioChannel

| Toiminto             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                          |
| **Palautusarvo**     | Ei mitään                                                        |
| **Parametrit**       | `uint8_t newChannel`: Haluttu Wi-Fi-kanavan numero (1–11). Kaikki arvot yli 11 rajataan arvoon 11. |
| **Käytetty esimerkkiohjelmassa** | Ei käytetty                                                      |
| **Kuvaus**           | Asettaa ESP-NOW-kommunikaatiokanavan. Uuden kanavan tulee olla standardien Wi-Fi-kanavien (1–11) sisällä, jotka vastaavat taajuuksia alkaen 2.412 GHz 5 MHz välein. Kanava 1 on 2.412, Kanava 2 on 2.417 ja niin edelleen. Kutsu tämä funktio ennen kirjaston alustamista. Oletuskanava on 1. |

### getRadioChannel

| Funktio              | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Palautustyyppi**   | `uint8_t`                                                       |
| **Palautusarvo**     | Nykyinen ensisijainen Wi-Fi-kanava. Palauttaa 0, jos kanavan hakemisessa tapahtuu virhe. |
| **Käytetty esimerkkiohjelmassa** | Ei käytetty                                          |
| **Kuvaus**           | Hakee parhaillaan käytössä olevan ensisijaisen Wi-Fi-kanavan. Tämä funktio toimii vain kirjaston alustamisen jälkeen. |

### printRadioFrequency

| Funktio              | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Palautustyyppi**   | `void`                                                          |
| **Palautusarvo**     | Ei mitään                                                       |
| **Käytetty esimerkkiohjelmassa** | Ei käytetty                                          |
| **Kuvaus**           | Laskee ja tulostaa nykyisen taajuuden GHz:inä aktiivisen Wi-Fi-kanavan perusteella. Tämä funktio toimii vain kirjaston alustamisen jälkeen. |

## ADC-funktiot

### adcToVoltage

| Funktio              | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                            |
| **Palautusarvo**     | Muunnettu jännite voltoissa.                                       |
| **Parametrit**       |                                                                    |
|                      | `int value`: ADC-lukema, joka muunnetaan jännitteeksi.             |
| **Käytetty esimerkkiohjelmassa** | AccurateAnalogRead                                    |
| **Kuvaus**           | Tämä funktio muuntaa ADC-lukeman jännitteeksi käyttäen kalibroitua kolmannen asteen polynomia lineaarisemman muunnoksen aikaansaamiseksi. Huomaa, että tämä funktio laskee jännitteen tuloportissa, joten akun jännitteen laskemiseksi sinun on otettava huomioon myös vastusverkko. |

### analogReadVoltage

| Funktio              | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Palautustyyppi**   | `float`                                                            |
| **Palautusarvo**     | ADC-jännite voltoissa.                                             |
| **Parametrit**       |                                                                    |
|                      | `int pin`: Luettava pinni.                                         |
| **Käytetty esimerkkiohjelmassa** | AccurateAnalogRead                                    |
| **Kuvaus**           | Tämä funktio lukee jännitteen suoraan ilman `analogRead`-käyttöä ja muuntaa lukeman jännitteeksi sisäisesti käyttäen `adcToVoltage`. |