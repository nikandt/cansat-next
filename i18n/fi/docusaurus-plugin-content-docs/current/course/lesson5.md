---
sidebar_position: 5
---

# Oppitunti 5: Bittien ja tavujen tallentaminen

Joskus datan saaminen suoraan tietokoneelle ei ole mahdollista, kuten silloin, kun laitetta heitellään, laukaistaan raketilla tai otetaan mittauksia vaikeapääsyisissä paikoissa. Tällaisissa tapauksissa on parasta tallentaa mitattu data SD-kortille myöhempää käsittelyä varten. Lisäksi SD-korttia voidaan käyttää asetusten tallentamiseen - esimerkiksi voisimme tallentaa jonkinlaisen kynnysarvon tai osoiteasetukset SD-kortille.

## SD-kortti CanSat NeXT -kirjastossa

CanSat NeXT -kirjasto tukee laajaa valikoimaa SD-korttioperaatioita. Sitä voidaan käyttää tiedostojen tallentamiseen ja lukemiseen, mutta myös hakemistojen ja uusien tiedostojen luomiseen, niiden siirtämiseen tai jopa poistamiseen. Kaikki nämä voivat olla hyödyllisiä eri tilanteissa, mutta keskitytään tässä kahteen perusasiaan - tiedoston lukemiseen ja datan kirjoittamiseen tiedostoon.

:::note

Jos haluat täydellisen hallinnan tiedostojärjestelmästä, löydät komennot [kirjaston määrittelystä](./../CanSat-software/library_specification.md#sdcardpresent) tai kirjaston esimerkistä "SD_advanced".

:::

Harjoituksena muokataan edellisen oppitunnin koodia niin, että LDR-mittausten kirjoittamisen sijaan sarjaporttiin tallennamme ne SD-kortille.

Määritellään ensin tiedoston nimi, jota käytämme. Lisätään se ennen setup-funktiota **globaalina muuttujana**.

```Cpp title="Muokattu Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Nyt kun meillä on tiedostopolku, voimme kirjoittaa SD-kortille. Tarvitsemme vain kaksi riviä sen tekemiseen. Paras komento mittaustiedon tallentamiseen on `appendFile()`, joka ottaa tiedostopolun ja kirjoittaa uuden datan tiedoston loppuun. Jos tiedostoa ei ole, se luo sen. Tämä tekee komennon käytöstä erittäin helppoa (ja turvallista). Voimme vain lisätä datan siihen suoraan ja sitten lisätä rivinvaihdon, jotta data on helpompi lukea. Ja siinä se! Nyt tallennamme mittaukset.

```Cpp title="LDR-datan tallentaminen SD-kortille"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR-arvo:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Oletuksena `appendFile()`-komento tallentaa liukulukuarvot kahdella desimaalilla. Tarkempaa toiminnallisuutta varten voit ensin luoda merkkijonon luonnoksessa ja käyttää komentoa `appendFile()` tallentaaksesi kyseisen merkkijonon SD-kortille. Esimerkiksi:

```Cpp title="LDR-datan tallentaminen SD-kortille"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Tässä lopullinen merkkijono luodaan ensin, ja `String(LDR_voltage, 6)` määrittää, että haluamme 6 desimaalia pisteen jälkeen. Voimme käyttää samaa merkkijonoa datan tulostamiseen ja tallentamiseen. (Sekä lähettämiseen radion kautta)

## Datan lukeminen

On usein hyödyllistä tallentaa jotain SD-kortille myöhempää käyttöä varten ohjelmassa. Nämä voivat olla esimerkiksi asetuksia laitteen nykyisestä tilasta, jotta jos ohjelma nollautuu, voimme ladata nykyisen tilan uudelleen SD-kortilta sen sijaan, että aloittaisimme oletusarvoista.

Tämän havainnollistamiseksi lisää tietokoneella uusi tiedosto SD-kortille nimeltä "delay_time" ja kirjoita tiedostoon numero, kuten 200. Yritetään korvata ohjelmassamme staattisesti asetettu viiveaika tiedostosta luetulla asetuksella.

Yritetään lukea asetus tiedostosta setupissa. Ensin esitellään uusi globaali muuttuja. Annoin sille oletusarvoksi 1000, jotta jos emme onnistu muuttamaan viiveaikaa, tämä on nyt oletusasetus.

Setupissa meidän pitäisi ensin tarkistaa, onko tiedostoa edes olemassa. Tämä voidaan tehdä komennolla `fileExists()`. Jos ei ole, käytetään vain oletusarvoa. Tämän jälkeen data voidaan lukea komennolla `readFile()`. Huomaa kuitenkin, että se on merkkijono - ei kokonaisluku, kuten tarvitsemme. Joten, muutetaan se Arduino-komennolla `toInt()`. Lopuksi tarkistamme, onnistuiko muunnos. Jos ei, arvo on nolla, jolloin käytämme vain oletusarvoa.

```Cpp title="Asetuksen lukeminen setupissa"
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

Lopuksi, älä unohda muuttaa viivettä loopissa käyttämään uutta muuttujaa.

```Cpp title="Dynaamisesti asetettu viivearvo"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Voit nyt kokeilla muuttaa arvoa SD-kortilla tai jopa poistaa SD-kortin, jolloin sen pitäisi nyt käyttää oletusarvoa viiveen pituudelle.

:::note

Kirjoittaaksesi asetuksen uudelleen ohjelmassasi, voit käyttää komentoa [writeFile](./../CanSat-software/library_specification.md#writefile). Se toimii aivan kuten [appendFile](./../CanSat-software/library_specification.md#appendfile), mutta korvaa olemassa olevan datan.

:::

:::tip[Harjoitus]

Jatka ratkaisustasi oppitunnin 4 harjoitukseen niin, että tila säilyy, vaikka laite nollautuisi. Eli tallenna nykyinen tila SD-kortille ja lue se setupissa. Tämä simuloisi tilannetta, jossa CanSatisi yhtäkkiä nollautuu lennon aikana tai ennen lentoa, ja tämän ohjelman avulla saisit silti onnistuneen lennon.

:::

---

Seuraavassa oppitunnissa tarkastelemme radion käyttöä datan lähettämiseen prosessorien välillä. Sinulla pitäisi olla jonkinlainen antenni CanSat NeXTissäsi ja maa-asemassa ennen näiden harjoitusten aloittamista. Jos et ole vielä tehnyt niin, tutustu ohjeeseen perusantennin rakentamisesta: [Antennin rakentaminen](./../CanSat-hardware/communication#quarter-wave-antenna).

[Napsauta tästä seuraavaan oppituntiin!](./lesson6)