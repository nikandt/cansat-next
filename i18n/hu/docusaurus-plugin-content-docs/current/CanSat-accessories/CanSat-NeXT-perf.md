---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

A CanSat NeXT Perf Board egy kiegészítő, amely megkönnyíti a külső eszközök integrálását a CanSat-hoz, és mechanikailag biztonságosabbá és jobban szervezetté teszi a saját elektronikáját. Lényegében egy perf board, amely osztozik a CanSat NeXT board alakján, és könnyű csatlakozást biztosít a kiterjesztési tűfejhez.

![CanSat NeXT Perf Board](./img/perfboard.png)

A perf board fő jellemzője a bevonatos lyukak, amelyek 0,1 hüvelyk (2,54 mm) távolságra vannak egymástól, ami az elektronikai szabványos **osztás**, különösen a hobbi elektronikában. Ez rendkívül megkönnyíti a legtöbb kereskedelmi breakout és sok kereskedelmi IC integrálását, mivel közvetlenül forraszthatók a perf board érintkezőire.

A felső oldalon a lyukaknak van egy kis bevonatos gyűrűje, amely segíti a csatlakozást, de az alsó oldalon nagy bevonatos téglalapok találhatók, amelyek sokkal könnyebbé teszik a forrasztási hidak létrehozását a négyzetek között, segítve az elektromos csatlakozás létrehozását az eszközök között a boardon, valamint a hozzáadott eszközök és a CanSat NeXT között.

Továbbá, néhány bevonatos lyuk, amely a legközelebb van a fejhez, már csatlakoztatva van a kiterjesztési tűfejekhez. Ez segít elkerülni, hogy kábeleket kelljen hozzáadni a tűfej és a perf board fő területe között, és segít több perf board egymásra helyezésében is, különösen, ha [stacking pin headers](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header) használunk. Hogy ellenőrizze, melyik kiterjesztési tű mit csinál, tekintse meg a [Pinout](../CanSat-hardware/pin_out) részt.

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />