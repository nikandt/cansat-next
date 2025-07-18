---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

CanSat NeXT Perf Board on lisävaruste, joka on tarkoitettu helpottamaan ulkoisten laitteiden integrointia CanSatiin sekä tekemään omasta elektroniikasta mekaanisesti turvallisempaa ja paremmin järjestettyä. Se on pohjimmiltaan perf board, joka jakaa CanSat NeXT -kortin muodon ja tarjoaa myös helpon liitettävyyden laajennusliitinriviin.

![CanSat NeXT Perf Board](./img/perfboard.png)

Perf boardin pääominaisuus ovat päällystetyt reiät, jotka ovat 0,1 tuuman (2,54 mm) etäisyydellä toisistaan, mikä on elektroniikassa, erityisesti harraste-elektroniikassa, käytetty standardi **jako**. Tämä tekee useimpien kaupallisten breakoutien ja monien kaupallisten IC:iden integroinnista erittäin helppoa, sillä ne voidaan suoraan juottaa perf boardin kontakteihin.

Yläpuolella rei'issä on pieni päällystetty rengas, joka auttaa liitettävyydessä, mutta alapuolella on suuret päällystetyt suorakaiteet, jotka helpottavat juotosiltojen luomista neliöiden välille, mikä auttaa luomaan sähköisen liitännän korttisi laitteiden välillä ja lisättyjen laitteiden ja CanSat NeXT:n välillä.

Lisäksi jotkut liitinrivin lähimmät päällystetyt reiät on jo kytketty laajennusliitinriveihin. Tämä auttaa välttämään kaapeleiden lisäämistä liitinrivin ja perf boardin pääalueen välille, mikä helpottaa myös useiden perf boardien pinoamista päällekkäin, erityisesti käytettäessä [pinottavia liitinrivejä](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header). Tarkistaaksesi, mitä kukin laajennusliitin tekee, katso [Pinout](../CanSat-hardware/pin_out.md)

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />