---
sidebar_position: 6
---

# Õppetund 6: Kodu poole helistamine

Nüüd oleme teinud mõõtmisi ja salvestanud need ka SD-kaardile. Järgmine loogiline samm on edastada need juhtmevabalt maapinnale, mis avab täiesti uue maailma mõõtmiste ja katsete osas, mida saame teha. Näiteks oleks nullgravitatsiooni lennu katsetamine IMU-ga olnud palju huvitavam (ja lihtsam kalibreerida), kui oleksime saanud andmeid reaalajas näha. Vaatame, kuidas seda teha!

Selles õppetunnis saadame mõõtmised CanSat NeXT-st maajaama vastuvõtjale. Hiljem vaatame ka, kuidas CanSat-i juhtida maajaamast saadetud sõnumitega.

## Antennid

Enne selle õppetunni alustamist veenduge, et teil on CanSat NeXT plaadile ja maajaamale ühendatud mingi antenn.

:::note

Te ei tohiks kunagi proovida midagi edastada ilma antennita. See ei pruugi mitte ainult mitte töötada, vaid on ka võimalus, et peegeldunud võimsus kahjustab saatjat.

:::

Kuna kasutame 2,4 GHz sagedusala, mida jagavad sellised süsteemid nagu Wi-Fi, Bluetooth, ISM, droonid jne, on saadaval palju kaubanduslikke antenne. Enamik Wi-Fi antenne töötab CanSat NeXT-ga väga hästi, kuid sageli on vaja adapterit, et neid CanSat NeXT plaadiga ühendada. Oleme testinud ka mõnda adapterimudelit, mis on saadaval veebipoes.

Lisateavet antennide kohta leiate riistvara dokumentatsioonist: [Side ja antennid](./../CanSat-hardware/communication). Selles artiklis on ka [juhised](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) oma antenni ehitamiseks CanSat NeXT komplekti materjalidest.

## Andmete saatmine

Kui arutelu antennide üle on läbi, alustame bittide saatmist. Alustame taas seadistuse vaatamisega, millel on seekord tegelikult oluline erinevus - oleme lisanud numbri **argumendina** `CanSatInit()` käsule.

```Cpp title="Seadistus edastamiseks"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Numbri väärtuse edastamine `CanSatInit()`-le ütleb CanSat NeXT-le, et soovime nüüd kasutada raadiot. Number näitab MAC-aadressi viimase baidi väärtust. Võite seda mõelda kui võtit oma konkreetsele võrgule - saate suhelda ainult CanSat-idega, mis jagavad sama võtit. See number peaks olema jagatud teie CanSat NeXT ja teie maajaama vahel. Võite valida oma lemmiknumbri vahemikus 0 kuni 255. Mina valisin 28, kuna see on [täiuslik](https://en.wikipedia.org/wiki/Perfect_number).

Kui raadio on initsialiseeritud, on andmete edastamine tõesti lihtne. See toimib tegelikult täpselt nagu `appendFile()`, mida kasutasime eelmises õppetunnis - saate lisada mis tahes väärtuse ja see edastatakse vaikimisi formaadis, või saate kasutada vormindatud stringi ja saata selle asemel.

```Cpp title="Andmete edastamine"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Selle lihtsa koodiga edastame nüüd LDR mõõtmist peaaegu 10 korda sekundis. Järgmisena vaatame, kuidas seda vastu võtta.

:::note

