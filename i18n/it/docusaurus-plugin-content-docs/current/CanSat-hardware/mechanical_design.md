---
sidebar_position: 6
---

# Progettazione Meccanica

## Dimensioni del PCB

![Dimensioni della scheda CanSat NeXT](./img/PCB_dimensions.png)

La scheda principale del CanSat NeXT è costruita su un PCB di 70 x 50 x 1,6 mm, con l'elettronica sul lato superiore e la batteria sul lato inferiore. Il PCB ha punti di montaggio su ogni angolo, a 4 mm dai lati. I punti di montaggio hanno un diametro di 3,2 mm con un'area del pad messa a terra di 6,4 mm, e sono destinati a viti o distanziatori M3. L'area del pad è anche abbastanza grande da ospitare un dado M3. Inoltre, la scheda ha due ritagli trapezoidali di 8 x 1,5 mm sui lati e un'area libera da componenti sul lato superiore al centro, in modo che una fascetta o altro supporto aggiuntivo possa essere aggiunto per le batterie durante le operazioni di volo. Allo stesso modo, due fessure di 8 x 1,3 mm si trovano accanto al connettore dell'antenna MCU in modo che l'antenna possa essere fissata alla scheda con una piccola fascetta o un pezzo di corda. Il connettore USB è leggermente incassato nella scheda per evitare qualsiasi estrusione. È stato aggiunto un piccolo ritaglio per ospitare determinati cavi USB nonostante l'incasso. I connettori di estensione sono connettori femmina standard da 0,1 pollici (2,54 mm), e sono posizionati in modo che il centro del foro di montaggio sia a 2 mm dal bordo lungo della scheda. Il connettore più vicino al bordo corto è a 10 mm da esso. Lo spessore del PCB è di 1,6 mm, e l'altezza delle batterie dalla scheda è approssimativamente di 13,5 mm. I connettori sono alti circa 7,2 mm. Questo rende l'altezza del volume di chiusura approssimativamente di 22,3 mm. Inoltre, se si utilizzano distanziatori per impilare insieme schede compatibili, i distanziatori, gli spaziatori o altri sistemi di montaggio meccanico dovrebbero separare le schede di almeno 7,5 mm. Quando si utilizzano connettori a pin standard, la separazione consigliata tra le schede è di 12 mm.

Di seguito, puoi scaricare un file .step della scheda perforata, che può essere utilizzato per aggiungere il PCB in un progetto CAD come riferimento, o anche come punto di partenza per una scheda modificata.

[Scarica il file step](/assets/3d-files/cansat.step)


## Progettazione di un PCB Personalizzato {#custom-PCB}

Se vuoi portare il tuo design elettronico al livello successivo, dovresti considerare di realizzare un PCB personalizzato per l'elettronica. KiCAD è un ottimo software gratuito che può essere utilizzato per progettare PCB, e farli produrre è sorprendentemente conveniente.

Ecco risorse per iniziare con KiCAD: https://docs.kicad.org/#_getting_started

Ecco un modello KiCAD per iniziare la tua scheda compatibile con CanSat: [Scarica il modello KiCAD](/assets/kicad/Breakout-template.zip)