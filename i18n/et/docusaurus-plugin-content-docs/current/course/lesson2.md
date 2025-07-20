---
sidebar_position: 2
---

# Õppetund 2: Tundke survet

Selles teises õppetunnis hakkame kasutama CanSat NeXT plaadi sensoreid. Seekord keskendume ümbritseva atmosfäärirõhu mõõtmisele. Kasutame pardal olevat baromeetrit [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer), et lugeda rõhku, samuti lugeda baromeetri enda temperatuuri.

Alustame raamatukogu näidete baromeetri koodist. Arduino IDE-s valige File-> Examples->CanSat NeXT->Baro.

Programmi algus tundub üsna tuttav eelmisest õppetunnist. Jällegi alustame CanSat NeXT raamatukogu kaasamisega, seadistame seeriaühenduse ning initsialiseerime CanSat NeXT süsteemid.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initsialiseeri seeriaühendus
  Serial.begin(115200);

  // Initsialiseeri CanSatNeXT pardasüsteemid
  CanSatInit();
}
```

Funktsiooni `CanSatInit()` väljakutse initsialiseerib kõik sensorid, sealhulgas baromeetri. Seega saame seda kasutada loop-funktsioonis.

Allpool on kaks rida, kus tegelikult loetakse temperatuuri ja rõhku. Kui kutsutakse funktsioonid `readTemperature()` ja `readPressure()`, saadab protsessor käsu baromeetrile, mis mõõdab rõhku või temperatuuri ja tagastab tulemuse protsessorile.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

Näites prinditakse väärtused ja seejärel järgneb 1000 ms viivitus, nii et tsükkel kordub umbes kord sekundis.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");

delay(1000);
```

### Andmete kasutamine

Saame andmeid kasutada ka koodis, mitte ainult printimiseks või salvestamiseks. Näiteks võiksime luua koodi, mis tuvastab, kui rõhk langeb teatud koguse võrra, ja näiteks lülitab LED-i sisse. Või midagi muud, mida soovite teha. Proovime lülitada pardal oleva LED-i sisse.

Selle rakendamiseks peame näites olevat koodi veidi muutma. Esiteks hakkame jälgima eelmist rõhu väärtust. **Globaalsete muutujate** loomiseks, st selliste, mis ei eksisteeri ainult konkreetse funktsiooni täitmise ajal, saate need lihtsalt kirjutada väljaspool konkreetset funktsiooni. Muutuja previousPressure uuendatakse iga loop-funktsiooni tsükli lõpus. Nii hoiame vana väärtuse jälgimist ja saame seda võrrelda uuema väärtusega.

Saame kasutada if-lauseid, et võrrelda vanu ja uusi väärtusi. Allolevas koodis on idee, et kui eelmine rõhk on 0,1 hPa madalam kui uus väärtus, lülitame LED-i sisse, vastasel juhul jääb LED välja.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // loe temperatuur float-muutujasse
  float t = readTemperature();

  // loe rõhk float-muutujasse
  float p = readPressure(); 

  // Prindi rõhk ja temperatuur
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Oota üks sekund enne tsükli uuesti alustamist
  delay(1000);

  previousPressure = p;
}
```

Kui laadite selle muudetud tsükli CanSat NeXT-i, peaks see nii nagu varem prindima muutujate väärtusi, kuid nüüd otsib ka rõhulangust. Atmosfäärirõhk langeb umbes 0,12 hPa / meetri kohta ülespoole liikudes, seega kui proovite CanSat NeXT-i kiiresti meetri võrra kõrgemale tõsta, peaks LED ühe tsükli (1 sekundi) jooksul sisse lülituma ja seejärel uuesti välja lülituma. Tõenäoliselt on kõige parem USB-kaabel enne seda lahti ühendada!

Võite proovida ka koodi muuta. Mis juhtub, kui viivitus muudetakse? Mis saab siis, kui 0,1 hPa **hüsterees** muudetakse või isegi täielikult eemaldatakse?

---

Järgmises õppetunnis saame veelgi rohkem füüsilist tegevust, kui proovime kasutada teist integreeritud sensorit - inertsiaalset mõõteseadet.

[Klõpsake siin, et minna järgmisele õppetunnile!](./lesson3)