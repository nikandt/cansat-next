---
Külgriba_positsioon: 6
---

# Mehaaniline disain

## PCB mõõtmed

! [CanSat järgmine tahvli mõõtmed] (./ IMG/PCB_DIMENSIONS.PNG)

CanSat Next pealaud on ehitatud 70 x 50 x 1,6 mm PCB -le, ülemisel küljel on elektroonika ja alumisel küljel asuv aku. PCB -l on igal nurgal kinnituspunktid, külgedest 4 mm. Kinnituspunktide läbimõõt on 3,2 mm, jahvatatud padjapinnaga 6,4 mm ja need on ette nähtud M3 kruvide või väljalaskeavade jaoks. Padja piirkond on ka piisavalt suur, et mahutada M3 mutrit. Lisaks on laual kaks trapetsikujulist 8 x 1,5 mm väljalõiget külgedel ja komponendivaba ala ülaosa keskel, nii et lennutegevuste jaoks võib akudele lisada tõmblukuga lipsu või muud lisatuge. Sarnaselt võib MCU antenni pistiku kõrval leida kahte 8 x 1,3 mm pesa, nii et antenni saab tahvli külge kinnitada väikese tõmblukuga lipsu või nööriga. USB -pistik on väljapressimiste vältimiseks tahvlile pisut tunginud. Teatud USB -kaablite majutamiseks vaatamata sissetungimisele lisatakse väike väljalõige. Pikenduspäised on standardsed 0,1 -tollised (2,54 mm) naissoost päised ja need asetatakse nii, et kinnitusava keskpunkt oleks 2 mm kaugusel tahvli pikast servast. Lühikese servale kõige lähemal asuv päis on sellest 10 mm kaugusel. PCB paksus on 1,6 mm ja tahvli akude kõrgus on umbes 13,5 mm. Päised on umbes 7,2 mm pikad. See muudab ümbritseva mahu kõrguse umbes 22,3 mm. Lisaks, kui ühilduvate tahvlite ühendamiseks kasutatakse väljalaskeid, peaksid väljalaskvad vahetükid või muud mehaanilised paigaldussüsteemid eraldama tahvlid vähemalt 7,5 mm. Tavaliste tihvtide päiseid kasutades on soovitatav tahvli eraldamine 12 mm.

Allpool saate alla laadida perf-laua. STEP-faili, mida saab kasutada PCB lisamiseks CAD-disainile viitamiseks või isegi modifitseeritud tahvli lähtepunktina.

[Laadige alla sammufail] (./../../ staatiline/varad/3D-failid/cansat.step)


## Kohandatud PCB kavandamine

Kui soovite viia oma elektroonikakujunduse järgmisele tasemele, peaksite kaaluma elektroonika jaoks kohandatud PCB valmistamist. Kicad on suurepärane tasuta tarkvara, mida saab kasutada PCB -de kujundamiseks ja nende valmistamine on üllatavalt taskukohane.

Siin on ressursid Kicadiga alustamiseks: https://docs.kicad.org/#_geting_Started

Siin on Kicadi mall oma CanSat-ühilduva vooluringi plaadi alustamiseks: [Laadige alla Kicadi mall] (./../../ staatiline/varad/Kicad/Breakout-template.zip)