---
külgriba_positsioon: 5
---

# 5. õppetund: bittide ja baitide säästmine

Mõnikord ei ole andmete otse arvutisse saamine teostatav, näiteks kui viskame seadme ümber, käivitame selle raketiga või võtame mõõtmisi raskesti ligipääsetavates kohtades. Sellistel juhtudel on kõige parem salvestada mõõdetud andmed SD -kaardile hiljem edasiseks töötlemiseks. Lisaks saab SD -kaarti kasutada ka sätete salvestamiseks - näiteks võib meil olla SD -kaardile salvestatud Tresholdi sätet või aadressiseadeid. 

## SD -kaart CanSat järgmises teegis

CanSat järgmine raamatukogu toetab suurt valikut SD -kaardi toiminguid. Seda saab kasutada failide salvestamiseks ja lugemiseks, aga ka kataloogide ja uute failide loomiseks, nende ringi teisaldamiseks või isegi kustutamiseks. Kõik need võiksid olla kasulikud erinevatel asjaoludel, kuid keskendugem siin kahele põhite asjale - faili lugemisele ja andmete kirjutamisele failile. 

::: Märkus

Kui soovite failisüsteemi täielikku juhtimist, leiate käsud [teegi spetsifikatsioonist] (./../ cansat-software/lible_specification.md#sdcardpresent) või teegi näitest "sd_advanced".

:::

Muutkem harjutusena koodi viimasest õppetunnist nii, et LDR -mõõtmiste seeriasse kirjutamise asemel salvestame need SD -kaardile.

Esiteks määratleme selle faili nime, mida me kasutame. Lisame selle enne seadistusfunktsiooni ** globaalse muutujana **.

`` `Cpp title =" modifitseeritud seadistus "
#include "canSatNext.h"

const String filePath = "/ldr_data.csv";

void setup () {
  Seeria.Begin (115200);
  Cansatinit ();
}
`` `

Nüüd, kui meil on filepaat, saame kirjutada SD -kaardile. Selle tegemiseks on vaja vaid kaks rida. Parim käsk, mida mõõteandmete salvestamiseks kasutada, on `AppendFile ()`, mis võtab lihtsalt faili ja kirjutab faili lõpus uued andmed. Kui faili pole olemas, loob see selle. See muudab käsu kasutamise väga lihtsaks (ja ohutuks). Saame selle andmed lihtsalt otse lisada ja seejärel järgida seda, et reas muuta, nii et andmeid oleks lihtsam lugeda. Ja see selleks! Nüüd salvestame mõõtmisi.

`` `CPP Title =" LDR -andmete salvestamine SD -kaardile "
tühine Loop () {
  ujuk ldr_voltage = analogreadvoltage (LDR);
  Seeria.print ("LDR väärtus:");
  Seeria.println (ldr_voltage);
  appendFile (FilePath, ldr_voltage);
  appendFile (FilePath, "\ n");
  viivitus (200);
}
`` `

Vaikimisi salvestab käsk `appendfile ()` ujukoma numbrid kahe väärtusega pärast kümnendpunkti. Täpsema funktsionaalsuse saamiseks võiksite kõigepealt luua visandist stringi ja kasutada käsku `appendfile ()`, et see string SD -kaardile salvestada. Nii et näiteks:

`` `CPP Title =" LDR -andmete salvestamine SD -kaardile "
tühine Loop () {
  ujuk ldr_voltage = analogreadvoltage (LDR);

  Stringi formaatidString = String (ldr_voltage, 6) + "\ n";
  Seeria.print (formaadis);
  appendfile (FilePath, formaadis);

  viivitus (200);
}
`` `

Siin tehakse lõplik string kõigepealt koos stringiga (ldr_voltage, 6), täpsustades, et tahame pärast punkti 6 kümnendkohta. Andmete printimiseks ja salvestamiseks saame sama stringi kasutada. (Samuti edastamine raadio kaudu)

## Andmete lugemine

Sageli on kasulik salvestada midagi SD -kaardil ka edaspidiseks kasutamiseks programmis. Need võiksid olla näiteks seadme praeguse oleku sätted, nii et kui programm lähtestatakse, saame vaikeväärtustest alustamise asemel praeguse oleku SD -kaardilt uuesti laadida. 

Selle demonstreerimiseks lisage arvutisse SD -kaardile uus fail nimega "Delay_time", ja kirjutage faili, näiteks 200. Proovime asendada meie programmis staatiliselt määratud viivituse aeg failist loetud sättega.

Proovime seadistuses seadistusfaili lugeda. Esiteks tutvustame uut globaalset muutujat. Andsin sellele vaikeväärtuse 1000, nii et kui meil ei õnnestu viivitusaega muuta, on see nüüd vaikeseade. 

Seadistuses peaksime kõigepealt kontrollima, kas fail on isegi olemas. Seda saab teha käsu `fileExists ()` abil. Kui see ei tee lihtsalt vaikeväärtust. Pärast seda saab andmeid lugeda, kasutades readFile () `. Siiski peaksime märkima, et see on string - mitte täisarv, nagu meil seda vaja on. Niisiis, teisendame selle Arduino käsuga `Toint ()`. Lõpuks kontrollime, kas teisendus oli edukas. Kui see ei olnud, on väärtus null, sel juhul kasutame lihtsalt vaikeväärtust.

`` `CPP Title =" seadistuse lugemine seadistuses "
#include "canSatNext.h"

const String filePath = "/ldr_data.csv";
const string seadefile = "/viivitus_aeg";

int viivituse aeg = 1000;

void setup () {
  Seeria.Begin (115200);
  Cansatinit ();

  if (failExists (seadistamineFile))
  {
    Stringi sisu = readFile (seadefail);
    int väärtus = sisu.Toint ();
    if (väärtus! = 0) {
      viivituse aeg = väärtus;
    }
  }
}
`` `

Lõpuks ärge unustage uue muutuja kasutamiseks silmuse viivitust muuta.

`` `CPP Title =" Dünaamiliselt määrake viivituse väärtus "
tühine Loop () {
  ujuk ldr_voltage = analogreadvoltage (LDR);

  Stringi formaatidString = String (ldr_voltage, 6) + "\ n";
  Seeria.print (formaadis);
  appendfile (FilePath, formaadis);

  viivitus (viivituse aeg);
}
`` `

Nüüd saate proovida muuta SD -kaardi väärtust või isegi SD -kaardi eemaldamist, sel juhul peaks see nüüd kasutama viivituse pikkuse vaikeväärtust.

::: Märkus

Programmis säte ümberkirjutamiseks võite kasutada käsku [WriteFile] (./../ cansat-software/Library_Specification.md#WRITENFILE). See töötab täpselt nagu [appendfile] (./../ cansat-software/liquary_specification.md#appendfile), kuid kirjutab kõik olemasolevad andmed üle.

:::

::: Näpunäide [treening]

Jätkake oma lahendusest 4. tunnis treeningule, nii et olekut säilitatakse ka siis, kui seade lähtestatakse. St. Hoidke praegust olekut SD -kaardil ja lugege seda seadistuses. See simuleeriks stsenaariumi, kus teie purk lähtestatakse äkki lennul või enne lennu ajal, ja selle programmiga saate ikkagi eduka lennu.

:::

---

Järgmises õppetunnis vaatame raadio kasutamist andmete edastamiseks protsessorite vahel. Enne nende harjutuste alustamist peaks teil olema kansaadis mingi tüüpi antenn. Kui te pole seda veel teinud, vaadake põhiantenni ehitamise õpetust: [antenni ehitamine] (./../ cansathardware/kommunikatsioon#ehitamine-a-a-kvarter-laine-monopole-atenni).

[Klõpsake järgmise õppetunni saamiseks siin!] (./ õppetund 6)