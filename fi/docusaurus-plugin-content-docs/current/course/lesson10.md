---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Oppitunti 10: Jaa ja hallitse

Kun projektimme muuttuvat yksityiskohtaisemmiksi, koodin hallinta voi muuttua vaikeaksi, ellemme ole varovaisia. Tässä oppitunnissa tarkastelemme joitakin käytäntöjä, jotka auttavat pitämään suuremmat projektit hallittavina. Näihin kuuluu koodin jakaminen useisiin tiedostoihin, riippuvuuksien hallinta ja lopuksi versionhallinnan käyttöönotto muutosten seuraamiseksi, koodin varmuuskopioimiseksi ja yhteistyön helpottamiseksi.

## Koodin jakaminen useisiin tiedostoihin

Pienissä projekteissa kaiken lähdekoodin pitäminen yhdessä tiedostossa saattaa tuntua hyvältä, mutta projektin laajentuessa asiat voivat muuttua sekaviksi ja vaikeasti hallittaviksi. Hyvä käytäntö on jakaa koodi eri tiedostoihin toiminnallisuuden perusteella. Kun tämä tehdään hyvin, se tuottaa myös mukavia pieniä moduuleja, joita voit käyttää uudelleen eri projekteissa ilman, että tarpeettomia komponentteja tuodaan muihin projekteihin. Useiden tiedostojen yksi suuri etu on myös se, että se helpottaa yhteistyötä, kun muut ihmiset voivat työskennellä muissa tiedostoissa, mikä auttaa välttämään tilanteita, joissa koodia on vaikea yhdistää.

