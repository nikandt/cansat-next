---
Külgriba_positsioon: 12
---

# 11. õppetund: satelliit peab kasvama

Kui järgmisel CanSatil on satelliittahvlil ise juba palju integreeritud andureid ja seadmeid, nõuavad paljud põnevad konkatsimissioonid muid väliseid andureid, servosid, kaameraid, mootoreid või muid ajameid ja seadmeid. See õppetund on eelmistest pisut erinev, kuna arutame erinevate väliste seadmete integreerimist CanSat'iga. Teie tegelikku kasutusjuhtumit tõenäoliselt ei arvestata, kuid võib -olla on midagi sarnast. Kui aga siin on midagi, mis peaks siin katma, saatke mulle tagasisidet aadressil samuli@kitsat.fi.

See õppetund on eelmisest pisut erinev, kuna kuigi kogu teave on kasulik, peaksite vabalt hüppama teie projekti jaoks olulistesse piirkondadesse, ja kasutama seda lehte viitena. Enne selle õppetunni jätkamist vaadake siiski läbi [riistvara] (./../ cansathardware/cansat-hardware.md) esitatud materjalid CanSat järgmise dokumendi jaotises, kuna see hõlmab palju teavet, mis on vajalik väliste seadmete integreerimiseks.

## Väliste seadmete ühendamine

