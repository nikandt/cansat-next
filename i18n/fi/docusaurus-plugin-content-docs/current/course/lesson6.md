---
sidebar_position: 6
---

# Oppitunti 6: Yhteydenotto kotiin

Nyt olemme tehneet mittauksia ja tallentaneet ne SD-kortille. Seuraava looginen askel on lähettää ne langattomasti maahan, mikä avaa täysin uuden maailman mittausten ja kokeiden suhteen, joita voimme suorittaa. Esimerkiksi kokeilu nollapainovoimalennolla IMU:n kanssa olisi ollut huomattavasti mielenkiintoisempaa (ja helpompaa kalibroida), jos olisimme voineet nähdä tiedot reaaliajassa. Katsotaanpa, miten voimme tehdä sen!

Tässä oppitunnissa lähetämme mittauksia CanSat NeXT:stä maa-aseman vastaanottimeen. Myöhemmin tarkastelemme myös CanSat:n komentamista maa-aseman lähettämillä viesteillä.

## Antennit

Ennen tämän oppitunnin aloittamista varmista, että sinulla on jonkinlainen antenni kytkettynä CanSat NeXT -levyyn ja maa-asemaan.

:::note

Älä koskaan yritä lähettää mitään ilman antennia. Ei ainoastaan todennäköisesti toimi, vaan on myös mahdollista, että heijastunut teho vahingoittaa lähetintä.

:::

Koska käytämme 2.4 GHz:n taajuusaluetta, jota jakavat järjestelmät kuten Wi-Fi, Bluetooth, ISM, dronet jne., on saatavilla paljon kaupallisia antenneja. Useimmat Wi-Fi-antennit toimivat todella hyvin CanSat NeXT:n kanssa, mutta tarvitset usein sovittimen kytkeäksesi ne CanSat NeXT -levyyn. Olemme myös testanneet joitakin sovitinmalleja, jotka ovat saatavilla verkkokaupassa.

