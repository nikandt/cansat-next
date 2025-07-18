---
Külgriba_positsioon: 11
---

impordi vahelehtedest '@teema/vahekaardid';
impordi tabitem saidilt '@teema/tabitem';

# 10. õppetund: jagage ja vallutage

Kuna meie projektid muutuvad üksikasjalikumaks, võib kood olla raske hallata, kui me pole ettevaatlikud. Selles õppetunnis käsitleme mõnda tava, mis aitab hoida suuremaid projekte hallatavana. Nende hulka kuulub koodi jagamine mitmeks failiks, sõltuvuste haldamine ja lõpuks versioonijuhtimise tutvustamine muudatuste jälgimiseks, koodi varundamiseks ja koostöös abistamiseks.

## Koodi jagamine mitmeks failiks

Väikestes projektides võib kogu lähtekoodi omamine ühes failis tunduda hea, kuid projekti skaaladena võivad asjad hallata ja raskemini hallata. Hea tava on jagada oma kood funktsionaalsuse põhjal erinevateks failideks. Kui see on hästi tehtud, toodab see ka toredaid väikeseid mooduleid, mida saate erinevates projektides uuesti kasutada, ilma et oleks toonud teistele projektidele tarbetuid komponente. Mitme faili üks suur eelis on ka see, et see muudab koostöö lihtsamaks, kuna teised inimesed saavad töötada teiste failidega, aidates vältida olukordi, kus koodi on keeruline ühendada.

