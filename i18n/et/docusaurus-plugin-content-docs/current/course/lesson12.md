---
sidebar_position: 13
---

# Õppetund 12: Valmis stardiks?

Selles viimases õppetunnis räägime, kuidas valmistada satelliiti, maajaama ja meeskonda stardiks. Pärast seda õppetundi teeme ka *ülevaatuse*, et kontrollida lennuvalmidust, kuid see õppetund keskendub eduka missiooni võimaluste maksimeerimisele. Selles õppetunnis räägime, kuidas valmistada oma elektroonikat mehaaniliselt ja elektriliselt, kontrollida raadioside süsteemi ning lõpuks arutame mõningaid kasulikke ettevalmistusmeetmeid, mida tuleks teha juba enne tegelikku stardisündmust.

See õppetund on taas veidi teistsugune, kuna uute programmeerimiskontseptsioonide vaatamise asemel arutame, kuidas parandada seadme töökindlust missioonil. Lisaks, kuigi sa tõenäoliselt pole veel satelliidi missiooni ehitamise (või määratlemise) lõpetanud, kui sa nüüd esimest korda kursuse läbi teed, on hea lugeda läbi selle lehe materjalid, kaaluda neid aspekte oma seadme ja missiooni planeerimisel ning naasta nende juurde, kui tegelikult valmistud stardiks.

## Mehaanilised kaalutlused

