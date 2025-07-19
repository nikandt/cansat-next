---
sidebar_position: 6
---

# Mehaaniline Disain

## PCB Mõõtmed

![CanSat NeXT plaadi mõõtmed](./img/PCB_dimensions.png)

CanSat NeXT põhilaud on ehitatud 70 x 50 x 1.6 mm PCB-le, mille elektroonika on ülemisel küljel ja aku alumisel küljel. PCB-l on kinnituspunktid igas nurgas, 4 mm kaugusel külgedest. Kinnituspunktide läbimõõt on 3.2 mm maandatud padja alaga 6.4 mm, ja need on mõeldud M3 kruvidele või vahetükkidele. Padja ala on piisavalt suur, et mahutada ka M3 mutter. Lisaks on plaadil kaks trapetsikujulist 8 x 1.5 mm väljalõiget külgedel ja komponentideta ala ülemisel küljel keskel, et lennuoperatsioonide jaoks saaks lisada tõmbluku või muu lisatoe akudele. Samamoodi on kaks 8 x 1.3 mm pilu MCU antenni pistiku kõrval, et antenni saaks kinnitada plaadi külge väikese tõmbluku või nööriga. USB-pistik on veidi plaadi sisse tõmmatud, et vältida väljaulatuvusi. Väike väljalõige on lisatud, et mahutada teatud USB-kaableid vaatamata sisse tõmbamisele. Laienduspead on standardsed 0.1 tolli (2.54 mm) emapead ja need on paigutatud nii, et kinnitusaugu keskpunkt on 2 mm kaugusel plaadi pikast servast. Pea, mis on lühikese serva lähedal, on sellest 10 mm kaugusel. PCB paksus on 1.6 mm ja akude kõrgus plaadist on umbes 13.5 mm. Pead on umbes 7.2 mm kõrged. See teeb ümbritseva mahu kõrguseks umbes 22.3 mm. Lisaks, kui kasutatakse vahetükke ühilduvate plaatide kokku panemiseks, peaksid vahetükid, vahetükid või muud mehaanilised kinnitusvahendid eraldama plaate vähemalt 7.5 mm. Kui kasutatakse standardseid tihvtipäid, on soovitatav plaatide vahe 12 mm.

Allpool saate alla laadida .step-faili perf-plaadist, mida saab kasutada PCB lisamiseks CAD-disaini viitena või isegi muudetud plaadi lähtepunktina.

[Laadi alla step-fail](/assets/3d-files/cansat.step)


## Kohandatud PCB Kujundamine

Kui soovite oma elektroonika disaini järgmisele tasemele viia, peaksite kaaluma kohandatud PCB valmistamist elektroonika jaoks. KiCAD on suurepärane, tasuta tarkvara, mida saab kasutada PCB-de kujundamiseks, ja nende tootmine on üllatavalt taskukohane.

Siin on ressursid KiCAD-iga alustamiseks: https://docs.kicad.org/#_getting_started

Siin on KiCAD mall oma CanSat-iga ühilduva vooluringi plaadi alustamiseks: [Laadi alla KiCAD mall](/assets/kicad/Breakout-template.zip)