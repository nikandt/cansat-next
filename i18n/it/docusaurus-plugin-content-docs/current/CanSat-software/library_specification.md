---
sidebar_position: 1
---

# Specifiche della libreria

# Funzioni

Puoi utilizzare tutte le funzionalità regolari di Arduino con CanSat NeXT, così come qualsiasi libreria Arduino. Le funzioni di Arduino possono essere trovate qui: https://www.arduino.cc/reference/en/.

La libreria CanSat NeXT aggiunge diverse funzioni facili da usare per utilizzare le diverse risorse a bordo, come sensori, radio e la scheda SD. La libreria viene fornita con una serie di sketch di esempio che mostrano come utilizzare queste funzionalità. L'elenco seguente mostra anche tutte le funzioni disponibili.

## Funzioni di Inizializzazione del Sistema

### CanSatInit

| Funzione             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Restituisce 0 se l'inizializzazione è stata completata con successo, o un valore diverso da zero se c'è stato un errore. |
| **Parametri**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Indirizzo MAC a 6 byte condiviso dal satellite e dalla stazione di terra. Questo è un parametro opzionale - quando non viene fornito, la radio non viene inizializzata. Utilizzato nello sketch di esempio: Tutti |
| **Descrizione**      | Questo comando si trova nel `setup()` di quasi tutti gli script CanSat NeXT. Viene utilizzato per inizializzare l'hardware CanSatNeXT, inclusi i sensori e la scheda SD. Inoltre, se viene fornito il `macAddress`, avvia la radio e inizia ad ascoltare i messaggi in arrivo. L'indirizzo MAC dovrebbe essere condiviso dalla stazione di terra e dal satellite. L'indirizzo MAC può essere scelto liberamente, ma ci sono alcuni indirizzi non validi come tutti i byte `0x00`, `0x01` e `0xFF`. Se la funzione di inizializzazione viene chiamata con un indirizzo non valido, segnalerà il problema alla Serial. |

### CanSatInit (specifica semplificata dell'indirizzo MAC)

| Funzione             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Restituisce 0 se l'inizializzazione è stata completata con successo, o un valore diverso da zero se c'è stato un errore. |
| **Parametri**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Ultimo byte dell'indirizzo MAC, utilizzato per differenziare tra diverse coppie CanSat-GS. |
| **Descrizione**      | Questa è una versione semplificata del CanSatInit con indirizzo MAC, che imposta automaticamente gli altri byte su un valore noto sicuro. Questo consente agli utenti di differenziare le loro coppie Trasmettitore-Ricevitore con un solo valore, che può essere 0-255.|

### GroundStationInit

| Funzione             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Ritorna 0 se l'inizializzazione ha avuto successo, o un valore diverso da zero in caso di errore. |
| **Parametri**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Indirizzo MAC a 6 byte condiviso dal satellite e dalla stazione di terra. |
| **Usato nell'esempio** | Ricezione stazione di terra                                       |
| **Descrizione**      | Questo è un parente stretto della funzione CanSatInit, ma richiede sempre l'indirizzo MAC. Questa funzione inizializza solo la radio, non altri sistemi. La stazione di terra può essere qualsiasi scheda ESP32, inclusa qualsiasi devboard o anche un'altra scheda CanSat NeXT. |

### GroundStationInit (specifica semplificata dell'indirizzo MAC)

| Funzione             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Ritorna 0 se l'inizializzazione ha avuto successo, o un valore diverso da zero in caso di errore. |
| **Parametri**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Ultimo byte dell'indirizzo MAC, usato per differenziare tra diverse coppie CanSat-GS. |
| **Descrizione**      | Questa è una versione semplificata della GroundStationInit con indirizzo MAC, che imposta automaticamente gli altri byte su un valore sicuro noto. Questo consente agli utenti di differenziare le loro coppie Trasmettitore-Ricevitore con un solo valore, che può essere da 0 a 255.|

## Funzioni IMU

### readAcceleration

| Funzione             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Ritorna 0 se la misurazione ha avuto successo.                           |
| **Parametri**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Indirizzo di una variabile float dove verranno memorizzati i dati dell'asse x. |
| **Usato nell'esempio** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere l'accelerazione dall'IMU a bordo. I parametri sono indirizzi a variabili float per ciascun asse. L'esempio IMU mostra come utilizzare questa funzione per leggere l'accelerazione. L'accelerazione è restituita in unità di G (9.81 m/s). |

### readAccelX

| Funzione             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                          |
| **Valore di Ritorno**| Ritorna l'accelerazione lineare sull'asse X in unità di G.                           |
| **Usato nell'esempio** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere l'accelerazione dall'IMU a bordo su un asse specifico. L'esempio IMU mostra come utilizzare questa funzione per leggere l'accelerazione. L'accelerazione è restituita in unità di G (9.81 m/s). |

