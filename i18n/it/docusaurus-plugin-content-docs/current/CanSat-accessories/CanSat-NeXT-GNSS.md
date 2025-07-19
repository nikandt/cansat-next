---
sidebar_position: 1
---

# Modulo GNSS CanSat NeXT

Il modulo GNSS CanSat NeXT estende CanSat NeXT con capacità di tracciamento della posizione e orologio in tempo reale preciso. Il modulo si basa sul ricevitore GNSS U-Blox SAM-M10Q di U-Blox.

![Modulo GNSS CanSat NeXT](./img/GNSS.png)

## Hardware

Il modulo collega il ricevitore GNSS al CanSat NeXT tramite l'interfaccia UART nell'header di estensione. Il dispositivo utilizza i pin 16 e 17 dell'header di estensione per UART RX e TX, e prende anche l'alimentazione dalla linea +3V3 nell'header di estensione.

Per impostazione predefinita, i registri di backup del modulo GNSS sono alimentati dalla linea +3V3. Sebbene ciò renda il modulo facile da usare, significa che il modulo deve sempre iniziare da zero quando cerca di trovare un fix. Per mitigare questo, è possibile fornire una fonte di alimentazione esterna tramite la linea di tensione di backup attraverso i connettori J103. La tensione fornita al pin V_BCK dovrebbe essere di 2-6,5 volt, e l'assorbimento di corrente è costante a 65 microampere, anche quando l'alimentazione principale è spenta. Fornire la tensione di backup consente al ricevitore GNSS di mantenere tutte le impostazioni, ma anche, cosa cruciale, i dati di almanacco ed effemeridi - riducendo il tempo per ottenere un fix da ~30 secondi a 1-2 secondi se il dispositivo non si è mosso significativamente tra gli spegnimenti.

Esistono molti altri breakout e moduli GNSS disponibili da aziende come Sparkfun e Adafruit, tra gli altri. Questi possono essere collegati a CanSat NeXT tramite la stessa interfaccia UART, o utilizzando SPI e I2C, a seconda del modulo. La libreria CanSat NeXT dovrebbe supportare anche altri breakout che utilizzano moduli U-blox. Quando si cercano breakout GNSS, cercare di trovarne uno in cui il PCB di base sia il più grande possibile - la maggior parte presenta PCB troppo piccoli, il che rende le loro prestazioni dell'antenna molto deboli rispetto ai moduli con PCB più grandi. Qualsiasi dimensione inferiore a 50x50 mm inizierà a ostacolare le prestazioni e la capacità di trovare e mantenere un fix.

Per ulteriori informazioni sul modulo GNSS e il gran numero di impostazioni e funzionalità disponibili, controllare il datasheet del ricevitore GNSS sul [sito web di U-Blox](https://www.u-blox.com/en/product/sam-m10q-module).

L'integrazione hardware del modulo a CanSat NeXT è davvero semplice - dopo aver aggiunto i distanziatori ai fori delle viti, inserire con cura i pin dell'header nei socket dei pin. Se si intende realizzare una pila elettronica multistrato, assicurarsi di posizionare il GNSS come modulo più in alto per consentire 

![Modulo GNSS CanSat NeXT](./img/stack.png)

## Software

Il modo più semplice per iniziare a utilizzare il CanSat NeXT GNSS è con la nostra libreria Arduino, che puoi trovare nel gestore delle librerie di Arduino. Per istruzioni su come installare la libreria, fare riferimento alla pagina [iniziare](./../course/lesson1).

La libreria include esempi su come leggere la posizione e l'ora corrente, nonché come trasmettere i dati con CanSat NeXT.

Una nota rapida sulle impostazioni - il modulo deve essere informato su quale tipo di ambiente verrà utilizzato, in modo che possa approssimare al meglio la posizione dell'utente. Tipicamente, si presume che l'utente sarà a livello del suolo, e mentre potrebbe muoversi, l'accelerazione probabilmente non è molto alta. Questo ovviamente non è il caso con i CanSat, che potrebbero essere lanciati con razzi, o colpire il suolo con velocità piuttosto elevate. Pertanto, la libreria imposta per impostazione predefinita la posizione da calcolare assumendo un ambiente ad alta dinamica, il che consente di mantenere il fix almeno in parte durante un'accelerazione rapida, ma rende anche la posizione a terra notevolmente meno precisa. Se invece è più desiderabile un'alta precisione una volta atterrati, è possibile inizializzare il modulo GNSS con il comando `GNSS_init(DYNAMIC_MODEL_GROUND)`, sostituendo il default `GNSS_init(DYNAMIC_MODEL_ROCKET)` = `GNSS_init()`. Inoltre, c'è `DYNAMIC_MODEL_AIRBORNE`, che è leggermente più accurato del modello a razzo, ma presuppone solo un'accelerazione modesta.

Questa libreria dà priorità alla facilità d'uso e ha solo funzionalità di base come ottenere la posizione e l'ora dal GNSS. Per gli utenti che cercano funzionalità GNSS più avanzate, l'eccellente SparkFun_u-blox_GNSS_Arduino_Library potrebbe essere una scelta migliore.

## Specifiche della libreria

Ecco i comandi disponibili dalla libreria CanSat GNSS.

### GNSS_Init

| Funzione             | uint8_t GNSS_Init(uint8_t dynamic_model)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di ritorno**  | `uint8_t`                                                          |
| **Valore di ritorno**| Ritorna 1 se l'inizializzazione è stata completata con successo, o 0 se c'è stato un errore. |
| **Parametri**        |                                                                    |
|                      | `uint8_t dynamic_model`                                           |
|                      | Questo sceglie il modello dinamico, o l'ambiente che il modulo GNSS assume. Le scelte possibili sono DYNAMIC_MODEL_GROUND, DYNAMIC_MODEL_AIRBORNE e DYNAMIC_MODEL_ROCKET. |
| **Descrizione**      | Questo comando inizializza il modulo GNSS, e dovrebbe essere chiamato nella funzione di setup. |

### readPosition

| Funzione             | uint8_t readPosition(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di ritorno**  | `uint8_t`                                                          |
| **Valore di ritorno**| Ritorna 0 se la misurazione è stata completata con successo.       |
| **Parametri**        |                                                                    |
|                      | `float &latitude, float &longitude, float &altitude`                                    |
|                      | `float &x`: Indirizzo di una variabile float dove i dati verranno memorizzati. |
| **Usato nell'esempio di sketch** | Tutti                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere la posizione del dispositivo come coordinate. I valori saranno semi-casuali prima che il fix venga ottenuto. L'altitudine è in metri dal livello del mare, anche se non è molto accurata. |

### getSIV

| Funzione             | uint8_t getSIV()                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo di ritorno**  | `uint8_t`                                                          |
| **Valore di ritorno**| Numero di satelliti visibili |
| **Usato nell'esempio di sketch** | Funzioni aggiuntive                                          |
| **Descrizione**      | Ritorna il numero di satelliti visibili. Tipicamente valori inferiori a 3 indicano nessun fix. |

### getTime

| Funzione             | uint32_t getTime()                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo di ritorno**  | `uint32_t`                                                          |
| **Valore di ritorno**| Tempo Epoch corrente |
| **Usato nell'esempio di sketch** | Funzioni aggiuntive                                          |
| **Descrizione**      | Ritorna il tempo epoch corrente, come indicato dai segnali dai satelliti GNSS. In altre parole, questo è il numero di secondi trascorsi dalle 00:00:00 UTC, giovedì primo gennaio 1970. |