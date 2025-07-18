---
Külgriba_positsioon: 9
---

# 8. õppetund: minge vooluga

Selle õppetunni teema on voolu juhtimine või kuidas saaksime hakkama sellega, mida protsessor teeb erinevatel ajahetkedel. Siiani on enamik meie programme keskendunud ühele ülesandele, mis sirgjooneliselt piirab süsteemi potentsiaali. Tutvustades oma programmis erinevaid ** olekuid **, saame selle võimalusi laiendada.

Näiteks võiks programmis olla eelneva olek, kus satelliit ootab tõusu. Seejärel võiks see minna üle lennurežiimi, kus loeb andurite andmeid ja täidab oma peamist missiooni. Lõpuks võib taastumisrežiim aktiveerida, milles satelliit saadab signaale taastumisel - tulede pimestamise, piiksumise või nende kavandatud süsteemide toimingute täitmisel.

Olekute vahelise muutmise ** päästik ** võib varieeruda. See võib olla anduri lugemine, nagu rõhuvahetus, väline käsk, sisesündmus (näiteks taimer) või isegi juhuslik esinemine, sõltuvalt vajalikust. Selles õppetunnis tugineme sellele, mida me varem õppisime, kasutades päästikuna välist käsku.

## Voolu juhtimine väliste päästikutega

Kõigepealt muudame maapealse jaama koodi, et saaksid jadamonitorilt sõnumeid vastu võtta, et saaksime vajadusel kohandatud käske saata.

Nagu näete, on ainsad muudatused põhis silmus. Esiteks kontrollime, kas seeriast saadud andmeid on saadud. Kui ei, siis ei tehta midagi ja silmus jätkub. Kui andmeid on olemas, loetakse need muutujaks, trükitakse selguse huvides ja saadetakse seejärel raadio kaudu satelliidi. Kui teil on veel eelmise õppetunni programmi satelliidile üles laaditud, saate seda proovida.

`` `CPP Title =" Maajaam, mis suudab käske saata "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  GroundStationInit (28);
}

tühine Loop () {
  if (serial.avaiLable ()> 0) {
    String vastuvõtudMessage = serial.readstringUntil ('\ n'); 

    Serial.print ("saadud käsk:");
    Serial.println (vastuvõetud meesage);

    SendData (vastuvõetudMessage);  
  }
}

tühine ondatareceitud (stringi andmed)
{
  Seeria.println (andmed);
}
`` `

::: Info

## Seriaal - andmeallikad

Kui loeme andmeid objektist `Serial`, pääseme UART RX puhvris salvestatud andmetele, mis edastatakse USB virtuaalse jadaühenduse kaudu. Praktikas tähendab see, et iga tarkvara, mis on võimeline suhtlema virtuaalse jadapordi kaudu, näiteks Arduino IDE, terminaliprogrammid või mitmesugused programmeerimiskeskkonnad, saab kasutada andmete saatmiseks CanSatile.

See avab palju võimalusi välistest programmidest CanSati kontrollimiseks. Näiteks saame käske nende käsitsi kirjutades saata, aga ka käskude automatiseerimiseks kirjutada skripte Pythoni või muudesse keeltesse, võimaldades luua keerukamaid juhtimissüsteeme. Nende tööriistade võimendamisega saate saata täpseid juhiseid, testid käivitada või CANSAT -i reaalajas jälgida ilma käsitsi sekkumiseta.

:::

Järgmisena vaatame satelliidi külge. Kuna meil on programmis mitu olekut, läheb see natuke pikemaks, kuid laskem see samm -sammult lahti teha.

Esiteks lähtestame süsteemid nagu tavaliselt. Tthere on ka paar globaalset muutujat, mille paigutame faili ülaossa, nii et on lihtne mõista, milliseid nimesid kasutatakse. LED_IS_ON` on tuttav meie eelmistest koodinäidetest ja lisaks on meil globaalne olekumuutuja "olek", mis salvestab ... noh, oleku.

`` `CPP Title =" lähtestamine "
#include "canSatNext.h"

