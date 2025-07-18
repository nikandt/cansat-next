---
Külgriba_positsioon: 2
---

# 2. õppetund: surve tundmine

Selles teises õppetunnis hakkame kasutama andureid CanSat järgmisel tahvlil. Seekord keskendume ümbritseva atmosfäärirõhu mõõtmisele. Kasutame pardabarumeetri [LPS22HB] (./../ Cansat-hardware/on_board_sensors.md#baromeeter) rõhu lugemiseks ja baromeetri enda temperatuuri lugemiseks.

Alustame teegi näidetes baromeetri koodist. Valige Arduino IDE-s fail-> näited-> cansat järgmine-> baro. 

Programmi algus näib viimasest õppetunnist üsna tuttav. Alustame jällegi CanSat'i järgmise teegi kaasamisest ja jadaühenduse seadistamisest ja CanSat järgmiste süsteemide initsialiseerimisest.

`` `CPP Title =" Seadip "
#include "canSatNext.h"

void setup () {

  // initsialiseeri seeria
  Seeria.Begin (115200);

  // Initsialiseerige CanSatNext pardal olevad süsteemid
  Cansatinit ();
}
`` `

Funktsiooni kõne `cansatinit ()` initsialiseerib kõik meie jaoks andurid, sealhulgas baromeeter. Niisiis, saame hakata seda kasutama funktsioonis Loop.

Allpool on kaks rida, kus temperatuuri ja rõhku tegelikult loetakse. Kui funktsioonid `readTemperture ()` ja `readPesressURE ()` kutsutakse, saadab protsessor käsu baromeetrile, mis mõõdab rõhku või temperatuuri, ja tagastab tulemuse protsessorile.

`` `CPP Title =" Muutujate lugemine "
ujuk t = readTemprature ();
ujuk p = readPressure (); 
`` `

Näites on väärtused trükitud ja seejärel sellele järgneb viivitus 1000 ms, nii et silm kordub umbes üks kord sekundis.

`` `CPP Title =" Muutujate printimine "
Seeria.print ("rõhk:");
Seeria.print (P);
Serial.print ("hpa \ ttempereture:");
Seeria.print (t);
Seeria.println ("*c \ n");


viivitus (1000);
`` `

### Andmete kasutamine

Samuti saame koodi andmeid kasutada, selle asemel et seda lihtsalt printida või salvestada. Näiteks võiksime koodi teha, mis tuvastab, kas rõhk langeb teatud summa võrra, ja näiteks LED -i sisse lülitamiseks. Või midagi muud, mida soovite teha. Proovime sisse lülitada pardalehte.

Selle rakendamiseks peame näites koodi pigem muutma. Esiteks hakkame jälgima eelmist rõhuväärtust. ** globaalsete muutujate loomiseks **, st sellised, mida ei eksisteeri ainult konkreetse funktsiooni täitmise ajal, saate neid lihtsalt kirjutada mis tahes konkreetsest funktsioonist. Muutuja eelnevat rõhku värskendatakse silmuse funktsiooni igas tsüklis, otse lõpus. Nii jälgime vana väärtust ja saame seda võrrelda uuema väärtusega.

Vanade ja uute väärtuste võrdlemiseks saame kasutada IF-väitlust. Allolevas koodis on mõte, et kui eelmine rõhk on uuest väärtusest 0,1 hPa madalam, lülitame LED -i sisse ja vastasel juhul hoitakse LED -i välja.

`` `CPP Title =" Reageerimine rõhu langustele "
ujuk eelmine rõhk = 1000;

tühine Loop () {

  // Lugege temperatuuri ujukini - muutuja
  ujuk t = readTemprature ();

  // lugege survet ujukile
  ujuk p = readPressure (); 

  // printige rõhk ja temperatuur
  Seeria.print ("rõhk:");
  Seeria.print (P);
  Serial.print ("hpa \ ttempereture:");
  Seeria.print (t);
  Seeria.println ("*c");

  if (eelneva rõhu korral - 0,1> p)
  {
    DigitalWrite (LED, High);
  } else {
    DigitalWrite (LED, madal);
  }

  // oodake enne silmuse alustamist üks sekund
  viivitus (1000);

  eelmine rõhk = p;
}
`` `

Kui välgutate seda modifitseeritud silmust CanSat'i järgmisena, peaks see mõlemad muutuja väärtused printima nagu varem, kuid otsima nüüd ka rõhulangust. Atmosfäärirõhk langeb üles minnes umbes 0,12 hPa / meetrit, nii et kui proovite CanSat'i järgmise meetri kõrgemale tõstmisele kiiresti tõsta, peaks LED ühe silmuse tsükli jaoks sisse lülitama (1 sekund) ja seejärel tagasi lülitama. Tõenäoliselt on kõige parem USB -kaabel enne selle proovimist lahti ühendada!

Võite proovida ka koodi muuta. Mis juhtub, kui viivitust muudetakse? Mis saab siis, kui ** hüsterees ** on 0,1 hPa muutunud või isegi täielikult eemaldatud?

---

Järgmises õppetunnis saame veelgi rohkem füüsilist aktiivsust, kuna proovime kasutada muud integreeritud andurit IC - inertsiaalset mõõtmisüksust.

[Klõpsake järgmise õppetunni saamiseks siin!] (./ õppetund3)