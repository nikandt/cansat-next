---
Külgriba_positsioon: 2
---

# Metasurface resonaatori antenn

CanSat Next MetasurFace Resonator Antenn on väline antennimoodul, mida saab kasutada GroundStion'i otsas, et suurendada sidevahemikku, ja muuta kommunikatsioon ka usaldusväärsemaks.

! [CANSAT järgmine metasurface Resonator Antenn] (./ IMG/Resonator_ANTENNA.PNG)

CanSat CanSati järgmisena on kasutatud CanSat'i missioonide edukaks käitamiseks, kus CanSat käivitati 1 kilomeetri kõrgusele, kasutati CanSat järgmise järgmise CanSat'i [Kit A-CanSat-Hardware/Communid.md. Kuid nendel vahemaadel hakkab monopooli antenn olema töövahemiku servas ja võib ka kaotada signaali, mis on tingitud mõnikord polarisatsiooni vigadest, mis tulenevad monopooli antenni lineaarsest polarisatsioonist. Metasurface Resonator Antennikomplekt on loodud selleks, et võimaldada usaldusväärsemat toimimist sellistes ekstreemsetes tingimustes, ja ka märkimisväärselt pikemate vahemikega toimimist.

Metasurface'i resonaatori antenn koosneb kahest juhatusest. Peamine antenn on radiaatoriplaadil, kus PCB -sse on söövitatud pesa tüüpi antenn. See tahvel iseenesest annab umbes 3 dBi võimendust ja omadusi [ümmargune polarisatsioon] (https://en.wikipedia.org/wiki/circular_polarization), mis praktikas tähendab, et signaali tugevus ei sõltu enam satelliidi antenni orientatsioonist. Seetõttu saab seda tahvlit kasutada antennina ise, kui soovitav on laiem * tala laius *.

Teine tahvel, kus antenn saab nime, on selle antennikomplekti eripära. See tuleks paigutada esimesest tahvlist 10–15 mm ja sellel on hulgaliselt resonaatorielemente. Elemente pingestab nende all olev pesa antenn ja see muudab antenni omakorda rohkem *direktiivi *. Selle lisamisega kahekordistub võimendus 6 dBi -ni.


Alloleval pildil on näidatud vektorvõrgu analüsaatori (VNA) abil mõõdetud antenni peegeldustegur *. Joonisel on näidatud sagedused, millega antenn on võimeline energiat edastama. Kuigi antennil on üsna hea lairiba jõudlus, näitab graafik hea takistuse vaste operatsioonisagedusvahemikul 2400–2490 MHz. See tähendab, et nendel sagedustel edastatakse suurem osa võimsusest raadiolainetena, mitte kajastub tagasi. Madalaimad peegelduse väärtused riba keskel on umbes -18,2 dB, mis tähendab, et ainult 1,51 % võimsusest kajastus antennist tagasi. Kuigi rohkem raskusi mõõta, viitavad simulatsioonid sellele, et täiendav 3 % ülekandevõimsusest teisendatakse antennis endas soojuseks, kuid ülejäänud 95,5 % - antenni kiirguse efektiivsus - kiirgatakse elektromagnetilise kiirgusena.

!.

Nagu varem mainitud, on antenni võimendus umbes 6 dBi. Seda saab veelgi suurendada antenni taga asuva * reflektori * kasutamisega, mis peegeldab raadiolaineid tagasi antenni, parandades suunavust. Kui paraboolne ketas teeks ideaalse reflektori, võib antenni jõudluse suurendamisel olla isegi lamedast metalltasandist. Simulatsioonide ja välitestide kohaselt suurendab antenni taha 50–60 mm asetatud metalltasapind - näiteks terasplekk - võimenduseks umbes 10 dBi -ni. Metallitasapinna suurus peaks olema vähemalt 200 x 200 mm - suuremad lennukid peaksid olema paremad, kuid ainult pisut. Kuid see ei tohiks olla sellest palju väiksem. Lennukiks oleks ideaalis tahke metall, näiteks terasleht, kuid isegi traadi võrgusilm töötab, kui augud on väiksemad kui 1/10 lainepikkust (~ 1,2 cm).