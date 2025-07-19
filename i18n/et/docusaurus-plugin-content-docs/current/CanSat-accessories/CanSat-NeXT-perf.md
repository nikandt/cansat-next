---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

CanSat NeXT Perf Board on lisaseade, mis on mõeldud välisseadmete integreerimise lihtsustamiseks CanSatiga ning oma elektroonika mehaaniliselt turvalisemaks ja paremini organiseerituks muutmiseks. See on sisuliselt perf board, mis jagab CanSat NeXT plaadi kuju ja pakub ka lihtsat ühenduvust laienduspinide päisega.

![CanSat NeXT Perf Board](./img/perfboard.png)

Perf boardi peamine omadus on kaetud augud, mis on paigutatud 0,1 tolli (2,54 mm) vahedega, mis on elektroonikas, eriti hobielektroonikas, kasutatav standardne **samm**. See muudab enamiku kommertslike breakoutide ja paljude kommertslike IC-de integreerimise äärmiselt lihtsaks, kuna neid saab otse joota perf boardi kontaktidele.

Ülemisel küljel on aukudel väike kaetud rõngas, mis aitab ühenduvust, kuid alumisel küljel on suured kaetud ristkülikud, mis muudavad palju lihtsamaks jootesildade loomise ruutude vahel, aidates luua elektrilist ühenduvust teie plaadil olevate seadmete vahel ja lisatud seadmete ning CanSat NeXT vahel.

Lisaks on mõned päisele kõige lähemal asuvad kaetud augud juba ühendatud laienduspinide päistega. See aitab vältida vajadust lisada kaableid pinide päise ja perf boardi peamise ala vahel, aidates ka mitme perf boardi üksteise peale virnastamisel, eriti kui kasutatakse [virnastatavaid pinide päiseid](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header). Et kontrollida, milline laienduspin mida teeb, vaadake [Pinout](../CanSat-hardware/pin_out)

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />