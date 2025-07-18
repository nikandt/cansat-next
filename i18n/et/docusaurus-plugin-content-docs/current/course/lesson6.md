---
Külgriba_positsioon: 6
---

# 6. õppetund: kodu helistamine

Nüüd oleme võtnud mõõtmised ja salvestanud need ka SD-kaardile. Järgmine loogiline samm on nende juhtmevaba maapinnale edastamine, mis võimaldab mõõtmise ja katsete osas täiesti uut maailma. Näiteks oleks Zero-G-lendu IMU-ga proovimine olnud üsna huvitavam (ja hõlpsasti kalibreerida), kui oleksime võinud andmeid reaalajas näha. Vaatame, kuidas saaksime seda teha!

Selles õppetunnis saadame mõõtmised CanSatist maapealse jaama vastuvõtja kõrvale. Hiljem heidame pilgu ka maapinna jaama saadetud sõnumite saatmise käsutamisele.

## antennid

Enne selle õppetunni alustamist veenduge, et teil oleks mõni antenn, mis on ühendatud CanSat'i järgmise tahvli ja maapealse jaamaga. 

::: Märkus

Te ei tohiks kunagi proovida midagi edastada ilma antennita. See mitte ainult ei tööta, vaid on ka võimalus, et peegeldunud jõud kahjustab saatjat.

:::

Kuna me kasutame riba 2,4 GHz, mida jagavad sellised süsteemid nagu Wi-Fi, Bluetooth, ISM, droonid jne, on saadaval palju kommertsantennisid. Enamik Wi-Fi antenne töötab järgmisena CanSat'iga tõesti hästi, kuid sageli vajate adapterit, et need ühendada CanSat järgmise tahvliga. Oleme testinud ka mõnda adapterimudelit, mis on saadaval veebipoes. 

