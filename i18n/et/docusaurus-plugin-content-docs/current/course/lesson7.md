---
Külgriba_positsioon: 8
---

# 7. õppetund: tagasi rääkimine

Cansaadid on sageli programmeeritud töötama üsna lihtsa loogikaga - näiteks võttes mõõtmised iga n -millisekundiga, salvestades ja edastades andmeid ja korrates. Seevastu satelliidile käskude saatmine oma käitumise muutmiseks missiooni keskel võimaldaks palju uusi võimalusi. Võib -olla tahaksite anduri sisse või välja lülitada või satelliidi käskida heli valmistamiseks, et see leiaksite. Võimalusi on palju, kuid võib-olla on kõige kasulikum võime satelliidil sisse lülitada alles vahetult enne raketi turuletoomist, andes teile palju rohkem paindlikkust ja vabadust tegutseda pärast seda, kui satelliit on juba raketisse integreeritud.

Proovime selles õppetunnis maapealse jaama kaudu satelliittahvlile LED sisse ja välja lülitada. See tähistab stsenaariumi, kus satelliit ei tee midagi, ilma et tal seda tehakse, ja sisuliselt on tal lihtne käsusüsteem.


::: Info

## Tarkvara tagasihelistamine

Andmete vastuvõtt CanSat teegis on programmeeritud ** tagasihelistamisteks **, mis on funktsioon, mida nimetatakse ... noh, tagasi, kui teatud sündmus toimub. Kui seni on kood oma programmides alati järginud täpselt meie kirjutatud ridu, näib, et nüüd täidab see aeg -ajalt teise funktsiooni vahepeal, enne kui jätkame põhis silmus. See võib tunduda segane, kuid see on üsna selge, kui seda tegutseda.

:::

## Kaug -pilgutamine

Proovime selle harjutuse jaoks LED -i vilkumist korrata, kuid seekord kontrollitakse LED -i tegelikult eemalt.

Vaatame kõigepealt satelliidi kõrvalprogrammi. Initsialiseerimine on praeguseks väga tuttav, kuid silmus on pisut üllatavam - seal pole midagi. Selle põhjuseks on asjaolu, et kogu loogikat käsitletakse maapinnast eemalt tagasihelistamise funktsiooni kaudu, nii et saame silmuse lihtsalt tühjaks jätta.

Huvitavam värk juhtub funktsioonis `ondatareceiving (stringi andmed)`. See on eelnimetatud tagasihelistamise funktsioon, mis on programmeeritud raamatukogus iga kord, kui raadio saab mingeid andmeid. Funktsiooni nimi on programmeeritud teegi, nii kaua kui kasutate täpselt sama nime kui siin, kutsutakse seda siis, kui andmeid on saadaval.

Allpool toodud näites trükitakse andmed iga kord lihtsalt toimuva visualiseerimiseks, kuid ka LED -olekut muudetakse iga kord, kui sõnum võetakse vastu, sõltumata sisust.

`` `CPP Title =" Satelliidikood mitte midagi teha, ilma et neile öeldakse "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}

void Loop () {}


bool led_is_on = vale;
tühine ondatareceitud (stringi andmed)
{
  Seeria.println (andmed);
  if (led_is_on)
  {
    DigitalWrite (LED, madal);
  } else {
    DigitalWrite (LED, High);
  }
  LED_IS_ON =! LED_IS_ON;
}
`` `

::: Märkus

Muutuja `LED_IS_ON` salvestatakse globaalse muutujana, mis tähendab, et see on juurdepääsetav koodi kõikjal. Need on programmeerimisel tavaliselt kulmu kortsutatud ja algajaid õpetatakse neid oma programmides vältima. Kuid sellises programmeerimises _embedded_, nagu me siin teeme, on need tegelikult väga tõhusad ja eeldatavad viisid selleks. Lihtsalt olge ettevaatlik, et te ei kasuta sama nime mitmes kohas!

:::

Kui välgume seda CanSat järgmise tahvlile ja alustame seda ... midagi ei juhtu. Muidugi on seda oodata, kuna meil pole praegu ühtegi käsku.

Maajaama poolel pole kood eriti keeruline. Initsialiseerime süsteemi ja saatke siis ahelas sõnum iga 1000 ms järel, st üks kord sekund. Praeguses programmis pole tegelikul sõnumil tähtsust, kuid ainult see, et midagi samasse võrku saadetakse.

`` `CPP Title =" Maajaam sõnumite saatmine "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  GroundStationInit (28);
}

tühine Loop () {
  viivitus (1000);
  SendData ("teade maajaamast");
}
`` `

Nüüd, kui programmeerime selle koodi maapealsesse jaama (ärge unustage vajutada alglaadimist) ja satelliit on endiselt sisse lülitatud, hakkab satelliidi LED vilkuma, pärast iga teadet sisse ja välja lülitub. Teade trükitakse ka terminali.

::: Näpunäide [treening]

Vilgutage allpool asuvat koodilõigu maapinna tahvlile. Mis juhtub satelliidi poolel? Kas saate satelliidiprogrammi muuta nii, et see reageerib ainult sellega, et lülitatakse LED sisse, kui saate LED -i sisse ja välja lülitada "LED välja", ja muidu prindib teksti lihtsalt.

`` `CPP Title =" Maajaam sõnumite saatmine "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  GroundStationInit (28);
  juhuslik seas (analoogringid (0));
}

String sõnumid [] = {
  "LED", ",
  "LED maha",
  "Ära tee midagi, see on lihtsalt sõnum",
  "Tere Cansat!",
  "Woop Woop",
  "Ole valmis!"
};

tühine Loop () {
  viivitus (400);
  
  // Genereerige juhuslik indeks sõnumi valimiseks
  int juhuslikindex = juhuslik (0, suurus (sõnumid) / suurus (sõnumid [0]));
  
  // Saada juhuslikult valitud teade
  sendData (sõnumid [RandomIndex]);
}
`` `

:::

Pange tähele ka seda, et sõnumite vastuvõtmine ei blokeeri nende saatmist, nii et saaksime (ja saame) saata sõnumeid mõlemast otsast korraga. Satelliit saab pidevalt edastada andmeid, samal ajal kui maapealne jaam saab satelliidile käskude saatmist. Kui sõnumid on samaaegsed (sama millisekundi piires), võib olla kokkupõrge ja sõnum ei lähe läbi. Cansat Next aga edastab sõnumi automaatselt, kui see tuvastab kokkupõrke. Nii et lihtsalt ole ettevaatlik, et see võib juhtuda, kuid tõenäoliselt jääb see märkamatuks.

---

Järgmises õppetunnis laiendame seda, et viia läbi ** voolu juhtimine ** kaugjuhtimisega või satelliidi käitumise muutmiseks võetud käskude põhjal. 

[Klõpsake järgmise õppetunni saamiseks siin!] (./ õppetund 8)