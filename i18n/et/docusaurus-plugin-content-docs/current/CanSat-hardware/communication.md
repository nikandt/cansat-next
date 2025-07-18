---
külgriba_positsioon: 3
---

# Suhtlus ja antennid

Selles artiklis tutvustatakse traadita andmeedastuseks vajalikke põhimõisteid CANSAT -iga järgmisena. Esiteks arutatakse sidesüsteemi üldisel tasandil, antenni valimiseks esitletakse järgmisi erinevaid võimalusi. Lõpuks on artikli viimases osas lihtne õpetus veerandlaine monopoolse antenni ehitamiseks komplekti kuuluvatest osadest.

## Alustamine

Cansat Next on peaaegu valmis alustama traadita suhtlust otse karbist välja. Ainus asi, mida on vaja, on õige tarkvara ja antenn nii saatjale kui ka vastuvõtjale. Esimese kohta lugege sellel lehel olevaid tarkvaramaterjale. Viimase jaoks sisaldab see leht juhiseid välise antenni valimiseks ja selle kohta, kuidas konstrueerida lihtne monopooli antenn, mis on lisatud CanSatiga järgmisena.

Kuigi tahvel on tänu tarkvarakontrollidele sellistele asjadele üsna vastupidav, ei tohiks te kunagi proovida midagi raadiost ilma antennita edastada. Ehkki selle süsteemiga seotud väikese võimekuse tõttu ebatõenäoline, võib peegeldunud raadiolaine põhjustada elektroonikale tõelist kahju.

## CANSAT järgmine sidesüsteem

CanSat järgneb traadita andmeedastusele vanemate purkide komplektidega natuke erinevalt. Eraldi raadiomooduli asemel kasutab CanSat järgmisena suhtlemiseks MCU integreeritud WiFi-raadiot. WiFi-raadiot kasutatakse tavaliselt andmete edastamiseks ESP32 ja Interneti vahel, võimaldab ESP32 kasutamist lihtsa serverina või isegi ühendada ESP32 Bluetooth-seadmega, kuid teatud nutikate TCP-IP konfiguratsioonisõidukite abil saame võimaldada otsese Peer-to-Peer-suhtluse ESP32 seadmete vahel. Süsteemi nimetatakse ESP-NOW-le ning seda arendab ja hooldab Espressif, kes on ESP32 riistvara arendajad. Lisaks on olemas spetsiaalsed madala kiirusega kommunikatsiooniskeemid, mis suurendades ülekande energiat bitti, suurendavad märkimisväärselt WiFi-raadio võimalikku ulatust tavapärastes vähestes kümnetes meetrites. 

ESP-praegu andmeedastuskiirus on märkimisväärselt kiirem kui see, mis oleks vana raadio puhul võimalik. Isegi kui näitekoodi pakettide vaheline aeg vähendab, on CanSat järgmine võimeline ~ 20 täispaketti GS -i sekundiga edastama. Teoreetiliselt võib andmeedastuskiirus pikamaarežiimis olla kuni 250 kbit/s, kuid seda võib tarkvaras raske saavutada. Nagu öeldud, peaksid näiteks kaamera täispiltide edastamine lennu ajal olema õige tarkvaraga täiesti teostatav. 

Isegi lihtsate veerandlainepikkusega monopoolsete antennide (31 mm traadi) mõlemas otsas suutis CanSat järgmisena saata andmeid maapealsesse jaama 1,3 km kaugusel, sel hetkel kadus vaatepilt. Drooniga katsetamisel piirdus vahemik umbes 1 km. Võimalik, et droon häiris raadioga piisavalt, et vahemikku mõnevõrra piirata. Parema antenni korral saaks seda vahemikku veelgi suurendada. Väike Yagi antenn oleks teoreetiliselt suurendanud töövahemikku 10-kordselt.

