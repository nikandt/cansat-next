---
sidebar_position: 3
---

# Oppitunti 3: Pyörimisen havaitseminen

CanSat NeXT -kortilla on kaksi anturi-IC:tä. Yksi niistä on barometri, jota käytimme viime oppitunnilla, ja toinen on _inertia mittausyksikkö_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). LSM6DS3 on 6-akselinen IMU, mikä tarkoittaa, että se pystyy suorittamaan 6 erilaista mittausta. Tässä tapauksessa se mittaa lineaarista kiihtyvyyttä kolmella akselilla (x, y, z) ja kulmanopeutta kolmella akselilla.

Tässä oppitunnissa tarkastelemme kirjaston IMU-esimerkkiä ja käytämme IMU:ta pieneen kokeeseen.

## Kirjastoesimerkki

Aloitetaan katsomalla, miten kirjastoesimerkki toimii. Lataa se File -> Examples -> CanSat NeXT -> IMU.

Alkuasetukset ovat jälleen samat - kirjaston sisällyttäminen, sarjaliikenteen ja CanSat:n alustaminen. Keskitytään siis silmukkaan. Silmukka näyttää kuitenkin todella tutulta! Luemme arvot aivan kuten viime oppitunnilla, mutta tällä kertaa niitä on paljon enemmän.

```Cpp title="IMU-arvojen lukeminen"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Jokainen akseli luetaan itse asiassa muutaman sadan mikrosekunnin välein. Jos tarvitset niiden päivittymistä samanaikaisesti, tutustu funktioihin [readAcceleration](./../CanSat-software/library_specification#readacceleration) ja [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Arvojen lukemisen jälkeen voimme tulostaa ne kuten yleensä. Tämä voitaisiin tehdä käyttämällä Serial.print ja println aivan kuten viime oppitunnilla, mutta tämä esimerkki näyttää vaihtoehtoisen tavan tulostaa tiedot, paljon vähemmällä manuaalisella kirjoittamisella.

Ensin luodaan 128 merkin puskuri. Sitten tämä alustetaan niin, että jokainen arvo on 0, käyttäen memset-funktiota. Tämän jälkeen arvot kirjoitetaan puskuriin käyttäen `snprintf()`, joka on funktio, jota voidaan käyttää merkkijonojen kirjoittamiseen määritellyllä formaatilla. Lopuksi tämä vain tulostetaan `Serial.println()`-funktiolla.

```Cpp title="Tyylikäs tulostus"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Jos yllä oleva tuntuu hämmentävältä, voit käyttää tutumpaa tyyliä käyttäen print ja println. Tämä käy kuitenkin hieman ärsyttäväksi, kun tulostettavia arvoja on paljon.

```Cpp title="Tavallinen tulostus"
Serial.print("Ax:");
Serial.println(ay);
// jne
```

Lopuksi on jälleen lyhyt viive ennen silmukan uudelleen aloittamista. Tämä on pääasiassa siellä varmistamassa, että tuloste on luettavissa - ilman viivettä numerot muuttuisivat niin nopeasti, että niitä olisi vaikea lukea.

Kiihtyvyys luetaan G-yksiköissä, tai $9.81 \text{ m}/\text{s}^2$ kerrannaisina. Kulmanopeus on yksiköissä $\text{mrad}/\text{s}$.

:::tip[Harjoitus]

Yritä tunnistaa akselit lukemien perusteella!

:::

## Vapaapudotuksen tunnistus

Harjoituksena yritetään tunnistaa, onko laite vapaapudotuksessa. Idea on, että heitämme kortin ilmaan, CanSat NeXT tunnistaa vapaapudotuksen ja sytyttää LEDin pariksi sekunniksi vapaapudotustapahtuman havaitsemisen jälkeen, jotta voimme todeta, että tarkistus on laukaistu, vaikka saisimme sen kiinni.

