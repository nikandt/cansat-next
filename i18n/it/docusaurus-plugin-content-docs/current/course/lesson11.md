---
sidebar_position: 12
---

# Lezione 11: Il Satellite Deve Crescere

Anche se il CanSat NeXT ha già molti sensori e dispositivi integrati sulla scheda del satellite, molte missioni CanSat entusiasmanti richiedono l'uso di altri sensori esterni, servomeccanismi, telecamere, motori o altri attuatori e dispositivi. Questa lezione è leggermente diversa dalle precedenti, poiché discuteremo l'integrazione di vari dispositivi esterni al CanSat. Il tuo caso d'uso effettivo probabilmente non è considerato, ma forse qualcosa di simile lo è. Tuttavia, se c'è qualcosa che ritieni debba essere trattato qui, ti prego di inviarmi un feedback a samuli@kitsat.fi.

Questa lezione è leggermente diversa dalle precedenti, poiché, sebbene tutte le informazioni siano utili, dovresti sentirti libero di saltare alle aree che sono rilevanti specificamente per il tuo progetto e utilizzare questa pagina come riferimento. Tuttavia, prima di continuare questa lezione, ti preghiamo di consultare i materiali presentati nella sezione [hardware](./../CanSat-hardware/CanSat-hardware.md) della documentazione di CanSat NeXT, poiché copre molte informazioni necessarie per integrare dispositivi esterni.

## Collegamento di dispositivi esterni

