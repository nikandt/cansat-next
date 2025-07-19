---
sidebar_position: 2
---

# Metapintaresonaattoriantenni

CanSat NeXT Metapintaresonaattoriantenni on ulkoinen antennimoduuli, jota voidaan käyttää maa-asemalla lisäämään viestintäetäisyyttä ja tekemään viestinnästä luotettavampaa.

![CanSat NeXT Metapintaresonaattoriantenni](./img/resonator_antenna.png)

CanSat NeXT:n [sarja-antenni](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) on käytetty onnistuneesti CanSat-tehtävissä, joissa CanSat on laukaistu 1 kilometrin korkeuteen. Näillä etäisyyksillä monopoliantenni alkaa kuitenkin olla toiminta-alueensa rajalla ja saattaa myös menettää signaalin ajoittain polarisaatiovirheiden vuoksi, jotka johtuvat monopoliantennin lineaarisesta polarisaatiosta. Metapintaresonaattoriantennisarja on suunniteltu mahdollistamaan luotettavampi toiminta tällaisissa äärimmäisissä olosuhteissa ja mahdollistamaan toiminnan huomattavasti pidemmillä etäisyyksillä.

Metapintaresonaattoriantenni koostuu kahdesta levystä. Pääantenni on säteilijälevyllä, jossa aukkoantenni on syövytetty piirilevyyn. Tämä levy itsessään tarjoaa noin 3 dBi:n vahvistuksen ja siinä on [ympyräpolarisaatio](https://en.wikipedia.org/wiki/Circular_polarization), mikä käytännössä tarkoittaa, että signaalin voimakkuus ei enää riipu satelliittiantennin suunnasta. Tätä levyä voidaan siten käyttää antennina itsessään, jos halutaan laajempi *keilan leveys*.

Toinen levy, josta antenni saa nimensä, on tämän antennisarjan erityisominaisuus. Se tulisi sijoittaa 10-15 mm ensimmäisestä levystä, ja siinä on resonanssielementtien matriisi. Elementit saavat energiansa niiden alla olevasta aukkoantennista, mikä puolestaan tekee antennista enemmän *suuntaavan*. Tämän lisäyksen myötä vahvistus kaksinkertaistuu 6 dBi:iin.

Alla oleva kuva näyttää antennin *heijastuskerroin* mitattuna vektoriverkkoanalysaattorilla (VNA). Kuvassa näkyvät taajuudet, joilla antenni pystyy lähettämään energiaa. Vaikka antennilla on melko hyvä laajakaistainen suorituskyky, kuvaaja osoittaa hyvän impedanssisovituksen toimintataajuusalueella 2400-2490 MHz. Tämä tarkoittaa, että näillä taajuuksilla suurin osa tehosta lähetetään radioaaltoina sen sijaan, että se heijastuisi takaisin. Alhaisimmat heijastusarvot kaistan keskellä ovat noin -18,2 dB, mikä tarkoittaa, että vain 1,51 % tehosta heijastui takaisin antennista. Vaikka mittaaminen on vaikeampaa, simulaatiot viittaavat siihen, että lisä 3 % lähetystehossa muuttuu lämmöksi itse antennissa, mutta loput 95,5 % - antennin säteilytehokkuus - säteilee sähkömagneettisena säteilynä.

![CanSat NeXT Metapintaresonaattoriantenni](./img/antenna_s11.png)

Kuten aiemmin mainittiin, antennin vahvistus on noin 6 dBi. Tätä voidaan edelleen lisätä käyttämällä *heijastinta* antennin takana, joka heijastaa radioaallot takaisin antenniin, parantaen suuntaavuutta. Vaikka parabolisesta levystä tulisi ihanteellinen heijastin, jopa pelkkä tasainen metallilevy voi olla erittäin hyödyllinen antennin suorituskyvyn parantamisessa. Simulaatioiden ja kenttäkokeiden mukaan metallilevy - kuten teräslevy - sijoitettuna 50-60 mm antennin taakse lisää vahvistusta noin 10 dBi:iin. Metallilevyn tulisi olla vähintään 200 x 200 mm kooltaan - suurempien levyjen tulisi olla parempia, mutta vain marginaalisesti. Sen ei kuitenkaan pitäisi olla paljon pienempi kuin tämä. Levy olisi ihanteellisesti kiinteää metallia, kuten teräslevyä, mutta jopa metalliverkko toimii, kunhan reikien koko on alle 1/10 aallonpituudesta (~1,2 cm).