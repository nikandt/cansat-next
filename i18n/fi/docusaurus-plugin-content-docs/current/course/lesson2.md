---
sidebar_position: 2
---

# Oppitunti 2: Paineen tunteminen

Tässä toisessa oppitunnissa alamme käyttää CanSat NeXT -kortin antureita. Tällä kertaa keskitymme ympäröivän ilmanpaineen mittaamiseen. Käytämme sisäänrakennettua barometriä [LPS22HB](./../CanSat-hardware/on_board_sensors.md#barometer) lukemaan painetta sekä lukemaan itse barometrin lämpötilaa.

Aloitetaan kirjaston esimerkkien barometrikoodista. Arduino IDE:ssä valitse File-> Examples->CanSat NeXT->Baro.

Ohjelman alku näyttää melko tutulta viime oppitunnista. Taas kerran aloitamme sisällyttämällä CanSat NeXT -kirjaston ja asettamalla sarjayhteyden sekä alustamalla CanSat NeXT -järjestelmät.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

Funktiokutsu `CanSatInit()` alustaa kaikki anturit puolestamme, mukaan lukien barometrin. Joten voimme alkaa käyttää sitä loop-funktiossa.

Alla olevat kaksi riviä ovat, missä lämpötila ja paine itse asiassa luetaan. Kun funktiot `readTemperature()` ja `readPressure()` kutsutaan, prosessori lähettää komennon barometrille, joka mittaa paineen tai lämpötilan ja palauttaa tuloksen prosessorille.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

Esimerkissä arvot tulostetaan, ja sitten seuraa 1000 ms viive, jotta silmukka toistuu suunnilleen kerran sekunnissa.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Datan käyttäminen

Voimme myös käyttää dataa koodissa, sen sijaan että vain tulostaisimme tai tallentaisimme sen. Esimerkiksi voisimme tehdä koodin, joka havaitsee, jos paine laskee tietyn määrän, ja esimerkiksi sytyttää LEDin. Tai mitä tahansa muuta haluat tehdä. Kokeillaan sytyttää sisäänrakennettu LED.

Tämän toteuttamiseksi meidän on hieman muokattava esimerkin koodia. Ensiksi, aloitetaan seuraamalla edellistä painearvoa. Luodaksesi **globaalit muuttujat**, eli sellaiset, jotka eivät ole olemassa vain tietyn funktion suorittamisen aikana, voit yksinkertaisesti kirjoittaa ne minkä tahansa tietyn funktion ulkopuolelle. Muuttuja previousPressure päivitetään jokaisella loop-funktion kierroksella, aivan lopussa. Tällä tavalla pidämme kirjaa vanhasta arvosta ja voimme verrata sitä uudempaan arvoon.

Voimme käyttää if-lauseketta vertaamaan vanhoja ja uusia arvoja. Alla olevassa koodissa idea on, että jos edellinen paine on 0.1 hPa alempi kuin uusi arvo, sytytämme LEDin, ja muuten LED pidetään sammutettuna.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
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

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

Jos lataat tämän muokatun loopin CanSat NeXT:lle, sen pitäisi sekä tulostaa muuttujien arvot kuten ennen, mutta nyt myös etsiä paineen laskua. Ilmanpaine laskee noin 0.12 hPa / metri ylöspäin mentäessä, joten jos yrität nopeasti nostaa CanSat NeXT:iä metrin korkeammalle, LEDin pitäisi syttyä yhdeksi silmukkakierrokseksi (1 sekunti) ja sitten sammua. On luultavasti parasta irrottaa USB-kaapeli ennen tämän kokeilemista!

Voit myös kokeilla muokata koodia. Mitä tapahtuu, jos viivettä muutetaan? Entä jos 0.1 hPa **hystereesiä** muutetaan tai jopa poistetaan kokonaan?

---

Seuraavassa oppitunnissa saamme vielä enemmän fyysistä toimintaa, kun yritämme käyttää toista integroitua anturipiiriä - inertia-mittausyksikköä.

[Napsauta tästä seuraavaan oppituntiin!](./lesson3)