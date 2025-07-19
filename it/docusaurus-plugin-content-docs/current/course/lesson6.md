---
sidebar_position: 6
---

# Lezione 6: Telefonare a Casa

Ora abbiamo effettuato misurazioni e le abbiamo anche salvate su una scheda SD. Il passo logico successivo è trasmetterle senza fili a terra, il che apre un mondo completamente nuovo in termini di misurazioni ed esperimenti che possiamo eseguire. Ad esempio, provare il volo a gravità zero con l'IMU sarebbe stato molto più interessante (e facile da calibrare) se avessimo potuto vedere i dati in tempo reale. Vediamo come possiamo farlo!

In questa lezione, invieremo misurazioni dal CanSat NeXT al ricevitore della stazione a terra. Successivamente, vedremo anche come comandare il CanSat con messaggi inviati dalla stazione a terra.

## Antenne

Prima di iniziare questa lezione, assicurati di avere un tipo di antenna collegata alla scheda CanSat NeXT e alla stazione a terra.

:::note

Non dovresti mai provare a trasmettere nulla senza un'antenna. Non solo probabilmente non funzionerà, ma c'è la possibilità che la potenza riflessa danneggi il trasmettitore.

:::

Poiché stiamo utilizzando la banda a 2.4 GHz, condivisa da sistemi come Wi-Fi, Bluetooth, ISM, droni ecc., ci sono molte antenne commerciali disponibili. La maggior parte delle antenne Wi-Fi funziona davvero bene con CanSat NeXT, ma spesso avrai bisogno di un adattatore per collegarle alla scheda CanSat NeXT. Abbiamo anche testato alcuni modelli di adattatori, disponibili nel negozio online.

Maggiori informazioni sulle antenne possono essere trovate nella documentazione hardware: [Comunicazione e Antenne](./../CanSat-hardware/communication). Questo articolo contiene anche [istruzioni](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) su come costruire la tua antenna con i materiali del kit CanSat NeXT.

## Invio dei Dati

Con la discussione sulle antenne fuori dai piedi, iniziamo a inviare alcuni bit. Inizieremo di nuovo esaminando la configurazione, che questa volta ha una differenza chiave: abbiamo aggiunto un numero come **argomento** al comando `CanSatInit()`.

```Cpp title="Configurazione per la trasmissione"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Passare un valore numerico a `CanSatInit()` indica al CanSat NeXT che vogliamo ora utilizzare la radio. Il numero indica il valore dell'ultimo byte dell'indirizzo MAC. Puoi pensarlo come una chiave per la tua rete specifica: puoi comunicare solo con CanSat che condividono la stessa chiave. Questo numero dovrebbe essere condiviso tra il tuo CanSat NeXT e la tua stazione a terra. Puoi scegliere il tuo numero preferito tra 0 e 255. Io ho scelto 28, poiché è [perfetto](https://en.wikipedia.org/wiki/Perfect_number).

Con la radio inizializzata, trasmettere i dati è davvero semplice. Funziona proprio come `appendFile()` che abbiamo usato nella lezione precedente: puoi aggiungere qualsiasi valore e verrà trasmesso in un formato predefinito, oppure puoi usare una stringa formattata e inviare quella invece.

```Cpp title="Trasmissione dei dati"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Con questo semplice codice, stiamo ora trasmettendo la misurazione LDR quasi 10 volte al secondo. Ora vediamo come riceverla.

:::note

