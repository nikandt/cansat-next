---
sidebar_position: 12
---

# Õppetund 11: Satelliit peab kasvama

Kuigi CanSat NeXT-il on juba palju integreeritud sensoreid ja seadmeid satelliidi plaadil endal, nõuavad paljud põnevad CanSat missioonid teiste väliste sensorite, servode, kaamerate, mootorite või muude täiturmehhanismide ja seadmete kasutamist. See õppetund on veidi erinev eelmistest, kuna arutame erinevate välisseadmete integreerimist CanSat-iga. Teie tegelik kasutusjuhtum ei pruugi olla käsitletud, kuid võib-olla on midagi sarnast. Kui aga tunnete, et siin peaks midagi käsitletud olema, saatke mulle tagasisidet aadressil samuli@kitsat.fi.

See õppetund on veidi erinev eelmistest, kuna kuigi kogu teave on kasulik, peaksite tundma end vabalt liikuma teie projektiga konkreetselt seotud aladele ja kasutama seda lehte viitena. Enne selle õppetunni jätkamist vaadake läbi CanSat NeXT dokumentatsiooni [riistvara](./../CanSat-hardware/CanSat-hardware.md) jaotis, kuna see hõlmab palju teavet, mis on vajalik välisseadmete integreerimiseks.

## Välisseadmete ühendamine