Järgmine tekst eeldab, et kasutate Arduino IDE 2 -d. Täpsemad kasutajad võivad tunda end rohkem selliste süsteemidega nagu [platvormio] (https://platformio.org/), kuid need, kes teist on juba nende mõistetega tuttavad.

Arduino IDE 2 -s kuvatakse kõik projekti kausta failid IDE vahekaartidena. Uusi faile saab luua IDE -s otse või teie opsüsteemi kaudu. Seal on kolme erinevat tüüpi faile, ** päised ** `.h`, ** lähtefailid **` .cpp` ja ** arduino failid ** `.ino`.  

Neist kolmest on Arduino faile kõige lihtsam aru saada. Need on lihtsalt lisafailid, mis kopeeritakse kompileerimisel teie peamise `.ino` skripti lõpus. Sellisena saate neid hõlpsalt kasutada arusaadavamate koodistruktuuride loomiseks ja keeruka funktsiooni jaoks vajaliku ruumi võtmiseks ilma lähtefaili keeruliseks lugemiseks. Parim lähenemisviis on tavaliselt ühe funktsionaalsuse võtmine ja selle ühe faili rakendamine. Nii et teil võiks olla näiteks iga töörežiimi jaoks eraldi fail, üks fail andmete edastamiseks, üks fail käsu tõlgendamiseks, üks fail andmesalvestamiseks ja üks peamine fail, kus ühendate selle kõik funktsionaalseks skriptiks.

Päised ja lähtefailid on pisut spetsialiseerunud, kuid õnneks töötavad need samamoodi nagu C ++ puhul, nii et nende kasutamise kohta on kirjutatud palju materjali, näiteks [siin] (https://www.learncpp.com/cpp-tutorial/header-files/).

## Näitestruktuur

Näitena võtame räpase koodi [õppetund 8] (.

<üksikasjad>
  <kokkuvõte> Originaalne segane kood õppetunnist
  <p> Siin on kogu teie pettumuse kood. </p>
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

See pole isegi nii halb, kuid näete, kuidas seda võib tõsiselt keeruliseks lugeda, kui me funktsioonid välja viisime või lisasime uusi käske, mida tõlgendada. Selle asemel jagame selle eraldi funktsioonide põhjal korralikeks eraldi koodifailideks.

Jaotasin kõik töörežiimid oma faili, lisasin käsu tõlgendamiseks faili ja tegin lõpuks väikese utiliidifaili, et hoida funktsionaalsust, mida on vaja paljudes kohtades. See on üsna tüüpiline lihtne projektistruktuur, kuid muudab programmi juba palju lihtsamaks. Seda saab veelgi aidata hea dokumentatsiooniga ja näiteks graafiku koostamine, mis näitab, kuidas failid üksteisele linkivad.

<Vahelehed>
  <Tabitem väärtus = "Main" Label = "main.ino" vaikeseade>

`` `CPP Title =" peamine visand "
#include "canSatNext.h"

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
    viivitus (1000);
  }
}
`` `
  </Tabitem>
  <TabItem väärtus = "PreLaunch" Label = "režiim_prelaunch.ino" vaikimisi>

`` `CPP Title =" Eelne käivitamisrežiim "
void prelaunch () {
  Serial.println ("ootamine ...");
  SendData ("ootab ...");
  vilgutas ();
  
  viivitus (1000);
}
`` `
  </Tabitem>
      <TabItem väärtus = "Flight_mode" Label = "Mode_flight.ino" vaike>

`` `CPP Title =" lennurežiim "
void lend_mode () {
  senddata ("weee !!!");
  ujuk ldr_voltage = analogreadvoltage (LDR);
  sendData (ldr_voltage);
  vilgutas ();

  viivitus (100);
}
`` `
  </Tabitem>
    <TabItem väärtus = "Recovery" Label = "Mode_reCourn.ino" vaike>

`` `CPP Title =" taastamisrežiim "
void recovery_mode ()
{
  vilgutas ();
  viivitus (500);
}
`` `
  </Tabitem>
    <TabItem väärtus = "tõlgenda" label = "käsk_interpreration.ino" vaike>

`` `CPP Title =" Käsu tõlgendamine "
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
  </Tabitem>
    <TabItem väärtus = "utils" label = "utils.ino" vaikimisi>

`` `CPP Title =" Utilities "
bool led_is_on = vale;

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
`` `
  </Tabitem>

</Tabs>

Kuigi see lähenemisviis on juba miili parem kui ühe faili olemasolu kõige jaoks, nõuab see siiski hoolikat juhtimist. Näiteks jagatakse ** nimeruum ** erinevate failide vahel, mis võivad suuremas projektis või koodi taaskasutamisel segadust põhjustada. Kui on samade nimedega funktsioone või muutujaid, ei tea kood, millist neist kasutada, põhjustades konflikte või ootamatut käitumist.

Lisaks ei vasta see lähenemisviis hästi ** kapseldamisele ** - mis on võtim modulaarsema ja korduvkasutatava koodi ehitamiseks. Kui teie funktsioonid ja muutujad eksisteerivad samas globaalses ruumis, on koodi ühe osa tahtmatult mõjutamisel raskem takistada. See on koht, kus täiustatud tehnikad, nagu nimeruumid, klassid ja objektorienteeritud programmeerimine (OOP). Need jäävad selle kursuse ulatusest välja, kuid individuaalseid uuringuid nende teemade kohta julgustatakse.


::: Näpunäide [treening]

Võtke üks oma eelmistest projektidest ja andke sellele makeover! Jagage oma kood mitmeks failis ja korraldage oma funktsioonid nende rollide põhjal (nt anduri haldamine, andmete käitlemine, suhtlus). Vaadake, kui palju puhtamaks ja hõlpsamaks oma projekti haldamiseks saab!

:::


## versiooni juhtimine

Projektide kasvades - ja eriti kui nende kallal töötab mitu inimest -, on lihtne kaotada muudatusi või kirjutada kogemata üle (või ümber kirjutada) koodi. Seal tuleb ** versiooni juhtimine ** sisse. ** Git ** on tööstuse standardse versiooni juhtimisriist, mis aitab jälgida muudatusi, hallata versioone ja korraldada suuri projekte mitme kaastöötajaga.

Giti õppimine võib tunduda hirmutav ja isegi väikeste projektide jaoks ülearune, kuid võin lubada, et tänate end selle õppimise eest. Hiljem saate imestada, kuidas teil ilma selleta kunagi hakkama saite!




Siin on suurepärane koht alustamiseks: [GIT-iga alustamine] (https://docs.github.com/en/get-sterted/getting-berted-with-git).

Saadaval on mitu GIT -teenust, kus on populaarsed, sealhulgas:

[Github] (https://github.com/)

[Gitlab] (https://about.gitlab.com/)

[Bitbucket] (https://bitbucket.org/product/)

GitHub on kindel valik selle populaarsuse ja saadaoleva tuge rohkuse tõttu. Tegelikult võõrustatakse GitHubis seda veebilehte ja [cansat järgmine] (https://github.com/netnspace/cansatNext_library).

Git pole lihtsalt mugav - see on oluline oskus kõigile, kes töötavad professionaalselt inseneri või teaduse alal. Enamik meeskondi, kelle osa saate, kasutab Giti, seega on hea mõte, et see kasutab seda tuttavaks harjumuseks.

Rohkem õpetusi Giti kohta:

[https://www.w3schools.com/git/ ](https://www.w3schools.com/git/)

5



::: Näpunäide [treening]

Seadistage oma CanSat -projekti jaoks Giti hoidla ja lükake oma kood uude hoidlasse. See aitab teil arendada nii satelliidi kui ka maapealse jaama tarkvara organiseeritud koostööl.

:::

---

Järgmises õppetunnis räägime erinevatest viisidest, kuidas laiendada purki väliste andurite ja muude seadmetega.

[Klõpsake järgmise õppetunni saamiseks siin!] (./ õppetund11)