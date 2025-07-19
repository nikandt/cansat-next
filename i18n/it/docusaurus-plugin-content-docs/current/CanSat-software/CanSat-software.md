---
sidebar_position: 3
---

# Software CanSat NeXT

Il modo consigliato per utilizzare CanSat NeXT è con la libreria Arduino CanSat NeXT, disponibile dal gestore delle librerie di Arduino e su Github. Prima di installare la libreria CanSat NeXT, è necessario installare l'IDE Arduino e il supporto per la scheda ESP32.

## Iniziare

### Installare l'IDE Arduino

Se non l'hai già fatto, scarica e installa l'IDE Arduino dal sito ufficiale https://www.arduino.cc/en/software.

### Aggiungere il supporto ESP32

CanSat NeXT si basa sul microcontrollore ESP32, che non è incluso nell'installazione predefinita dell'IDE Arduino. Se non hai mai utilizzato microcontrollori ESP32 con Arduino prima d'ora, il supporto per la scheda deve essere installato prima. Può essere fatto nell'IDE Arduino da *Strumenti->Scheda->Gestore schede* (o semplicemente premi (Ctrl+Shift+B) ovunque). Nel gestore delle schede, cerca ESP32 e installa l'esp32 di Espressif.

### Installare la libreria CanSat NeXT

La libreria CanSat NeXT può essere scaricata dal Gestore delle Librerie dell'IDE Arduino da *Sketch > Includi Librerie > Gestisci Librerie*.

![Aggiunta di nuove librerie con l'IDE Arduino.](./img/LibraryManager_1.png)

*Fonte immagine: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

Nella barra di ricerca del Gestore delle Librerie, digita "CanSatNeXT" e scegli "Installa". Se l'IDE chiede se vuoi installare anche le dipendenze, clicca su sì.

## Installazione manuale

La libreria è anche ospitata nel proprio [repository GitHub](https://github.com/netnspace/CanSatNeXT_library) e può essere clonata o scaricata e installata dal sorgente.

In questo caso, devi estrarre la libreria e spostarla nella directory dove l'IDE Arduino può trovarla. Puoi trovare la posizione esatta in *File > Preferenze > Sketchbook*.

![Aggiunta di nuove librerie con l'IDE Arduino.](./img/LibraryManager_2.png)

*Fonte immagine: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Collegamento al PC

Dopo aver installato la libreria software CanSat NeXT, puoi collegare il CanSat NeXT al tuo computer. Nel caso in cui non venga rilevato, potrebbe essere necessario installare prima i driver necessari. L'installazione dei driver viene eseguita automaticamente nella maggior parte dei casi, tuttavia, su alcuni PC deve essere eseguita manualmente. I driver possono essere trovati sul sito di Silicon Labs: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Per ulteriore aiuto con la configurazione dell'ESP32, consulta il seguente tutorial: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Sei pronto per iniziare!

Ora puoi trovare esempi di CanSatNeXT dall'IDE Arduino da *File->Esempi->CanSatNeXT*.