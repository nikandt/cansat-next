---
külgriba_positsioon: 1
---

# Pardal olevad andurid

See artikkel tutvustab CanSat'i järgmise pealauaga integreeritud andureid. Andurite kasutamine on kaetud tarkvaradokumentatsioonis, samas kui see artikkel annab rohkem teavet andurite endi kohta.

CanSat järgmisel põhiplaadil on kolm pardaandurit. Need on IMU LSM6DS3, rõhuandur LPS22HB ja LDR. Lisaks on tahvlil välise termistori lisamiseks läbi augu. Kuna LPS22HB -l on juba nii rõhu kui ka temperatuuri mõõtmisvõimalused, piisab teoreetiliselt, et täita omaette CanSat võistluste esmased missioonikriteeriumid. Kuna see mõõdab sisemise ristmike temperatuuri või põhimõtteliselt PCB temperatuuri sellel kohal, ei ole see enamikus konfiguratsioonides hea atmosfääri temperatuuri mõõtmine. Lisaks saab rõhuanduri absoluutset mõõtmist toetada IMU kiirendusmõõturi lisaandmed. LDR on kõigepealt lisatud, et aidata õpilastel õppida analoogsensoreid käsitlevaid mõisteid, kuna reageerimine stiimulitele on peaaegu kohene, samas kui termistor võtab aega soojendamiseks ja jahtumiseks. Nagu öeldud, võib see toetada ka loomingulisi missioone, mille õpilane tuleb välja, nagu IMUS -i kiirendusmõõtur ja güroskoop. Lisaks julgustab CanSat lisaks pardaandurile lisaks täiendavate andurite kasutamist pikendusliidese kaudu.

## inertsiaalne mõõtühik

STMICROelectronics IMU, LSM6DS3 on SIP (System-in-Package) MEMS-i anduri seade, mis integreerib kiirendusmõõturi, güroskoobi ja lugemiselektroonika väikesesse paketti. Andur toetab SPI ja I2C jadaliideseid ning sisaldab ka sisetemperatuuri andurit. 

! [IMU CanSat Next Board] (./ IMG/IMU.PNG)

LSM6DS3 -l on vahetatav kiirenduse mõõtmisvahemikud ± 2/± 4/± 8/± 16 g ja nurgakiiruse mõõtmisvahemikud ± 125/± 250/± 500/± ± 1000/± 2000 kraadi/s. Kõrgema vahemiku kasutamine vähendab ka seadme eraldusvõimet.

Järgmisena kasutatakse Cansat, LSM6DS3 kasutatakse I2C režiimis. I2C aadress on 1101010B (0x6a), kuid järgmine versioon lisab tuge riistvara muutmiseks, et muuta aadress 1101011b (0x6b), kui arenenud kasutajal on vaja kasutada originaalset aadressi millegi muu jaoks.

Mõõtevahemikud seatakse vaikimisi maksimaalselt, et jäädvustada enamik vägivaldse raketi käivitamise andmeid. Andmevahemikke on kasutaja poolt muudetav.

## baromeeter

STMICROelectronics'i rõhuandur LPS22HB on veel üks SIP MEMS-seade, mis on mõeldud rõhu mõõtmiseks vahemikus 260-1260 HPA. Vahemik, mille andmed teatavad, on märkimisväärselt suurem, kuid selle vahemiku väljaspool olevate mõõtmiste täpsus on küsitav. MEMS -i rõhuandurid töötavad, mõõtes anduri diafragma piezoresistlikke muutusi. Kuna temperatuur mõjutab ka piesoelemendi takistust, tuleb see kompenseerida. Selle lubamiseks on kiibil ka suhteliselt täpne ristmike-temperatuuri andur ja otse piezoresistliku elemendi kõrval. Seda temperatuuri mõõtmist saab ka andurist lugeda, kuid seda tuleb meeles pidada, et see on kiibi sisemise temperatuuri, mitte ümbritseva õhu mõõtmine.

! [Baromeeter CanSat järgmise tahvlil] (./ IMG/baromeeter.png)

Sarnaselt IMU -ga saab LPS22HB -d suhelda ka SPI või I2C liidese kasutamisega. Järgmisena on see ühendatud sama I2C liidesega kui IMU. LPS22HB I2C aadress on 1011100B (0x5C), kuid lisame tuge selle muutmiseks soovi korral 0x5D -ni.

## Analoog digitaalse muunduriga

See viitab pinge mõõtmisele, kasutades käsku analogread ().

