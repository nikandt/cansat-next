---
sidebar_position: 10
---

# Oppitunti 9: Ykköset ja nollat

Tähän asti olemme käyttäneet tekstiä, kun tallennamme tai siirrämme dataa. Vaikka tämä tekee datan tulkitsemisesta helppoa, se on myös tehotonta. Tietokoneet käyttävät sisäisesti **binaarista** dataa, jossa data tallennetaan ykkösten ja nollien sarjoina. Tässä oppitunnissa tarkastelemme tapoja käyttää binaarista dataa CanSat NeXT:n kanssa ja keskustelemme, missä ja miksi se voi olla hyödyllistä.

:::info

## Eri tietotyypit

Binaarimuodossa kaikki data—olipa kyseessä numerot, teksti tai sensorilukemat—esitetään ykkösten ja nollien sarjana. Eri tietotyypit käyttävät eri määrän muistia ja tulkitsevat binaariluvut tietyillä tavoilla. Katsotaanpa lyhyesti joitakin yleisiä tietotyyppejä ja miten ne tallennetaan binaarimuodossa:

- **Integer (int)**:  
  Kokonaisluvut edustavat kokonaislukuja. Esimerkiksi 16-bittisessä kokonaisluvussa 16 ykköstä ja nollaa voivat edustaa arvoja \(-32,768\) - \(32,767\). Negatiiviset luvut tallennetaan menetelmällä, jota kutsutaan **kaksikomplementiksi**.

- **Unsigned Integer (uint)**:  
  Merkitsemättömät kokonaisluvut edustavat ei-negatiivisia lukuja. 16-bittinen merkitsemätön kokonaisluku voi tallentaa arvoja \(0\) - \(65,535\), koska yhtään bittiä ei ole varattu merkille.

- **Float**:  
  Liukuluvut edustavat desimaalilukuja. 32-bittisessä liukuluvussa osa biteistä edustaa merkkiä, eksponenttia ja mantissaa, mikä mahdollistaa tietokoneiden käsitellä erittäin suuria ja pieniä lukuja. Se on pohjimmiltaan binaarimuoto [tieteellisestä merkintätavasta](https://en.wikipedia.org/wiki/Scientific_notation).

- **Merkit (char)**:  
  Merkit tallennetaan käyttämällä koodausjärjestelmiä kuten **ASCII** tai **UTF-8**. Jokainen merkki vastaa tiettyä binaarista arvoa (esim. 'A' ASCII:ssa tallennetaan muodossa `01000001`).

- **Merkkijonot**:  
  Merkkijonot ovat yksinkertaisesti merkkien kokoelmia. Jokainen merkkijonon merkki tallennetaan peräkkäin yksittäisinä binaariarvoina. Esimerkiksi merkkijono `"CanSat"` tallennettaisiin merkkisarjana kuten `01000011 01100001 01101110 01010011 01100001 01110100` (jokainen edustaa 'C', 'a', 'n', 'S', 'a', 't'). Kuten näet, lukujen esittäminen merkkijonoina, kuten olemme tähän asti tehneet, on vähemmän tehokasta verrattuna niiden tallentamiseen binaarimuodossa.

- **Taulukot ja `uint8_t`**:  
  Kun työskennellään binaarisen datan kanssa, on yleistä käyttää `uint8_t`-taulukkoa raakadatan tallentamiseen ja käsittelyyn. `uint8_t`-tyyppi edustaa merkitsemätöntä 8-bittistä kokonaislukua, joka voi sisältää arvoja 0:sta 255:een. Koska jokainen tavu koostuu 8 bitistä, tämä tyyppi soveltuu hyvin binaaridatan tallentamiseen.
  `uint8_t`-taulukoita käytetään usein luomaan tavupuskureita raakadatan (esim. pakettien) tallentamiseen. Jotkut suosivat `char`- tai muita muuttujia, mutta ei ole väliä, mitä käytetään, kunhan muuttujan pituus on 1 tavu.
:::

## Binaaridatan siirtäminen

Aloitetaan yksinkertaisen ohjelman lataamisella CanSatiin ja keskitytään enemmän maa-aseman puolelle. Tässä yksinkertainen koodi, joka lähettää lukeman binaarimuodossa:

```Cpp title="Lähetä LDR-data binaarina"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

Koodi näyttää muuten hyvin tutulta, mutta `sendData` ottaa nyt kaksi argumenttia yhden sijasta - ensin lähetettävän datan **muistiosoite** ja sitten lähetettävän datan **pituus**. Tässä yksinkertaistetussa tapauksessa käytämme vain muuttujan `LDR_voltage` osoitetta ja pituutta.

Jos yrität vastaanottaa tämän tyypillisellä maa-aseman koodilla, se tulostaa vain siansaksaa, koska se yrittää tulkita binaaridatan ikään kuin se olisi merkkijono. Sen sijaan meidän on määritettävä maa-asemalle, mitä data sisältää.

Ensiksi tarkistetaan, kuinka pitkä data on, jota vastaanotamme.

```Cpp title="Tarkista vastaanotetun datan pituus"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Vastaanotettu ");
  Serial.print(len);
  Serial.println(" tavua");
}
```

Joka kerta, kun satelliitti lähettää, vastaanotamme 4 tavua maa-asemalla. Koska lähetämme 32-bittistä liukulukua, tämä vaikuttaa oikealta.

Datan lukemiseksi meidän on otettava binaarinen datapuskuri syötevirrasta ja kopioitava data sopivaan muuttujaan. Tässä yksinkertaisessa tapauksessa voimme tehdä näin:

```Cpp title="Tallenna data muuttujaan"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Vastaanotettu ");
  Serial.print(len);
  Serial.println(" tavua");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Data: ");
  Serial.println(LDR_reading);
}
```

Ensin esitämme muuttujan `LDR_reading` pitämään dataa, jonka *tiedämme* olevan puskurissa. Sitten käytämme `memcpy` (muistikopio) kopioidaksemme binaaridatan `data`-puskurista `LDR_reading`:n **muistiosoitteeseen**. Tämä varmistaa, että data siirretään täsmälleen sellaisena kuin se oli tallennettu, säilyttäen saman muodon kuin satelliitissa.

Nyt, jos tulostamme datan, se on kuin lukisimme sen suoraan GS-puolella. Se ei ole enää tekstiä kuten ennen, vaan sama data, jonka luimme satelliitin puolella. Nyt voimme helposti käsitellä sitä GS-puolella haluamallamme tavalla.

## Oman protokollan luominen

Binaarisen datan siirron todellinen voima tulee esiin, kun meillä on enemmän dataa siirrettävänä. Meidän on kuitenkin edelleen varmistettava, että satelliitti ja maa-asema ovat yhtä mieltä siitä, mikä tavu edustaa mitä. Tätä kutsutaan **pakettiprotokollaksi**.

Pakettiprotokolla määrittelee siirrettävän datan rakenteen, määrittäen, kuinka pakata useita datakappaleita yhteen siirtoon ja kuinka vastaanottajan tulisi tulkita saapuvat tavut. Rakennetaan yksinkertainen protokolla, joka siirtää useita sensorilukemia rakenteellisella tavalla.

Ensin luetaan kaikki kiihtyvyysmittarin ja gyroskoopin kanavat ja luodaan **datapaketti** lukemista.

```Cpp title="Lähetä LDR-data binaarina"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Luo taulukko datan tallentamiseen
  uint8_t packet[24];

  // Kopioi data pakettiin
  memcpy(&packet[0], &ax, 4);  // Kopioi kiihtyvyysmittarin X tavuihin 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Kopioi gyroskoopin Z tavuihin 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Tässä luemme ensin datan aivan kuten oppitunnissa 3, mutta sitten **koodaamme** datan datapakettiin. Ensin luodaan varsinainen puskuri, joka on vain tyhjä 24 tavun joukko. Jokainen datamuuttuja voidaan sitten kirjoittaa tähän tyhjään puskuriin `memcpy`:llä. Koska käytämme `float`, datan pituus on 4 tavua. Jos et ole varma muuttujan pituudesta, voit aina tarkistaa sen `sizeof(variable)`-komennolla.