Järgmisena on kaks suurepärast viisi väliste seadmete ühendamiseks CanSat: kasutades [perf-plaadid] (.. Oma PCB valmistamine on lihtsam (ja odavam), kui võite arvata, ja nendega alustamiseks on hea lähtepunkt see [Kicadi juhendaja] (https://docs.kicad.org/8.0/en/geting_startted_in_kicad/getting_startEd_in_in_kicad.html). Meil on ka [mall] (../ CanSat-Hardware/Mechanical_design.md#Designing-a-tan-pcb) Kicadi jaoks saadaval, nii et teie laudade sama vormingusse viimine on väga lihtne.

Sellegipoolest on enamiku CanSat -missioonide jaoks väliste andurite või muude seadmete Perf -plaadile jootmise suurepärane viis usaldusväärsete, vastupidavate elektroonika virnade loomiseks.

Alustamiseks veelgi lihtsam viis, eriti kui esimene prototüüpimine, on kasutada hüppajakaableid (seda nimetatakse ka DuPonti kaabliteks või leivalaua traadist). Tavaliselt varustatakse neid isegi anduri purunemisega, kuid neid saab ka eraldi osta. Neil on sama 0,1 -tolline samm, mida kasutab pikendus tihvti päis, mis muudab ühendusseadmete kaablitega väga lihtsaks. Ehkki kaableid on hõlpsasti kasutatavad, on need üsna mahukad ja ebausaldusväärsed. Sel põhjusel on soojalt soovitatav kasutada kaaniku mudeli kaablite vältimist.

## Seadmetele jõu jagamine

CanSat kasutab järgmisena kõigi oma seadmete jaoks 3,3 volti, mistõttu on see ainus pingejoon, mis on ka pikenduspäisele pakutav. Paljud kommertspurud, eriti vanemad, toetavad ka 5 -voldist operatsiooni, kuna see on pinge, mida kasutab pärand Arduinos. Kuid valdav enamus seadmeid toetab ka operatsiooni otse 3,3 volti.

Mõnel juhul, kui 5 volti on hädavajalik, võite tahvlile lisada ** Boost muunduri **. Saadaval on valmistatud moodulid, kuid saate ka palju seadmeid PERF -i tahvlile joota. Sellegipoolest proovige seadet kõigepealt kasutada 3,3 volti, kuna see töötab hea võimalus.

3,3-voldise joone maksimaalne soovitatav voolujooks on 300 mA, nii et praeguste näljaste seadmete, näiteks mootorite või küttekehade puhul, kaaluge välist energiaallikat.

## Andmeliinid

Pikenduspäis on kokku 16 tihvti, millest kaks on reserveeritud maa- ja elektriliinide jaoks. Ülejäänud on erinevat tüüpi sisendid ja väljundid, millest enamikul on mitu võimalikku kasutust. Laua pinout näitab, mida iga tihvt saab teha. 

! [Pinout] (../ cansathardware/img/pinout.png)

### GPIO

Kõiki paljastatud tihvte saab kasutada üldotstarbeliste sisendite ja väljunditena (GPIO), mis tähendab, et saate nende koodis funktsioone täita `DigitalWrite ja funktsioone.

### ADC

Pins 33 ja 32 on analoog digitaalse muunduriga (ADC), mis tähendab, et selle pinge lugemiseks võite kasutada analoogread (ja `ADCTOVALGE`).

### DAC

Neid tihvte saab kasutada väljundi konkreetse pinge loomiseks. Pange tähele, et nad toodavad soovitud pinge, kuid need võivad pakkuda ainult väga väikest kogust voolu. Neid võiks kasutada andurite võrdluspunktidena või isegi helikoduna, kuid vajate võimendit (või kahte). Pinge kirjutamiseks võite kasutada `dacwrite'i”. Selle jaoks on ka näide CanSat Libary's.

### SPI

Perifeerne liidese (SPI) on standardne dataliin, mida sageli kasutavad Arduino purunemised ja sarnased seadmed. SPI -seade vajab nelja tihvti:

| ** PIN -i nimi ** | ** Kirjeldus ** | ** Kasutus ** |
| ----------------- | ----------------------------------------------------------------- |
| ** Mosi ** | Peamine keskharidus | Põhiseadmest (nt CANSAT) saadetud andmed sekundaarseadmesse. |
| ** Miso ** | Peamine sekundaarses väljas | Teisese seadmest tagasi põhiseadmesse saadetud andmed.      |
| ** SCK ** | Seeriakell | Peamise seadme loodud kellasignaal suhtluse sünkroonimiseks. |
| ** SS/CS ** | Teisene Select/Chip Select | Kasutab põhiseadme valimiseks, millise sekundaarseadmega suhelda. |

Siin on peamine CanSat järgmine tahvel ja sekundaarne on ükskõik milline seade, millega soovite suhelda. MOSI, MISO ja SCK -tihvte saab jagada mitu sekundaari, kuid kõik vajavad oma CS -i tihvti. CS -tihvt võib olla mis tahes GPIO tihvt, mistõttu pole bussis spetsiaalset. 

(Märkus. Pärandmaterjalid kasutavad mõnikord termineid "kapten" ja "ori", et viidata peamisele ja sekundaarsetele seadmetele. Neid termineid peetakse nüüd aegunuks.)

CanSat Next tahvlil kasutab SD -kaart sama SPI -liini kui pikenduspäisel. Teise SPI -seadme siiniga ühendamisel pole see oluline. Kui SPI -tihvte kasutatakse GPIO -na, on SD -kaart tõhusalt keelatud.

SPI kasutamiseks peate sageli täpsustama, milliseid protsessori tihvte kasutatakse. Üks näide võiks olla selline, kus teiste tihvtide seadmiseks kasutatakse CanSat teegis sisalduvat ** makrod ** ja Pin 12 seatakse CHIP Select.

`` `CPP Title =" SPI -rea lähtestamine anduri jaoks "
ADC.Begin (SPI_CLK, SPI_MOSI, SPI_MISO, 12);
`` `

Macros `spi_clk`,` spi_mosi` ja `spi_miso` asendatakse kompilaatoriga vastavalt 18, 23 ja 19. 

### i2c

Integreeritud vooluring on veel üks populaarne andmesiini protokoll, mida kasutatakse eriti väikeste integreeritud andurite jaoks, näiteks rõhuandur ja IMU CanSat järgmisel tahvlil. 

I2C on mugav, kuna see nõuab ainult kahte tihvti, SCL ja SDA. Samuti puudub eraldi kiibivaliku tihvt, vaid selle asemel eraldatakse erinevad seadmed erinevate ** aadressidega **, mida kasutatakse suhtluse loomiseks. Nii saate samal bussis olla mitu seadet, kui neil kõigil on ainulaadne aadress.

| ** PIN -i nimi ** | ** Kirjeldus ** | ** Kasutus ** |
| -------------- | ------------------------- | ----------------------------------------------------------------------- |
| ** SDA ** | Seeriaandmeliin | Kahesuunaline andmeliin, mida kasutatakse peamise ja sekundaarseadmete vaheliseks suhtlemiseks. |
| ** SCL ** | Seeriakell | Peaseadme genereeritud kellasignaal andmeedastuse sünkroonimiseks sekundaarsete seadmetega. |

Baromeeter ja IMU asuvad pikenduspäisega samal I2C bussil. Kontrollige nende seadmete aadresse lehel [pardal olevad andurid] (.. Sarnaselt SPI -ga saate neid tihvte kasutada teiste I2C -seadmete ühendamiseks, kuid kui neid kasutatakse GPIO -tihvtidena, on IMU ja baromeeter keelatud.

Arduino programmeerimisel nimetatakse I2C mõnikord traatimiseks. Erinevalt SPI -st, kus pinout on sageli iga anduri jaoks määratletud, kasutatakse I2C Arduinos sageli andmeliini loomisega ja viidates sellele seejärel iga anduri kohta. Allpool on näide sellest, kuidas baromeeter initsialiseerib CanSat järgmine teek:

`` `CPP Title =" teise jadajoone lähtestamine "
Traat.Begin (i2c_sda, i2c_scl);
initbaro (& traadi)
`` `

Niisiis, kõigepealt initsialiseeritakse traadi, öeldes sellele õiged i2c tihvtid. CanSat järgmise teegi seatud makrod `i2c_sda` ja` i2c_scl` asendatakse kompilaatoriga vastavalt 22 ja 21 -ga.

### Uart

Universaalne asünkroonne vastuvõtja transmitter (UART) on mõnes mõttes lihtsaim andmeprotokoll, kuna see lihtsalt saadab andmed määratud sagedusel binaarseks. Sellisena piirdub see punktist punktiga suhtlemisega, mis tähendab, et tavaliselt ei saa samal bussis olla mitu seadet.

| ** PIN -i nimi ** | ** Kirjeldus ** | ** Kasutus ** |
| -------------- | ------------------------- | ----------------------------------------------------------------------- |
| ** TX ** | Edastus | Saadab põhiseadmest sekundaarseadmesse andmeid.       |
| ** rx ** | Saada | Saab andmeid sekundaarseadmest põhiseadmesse.    |

Cansat'is ei kasutata pikenduspäises asuvat UART -i millegi muu jaoks. UART -liin on siiski veel üks, kuid seda kasutatakse satelliidi ja arvuti vaheliseks USB -suhtluseks. Seda kasutatakse andmete seeriasse saatmisel. 

Teise UART liini saab lähtestada koodis nagu see:

`` `CPP Title =" teise jadajoone lähtestamine "
Serial2.Begin (115200, Serial_8N1, 16, 17);
`` `

### PWM

Mõned seadmed kasutavad ka [impulss-laiusega modulatsiooni] (https://en.wikipedia.org/wiki/Pulse-Width_modulation) (PWM) nende juhtimissisendina. Seda saab kasutada ka hämardatavate LED -ide jaoks või mõnes olukorras väljundvõimsuse juhtimiseks.

Arduinoga saab PWM -na kasutada ainult teatud tihvte. Kuna CanSat järgmine on ESP32 -põhine seade, saab kõiki väljundtihvte kasutada PWM -väljundi loomiseks. PWM -i juhitakse analoogWrite'iga.


## Mis saab (minu konkreetne kasutusjuhtum)?

Enamiku seadmete kohta leiate Internetist palju teavet. Näiteks Google'i konkreetne läbimurre, mis teil on, ja kasutage neid dokumente näidete muutmiseks, mida leiate CanSatiga järgmisena kasutamiseks. Samuti on anduritel ja muudel seadmetel ** andmelehed **, millel peaks olema palju teavet seadme kasutamise kohta, ehkki neid võib mõnikord decypher olla pisut keeruline. Kui tunnete, et see leht oleks pidanud katma midagi, palun andke mulle sellest teada aadressil samuli@kitsat.fi.


Järgmises, lõplikus õppetunnis arutame, kuidas oma satelliiti käivitamiseks ette valmistada.

[Klõpsake järgmise õppetunni saamiseks siin!] (./ Õppetund12)