12-bitine analoog-digitaalmuundur (ADC) ESP32-s on kurikuulsalt mittelineaarne. Enamiku rakenduste puhul pole see oluline, näiteks selle kasutamine temperatuurimuutuste tuvastamiseks või LDR -takistuse muutuste tuvastamiseks, kuid aku pinge või NTC takistuse absoluutsete mõõtmiste tegemine võib olla pisut keeruline. Üks viis selle ümber on hoolikas kalibreerimine, mis annaks näiteks temperatuuri jaoks piisavalt täpseid andmeid. CanSat'i teek pakub aga ka kalibreeritud parandusfunktsiooni. Funktsioon rakendab ADC jaoks kolmanda astme polünoomi korrektsiooni, korreleerides ADC näidu ADC tihvti tegeliku pingega. Parandusfunktsioon on

$$ V = -1,907217E \ Times 10^{-11} \ Times A^3 + 8.368612 \ Times 10^{-8} \ Times A^2 + 7.081732E \ Times 10^{-4} \ Times A + 0,1572375 $$ul

Kus v on mõõdetud pinge ja A on 12-bitine ADC näit analoograamatust (). Funktsioon on lisatud raamatukokku ja seda nimetatakse adgTovoltaks. Selle valemi kasutamine muudab ADC lugemisvea vähem kui 1% pingevahemikus 0,1 V - 3,2 V.

## Valgusest sõltuv takisti

Järgmine CanSat põhilaud sisaldab ka anduri komplekti LDR -i. LDR on eriline takisti, kuna takistus varieerub valgustusega. Täpsed omadused võivad varieeruda, kuid LDR-i korral, mida me praegu kasutame, on takistus 5-10 kΩ 10 luksi juures ja pimedas 300 kΩ.

! [LDR CanSat Next Board] (./ IMG/LDR.PNG)

! [Skemaatiline, mis näitab LDR takistijagunikku] (./ IMG/Division.png)

See, kuidas seda CanSat järgmisena kasutatakse, on see, et MCU võrdlustakistile rakendatakse pinget 3,3 V. See põhjustab pinge LDR_OUT -is

$$ v_ {ldr} = v_ {en} \ frac {r402} {r401+r402} $$.

Ja kui R402 takistus muutub, muutub ka pinge LDR_OUT -is. Seda pinget saab lugeda koos ESP32 ADC -ga ja seejärel korreleeruda LDR -i takistusega. Kuid praktikas on LDRS -iga tavaliselt huvitatud muutusest, mitte absoluutväärtusest. Näiteks piisab tavaliselt pinge suure muutuse tuvastamisest, kui seade on pärast raketi juurutamist valguse käes. Läviväärtused seatakse tavaliselt eksperimentaalselt, mitte ei arvutata analüütiliselt. Pange tähele, et CanSatis järgmisena peate lubama analoogsed pardaandurid, kirjutades Med_en Pin kõrgele. Seda näidatakse näitekoode.

## Termistor

Välise termistori lugemiseks kasutatav vooluring on väga sarnane LDR -i näidu vooluringiga. Täpselt sama loogika kehtib, et kui võrdlustakistile rakendatakse pinget, muutub pinge temp_out vastavalt vastavalt

$$ v_ {temp} = v_ {en} \ frac {th501} {th501+r501} $$.

Kuid sel juhul huvitab meid tavaliselt termistori resistentsuse absoluutväärtus. Seetõttu on VoltageConversion kasulik, kuna see lineariseerib ADC näidud ja arvutab ka V_Temp. Nii saab kasutaja arvutada koodis oleva termistori takistuse. Väärtus tuleks ikkagi korrelatsioonis temperatuuriga, kasutades mõõtmisi, ehkki termistori andmeleht võib sisaldada ka mõnda vihjet, kuidas temperatuuri takistusest arvutada. Pange tähele, et kui teete kõike analüütiliselt, peaksite arvestama ka R501 takistuse variatsiooniga. Seda tehakse kõige hõlpsamini, mõõtes takistust multimeetriga, selle asemel, et eeldada, et see on 10 000 oomi.

PCB võrdlustakisti on temperatuurivahemikus suhteliselt stabiilne, kuid see muutub ka pisut. Kui soovitakse väga täpseid temperatuuri näitu, tuleks seda kompenseerida. Selleks saab rõhuanduri ristmike temperatuuri mõõtes. Nagu öeldud, pole CanSat võistluste jaoks kindlasti vaja. Huvilistele teatab, et tootja on R501 soojuskoefitsient 100 ppm/° C.


! [Skemaatiline, näidates termistorkihtide jaotajat] (./ img/thermistor.png)

Kuigi baromeetri temperatuur peegeldab enamasti tahvli enda temperatuuri, saab termistori paigaldada nii, et see reageerib temperatuurimuutustele väljaspool tahvlit, isegi väljaspool purki. Võite lisada ka juhtmeid, et see veelgi kaugemale saada. Kui seda kasutatakse, saab termistorit joodeda järgmisel tahvlil CanSat sobivasse asukohta. Polarisatsioonil pole tähtsust, s.t seda saab paigaldada mõlemal viisil.

! [LDR CANSAT järgmine tahvel] (./ IMG/THERMISTOR_HOLES.PNG)