---
sidebar_position: 9
---

# Oppitunti 8: Mene Virtauksen Mukaan

Tämän oppitunnin aiheena on virtauksen hallinta, eli miten voimme hallita, mitä prosessori tekee eri aikoina. Tähän asti suurin osa ohjelmistamme on keskittynyt yhteen tehtävään, mikä on yksinkertaista, mutta rajoittaa järjestelmän potentiaalia. Esittelemällä erilaisia **tiloja** ohjelmassamme voimme laajentaa sen kykyjä.

Esimerkiksi ohjelmalla voisi olla esilaukaisutila, jossa satelliitti odottaa laukaisua. Sitten se voisi siirtyä lentotilaan, jossa se lukee anturidataa ja suorittaa päätehtävänsä. Lopuksi voisi aktivoitua palautustila, jossa satelliitti lähettää signaaleja auttaakseen palautuksessa—vilkkuvia valoja, piippausta tai suorittamalla mitä tahansa järjestelmätoimintoja, jotka olemme suunnitelleet.

**Laukaisin** tilojen vaihtamiselle voi vaihdella. Se voi olla anturin lukema, kuten paineen muutos, ulkoinen komento, sisäinen tapahtuma (kuten ajastin) tai jopa satunnainen tapahtuma, riippuen siitä, mitä vaaditaan. Tässä oppitunnissa rakennamme aiemmin oppimamme päälle käyttämällä ulkoista komentoa laukaisimena.

## Virtauksen Hallinta Ulkoisilla Laukaisimilla

Ensiksi, muokataan maa-aseman koodia niin, että se voi vastaanottaa viestejä Sarjamonitorista, jotta voimme lähettää mukautettuja komentoja tarvittaessa.

Kuten näet, ainoat muutokset ovat pääsilmukassa. Ensin tarkistamme, onko Sarjasta vastaanotettu dataa. Jos ei, mitään ei tehdä ja silmukka jatkuu. Kuitenkin, jos dataa on, se luetaan muuttujaan, tulostetaan selkeyden vuoksi ja lähetetään sitten radion kautta satelliittiin. Jos sinulla on vielä edellisen oppitunnin ohjelma ladattuna satelliittiin, voit kokeilla sitä.

```Cpp title="Maa-asema, joka voi lähettää komentoja"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Sarja Sisään - Datalähteet

Kun luemme dataa `Serial`-objektista, pääsemme käsiksi UART RX -puskuriin tallennettuun dataan, joka välitetään USB Virtual Serial -yhteyden kautta. Käytännössä tämä tarkoittaa, että mikä tahansa ohjelmisto, joka kykenee kommunikoimaan virtuaalisen sarjaportin kautta, kuten Arduino IDE, terminaaliohjelmat tai erilaiset ohjelmointiympäristöt, voidaan käyttää datan lähettämiseen CanSatille.

Tämä avaa monia mahdollisuuksia CanSatin ohjaamiseen ulkoisista ohjelmista. Esimerkiksi voimme lähettää komentoja manuaalisesti kirjoittamalla ne, mutta myös kirjoittaa skriptejä Pythonilla tai muilla kielillä komentojen automatisoimiseksi, mikä mahdollistaa kehittyneempien ohjausjärjestelmien luomisen. Hyödyntämällä näitä työkaluja voit lähettää tarkkoja ohjeita, suorittaa testejä tai seurata CanSatia reaaliajassa ilman manuaalista puuttumista.

:::

Seuraavaksi katsotaan satelliitin puolta. Koska ohjelmassa on useita tiloja, se on hieman pidempi, mutta käydään se läpi vaihe vaiheelta.

Ensin alustamme järjestelmät tavalliseen tapaan. Lisäksi on pari globaalia muuttujaa, jotka sijoitamme tiedoston alkuun, jotta on helppo nähdä, mitä nimiä käytetään. `LED_IS_ON` on tuttu aiemmista koodiesimerkeistämme, ja lisäksi meillä on globaali tilamuuttuja `STATE`, joka tallentaa... no, tilan.

```Cpp title="Alustaminen"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Seuraavaksi silmukassa tarkistamme yksinkertaisesti, mikä aliohjelma tulisi suorittaa nykyisen tilan mukaan, ja kutsumme sen funktion:

```Cpp title="Silmukka"
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
```

Tässä tapauksessa jokainen tila on edustettuna erillisellä funktiolla, joka kutsutaan tilan perusteella. Funktioiden sisältö ei ole tässä kovin tärkeä, mutta tässä ne ovat:

```Cpp title="Aliohjelmat"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
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
```

On myös pieni apufunktio `blinkLED`, joka auttaa välttämään koodin toistoa käsittelemällä LEDin vaihtamista puolestamme.

Lopuksi tila muuttuu, kun maa-asema käskee:

```Cpp title="Komennon vastaanottamisen palautekutsu"
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

<details>
  <summary>Koko koodi</summary>
  <p>Tässä on koko koodi käteväksesi.</p>
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
  Serial.println("Waiting...");
  sendData("Waiting...");
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

Tämän avulla voimme nyt hallita, mitä satelliitti tekee ilman fyysistä pääsyä siihen. Sen sijaan voimme vain lähettää komennon maa-asemalta ja satelliitti tekee mitä haluamme.

:::tip[Harjoitus]

Luo ohjelma, joka mittaa anturia tietyllä taajuudella, jota voidaan muuttaa etäkomennolla mihin tahansa arvoon. Yritä muokata viivearvoa suoraan komennolla aliohjelmien sijaan.

Yritä myös tehdä siitä sietokykyinen odottamattomille syötteille, kuten "-1", "ABCDFEG" tai "".

Bonus-harjoituksena tee uusi asetus pysyväksi uudelleenkäynnistysten välillä, jotta kun satelliitti sammutetaan ja käynnistetään uudelleen, se jatkaa lähettämistä uudella taajuudella sen sijaan, että palaisi alkuperäiseen. Vihjeenä, [oppitunti 5](./lesson5.md) voi olla hyödyllinen.

:::

---

Seuraavassa oppitunnissa teemme datan tallennuksesta, viestinnästä ja käsittelystä merkittävästi tehokkaampaa ja nopeampaa käyttämällä binääridataa. Vaikka se saattaa aluksi tuntua abstraktilta, datan käsittely binäärinä numeroiden sijaan yksinkertaistaa monia tehtäviä, sillä se on tietokoneen oma kieli.

[Napsauta tästä seuraavaan oppituntiin!](./lesson9)