Seuraava teksti olettaa, että käytät Arduino IDE 2:ta. Edistyneet käyttäjät saattavat tuntea olonsa kotoisammaksi järjestelmissä, kuten [Platformio](https://platformio.org/), mutta nämä käyttäjät ovat jo tuttuja näiden käsitteiden kanssa.

Arduino IDE 2:ssa kaikki projektikansion tiedostot näytetään IDE:n välilehtinä. Uusia tiedostoja voidaan luoda suoraan IDE:ssä tai käyttöjärjestelmän kautta. On olemassa kolme erilaista tiedostotyyppiä, **otsikot** `.h`, **lähdetiedostot** `.cpp` ja **Arduino-tiedostot** `.ino`.  

Näistä kolmesta Arduino-tiedostot ovat helpoimpia ymmärtää. Ne ovat yksinkertaisesti ylimääräisiä tiedostoja, jotka kopioidaan pää `.ino` -skriptisi loppuun käännettäessä. Näin voit helposti käyttää niitä luomaan ymmärrettävämpiä koodirakenteita ja ottaa kaiken tilan, jota tarvitset monimutkaiselle funktiolle, ilman että lähdetiedosto muuttuu vaikealukuiseksi. Paras lähestymistapa on yleensä ottaa yksi toiminnallisuus ja toteuttaa se yhdessä tiedostossa. Voit esimerkiksi olla erillinen tiedosto jokaiselle toimintatilalle, yksi tiedosto tiedonsiirroille, yksi tiedosto komentojen tulkinnalle, yksi tiedosto tiedon tallennukselle ja yksi pääasiallinen tiedosto, jossa yhdistät kaiken toimivaksi skriptiksi.

Otsikot ja lähdetiedostot ovat hieman erikoistuneempia, mutta onneksi ne toimivat aivan kuten C++:ssa muuallakin, joten niiden käytöstä on kirjoitettu paljon materiaalia, esimerkiksi [täällä](https://www.learncpp.com/cpp-tutorial/header-files/).

## Esimerkkirakenne

Esimerkkinä otetaan sotkuinen koodi [Oppitunti 8](./lesson8.md) ja refaktoroidaan se.

<details>
  <summary>Alkuperäinen sotkuinen koodi Oppitunti 8:sta</summary>
  <p>Tässä on koko koodi turhautumisellesi.</p>
```Cpp title="Satelliitti, jossa on useita tiloja"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // tuntematon tila
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Odotetaan...");
  sendData("Odotetaan...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Tämä ei ole edes kovin paha, mutta voit nähdä, kuinka se voisi muuttua vakavasti vaikealukuiseksi, jos laajentaisimme toiminnallisuuksia tai lisäisimme uusia komentoja tulkittavaksi. Sen sijaan jaetaan tämä siisteihin erillisiin kooditiedostoihin erillisten toiminnallisuuksien perusteella.

Erottelin jokaisen toimintatilan omaan tiedostoonsa, lisäsin tiedoston komentojen tulkinnalle ja lopuksi tein pienen apuohjelmatiedoston, joka sisältää toiminnallisuutta, jota tarvitaan monissa paikoissa. Tämä on melko tyypillinen yksinkertainen projektirakenne, mutta tekee jo ohjelmasta kokonaisuutena paljon helpommin ymmärrettävän. Tämä voidaan edelleen parantaa hyvällä dokumentaatiolla ja tekemällä esimerkiksi kaavio, joka näyttää, miten tiedostot liittyvät toisiinsa.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Pääsketsi"
#include "CanSatNeXT.h"

int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Esilaukaisutila"
void preLaunch() {
  Serial.println("Odotetaan...");
  sendData("Odotetaan...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Lentotila"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Palautustila"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Komentojen tulkinta"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Apuohjelmat"
bool LED_IS_ON = false;

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```
  </TabItem>

</Tabs>

Vaikka tämä lähestymistapa on jo huomattavasti parempi kuin kaiken yhdistäminen yhteen tiedostoon, se vaatii silti huolellista hallintaa. Esimerkiksi **nimetila** on jaettu eri tiedostojen välillä, mikä voi aiheuttaa sekaannusta suuremmassa projektissa tai kun käytetään koodia uudelleen. Jos funktioilla tai muuttujilla on samat nimet, koodi ei tiedä, mitä käyttää, mikä johtaa ristiriitoihin tai odottamattomaan käyttäytymiseen.

Lisäksi tämä lähestymistapa ei sovellu hyvin **kapselointiin**, joka on avainasemassa modulaarisemman ja uudelleenkäytettävämmän koodin rakentamisessa. Kun kaikki funktiot ja muuttujat ovat samassa globaalissa tilassa, on vaikeampaa estää yhtä osaa koodista vaikuttamasta tahattomasti toiseen. Tässä kohtaa kehittyneemmät tekniikat, kuten nimetilat, luokat ja olio-ohjelmointi (OOP), tulevat kuvaan. Nämä jäävät tämän kurssin ulkopuolelle, mutta yksittäistä tutkimusta näistä aiheista suositellaan.


:::tip[Harjoitus]

Ota yksi aiemmista projekteistasi ja anna sille kasvojenkohotus! Jaa koodisi useisiin tiedostoihin ja järjestä funktiosi niiden roolien perusteella (esim. anturien hallinta, tiedon käsittely, viestintä). Katso, kuinka paljon siistimpi ja helpommin hallittava projektisi tulee!

:::


## Versionhallinta

Kun projektit kasvavat — ja erityisesti kun useat ihmiset työskentelevät niiden parissa — on helppo menettää muutosten hallinta tai vahingossa ylikirjoittaa (tai kirjoittaa uudelleen) koodia. Tässä kohtaa **versionhallinta** astuu kuvaan. **Git** on teollisuuden standardi versionhallintatyökalu, joka auttaa seuraamaan muutoksia, hallitsemaan versioita ja organisoimaan suuria projekteja useiden yhteistyökumppaneiden kanssa.

Gitin oppiminen saattaa tuntua pelottavalta ja jopa turhalta pienissä projekteissa, mutta voin luvata, että kiität itseäsi sen oppimisesta. Myöhemmin ihmettelet, miten olet koskaan pärjännyt ilman sitä!

Tässä on hyvä paikka aloittaa: [Aloittaminen Gitin kanssa](https://docs.github.com/en/get-started/getting-started-with-git).

Saatavilla on useita Git-palveluita, joista suosituimpia ovat:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub on vankka valinta sen suosion ja saatavilla olevan tuen runsauden vuoksi. Itse asiassa tämä verkkosivu ja [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) -kirjastot ovat isännöity GitHubissa.

Git ei ole vain kätevä — se on olennainen taito kenelle tahansa, joka työskentelee ammattimaisesti tekniikan tai tieteen parissa. Useimmat tiimit, joissa olet mukana, käyttävät Gitiä, joten on hyvä idea tehdä sen käytöstä tuttu tapa.

Lisää Git-opetusohjelmia:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)



:::tip[Harjoitus]

Perusta Git-repositorio CanSat-projektillesi ja työnnä koodisi uuteen repositorioon. Tämä auttaa sinua kehittämään ohjelmistoa sekä satelliitille että maaasemalle järjestelmällisellä, yhteistyöhön perustuvalla tavalla.

:::

---

Seuraavassa oppitunnissa puhumme erilaisista tavoista laajentaa CanSat ulkoisilla antureilla ja muilla laitteilla.

[Napsauta tästä seuraavaan oppituntiin!](./lesson11)