Lisätietoja antenneista löytyy laitteiston dokumentaatiosta: [Viestintä ja antennit](./../CanSat-hardware/communication.md). Tässä artikkelissa on myös [ohjeet](./../CanSat-hardware/communication.md#building-a-quarter-wave-monopole-antenna) oman antennin rakentamiseen CanSat NeXT -paketin materiaaleista.

## Datan lähettäminen

Kun keskustelu antenneista on saatu päätökseen, aloitetaan bittien lähettäminen. Aloitamme jälleen katsomalla asetuksia, joissa on tällä kertaa keskeinen ero - olemme lisänneet numeron **argumentiksi** `CanSatInit()`-komentoon.

```Cpp title="Asetukset lähettämistä varten"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Numeron arvon välittäminen `CanSatInit()`-funktiolle kertoo CanSat NeXT:lle, että haluamme nyt käyttää radiota. Numero ilmaisee MAC-osoitteen viimeisen tavun arvon. Voit ajatella sitä avaimena omaan verkkoosi - voit kommunikoida vain CanSat:ien kanssa, jotka jakavat saman avaimen. Tämä numero tulisi jakaa CanSat NeXT:si ja maa-asemasi välillä. Voit valita suosikkinumerosi välillä 0 ja 255. Valitsin 28, koska se on [täydellinen](https://en.wikipedia.org/wiki/Perfect_number).

Kun radio on alustettu, datan lähettäminen on todella yksinkertaista. Se toimii itse asiassa aivan kuten `appendFile()`, jota käytimme viime oppitunnissa - voit lisätä minkä tahansa arvon ja se lähettää sen oletusmuodossa, tai voit käyttää muotoiltua merkkijonoa ja lähettää sen sijaan.

```Cpp title="Datan lähettäminen"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Tällä yksinkertaisella koodilla lähetämme nyt LDR-mittauksen lähes 10 kertaa sekunnissa. Seuraavaksi katsotaan, miten se vastaanotetaan.

:::note

Ne, jotka ovat perehtyneet matalan tason ohjelmointiin, saattavat tuntea olonsa mukavammaksi lähettäessään dataa binäärimuodossa. Älä huoli, olemme ottaneet tämän huomioon. Binäärikomennot on lueteltu [Kirjaston määrittelyssä](./../CanSat-software/library_specification.md#senddata-binary-variant).

:::

## Datan vastaanottaminen

Tämä koodi tulisi nyt ohjelmoida toiseen ESP32:een. Yleensä se on toinen ohjainlevy, joka sisältyy pakettiin, mutta melkein mikä tahansa muu ESP32 toimii myös - mukaan lukien toinen CanSat NeXT.

:::note

Jos käytät ESP32-kehityskorttia maa-asemana, muista painaa Boot-painiketta kortilla, kun lataat IDE:stä. Tämä asettaa ESP32:n oikeaan käynnistystilaan prosessorin uudelleenohjelmointia varten. CanSat NeXT tekee tämän automaattisesti, mutta kehityskortit eivät useimmiten tee.

:::

Asetuskoodi on täsmälleen sama kuin aiemmin. Muista vain vaihtaa radioavain suosikkinumeroosi.

```Cpp title="Asetukset vastaanottamista varten"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Sen jälkeen asiat muuttuvat hieman. Teemme täysin tyhjän loop-funktion! Tämä johtuu siitä, että meillä ei ole mitään tehtävää loopissa, vaan vastaanotto tapahtuu **takaisinkutsuilla**.

```Cpp title="Takaisinkutsun asettaminen"
void loop() {
  // Meillä ei ole mitään tehtävää loopissa.
}

// Tämä on takaisinkutsufunktio. Se suoritetaan aina, kun radio vastaanottaa dataa.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Siinä missä `setup()`-funktio suoritetaan vain kerran alussa ja `loop()` suoritetaan jatkuvasti, `onDataReceived()`-funktio suoritetaan vain, kun radio on vastaanottanut uutta dataa. Tällä tavalla voimme käsitellä dataa takaisinkutsufunktiossa. Tässä esimerkissä vain tulostamme sen, mutta voisimme myös muokata sitä haluamallamme tavalla.

Huomaa, että `loop()`-funktion ei *tarvitse* olla tyhjä, voit itse asiassa käyttää sitä mihin tahansa haluat yhdellä varauksella - viiveitä tulisi välttää, sillä `onDataReceived()`-funktio ei myöskään suoriteta ennen kuin viive on ohi.

Jos nyt molemmat ohjelmat ovat käynnissä eri levyillä samanaikaisesti, pitäisi olla melko paljon mittauksia, jotka lähetetään langattomasti tietokoneellesi.

:::note

Binäärisuuntautuneille - voit käyttää takaisinkutsufunktiota onBinaryDataReceived.

:::

## Reaaliaikainen nollapainovoima

Ihan huvin vuoksi, toistetaan nollapainovoimakoe, mutta radioiden kanssa. Vastaanotinkoodi voi pysyä samana, kuten itse asiassa myös CanSat-koodin asetus.

Muistutuksena, teimme ohjelman IMU-oppitunnissa, joka havaitsi vapaapudotuksen ja sytytti LEDin tässä tilanteessa. Tässä on vanha koodi:

```Cpp title="Vapaapudotuksen havaitseva loop-funktio"
unsigned long LEDOnTill = 0;

void loop() {
  // Lue kiihtyvyys
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Laske kokonaiskiihtyvyys (neliöity)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Päivitä ajastin, jos havaitsemme pudotuksen
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Ohjaa LEDiä ajastimen perusteella
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

On houkuttelevaa lisätä `sendData()` suoraan vanhaan esimerkkiin, mutta meidän on otettava huomioon ajoitus. Emme yleensä halua lähettää viestejä yli ~20 kertaa sekunnissa, mutta toisaalta haluamme, että loop pyörii jatkuvasti, jotta LED syttyy edelleen.

Meidän on lisättävä toinen ajastin - tällä kertaa lähettämään dataa joka 50 millisekunti. Ajastin tehdään vertaamalla nykyistä aikaa viimeiseen aikaan, jolloin data lähetettiin. Viimeinen aika päivitetään sitten joka kerta, kun data lähetetään. Katso myös, miten merkkijono tehdään täällä. Se voitaisiin myös lähettää osissa, mutta tällä tavalla se vastaanotetaan yhtenä viestinä, useiden viestien sijaan.

```Cpp title="Vapaapudotuksen havaitseminen + datan lähettäminen"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Lue kiihtyvyys
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Laske kokonaiskiihtyvyys (neliöity)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Päivitä ajastin, jos havaitsemme pudotuksen
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Ohjaa LEDiä ajastimen perusteella
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Päivitä viimeinen lähetysaika nykyiseen aikaan
    lastSendTime = millis();
  }

}
```

Datan muoto on itse asiassa jälleen yhteensopiva sarjakuvaajan kanssa - kun katsotaan näitä tietoja, on melko selvää, miksi pystyimme havaitsemaan vapaapudotuksen aiemmin niin selkeästi - arvot todella putoavat nollaan heti, kun laite pudotetaan tai heitetään.

---

Seuraavassa osiossa pidämme lyhyen tauon tarkistaaksemme, mitä olemme oppineet tähän mennessä, ja varmistaaksemme, että olemme valmiita jatkamaan näiden käsitteiden kehittämistä.

[Napsauta tästä ensimmäiseen tarkistukseen!](./review1)