Lisateavet antennide kohta leiate riistvaradokumentatsioonist: [kommunikatsioon ja antennid] (./../ cansathardware/community.md). Selles artiklis on ka [juhised] (./../ cansathardware/kommunikatsioon.md#Building-a-kvarter-laine-monopole-atenn) oma antenni ehitamiseks CanSat järgmise komplekti materjalidest.

## Andmete saatmine

Arutelud antennide üle, mis on välja viidud, hakkame mõnda bitti saatma. Alustame uuesti seadistust, millel on seekord tegelikult võtmevahe - lisasime numbri ** argumendina ** käsu `cansatinit ()`. 

`` `CPP Title =" ülekande seadistamine "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}
`` `

Numbri väärtuse edastamine väärtusele `CanSatInit ()` ütleb CanSat järgmisena, et tahame nüüd raadiot kasutada. Number näitab MAC -aadressi viimase baidi väärtust. Võite seda mõelda kui oma konkreetse võrgu võtmeks - saate suhelda ainult samade võtmega kansaatidega. Seda numbrit tuleks jagada teie CanSati ja maapealse jaama vahel. Võite valida oma lemmiknumbri vahemikus 0 kuni 255. Valisin 28, kuna see on [täiuslik] (https://en.wikipedia.org/wiki/perfect_number).

Raadio initsialiseerimisega on andmete edastamine tõesti lihtne. See töötab tegelikult nagu näiteks AppendFile () `, mida kasutasime viimases õppetunnis - saate lisada mis tahes väärtust ja edastab selle vaikevormingus või võite kasutada vormindatud stringi ja saata selle asemel.

`` `CPP Title =" Andmete edastamine "
tühine Loop () {
  ujuk ldr_voltage = analogreadvoltage (LDR);
  sendData (ldr_voltage);
  viivitus (100);
}
`` `

Selle lihtsa koodiga edastame nüüd LDR -i mõõtmise peaaegu 10 korda sekundis. Järgmisena vaatame, kuidas seda vastu võtta.

::: Märkus

Need, kes tuttavad kuni madala taseme programmeerimisega, võivad olla mugavamad andmete binaarsel kujul saatmisel. Ärge muretsege, meil on teid kaetud. Binaarsed käsud on loetletud [teegi spetsifikatsioonis] (./../ cansat-software/lible_specification.md#senddata-binar-variant).

:::

## Andmete saamine

See kood tuleks nüüd programmeerida teisele ESP32 -le. Tavaliselt on see komplektis sisalduv teine kontrolleri tahvel, kuid ka peaaegu iga teine ESP32 töötab - sealhulgas järgmisena veel üks CanSat. 

::: Märkus

Kui kasutate maapinnajaamana ESP32 arenduslauda, pidage meeles, et vajutage IDE-st vilkumise ajal tahvli alglaadimisnupu. See seab protsessori ümberprogrammeerimiseks ESP32 paremale alglaadimisrežiimile. CanSat järgmine teeb seda automaatselt, kuid arenduslauad enamasti mitte.

:::

Seadistuskood on täpselt sama, mis varem. Ärge unustage muuta raadiovõti oma lemmiknumbrile.

`` `CPP Title =" Vastuvõtu seadistamine "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  Cansatinit (28);
}
`` `

Kuid pärast seda muutuvad asjad natuke teistsuguseks. Teeme täiesti tühja silmuse funktsiooni! Selle põhjuseks on asjaolu, et meil pole tegelikult silmus midagi teha, vaid selle asemel tehakse vastuvõtmine ** tagasihelistamise kaudu **.

`` `CPP Title =" tagasihelistamise seadistamine "
tühine Loop () {
  // Meil pole silmus midagi teha.
}

// See on tagasihelistamise funktsioon. Seda käitatakse iga kord, kui raadio saab andmeid.
tühine ondatareceitud (stringi andmed)
{
  Seeria.println (andmed);
}
`` `

Kui funktsioon `seadistamine ()` töötab vaid üks kord alguses ja `loop ()` töötab pidevalt, töötab funktsioon `ondatareceiving ()` töötab ainult siis, kui raadio on saanud uusi andmeid. Sel moel saame andmetega seotud andmed käsitleda funktsioonis. Selles näites printime selle lihtsalt, kuid oleksime võinud seda ka muuta, kui me tahtsime.

Pange tähele, et funktsiooni `Loop ()` ei pea * olema tühi, saate seda tegelikult kasutada ükskõik mida, mida soovite ühe kaaviaadiga - viivitusi tuleks vältida, kuna ka "ondatareceitud ()` funktsioon ei tööta ka enne, kui viivitus on läbi.

Kui teil on nüüd mõlemad programmid erinevatel tahvlitel korraga, tuleks teie arvutisse juhtmevabalt saata üsna palju mõõtmisi.

::: Märkus

Binaarsete orienteeritud inimeste jaoks - saate kasutada tagasihelistamisfunktsiooni onBinaryDatareceitud.

:::

## Reaalajas Zero-G

Kordame lihtsalt lõbu pärast zero-g katset, kuid raadiodega. Vastuvõtja kood võib jääda samaks, nagu tegelikult ka CanSat -koodis seadistamine. 

Meeldetuletuseks tegime IMU õppetunnis programmi, mis tuvastas vaba sütti ja muutis selle stsenaariumi korral A-le. Siin on vana kood:

`` `CPP Title =" Vaba sügise tuvastamise funktsioon "
allkirjastamata pikk ledontill = 0;

tühine Loop () {
  // Loe kiirendust
  ujuk kirves, ay, az;
  READACCERETION (AX, AY, AZ);

  // Arvutage kogukiirendus (ruut)
  ujuki koguarvustatud = ax*ax+ay*ay+az*az;
  
  // Värskendage taimerit, kui tuvastame kukkumise
  if (koguarvuga <0,1)
  {
    Ledontill = Millis () + 2000;
  }

  // Kontrollige LED taimeri põhjal
  if (ledontill> = millilis ())
  {
    DigitalWrite (LED, High);
  } else {
    DigitalWrite (LED, madal);
  }
}
`` `

On ahvatlev lisada lihtsalt vanale näitele `sendData ()`, kuid peame arvestama ajakavaga. Tavaliselt ei taha me sõnumeid saata rohkem kui ~ 20 korda sekundis, kuid teisest küljest tahame silmust pidevalt töötada, nii et LED ikka sisse lülitub.

Peame lisama veel ühe taimeri - seekord andmete saatmiseks iga 50 millisekundi järel. Taimer on tehtud, võrreldes praegust aega praeguse ajaga viimase korraga andmete saatmise ajal. Seejärel värskendatakse viimast korda iga kord, kui andmed saadetakse. Vaadake ka seda, kuidas nööri siin valmistatakse. Seda saab ka osade kaupa edastada, kuid sel viisil võetakse see vastu mitme sõnumi asemel ühe sõnumina.

`` `CPP Title =" Vaba kukkumise tuvastamine + andmeedastus "
allkirjastamata pikk ledontill = 0;

allkirjastamata pikk lastsendtime = 0;
const allkirjastamata pikk sendDatainterval = 50;


tühine Loop () {

  // Loe kiirendust
  ujuk kirves, ay, az;
  READACCERETION (AX, AY, AZ);

  // Arvutage kogukiirendus (ruut)
  ujuki koguarvustatud = ax*ax+ay*ay+az*az;
  
  // Värskendage taimerit, kui tuvastame kukkumise
  if (koguarvuga <0,1)
  {
    Ledontill = Millis () + 2000;
  }

  // Kontrollige LED taimeri põhjal
  if (ledontill> = millilis ())
  {
    DigitalWrite (LED, High);
  } else {
    DigitalWrite (LED, madal);
  }

  if (Millis () - lastSendtime> = sendDatainterval) {
    String datastring = "Accleration_squared:" + string (totalsquared);

    SendData (andmestring);

    // Värskendage viimast saatmisaega praegusele kellaajale
    lastSendtime = Millis ();
  }

}
`` `

Siinne andmevorm on tegelikult taas jadaplotteriga ühilduv - nende andmete vaatamine teeb üsna selgeks, miks me suutsime vaba languse nii puhtalt tuvastada - väärtused langevad tõesti nulli, niipea kui seade kukub või visatakse.

---

Järgmises jaotises võtame lühikese pausi, et vaadata seni õpitut ja tagada, et oleme valmis nende mõistete ehitamiseks jätkama.

[Esimese ülevaate saamiseks klõpsake siin!] (./ Review1)