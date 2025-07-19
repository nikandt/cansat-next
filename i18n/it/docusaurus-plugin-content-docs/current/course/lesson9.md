---
sidebar_position: 10
---

# Lezione 9: Unità e Zeri

Finora abbiamo utilizzato il testo per memorizzare o trasmettere dati. Sebbene questo renda facile l'interpretazione, è anche inefficiente. I computer utilizzano internamente dati **binari**, dove i dati sono memorizzati come insiemi di unità e zeri. In questa lezione, esamineremo i modi di utilizzare i dati binari con CanSat NeXT e discuteremo dove e perché potrebbe essere utile farlo.

:::info

## Diversi tipi di dati

In forma binaria, tutti i dati—che siano numeri, testo o letture di sensori—sono rappresentati come una serie di unità e zeri. Diversi tipi di dati utilizzano diverse quantità di memoria e interpretano i valori binari in modi specifici. Rivediamo brevemente alcuni tipi di dati comuni e come sono memorizzati in binario:

- **Integer (int)**:  
  Gli interi rappresentano numeri interi. In un intero a 16 bit, ad esempio, 16 unità e zeri possono rappresentare valori da \(-32,768\) a \(32,767\). I numeri negativi sono memorizzati utilizzando un metodo chiamato **complemento a due**.

- **Unsigned Integer (uint)**:  
  Gli interi senza segno rappresentano numeri non negativi. Un intero senza segno a 16 bit può memorizzare valori da \(0\) a \(65,535\), poiché nessun bit è riservato per il segno.

- **Float**:  
  I numeri in virgola mobile rappresentano valori decimali. In un float a 32 bit, parte dei bit rappresenta il segno, l'esponente e la mantissa, permettendo ai computer di gestire numeri molto grandi e molto piccoli. È essenzialmente una forma binaria della [notazione scientifica](https://en.wikipedia.org/wiki/Scientific_notation).

- **Caratteri (char)**:  
  I caratteri sono memorizzati utilizzando schemi di codifica come **ASCII** o **UTF-8**. Ogni carattere corrisponde a un valore binario specifico (ad esempio, 'A' in ASCII è memorizzato come `01000001`).

- **Stringhe**:  
  Le stringhe sono semplicemente collezioni di caratteri. Ogni carattere in una stringa è memorizzato in sequenza come valori binari individuali. Ad esempio, la stringa `"CanSat"` sarebbe memorizzata come una serie di caratteri come `01000011 01100001 01101110 01010011 01100001 01110100` (ciascuno rappresentante 'C', 'a', 'n', 'S', 'a', 't'). Come puoi vedere, rappresentare i numeri come stringhe, come abbiamo fatto finora, è meno efficiente rispetto a memorizzarli come valori binari.

- **Array e `uint8_t`**:  
  Quando si lavora con dati binari, è comune utilizzare un array di `uint8_t` per memorizzare e gestire dati grezzi in byte. Il tipo `uint8_t` rappresenta un intero senza segno a 8 bit, che può contenere valori da 0 a 255. Poiché ogni byte è composto da 8 bit, questo tipo è ben adatto per contenere dati binari.
  Gli array di `uint8_t` sono spesso utilizzati per creare buffer di byte per contenere sequenze di dati binari grezzi (ad esempio, pacchetti). Alcune persone preferiscono `char` o altre variabili, ma non importa quale si utilizzi finché la variabile ha una lunghezza di 1 byte.
:::

## Trasmissione di dati binari

Iniziamo caricando un semplice programma sul CanSat e concentriamoci di più sul lato della stazione di terra. Ecco un semplice codice che trasmette una lettura in formato binario:

