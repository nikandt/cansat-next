---
sidebar_position: 6
---

# Mekaaninen suunnittelu

## Piirilevyn mitat

![CanSat NeXT -levyn mitat](./img/PCB_dimensions.png)

CanSat NeXT -päälevy on rakennettu 70 x 50 x 1,6 mm piirilevylle, jossa elektroniikka on yläpuolella ja akku alapuolella. Piirilevyssä on kiinnityspisteet jokaisessa kulmassa, 4 mm sivuista. Kiinnityspisteiden halkaisija on 3,2 mm ja maadoitetun padin alue on 6,4 mm, ja ne on tarkoitettu M3-ruuveille tai etäisyyspalkeille. Padin alue on myös tarpeeksi suuri M3-mutterille. Lisäksi levyssä on kaksi trapetsin muotoista 8 x 1,5 mm aukkoa sivuilla ja komponenttivapaa alue yläpuolella keskellä, jotta nippuside tai muu lisätuki voidaan lisätä akuille lentotoimintaa varten. Samoin kaksi 8 x 1,3 mm aukkoa löytyy MCU-antenniliittimen vierestä, jotta antenni voidaan kiinnittää levyyn pienellä nippusiteellä tai narunpätkällä. USB-liitin on hieman upotettu levyyn estämään ulkonemat. Pieni aukko on lisätty, jotta tietyt USB-kaapelit mahtuvat upotuksesta huolimatta. Laajennusliittimet ovat standardeja 0,1 tuuman (2,54 mm) naarasliittimiä, ja ne on sijoitettu siten, että kiinnitysreiän keskipiste on 2 mm levyn pitkästä reunasta. Lähinnä lyhyttä reunaa oleva liitin on 10 mm päässä siitä. Piirilevyn paksuus on 1,6 mm, ja akkujen korkeus levystä on noin 13,5 mm. Liittimet ovat noin 7,2 mm korkeita. Tämä tekee suljetun tilavuuden korkeudeksi noin 22,3 mm. Lisäksi, jos käytetään etäisyyspalkeja yhteensopivien levyjen pinoamiseen, etäisyyspalkeilla, välikappaleilla tai muulla mekaanisella kiinnitysjärjestelmällä tulisi erottaa levyt vähintään 7,5 mm. Kun käytetään standardi pin-liittimiä, suositeltu levyjen välinen etäisyys on 12 mm.

Alla voit ladata .step-tiedoston perf-levystä, jota voidaan käyttää lisäämään piirilevy CAD-suunnitteluun viitteeksi tai jopa lähtökohtana muokatulle levylle.

[Lataa step-tiedosto](/assets/3d-files/cansat.step)


## Oman piirilevyn suunnittelu {#custom-PCB}

Jos haluat viedä elektroniikkasuunnittelusi seuraavalle tasolle, kannattaa harkita oman piirilevyn tekemistä elektroniikalle. KiCAD on loistava, ilmainen ohjelmisto, jota voidaan käyttää piirilevyjen suunnitteluun, ja niiden valmistaminen on yllättävän edullista.

Tässä on resursseja KiCADin käytön aloittamiseen: https://docs.kicad.org/#_getting_started

Tässä on KiCAD-malli oman CanSat-yhteensopivan piirilevyn aloittamiseen: [Lataa KiCAD-malli](/assets/kicad/Breakout-template.zip)