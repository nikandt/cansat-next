---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

La CanSat NeXT Perf Board è un accessorio progettato per facilitare l'integrazione di dispositivi esterni al CanSat e per rendere la tua elettronica meccanicamente più sicura e meglio organizzata. È essenzialmente una perf board, che condivide la forma della scheda CanSat NeXT, e fornisce anche una facile connettività all'header dei pin di estensione.

![CanSat NeXT Perf Board](./img/perfboard.png)

La caratteristica principale della perf board sono i fori placcati, distanziati di 0,1 pollici (2,54 mm), che è il **pitch** standard utilizzato in elettronica, specialmente nell'elettronica hobbistica. Questo rende l'integrazione della maggior parte dei breakout commerciali e di molti IC commerciali estremamente facile, poiché possono essere direttamente saldati ai contatti sulla perf board.

Sul lato superiore, i fori hanno un piccolo anello placcato per facilitare la connettività, ma sul lato inferiore ci sono grandi rettangoli placcati, che rendono molto più facile creare ponti di saldatura tra i quadrati, aiutando a creare la connettività elettrica tra i dispositivi sulla tua scheda e tra i dispositivi aggiunti e CanSat NeXT.

Inoltre, alcuni dei fori placcati più vicini all'header sono già collegati agli header dei pin di estensione. Questo ti aiuta a evitare di dover aggiungere cavi tra l'header dei pin e l'area principale della perf board, facilitando anche l'impilamento di più perf board una sopra l'altra, specialmente quando si utilizzano [stacking pin headers](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header). Per verificare quale pin di estensione fa cosa, fai riferimento al [Pinout](../CanSat-hardware/pin_out)

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />