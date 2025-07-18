---
Külgriba_positsioon: 13
---

# 12. õppetund: kas valmis tõstmiseks?

Selles viimases õppetunnis räägime sellest, kuidas satelliidi, GroundStion ja meeskonna ettevalmistamine käivitamiseks. Pärast seda õppetundi on meil lennuvalmiduse kontrollimiseks ka * ülevaade *, kuid see õppetund keskendub eduka missiooni võimaluste maksimeerimisele. Selles õppetunnis räägime teie elektroonika mehaaniliselt ja elektriliselt ettevalmistamisest, raadiosidesüsteemi kontrollimisest ja lõpuks enne tegelikku käivitussündmust arutamas kasulikke ettevalmistamise samme. 


See õppetund on jälle pisut erinev, kuna uute programmeerimiskontseptsioonide uurimise asemel arutame, kuidas parandada seadme usaldusväärsust Missinos. Lisaks, kuigi te tõenäoliselt ei ole satelliidimissiooni ehitamisel (ega määratlenud), kui nüüd kursust esmakordselt läbi elate, on hea lugeda sellel lehel olevaid materjale, kaaluge neid aspekte oma seadme ja missiooni kavandamisel ning pöörduge nende juurde tagasi, kui tegelikult turuletoomiseks valmistute.

## Mehaanilised kaalutlused

