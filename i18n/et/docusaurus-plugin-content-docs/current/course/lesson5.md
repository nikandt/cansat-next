---
sidebar_position: 5
---

# Õppetund 5: Bittide ja baitide salvestamine

Mõnikord ei ole andmete otse arvutisse edastamine võimalik, näiteks kui seadet visatakse ringi, lastakse raketiga või mõõdetakse raskesti ligipääsetavates kohtades. Sellistel juhtudel on kõige parem salvestada mõõdetud andmed SD-kaardile, et neid hiljem töödelda. Lisaks saab SD-kaarti kasutada ka seadete salvestamiseks - näiteks võiksime salvestada mingi tüüpi läve või aadressi seaded SD-kaardile.

## SD kaart CanSat NeXT teegis

CanSat NeXT teek toetab laia valikut SD-kaardi toiminguid. Seda saab kasutada failide salvestamiseks ja lugemiseks, aga ka kataloogide ja uute failide loomiseks, nende ümber liigutamiseks või isegi kustutamiseks. Kõik need võivad olla kasulikud erinevates olukordades, kuid keskendume siin kahele põhilisele asjale - faili lugemisele ja andmete kirjutamisele faili.

:::note

Kui soovite failisüsteemi täielikku kontrolli, leiate käsud [Teegi spetsifikatsioonist](./../CanSat-software/library_specification.md#sdcardpresent) või teegi näitest "SD_advanced".

:::

Harjutusena muudame eelmise õppetunni koodi nii, et LDR mõõtmiste kirjutamise asemel jadapordi kaudu salvestame need SD-kaardile.

Kõigepealt määratleme faili nime, mida kasutame. Lisame selle enne seadistusfunktsiooni **globaalse muutujana**.

```Cpp title="Muudetud seadistus"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Nüüd, kui meil on failitee, saame kirjutada SD-kaardile. Selleks on vaja vaid kahte rida. Parim käsk mõõteandmete salvestamiseks on `appendFile()`, mis võtab lihtsalt failitee ja kirjutab uued andmed faili lõppu. Kui faili ei eksisteeri, luuakse see. See muudab käsu kasutamise väga lihtsaks (ja turvaliseks). Saame lihtsalt otse andmed lisada ja seejärel järgida seda reavahetusega, et andmeid oleks lihtsam lugeda. Ja ongi kõik! Nüüd salvestame mõõtmised.

```Cpp title="LDR andmete salvestamine SD-kaardile"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR väärtus:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Vaikimisi salvestab `appendFile()` käsk ujukomaarvud kahe komakoha täpsusega. Spetsiifilisema funktsionaalsuse jaoks võite esmalt luua visandis stringi ja kasutada käsku `appendFile()`, et see string SD-kaardile salvestada. Näiteks:

```Cpp title="LDR andmete salvestamine SD-kaardile"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Siin luuakse lõplik string esmalt, `String(LDR_voltage, 6)` määrab, et soovime 6 komakohta. Saame sama stringi kasutada nii andmete printimiseks kui ka salvestamiseks. (Samuti raadioside kaudu edastamiseks)

## Andmete lugemine

Sageli on kasulik salvestada midagi SD-kaardile ka programmi edaspidiseks kasutamiseks. Need võivad olla näiteks seaded seadme praeguse oleku kohta, nii et kui programm taaskäivitub, saame praeguse oleku uuesti SD-kaardilt laadida, selle asemel et alustada vaikeseadetega.

Selle demonstreerimiseks lisage arvutis SD-kaardile uus fail nimega "delay_time" ja kirjutage faili number, näiteks 200. Proovime asendada meie programmis staatiliselt määratud viivitusaeg failist loetud seadega.

Proovime lugeda seadistusfaili seadistuses. Kõigepealt tutvustame uut globaalset muutujat. Andsin sellele vaikimisi väärtuse 1000, nii et kui me ei suuda viivitusaega muuta, on see nüüd vaikeseade.

Seadistuses peaksime kõigepealt kontrollima, kas fail üldse eksisteerib. Seda saab teha käsuga `fileExists()`. Kui ei, siis kasutame lihtsalt vaikimisi väärtust. Pärast seda saab andmeid lugeda käsuga `readFile()`. Siiski peaksime märkima, et see on string - mitte täisarv, nagu meil vaja oleks. Seega teisendame selle Arduino käsuga `toInt()`. Lõpuks kontrollime, kas teisendamine õnnestus. Kui ei, on väärtus null, sel juhul kasutame lihtsalt vaikimisi väärtust.

```Cpp title="Seadistuse lugemine seadistuses"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Lõpuks ärge unustage muuta viivitust tsüklis, et kasutada uut muutujat.

```Cpp title="Dünaamiliselt määratud viivitusväärtus"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Nüüd saate proovida muuta väärtust SD-kaardil või isegi SD-kaardi eemaldamist, sel juhul peaks see nüüd kasutama vaikimisi viivituse pikkust.

:::note

Seadistuse ümberkirjutamiseks oma programmis saate kasutada käsku [writeFile](./../CanSat-software/library_specification.md#writefile). See töötab täpselt nagu [appendFile](./../CanSat-software/library_specification.md#appendfile), kuid kirjutab olemasolevad andmed üle.

:::

:::tip[Harjutus]

Jätkake oma lahendust harjutusele õppetunnis 4, nii et olek säilitatakse isegi siis, kui seade lähtestatakse. St salvestage praegune olek SD-kaardile ja lugege see seadistuses. See simuleeriks olukorda, kus teie CanSat ootamatult lähtestatakse lennu ajal või enne lendu ja selle programmiga saavutaksite siiski eduka lennu.

:::

---

Järgmises õppetunnis vaatleme raadio kasutamist andmete edastamiseks protsessorite vahel. Teie CanSat NeXT-is ja maajaamas peaks olema mingi tüüpi antenn, enne kui alustate neid harjutusi. Kui te pole seda veel teinud, vaadake juhendit põhilise antenni ehitamiseks: [Antenni ehitamine](./../CanSat-hardware/communication#quarter-wave-antenna).

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson6)