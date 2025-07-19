---
sidebar_position: 2
---

# Metafelület Rezonátor Antenna

A CanSat NeXT Metafelület Rezonátor Antenna egy külső antennamodul, amely a földi állomás végén használható a kommunikációs hatótávolság növelésére, és a kommunikáció megbízhatóbbá tételére.

![CanSat NeXT Metafelület Rezonátor Antenna](./img/resonator_antenna.png)

A CanSat NeXT [készletantennáját](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) sikeresen használták CanSat küldetések működtetésére, ahol a CanSat 1 kilométeres magasságba lett indítva. Azonban ezeknél a távolságoknál a monopól antenna az üzemi hatótávolság szélén kezd lenni, és néha elveszítheti a jelet a monopól antenna lineáris polarizációjából adódó polarizációs hibák miatt. A metafelület rezonátor antenna készletet úgy tervezték, hogy megbízhatóbb működést tegyen lehetővé ilyen szélsőséges körülmények között, és lehetővé tegye a jelentősen hosszabb hatótávolságú működést is.

A metafelület rezonátor antenna két táblából áll. A fő antenna a radiátor táblán található, ahol egy rés típusú antenna lett maratva a PCB-be. Ez a tábla önmagában körülbelül 3 dBi erősítést biztosít, és [körkörös polarizációval](https://en.wikipedia.org/wiki/Circular_polarization) rendelkezik, ami gyakorlatilag azt jelenti, hogy a jel erőssége már nem függ a műhold antenna tájolásától. Ezért ez a tábla önmagában is használható antennaként, ha szélesebb *nyaláb szélesség* kívánatos.

A másik tábla, amelyről az antenna a nevét kapja, az antenna készlet különleges jellemzője. Ezt 10-15 mm-re kell elhelyezni az első táblától, és rezonátor elemek sorozatát tartalmazza. Az elemeket az alattuk lévő rés antenna gerjeszti, és ezáltal az antenna *irányítottabbá* válik. Ezzel a kiegészítéssel az erősítés megduplázódik 6 dBi-re.

Az alábbi kép az antenna *reflexiós együtthatóját* mutatja, amelyet egy vektorhálózat-analizátorral (VNA) mértek. A grafikon azokat a frekvenciákat mutatja, amelyeken az antenna képes energiát sugározni. Bár az antennának elég jó szélessávú teljesítménye van, a grafikon jó impedanciailleszkedést mutat a 2400-2490 MHz-es üzemi frekvenciatartományban. Ez azt jelenti, hogy ezeknél a frekvenciáknál a teljesítmény nagy része rádióhullámként sugárzódik ki, szemben azzal, hogy visszaverődik. A sáv közepén a legalacsonyabb reflexiós értékek körülbelül -18,2 dB, ami azt jelenti, hogy a teljesítmény mindössze 1,51%-a verődött vissza az antennáról. Bár nehezebb mérni, a szimulációk azt sugallják, hogy a továbbított teljesítmény további 3%-a hővé alakul az antennában, de a fennmaradó 95,5% - az antenna sugárzási hatékonysága - elektromágneses sugárzásként sugárzódik ki.

![CanSat NeXT Metafelület Rezonátor Antenna](./img/antenna_s11.png)

Mint korábban említettük, az antenna erősítése körülbelül 6 dBi. Ez tovább növelhető egy *reflektor* használatával az antenna mögött, amely visszaveri a rádióhullámokat az antennába, javítva az irányítottságot. Míg egy parabola lemez ideális reflektor lenne, még egy sima fémlemez is nagyon hasznos lehet az antenna teljesítményének növelésében. A szimulációk és terepi tesztek szerint egy fémlemez - például egy acéllemez - amelyet 50-60 mm-re helyeznek el az antenna mögött, körülbelül 10 dBi-re növeli az erősítést. A fémlemeznek legalább 200 x 200 mm méretűnek kell lennie - a nagyobb lemezek jobbak lehetnek, de csak csekély mértékben. Azonban nem szabad sokkal kisebbnek lennie ennél. A lemez ideálisan szilárd fém lenne, például acéllemez, de még egy drótháló is működni fog, amennyiben a lyukak mérete kevesebb mint 1/10 hullámhossz (~1,2 cm).