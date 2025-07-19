---
sidebar_position: 8
---

# Õppetund 7: Tagasiside

CanSatid on sageli programmeeritud töötama üsna lihtsa loogika alusel - näiteks mõõtmiste tegemine iga n millisekundi järel, andmete salvestamine ja edastamine ning kordamine. Seevastu käskude saatmine satelliidile, et muuta selle käitumist missiooni keskel, võiks avada palju uusi võimalusi. Võib-olla soovite sensori sisse või välja lülitada või käskida satelliidil heli teha, et seda leida. Võimalusi on palju, kuid võib-olla kõige kasulikum on võime lülitada satelliidis energiamahukad seadmed sisse vahetult enne raketi starti, andes teile palju rohkem paindlikkust ja vabadust tegutseda pärast seda, kui satelliit on juba raketiga integreeritud.

Selles õppetunnis proovime lülitada LEDi sisse ja välja satelliidi plaadil maajaama kaudu. See esindab stsenaariumi, kus satelliit ei tee midagi, kui talle pole öeldud, et ta seda teeks, ja tal on sisuliselt lihtne käsusüsteem.

:::info

## Tarkvara tagasikutsed

Andmete vastuvõtt CanSati teegis on programmeeritud kui **tagasikutsed**, mis on funktsioon, mida kutsutakse... noh, tagasi, kui toimub teatud sündmus. Kui seni on meie programmides kood alati järginud täpselt neid ridu, mille oleme kirjutanud, siis nüüd tundub, et see täidab aeg-ajalt teise funktsiooni vahepeal, enne kui jätkab põhiloopiga. See võib tunduda segadust tekitav, kuid see saab olema üsna selge, kui seda tegevuses näha.

:::

## Kaugjuhtimisega vilkuv LED

Selle harjutuse jaoks proovime korrata LEDi vilkumist esimesest õppetunnist, kuid seekord juhitakse LEDi tegelikult kaugjuhtimise teel.

Vaatame kõigepealt satelliidi poole programmi. Initsialiseerimine on nüüdseks väga tuttav, kuid loop on veidi üllatav - seal pole midagi. See on sellepärast, et kogu loogika käsitletakse tagasikutsumise funktsiooni kaudu kaugjuhtimise teel maajaamast, nii et võime lihtsalt loopi tühjaks jätta.

Huvitavamad asjad toimuvad funktsioonis `onDataReceived(String data)`. See on eelmainitud tagasikutsumise funktsioon, mis on teegis programmeeritud kutsuma iga kord, kui raadio saab andmeid. Funktsiooni nimi on teeki programmeeritud, nii et niikaua kui kasutate täpselt sama nime nagu siin, kutsutakse see, kui andmed on saadaval.

Allolevas näites prinditakse andmed iga kord lihtsalt selleks, et visualiseerida, mis toimub, kuid LEDi olek muutub ka iga kord, kui sõnum vastu võetakse, olenemata sisust.

```Cpp title="Satelliidi kood, mis ei tee midagi ilma käskudeta"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

Muutuja `LED_IS_ON` on salvestatud globaalse muutujana, mis tähendab, et see on koodis kõikjal kättesaadav. Tavaliselt vaadatakse neid programmeerimises viltu ja algajaid õpetatakse neid oma programmides vältima. Kuid _manussüsteemide_ programmeerimisel, nagu me siin teeme, on need tegelikult väga tõhusad ja oodatud viis seda teha. Lihtsalt olge ettevaatlik, et te ei kasutaks sama nime mitmes kohas!

:::

Kui me selle CanSat NeXT plaadile vilgutame ja selle käivitame... Ei juhtu midagi. See on muidugi oodatud, kuna meil pole hetkel ühtegi käsku tulemas.

Maajaama poolel pole kood väga keeruline. Me initsialiseerime süsteemi ja siis loopis saadame sõnumi iga 1000 ms järel, st kord sekundis. Praeguses programmis pole tegelikul sõnumil tähtsust, vaid ainult sellel, et midagi saadetakse samas võrgus.

```Cpp title="Maajaam saadab sõnumeid"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Nüüd, kui me programmeerime selle koodi maajaama (ärge unustage vajutada BOOT-nuppu) ja satelliit on endiselt sees, hakkab satelliidi LED vilkuma, lülitudes sisse ja välja pärast iga sõnumit. Sõnum prinditakse ka terminali.

:::tip[Harjutus]

Vilgutage allolev koodilõik maajaama plaadile. Mis juhtub satelliidi poolel? Kas saate muuta satelliidi programmi nii, et see reageeriks LEDi sisselülitamisega ainult siis, kui saadakse `LED ON` ja välja `LED OFF`, ning muidu lihtsalt prindiks teksti.

```Cpp title="Maajaam saadab sõnumeid"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Genereeri juhuslik indeks sõnumi valimiseks
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Saada juhuslikult valitud sõnum
  sendData(messages[randomIndex]);
}
```

:::

Pange tähele ka, et sõnumite vastuvõtmine ei blokeeri nende saatmist, nii et me võiksime (ja teeme) saata sõnumeid mõlemast otsast samal ajal. Satelliit võib andmeid pidevalt edastada, samal ajal kui maajaam võib jätkata käskude saatmist satelliidile. Kui sõnumid on samaaegsed (samas millisekundis või nii), võib tekkida kokkupõrge ja sõnum ei lähe läbi. Kuid CanSat NeXT edastab sõnumi automaatselt uuesti, kui see tuvastab kokkupõrke. Nii et lihtsalt olge teadlik, et see võib juhtuda, kuid tõenäoliselt jääb see märkamata.

---

Järgmises õppetunnis laiendame seda, et teostada **voo juhtimist** kaugjuhtimise teel või muuta satelliidi käitumist vastuvõetud käskude põhjal.

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson8)