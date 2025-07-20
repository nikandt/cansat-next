---
sidebar_position: 10
---

# Õppetund 9: Ühed ja nullid

Siiani oleme andmete salvestamisel või edastamisel kasutanud teksti. Kuigi see muudab andmete tõlgendamise lihtsaks, on see ka ebaefektiivne. Arvutid kasutavad sisemiselt **binaarandmeid**, kus andmed salvestatakse ühete ja nullide jadadena. Selles õppetunnis vaatleme viise, kuidas kasutada binaarandmeid CanSat NeXT-iga, ja arutame, kus ja miks võib see olla kasulik.

:::info

## Erinevad andmetüübid

Binaarses vormis esitatakse kõik andmed—olgu need numbrid, tekst või anduri näidud—ühete ja nullide jadana. Erinevad andmetüübid kasutavad erinevat mälu mahtu ja tõlgendavad binaarväärtusi spetsiifilistel viisidel. Vaatame lühidalt üle mõned levinud andmetüübid ja kuidas neid binaarselt salvestatakse:

- **Täisarv (int)**:  
  Täisarvud esindavad täisarve. Näiteks 16-bitine täisarv võib esindada väärtusi vahemikus \(-32,768\) kuni \(32,767\). Negatiivsed arvud salvestatakse meetodiga, mida nimetatakse **kahe komplemendiks**.

- **Allkirjastamata täisarv (uint)**:  
  Allkirjastamata täisarvud esindavad mitte-negatiivseid arve. 16-bitine allkirjastamata täisarv võib salvestada väärtusi vahemikus \(0\) kuni \(65,535\), kuna märke jaoks pole bitte reserveeritud.

- **Ujukomaarv (float)**:  
  Ujukomaarvud esindavad kümnendväärtusi. 32-bitises ujukomaarvus esindavad osa bittidest märki, eksponenti ja mantissi, võimaldades arvutitel käsitleda väga suuri ja väga väikeseid arve. See on sisuliselt binaarne vorm [teaduslikust märkusest](https://en.wikipedia.org/wiki/Scientific_notation).

- **Tähemärgid (char)**:  
  Tähemärgid salvestatakse kodeerimisskeemide abil, nagu **ASCII** või **UTF-8**. Iga tähemärk vastab konkreetsele binaarväärtusele (nt 'A' ASCII-s salvestatakse kui `01000001`).

- **Stringid**:  
  Stringid on lihtsalt tähemärkide kogumid. Iga stringi tähemärk salvestatakse järjestikku üksikute binaarväärtustena. Näiteks string `"CanSat"` salvestatakse tähemärkide jadana nagu `01000011 01100001 01101110 01010011 01100001 01110100` (igaüks esindab 'C', 'a', 'n', 'S', 'a', 't'). Nagu näete, on numbrite esindamine stringidena, nagu oleme seni teinud, vähem efektiivne võrreldes nende salvestamisega binaarväärtustena.

- **Massiivid ja `uint8_t`**:  
  Binaarandmetega töötamisel on tavaline kasutada `uint8_t` massiivi toore baitandmete salvestamiseks ja käsitlemiseks. `uint8_t` tüüp esindab allkirjastamata 8-bitist täisarvu, mis võib hoida väärtusi vahemikus 0 kuni 255. Kuna iga bait koosneb 8 bitist, sobib see tüüp hästi binaarandmete hoidmiseks.
  `uint8_t` massiive kasutatakse sageli baitpuhvrite loomiseks, et hoida toore binaarandmete jadasid (nt pakette). Mõned eelistavad `char` või muid muutujaid, kuid tegelikult pole vahet, millist kasutatakse, kui muutuja pikkus on 1 bait.
:::

## Binaarandmete edastamine

Alustame lihtsa programmi laadimisega CanSat-ile ja keskendume rohkem maajaama poolele. Siin on lihtne kood, mis edastab näidu binaarformaadis:

```Cpp title="Edasta LDR andmed binaarsena"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

Kood näeb välja muidu väga tuttav, kuid `sendData` võtab nüüd kaks argumenti ühe asemel - esiteks edastatavate andmete **mäluaadress** ja seejärel edastatavate andmete **pikkus**. Selles lihtsustatud juhtumis kasutame lihtsalt muutuja `LDR_voltage` aadressi ja pikkust.

Kui proovite seda tüüpilise maajaama koodiga vastu võtta, prindib see lihtsalt mõttetust, kuna see üritab tõlgendada binaarandmeid kui stringi. Selle asemel peame maajaamale täpsustama, mida andmed sisaldavad.

Esmalt vaatame, kui pikad on andmed, mida me tegelikult vastu võtame.

```Cpp title="Kontrolli vastuvõetud andmete pikkust"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Vastu võetud ");
  Serial.print(len);
  Serial.println(" baiti");
}
```

Iga kord, kui satelliit edastab, võtame maajaamas vastu 4 baiti. Kuna edastame 32-bitist ujukomaarvu, tundub see õige.

Andmete lugemiseks peame võtma binaarandmete puhvri sisendvoost ja kopeerima andmed sobivasse muutujasse. Selle lihtsa juhtumi puhul saame seda teha järgmiselt:

```Cpp title="Salvesta andmed muutujasse"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Vastu võetud ");
  Serial.print(len);
  Serial.println(" baiti");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Andmed: ");
  Serial.println(LDR_reading);
}
```

Esmalt tutvustame muutujat `LDR_reading`, et hoida andmeid, mida me *teame*, et meil on puhvris. Seejärel kasutame `memcpy` (mälukoopia), et kopeerida binaarandmed `data` puhvrist `LDR_reading` **mäluaadressile**. See tagab, et andmed edastatakse täpselt nii, nagu need salvestati, säilitades sama vormingu nagu satelliidi poolel.

Nüüd, kui me andmeid prindime, on see nagu loeksime neid otse GS poolel. See pole enam tekst nagu varem, vaid tegelikud samad andmed, mida lugesime satelliidi poolel. Nüüd saame neid GS poolel hõlpsasti töödelda, nagu soovime.

## Oma protokolli loomine

Binaarandmete edastamise tegelik jõud ilmneb, kui meil on rohkem andmeid edastada. Siiski peame endiselt tagama, et satelliit ja maajaam lepivad kokku, milline bait mida esindab. Seda nimetatakse **paketiprotokolliks**.

Paketiprotokoll määratleb edastatavate andmete struktuuri, täpsustades, kuidas pakkida mitu andmetükki ühte edastusse, ja kuidas vastuvõtja peaks sissetulevaid baite tõlgendama. Loome lihtsa protokolli, mis edastab mitmeid anduri näite struktureeritud viisil.

Esmalt loeme kõik kiirendusmõõturi ja güroskoobi kanalid ning loome näitudest **andmepaketi**.

```Cpp title="Edasta LDR andmed binaarsena"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Loo massiiv andmete hoidmiseks
  uint8_t packet[24];

  // Kopeeri andmed paketti
  memcpy(&packet[0], &ax, 4);  // Kopeeri kiirendusmõõturi X baitidesse 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Kopeeri güroskoobi Z baitidesse 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Siin loeme esmalt andmed nagu õppetunnis 3, kuid seejärel **kodeerime** andmed andmepaketti. Esiteks luuakse tegelik puhver, mis on lihtsalt tühi 24-baidine komplekt. Iga andmemuutuja saab seejärel `memcpy` abil kirjutada sellesse tühja puhvrit. Kuna kasutame `float`, on andmete pikkus 4 baiti. Kui te pole muutuja pikkuses kindel, saate seda alati kontrollida `sizeof(variable)` abil.

