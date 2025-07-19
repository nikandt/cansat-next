---
sidebar_position: 2
---

# Elektrienergia haldamine

See artikkel selgitab, kuidas CanSat NeXT plaati sisse lülitada, kuidas turvaliselt ühendada väliseid seadmeid plaadiga ja lõpuks, kuidas toitesüsteem töötab.

## Alustamine

Enamiku kasutajate jaoks piisab sageli sellest, kui lisada kaks AAA-patareid pardal olevasse patareihoidjasse ja kinnitada need paika. Kui USB on ühendatud, lülitub CanSat NeXT automaatselt USB toite kasutamisele patareide asemel, et pikendada patareide eluiga. Enne lendu vahetage patareid värskete vastu.

![CanSat NeXT paigaldatud patareidega](./img/cansat_with_batteries.png)

## CanSat NeXT toitesüsteem

CanSat NeXT-i saab toita kolmel viisil. Vaikimisi viis on toita seda USB kaudu, nii et kui kasutaja arendab tarkvara, toidab arvuti seadet ja välist toidet pole vaja. Teine viis on kasutada pardal olevaid patareisid (OBB). Seda tehakse, sisestades kaks standardset 1,5 V AAA patareid põhikaardi alumisel küljel olevasse patareiühendusse. USB on siiski vaikimisi viis isegi siis, kui patareid on sisestatud, st patarei mahtuvust ei kasutata, kui USB on ühendatud.

Need on tavapärased valikud ja peaksid katma enamiku kasutusjuhtudest. Lisaks on siiski kaks "edasijõudnud" valikut CanSat NeXT-i toiteks, kui seda on vaja erieesmärgil. Esiteks on plaadil tühjad läbiviigupead, millel on märgistus EXT, mida saab kasutada välise aku ühendamiseks. Aku pinge võib olla 3,2-6V. EXT liin on automaatselt lahti ühendatud, kui USB pole kohal, et pikendada aku eluiga ja kaitsta akut. On olemas turvafunktsioon, et OBB on keelatud, kui aku on ühendatud, kuid OBB ei tohiks siiski olla kohal, kui kasutatakse väliseid akusid.

Samuti on olemas viimane võimalus, mis annab kogu vastutuse kasutajale, ja see on 3V3 sisestamine seadmesse laiendusliidese kaudu. See ei ole ohutu viis seadme toitmiseks, kuid edasijõudnud kasutajad, kes teavad, mida nad teevad, võivad leida, et see on lihtsaim viis soovitud funktsionaalsuste saavutamiseks.

Kokkuvõttes on CanSat NeXT-i toiteks kolm ohutut viisi:

1. USB kasutamine - peamine meetod arenduseks
2. Pardal olevate patareide kasutamine - soovitatav meetod lennuks
3. Välise aku kasutamine - edasijõudnud kasutajatele

Tavaliste AAA patareide kasutamisel saavutati toiteaeg 4 tundi toatemperatuuril ja 50 minutit -40 kraadi Celsiuse järgi. Testi ajal luges seade kõiki andureid ja edastas nende andmeid 10 korda sekundis. Tuleb märkida, et tavalised leelispatareid ei ole mõeldud töötama nii madalatel temperatuuridel ja nad hakkavad tavaliselt pärast selliseid piinamisteste kaaliumit lekkima. See ei ole ohtlik, kuid leelispatareid tuleks alati pärast seda ohutult ära visata, eriti kui neid kasutati ebatavalises keskkonnas, näiteks äärmuslikus külmas või kui need olid raketist alla kukkunud. Või mõlemad.

USB kasutamisel ei tohiks laienduspinkide voolutarve ületada 300 mA. OBB on veidi leebem, andes laienduspinkidest maksimaalselt 800 mA. Kui on vaja rohkem energiat, tuleks kaaluda välist akut. See ei ole tõenäoline, kui te ei käita mootoreid (väikesed servod on korras) või küttekehasid, näiteks. Väikesed kaamerad jne on siiski korras.

## Lisainfo - kuidas töötab adaptiivne mitmeallikaga toiteskeem