On paar praktilist detaili, mis erinevad vanemast raadiosidesüsteemist. Esiteks juhtub satelliitide sidumine maapealsete jaama vastuvõtjaga meediumite juurdepääsu juhtimise (MAC) aadressidega, mis on seatud koodis. WiFi -süsteem on piisavalt nutikas, et käsitleda kulisside taga olevaid aja-, kokkupõrke- ja sagedusprobleeme. Kasutaja peab lihtsalt tagama, et GS kuulab MAC -aadressi, mida satelliit edastab.
Teiseks on raadio sagedus erinev. WiFi -raadio töötab riba 2,4 GHz (kesksagedus on 2,445 GHz), mis tähendab, et nii levimisomadused kui ka antenni konstruktsiooni nõuded on varasemast erinevad. Signaal on mõnevõrra tundlikum vihma ja vaateväljade probleemide suhtes ning võib-olla ei saa mõnel juhul edastada, kui vana süsteem oleks töötanud. 

Ka raadiosignaali lainepikkus on erinev. Pärast seda

$$ \ lambda = \ frac {c} {f} \ cac \ frac {3 * 10^8 \ tekst {m/s}} {2.445 * 10^9 9 \ tekst {hz}} = 0,12261 \ tekst {m,} $$

Veerandi lainepikkuse monopooli antenni pikkus peaks olema 0,03065 m või 30,65 mm. See pikkus on tähistatud ka CanSat järgmisel PCB -l, et kaabli lõikamine pisut lihtsamaks muuta. Antenn tuleks täpselt lõigata, kuid ~ 0,5 mm piires on endiselt hea.

Veerandi lainepikkuse antennil on CanSat võistluste jaoks piisav RF jõudlus. Sellegipoolest võib mõne kasutaja jaoks huvi pakkuda veelgi paremat levilat. Üks võimalik paranemiskoht on monopoolse antenni pikkuses. Praktikas ei pruugi veerandlainepikkuse resonants olla täpselt õige sagedusega, kuna muud parameetrid, näiteks keskkond, ümbritsevad metallielemendid või traadi osa, mis on endiselt kaetud maandusega metalliga, võivad resonantsi pisut mõjutada. Antenni saab häälestada vektorivõrgu analüsaatori (VNA) kasutamisega. Arvan, et peaksin seda mingil hetkel tegema ja materjale vastavalt parandama. 

Tugevam lahendus oleks kasutada teistsugust antennistiili. 2,4 GHz juures on Internetis palju lõbusaid antenniideid. Nende hulka kuuluvad spiraali antenn, Yagi antenn, Pringlesi antenn ja paljud teised. Paljud neist, kui see on hästi ehitatud, edestavad lihtsat monopooli hõlpsalt. Isegi lihtsalt dipool oleks paranemine lihtsa traadi võrreldes.

Enamikus ESP32 moodulites kasutatav pistik on Hirose U.FL -pistik. See on hea kvaliteediga miniatuurne raadiosagedusühendus, mis pakub nõrkade signaalide jaoks head jõudlust. Selle pistiku probleem on aga see, et kaabel on üsna õhuke, muutes selle mõnel juhul pisut ebapraktiliseks. See põhjustab ka suuremast RF-i kadumist, kui kaabel on pikk, nagu see võib olla välise antenni kasutamisel. Nendel juhtudel võiks kasutada U.FL -i kuni SMA adapteri kaablit. Vaatan, kas saaksime neid oma veebipoes pakkuda. See võimaldaks meeskondadel kasutada tuttavamat SMA -pistikut. Nagu öeldud, on täiesti võimalik ehitada häid antenne, kasutades lihtsalt U.FL. 

