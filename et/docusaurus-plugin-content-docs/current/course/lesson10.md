---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Õppetund 10: Jaga ja valitse

Kui meie projektid muutuvad detailsemaks, võib kood muutuda raskesti hallatavaks, kui me pole ettevaatlikud. Selles õppetunnis vaatleme mõningaid praktikaid, mis aitavad suuremaid projekte hallatavana hoida. Nende hulka kuulub koodi jagamine mitmeks failiks, sõltuvuste haldamine ja lõpuks versioonikontrolli kasutuselevõtt, et jälgida muudatusi, varundada koodi ja aidata koostöös.

## Koodi jagamine mitmeks failiks

Väikestes projektides võib kogu lähtekoodi ühes failis hoidmine tunduda sobiv, kuid projekti kasvades võivad asjad muutuda segaseks ja raskesti hallatavaks. Hea tava on jagada kood erinevatesse failidesse vastavalt funktsionaalsusele. Kui see on hästi tehtud, toodab see ka ilusaid väikeseid mooduleid, mida saate erinevates projektides uuesti kasutada, ilma et teised projektid saaksid tarbetuid komponente. Mitme faili üks suur eelis on ka see, et see muudab koostöö lihtsamaks, kuna teised inimesed saavad töötada teistel failidel, aidates vältida olukordi, kus koodi on raske ühendada.

