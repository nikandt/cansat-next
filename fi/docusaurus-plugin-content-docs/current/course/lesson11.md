---
sidebar_position: 12
---

# Oppitunti 11: Satelliitin on kasvettava

Vaikka CanSat NeXT:ssä on jo monia integroituja antureita ja laitteita satelliittikortilla itsessään, monet jännittävät CanSat-tehtävät vaativat muiden ulkoisten antureiden, servojen, kameroiden, moottoreiden tai muiden toimilaitteiden ja laitteiden käyttöä. Tämä oppitunti on hieman erilainen kuin aiemmat, sillä keskustelemme erilaisten ulkoisten laitteiden integroinnista CanSat:iin. Todennäköisesti juuri sinun käyttötapaustasi ei ole huomioitu, mutta ehkä jotain vastaavaa on. Jos kuitenkin koet, että jotain pitäisi käsitellä täällä, lähetä palautetta minulle osoitteeseen samuli@kitsat.fi.

Tämä oppitunti on hieman erilainen kuin aiemmat, sillä vaikka kaikki tieto on hyödyllistä, voit vapaasti siirtyä suoraan niihin alueisiin, jotka ovat erityisesti relevantteja projektiisi, ja käyttää tätä sivua viitteenä. Ennen kuin jatkat tätä oppituntia, tutustu kuitenkin CanSat NeXT -dokumentaation [laitteisto](./../CanSat-hardware/CanSat-hardware.md) -osiossa esitettyihin materiaaleihin, sillä se kattaa paljon tietoa, joka on tarpeen ulkoisten laitteiden integroimiseksi.

## Ulkoisten laitteiden liittäminen

