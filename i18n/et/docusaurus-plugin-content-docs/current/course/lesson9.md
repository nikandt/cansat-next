---
Külgriba_positsioon: 10
---

# 9. õppetund: ühed ja nullid

Siiani oleme andmete salvestamisel või edastamisel teksti kasutanud. Kuigi see teeb selle tõlgendamise lihtsaks, on see ka ebaefektiivne. Arvutid kasutavad sisemiselt ** binaarseid ** andmeid, kus andmeid salvestatakse nende ja nullina. Selles õppetunnis uurime binaarsete andmete kasutamise võimalusi CanSatiga järgmisena ning arutame, kus ja miks see võib olla kasulik.

::: Info

## Erinevad andmetüübid

Binaarsel kujul on kõik andmed - olgu need numbrid, tekst või anduri näidud - esindatud nende ja nullide seeriana. Erinevad andmetüübid kasutavad erinevat kogust mälu ja tõlgendavad binaarseid väärtusi konkreetsetel viisidel. Vaatame lühidalt läbi mõned levinumad andmetüübid ja kuidas neid binaarses salvestatakse:

- ** täisarv (int) **:  
  Täisajad tähistavad täisarvu. Näiteks 16-bitises täisarvudes võivad 16 ja nullid tähistada väärtusi alates \ (-32 768 \) kuni \ (32 767 \). Negatiivseid numbreid salvestatakse meetodil, mida nimetatakse ** kahe komplemendiks **.

- ** allkirjastamata täisarv (uint) **:  
  Allkirjastamata täisarvud tähistavad mittenegatiivseid numbreid. 16-bitine allkirjastamata täisarv suudab väärtusi salvestada \ (0 \) kuni \ (65,535 \), kuna märgi jaoks ei reserveerita bitti.

- ** ujuk **:  
  Ujukoma numbrid tähistavad kümnendväärtusi. 32-bitises ujukit tähistab osa bittidest märki, eksponenti ja mantissa, võimaldades arvutitel käsitseda väga suurt ja väga vähe. See on sisuliselt [teadusliku märkuse] binaarne vorm (https://en.wikipedia.org/wiki/scientific_notation).

- ** tegelased (char) **:  
  Tegelasi salvestatakse kodeerimisskeemide abil nagu ** ASCII ** või ** UTF-8 **. Iga märk vastab konkreetsele binaarsele väärtusele (nt 'A' ASCII -s hoitakse kui `01000001`).

- ** keelpillid **:  
  Stringid on lihtsalt tegelaste kogud. Iga stringi tähemärki salvestatakse järjestuses üksikute binaarsete väärtustena. Näiteks salvestatakse stringi "" cansat "` tähemärkide seeriana nagu 01000011 01100001 01101110 01010011 01100001 01100001 01100001 01110100 "(igaüks tähistab 'C', 'a', 'n', 's', 'a', 't'). Nagu näete, on see, et numbrid stringidena, nagu me seni oleme teinud, võrreldes nende binaarsete väärtuste hoidmisega võrreldes vähem tõhus.

- ** massiivid ja `uint8_t` **:  
  Binaarsete andmetega töötades on tavaline, et töötlemata baitide andmete salvestamiseks ja käsitsemiseks on tavaline kasutada uint8_t. Tüüp `uint8_t` tähistab allkirjastamata 8-bitist täisarvu, mis mahutab väärtusi vahemikus 0 kuni 255. Kuna iga bait koosneb 8 bitist, sobib see tüüp hästi binaarsete andmete hoidmiseks.
  Byte puhvrite loomiseks töötlemata binaarsete andmete järjestuste (nt pakettide) hoidmiseks kasutatakse sageli massiive `uint8_t`. Mõned inimesed eelistavad "char" või muid muutujaid, kuid pole tegelikult vahet, kumba seda kasutatakse seni, kuni muutuja pikkus on 1 bait.
:::

## Binaarsete andmete edastamine

Alustame lihtsa programmi vilkumisega CanSatile ja keskendume rohkem maapinna poolele. Siin on lihtne kood, mis edastab lugemise binaarses vormingus:

`` `CPP Title =" edastage LDR -andmeid binaarseks "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}

tühine Loop () {
  ujuk ldr_voltage = analogreadvoltage (LDR);
  sendData (& ldr_voltage, sizeof (ldr_voltage));
  viivitus (1000);
}
`` `

Kood näeb välja teisiti väga tuttav, kuid "SendData" võtab nüüd kaks argumenti ainult ühe asemel - esiteks, edastatavate andmete ** mäluaadress ** ja seejärel edastatavate andmete ** pikkus **. Sel lihtsustatud juhul kasutame lihtsalt muutuja `ldr_voltage'i aadressi ja pikkust.

Kui proovite seda tüüpilise maapealse jaama koodiga vastu võtta, printib see lihtsalt GobbledyGooki, kuna see üritab binaarseid andmeid tõlgendada justkui stringi. Selle asemel peame maismaajaama täpsustama, millised andmed hõlmavad.

Esiteks kontrollime, kui kaua andmed tegelikult on, mida me saame.

`` `CPP Title =" Vastuvõetud andmete pikkus "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  GroundStationInit (28);
}

void Loop () {}