:::tip[Harjoitus]

Luo maa-aseman ohjelmisto tulkitsemaan ja tulostamaan kiihtyvyysmittarin ja gyroskoopin data.

:::

## Binaaridatan tallentaminen SD-kortille

Datan kirjoittaminen binaarina SD-kortille voi olla hyödyllistä, kun käsitellään erittäin suuria datamääriä, sillä binaarinen tallennus on kompaktimpaa ja tehokkaampaa kuin teksti. Tämä mahdollistaa enemmän datan tallentamisen vähemmällä tallennustilalla, mikä voi olla hyödyllistä muistin rajoittamissa järjestelmissä.

Kuitenkin binaaridatan käyttäminen tallennukseen tuo mukanaan kompromisseja. Toisin kuin tekstitiedostot, binaaritiedostot eivät ole ihmisen luettavissa, mikä tarkoittaa, että niitä ei voi helposti avata ja ymmärtää tavallisilla tekstieditoreilla tai tuoda ohjelmiin kuten Excel. Binaaridatan lukemiseen ja tulkitsemiseen tarvitaan erikoistuneita ohjelmistoja tai skriptejä (esim. Pythonissa), jotka pystyvät jäsentämään binaarimuodon oikein.

Useimmissa sovelluksissa, joissa pääsyn helppous ja joustavuus ovat tärkeitä (kuten datan analysointi myöhemmin tietokoneella), tekstipohjaiset muodot kuten CSV ovat suositeltavia. Nämä muodot ovat helpompia työstää erilaisissa ohjelmistotyökaluissa ja tarjoavat enemmän joustavuutta nopeaan data-analyysiin.

Jos olet sitoutunut käyttämään binaaritallennusta, tutustu syvällisemmin "konepellin alle" tarkastelemalla, miten CanSat-kirjasto käsittelee datan tallennusta sisäisesti. Voit käyttää suoraan C-tyylisiä tiedostojen käsittelymenetelmiä hallitaksesi tiedostoja, virtoja ja muita matalan tason operaatioita tehokkaasti. Lisätietoa löytyy myös [Arduino SD-korttikirjastosta](https://docs.arduino.cc/libraries/sd/).

---

Ohjelmamme alkavat muuttua yhä monimutkaisemmiksi, ja on myös joitakin komponentteja, joita olisi mukava käyttää uudelleen muualla. Välttääksemme koodimme vaikean hallittavuuden, olisi mukavaa voida jakaa joitakin komponentteja eri tiedostoihin ja pitää koodi luettavana. Katsotaanpa, miten tämä voidaan saavuttaa Arduino IDE:llä.

[Napsauta tästä seuraavaan oppituntiin!](./lesson10)