Järgmine tekst eeldab, et kasutate Arduino IDE 2. Edasijõudnud kasutajad võivad end kodusemalt tunda selliste süsteemidega nagu [Platformio](https://platformio.org/), kuid need teist on nende kontseptsioonidega juba tuttavad.

Arduino IDE 2-s kuvatakse kõik projektikaustas olevad failid IDE-s vahekaartidena. Uusi faile saab luua otse IDE-s või oma operatsioonisüsteemi kaudu. On olemas kolm erinevat tüüpi faile: **päised** `.h`, **lähtefailid** `.cpp` ja **Arduino failid** `.ino`.  

Nendest kolmest on Arduino failid kõige lihtsamini mõistetavad. Need on lihtsalt lisafailid, mis kompileerimisel kopeeritakse teie peamise `.ino` skripti lõppu. Seega saate neid hõlpsasti kasutada arusaadavamate koodistruktuuride loomiseks ja võtta kogu vajaliku ruumi keeruka funktsiooni jaoks, ilma et lähtefail muutuks raskesti loetavaks. Parim lähenemisviis on tavaliselt võtta üks funktsionaalsus ja rakendada see ühes failis. Nii võiks teil olla näiteks eraldi fail iga töörežiimi jaoks, üks fail andmeedastuste jaoks, üks fail käskude tõlgendamiseks, üks fail andmete salvestamiseks ja üks peamine fail, kus te kõik need funktsioonid funktsionaalseks skriptiks ühendate.

Päised ja lähtefailid on veidi spetsiifilisemad, kuid õnneks töötavad need samamoodi nagu C++ mujal, seega on nende kasutamise kohta palju materjali kirjutatud, näiteks [siin](https://www.learncpp.com/cpp-tutorial/header-files/).

## Näidisstruktuur

Näiteks võtame segase koodi [Õppetund 8](./lesson8.md) ja refaktoreerime selle.

<details>
  <summary>Algne segane kood Õppetund 8-st</summary>
  <p>Siin on kogu kood teie pettumuseks.</p>
```Cpp title="Satelliit mitme olekuga"
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
    // tundmatu režiim
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Ootan...");
  sendData("Ootan...");
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

See pole isegi nii halb, kuid näete, kuidas see võiks muutuda tõsiselt raskesti loetavaks, kui me funktsionaalsusi laiendaksime või uusi käske lisaksime. Selle asemel jagame selle eraldi koodifailideks vastavalt eraldi funktsionaalsustele.

Ma eraldasin iga töörežiimi omaette faili, lisasin faili käskude tõlgendamiseks ja lõpuks tegin väikese utiliitide faili, et hoida funktsionaalsust, mida on vaja paljudes kohtades. See on üsna tüüpiline lihtne projektistruktuur, kuid muudab programmi tervikuna juba palju lihtsamini mõistetavaks. Seda saab veelgi parandada hea dokumentatsiooni abil ja näiteks graafiku koostamisega, mis näitab, kuidas failid omavahel seotud on.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Peamine sketš"
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

```Cpp title="Eelkäivituse režiim"
void preLaunch() {
  Serial.println("Ootan...");
  sendData("Ootan...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Lennurežiim"
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

```Cpp title="Taastumisrežiim"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Käskude tõlgendamine"
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

```Cpp title="Utiliidid"
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

Kuigi see lähenemisviis on juba palju parem kui kogu koodi ühes failis hoidmine, nõuab see siiski hoolikat haldamist. Näiteks on **nimetühi** jagatud erinevate failide vahel, mis võib suuremas projektis või koodi taaskasutamisel segadust tekitada. Kui on olemas sama nimega funktsioone või muutujaid, ei tea kood, millist neist kasutada, mis viib konfliktide või ootamatu käitumiseni.

Lisaks ei soodusta see lähenemisviis hästi **kapseldamist** — mis on võtmetähtsusega modulaarsema ja taaskasutatava koodi loomisel. Kui teie funktsioonid ja muutujad eksisteerivad kõik samas globaalses ruumis, muutub raskemaks takistada ühel koodiosal teist tahtmatult mõjutamast. Siin tulevad mängu keerukamad tehnikad nagu nimetühikud, klassid ja objektorienteeritud programmeerimine (OOP). Need jäävad selle kursuse ulatusest välja, kuid individuaalne uurimistöö nendel teemadel on julgustatud.


:::tip[Harjutus]

Võtke üks oma varasematest projektidest ja andke sellele uus ilme! Jagage oma kood mitmeks failiks ja korraldage oma funktsioonid nende rollide järgi (nt andurite haldamine, andmete töötlemine, suhtlus). Vaadake, kui palju puhtamaks ja lihtsamini hallatavaks teie projekt muutub!

:::


## Versioonikontroll

Kui projektid kasvavad — ja eriti kui mitu inimest nendega töötavad — on lihtne kaotada ülevaade muudatustest või kogemata koodi üle kirjutada (või ümber kirjutada). Siin tuleb mängu **versioonikontroll**. **Git** on tööstusstandard versioonikontrolli tööriist, mis aitab jälgida muudatusi, hallata versioone ja korraldada suuri projekte mitme koostööpartneriga.

Giti õppimine võib tunduda hirmutav ja isegi väikeste projektide puhul üleliigne, kuid ma võin teile lubada, et te tänate ennast selle õppimise eest. Hiljem imestate, kuidas te üldse ilma selleta hakkama saite!

Siin on suurepärane koht alustamiseks: [Giti alustamine](https://docs.github.com/en/get-started/getting-started-with-git).

Saadaval on mitu Giti teenust, populaarsemad neist on:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub on kindel valik oma populaarsuse ja saadaval oleva toe rohkuse tõttu. Tegelikult on see veebileht ja [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) raamatukogud hostitud GitHubis.

Git pole mitte ainult mugav — see on hädavajalik oskus kõigile, kes töötavad professionaalselt inseneri- või teadusvaldkonnas. Enamik meeskondi, mille osa te olete, kasutavad Git'i, seega on hea mõte muuta selle kasutamine harjumuseks.

Rohkem õpetusi Git'i kohta:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)



:::tip[Harjutus]

Seadistage oma CanSat projekti jaoks Git'i hoidla ja lükake oma kood uude hoidlasse. See aitab teil arendada tarkvara nii satelliidi kui ka maajaama jaoks organiseeritud ja koostöövalmis viisil.

:::

---

Järgmises õppetunnis räägime erinevatest viisidest, kuidas CanSat'i laiendada väliste andurite ja muude seadmetega.

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson11)