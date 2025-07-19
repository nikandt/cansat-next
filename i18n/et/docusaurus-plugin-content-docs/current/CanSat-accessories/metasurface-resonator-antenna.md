---
sidebar_position: 2
---

# Metapinna resonaatorantenn

CanSat NeXT Metapinna Resonaatorantenn on väline antennimoodul, mida saab kasutada maajaama otsas, et suurendada sideulatust ja muuta side usaldusväärsemaks.

![CanSat NeXT Metapinna Resonaatorantenn](./img/resonator_antenna.png)

CanSat NeXT [komplekti antenni](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) on kasutatud edukalt CanSat missioonidel, kus CanSat lasti 1 kilomeetri kõrgusele. Kuid nendel kaugustel hakkab monopoolantenn jõudma oma tööpiirkonna piirile ja võib mõnikord signaali kaotada monopoolantenni lineaarse polarisatsiooni tõttu tekkivate polarisatsioonivigade tõttu. Metapinna resonaatorantenni komplekt on loodud võimaldama usaldusväärsemat tööd sellistes äärmuslikes tingimustes ja võimaldama ka oluliselt pikemaid vahemaid.

Metapinna resonaatorantenn koosneb kahest plaadist. Peamine antenn asub radiaatorplaadil, kuhu on trükkplaati söövitatud pilutüüpi antenn. See plaat ise annab umbes 3 dBi võimendust ja omab [ringpolarisatsiooni](https://en.wikipedia.org/wiki/Circular_polarization), mis praktikas tähendab, et signaali tugevus ei sõltu enam satelliidi antenni orientatsioonist. Seega saab seda plaati kasutada antennina, kui soovitakse laiemat *kiire laiust*.

Teine plaat, mille järgi antenn oma nime saab, on selle antennikomplekti eriline omadus. See tuleks asetada 10-15 mm kaugusele esimesest plaadist ja sellel on resonatorelementide massiiv. Elemendid saavad energiat nende all olevast piluantennist, mis omakorda muudab antenni rohkem *suunatuks*. Selle lisandiga kahekordistub võimendus 6 dBi-ni.

Allolev pilt näitab antenni *peegeldustegurit*, mõõdetuna vektori võrgustiku analüsaatoriga (VNA). Graafik näitab sagedusi, millel antenn suudab energiat edastada. Kuigi antennil on üsna hea lairiba jõudlus, näitab graafik head impedantsi sobivust töövahemikus 2400-2490 MHz. See tähendab, et nendel sagedustel edastatakse enamik võimsusest raadiolainetena, mitte ei peegeldu tagasi. Madalaimad peegeldusväärtused sagedusala keskosas on umbes -18,2 dB, mis tähendab, et ainult 1,51 % võimsusest peegeldus antennist tagasi. Kuigi seda on raskem mõõta, viitavad simulatsioonid, et täiendavalt 3 % edastusvõimsusest muundatakse soojuseks antennis endas, kuid ülejäänud 95,5 % - antenni kiirgusefektiivsus - kiirgatakse elektromagnetkiirgusena.

![CanSat NeXT Metapinna Resonaatorantenn](./img/antenna_s11.png)

Nagu varem mainitud, on antenni võimendus umbes 6 dBi. Seda saab veelgi suurendada, kasutades antenni taga *reflektorit*, mis peegeldab raadiolaineid tagasi antenni, parandades suunatust. Kuigi paraboliline ketas oleks ideaalne reflektor, võib isegi lihtsalt tasane metallplaat olla väga kasulik antenni jõudluse suurendamisel. Simulatsioonide ja välitestide kohaselt suurendab antenni taha 50-60 mm kaugusele asetatud metallplaat - näiteks terasleht - võimendust umbes 10 dBi-ni. Metallplaat peaks olema vähemalt 200 x 200 mm suurune - suuremad plaadid peaksid olema paremad, kuid ainult marginaalselt. Kuid see ei tohiks olla palju väiksem kui see. Plaat peaks ideaalis olema tahke metall, näiteks terasleht, kuid isegi traadivõrk töötab, kui augud on väiksemad kui 1/10 lainepikkust (~1,2 cm).