Erinevalt SMA-st tugineb U.FL pistikupesa hoidmiseks mehaaniliselt SNAP-sisse kinnitusfunktsioonidele. See on tavaliselt piisav, kuid lisaohutuse tagamiseks on hea mõte lisada lisa turvalisuse jaoks tõmblukk. Järgmisel CanSat PCB -l on antenni pistiku kõrval pilud, et mahutada väike tõmblukk. Ideaalis lisatakse kaabli jaoks enne lukuga sidumist 3D-trükitud või muul viisil konstrueeritud tugivarruka. 3D-trükitud toe fail on saadaval GitHubi lehelt.

## Antenni valikud

Antenn on sisuliselt seade, mis muudab juhitavate elektromagnetiliste lainete juhendatavateks ja vastupidi. Seadme lihtsa olemuse tõttu on palju võimalusi, kust oma seadme antenn valida. Praktilisest küljest on antennide valikul palju vabadust ja üsna palju asju, mida tuleks kaaluda. Peate vähemalt kaaluma

1. antenni töösagedus (peaks sisaldama 2,45 GHz)
2. antenni ribalaius (vähemalt 35 MHz)
3. antenni takistus (50 oomi)
4. pistik (U.FL või võite kasutada adaptereid)
5. Füüsiline suurus (kas see sobib purgiga)
6. Maksumus
7. Tootmismeetodid, kui teete ise antenni.
8. antenni polarisatsioon.

Antenni valik võib tunduda üle jõu käiv ja sageli on see, kuid sel juhul teeb selle palju lihtsamaks asjaolu, et me kasutame tegelikult Wi-Fi-raadiot-tegelikult võime süsteemiga kasutada peaaegu kõiki 2,4 GHz WiFi-antenni. Enamik neist on siiski liiga suured ja ka kipuvad kasutama pigem pigem pigem RP-SMA, mitte U.FL. Sobiva adapteriga võivad need aga olla head valikud, mida maapealsetejaamaga kasutada. Saadaval on isegi direktiiviantennid, mis tähendab, et raadioside parandamiseks saate lisandumist. 

Wi -Fi antennid on kindel valik, kuid neil on üks oluline puudus - polarisatsioon. Need on peaaegu alati lineaarselt polariseeritud, mis tähendab, et signaali tugevus varieerub märkimisväärselt sõltuvalt saatja ja vastuvõtja orientatsioonist. Halvimal juhul võivad antennid üksteisega risti näha, isegi signaal täielikult tuhmuda. Seetõttu on alternatiivne võimalus kasutada drooniantennisid, mis kipuvad olema ümmarguselt polariseeritud. Praktikas tähendab see, et meil on mõned pidevad polarisatsiooni kaotused, kuid need on vähem dramaatilised. Alternatiivne nutikas lahendus polarisatsiooniprobleemist mööda pääsemiseks on kasutada kahte vastuvõtjat, mille antennid on üksteisega risti paigaldatud. Sel moel on vähemalt ühel neist alati sobiv orientatsioon signaali vastuvõtmiseks.

Muidugi soovib tõeline tegija alati oma antenni teha. Mõned huvitavad konstruktsioonid, mis sobivad DIY-tootmiseks, hõlmavad spiraali-atenni, "Pringles" antenni, Yagi, dipooli või monopooli antenni. Enamiku nende ehitamiseks on võrgus palju juhiseid. Selle artikli viimane osa näitab, kuidas teha oma CanSat -võistlustele sobivaid monopooli antenn, mis on järgmisena CanSat'iga tarnitud materjalidest.

## veerandlaine monopooli antenni ehitamine

Selles artiklis kirjeldatakse, kuidas ehitada komplekti sisalduvatest materjalidest resonaktiivselt efektiivne veerandlaine monopooli antenn. Antenni kutsutakse, kuna sellel on ainult üks poolus (võrrelda dipooliga) ja selle pikkus on veerand lainepikkusest, mida me edastame.

Lisaks koaksiaalkaablile ja kuumuse kahanemise torudele vajate ka teatud tüüpi traadirippisid ja traadilõikureid. Peaaegu igat tüüpi töötab. Lisaks vajate soojusallikat soojusallikat, näiteks kuuma õhupüstol, jootmisraud või isegi kergem.