```Cpp title="Trasmetti dati LDR come binario"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

Il codice sembra altrimenti molto familiare, ma `sendData` ora prende due argomenti invece di uno solo - prima, l'**indirizzo di memoria** dei dati da trasmettere, e poi la **lunghezza** dei dati da trasmettere. In questo caso semplificato, utilizziamo solo l'indirizzo e la lunghezza della variabile `LDR_voltage`.

Se provi a ricevere questo con il tipico codice della stazione di terra, stamperà solo caratteri illeggibili, poiché sta cercando di interpretare i dati binari come se fossero una stringa. Invece, dovremo specificare alla stazione di terra cosa includono i dati.

Per prima cosa, verifichiamo quanto sono effettivamente lunghi i dati che stiamo ricevendo.

```Cpp title="Verifica la lunghezza dei dati ricevuti"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Ricevuti ");
  Serial.print(len);
  Serial.println(" byte");
}
```

Ogni volta che il satellite trasmette, riceviamo 4 byte sulla stazione di terra. Poiché stiamo trasmettendo un float a 32 bit, sembra corretto.

Per leggere i dati, dobbiamo prendere il buffer di dati binari dal flusso di input e copiare i dati in una variabile adatta. Per questo semplice caso, possiamo fare così:

```Cpp title="Memorizza i dati in una variabile"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Ricevuti ");
  Serial.print(len);
  Serial.println(" byte");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Dati: ");
  Serial.println(LDR_reading);
}
```

Per prima cosa introduciamo la variabile `LDR_reading` per contenere i dati che *sappiamo* di avere nel buffer. Poi usiamo `memcpy` (copia di memoria) per copiare i dati binari dal buffer `data` nell'**indirizzo di memoria** di `LDR_reading`. Questo assicura che i dati siano trasferiti esattamente come erano memorizzati, mantenendo lo stesso formato del lato satellite.

Ora, se stampiamo i dati, è come se li leggessimo direttamente sul lato GS. Non è più testo come era prima, ma gli stessi dati effettivi che abbiamo letto sul lato satellite. Ora possiamo facilmente elaborarli sul lato GS come vogliamo.

## Creare il nostro protocollo

Il vero potere del trasferimento di dati binari diventa evidente quando abbiamo più dati da trasmettere. Tuttavia, dobbiamo ancora assicurarci che il satellite e la stazione di terra concordino su quale byte rappresenta cosa. Questo è chiamato **protocollo di pacchetto**.

Un protocollo di pacchetto definisce la struttura dei dati trasmessi, specificando come impacchettare più pezzi di dati in una singola trasmissione e come il ricevitore dovrebbe interpretare i byte in arrivo. Costruiamo un semplice protocollo che trasmette più letture di sensori in modo strutturato.

Per prima cosa, leggiamo tutti i canali dell'accelerometro e del giroscopio e creiamo il **pacchetto dati** dalle letture.

```Cpp title="Trasmetti dati LDR come binario"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Crea un array per contenere i dati
  uint8_t packet[24];

  // Copia i dati nel pacchetto
  memcpy(&packet[0], &ax, 4);  // Copia accelerometro X nei byte 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copia giroscopio Z nei byte 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Qui, prima leggiamo i dati proprio come nella Lezione 3, ma poi **codifichiamo** i dati in un pacchetto dati. Prima, viene creato il buffer effettivo, che è solo un insieme vuoto di 24 byte. Ogni variabile di dati può quindi essere scritta in questo buffer vuoto con `memcpy`. Poiché stiamo usando `float`, i dati hanno una lunghezza di 4 byte. Se non sei sicuro della lunghezza di una variabile, puoi sempre verificarla con `sizeof(variable)`.

:::tip[Exercise]

Crea un software per la stazione di terra per interpretare e stampare i dati dell'accelerometro e del giroscopio.

:::

## Memorizzazione di dati binari su scheda SD

Scrivere dati come binari sulla scheda SD può essere utile quando si lavora con grandi quantità di dati, poiché la memorizzazione binaria è più compatta ed efficiente rispetto al testo. Questo ti permette di salvare più dati con meno spazio di archiviazione, il che può essere utile in un sistema con vincoli di memoria.

Tuttavia, l'uso di dati binari per la memorizzazione comporta compromessi. A differenza dei file di testo, i file binari non sono leggibili dall'uomo, il che significa che non possono essere facilmente aperti e compresi con editor di testo standard o importati in programmi come Excel. Per leggere e interpretare i dati binari, è necessario sviluppare software o script specializzati (ad esempio, in Python) per analizzare correttamente il formato binario.

Per la maggior parte delle applicazioni, dove l'accesso facile e la flessibilità sono importanti (come l'analisi dei dati su un computer in seguito), sono raccomandati formati basati su testo come CSV. Questi formati sono più facili da utilizzare in una varietà di strumenti software e offrono maggiore flessibilità per un'analisi rapida dei dati.

Se sei deciso a utilizzare la memorizzazione binaria, dai un'occhiata più approfondita "sotto il cofano" esaminando come la libreria CanSat gestisce internamente la memorizzazione dei dati. Puoi utilizzare direttamente i metodi di gestione dei file in stile C per gestire file, flussi e altre operazioni a basso livello in modo efficiente. Maggiori informazioni possono essere trovate anche nella [libreria Arduino SD card](https://docs.arduino.cc/libraries/sd/).

---

I nostri programmi iniziano a diventare sempre più complicati, e ci sono anche alcuni componenti che sarebbe bello riutilizzare altrove. Per evitare di rendere il nostro codice difficile da gestire, sarebbe utile poter condividere alcuni componenti su diversi file e mantenere il codice leggibile. Vediamo come questo può essere realizzato con l'IDE di Arduino.

[Clicca qui per la prossima lezione!](./lesson10)