### readAccelY

| Funzione             | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                          |
| **Valore di Ritorno**| Restituisce l'accelerazione lineare sull'asse Y in unità di G.                           |
| **Usato nell'esempio di sketch** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere l'accelerazione dall'IMU integrato su un asse specifico. L'esempio IMU mostra come utilizzare questa funzione per leggere l'accelerazione. L'accelerazione è restituita in unità di G (9.81 m/s). |

### readAccelZ

| Funzione             | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                          |
| **Valore di Ritorno**| Restituisce l'accelerazione lineare sull'asse Z in unità di G.                           |
| **Usato nell'esempio di sketch** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere l'accelerazione dall'IMU integrato su un asse specifico. L'esempio IMU mostra come utilizzare questa funzione per leggere l'accelerazione. L'accelerazione è restituita in unità di G (9.81 m/s). |

### readGyro

| Funzione             | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Restituisce 0 se la misurazione è stata effettuata con successo.                           |
| **Parametri**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Indirizzo di una variabile float dove verranno memorizzati i dati dell'asse x. |
| **Usato nell'esempio di sketch** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere la velocità angolare dall'IMU integrato. I parametri sono indirizzi a variabili float per ciascun asse. L'esempio IMU mostra come utilizzare questa funzione per leggere la velocità angolare. La velocità angolare è restituita in unità mrad/s. |

### readGyroX

| Funzione             | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                          |
| **Valore di Ritorno**| Restituisce la velocità angolare sull'asse X in unità di mrad/s.                           |
| **Usato nell'esempio di sketch** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere la velocità angolare dall'IMU integrato su un asse specifico. I parametri sono indirizzi a variabili float per ciascun asse. La velocità angolare è restituita in unità mrad/s. |

### readGyroY

| Funzione             | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                          |
| **Valore di Ritorno**| Restituisce la velocità angolare sull'asse Y in unità di mrad/s.                           |
| **Usato nell'esempio di sketch** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere la velocità angolare dall'IMU integrato su un asse specifico. I parametri sono indirizzi a variabili float per ciascun asse. La velocità angolare è restituita in unità mrad/s. |

### readGyroZ

| Funzione             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                          |
| **Valore di Ritorno**| Restituisce la velocità angolare sull'asse Z in unità di mrad/s.  |
| **Usato nello sketch di esempio** | IMU                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere la velocità angolare dall'IMU integrato su un asse specifico. I parametri sono indirizzi a variabili float per ciascun asse. La velocità angolare è restituita in unità di mrad/s. |

## Funzioni del Barometro

### readPressure

| Funzione             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                            |
| **Valore di Ritorno**| Pressione in mbar                                                  |
| **Parametri**        | Nessuno                                                            |
| **Usato nello sketch di esempio** | Baro                                                 |
| **Descrizione**      | Questa funzione restituisce la pressione come riportato dal barometro integrato. La pressione è in unità di millibar. |

### readTemperature

| Funzione             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                            |
| **Valore di Ritorno**| Temperatura in Celsius                                             |
| **Parametri**        | Nessuno                                                            |
| **Usato nello sketch di esempio** | Baro                                                 |
| **Descrizione**      | Questa funzione restituisce la temperatura come riportato dal barometro integrato. L'unità della lettura è Celsius. Nota che questa è la temperatura interna misurata dal barometro, quindi potrebbe non riflettere la temperatura esterna. |

## Funzioni della Scheda SD / File System

### SDCardPresent

| Funzione             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `bool`                                                             |
| **Valore di Ritorno**| Restituisce true se rileva una scheda SD, false altrimenti.        |
| **Parametri**        | Nessuno                                                            |
| **Usato nello sketch di esempio** | SD_advanced                                         |
| **Descrizione**      | Questa funzione può essere utilizzata per verificare se la scheda SD è meccanicamente presente. Il connettore della scheda SD ha un interruttore meccanico, che viene letto quando questa funzione viene chiamata. Restituisce true o false a seconda che la scheda SD sia rilevata o meno. |

### appendFile

| Function             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Restituisce 0 se la scrittura è stata completata con successo.    |
| **Parameters**       |                                                                    |
|                      | `String filename`: Indirizzo del file a cui aggiungere dati. Se il file non esiste, viene creato. |
|                      | `T data`: Dati da aggiungere alla fine del file.                   |
| **Used in example sketch** | SD_write                                               |
| **Description**      | Questa è la funzione di scrittura di base utilizzata per memorizzare le letture sulla scheda SD. |

### printFileSystem

| Function             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       | Nessuno                                                            |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Questa è una piccola funzione di supporto per stampare i nomi dei file e delle cartelle presenti sulla scheda SD. Può essere utilizzata nello sviluppo. |

### newDir

| Function             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Percorso della nuova directory. Se esiste già, non viene fatto nulla. |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Utilizzata per creare nuove directory sulla scheda SD.             |

### deleteDir

| Function             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Percorso della directory da eliminare.              |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Utilizzata per eliminare directory sulla scheda SD.                |

### fileExists

| Function             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `bool`                                                             |
| **Return Value**     | Restituisce true se il file esiste.                                |
| **Parameters**       |                                                                    |
|                      | `String path`: Percorso al file.                                   |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Questa funzione può essere utilizzata per verificare se un file esiste sulla scheda SD. |

### fileSize

| Funzione             | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint32_t`                                                         |
| **Valore di Ritorno**| Dimensione del file in byte.                                       |
| **Parametri**        |                                                                    |
|                      | `String path`: Percorso al file.                                   |
| **Usato nell'esempio di sketch** | SD_advanced                                           |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere la dimensione di un file sulla scheda SD. |

### writeFile

| Funzione             | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| Ritorna 0 se la scrittura è stata eseguita con successo.            |
| **Parametri**        |                                                                    |
|                      | `String filename`: Indirizzo del file da scrivere.                  |
|                      | `T data`: Dati da scrivere nel file.                               |
| **Usato nell'esempio di sketch** | SD_advanced                                           |
| **Descrizione**      | Questa funzione è simile a `appendFile()`, ma sovrascrive i dati esistenti sulla scheda SD. Per l'archiviazione dei dati, dovrebbe essere usato `appendFile`. Questa funzione può essere utile per memorizzare impostazioni, ad esempio. |

### readFile

| Funzione             | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `String`                                                           |
| **Valore di Ritorno**| Tutto il contenuto nel file.                                       |
| **Parametri**        |                                                                    |
|                      | `String path`: Percorso al file.                                   |
| **Usato nell'esempio di sketch** | SD_advanced                                           |
| **Descrizione**      | Questa funzione può essere utilizzata per leggere tutti i dati da un file in una variabile. Tentare di leggere file di grandi dimensioni può causare problemi, ma va bene per file piccoli, come file di configurazione o impostazioni. |

### renameFile

| Funzione             | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                             |
| **Parametri**        |                                                                    |
|                      | `String oldpath`: Percorso originale al file.                      |
|                      | `String newpath`: Nuovo percorso del file.                         |
| **Usato nell'esempio di sketch** | SD_advanced                                           |
| **Descrizione**      | Questa funzione può essere utilizzata per rinominare o spostare file sulla scheda SD. |

### deleteFile

| Funzione             | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                             |
| **Parametri**        |                                                                    |
|                      | `String path`: Percorso del file da eliminare.                     |
| **Usato nell'esempio di sketch** | SD_advanced                                                |
| **Descrizione**      | Questa funzione può essere utilizzata per eliminare file dalla scheda SD. |

## Funzioni Radio

### onDataReceived

| Funzione             | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                             |
| **Parametri**        |                                                                    |
|                      | `String data`: Dati ricevuti come una Stringa di Arduino.          |
| **Usato nell'esempio di sketch** | Groundstation_receive                                      |
| **Descrizione**      | Questa è una funzione di callback che viene chiamata quando i dati vengono ricevuti. Il codice utente dovrebbe definire questa funzione, e il CanSat NeXT la chiamerà automaticamente quando i dati vengono ricevuti. |

### onBinaryDataReceived

| Funzione             | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                             |
| **Parametri**        |                                                                    |
|                      | `const uint8_t *data`: Dati ricevuti come un array di uint8_t.     |
|                      | `uint16_t len`: Lunghezza dei dati ricevuti in byte.               |
| **Usato nell'esempio di sketch** | Nessuno                                                 |
| **Descrizione**      | Questa è simile alla funzione `onDataReceived`, ma i dati sono forniti come binari invece che come oggetto String. Questa è fornita per utenti avanzati che trovano l'oggetto String limitante. |

### onDataSent

| Funzione             | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                             |
| **Parametri**        |                                                                    |
|                      | `const bool success`: Booleano che indica se i dati sono stati inviati con successo. |
| **Usato nell'esempio di sketch** | Nessuno                                                 |
| **Descrizione**      | Questa è un'altra funzione di callback che può essere aggiunta al codice utente se necessario. Può essere utilizzata per verificare se la ricezione è stata riconosciuta da un'altra radio. |

### getRSSI

| Funzione             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `int8_t`                                                          |
| **Valore di Ritorno**| RSSI dell'ultimo messaggio ricevuto. Ritorna 1 se non sono stati ricevuti messaggi dall'avvio.                           |
| **Usato nell'esempio di sketch** | Nessuno                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per monitorare la potenza del segnale della ricezione. Può essere utilizzata per testare le antenne o valutare la portata della radio. Il valore è espresso in [dBm](https://en.wikipedia.org/wiki/DBm), tuttavia la scala non è accurata. |

### sendData (variante String)

| Funzione             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| 0 se i dati sono stati inviati (non indica l'avvenuta ricezione).  |
| **Parametri**        |                                                                    |
|                      | `T data`: Dati da inviare. Qualsiasi tipo di dati può essere utilizzato, ma viene convertito internamente in una stringa.                  |
| **Usato nello sketch di esempio** | Send_data                                             |
| **Descrizione**      | Questa è la funzione principale per l'invio di dati tra la stazione a terra e il satellite. Nota che il valore di ritorno non indica se i dati sono stati effettivamente ricevuti, ma solo che sono stati inviati. Il callback `onDataSent` può essere utilizzato per verificare se i dati sono stati ricevuti dall'altra parte. |

### sendData (Variante binaria) {#sendData-binary}

| Funzione             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                          |
| **Valore di Ritorno**| 0 se i dati sono stati inviati (non indica l'avvenuta ricezione).  |
| **Parametri**        |                                                                    |
|                      | `T* data`: Dati da inviare.                    |
|                      | `uint16_t len`: Lunghezza dei dati in byte.                      |
| **Usato nello sketch di esempio** | Nessuno                                                 |
| **Descrizione**      | Una variante binaria della funzione `sendData`, fornita per utenti avanzati che si sentono limitati dall'oggetto String. |

### getRSSI

| Funzione             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `int8_t`                                                          |
| **Valore di Ritorno**| RSSI dell'ultimo messaggio ricevuto. Ritorna 1 se non sono stati ricevuti messaggi dall'avvio.                           |
| **Usato nello sketch di esempio** | Nessuno                                                  |
| **Descrizione**      | Questa funzione può essere utilizzata per monitorare la potenza del segnale della ricezione. Può essere utilizzata per testare le antenne o per valutare la portata radio. Il valore è espresso in [dBm](https://en.wikipedia.org/wiki/DBm), tuttavia la scala non è accurata. 

### setRadioChannel

| Funzione             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                          |
| **Valore di Ritorno**| Nessuno                                                          |
| **Parametri**        | `uint8_t newChannel`: Numero del canale Wi-Fi desiderato (1–11). Qualsiasi valore superiore a 11 sarà limitato a 11. |
| **Usato nello sketch di esempio** | Nessuno                                                      |
| **Descrizione**      | Imposta il canale di comunicazione ESP-NOW. Il nuovo canale deve essere all'interno dell'intervallo dei canali Wi-Fi standard (1–11), che corrispondono a frequenze a partire da 2.412 GHz con passi di 5 MHz. Il canale 1 è 2.412, il canale 2 è 2.417 e così via. Chiamare questa funzione prima dell'inizializzazione della libreria. Il canale predefinito è 1. |

### getRadioChannel

| Funzione             | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Tipo di Ritorno**  | `uint8_t`                                                       |
| **Valore di Ritorno**| Il canale Wi-Fi primario attuale. Restituisce 0 se c'è un errore nel recupero del canale. |
| **Usato nello sketch di esempio** | Nessuno                                           |
| **Descrizione**      | Recupera il canale Wi-Fi primario attualmente in uso. Questa funzione funziona solo dopo l'inizializzazione della libreria. |

### printRadioFrequency

| Funzione             | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Tipo di Ritorno**  | `void`                                                          |
| **Valore di Ritorno**| Nessuno                                                         |
| **Usato nello sketch di esempio** | Nessuno                                           |
| **Descrizione**      | Calcola e stampa la frequenza attuale in GHz basata sul canale Wi-Fi attivo. Questa funzione funziona solo dopo l'inizializzazione della libreria. |


## Funzioni ADC

### adcToVoltage

| Funzione             | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                            |
| **Valore di Ritorno**| Tensione convertita in volt.                                       |
| **Parametri**        |                                                                    |
|                      | `int value`: Lettura ADC da convertire in tensione.               |
| **Usato nello sketch di esempio** | AccurateAnalogRead                                    |
| **Descrizione**      | Questa funzione converte una lettura ADC in tensione utilizzando un polinomio calibrato di terzo ordine per una conversione più lineare. Nota che questa funzione calcola la tensione al pin di ingresso, quindi per calcolare la tensione della batteria, è necessario considerare anche la rete di resistenze. |

### analogReadVoltage

| Funzione             | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo di Ritorno**  | `float`                                                            |
| **Valore di Ritorno**| Tensione ADC in volt.                                             |
| **Parametri**        |                                                                    |
|                      | `int pin`: Pin da leggere.                                        |
| **Usato nello sketch di esempio** | AccurateAnalogRead                                    |
| **Descrizione**      | Questa funzione legge la tensione direttamente invece di usare `analogRead` e converte internamente la lettura in tensione usando `adcToVoltage`. |