tühine onbinaryDatareceiving (const uint8_t *andmed, int len)
{
  Serial.print ("vastuvõetud");
  Seeria.print (len);
  Serial.println ("baitid");
}
`` `

Iga kord, kui satelliit edastab, saame maapeal 4 baiti. Kuna me edastame 32 -bitist ujuki, tundub see õige.

Andmete lugemiseks peame võtma sisendvoost binaarse andmepuhvri ja kopeerima andmed sobivasse muutujasse. Selle lihtsa juhtumi jaoks saame seda teha:

`` `CPP Title =" Salvestage andmed muutujasse "
tühine onbinaryDatareceiving (const uint8_t *andmed, int len)
{
  Serial.print ("vastuvõetud");
  Seeria.print (len);
  Serial.println ("baitid");

  ujuk ldr_reading;
  memcpy (& ldr_reading, andmed, 4);

  Serial.print ("andmed:");
  Seeria.println (ldr_reading);
}
`` `

Esmalt tutvustame muutujat `ldr_reading` andmete hoidmiseks, mida me * teame *, mis meil puhvris on. Seejärel kasutame `memcpy` (mälukoopia), et kopeerida puhver" andmete "binaarsed andmed` ldr_reading "** mälu aadressile **.  See tagab, et andmed edastatakse täpselt nii, nagu need salvestati, säilitades sama vormingu kui satelliidil.

Kui printime andmeid, on justkui lugenud seda otse GS -i poolel. See ei ole enam tekst nagu vanasti, vaid tegelikud samad andmed, mida satelliidi poolel lugesime. Nüüd saame seda hõlpsalt töödelda GS -i poolel, nagu me tahame.

## Meie enda protokolli koostamine

Binaarse andmeedastuse tegelik jõud ilmneb, kui meil on rohkem andmeid edastamiseks. Siiski peame siiski tagama, et satelliit- ja maapealnejaam nõustuvad, milline bait tähistab. Seda nimetatakse ** paketiprotokolliks **.

Paketiprotokoll määratleb edastatavate andmete struktuuri, täpsustades, kuidas pakkida mitu andmetükki ühte edastamisse ja kuidas peaks vastuvõtja sissetulevate baitide tõlgendama. Loome lihtsa protokolli, mis edastab struktureeritud viisil mitut anduri näitu.

Esiteks loeme kõik kiirendusmõõturid ja güroskoobi kanalid ning loome lugemistest ** andmepaketi **.

`` `CPP Title =" edastage LDR -andmeid binaarseks "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}

tühine Loop () {
  ujuki kirves = reduccelx ();
  ujuk ay = readAccely ();
  ujuk az = reduccelz ();
  float gx = readgyrox ();
  ujuk gy = Readgyroy ();
  ujuk Gz = Readgyroz ();

  // Looge andmete hoidmiseks massiiv
  uint8_t pakett [24];

  // Kopeerige andmed paketti
  memcpy (& pakett [0], & ax, 4);  // Kopeeri kiirendusmõõtur X baitidesse 0-3
  memcpy (& pakett [4], & ay, 4);
  memcpy (& pakett [8], & az, 4);
  memcpy (& pakett [12], & gx, 4);
  memcpy (& pakett [16], & gy, 4);
  memcpy (& pakett [20], & gz, 4); // Kopeeri güroskoop Z baitidesse 20-23
  
  sendData (pakett, suurus (pakett));

  viivitus (1000);
}
`` `

Siin lugesime andmeid kõigepealt nagu 3. tunnis, kuid siis ** kodeerime ** andmeid andmepaketti. Esiteks luuakse tegelik puhver, mis on vaid tühi 24 -baidikomplekt. Seejärel saab iga andmemuutuja kirjutada sellele tühjale puhvrile koos memcpyga. Kuna me kasutame ujuki, on andmete pikkus 4 baiti. Kui te pole muutuja pikkuses kindel, saate seda alati kontrollida vastavalt `suurusele (muutuja)`.

::: Näpunäide [treening]

Kiirendusmõõturi ja güroskoobi andmete tõlgendamiseks ja printimiseks looge maapealse jaama tarkvara.

:::

## Binaarsete andmete salvestamine SD -kaardile

SD -kaardile binaarsete andmete kirjutamine võib olla kasulik, kui töötate väga suurte andmetega, kuna binaarne salvestus on kompaktsem ja tõhusam kui tekst. See võimaldab teil salvestada rohkem andmeid vähem salvestusruumiga, mis võib olla kasulik mäluga piiratud süsteemis.

Binaarsete andmete kasutamine salvestamiseks on siiski kompromissidega. Erinevalt tekstifailidest ei ole binaarsed failid inimese loetavad, mis tähendab, et neid ei saa tavaliste tekstiredaktoritega hõlpsasti avada ja mõista ega importida sellistesse programmidesse nagu Excel. Binaarsete andmete lugemiseks ja tõlgendamiseks tuleb binaarvormingu õigeks sõelumiseks välja töötada spetsialiseeritud tarkvara või skriptid (E.Q., Pythonis).

Enamiku rakenduste jaoks, kus on oluline juurdepääsu ja paindlikkuse lihtsus (näiteks hiljem arvutis andmete analüüsimine), on soovitatav tekstipõhised vormingud nagu CSV. Nende vormingutega on lihtsam töötada erinevates tarkvarariistades ja need pakuvad kiiremat paindlikkust kiireks andmete analüüsimiseks.

Kui olete pühendunud binaarse salvestusruumi kasutamisele, vaadake sügavamat "kapoti all", vaadates üle, kuidas CanSat Library andmesalvestab sisemiselt. Failide, voogude ja muude madala taseme toimingute tõhusaks haldamiseks saate otse C-stiilis failide käitlemise meetodeid kasutada. Lisateavet leiate ka [Arduino SD CARD LIBARY] (https://docs.arduino.cc/libraries/sd/).

---

Meie programmid hakkavad muutuma üha keerukamaks ning on ka mõningaid komponente, mida oleks tore mujalt taaskasutada. Meie koodi raske haldamise vältimiseks oleks tore, kui saaksite erinevatele failidele mõnda komponenti jagada ja koodi loetavaks hoida. Vaatame, kuidas seda saab Arduino IDE abil saavutada.

[Klõpsake järgmise õppetunni saamiseks siin!] (./ Õppetund10)