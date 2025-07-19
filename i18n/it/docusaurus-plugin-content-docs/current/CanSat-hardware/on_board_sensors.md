---
sidebar_position: 1
---

# Sensori Integrati

Questo articolo introduce i sensori integrati nella scheda principale del CanSat NeXT. L'uso dei sensori è trattato nella documentazione software, mentre questo articolo fornisce maggiori informazioni sui sensori stessi.

Ci sono tre sensori integrati sulla scheda principale del CanSat NeXT. Questi sono l'IMU LSM6DS3, il sensore di pressione LPS22HB e l'LDR. Inoltre, la scheda ha uno slot passante per aggiungere un termistore esterno. Poiché l'LPS22HB ha già capacità di misurazione sia della pressione che della temperatura, teoricamente è sufficiente per soddisfare i criteri della missione primaria delle competizioni CanSat da solo. Tuttavia, poiché misura la temperatura di giunzione interna, o fondamentalmente la temperatura del PCB in quel punto, non è una buona misurazione della temperatura atmosferica nella maggior parte delle configurazioni. Inoltre, la misurazione assoluta del sensore di pressione può essere supportata dai dati aggiuntivi dell'accelerometro IMU. L'LDR è stato aggiunto principalmente per aiutare gli studenti a comprendere i concetti relativi ai sensori analogici poiché la risposta agli stimoli è quasi istantanea, mentre un termistore impiega tempo a riscaldarsi e raffreddarsi. Detto ciò, può anche supportare le missioni creative che gli studenti inventeranno, proprio come l'accelerometro e il giroscopio degli IMU. Inoltre, oltre al sensore integrato, il CanSat NeXT incoraggia l'uso di sensori aggiuntivi tramite l'interfaccia di estensione.

## Unità di Misura Inerziale

L'IMU, LSM6DS3 di STMicroelectronics è un dispositivo sensore MEMS in stile SiP (system-in-package), che integra un accelerometro, un giroscopio e l'elettronica di lettura in un piccolo pacchetto. Il sensore supporta le interfacce seriali SPI e I2C, e include anche un sensore di temperatura interno.

![IMU sulla scheda CanSat NeXT](./img/imu.png)

L'LSM6DS3 ha gamme di misurazione dell'accelerazione commutabili di ±2/±4/±8/±16 G e gamme di misurazione della velocità angolare di ±125/±250/±500/±1000/±2000 deg/s. L'uso di una gamma più alta diminuisce anche la risoluzione del dispositivo.

Nel CanSat NeXT, l'LSM6DS3 è utilizzato in modalità I2C. L'indirizzo I2C è 1101010b (0x6A), ma la prossima versione aggiungerà il supporto per modificare l'hardware per cambiare l'indirizzo a 1101011b (0x6B) se un utente avanzato ha bisogno di utilizzare l'indirizzo originale per qualcos'altro.

Le gamme di misurazione saranno impostate al massimo per impostazione predefinita nella libreria per catturare la maggior parte dei dati dal lancio violento del razzo. Le gamme di dati sono anche modificabili dall'utente.

## Barometro

Il sensore di pressione LPS22HB di STMicroelectronics è un altro dispositivo MEMS SiP, progettato per la misurazione della pressione da 260-1260 hPa. La gamma in cui riporta i dati è significativamente più ampia, ma l'accuratezza delle misurazioni al di fuori di quella gamma è discutibile. I sensori di pressione MEMS funzionano misurando i cambiamenti piezoresistivi nel diaframma del sensore. Poiché la temperatura influisce sulla resistenza dell'elemento piezoelettrico, deve essere compensata. Per abilitare ciò, il chip ha anche un sensore di temperatura di giunzione relativamente accurato proprio accanto all'elemento piezoresistivo. Questa misurazione della temperatura può anche essere letta dal sensore, ma bisogna tenere a mente che è una misurazione della temperatura interna del chip, non dell'aria circostante.

![Barometro sulla scheda CanSat NeXT](./img/barometer.png)

Simile all'IMU, l'LPS22HB può anche essere comunicato utilizzando l'interfaccia SPI o I2C. Nel CanSat NeXT, è collegato alla stessa interfaccia I2C dell'IMU. L'indirizzo I2C dell'LPS22HB è 1011100b (0x5C), ma aggiungeremo il supporto per cambiarlo a 0x5D se desiderato.

## Convertitore Analogico-Digitale

Questo si riferisce alla misurazione della tensione utilizzando il comando analogRead().