Voimme pitää asetukset ennallaan ja keskittyä vain silmukkaan. Tyhjennetään vanha silmukkafunktio ja aloitetaan alusta. Huvin vuoksi luetaan tiedot vaihtoehtoisella menetelmällä.

```Cpp title="Kiihtyvyyden lukeminen"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Määritellään vapaapudotus tapahtumaksi, kun kokonaiskiihtyvyys on alle kynnysarvon. Voimme laskea kokonaiskiihtyvyyden yksittäisistä akseleista seuraavasti:

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Joka näyttäisi koodissa tältä.

```Cpp title="Kokonaiskiihtyvyyden laskeminen"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Ja vaikka tämä toimisi, meidän tulisi huomata, että neliöjuuren laskeminen on todella hidasta laskennallisesti, joten meidän tulisi välttää sen tekemistä, jos mahdollista. Loppujen lopuksi voisimme vain laskea

$$a^2 = a_x^2+a_y^2+a_z^2$$

ja verrata tätä ennalta määriteltyyn kynnysarvoon.

```Cpp title="Kokonaiskiihtyvyyden neliön laskeminen"
float totalSquared = ax*ax+ay*ay+az*az;
```

Nyt kun meillä on arvo, aloitetaan LEDin ohjaaminen. Voisimme pitää LEDin päällä aina, kun kokonaiskiihtyvyys on alle kynnysarvon, mutta lukeminen olisi helpompaa, jos LED pysyisi päällä hetken havaitsemisen jälkeen. Yksi tapa tehdä tämä on luoda toinen muuttuja, kutsutaan sitä LEDOnTill, johon yksinkertaisesti kirjoitamme ajan, johon asti haluamme pitää LEDin päällä.

```Cpp title="Ajastinmuuttuja"
unsigned long LEDOnTill = 0;
```

Nyt voimme päivittää ajastimen, jos havaitsemme vapaapudotustapahtuman. Käytetään kynnysarvona 0.1 tällä hetkellä. Arduino tarjoaa funktion nimeltä `millis()`, joka palauttaa ajan ohjelman käynnistymisestä millisekunteina.

```Cpp title="Ajastimen päivittäminen"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Lopuksi voimme vain tarkistaa, onko nykyinen aika enemmän tai vähemmän kuin määritelty `LEDOnTill`, ja ohjata LEDiä sen perusteella. Tässä on miltä uusi silmukkafunktio näyttää:

```Cpp title="Vapaapudotuksen tunnistava silmukkafunktio"
unsigned long LEDOnTill = 0;

void loop() {
  // Kiihtyvyyden lukeminen
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Kokonaiskiihtyvyyden laskeminen (neliö)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Päivitä ajastin, jos havaitsemme pudotuksen
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Ohjaa LEDiä ajastimen perusteella
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Kokeilemalla tätä ohjelmaa, voit nähdä, kuinka nopeasti se nyt reagoi, koska meillä ei ole viivettä silmukassa. LED syttyy heti, kun se lähtee kädestä heitettäessä.

:::tip[Harjoitukset]

1. Yritä lisätä viive takaisin silmukkafunktioon. Mitä tapahtuu?
2. Tällä hetkellä meillä ei ole mitään tulostusta silmukassa. Jos lisäät vain tulostuslauseen silmukkaan, tuloste on todella vaikeasti luettavissa ja tulostus hidastaa silmukan sykliä merkittävästi. Voitko keksiä tavan tulostaa vain kerran sekunnissa, vaikka silmukka pyörii jatkuvasti? Vihje: katso, miten LED-ajastin toteutettiin.
3. Luo oma kokeesi, käyttäen joko kiihtyvyyttä tai pyörimistä jonkin tapahtuman havaitsemiseen.

:::

---

Seuraavassa oppitunnissa jätämme digitaalisen maailman ja kokeilemme erilaista anturityyliä - analogista valomittaria.

[Napsauta tästä seuraavaan oppituntiin!](./lesson4)