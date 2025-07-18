---
Külgriba_positsioon: 2
---

# 1. õppetund: Tere maailm!

See esimene õppetunni show paneb teid CanSat'iga järgmisena alustama, näidates, kuidas oma esimest programmi tahvlil kirjutada ja käivitada.

Pärast seda õppetundi on teil vajalikud tööriistad, et hakata oma punenisati jaoks tarkvara välja töötama.

## Tööriista installimine

Cansat Next on soovitatav kasutada koos Arduino IDE -ga, nii et alustame selle ja vajalike raamatukogude ja tahvlite paigaldamisega.

### Installige Arduino IDE

Kui te pole seda veel teinud, laadige ja installige Arduino IDE ametlikust veebisaidilt https://www.arduino.cc/en/software.

### Lisage ESP32 tugi

CanSat Next põhineb ESP32 mikrokontrolleril, mida Arduino IDE vaikimisi paigaldamisel ei kuulu. Kui te pole Arduinoga varem kasutanud ESP32 mikrokontrollereid, tuleb tahvli tugi kõigepealt paigaldada. Seda saab teha Arduino IDE-s * Tools-> Board-> Board Manager * (või lihtsalt vajutage (Ctrl+Shift+B) ükskõik kus). Otsige juhatuse halduris ESP32 ja installige ESPRESSIFi ESP32.

### Installige CanSat järgmine teek

CanSat järgmise teegi saab alla laadida Arduino IDE raamatukoguhaldurist *Sketch> lisage teegid> Hallake raamatukogusid *.

! [Uute raamatukogude lisamine koos Arduino IDE-ga.] (.

*Pildi allikas: Arduino docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-librarys*

Tippige raamatukoguhalduri otsinguribal "canSatNext" ja valige "Install". Kui IDE küsib, kas soovite ka sõltuvusi installida, klõpsake nuppu YES.S

## PC -ga ühendamine

Pärast CanSat'i järgmise tarkvarakogu installimist saate arvuti kõrval asuva CanSat'i ühendada. Kui seda ei tuvastata, peate võib -olla kõigepealt installima vajalikud draiverid. Juhi paigaldamine toimub enamikul juhtudel automaatselt, kuid mõnes personaalarvutis tuleb seda teha käsitsi.  Draiverid leiate Silicon Labsi veebisaidilt: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
ESP32 seadistamisel lisateabe saamiseks lugege järgmist õpetust: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-sted/estabish-Serial-conection.html

## oma esimese programmi käivitamine

Kasutame nüüd värskelt installitud raamatukogusid, et hakata järgmisena CanSat koodi käivitama. Nagu traditsioon, alustame LED -i vilkumisega ja kirjutades "Tere maailm!" arvutisse.

### Õige pordi valimine

Pärast CanSati järgmise ühendamist arvutisse (ja toite sisselülitamist) peate valima õige pordi. Kui te ei tea, milline neist on õige, ühendage seade lihtsalt lahti ja vaadake, milline port kaob.

! [Õige tahvli valimine.] (./ img/selection.png)

Arduino IDE palub nüüd teie seadme tüübi jaoks. Valige ESP32 Dev moodul.

! [Valides õige tahvli tüüp.] (./ IMG/TYPE.PNG)

### Näite valimine

CanSat järgmisel teegil on mitu näitekoodet, mis näitavad, kuidas tahvli erinevaid funktsioone kasutada. Neid näite visandeid leiate failist -> Näited -> CANSAT järgmine. Valige "Hello_world".

Pärast uue visandi avamist saate selle tahvlile üles laadida, vajutades nupu Upload.

! [Upload.] (./ IMG/UPLOAD.PNG)

Mõne aja pärast peaks tahvli LED hakata vilkuma. Lisaks saadab seade arvutile sõnumi. Seda näete, avades seeriamonitori ja valides Baud määra 115200.

Proovige ka tahvli nuppu vajutada. See peaks lähtestama protsessori või teisisõnu, taaskäivitama kood algusest peale.

### Tere, selgitas

Vaatame, mis selles koodis tegelikult juhtub, läbides selle rea järgi. Esiteks algab kood **, sealhulgas ** CANSAT -i teek. See rida peaks olema peaaegu kõigi CANSAT -i jaoks järgmisena kirjutatud programmide alguses, kuna see ütleb kompilaatorile, et tahame kasutada CanSat'i järgmise raamatukogu funktsioone.

`` `Cpp tiitel =" lisage cansat järgmine "
#include "canSatNext.h"
`` `
Pärast seda hüppab kood seadistusfunktsiooni juurde. Seal on meil kaks kõnet - esiteks on seeria liides, mida kasutame USB kaudu arvutisse sõnumite saatmiseks. Funktsioonikõnes 115200 arv viitab baud-kiirusele, st mitu neist ja nullid saadetakse igal sekundil. Järgmine kõne, `cansatinit ()`, on pärit CanSat järgmisest raamatukogust ja see algatab kõik pardal olevad andurid ja muud funktsioonid. Sarnaselt käsuga##hõlmab seda tavaliselt ka CanSat järgmisena Skethes. Kõik, mida soovite käivitada vaid üks kord käivitamisel, peaks olema seadistusfunktsioonis.

`` `CPP Title =" Seadip "
void setup () {
  // Alustage jadaliini andmete terminali printimiseks
  Seeria.Begin (115200);
  // Käivitage kõik CanSatNext pardal olevad süsteemid.
  Cansatinit ();
}
`` `

Pärast seadistamist hakkab kood lõputult silmuse funktsiooni kordama. Esiteks kirjutab programm, et väljundnõel on kõrge, st pinge on 3,3 volti. See lülitab sisse pardal oleva LED. Pärast 100 millisekundit pööratakse selle väljundtihvti pinge tagasi nullini. Nüüd ootab programm 400 ms ja saadab seejärel arvutile sõnumi. Pärast sõnumi saatmist algab silmuse funktsioon uuesti algusest peale.

`` `CPP Title =" Loop "
tühine Loop () {
  // pilgume LED -i
  DigitalWrite (LED, High);
  viivitus (100);
  DigitalWrite (LED, madal);
  viivitus (400);
  Serial.println ("See on teade!");
}
`` `

Samuti võite proovida muuta viivitusväärtusi või sõnumit, et näha, mis juhtub. Palju õnne selle kaugele jõudmise eest! Tööriistade seadistamine võib olla keeruline, kuid sellest hetkest peaks see lõbusamaks minema. 

---

Järgmises õppetunnis hakkame lugema andmeid pardaanduritest.

[Teise õppetunni saamiseks klõpsake siin!] (./ õppetund2)