:::tip[Harjutus]

Loo maajaama tarkvara, et tõlgendada ja printida kiirendusmõõturi ja güroskoobi andmeid.

:::

## Binaarandmete salvestamine SD-kaardile

Andmete binaarsena SD-kaardile kirjutamine võib olla kasulik, kui töötate väga suurte andmehulkadega, kuna binaarne salvestus on kompaktsem ja efektiivsem kui tekst. See võimaldab salvestada rohkem andmeid väiksema mälumahuga, mis võib olla kasulik mälu piiratud süsteemides.

Kuid binaarandmete kasutamine salvestamiseks toob kaasa kompromisse. Erinevalt tekstifailidest pole binaarfailid inimloetavad, mis tähendab, et neid ei saa lihtsalt avada ja mõista tavaliste tekstiredaktoritega või importida programmidesse nagu Excel. Binaarandmete lugemiseks ja tõlgendamiseks tuleb välja töötada spetsiaalne tarkvara või skriptid (nt Pythonis), et binaarvormingut õigesti parsida.

Enamikul juhtudel, kus on oluline juurdepääsu lihtsus ja paindlikkus (näiteks andmete analüüsimine hiljem arvutis), on soovitatavad tekstipõhised vormingud nagu CSV. Need vormingud on lihtsamad töötamiseks erinevates tarkvaratööriistades ja pakuvad rohkem paindlikkust kiireks andmeanalüüsiks.

Kui olete pühendunud binaarsalvestuse kasutamisele, uurige põhjalikumalt, kuidas CanSat-i teek käsitleb andmete salvestamist sisemiselt. Võite otse kasutada C-stiilis failihaldusmeetodeid failide, voogude ja muude madala taseme toimingute tõhusaks haldamiseks. Rohkem teavet leiate ka [Arduino SD-kaardi teegist](https://docs.arduino.cc/libraries/sd/).

---

Meie programmid muutuvad üha keerukamaks ja on ka mõned komponendid, mida oleks tore mujal taaskasutada. Et vältida meie koodi haldamise raskendamist, oleks tore, kui saaksime jagada mõningaid komponente erinevatesse failidesse ja hoida koodi loetavana. Vaatame, kuidas seda saab saavutada Arduino IDE-ga.

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson10)