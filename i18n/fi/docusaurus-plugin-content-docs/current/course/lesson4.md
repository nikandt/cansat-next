---
sidebar_position: 4
---

# Oppitunti 4: Vastus ei ole turhaa

Tähän mennessä olemme keskittyneet digitaalisten anturilaitteiden käyttöön saadaksemme arvot suoraan SI-yksiköissä. Sähkölaitteet tekevät mittauksen kuitenkin yleensä epäsuorasti, ja muunnos haluttuihin yksiköihin tehdään sen jälkeen. Tämä tehtiin aiemmin anturilaitteilla itsellään (ja CanSat NeXT -kirjastolla), mutta monet käyttämämme anturit ovat paljon yksinkertaisempia. Yksi analogisten antureiden tyyppi on resistiiviset anturit, joissa anturielementin vastus muuttuu riippuen jostakin ilmiöstä. Resistiivisiä antureita on olemassa monille suureille - mukaan lukien voima, lämpötila, valon intensiteetti, kemialliset pitoisuudet, pH ja monet muut.

Tässä oppitunnissa käytämme CanSat NeXT -kortin valovastetta (LDR) ympäröivän valon intensiteetin mittaamiseen. Vaikka termistoria käytetään hyvin samalla tavalla, se on tulevan oppitunnin aihe. Samat taidot pätevät suoraan LDR:n ja termistorin käyttöön sekä moniin muihin resistiivisiin antureihin.

![LDR sijainti kortilla](./../CanSat-hardware/img/LDR.png)

## Resistiivisten antureiden fysiikka

Sen sijaan, että hyppäisimme suoraan ohjelmistoon, otetaan askel taaksepäin ja keskustellaan siitä, miten resistiivisen anturin lukeminen yleensä toimii. Tarkastellaan alla olevaa kaaviota. Jännite LDR_EN:ssä on 3,3 volttia (prosessorin käyttöjännite), ja sen reitillä on kaksi sarjaan kytkettyä vastusta. Toinen näistä on **LDR** (R402), kun taas toinen on **referenssivastus** (R402). Referenssivastuksen resistanssi on 10 kilo-ohmia, kun taas LDR:n resistanssi vaihtelee 5-300 kilo-ohmin välillä valaistusolosuhteista riippuen.

![LDR kaavio](./img/LDR.png)

Koska vastukset on kytketty sarjaan, kokonaisresistanssi on 

$$
R = R_{401} + R_{LDR},
$$

ja virta vastusten läpi on 

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

missä $V_{OP}$ on MCU:n käyttöjännite. Muista, että virran on oltava sama molempien vastusten läpi. Siksi voimme laskea jännitehäviön LDR:n yli seuraavasti

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

Ja tämä jännitehäviö on LDR:n jännite, jonka voimme mitata analogia-digitaalimuuntimella. Yleensä tämä jännite voidaan suoraan korreloida tai kalibroida vastaamaan mitattuja arvoja, kuten esimerkiksi jännitteestä lämpötilaan tai kirkkauteen. Joskus on kuitenkin toivottavaa ensin laskea mitattu resistanssi. Jos tarpeen, se voidaan laskea seuraavasti:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## LDR:n lukeminen käytännössä

LDR:n tai muiden resistiivisten antureiden lukeminen on erittäin helppoa, sillä meidän tarvitsee vain kysyä analogia-digitaalimuuntimelta jännite. Aloitetaan tällä kertaa uusi Arduino Sketch alusta. Tiedosto -> Uusi Sketch.

Aloitetaan ensin sketch kuten ennenkin sisällyttämällä kirjasto. Tämä tehdään sketchin alussa. Asetuksissa käynnistä sarjaliikenne ja alustaa CanSat, kuten aiemmin.

```Cpp title="Perusasetukset"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Peruslooppi LDR:n lukemiseen ei ole paljon monimutkaisempi. Vastukset R401 ja R402 ovat jo kortilla, ja meidän tarvitsee vain lukea jännite niiden yhteisestä solmusta. Luetaan ADC-arvo ja tulostetaan se.

```Cpp title="Perus LDR-looppi"
void loop() {
    int value = analogRead(LDR);
    Serial.print("LDR-arvo:");
    Serial.println(value);
    delay(200);
}
```

Tällä ohjelmalla arvot reagoivat selvästi valaistusolosuhteisiin. Saamme pienempiä arvoja, kun LDR altistuu valolle, ja suurempia arvoja, kun on pimeämpää. Arvot ovat kuitenkin sadoissa ja tuhansissa, eivät odotetussa jännitealueessa. Tämä johtuu siitä, että luemme nyt ADC:n suoraa lähtöä. Jokainen bitti edustaa jännitevertailutikkaita, jotka ovat yksi tai nolla jännitteestä riippuen. Arvot ovat nyt 0-4095 (2^12-1) riippuen tulon jännitteestä. Jälleen, tämä suora mittaus on todennäköisesti se, mitä haluat käyttää, jos teet jotain kuten [pulssien havaitseminen LDR:llä](./../../blog/first-project#pulse-detection), mutta usein tavalliset voltit ovat mukavia työskennellä. Vaikka jännitteen laskeminen itse on hyvä harjoitus, kirjasto sisältää muunnostoiminnon, joka ottaa huomioon myös ADC:n epälineaarisuuden, mikä tarkoittaa, että lähtö on tarkempi kuin yksinkertaisesta lineaarisesta muunnoksesta.

```Cpp title="LDR-jännitteen lukeminen"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("LDR-arvo:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Tämä koodi on yhteensopiva Arduino Coden sarjapiirturin kanssa. Kokeile sitä!

:::

:::tip[Harjoitus]

Voisi olla hyödyllistä havaita CanSat:n laukaisu raketista, jotta esimerkiksi laskuvarjo voitaisiin avata oikeaan aikaan. Voitko kirjoittaa ohjelman, joka havaitsee simuloidun laukaisun? Simuloi laukaisua peittämällä ensin LDR (raketin integrointi) ja sitten paljastamalla se (laukaisu). Ohjelma voisi tulostaa laukaisun terminaaliin tai vilkuttaa LEDiä osoittaakseen, että laukaisu tapahtui.

:::

---

Seuraava oppitunti käsittelee SD-kortin käyttöä mittausten, asetusten ja muun tallentamiseen!

[Napsauta tästä seuraavaan oppituntiin!](./lesson5)