On kaks suurepärast viisi välisseadmete ühendamiseks CanSat NeXT-iga: kasutades [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) ja kohandatud PCB-sid. Oma PCB tegemine on lihtsam (ja odavam), kui arvate, ja alustamiseks on hea lähtepunkt see [KiCAD õpetus](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Meil on ka [mall](../CanSat-hardware/mechanical_design#custom-PCB) saadaval KiCAD jaoks, nii et oma plaatide tegemine samas formaadis on väga lihtne.

Sellegipoolest on enamiku CanSat missioonide jaoks väliste sensorite või muude seadmete jootmine perf plaadile suurepärane viis usaldusväärsete, vastupidavate elektroonikakomplektide loomiseks.

Veelgi lihtsam viis alustamiseks, eriti esmakordsel prototüüpimisel, on kasutada hüppajakaableid (tuntud ka kui Dupont-kaablid või leivaplaadi juhtmed). Neid tarnitakse tavaliselt isegi sensorite jaoturitega, kuid neid saab ka eraldi osta. Need jagavad sama 0,1-tollist sammupikkust, mida kasutab laienduspinna päis, mis muudab seadmete ühendamise kaablitega väga lihtsaks. Kuid kuigi kaableid on lihtne kasutada, on need üsna mahukad ja ebausaldusväärsed. Seetõttu on soovitatav vältida kaableid oma CanSat-i lennumudeli jaoks.

## Seadmetele toite jagamine

CanSat NeXT kasutab kõigi oma seadmete jaoks 3,3 volti, mistõttu on see ainus pingeliin, mis on samuti laienduspäisele antud. Paljud kaubanduslikud jaoturid, eriti vanemad, toetavad ka 5-voldist töörežiimi, kuna see on pinge, mida kasutavad vanemad Arduinod. Kuid valdav enamus seadmeid toetab ka otse 3,3-voldist töörežiimi.

Mõnel juhul, kus 5 volti on absoluutselt vajalik, saate plaadile lisada **pingemuunduri**. Saadaval on valmis mooduleid, kuid võite ka otse joota palju seadmeid perf plaadile. Sellegipoolest proovige kõigepealt seadet kasutada 3,3 voldiga, kuna on suur tõenäosus, et see töötab.

Maksimaalne soovitatav voolutarve 3,3-voldiselt liinilt on 300 mA, seega kaaluge voolunäljaste seadmete, nagu mootorid või küttekehad, puhul välist toiteallikat.

## Andmeliinid

Laienduspäisel on kokku 16 pinni, millest kaks on reserveeritud maandus- ja toitejuhtmetele. Ülejäänud on erinevat tüüpi sisendid ja väljundid, millest enamikul on mitu võimalikku kasutusviisi. Plaadi pinout näitab, mida iga pinni saab teha.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Kõiki avatud pinne saab kasutada üldotstarbeliste sisendite ja väljunditena (GPIO), mis tähendab, et saate nende abil koodis täita `digitalWrite` ja `digitalRead` funktsioone.

### ADC

Pinid 33 ja 32 on varustatud analoog-digitaalmuunduriga (ADC), mis tähendab, et saate kasutada `analogRead` (ja `adcToVoltage`) pingete lugemiseks sellel pinnil.

### DAC

Neid pinne saab kasutada konkreetse pinge loomiseks väljundil. Pange tähele, et nad toodavad soovitud pinget, kuid nad saavad pakkuda ainult väga väikest voolu. Neid võiks kasutada sensorite viitepunktidena või isegi heliväljundina, kuid vajate võimendit (või kahte). Saate kasutada `dacWrite`, et kirjutada pinget. CanSat-i raamatukogus on ka selle kohta näide.

### SPI

Serial Peripheral Interface (SPI) on standardne andmeliin, mida sageli kasutavad Arduino jaoturid ja sarnased seadmed. SPI-seade vajab nelja pinni:

| **Pin Name**    | **Description**                                              | **Usage**                                                       |
|-----------------|--------------------------------------------------------------|-----------------------------------------------------------------|
| **MOSI**        | Main Out Secondary In                                         | Andmed, mis saadetakse põhiseadmest (nt CanSat) teiseseadmesse. |
| **MISO**        | Main In Secondary Out                                         | Andmed, mis saadetakse teiseseadmest tagasi põhiseadmesse.      |
| **SCK**         | Serial Clock                                                  | Kellasignaal, mille genereerib põhiseade, et sünkroniseerida suhtlust. |
| **SS/CS**       | Secondary Select/Chip Select                                  | Kasutatakse põhiseadme poolt, et valida, millise teiseseadmega suhelda. |

Siin on peamine CanSat NeXT plaat ja teisene on mis iganes seade, millega soovite suhelda. MOSI, MISO ja SCK pinne saab jagada mitme teisesega, kuid kõigil neist on vaja oma CS pinni. CS pin võib olla mis tahes GPIO pin, mistõttu pole bussis pühendatud pinni.

(Märkus: vanemates materjalides kasutatakse mõnikord termineid "master" ja "slave", et viidata peamisele ja teiseseseadmele. Need terminid on nüüdseks vananenud.)

CanSat NeXT plaadil kasutab SD-kaart sama SPI-liini kui laienduspäis. Kui ühendate bussi teise SPI-seadme, ei ole see oluline. Kui aga SPI-pinne kasutatakse GPIO-na, on SD-kaart sisuliselt keelatud.

SPI kasutamiseks peate sageli määrama, milliseid pinne protsessorist kasutatakse. Üks näide võiks olla selline, kus CanSat-i raamatukogus sisalduvaid **makrosid** kasutatakse teiste pinide seadmiseks ja pin 12 on määratud kiibi valikuks.

```Cpp title="SPI-liini initsialiseerimine sensori jaoks"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Makrod `SPI_CLK`, `SPI_MOSI` ja `SPI_MISO` asendatakse kompilaatori poolt vastavalt 18, 23 ja 19-ga.

### I2C

Inter-Integrated Circuit on teine populaarne andmebussi protokoll, mida kasutatakse eriti väikeste integreeritud sensorite jaoks, nagu rõhuandur ja IMU CanSat NeXT plaadil.

I2C on mugav, kuna see vajab ainult kahte pinni, SCL ja SDA. Eraldi kiibi valiku pinni ei ole, vaid erinevad seadmed eristatakse erinevate **aadresside** abil, mida kasutatakse suhtluse loomiseks. Sel viisil saate samal bussil olla mitu seadet, kui neil kõigil on unikaalne aadress.

| **Pin Name** | **Description**          | **Usage**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **SDA**      | Serial Data Line          | Kahepoolne andmeliin, mida kasutatakse suhtlemiseks põhiseadme ja teiseseadmete vahel. |
| **SCL**      | Serial Clock Line         | Kellasignaal, mille genereerib põhiseade, et sünkroniseerida andmeedastus teiseseadmetega. |

Baromeeter ja IMU on samal I2C-bussil kui laienduspäis. Kontrollige nende seadmete aadresse lehelt [On-Board sensors](../CanSat-hardware/on_board_sensors#IMU). Sarnaselt SPI-ga saate neid pinne kasutada teiste I2C-seadmete ühendamiseks, kuid kui neid kasutatakse GPIO-pinnidena, on IMU ja baromeeter keelatud.

Arduino programmeerimisel nimetatakse I2C-d mõnikord `Wire`. Erinevalt SPI-st, kus pinout määratakse sageli iga sensori jaoks, kasutatakse I2C-d Arduinos sageli esmalt andmeliini loomisel ja seejärel viidates sellele iga sensori jaoks. Allpool on näide, kuidas CanSat NeXT raamatukogu initsialiseerib baromeetri:

```Cpp title="Teise seerialiini initsialiseerimine"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Nii et esmalt initsialiseeritakse `Wire`, määrates sellele õiged I2C-pinnid. CanSat NeXT raamatukogus määratud makrod `I2C_SDA` ja `I2C_SCL` asendatakse kompilaatori poolt vastavalt 22 ja 21-ga.

### UART

Universaalne asünkroonne vastuvõtja-saatja (UART) on mõnes mõttes kõige lihtsam andmeprotokoll, kuna see lihtsalt saadab andmeid binaarselt kindlaksmääratud sagedusel. Seetõttu on see piiratud punkt-punkt suhtlusega, mis tähendab, et tavaliselt ei saa teil olla samal bussil mitu seadet.

| **Pin Name** | **Description**          | **Usage**                                                     |
|--------------|--------------------------|---------------------------------------------------------------|
| **TX**       | Transmit                  | Saadab andmeid põhiseadmest teiseseadmesse.                   |
| **RX**       | Receive                   | Vastuvõtab andmeid teiseseadmest põhiseadmesse.               |

CanSat-il ei kasutata laienduspäisel UART-i muuks otstarbeks. On olemas teine UART-liin, kuid seda kasutatakse USB-suhtluseks satelliidi ja arvuti vahel. Seda kasutatakse andmete saatmiseks `Serial`-ile.

Teine UART-liin saab koodis initsialiseerida järgmiselt:

```Cpp title="Teise seerialiini initsialiseerimine"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Mõned seadmed kasutavad ka [impulsi laiuse modulatsiooni](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) oma juhtsisendina. Seda saab kasutada ka hämardatavate LED-ide või mõnes olukorras toiteväljundi juhtimiseks, paljude teiste kasutusjuhtude hulgas.

Arduinoga saab PWM-ina kasutada ainult teatud pinne. Kuid kuna CanSat NeXT on ESP32-põhine seade, saab kõiki väljundpinne kasutada PWM-väljundi loomiseks. PWM-i juhitakse `analogWrite` abil.

## Mis saab (minu konkreetsest kasutusjuhtumist)?

Enamiku seadmete kohta leiate palju teavet internetist. Näiteks otsige üles konkreetne jaotur, mis teil on, ja kasutage neid dokumente, et kohandada leitud näiteid CanSat NeXT-iga kasutamiseks. Samuti on sensoritel ja teistel seadmetel **andmelehed**, mis peaksid sisaldama palju teavet seadme kasutamise kohta, kuigi need võivad olla mõnikord keerulised lahti mõtestada. Kui tunnete, et siin lehel peaks midagi käsitletud olema, andke mulle sellest teada aadressil samuli@kitsat.fi.

Järgmises, viimases õppetunnis arutame, kuidas oma satelliiti stardiks ette valmistada.

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson12)