! [Veerandlaine antenni valmistamiseks vajalikud tööriistad] (./ IMG/qw_1.png)

Esiteks alustage kaabli lõikamisega umbes pooleks.

! [Kaabel lõigatud pooleks] (./ img/qw_2.png)

Järgmisena ehitame tegeliku antenni. Seda osa tuleks teha nii täpselt kui võimalik. Umbes 0,2 mm piires töötab hästi, kuid proovige see õigele pikkusele võimalikult lähedale saada, kuna see aitab etendusel.

Koaksiaalkaabel koosneb neljast osast - keskjuht, dielektriline, kilp ja välimine jope. Tavaliselt kasutatakse neid kaableid raadiosagedussignaalide edastamiseks seadmete vahel, nii et keskjuhi voolusid tasakaalustavad kilbis olevad voolud. Kilbijuhi eemaldamisega loovad sisejuhi voolud antenni. Selle paljastatud ala pikkus määrab antenni lainetehase või töösageduse ning nüüd soovime, et see vastaks meie töösagedusele 2,445 GHz, seega peame kilbi eemaldama 30,65 mm pikkusest.

! [Koaksiaalkaabli ehitamine] (./ IMG/qw_3.png)

Ribage välimine jope ettevaatlikult kaablist. Ideaalis proovige eemaldada soovitud pikkusest ainult jope ja kilp. Isolaatori lõikamine ei ole aga katastroof. Tavaliselt on välimist jopet lihtsam osadest eemaldada, mitte kõik korraga. Lisaks võib olla lihtsam kõigepealt liiga palju eemaldada ja seejärel sisemise juht õige pikkusega lõigata, selle asemel, et proovida seda esimesel proovimisel täpselt õigesti saada.

Alloleval pildil on eemaldatud kaablid. Proovige seda teha nagu ülemine, kuid ka alumine töötab - see võib olla lihtsalt niiskuse suhtes tundlikum. Kui seal on rippuvad kilbi tükid, lõigake need ettevaatlikult ära. Veenduge, et pole võimalust, et sisejuht ja kilp puudutavad üksteist - isegi üks ahel muudaks antenni kasutamiskõlbmatuks.

! [Riisutud kaablid] (./ img/qw_4.png)

Antenn on sel hetkel nüüd täiesti funktsionaalne, kuid see võib olla niiskuse suhtes tundlik. Seetõttu tahame sellele nüüd lisada uue jope, milleks kuumuse kahanemise torud on mõeldud. Lõika kaks tükki, mis on pisut pikemad kui teie tehtud antenn, ja asetage see üle antenni ja kasutage soojusallikat selle oma kohale kahandamiseks. Olge ettevaatlik, et mitte põletada soojuse kahanemist, eriti kui kasutate midagi muud kui kuuma õhupüstolit.

! [Valmis antennid] (./ img/qw_5.png)

Pärast seda on antennid valmis. GroundStationi poolel on antenn tõenäoliselt niimoodi hea. Teisest küljest, kuigi pistik on üsna turvaline, on hea mõte toetada pistikut kuidagi CanSat'i küljel. Väga tugev viis on kasutada 3D-trükitud tuge ja mõnda Ziptiet, kuid ka paljud muud meetodid toimivad. Ärge unustage ka mõelda, kuidas antenn purgi sisse pannakse. Ideaalis peaks see asuma kohas, kus metalliosa ei blokeeri käigukasti.

! [Antenn on kinnitatud 3D-trükitud toega] (./ IMG/qw_6.png)

### Antenni tugi

Lõpuks, siin on pildil näidatud tugi kasuisa. Saate selle importida enamiku CAD-tarkvarasse ja muuta seda või printida 3D-printeriga.


[Laadige alla sammufail] (./../../ staatiline/varad/3D-Files/UFL-SUPPORT.STEP)