On kaksi hyvää tapaa liittää ulkoisia laitteita CanSat NeXT:iin: Käyttämällä [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) ja mukautettuja piirilevyjä. Oman piirilevyn tekeminen on helpompaa (ja halvempaa) kuin ehkä ajattelet, ja hyvä lähtökohta niiden aloittamiseen on tämä [KiCAD-opas](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Meillä on myös [malli](../CanSat-hardware/mechanical_design.md#designing-a-custom-pcb) saatavilla KiCAD:ille, joten piirilevyjen tekeminen samaan muotoon on erittäin helppoa.

Tästä huolimatta, useimmissa CanSat-tehtävissä ulkoisten antureiden tai muiden laitteiden juottaminen perf-levylle on loistava tapa luoda luotettavia, tukevia elektroniikkapinoja.

Vielä helpompi tapa aloittaa, erityisesti ensimmäistä kertaa prototyyppiä tehdessä, on käyttää hyppylankoja (kutsutaan myös Dupont-kaapeleiksi tai koekytkentälevykaapeleiksi). Ne toimitetaan yleensä jopa anturien breakoutien mukana, mutta ne voidaan myös ostaa erikseen. Nämä jakavat saman 0,1 tuuman jaon, jota laajennusliittimen pinniotsikko käyttää, mikä tekee laitteiden liittämisestä kaapeleilla erittäin helppoa. Vaikka kaapelit ovat helppokäyttöisiä, ne ovat melko tilaa vieviä ja epäluotettavia. Tästä syystä kaapeleiden välttäminen CanSat:in lentomallissa on lämpimästi suositeltavaa.

## Virran jakaminen laitteille

CanSat NeXT käyttää 3,3 volttia kaikille omille laitteilleen, minkä vuoksi se on ainoa jännitelinja, joka on tarjolla laajennusliittimelle. Monet kaupalliset breakoutit, erityisesti vanhemmat, tukevat myös 5 voltin toimintaa, koska se on jännite, jota vanhat Arduinot käyttävät. Kuitenkin valtaosa laitteista tukee myös toimintaa suoraan 3,3 voltilla.

Niissä harvoissa tapauksissa, joissa 5 volttia on ehdottomasti tarpeen, voit sisällyttää **boost-muuntimen** piirilevylle. Valmiita moduuleja on saatavilla, mutta voit myös suoraan juottaa monia laitteita perf-levylle. Tästä huolimatta, yritä ensin käyttää laitetta 3,3 voltilla, sillä on hyvät mahdollisuudet, että se toimii.

Suositeltu maksimivirranotto 3,3 voltin linjasta on 300 mA, joten virtaa kuluttaville laitteille, kuten moottoreille tai lämmittimille, harkitse ulkoista virtalähdettä.

## Datalinjat

Laajennusliittimessä on yhteensä 16 pinniä, joista kaksi on varattu maadoitus- ja virtalinjoille. Loput ovat erilaisia tuloja ja lähtöjä, joista useimmilla on useita mahdollisia käyttötarkoituksia. Piirikortin pinout näyttää, mitä kukin pinni voi tehdä.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Kaikkia esillä olevia pinnejä voidaan käyttää yleiskäyttöisinä tuloina ja lähtöinä (GPIO), mikä tarkoittaa, että voit suorittaa `digitalWrite` ja `digitalRead` -toimintoja niiden kanssa koodissa.

### ADC

Pinneissä 33 ja 32 on analogia-digitaalimuunnin (ADC), mikä tarkoittaa, että voit käyttää `analogRead` (ja `adcToVoltage`) lukeaksesi jännitteen tästä pinnistä.

### DAC

Näitä pinnejä voidaan käyttää tietyn jännitteen luomiseen lähdössä. Huomaa, että ne tuottavat halutun jännitteen, mutta ne voivat tarjota vain hyvin pienen määrän virtaa. Näitä voitaisiin käyttää antureiden vertailupisteinä tai jopa äänilähtönä, mutta tarvitset vahvistimen (tai kaksi). Voit käyttää `dacWrite` kirjoittaaksesi jännitteen. CanSat-kirjastossa on myös esimerkki tästä.

### SPI

Sarjaperifeerinen liitäntä (SPI) on standardi datalinja, jota usein käyttävät Arduino-breakoutit ja vastaavat laitteet. SPI-laite tarvitsee neljä pinniä:

| **Pin Name**    | **Description**                                              | **Usage**                                                       |
|-----------------|--------------------------------------------------------------|-----------------------------------------------------------------|
| **MOSI**        | Main Out Secondary In                                         | Data lähetetään päälaiteesta (esim. CanSat) toissijaiseen laitteeseen. |
| **MISO**        | Main In Secondary Out                                         | Data lähetetään toissijaisesta laitteesta takaisin päälaiteeseen.      |
| **SCK**         | Serial Clock                                                  | Kellosignaali, jonka päälaite tuottaa synkronoidakseen viestinnän. |
| **SS/CS**       | Secondary Select/Chip Select                                  | Käytetään päälaiteen toimesta valitsemaan, minkä toissijaisen laitteen kanssa kommunikoidaan. |

Tässä päälaite on CanSat NeXT -kortti, ja toissijainen on mikä tahansa laite, jonka kanssa haluat kommunikoida. MOSI, MISO ja SCK pinnit voidaan jakaa useiden toissijaisten laitteiden kesken, mutta kaikilla niillä on oltava oma CS-pinni. CS-pinni voi olla mikä tahansa GPIO-pinni, minkä vuoksi sille ei ole omaa paikkaa väylässä.

(Huom: Vanhoissa materiaaleissa käytetään joskus termejä "master" ja "slave" viittaamaan pää- ja toissijaisiin laitteisiin. Nämä termit katsotaan nyt vanhentuneiksi.)

CanSat NeXT -kortilla SD-kortti käyttää samaa SPI-linjaa kuin laajennusliitin. Kun yhdistät toisen SPI-laitteen väylään, tällä ei ole merkitystä. Kuitenkin, jos SPI-pinnit käytetään GPIO:na, SD-kortti on käytännössä pois käytöstä.

SPI:n käyttämiseksi sinun on usein määritettävä, mitkä prosessorin pinnit käytetään. Yksi esimerkki voisi olla tällainen, jossa CanSat-kirjastossa mukana olevia **makroja** käytetään muiden pinien asettamiseen, ja pinni 12 asetetaan siruvalinnaksi.

```Cpp title="SPI-linjan alustaminen anturille"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Makrot `SPI_CLK`, `SPI_MOSI` ja `SPI_MISO` korvataan kääntäjän toimesta arvoilla 18, 23 ja 19.

### I2C

Inter-Integrated Circuit on toinen suosittu dataväyläprotokolla, jota käytetään erityisesti pienissä integroiduissa antureissa, kuten paineanturissa ja IMU:ssa CanSat NeXT -kortilla.

I2C on kätevä, koska se vaatii vain kaksi pinniä, SCL ja SDA. Ei ole erillistä siruvalintapinniä, vaan eri laitteet erotetaan eri **osoitteilla**, joita käytetään viestinnän luomiseen. Tällä tavalla voit olla useita laitteita samalla väylällä, kunhan niillä kaikilla on ainutlaatuinen osoite.

| **Pin Name** | **Description**          | **Usage**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **SDA**      | Serial Data Line          | Kaksisuuntainen datalinja, jota käytetään viestintään pää- ja toissijaisten laitteiden välillä. |
| **SCL**      | Serial Clock Line         | Kellosignaali, jonka päälaite tuottaa synkronoidakseen tiedonsiirron toissijaisten laitteiden kanssa. |

Barometri ja IMU ovat samalla I2C-väylällä kuin laajennusliitin. Tarkista näiden laitteiden osoitteet sivulta [On-Board sensors](../CanSat-hardware/on_board_sensors#inertial-measurement-unit). Samoin kuin SPI:ssä, voit käyttää näitä pinnejä muiden I2C-laitteiden liittämiseen, mutta jos niitä käytetään GPIO-pinneinä, IMU ja barometri ovat pois käytöstä.

Arduino-ohjelmoinnissa I2C:tä kutsutaan joskus `Wire`:ksi. Toisin kuin SPI:ssä, jossa pinout määritetään usein jokaiselle anturille, I2C:tä käytetään usein Arduinossa ensin luomalla datalinja ja sitten viittaamalla siihen jokaiselle anturille. Alla on esimerkki siitä, miten barometri alustetaan CanSat NeXT -kirjastossa:

```Cpp title="Toisen sarjalinjan alustaminen"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Joten ensin `Wire` alustetaan kertomalla sille oikeat I2C-pinnit. Makrot `I2C_SDA` ja `I2C_SCL`, jotka on asetettu CanSat NeXT -kirjastossa, korvataan kääntäjän toimesta arvoilla 22 ja 21.

### UART

Yleinen asynkroninen vastaanotin-lähetin (UART) on joillain tavoilla yksinkertaisin dataprotokolla, sillä se yksinkertaisesti lähettää datan binäärinä tietyllä taajuudella. Tämän vuoksi se on rajoitettu pisteestä pisteeseen -viestintään, mikä tarkoittaa, että et yleensä voi olla useita laitteita samalla väylällä.

| **Pin Name** | **Description**          | **Usage**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **TX**       | Transmit                  | Lähettää dataa päälaiteesta toissijaiseen laitteeseen.       |
| **RX**       | Receive                   | Vastaanottaa dataa toissijaisesta laitteesta päälaiteeseen.    |

CanSat:issa UART laajennusliittimessä ei käytetä mihinkään muuhun. On kuitenkin toinen UART-linja, mutta sitä käytetään USB-viestintään satelliitin ja tietokoneen välillä. Tätä käytetään, kun dataa lähetetään `Serial`:iin.

Toinen UART-linja voidaan alustaa koodissa näin:

```Cpp title="Toisen sarjalinjan alustaminen"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Jotkut laitteet käyttävät myös [pulssinleveysmodulaatiota](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) ohjaustulonaan. Sitä voidaan käyttää myös himmennettäville LED-valoille tai ohjaamaan tehon ulostuloa joissain tilanteissa, monien muiden käyttötapojen joukossa.

Arduinolla vain tietyt pinnit voidaan käyttää PWM:ään. Kuitenkin, koska CanSat NeXT on ESP32-pohjainen laite, kaikkia lähtöpisteitä voidaan käyttää PWM-ulostulon luomiseen. PWM:ää ohjataan `analogWrite`:lla.

## Entä (minun erityinen käyttötapaukseni)?

Useimmille laitteille löydät paljon tietoa internetistä. Esimerkiksi, googlaa tietty breakout, joka sinulla on, ja käytä näitä asiakirjoja muokataksesi löytämäsi esimerkit CanSat NeXT:in kanssa käytettäväksi. Myös antureilla ja muilla laitteilla on **datalehdet**, joissa pitäisi olla paljon tietoa laitteen käytöstä, vaikka ne voivat olla joskus hieman vaikeaselkoisia. Jos koet, että tällä sivulla pitäisi olla käsitelty jotain, kerrothan siitä minulle osoitteeseen samuli@kitsat.fi.

Seuraavassa, viimeisessä oppitunnissa, keskustelemme siitä, miten valmistella satelliittisi laukaisua varten.

[Napsauta tästä seuraavaan oppituntiin!](./lesson12)