Esiteks, nagu eelmises õppetükis arutatud, tuleks elektroonika ** virn ** ehitada nii, et see püsiks koos isegi raske vibratsiooni ja šokiga. Hea viis elektroonika kujundamiseks on kasutada perf-plaate, mida hoiavad koos [StandOffs] (https://spacelabnextdoor.com/electronics/27-Cansat-Next-NEXT-NMA-UFL) ja ühendatakse elektriliselt ühe pistiku või hästi toetatud kaabli abil. Lõpuks tuleks kogu elektroonika virn kinnitada satelliidiraami külge nii, et see ei liiguks ringi. Jäik ühendus kruvidega on alati kindel valik (pun mõeldud), kuid see pole ainus võimalus. Üks alternatiiv võib olla süsteemi kujundamine löögi purunemiseks, sarnaselt [Crumple Zone] (https://en.wikipedia.org/wiki/crumple_zone). Teise võimalusena võib kummi, vahu või sarnase süsteemiga polsterdatud paigaldussüsteem vähendada elektroonika kogetud pingeid, aidates luua mitmeotstarbelisi süsteeme.

Tüüpilisel purkidel on mõned esemed, mis on eriti haavatavad probleemide suhtes turuletoomise ajal või oodatust kiiremini. Need on akud, SD -kaart ja antenn. 

### akude kinnitamine

Järgmisena CanSat on laud konstrueeritud nii, et tahvli ümber saab kinnitada tõmbluku, et tagada akude paisutamine vibratsioonis. Vastasel juhul on neil kalduvus pistikutest välja hüpata. Veel üks mure akude pärast on see, et mõned akud on lühemad, kui akuhoidja jaoks ideaalne ja see on võimalik kui eriti kõrge šoki korral, aku kontaktid painutavad akude raskuse all nii, et kontakt kaob. Selle leevendamiseks saab kontakte toetada, lisades kevadiste kontaktide taha tüki tõmblukk, vaht või muu täiteaine. Juhuslike (ja tahtlike) langustestide korral on see parandanud töökindlust, ehkki hästi ehitatud CANSAT -idesse integreeritud CanSat -seosed on üle elanud tilgad kuni 1000 meetrit (ilma langevarjuta) isegi ilma nende kaitsemeetmeteta. Veelgi parem viis akude toetamiseks on tugikonstruktsiooni kujundamine otse CanSat -raami külge, nii et see kannab akuhoidja asemel akude raskust.

! [CanSat koos zip -lipsuga] (./ img/cansat_with_ziptie.png)


### antennikaabli kinnitamine

Antenni pistik on U.FL, mis on autotööstuse nimitega pistik tüüp. Vaatamata sellele, et neil pole väliseid mehaanilisi tuge, käsitlevad nad vibratsiooni ja šokeerimist üsna hästi. Usaldusväärsust saab siiski parandada, kinnitades antenni väikeste tõmblukkudega. CanSat Next Boardil on selleks antenni kõrval väikesed teenindusajad. Antenni hoidmiseks neutraalses positsioonis saab [tugi printida] (..

! [Antenn on tagatud 3D-trükitud toega] (../ cansathardware/img/qw_6.png)

### SD -kaardi kinnitamine

SD -kaart võib kõrgel šokitel oma hoidikust välja hüpata. Tahvlid on jällegi tilgad ja lennud üle elanud, kuid töökindlust saab parandada, kui SD -kaart hoidja külge lindistades või liimides. Uuemad CanSat järgmised tahvlid (≥1,02) on selle probleemi edasiseks leevendamiseks varustatud kõrge turvalisusega SD-kaardihoidjatega.

## Kommunikatsiooni test

Üks olulisemaid detaile edukaks missioonile õigeks saamiseks on usaldusväärne raadioside. Antennide valimise ja/või ehitamise kohta on lisateavet dokumentatsiooni [riistvara jaotises] ( Sõltumata valitud antennist on testimine iga raadiosüsteemi oluline osa. 

Nõuetekohane testimine võib olla keeruline ja nõuab spetsiaalseid seadmeid, näiteks [vNAS] (https://en.wikipedia.org/wiki/network_analyzer_ (elektrilised)), kuid me saame funktsionaalse testi teha otse CanSat'i järgmise komplektiga. 

Esiteks programmeerige satelliit andmete saatmiseks, näiteks andmete lugemine üks kord sekund. Seejärel programmeerige maapealse jaama andmete vastuvõtmiseks ja printimiseks ** RSSI ** (vastuvõetud signaali tugevuse indikaator) väärtused, mis on antud funktsiooni `getRSSI ()`, mis on osa CanSat järgmise raamatukogu osast.

`` `CPP Title =" Loe RSSI "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  GroundStationInit (28);
}

void Loop () {}

tühine ondatareceitud (stringi andmed)
{
  int rssi = getrSsi ();
  Serial.print ("RSSI:");
  Seeria.println (RSSI);
}
`` `

See väärtus tähistab tegelikku elektrilist ** võimsust **, mille maapealne jaama saatis oma antenni kaudu, kui ta sõnumi saab. Väärtust väljendatakse [decibelmilliwatts] (https://en.wikipedia.org/wiki/dbm). Tüüpiline lugemine, milles töötav antenn on mõlemas otsas, kui seadmed asuvad samal tabelis, on -30 dBm (1000 nanoWatti) ja see peaks vahemaa suurenemisel kiiresti langema. Vabas ruumis järgib see umbes pöördvõrdelist seadust, kuid mitte täpselt kaja, Fresneli tsoonide tõttu muudes puudustes. Raadioseadete abil, mida CanSat järgmisena kasutab, saab RSSI võtta umbes -100 dBm (0,1 Picowatt) ja mõned andmed saavad siiski läbi. 

See vastab monopoolsete antennide kasutamisel tavaliselt umbes kilomeetri kaugusele, kuid võib olla palju rohkem, kui maapealse jaama antennil on oluline [võimendus] (https://en.wikipedia.org/wiki/gain_ (antenn)), mis lisab otseselt DBM -i lugemist.

## Power Testid

See on hea mõte mõõta oma satelliidi praegust joonist multimeetri abil. Ka see on lihtne, eemaldage lihtsalt üks akud ja hoidke seda käsitsi nii, et saaksite multimeetri voolu mõõtmist kasutada aku ühe otsa ja aku kontakti vahel ühendamiseks. See näit peaks olema järjekorras 130-200 Ma, kui CanSat järgmine raadio on aktiivne ja väliseid seadmeid pole. Akude tühjenemisel tõuseb praegune tõmbe, kuna pinge hoidmiseks aku alandavast pingest 3,3 volti hoidmiseks on vaja voolu.

Tüüpiliste AAA patareide mahutavus on umbes 1200 mAh, mis tähendab, et seadme praegune tõmbeks peaks olema alla 300 Ma, et tagada akude kogu missioon. See on ka põhjus, miks on hea mõte omada mitu töörežiimi, kui pardal on praegused näljased seadmed, kuna aku hea tööaja tagamiseks saab need vahetult enne lendu sisse lülitada.

Kuigi matemaatiline lähenemisviis aku tööajale on hea algus, on siiski kõige parem teha aku kestvust, saades värsked akud ja tehes simuleeritud missiooni.

## Aerospace'i testimine

Lennunduse tööstuses läbib iga satelliit range testi, et tagada, et see suudab kahanemise, ruumi ja mõnikord uuesti sisenemise karmid tingimused üle elada. Kuigi CanSats töötab pisut teises keskkonnas, võiksite siiski mõnda neist testidest usaldusväärsuse parandamiseks kohandada. Allpool on toodud mõned levinud kosmosetestid, mida kasutatakse kuubikute ja väikeste satelliitide jaoks, koos ideedega, kuidas saaksite oma purjekatte jaoks sarnast testimist rakendada.

### vibratsiooni testimine

Vibratsioonitesti kasutatakse väikestes satelliidisüsteemides kahel põhjusel. Esmane põhjus on see, et testi eesmärk on tuvastada struktuuri resonantssagedused, et tagada raketi vibratsioon, ei hakka satelliidi üheski struktuuris resonantsi, mis võib viia satelliidisüsteemides tõrkeni. Teisene põhjus on asjakohane ka CanSat Systems'i jaoks, milleks on kinnitada käsitöö kvaliteeti ja tagada, et süsteem jääb raketi käivitamisest ellu. Satelliidi vibratsiooni testimist tehakse spetsiaalse vibratsioonikatsega, kuid efekti saab simuleerida ka loomingulisemate lahendustega. Proovige välja mõelda viisi, kuidas satelliiti tõeliselt raputada (või eelistatavalt selle varu) ja vaadata, kas midagi puruneb. Kuidas saaks seda parandada?

### LOCKTST

Vibratsioonikatsete nõbu, šokitestid simuleerivad plahvatusohtlikku etapi eraldamist raketi käivitamise ajal. Šoki kiirendus võib olla kuni 100 g, mis võib süsteeme hõlpsalt murda. Seda võib simuleerida tilkade testiga, kuid kaaluge, kuidas seda ohutult teha, et satelliit, teie ega põrand ei puruneks.

### Termiline testimine

Termiline testimine hõlmab kogu satelliidi paljastamist kavandatud töövahemiku äärmustele ja nende temperatuuride vahel kiiresti liikumist. CanSat'i kontekstis võib see tähendada satelliidi testimist sügavkülmas, simuleerimist külmal päeval või kergelt soojenduses ahjus, et simuleerida kuuma stardipäeva. Olge ettevaatlik, et elektroonika, plast või teie nahk ei puutu otse äärmuslike temperatuuridega.

## Üldised head ideed

Siin on mõned täiendavad näpunäited, mis aitavad tagada eduka missiooni. Need ulatuvad tehnilistest ettevalmistustest kuni organisatsiooniliste tavadeni, mis parandavad teie punesi üldist usaldusväärsust. Soovitage julgelt uusi ideid, mida siia tavalise kanali kaudu lisada (samuli@kitsat.fi).

- kaaluge kontrollnimekirja, et vältida millegi unustamist vahetult enne käivitamist
- Testige kogu lennujada eelnevalt simuleeritud lennu ajal
- Katsetage satelliiti ka sarnastes keskkonnatingimustes, nagu lennult eeldatakse. Veenduge, et langevarju oleks eeldatava temperatuuriga ka ok.
- on varuakud ja mõelge, kuidas need vajadusel paigaldatakse
- on varu SD -kaart, nad ebaõnnestuvad vahel
- teil on varuarvuti ja keelake enne käivitamist arvutis värskendused.
- Kas teil on varundussidemed, kruvid ja see, mida sa satelliidi kokkupanemiseks vaja on
- omada mõned põhiriistad, mis abistavad lahtivõtmisel ja kokkupanemisel
- Kas teil on täiendavaid antenne
- Teil võib korraga töötada ka mitu maapealset jaama, mida saab kasutada ka satelliidi trianguleerimiseks, eriti kui RSSI on saadaval.
- on iga meeskonnaliikme jaoks selged rollid käivitamise, toimingute ja taastumise ajal.

---

See on praegu õppetundide lõpp. Järgmisel lehel on lennuarengu ülevaade, mis on tavade edukate missioonide tagamine.

[Lennuvalmiduse ülevaate saamiseks klõpsake siin!] (./ Review2)