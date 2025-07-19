---
sidebar_position: 8
---

# Oppitunti 7: Palaute

CanSatit on usein ohjelmoitu toimimaan melko yksinkertaisella logiikalla - esimerkiksi ottamaan mittauksia joka n millisekunti, tallentamaan ja lähettämään tiedot ja toistamaan. Sen sijaan komentojen lähettäminen satelliitille sen käyttäytymisen muuttamiseksi kesken tehtävän voisi mahdollistaa paljon uusia mahdollisuuksia. Ehkä haluat kytkeä anturin päälle tai pois päältä tai käskeä satelliittia tekemään äänen, jotta voit löytää sen. Mahdollisuuksia on paljon, mutta ehkä hyödyllisin on kyky kytkeä virtaa kuluttavat laitteet satelliitissa päälle vasta juuri ennen raketin laukaisua, mikä antaa sinulle paljon enemmän joustavuutta ja vapautta toimia sen jälkeen, kun satelliitti on jo integroitu rakettiin.

Tässä oppitunnissa yritämme kytkeä LEDin päälle ja pois satelliittikortilla maaaseman kautta. Tämä edustaa tilannetta, jossa satelliitti ei tee mitään ilman, että sitä käsketään tekemään niin, ja sillä on yksinkertainen komentojärjestelmä.

:::info

## Ohjelmiston Takaisinkutsut

Tietojen vastaanotto CanSat-kirjastossa on ohjelmoitu **takaisinkutsuina**, mikä on funktio, joka kutsutaan... no, takaisin, kun tietty tapahtuma tapahtuu. Siinä missä tähän asti ohjelmissamme koodi on aina seurannut tarkasti kirjoittamiamme rivejä, nyt näyttää siltä, että se suorittaa satunnaisesti toisen funktion välillä ennen kuin jatkaa pääsilmukassa. Tämä saattaa kuulostaa hämmentävältä, mutta se on melko selkeää, kun sen näkee toiminnassa.

:::

## Etäohjattu Vilkku

Tässä harjoituksessa yritämme toistaa LEDin vilkkumisen ensimmäisestä oppitunnista, mutta tällä kertaa LEDiä ohjataan etänä.

Katsotaan ensin satelliitin puoleista ohjelmaa. Alustaminen on nyt hyvin tuttua, mutta silmukka on hieman yllättävämpi - siellä ei ole mitään. Tämä johtuu siitä, että kaikki logiikka käsitellään takaisinkutsufunktion kautta etänä maaasemalta, joten voimme vain jättää silmukan tyhjäksi.

Mielenkiintoisemmat asiat tapahtuvat funktiossa `onDataReceived(String data)`. Tämä on edellä mainittu takaisinkutsufunktio, joka on ohjelmoitu kirjastossa kutsuttavaksi aina, kun radio vastaanottaa tietoja. Funktion nimi on ohjelmoitu kirjastoon, joten niin kauan kuin käytät täsmälleen samaa nimeä kuin tässä, se kutsutaan, kun tietoja on saatavilla.

Alla olevassa esimerkissä tiedot tulostetaan joka kerta vain visualisoimaan, mitä tapahtuu, mutta LEDin tila myös muuttuu joka kerta, kun viesti vastaanotetaan, riippumatta sisällöstä.

```Cpp title="Satelliittikoodi, joka ei tee mitään ilman käskyä"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

Muuttuja `LED_IS_ON` on tallennettu globaalina muuttujana, mikä tarkoittaa, että se on käytettävissä mistä tahansa koodissa. Näitä yleensä paheksutaan ohjelmoinnissa, ja aloittelijoille opetetaan välttämään niitä ohjelmissaan. Kuitenkin _sulautetussa_ ohjelmoinnissa, kuten teemme täällä, ne ovat itse asiassa erittäin tehokas ja odotettu tapa tehdä tämä. Ole vain varovainen, ettet käytä samaa nimeä useissa paikoissa!

:::

Jos lataamme tämän CanSat NeXT -kortille ja käynnistämme sen... Mitään ei tapahdu. Tämä on tietysti odotettavissa, koska meillä ei ole tällä hetkellä mitään komentoja tulossa.

Maaaseman puolella koodi ei ole kovin monimutkainen. Alustamme järjestelmän ja sitten silmukassa lähetämme viestin joka 1000 ms, eli kerran sekunnissa. Nykyisessä ohjelmassa varsinaisella viestillä ei ole merkitystä, vaan ainoastaan sillä, että jotain lähetetään samassa verkossa.

```Cpp title="Maaasema lähettää viestejä"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Nyt kun ohjelmoimme tämän koodin maaasemalle (älä unohda painaa BOOT-painiketta) ja satelliitti on edelleen päällä, satelliitin LED alkaa vilkkua, syttyen ja sammuen jokaisen viestin jälkeen. Viesti tulostetaan myös terminaaliin.

:::tip[Harjoitus]

Lataa alla oleva koodinpätkä maaaseman kortille. Mitä tapahtuu satelliitin puolella? Voitko muuttaa satelliittiohjelmaa siten, että se reagoi kytkemällä LEDin päälle vain, kun vastaanotetaan `LED ON` ja pois päältä `LED OFF`, ja muuten vain tulostaa tekstin.

```Cpp title="Maaasema lähettää viestejä"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Generoi satunnainen indeksi viestin valitsemiseksi
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Lähetä satunnaisesti valittu viesti
  sendData(messages[randomIndex]);
}
```

:::

Huomaa myös, että viestien vastaanotto ei estä niiden lähettämistä, joten voimme (ja tulemme) lähettämään viestejä molemmista päistä samanaikaisesti. Satelliitti voi lähettää tietoja jatkuvasti, kun taas maaasema voi jatkaa komentojen lähettämistä satelliitille. Jos viestit ovat samanaikaisia (saman millisekunnin sisällä tai niin), voi tapahtua törmäys ja viesti ei mene perille. Kuitenkin CanSat NeXT lähettää viestin automaattisesti uudelleen, jos se havaitsee törmäyksen. Joten ole vain tietoinen, että se voi tapahtua, mutta että se todennäköisesti jää huomaamatta.

---

Seuraavassa oppitunnissa laajennamme tätä suorittamaan **virtauksen hallintaa** etänä tai muuttamaan satelliitin käyttäytymistä vastaanotettujen komentojen perusteella.

[Napsauta tästä seuraavaan oppituntiin!](./lesson8)