---
Külgriba_positsioon: 2
---

# Elektrienergia haldamine

See artikkel selgitab, kuidas CanSat Next tahvlil toita, kuidas väliseid seadmeid tahvliga ohutult ühendada ja kuidas toitesüsteem töötab.

## Alustamine

Enamiku kasutajate jaoks piisab sageli, kui lisate pardaakuhoidjale kaks AAA-batterit ja kinnitada need oma kohale. Kui USB on ühendatud, lülitub CanSat järgmisena patareide asemel automaatselt USB -toite kasutamiseks, nii et aku kestvus pikendatakse. Ärge unustage enne lendu vahetada värsketele akudele.

! [CanSat järgmisena installitud akudega] (./ IMG/CANSAT_WITH_BATERIES.PNG)

## CANSAT järgmine toitesüsteem

Järgmisena on CanSat'i toiteks kolm viisi. Vaikeviis on selle toiteks USB -ga, nii et kui kasutaja tarkvara arendab, annab arvuti seadet ja välist toidet pole vaja. Teine võimalus on kasutada pardaakusid (OBB). Selleks sisestatakse kaks standardset 1,5 V AAA patarei pealaua alumises küljes asuvasse aku pistikusse. USB on endiselt vaikimisi viis isegi siis, kui akud sisestatakse, st aku mahutavust ei kasutata USB ühendamisel.

Need on tavalised võimalused ja peaksid hõlmama enamiku kasutusjuhtumeid. Lisaks on vajadusel erieesmärgi jaoks ka kaks „edasijõudnute” võimalust CanSat'i toiteks. Esiteks on tahvlil tühjad augu päised, mida märgistatakse EXT, mida saab kasutada välise aku ühendamiseks. Aku pinge võib olla 3,2-6 V. EXT -liin katkestatakse automaatselt, kui aku kestvuse pikendamiseks ja aku kaitsmiseks pole USB -d olemas. On olemas turvafunktsioon, et aku ühendamisel on OBB keelatud, kuid väliste akude kasutamisel ei tohiks OBB siiski esineda. 

Samuti on viimane võimalus, mis annab kasutajale kogu vastutuse, ja see sisestab seadmesse 3V3 laiendusliidese kaudu. See ei ole turvaline viis seadme toiteks, kuid arenenud kasutajad, kes teavad, mida nad teevad, võivad seda lihtsaimaks soovitud funktsioonide saavutamiseks. 

Kokkuvõtlikult on CanSat'i toiteallikaks kolm turvalist viisi:

1. USB kasutamine - peamine meetod, mida kasutatakse arenguks
2. Pardal olevate akude kasutamine - soovitatav meetod lennu jaoks
3. välise aku kasutamine - arenenud kasutajatele


Kasutades regulaarseid AAA akusid, jõuti toatemperatuuril 4 tundi aku ja 50 minutit -40 kraadi Celsiuse korral. Testi ajal luges seade kõik andurid ja edastas oma andmed kümme korda sekundis. Tuleb märkida, et regulaarsed aluselised akud ei ole mõeldud nii madalatel temperatuuridel töötamiseks ja tavaliselt hakkavad nad pärast sedalaadi piinamiskatseid kaaliumi lekkima. See ei ole ohtlik, kuid leeliselised akud tuleks pärast seda alati ohutult käsutada, eriti kui neid kasutati haruldases keskkonnas, näiteks ekstreemselt külm või kui need on raketist maha visatud. Või mõlemad.

USB kasutamisel ei tohiks pikendusnõelade praegune tõke ületada 300 mA. OBB on pisut andestavamad, andes pikendusnõeladest maksimaalselt 800 Ma. Kui vaja on rohkem energiat, tuleks kaaluda välist aku. Tõenäoliselt pole see nii, kui te ei käivita mootoreid (väikesed servod on korras) või küttekehad. Väikesed kaamerad jne on endiselt korras.

## Extra - kuidas töötab adaptiivne mitme allika võimsuskeem