Chi è familiare con la programmazione a basso livello potrebbe sentirsi più a suo agio inviando i dati in forma binaria. Non preoccuparti, ti abbiamo coperto. I comandi binari sono elencati nella [Specificazione della Libreria](./../CanSat-software/library_specification.md#senddata-binary-variant).

:::

## Ricezione dei Dati

Questo codice dovrebbe ora essere programmato su un altro ESP32. Di solito è la seconda scheda di controllo inclusa nel kit, tuttavia praticamente qualsiasi altro ESP32 funzionerà altrettanto bene, incluso un altro CanSat NeXT.

:::note

Se stai usando una scheda di sviluppo ESP32 come stazione a terra, ricorda di premere il pulsante Boot sulla scheda mentre stai caricando il programma dall'IDE. Questo imposta l'ESP32 nella modalità di avvio corretta per riprogrammare il processore. CanSat NeXT lo fa automaticamente, ma le schede di sviluppo spesso no.

:::

Il codice di configurazione è esattamente lo stesso di prima. Ricorda solo di cambiare la chiave radio con il tuo numero preferito.

```Cpp title="Configurazione per la ricezione"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Tuttavia, dopo le cose cambiano un po'. Creiamo una funzione loop completamente vuota! Questo perché in realtà non abbiamo nulla da fare nel loop, ma invece la ricezione viene effettuata tramite **callback**.

```Cpp title="Impostazione di un callback"
void loop() {
  // Non abbiamo nulla da fare nel loop.
}

// Questa è una funzione di callback. Viene eseguita ogni volta che la radio riceve dati.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Mentre la funzione `setup()` viene eseguita solo una volta all'inizio e `loop()` viene eseguita continuamente, la funzione `onDataReceived()` viene eseguita solo quando la radio ha ricevuto nuovi dati. In questo modo, possiamo gestire i dati nella funzione di callback. In questo esempio, li stampiamo semplicemente, ma avremmo potuto anche modificarli come volevamo.

Nota che la funzione `loop()` non *deve* essere vuota, puoi effettivamente usarla per qualsiasi cosa tu voglia con una sola avvertenza: i ritardi dovrebbero essere evitati, poiché la funzione `onDataReceived()` non verrà eseguita fino a quando il ritardo non sarà terminato.

Se ora hai entrambi i programmi in esecuzione su schede diverse allo stesso tempo, ci dovrebbero essere un bel po' di misurazioni inviate senza fili al tuo PC.

:::note

Per chi è orientato al binario - puoi usare la funzione di callback onBinaryDataReceived.

:::

## Gravità Zero in Tempo Reale

Per divertimento, ripetiamo l'esperimento di gravità zero ma con le radio. Il codice del ricevitore può rimanere lo stesso, come effettivamente anche la configurazione nel codice CanSat.

Come promemoria, abbiamo creato un programma nella lezione sull'IMU che rilevava la caduta libera e accendeva un LED in questo scenario. Ecco il vecchio codice:

```Cpp title="Funzione loop per rilevare la caduta libera"
unsigned long LEDOnTill = 0;

void loop() {
  // Leggi l'accelerazione
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcola l'accelerazione totale (al quadrato)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Aggiorna il timer se rileviamo una caduta
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Controlla il LED in base al timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

È allettante aggiungere semplicemente `sendData()` direttamente al vecchio esempio, tuttavia dobbiamo considerare il timing. Di solito non vogliamo inviare messaggi più di ~20 volte al secondo, ma d'altra parte vogliamo che il loop continui a funzionare in modo che il LED si accenda ancora.

Dobbiamo aggiungere un altro timer - questa volta per inviare dati ogni 50 millisecondi. Il timer viene fatto confrontando il tempo corrente con il tempo corrente rispetto all'ultima volta in cui i dati sono stati inviati. L'ultima volta viene quindi aggiornata ogni volta che i dati vengono inviati. Dai anche un'occhiata a come viene creata la stringa qui. Potrebbe anche essere trasmessa in parti, ma in questo modo viene ricevuta come un singolo messaggio, invece di più messaggi.

```Cpp title="Rilevamento della caduta libera + trasmissione dei dati"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Leggi l'accelerazione
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcola l'accelerazione totale (al quadrato)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Aggiorna il timer se rileviamo una caduta
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Controlla il LED in base al timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Aggiorna l'ultima volta di invio al tempo corrente
    lastSendTime = millis();
  }

}
```

Il formato dei dati qui è effettivamente compatibile di nuovo con il plotter seriale - guardando quei dati diventa abbastanza chiaro perché siamo stati in grado di rilevare la caduta libera in precedenza in modo così netto - i valori scendono davvero a zero non appena il dispositivo viene lasciato cadere o lanciato.

---

Nella prossima sezione, faremo una breve pausa per rivedere ciò che abbiamo imparato finora e assicurarci di essere pronti a continuare a costruire su questi concetti.

[Clicca qui per la prima revisione!](./review1)