Il convertitore analogico-digitale (ADC) a 12 bit nell'ESP32 è notoriamente non lineare. Questo non importa per la maggior parte delle applicazioni, come usarlo per rilevare cambiamenti di temperatura o cambiamenti nella resistenza dell'LDR, tuttavia fare misurazioni assolute della tensione della batteria o della resistenza NTC può essere un po' complicato. Un modo per aggirare questo è una calibrazione accurata, che fornirebbe dati sufficientemente accurati per la temperatura, ad esempio. Tuttavia, la libreria CanSat fornisce anche una funzione di correzione calibrata. La funzione implementa una correzione polinomiale di terzo ordine per l'ADC, correlando la lettura dell'ADC con la tensione effettiva presente sul pin ADC. La funzione di correzione è

$$V = -1.907217e \times 10^{-11} \times a^3 + 8.368612 \times 10^{-8} \times a^2 + 7.081732e \times 10^{-4} \times a + 0.1572375$$

Dove V è la tensione misurata e a è la lettura ADC a 12 bit da analogRead(). La funzione è inclusa nella libreria ed è chiamata adcToVoltage. Usando questa formula, l'errore di lettura dell'ADC è inferiore all'1% all'interno di un intervallo di tensione di 0.1 V - 3.2 V.

## Resistenza Dipendente dalla Luce

La scheda principale del CanSat NeXT incorpora un LDR nel set di sensori. L'LDR è un tipo speciale di resistenza, in quanto la resistenza varia con l'illuminazione. Le caratteristiche esatte possono variare, ma con l'LDR che stiamo attualmente utilizzando, la resistenza è di 5-10 kΩ a 10 lux e 300 kΩ al buio.

![LDR sulla scheda CanSat NeXT](./img/LDR.png)

![Schema che mostra il divisore resistivo dell'LDR](./img/division.png)

Il modo in cui viene utilizzato nel CanSat NeXT è che una tensione di 3.3 V viene applicata a un resistore di confronto dal MCU. Questo fa sì che la tensione a LDR_OUT sia

$$V_{LDR} = V_{EN} \frac{R402}{R401+R402} $$.

E poiché la resistenza R402 cambia, anche la tensione a LDR_OUT cambierà. Questa tensione può essere letta con l'ADC dell'ESP32 e poi correlata alla resistenza dell'LDR. In pratica, tuttavia, di solito con gli LDR siamo interessati al cambiamento piuttosto che al valore assoluto. Ad esempio, di solito è sufficiente rilevare un grande cambiamento nella tensione quando il dispositivo è esposto alla luce dopo essere stato dispiegato dal razzo, ad esempio. I valori di soglia sono di solito impostati sperimentalmente, piuttosto che calcolati analiticamente. Si noti che nel CanSat NeXT, è necessario abilitare i sensori analogici integrati scrivendo il pin MEAS_EN su HIGH. Questo è mostrato nei codici di esempio.

## Termistore

Il circuito utilizzato per leggere il termistore esterno è molto simile al circuito di lettura dell'LDR. La stessa logica si applica, che quando una tensione è applicata al resistore di confronto, la tensione a TEMP_OUT cambia secondo

$$V_{TEMP} = V_{EN} \frac{TH501}{TH501+R501} $$.

In questo caso, tuttavia, siamo di solito interessati al valore assoluto della resistenza del termistore. Pertanto, la VoltageConversion è utile, poiché linearizza le letture dell'ADC e calcola anche direttamente il V_temp. In questo modo, l'utente può calcolare la resistenza del termistore nel codice. Il valore dovrebbe comunque essere correlato con la temperatura utilizzando misurazioni, sebbene il datasheet del termistore potrebbe anche includere alcuni indizi su come calcolare la temperatura dalla resistenza. Si noti che se si fa tutto analiticamente, si dovrebbe anche tenere conto della varianza di resistenza di R501. Questo è fatto più facilmente misurando la resistenza con un multimetro, invece di assumere che sia 10 000 ohm.

Il resistore di confronto sul PCB è relativamente stabile su un intervallo di temperatura, tuttavia cambia anche leggermente. Se sono desiderate letture di temperatura molto accurate, questo dovrebbe essere compensato. La misurazione della temperatura di giunzione dal sensore di pressione può essere utilizzata per questo. Detto ciò, non è assolutamente richiesto per le competizioni CanSat. Per chi è interessato, il coefficiente termico di R501 è riportato dal produttore come 100 PPM/°C.

![Schema che mostra il divisore resistivo del termistore](./img/thermistor.png)

Mentre la temperatura del barometro riflette principalmente la temperatura della scheda stessa, il termistore può essere montato in modo tale da reagire ai cambiamenti di temperatura al di fuori della scheda, anche al di fuori del contenitore. È anche possibile aggiungere fili per allontanarlo ulteriormente. Se verrà utilizzato, il termistore può essere saldato nella posizione appropriata sulla scheda CanSat NeXT. La polarizzazione non importa, cioè può essere montato in entrambi i modi.

![LDR sulla scheda CanSat NeXT](./img/thermistor_holes.png)