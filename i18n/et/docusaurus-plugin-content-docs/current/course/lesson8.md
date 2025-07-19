---
sidebar_position: 9
---

# Õppetund 8: Mine vooluga kaasa

Selle õppetunni teema on voolu juhtimine ehk kuidas me saame hallata, mida protsessor teeb erinevatel ajahetkedel. Seni on enamik meie programme keskendunud ühele ülesandele, mis on küll lihtne, kuid piirab süsteemi potentsiaali. Tutvustades oma programmis erinevaid **seisundeid**, saame selle võimekust laiendada.

Näiteks võiks programmil olla eelkäivituse seisund, kus satelliit ootab starti. Seejärel võiks see üle minna lennurežiimi, kus see loeb andureid ja täidab oma peamist missiooni. Lõpuks võiks aktiveeruda taastumisrežiim, kus satelliit saadab signaale, mis aitavad taastamisel—vilkuvad tuled, piiksumine või mis iganes süsteemitoimingud, mille oleme kavandanud.

**Päästik** seisundite vahel vahetumiseks võib varieeruda. See võib olla anduri näit, nagu rõhumuutus, väline käsk, sisemine sündmus (näiteks taimer) või isegi juhuslik esinemine, sõltuvalt vajadusest. Selles õppetunnis ehitame edasi sellele, mida oleme varem õppinud, kasutades päästikuna välist käsku.

## Voolu juhtimine väliste päästikutega

Esmalt muudame maajaama koodi, et see saaks Serial monitorilt sõnumeid vastu võtta, nii et saaksime vajadusel saata kohandatud käske.

Nagu näete, on ainsad muudatused põhisilmuses. Esiteks kontrollime, kas Serialilt on andmeid saadud. Kui ei, siis ei tehta midagi ja silmus jätkub. Kui aga on andmeid, loetakse need muutujasse, prinditakse selguse huvides ja saadetakse raadiosaatja kaudu satelliidile. Kui teil on eelmise õppetunni programm veel satelliidile üles laaditud, võite seda proovida.

```Cpp title="Maajaam, mis suudab käske saata"
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

## Serial In - Andmeallikad

Kui loeme andmeid `Serial` objektist, pääseme ligi UART RX puhvris salvestatud andmetele, mis edastatakse USB virtuaalse serial ühenduse kaudu. Praktikas tähendab see, et CanSat-ile andmete saatmiseks saab kasutada mis tahes tarkvara, mis suudab suhelda virtuaalse serial pordi kaudu, nagu Arduino IDE, terminaliprogrammid või erinevad programmeerimiskeskkonnad.

See avab palju võimalusi CanSat-i juhtimiseks välistest programmidest. Näiteks saame käske saata käsitsi neid tippides, aga ka kirjutada skripte Pythonis või muudes keeltes, et käske automatiseerida, muutes võimalikuks luua keerukamaid juhtimissüsteeme. Kasutades neid tööriistu, saate saata täpseid juhiseid, teha teste või jälgida CanSat-i reaalajas ilma käsitsi sekkumiseta.

:::

Järgmisena vaatame satelliidi poolt. Kuna programmis on mitu seisundit, muutub see natuke pikemaks, kuid jagame selle samm-sammult lahti.

Esmalt initsialiseerime süsteemid nagu tavaliselt. Samuti on mõned globaalsed muutujad, mille paigutame faili ülaossa, et oleks lihtne näha, milliseid nimesid kasutatakse. `LED_IS_ON` on tuttav meie varasematest koodinäidetest ja lisaks on meil globaalne seisundimuutuja `STATE`, mis salvestab... noh, seisundi.

```Cpp title="Initsialiseerimine"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Järgmisena kontrollime silmuses lihtsalt, millist alamprogrammi tuleks vastavalt praegusele seisundile käivitada, ja kutsume selle funktsiooni:

```Cpp title="Silmus"
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
```

Selles konkreetses juhtumis esindab iga seisund eraldi funktsioon, mida kutsutakse vastavalt seisundile. Funktsioonide sisu pole siin tegelikult oluline, kuid siin need on:

```Cpp title="Alamprogrammid"
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

Samuti on väike abifunktsioon `blinkLED`, mis aitab vältida koodi kordamist, käsitledes LED-i lülitamist meie eest.

Lõpuks muutub seisund, kui maajaam meile seda ütleb:

```Cpp title="Käsu vastuvõtmise tagasikutse"
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
  <summary>Kogu kood</summary>
  <p>Siin on kogu kood teie mugavuse huvides.</p>
```Cpp title="Satelliit mitme seisundiga"
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

Sellega saame nüüd kontrollida, mida satelliit teeb, ilma et meil oleks sellele füüsilist juurdepääsu. Pigem saame lihtsalt saata käsu maajaamaga ja satelliit teeb, mida me tahame.

:::tip[Harjutus]

Looge programm, mis mõõdab andurit kindla sagedusega, mida saab kaugjuhtimise teel käsuga muuta mis tahes väärtuseks. Proovige alamprogrammide asemel muuta viivituse väärtust otse käsuga.

Proovige muuta see ka ootamatute sisendite suhtes tolerantseks, näiteks "-1", "ABCDFEG" või "".

Boonusharjutusena tehke uus seadistus püsivaks lähtestuste vahel, nii et kui satelliit välja ja uuesti sisse lülitatakse, jätkab see edastamist uue sagedusega, mitte ei taastu algsele. Näpunäide: kasulik võib olla [õppetund 5](./lesson5.md) uuesti läbi vaadata.

:::

---

Järgmises õppetunnis muudame oma andmete salvestamise, suhtlemise ja käsitlemise märkimisväärselt tõhusamaks ja kiiremaks, kasutades binaarandmeid. Kuigi see võib alguses tunduda abstraktne, lihtsustab andmete käsitlemine binaarselt numbrite asemel paljusid ülesandeid, kuna see on arvuti emakeel.

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson9)