bool led_is_on = vale;
int olek = 0;

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}
`` `
Järgmisena kontrollime silmuses lihtsalt, millist alamprogrammi tuleks vastavalt praegusele olekule teostada, ja nimetab selle funktsiooni:

`` `CPP Title =" Loop "
tühine Loop () {
  if (olek == 0)
  {
    PreLaunch ();
  } else kui (olek == 1)
  {
    lend_mode ();
  } else if (oleku == 2) {
    recovery_mode ();
  } else {
    // Tundmatu režiim
    viivitus (1000);
  }
}
`` `

Sel juhul tähistab iga olekut eraldi funktsiooniga, mida nimetatakse oleku põhjal. Funktsioonide sisu pole siin tegelikult oluline, kuid siin nad on:

`` `CPP Title =" alamprogrammid "
void prelaunch () {
  Serial.println ("ootamine ...");
  SendData ("ootab ...");
  vilgutas ();
  
  viivitus (1000);
}

void lend_mode () {
  senddata ("weee !!!");
  ujuk ldr_voltage = analogreadvoltage (LDR);
  sendData (ldr_voltage);
  vilgutas ();

  viivitus (100);
}


void recovery_mode ()
{
  vilgutas ();
  viivitus (500);
}
`` `

Seal on ka väike abistajafunktsioon `Blinkled", mis aitab vältida koodi kordamist, käitledes LED -i sätteid.

Lõpuks on riik muudetud, kui maapealne jaam meile käsib:

`` `CPP Title =" käsk sai tagasihelistamise "
tühine ondatareceitud (stringi andmed)
{
  Seeria.println (andmed);
  if (andmed == "eelnevanch")
  {
    Olek = 0;
  }
  if (andmed == "lend")
  {
    Olek = 1;
  }
  if (andmed == "taastamine")
  {
    Olek = 2;
  }
}
`` `


<üksikasjad>
  <kokkuvõte> Terve kood </ kokkuvõte>
  <p> Siin on kogu teie mugavuse jaoks kood. </p>
`` `CPP Title =" Satelliit mitme olekuga "
#include "canSatNext.h"

bool led_is_on = vale;
int olek = 0;

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}


tühine Loop () {
  if (olek == 0)
  {
    PreLaunch ();
  } else kui (olek == 1)
  {
    lend_mode ();
  } else if (oleku == 2) {
    recovery_mode ();
  } else {
    // Tundmatu režiim
    viivitus (1000);
  }
}

void prelaunch () {
  Serial.println ("ootamine ...");
  SendData ("ootab ...");
  vilgutas ();
  
  viivitus (1000);
}

void lend_mode () {
  senddata ("weee !!!");
  ujuk ldr_voltage = analogreadvoltage (LDR);
  sendData (ldr_voltage);
  vilgutas ();

  viivitus (100);
}


void recovery_mode ()
{
  vilgutas ();
  viivitus (500);
}

tühine vilgutas ()
{
  if (led_is_on)
  {
    DigitalWrite (LED, madal);
  } else {
    DigitalWrite (LED, High);
  }
  LED_IS_ON =! LED_IS_ON;
}

tühine ondatareceitud (stringi andmed)
{
  Seeria.println (andmed);
  if (andmed == "eelnevanch")
  {
    Olek = 0;
  }
  if (andmed == "lend")
  {
    Olek = 1;
  }
  if (andmed == "taastamine")
  {
    Olek = 2;
  }
}
`` `
</ahend>


Sellega saame nüüd kontrollida, mida satelliit teeb, ilma et sellel oleks isegi füüsilist juurdepääsu. Pigem saame lihtsalt maapealse jaama käsu saata ja satelliit teeb seda, mida me tahame.

::: Näpunäide [treening]


Looge programm, mis mõõdab konkreetse sagedusega andurit, mida saab kaugkäsklusega muuta mis tahes väärtuseks. Alamprogrammi kasutamise asemel proovige viivituse väärtust otse käsuga muuta. 

Proovige muuta see ka ootamatute sisendite, näiteks "-1", "abcdfeg" või "" tolerantseks.

Boonusharjutusena tehke uus säte püsivaks lähtestamise vahel, nii et kui satelliit välja lülitatakse ja uuesti sisse lülitatakse, jätkab see uue sagedusega edastamist, selle asemel et tagasi pöörduda algse juurde. Näpunäitena võib abiks olla [5. õppetund] (./ õppetund5.md).

:::

---

Järgmises õppetunnis muudame binaarsete andmete abil oma andmete salvestamise, suhtlemise ja käitlemise oluliselt tõhusamaks. Ehkki see võib alguses tunduda abstraktne, lihtsustab andmete numbrite asemel binaarset käsitsemist paljusid ülesandeid, kuna see on arvuti emakeel.

[Klõpsake järgmise õppetunni saamiseks siin!] (./ Õppetund9)