Esiteks, nagu eelnevas õppetunnis arutatud, peaks elektroonika **virn** olema ehitatud nii, et see püsiks koos ka tugeva vibratsiooni ja löögi korral. Hea viis elektroonika kujundamiseks on kasutada perfplaate, mida hoiavad koos [distantsid](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) ja mis on elektriliselt ühendatud kas pistiku kaudu või hästi toetatud kaabliga. Lõpuks peaks kogu elektroonika virn olema kinnitatud satelliidi raamile nii, et see ei liiguks ringi. Jäik ühendus kruvidega on alati kindel valik (sõnamäng mõeldud), kuid see pole ainus võimalus. Üks alternatiiv võiks olla süsteemi kujundamine nii, et see puruneb löögi korral, sarnaselt [deformatsioonitsoonile](https://en.wikipedia.org/wiki/Crumple_zone). Teise võimalusena võiks pehmendatud kinnitus süsteem kummist, vahust või sarnasest materjalist vähendada elektroonikale mõjuvaid pingeid, aidates luua mitmekordse kasutusega süsteeme.

Tüüpilises CanSatis on mõned esemed, mis on eriti haavatavad probleemidele stardi või oodatust kiirema maandumise ajal. Need on patareid, SD-kaart ja antenn.

### Patareide kinnitamine

CanSat NeXT-il on plaat kujundatud nii, et selle ümber saab kinnitada tõmblukuga sideme, et tagada patareide paigalpüsimine vibratsiooni korral. Vastasel juhul kipuvad need pesadest välja hüppama. Teine mure patareide puhul on see, et mõned patareid on lühemad, kui oleks ideaalne patareipesa jaoks, ja on võimalik, et eriti tugeva löögi korral painduvad patareikontaktid patareide raskuse all nii, et kontakt kaob. Selle leevendamiseks saab kontaktide taha lisada tüki tõmblukuga sidet, vahtu või muud täitematerjali. Juhuslikes (ja tahtlikes) kukkumistestides on see parandanud töökindlust, kuigi CanSat NeXT-id, mis on integreeritud hästi ehitatud CanSatidesse, on ellu jäänud kuni 1000 meetri kõrguselt kukkumistest (ilma langevarjuta) isegi ilma nende kaitsemeetmeteta. Veelgi parem viis patareide toetamiseks on kujundada tugistruktuur otse CanSati raamile, nii et see kannab patareide raskuse löögi korral, mitte patareipesa.

![CanSat tõmblukuga sidemega](./img/cansat_with_ziptie.png)

### Antennikaabli kinnitamine

Antennipistik on U.Fl, mis on autotööstuse standardile vastav pistikutüüp. Need taluvad vibratsiooni ja lööke üsna hästi, hoolimata sellest, et neil pole väliseid mehaanilisi tugesid. Kuid töökindlust saab parandada, kinnitades antenni väikeste tõmblukuga sidemetega. CanSat NeXT plaadil on selleks otstarbeks väikesed pilud antenni kõrval. Antenni neutraalses asendis hoidmiseks saab selle jaoks [tugistruktuuri printida](../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

![Antenn kinnitatud 3D-prinditud toega](../CanSat-hardware/img/qw_6.png)

### SD-kaardi kinnitamine

SD-kaart võib tugeva löögi korral pesast välja hüpata. Jällegi, plaadid on ellu jäänud kukkumistest ja lendudest, kuid töökindlust saab parandada, kleepides või liimides SD-kaardi pesasse. Uuemad CanSat NeXT plaadid (≥1.02) on varustatud kõrge turvalisusega SD-kaardi pesadega, et seda probleemi veelgi leevendada.

## Side test

Üks olulisemaid detaile eduka missiooni tagamiseks on usaldusväärse raadioside olemasolu. Antennide valimise ja/või ehitamise kohta on rohkem teavet dokumentatsiooni [riistvara osas](../CanSat-hardware/communication#antenna-options). Kuid olenemata valitud antennist on testimine iga raadiosüsteemi oluline osa.

Õige antenni testimine võib olla keeruline ja nõuab spetsiaalset varustust, nagu [VNA-d](https://en.wikipedia.org/wiki/Network_analyzer_(electrical)), kuid funktsionaalset testi saame teha otse CanSat NeXT komplektiga.

Esmalt programmeeri satelliit saatma andmeid, näiteks andmelugemist kord sekundis. Seejärel programmeeri maajaam andmeid vastu võtma ja printima **RSSI** (vastuvõetud signaali tugevuse indikaator) väärtusi, nagu annab `getRSSI()` funktsioon, mis on osa CanSat NeXT teegist.

```Cpp title="Loe RSSI"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI: ");
  Serial.println(rssi);
}
```

See väärtus esindab tegelikku elektrilist **võimsust**, mida maajaam oma antenni kaudu sõnumi vastuvõtmisel saab. Väärtus on väljendatud [detsibellmillivattides](https://en.wikipedia.org/wiki/DBm). Tüüpiline lugemine töötava antenniga mõlemal poolel, kui seadmed on samal laual, on -30 dBm (1000 nanovatti) ja see peaks kiiresti langema, kui kaugus suureneb. Vabas ruumis järgib see ligikaudu pöördvõrdelist ruutvõrrandit, kuid mitte täpselt kaja, fresneli tsoonide ja muude ebatäpsuste tõttu. Raadiosätetega, mida CanSat NeXT vaikimisi kasutab, saab RSSI väärtust vähendada umbes -100 dBm-ni (0.1 pikovatti) ja siiski saab osa andmeid läbi.

See vastab tavaliselt umbes kilomeetri kaugusele, kui kasutatakse monopoolantenne, kuid võib olla palju rohkem, kui maajaama antennil on märkimisväärne [võimendus](https://en.wikipedia.org/wiki/Gain_(antenna)), mis lisab otse dBm lugemisele.

## Toidetestid

Hea mõte on mõõta oma satelliidi voolutarvet multimeetriga. See on ka lihtne, lihtsalt eemalda üks patarei ja hoia seda käsitsi nii, et saaksid kasutada multimeetri voolumõõtmist, et ühendada ühe patarei otsa ja patareikontakti vahel. See lugemine peaks olema suurusjärgus 130-200 mA, kui CanSat NeXT raadio on aktiivne ja väliseid seadmeid pole. Voolutarve tõuseb, kui patareid tühjenevad, kuna rohkem voolu on vaja, et hoida pinget 3.3 voldil alaneva patareipinge korral.

Tüüpilistel AAA patareidel on umbes 1200 mAh mahtuvus, mis tähendab, et seadme voolutarve peaks olema alla 300 mA, et tagada patareide kestvus kogu missiooni vältel. See on ka põhjus, miks on hea mõte omada mitut töörežiimi, kui pardal on voolunäljas seadmeid, kuna neid saab sisse lülitada vahetult enne lendu, et tagada hea patareide eluiga.

Kuigi matemaatiline lähenemine patareide eluea hindamiseks on hea algus, on siiski parim teha tegelik mõõtmine patareide eluea kohta, hankides värsked patareid ja tehes simuleeritud missiooni.

## Kosmosetööstuse testimine

Kosmosetööstuses läbib iga satelliit põhjaliku testimise, et tagada selle ellujäämine stardi, kosmose ja mõnikord ka taassisenemise karmides tingimustes. Kuigi CanSatid töötavad veidi teistsuguses keskkonnas, võiksid sa siiski kohandada mõningaid neist testidest, et parandada töökindlust. Allpool on mõned levinud kosmosetööstuse testid, mida kasutatakse CubeSatide ja väikeste satelliitide jaoks, koos ideedega, kuidas saaksid sarnast testimist oma CanSati jaoks rakendada.

### Vibratsioonitestimine

Vibratsioonitesti kasutatakse väikeste satelliitsüsteemide puhul kahel põhjusel. Esmane põhjus on see, et test püüab tuvastada struktuuri resonantssagedusi, et tagada, et raketi vibratsioon ei hakkaks satelliidi struktuuris resoneerima, mis võib viia satelliidisüsteemide rikkeni. Teine põhjus on samuti asjakohane CanSati süsteemide puhul, mis on käsitöö kvaliteedi kinnitamine ja süsteemi ellujäämise tagamine raketi stardil. Satelliidi vibratsioonitestimine toimub spetsiaalsete vibratsioonitestpingitega, kuid mõju saab simuleerida ka loomingulisemate lahendustega. Proovi välja mõelda viis, kuidas satelliiti (või eelistatavalt selle varuosa) tõeliselt raputada ja vaata, kas midagi puruneb. Kuidas saaks seda parandada?

### Löögitest

Vibratsioonitestide sugulane, löögitestid simuleerivad plahvatuslikku etapi eraldumist raketi stardil. Löögi kiirendus võib ulatuda kuni 100 G-ni, mis võib süsteeme kergesti purustada. Seda võiks simuleerida kukkumistestiga, kuid mõtle, kuidas seda ohutult teha, et satelliit, sina või põrand ei puruneks.

### Termiline testimine

Termiline testimine hõlmab kogu satelliidi kokkupuudet planeeritud töövahemiku äärmustega ja ka nende temperatuuride vahel kiiret liikumist. CanSati kontekstis võiks see tähendada satelliidi testimist sügavkülmas, simuleerides külma päeva starti, või kergelt kuumutatud ahjus, et simuleerida kuuma stardipäeva. Ole ettevaatlik, et elektroonika, plastid või sinu nahk ei puutuks otseselt kokku äärmuslike temperatuuridega.

## Üldised head ideed

Siin on mõned täiendavad näpunäited, mis aitavad tagada eduka missiooni. Need ulatuvad tehnilistest ettevalmistustest kuni organisatsiooniliste praktikate parandamiseni, mis parandavad CanSati üldist töökindlust. Võid vabalt siia uusi ideid lisada tavapärase kanali kaudu (samuli@kitsat.fi).

- Kaalu kontrollnimekirja koostamist, et vältida millegi unustamist vahetult enne starti
- Testi kogu lennujada eelnevalt simuleeritud lennul
- Testi satelliiti ka sarnastes keskkonnatingimustes, nagu on oodata lennul. Veendu, et langevari oleks samuti oodatud temperatuuridega sobiv.
- Omada varupatareisid ja mõelda, kuidas need vajadusel paigaldada
- Omada varu SD-kaarti, need võivad mõnikord ebaõnnestuda
- Omada varuarvutit ja keelata arvuti uuendused enne starti
- Omada varu tõmblukuga sidemeid, kruvisid ja kõike muud, mida vajad satelliidi kokkupanekuks
- Omada käepärast mõningaid põhivahendeid, et aidata lahtivõtmisel ja kokkupanekul
- Omada lisantenne
- Võid ka kasutada mitut maajaama korraga, mida saab kasutada ka satelliidi trianguleerimiseks, eriti kui RSSI on saadaval.
- Määrake igale meeskonnaliikmele selged rollid stardi, operatsioonide ja taastumise ajal.

---

See on praeguseks õppetundide lõpp. Järgmisel lehel on lennuvalmiduse ülevaatus, mis on praktika, mis aitab tagada edukaid missioone.

[Klõpsa siia, et minna lennuvalmiduse ülevaatusele!](./review2)