Need, kes tunnevad end madala taseme programmeerimises mugavamalt, võivad eelistada andmete saatmist binaarsel kujul. Ärge muretsege, meil on teid kaetud. Binaarsed käsud on loetletud [Raamatukogu spetsifikatsioonis](./../CanSat-software/library_specification.md#senddata-binary-variant).

:::

## Andmete vastuvõtmine

See kood tuleks nüüd programmeerida teisele ESP32-le. Tavaliselt on see komplektis olev teine kontrollerplaat, kuid tegelikult töötab ka peaaegu iga teine ESP32 - sealhulgas teine CanSat NeXT.

:::note

Kui kasutate ESP32 arendusplaati maajaamana, pidage meeles, et vajutage IDE-st välgutamise ajal plaadil olevat Boot-nuppu. See seab ESP32 õigesse alglaadimisrežiimi protsessori ümberprogrammeerimiseks. CanSat NeXT teeb seda automaatselt, kuid arendusplaadid enamasti mitte.

:::

Seadistuskood on täpselt sama mis enne. Lihtsalt pidage meeles, et muutke raadiovõtit oma lemmiknumbriks.

```Cpp title="Seadistus vastuvõtmiseks"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Pärast seda lähevad asjad aga veidi teistsuguseks. Teeme täiesti tühja loop-funktsiooni! See on sellepärast, et meil pole tegelikult midagi teha loopis, vaid vastuvõtmine toimub **tagasikutsete** kaudu.

```Cpp title="Tagasikutsumise seadistamine"
void loop() {
  // Meil pole loopis midagi teha.
}

// See on tagasikutsumise funktsioon. Seda käivitatakse iga kord, kui raadio andmeid vastu võtab.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Kui funktsioon `setup()` käivitub ainult üks kord alguses ja `loop()` käivitub pidevalt, siis funktsioon `onDataReceived()` käivitub ainult siis, kui raadio on saanud uusi andmeid. Nii saame andmeid töödelda tagasikutsumise funktsioonis. Selles näites me lihtsalt prindime need, kuid me oleksime võinud neid ka muuta, kuidas iganes tahtsime.

Pange tähele, et `loop()` funktsioon ei pea olema tühi, tegelikult saate seda kasutada milleks iganes soovite, ühe hoiatusega - viivitusi tuleks vältida, kuna `onDataReceived()` funktsioon ei käivitu enne, kui viivitus on läbi.

Kui nüüd mõlemad programmid töötavad erinevatel plaatidel samal ajal, peaks teie arvutisse juhtmevabalt saadetama üsna palju mõõtmisi.

:::note

Binaarsetele inimestele - saate kasutada tagasikutsumise funktsiooni onBinaryDataReceived.

:::

## Reaalajas nullgravitatsioon

Lõbu pärast kordame nullgravitatsiooni katset, kuid seekord raadiotega. Vastuvõtja kood võib jääda samaks, nagu ka CanSat koodis olev seadistus.

Meeldetuletuseks, tegime IMU õppetunnis programmi, mis tuvastas vabalangemise ja lülitas sellises olukorras sisse LED-i. Siin on vana kood:

```Cpp title="Vabalangemise tuvastamise loop-funktsioon"
unsigned long LEDOnTill = 0;

void loop() {
  // Loe kiirendust
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Arvuta kogu kiirendus (ruudus)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Uuenda taimerit, kui tuvastame langemise
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Juhi LED-i taimeri põhjal
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

On ahvatlev lihtsalt lisada `sendData()` otse vanasse näitesse, kuid peame arvestama ajastusega. Tavaliselt ei taha me saata sõnumeid rohkem kui ~20 korda sekundis, kuid teisest küljest tahame, et loop töötaks pidevalt, et LED ikka sisse lülituks.

Peame lisama veel ühe taimeri - seekord andmete saatmiseks iga 50 millisekundi järel. Taimer tehakse, võrreldes praegust aega viimase ajaga, mil andmed saadeti. Viimane aeg uuendatakse iga kord, kui andmed saadetakse. Vaadake ka, kuidas siin stringi tehakse. Seda võiks edastada ka osadena, kuid sel viisil saadetakse see ühe sõnumina, mitte mitme sõnumina.

```Cpp title="Vabalangemise tuvastamine + andmete edastamine"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Loe kiirendust
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Arvuta kogu kiirendus (ruudus)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Uuenda taimerit, kui tuvastame langemise
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Juhi LED-i taimeri põhjal
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Uuenda viimast saatmisaega praeguse ajaga
    lastSendTime = millis();
  }

}
```

Andmevorming on tegelikult taas ühilduv seeria plotteriga - nende andmete vaatamine teeb üsna selgeks, miks suutsime vabalangemist varem nii puhtalt tuvastada - väärtused langevad tõesti nulli kohe, kui seade maha kukutatakse või visatakse.

---

Järgmises osas teeme lühikese pausi, et üle vaadata, mida oleme seni õppinud, ja veenduda, et oleme valmis nendele kontseptsioonidele edasi ehitama.

[Klõpsake siin, et minna esimesele ülevaatele!](./review1)