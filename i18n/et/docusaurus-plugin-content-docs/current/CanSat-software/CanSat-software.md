---
külgriba_positsioon: 3
---

# CANSAT järgmine tarkvara

Soovitatav viis CanSat'i kasutamiseks järgmisena on CanSat Next Arduino raamatukoguga, mis on saadaval Arduino raamatukoguhaldurilt ja GitHubilt. Enne CanSat'i järgmise teegi installimist peate installima Arduino IDE ja ESP32 tahvli tugi.

## Alustamine

### Installige Arduino IDE

Kui te pole seda veel teinud, laadige ja installige Arduino IDE ametlikust veebisaidilt https://www.arduino.cc/en/software.

### Lisage ESP32 tugi

CanSat Next põhineb ESP32 mikrokontrolleril, mida Arduino IDE vaikimisi paigaldamisel ei kuulu. Kui te pole Arduinoga varem kasutanud ESP32 mikrokontrollereid, tuleb tahvli tugi kõigepealt paigaldada. Seda saab teha Arduino IDE-s * Tools-> Board-> Board Manager * (või lihtsalt vajutage (Ctrl+Shift+B) ükskõik kus). Otsige juhatuse halduris ESP32 ja installige ESPRESSIFi ESP32.

### Installige CanSat järgmine teek

CanSat järgmise teegi saab alla laadida Arduino IDE raamatukoguhaldurist *Sketch> lisage teegid> Hallake raamatukogusid *.

! [Uute raamatukogude lisamine Arduino IDE -ga.] (./ IMG/LibraryManager_1.png)

*Pildi allikas: Arduino docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-librarys*

Tippige raamatukoguhalduri otsinguribal "canSatNext" ja valige "Install". Kui IDE küsib, kas soovite ka sõltuvusi installida, klõpsake jah.

## Käsitsi paigaldamine

Raamatukogu hostitakse ka omal [GitHubi hoidlal] (https://github.com/netnspace/cansatNext_library) ja seda saab kloonida või alla laadida ja installida allikast.

Sel juhul peate raamatukogu eraldama ja kolima selle kataloogi, kus Arduino IDE seda leiab. Täpse asukoha leiate *File> Eelistused> Visandraamatu *.

! [Uute raamatukogude lisamine Arduino IDE -ga.] (./ IMG/LibraryManager_2.png)

*Pildi allikas: Arduino docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-librarys*

# PC -ga ühendamine

Pärast CanSat'i järgmise tarkvarakogu installimist saate arvuti kõrval asuva CanSat'i ühendada. Kui seda ei tuvastata, peate võib -olla kõigepealt installima vajalikud draiverid. Juhi paigaldamine toimub enamikul juhtudel automaatselt, kuid mõnes personaalarvutis tuleb seda teha käsitsi.  Draiverid leiate Silicon Labsi veebisaidilt: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
ESP32 seadistamisel lisateabe saamiseks lugege järgmist õpetust: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-sted/estabish-Serial-conection.html

# Sa oled valmis minema!

Nüüd leiate CanSatNext näiteid Arduino IDE-st *-st File-> näidetest-> canSatNext *.