Soovitud funktsioonide ohutu saavutamiseks peame arvestama elektrisüsteemi kujundamisel üsna paljude asjadega. Esiteks, selleks, et ohutult ühendada USB, EXT ja OBB, peab energiasüsteem erinevaid energiaallikaid sisse ja välja lülitama. See teeb veelgi keerukamaks asjaolu, et seda ei saa tarkvaras teha, kuna kasutajal peab olema võimalik tarkvara, mida nad soovivad, ilma ohutute toimingute ohustamata. Lisaks on OBB -l USB ja välise aku suhtes üsna erinev pingevahemik. See nõuab OBB kasutamist võimenduse regulaatori kasutamiseks, samal ajal kui USB ja EXT vajavad kas Bucki regulaatori või LDO -d. Lihtsuse ja töökindluse huvides kasutatakse selles reas LDO -d. Lõpuks peaks üks toitelüliti suutma kõik energiaallikad lahti ühendada.

Allpool on Boosti muunduri skemaatiline. IC on BU33UV7NUX, Boostmuundur, mis on spetsiaalselt loodud selleks, et anda +3,3 V kahest aluselisest akust. See on lubatud, kui Boost_eni rida on kõrge või üle 0,6 V.

Kõik OBB, USB- ja EXT-jooned on kaitstud kaitsme, ülevoolu kaitse, vastupidise pinge ja voolukaitsega ning temperatuurikaitsega. Lisaks on OBB kaitstud pingeluku ja lühise kaitse all, kuna neid olukordi tuleks leeliseliste akudega vältida.

Märkus järgmises jaotises, et väline aku pinge on v_ext, USB -pinge on VBUS ja OBB pinge on Batt.

! [BU33UV7NUX Boost Circuit] (./ IMG/BU33UV7NUX.png) skeem)

Boost_eni liini juhib lüliti vooluring, mis kas sisendi võtab En_Masteri (EN_M) liinist või ignoreerib seda, kui V_EXT või VBUS on olemas. See on loodud selleks, et hoog on alati välja lülitatud, kui VBUS ja V_EXT on olemas, ja see on lubatud ainult siis, kui nii VBU -d kui ka V_EXT on 0 V ja EN_M on kõrge.

!.

Või tõelauana:

| V_ext | Vbus | En_m | Boost_en |
| ------- | ------ | ------ | ---------- |
| 1 | 1 | 1 | 0 |
| 1 | 1 | 0 | 0 |
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |

Nii et boost_en = en_m ∧! (V_ext ∨ v_bus). 
 
Järgmisena peame V_EXT lahti ühendama, kui VBU -d on olemas, et vältida soovimatut tühjenemist või juhuslikku laadimist. Seda tehakse toitelüliti IC abil transistori vooluringi abil, mis võtab toitelüliti lubamise liini alla, kui VBU-d on olemas. See ühendab aku. USB -liini kasutatakse alati kohaloleku ajal, nii et see suunatakse LDO -le lihtsa Schottky dioodiga. 

! [USB -võimsuse käitlemise skeem] (./ IMG/USB_POWER.PNG)

Üldiselt viib see vooluring funktsionaalsuseni, kus USB -võimsust kasutatakse, ja V_EXT kasutamisel, kui USB -d pole. Lõpuks kasutatakse EN_M LDO lubamiseks või keelamiseks. 

EN_M kontrollib kasutaja energialüliti kaudu. Lüliti ühendab EN_M kas USB või EXT või aku pingega, kui kasutatakse ainult OBB. Kui lüliti välja lülitatakse, ühendab see EN_M maapinnaga, lülitades välja nii LDO kui ka Boosti regulaatori.

! [Toitelüliti vooluringi skeem] (./ IMG/Power_switch.png)

Nii et praktikas lülitab toitelüliti seadme sisse/välja, USB -d kasutatakse olemasolu korral ja V_EXT eelistatakse OBB -ga. Lõpuks tuleb kaaluda veel ühte detaili. Millist pinget peaks ESP32 mõõtma aku pingena?

See lahendati lihtsal viisil. ESP32 ADC-ga ühendatud pinge on alati OBB, kuid kasutaja saab selle asemel valida v_ext, lõigates hüppaja skalpelliga ja jootdes hüppaja JP801 selle asemel lühikeseks 2-3. See valib selle asemel Batt_meas v_ext.

!!

Hüppaja võib leida CanSati järgmise põhiplaadi alumisest küljest. Hüppajat on üsna lihtne joota, nii et ärge kartke välise aku kasutamisel 1-2 rida lõigata. Seda saab alati uuesti esitada, et uuesti kasutada selle asemel 1-2.