Soovitud funktsionaalsuste ohutuks saavutamiseks peame toitesüsteemi kujundamisel arvestama üsna paljude asjadega. Esiteks, et USB, EXT ja OBB saaks ohutult korraga ühendada, peab toitesüsteem erinevaid toiteallikaid sisse ja välja lülitama. Seda teeb keerulisemaks asjaolu, et seda ei saa teha tarkvaras, kuna kasutaja peab saama kasutada mis tahes soovitud tarkvara, ilma et see ohustaks ohutust. Lisaks on OBB-l üsna erinev pingetase võrreldes USB ja välise akuga. See nõuab, et OBB kasutaks tõsteregulaatorit, samas kui USB ja EXT vajavad kas alandavat regulaatorit või LDO-d. Lihtsuse ja töökindluse huvides kasutatakse selles liinis LDO-d. Lõpuks peaks üks toitelüliti suutma kõik toiteallikad lahti ühendada.

Allpool on tõstemuunduri skeem. IC on BU33UV7NUX, tõstemuundur, mis on spetsiaalselt loodud andma +3,3V kahest leelispatareist. See on lubatud, kui BOOST_EN liin on kõrge või üle 0,6 V.

Kõik OBB, USB ja EXT liinid on kaitstud kaitsme, ülekoormuskaitse, vastupingekaitse ja voolukaitse ning ületemperatuurikaitsega. Lisaks on OBB kaitstud alalispinge lukustuse ja lühisekaitsega, kuna neid olukordi tuleks leelispatareidega vältida.

Järgmises jaotises tuleb märkida, et välise aku pinge on V_EXT, USB pinge on VBUS ja OBB pinge on BATT.

![BU33UV7NUX tõsteringi skeem](./img/BU33UV7NUX.png)

BOOST_EN liini juhib lülitusahel, mis võtab kas sisendi EN_MASTER (EN_M) liinilt või ignoreerib seda, kui V_EXT või VBUS on kohal. See on tehtud selleks, et tagada, et tõstmine on alati välja lülitatud, kui VBUS ja V_EXT on kohal, ja see on lubatud ainult siis, kui nii VBUS kui ka V_EXT on 0V ja EN_M on kõrge.

![Toiteallika valiku lülitusahela skeem](./img/switch_logic.png)

Või tõetabelina:

| V_EXT | VBUS | EN_M | BOOST_EN |
|-------|------|------|----------|
| 1     | 1    | 1    | 0        |
| 1     | 1    | 0    | 0        |
| 0     | 0    | 0    | 0        |
| 0     | 0    | 1    | 1        |

Seega BOOST_EN = EN_M ∧ !(V_EXT ∨ V_BUS).

Järgmisena peame V_EXT lahti ühendama, kui VBUS on kohal, et vältida soovimatut tühjenemist või juhuslikku laadimist. Seda tehakse toitelüliti IC abil koos transistori ahelaga, mis viib toitelüliti lubamisliini alla, kui VBUS on kohal. See ühendab aku lahti. USB liin on alati kasutusel, kui see on kohal, seega on see suunatud LDO-le lihtsa schottky dioodiga.

![USB toite käsitlemise skeem](./img/USB_power.png)

Kokkuvõttes viib see ahel funktsionaalsuseni, kus USB toide on kasutusel, kui see on kohal, ja V_EXT kasutatakse, kui USB pole kohal. Lõpuks kasutatakse EN_M LDO lubamiseks või keelamiseks.

EN_M-d juhib kasutaja toitelüliti kaudu. Lüliti ühendab EN_M USB või EXT-ga või aku pingega, kui kasutatakse ainult OBB-d. Kui lüliti on välja lülitatud, ühendab see EN_M maandusega, lülitades välja nii LDO kui ka tõsteregulaatori.

![Toitelüliti ahela skeem](./img/power_switch.png)

Seega praktikas lülitab toitelüliti seadme sisse/välja, USB-d kasutatakse, kui see on kohal, ja V_EXT eelistatakse OBB-le. Lõpuks on veel üks detail, mida kaaluda. Millist pinget peaks ESP32 mõõtma aku pingena?

See lahendati lihtsal viisil. ESP32 ADC-ga ühendatud pinge on alati OBB, kuid kasutaja saab valida V_EXT selle asemel, lõigates hüppaja skalpelliga ja jootes hüppaja JP801 lühikese 2-3 asemel. See valib V_EXT BATT_MEAS-i asemel.

![Skeem, mis näitab ADC kanali marsruutimise valikut](./img/measure.png)

Hüppaja asub CanSat NeXT põhikaardi alumisel küljel. Hüppajat on üsna lihtne joota, seega ärge kartke lõigata 1-2 liini, kui kasutate välist akut. Seda saab alati uuesti joota, et kasutada jälle 1-2.