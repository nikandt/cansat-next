---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

CanSat NeXT Perf Board är ett tillbehör avsett att underlätta integrationen av externa enheter till CanSat och göra dina egna elektroniska komponenter mekaniskt säkrare och bättre organiserade. Det är i huvudsak ett perf board som delar formen av CanSat NeXT-kortet och ger också enkel anslutning till förlängningsstiftlisten.

![CanSat NeXT Perf Board](./img/perfboard.png)

Huvudfunktionen hos perf board är pläterade hål, placerade 0,1 tum (2,54 mm) från varandra, vilket är standard **pitch** som används inom elektronik, särskilt inom hobbyelektronik. Detta gör integrationen av de flesta kommersiella breakouts och många kommersiella ICs extremt enkel, eftersom de kan lödas direkt till kontakterna på perf board.

På ovansidan har hålen en liten pläterad ring för att underlätta anslutning, men på undersidan finns det stora pläterade rektanglar, vilket gör det mycket enklare att skapa lödbryggor mellan fyrkanterna, vilket underlättar skapandet av elektrisk anslutning mellan enheterna på ditt kort och mellan de tillagda enheterna och CanSat NeXT.

Dessutom är några av de pläterade hålen närmast stiftlisten redan anslutna till förlängningsstiftlisten. Detta hjälper dig att undvika att behöva lägga till kablar mellan stiftlisten och huvudområdet på perf board, vilket också underlättar stapling av flera perf boards ovanpå varandra, särskilt när du använder [staplingsstiftlister](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header). För att kontrollera vilken förlängningsstift som gör vad, se [Pinout](../CanSat-hardware/pin_out)

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />