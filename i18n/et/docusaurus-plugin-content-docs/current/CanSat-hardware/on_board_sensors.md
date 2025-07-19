---
sidebar_position: 1
---

# Pardal olevad andurid

See artikkel tutvustab CanSat NeXT põhikaardile integreeritud andureid. Andurite kasutamist käsitletakse tarkvara dokumentatsioonis, samas kui see artikkel pakub rohkem teavet andurite endi kohta.

CanSat NeXT põhikaardil on kolm pardal olevat andurit. Need on IMU LSM6DS3, rõhuandur LPS22HB ja LDR. Lisaks on kaardil läbiviigu pesa välise termistori lisamiseks. Kuna LPS22HB-l on juba nii rõhu kui ka temperatuuri mõõtmise võimekus, siis teoreetiliselt piisab sellest, et täita CanSat võistluste esmase missiooni kriteeriumid. Kuid kuna see mõõdab sisemist ristmiku temperatuuri ehk põhimõtteliselt PCB temperatuuri selles kohas, siis enamikus konfiguratsioonides ei ole see hea atmosfääri temperatuuri mõõtmiseks. Lisaks saab rõhuanduri absoluutset mõõtmist toetada täiendavate andmetega IMU kiirendusmõõturist. LDR on lisatud eelkõige selleks, et aidata õpilastel õppida analooganduritega seotud kontseptsioone, kuna reaktsioon stiimulitele on peaaegu kohene, samas kui termistor vajab soojenemiseks ja jahtumiseks aega. Seda öeldes võib see toetada ka loomingulisi missioone, mille õpilased välja mõtlevad, nagu ka IMU kiirendusmõõtur ja güroskoop. Lisaks pardal olevale andurile julgustab CanSat NeXT kasutama täiendavaid andureid laiendusliidese kaudu.

## Inertsiaalne mõõteseade

IMU, LSM6DS3, mille on tootnud STMicroelectronics, on SiP (system-in-package) stiilis MEMS-anduriseade, mis integreerib kiirendusmõõturi, güroskoobi ja lugemiselektroonika väikesesse paketti. Andur toetab SPI ja I2C jadaliideseid ning sisaldab ka sisemist temperatuuriandurit.

![IMU CanSat NeXT kaardil](./img/imu.png)

LSM6DS3-l on vahetatavad kiirenduse mõõtevahemikud ±2/±4/±8/±16 G ja nurkkiiruse mõõtevahemikud ±125/±250/±500/±1000/±2000 kraadi/s. Suurema vahemiku kasutamine vähendab ka seadme lahutusvõimet.

CanSat NeXT-s kasutatakse LSM6DS3 I2C-režiimis. I2C-aadress on 1101010b (0x6A), kuid järgmine versioon lisab toe riistvara muutmiseks, et muuta aadress 1101011b (0x6B), kui edasijõudnud kasutajal on vajadus kasutada algset aadressi millegi muu jaoks.

Mõõtevahemikud seatakse raamatukogus vaikimisi maksimaalseks, et jäädvustada enamik andmeid vägivaldsest raketistardist. Andmevahemikud on kasutaja poolt ka muudetavad.

## Baromeeter

Rõhuandur LPS22HB, mille on tootnud STMicroelectronics, on teine SiP MEMS-seade, mis on mõeldud rõhu mõõtmiseks vahemikus 260-1260 hPa. Vahemik, milles see andmeid edastab, on oluliselt suurem, kuid mõõtmiste täpsus väljaspool seda vahemikku on küsitav. MEMS-rõhuandurid töötavad, mõõtes piezotakistuslikke muutusi anduri membraanis. Kuna temperatuur mõjutab ka piezoelemendi takistust, tuleb seda kompenseerida. Selle võimaldamiseks on kiibil ka suhteliselt täpne ristmiku temperatuuriandur otse piezotakistusliku elemendi kõrval. Seda temperatuuri mõõtmist saab andurist ka lugeda, kuid tuleb meeles pidada, et see on sisemise kiibi temperatuuri mõõtmine, mitte ümbritseva õhu oma.

![Baromeeter CanSat NeXT kaardil](./img/barometer.png)

Sarnaselt IMU-le saab LPS22HB-ga suhelda kas SPI või I2C liidese kaudu. CanSat NeXT-s on see ühendatud samale I2C liidesele kui IMU. LPS22HB I2C-aadress on 1011100b (0x5C), kuid lisame toe selle muutmiseks 0x5D-ks, kui soovitakse.

## Analoog-digitaalmuundur

See viitab pinge mõõtmisele, kasutades käsku analogRead().

ESP32 12-bitine analoog-digitaalmuundur (ADC) on kurikuulsalt mittelineaarne. See ei oma tähtsust enamiku rakenduste puhul, näiteks selle kasutamisel temperatuuri muutuste või LDR takistuse muutuste tuvastamiseks, kuid aku pinge või NTC takistuse absoluutsete mõõtmiste tegemine võib olla veidi keeruline. Üks viis sellest mööda hiilida on hoolikas kalibreerimine, mis annaks piisavalt täpseid andmeid näiteks temperatuuri jaoks. Kuid CanSat raamatukogu pakub ka kalibreeritud korrektsioonifunktsiooni. Funktsioon rakendab ADC-le kolmanda järgu polünoomilist korrektsiooni, korreleerides ADC lugemise tegeliku pingega, mis on ADC pinil. Korrektsioonifunktsioon on

$$V = -1.907217e \times 10^{-11} \times a^3 + 8.368612 \times 10^{-8} \times a^2 + 7.081732e \times 10^{-4} \times a + 0.1572375$$

Kus V on mõõdetud pinge ja a on 12-bitine ADC lugemine analogRead() abil. Funktsioon on raamatukogus olemas ja seda kutsutakse adcToVoltage. Selle valemi kasutamine muudab ADC lugemisvea vähem kui 1% pingevahemikus 0.1 V - 3.2 V.

## Valgustundlik takisti

CanSat NeXT põhikaardil on samuti LDR andurite komplekti lisatud. LDR on eriline takisti, mille takistus varieerub valgustuse järgi. Täpsed omadused võivad varieeruda, kuid praegu kasutatava LDR-i puhul on takistus 5-10 kΩ 10 luksi juures ja 300 kΩ pimedas.

![LDR CanSat NeXT kaardil](./img/LDR.png)

![Skeem, mis näitab LDR takisti jagurit](./img/division.png)

CanSat NeXT-s kasutatakse seda nii, et MCU-st rakendatakse võrdlustakistile pinge 3.3 V. See põhjustab pinge LDR_OUT-il olema

$$V_{LDR} = V_{EN} \frac{R402}{R401+R402} $$.

Ja kui R402 takistus muutub, muutub ka pinge LDR_OUT-il. Seda pinget saab lugeda ESP32 ADC-ga ja seejärel korreleerida LDR takistusega. Praktikas oleme LDR-ide puhul tavaliselt huvitatud pigem muutusest kui absoluutväärtusest. Näiteks piisab tavaliselt suure pinge muutuse tuvastamisest, kui seade on valguse käes pärast raketist väljumist. Läviväärtused määratakse tavaliselt katsetamise teel, mitte analüütiliselt arvutades. Pange tähele, et CanSat NeXT-s peate analoogandurid pardal lubama, kirjutades MEAS_EN pinile HIGH. Seda näidatakse näidiskoodides.

## Termistor

Välise termistori lugemiseks kasutatav vooluring on väga sarnane LDR lugemisvooluringiga. Täpselt sama loogika kehtib, et kui võrdlustakistile rakendatakse pinge, muutub pinge TEMP_OUT-il vastavalt

$$V_{TEMP} = V_{EN} \frac{TH501}{TH501+R501} $$.

Sel juhul oleme tavaliselt huvitatud termistori takistuse absoluutväärtusest. Seetõttu on VoltageConversion kasulik, kuna see lineariseerib ADC lugemisi ja arvutab ka V_temp otse. Nii saab kasutaja arvutada termistori takistuse koodis. Väärtus tuleks siiski korreleerida temperatuuriga mõõtmiste abil, kuigi termistori andmeleht võib sisaldada ka vihjeid, kuidas arvutada temperatuuri takistusest. Pange tähele, et kui teete kõike analüütiliselt, peaksite arvestama ka R501 takistuse variatsiooniga. Seda on kõige lihtsam teha, mõõtes takistust multimeetriga, selle asemel et eeldada, et see on 10 000 oomi.

PCB-l olev võrdlustakisti on suhteliselt stabiilne temperatuurivahemikus, kuid see muutub ka veidi. Kui soovitakse väga täpseid temperatuuri mõõtmisi, tuleks seda kompenseerida. Selleks saab kasutada rõhuanduri ristmiku temperatuuri mõõtmist. Seda öeldes ei ole see kindlasti vajalik CanSat võistlustel. Huvilistele on R501 soojuskoefitsient tootja poolt teatatud olevat 100 PPM/°C.

![Skeem, mis näitab termistori takisti jagurit](./img/thermistor.png)

Kuigi baromeetri temperatuur peegeldab peamiselt plaadi enda temperatuuri, saab termistori paigaldada nii, et see reageerib temperatuurimuutustele väljaspool plaati, isegi väljaspool purki. Samuti saate lisada juhtmeid, et see veelgi kaugemale viia. Kui seda kasutatakse, saab termistori joota sobivasse kohta CanSat NeXT kaardil. Polarisatsioon ei ole oluline, st seda saab paigaldada mõlemat pidi.

![LDR CanSat NeXT kaardil](./img/thermistor_holes.png)