Ci sono due ottimi modi per collegare dispositivi esterni al CanSat NeXT: utilizzando le [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) e PCB personalizzati. Creare il proprio PCB è più facile (e più economico) di quanto si possa pensare, e per iniziare con essi, un buon punto di partenza è questo [tutorial di KiCAD](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Abbiamo anche un [modello](../CanSat-hardware/mechanical_design#custom-PCB) disponibile per KiCAD, in modo che realizzare le tue schede nello stesso formato sia molto facile.

Detto ciò, per la maggior parte delle missioni CanSat, saldare i sensori esterni o altri dispositivi su una perf board è un ottimo modo per creare stack elettronici affidabili e robusti.

Un modo ancora più semplice per iniziare, soprattutto quando si prototipa per la prima volta, è utilizzare cavi jumper (chiamati anche cavi Dupont o fili per breadboard). Sono tipicamente forniti anche con i breakout dei sensori, ma possono essere acquistati separatamente. Questi condividono lo stesso passo di 0,1 pollici utilizzato dall'intestazione dei pin di estensione, il che rende molto facile collegare dispositivi con cavi. Tuttavia, sebbene i cavi siano facili da usare, sono piuttosto ingombranti e inaffidabili. Per questo motivo, evitare i cavi per il modello di volo del tuo CanSat è caldamente consigliato.

## Condivisione dell'alimentazione ai dispositivi

CanSat NeXT utilizza 3,3 volt per tutti i suoi dispositivi, motivo per cui è l'unica linea di tensione fornita all'intestazione di estensione. Molti breakout commerciali, specialmente quelli più vecchi, supportano anche il funzionamento a 5 volt, poiché è la tensione utilizzata dagli Arduini legacy. Tuttavia, la stragrande maggioranza dei dispositivi supporta anche il funzionamento direttamente a 3,3 volt.

Nei pochi casi in cui sono assolutamente necessari 5 volt, puoi includere un **convertitore boost** sulla scheda. Sono disponibili moduli pronti all'uso, ma puoi anche saldare direttamente molti dispositivi sulla perf board. Detto ciò, cerca di utilizzare prima il dispositivo a 3,3 volt, poiché c'è una buona probabilità che funzioni.

La corrente massima consigliata dalla linea di 3,3 volt è di 300 mA, quindi per dispositivi che richiedono molta corrente come motori o riscaldatori, considera una fonte di alimentazione esterna.

## Linee dati

L'intestazione di estensione ha un totale di 16 pin, di cui due sono riservati per le linee di terra e di alimentazione. Il resto sono diversi tipi di ingressi e uscite, la maggior parte dei quali ha molteplici possibili utilizzi. Il pinout della scheda mostra cosa può fare ciascuno dei pin.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Tutti i pin esposti possono essere utilizzati come ingressi e uscite generali (GPIO), il che significa che puoi eseguire le funzioni `digitalWrite` e `digitalRead` con essi nel codice.

### ADC

I pin 33 e 32 hanno un convertitore analogico-digitale (ADC), il che significa che puoi usare `analogRead` (e `adcToVoltage`) per leggere la tensione su questo pin.

### DAC

Questi pin possono essere utilizzati per creare una tensione specifica in uscita. Nota che producono la tensione desiderata, tuttavia possono fornire solo una quantità molto piccola di corrente. Questi potrebbero essere usati come punti di riferimento per i sensori, o anche come uscita audio, tuttavia avrai bisogno di un amplificatore (o due). Puoi usare `dacWrite` per scrivere la tensione. C'è anche un esempio nella libreria CanSat per questo.

### SPI

Serial Peripheral Interface (SPI) è una linea dati standard, spesso utilizzata dai breakout Arduino e dispositivi simili. Un dispositivo SPI necessita di quattro pin:

| **Nome Pin**  | **Descrizione**                                              | **Utilizzo**                                                       |
|---------------|--------------------------------------------------------------|--------------------------------------------------------------------|
| **MOSI**      | Main Out Secondary In                                        | Dati inviati dal dispositivo principale (es. CanSat) al dispositivo secondario. |
| **MISO**      | Main In Secondary Out                                        | Dati inviati dal dispositivo secondario al dispositivo principale. |
| **SCK**       | Serial Clock                                                 | Segnale di clock generato dal dispositivo principale per sincronizzare la comunicazione. |
| **SS/CS**     | Secondary Select/Chip Select                                 | Utilizzato dal dispositivo principale per selezionare con quale dispositivo secondario comunicare. |

Qui il principale è la scheda CanSat NeXT, e il secondario è qualsiasi dispositivo con cui vuoi comunicare. I pin MOSI, MISO e SCK possono essere condivisi da più secondari, tuttavia tutti loro necessitano del proprio pin CS. Il pin CS può essere qualsiasi pin GPIO, motivo per cui non ce n'è uno dedicato nel bus.

(Nota: i materiali legacy a volte usano i termini "master" e "slave" per riferirsi ai dispositivi principali e secondari. Questi termini sono ora considerati obsoleti.)

Sulla scheda CanSat NeXT, la scheda SD utilizza la stessa linea SPI dell'intestazione di estensione. Quando si collega un altro dispositivo SPI al bus, questo non importa. Tuttavia, se i pin SPI sono utilizzati come GPIO, la scheda SD è effettivamente disabilitata.

Per utilizzare SPI, spesso è necessario specificare quali pin del processore sono utilizzati. Un esempio potrebbe essere questo, dove i **macro** inclusi nella libreria CanSat sono utilizzati per impostare gli altri pin, e il pin 12 è impostato come chip select.

```Cpp title="Inizializzazione della linea SPI per un sensore"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

I macro `SPI_CLK`, `SPI_MOSI`, e `SPI_MISO` sono sostituiti dal compilatore con 18, 23, e 19, rispettivamente.

### I2C

Inter-Integrated Circuit è un altro protocollo di bus dati popolare, specialmente utilizzato per piccoli sensori integrati, come il sensore di pressione e l'IMU sulla scheda CanSat NeXT.

I2C è comodo in quanto richiede solo due pin, SCL e SDA. Non c'è nemmeno un pin di selezione del chip separato, ma invece i diversi dispositivi sono separati da diversi **indirizzi**, che sono utilizzati per stabilire la comunicazione. In questo modo, puoi avere più dispositivi sullo stesso bus, purché abbiano tutti un indirizzo univoco.

| **Nome Pin** | **Descrizione**          | **Utilizzo**                                                     |
|--------------|--------------------------|------------------------------------------------------------------|
| **SDA**      | Serial Data Line         | Linea dati bidirezionale utilizzata per la comunicazione tra dispositivi principali e secondari. |
| **SCL**      | Serial Clock Line        | Segnale di clock generato dal dispositivo principale per sincronizzare il trasferimento dati con i dispositivi secondari. |

Il barometro e l'IMU sono sullo stesso bus I2C dell'intestazione di estensione. Controlla gli indirizzi di quei dispositivi alla pagina [Sensori a bordo](../CanSat-hardware/on_board_sensors#IMU). Simile a SPI, puoi utilizzare questi pin per collegare altri dispositivi I2C, ma se sono utilizzati come pin GPIO, l'IMU e il barometro sono disabilitati.

Nella programmazione Arduino, I2C è a volte chiamato `Wire`. A differenza di SPI, dove il pinout è spesso specificato per ciascun sensore, I2C è spesso utilizzato in Arduino stabilendo prima una linea dati e poi riferendosi a quella per ciascun sensore. Di seguito è riportato un esempio di come il barometro è inizializzato dalla libreria CanSat NeXT:

```Cpp title="Inizializzazione della seconda linea seriale"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Quindi, prima viene inizializzato un `Wire` specificando i pin I2C corretti. I macro `I2C_SDA` e `I2C_SCL` impostati nella libreria CanSat NeXT sono sostituiti dal compilatore con 22 e 21, rispettivamente.

### UART

Universal asynchronous receiver-transmitter (UART) è in qualche modo il protocollo dati più semplice, poiché invia semplicemente i dati come binari a una frequenza specificata. In quanto tale, è limitato alla comunicazione punto a punto, il che significa che di solito non puoi avere più dispositivi sullo stesso bus.

| **Nome Pin** | **Descrizione**          | **Utilizzo**                                                     |
|--------------|--------------------------|------------------------------------------------------------------|
| **TX**       | Transmit                 | Invia dati dal dispositivo principale al dispositivo secondario. |
| **RX**       | Receive                  | Riceve dati dal dispositivo secondario al dispositivo principale. |

Su CanSat, l'UART nell'intestazione di estensione non è utilizzato per nient'altro. C'è un'altra linea UART tuttavia, ma è utilizzata per la comunicazione USB tra satellite e un computer. Questo è ciò che viene utilizzato quando si inviano dati al `Serial`.

L'altra linea UART può essere inizializzata nel codice in questo modo:

```Cpp title="Inizializzazione della seconda linea seriale"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Alcuni dispositivi utilizzano anche la [modulazione di larghezza di impulso](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) come loro ingresso di controllo. Può anche essere utilizzata per LED dimmerabili o per controllare l'uscita di potenza in alcune situazioni, tra molti altri casi d'uso.

Con Arduino, solo alcuni pin possono essere utilizzati come PWM. Tuttavia, poiché CanSat NeXT è un dispositivo basato su ESP32, tutti i pin di uscita possono essere utilizzati per creare un'uscita PWM. Il PWM è controllato con `analogWrite`.

## E per quanto riguarda (il mio caso d'uso specifico)?

Per la maggior parte dei dispositivi, puoi trovare molte informazioni su internet. Ad esempio, cerca su Google il breakout specifico che hai e utilizza questi documenti per modificare gli esempi che trovi per l'uso con CanSat NeXT. Inoltre, i sensori e altri dispositivi hanno **datasheet**, che dovrebbero avere molte informazioni su come utilizzare il dispositivo, anche se a volte possono essere un po' difficili da decifrare. Se ritieni che ci sia qualcosa che questa pagina dovrebbe aver trattato, ti prego di farmelo sapere a samuli@kitsat.fi.

Nella prossima e ultima lezione, discuteremo come preparare il tuo satellite per il lancio.

[Clicca qui per la prossima lezione!](./lesson12)