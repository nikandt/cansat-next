---
sidebar_position: 8
---

# Lezione 7: Rispondere

I CanSat sono spesso programmati per operare su logiche piuttosto semplici - ad esempio effettuare misurazioni ogni n millisecondi, salvare e trasmettere i dati e ripetere. Al contrario, inviare comandi al satellite per cambiare il suo comportamento nel mezzo della missione potrebbe abilitare molte nuove possibilità. Forse vorresti accendere o spegnere un sensore, o comandare al satellite di emettere un suono per poterlo trovare. Ci sono molte possibilità, ma forse la più utile è la capacità di accendere dispositivi che consumano molta energia nel satellite solo poco prima del lancio del razzo, dandoti molta più flessibilità e libertà di operare dopo che il satellite è già stato integrato nel razzo.

In questa lezione, proviamo ad accendere e spegnere il LED sulla scheda del satellite tramite la stazione di terra. Questo rappresenta uno scenario in cui il satellite non fa nulla senza essere istruito a farlo, e sostanzialmente ha un semplice sistema di comando.

:::info

## Callback Software

La ricezione dei dati nella libreria CanSat è programmata come **callback**, che è una funzione che viene chiamata... beh, indietro, quando si verifica un certo evento. Mentre finora nei nostri programmi il codice ha sempre seguito esattamente le righe che abbiamo scritto, ora sembra eseguire occasionalmente un'altra funzione nel mezzo prima di continuare nel ciclo principale. Questo può sembrare confuso, ma sarà abbastanza chiaro quando lo vedremo in azione.

:::

## Blinky Remoto

Per questo esercizio, proviamo a replicare il lampeggio del LED dalla prima lezione, ma questa volta il LED è effettivamente controllato a distanza.

Guardiamo prima al programma lato satellite. L'inizializzazione è ormai molto familiare, ma il ciclo è leggermente più sorprendente - non c'è nulla lì. Questo perché tutta la logica è gestita tramite la funzione di callback a distanza dalla stazione di terra, quindi possiamo semplicemente lasciare il ciclo vuoto.

Le cose più interessanti accadono nella funzione `onDataReceived(String data)`. Questa è la suddetta funzione di callback, che è programmata nella libreria per essere chiamata ogni volta che la radio riceve qualsiasi dato. Il nome della funzione è programmato nella libreria, quindi finché usi esattamente lo stesso nome qui, verrà chiamata quando ci sono dati disponibili.

In questo esempio qui sotto, i dati vengono stampati ogni volta solo per visualizzare cosa sta accadendo, ma lo stato del LED viene anche cambiato ogni volta che un messaggio viene ricevuto, indipendentemente dal contenuto.

```Cpp title="Codice del satellite per non fare nulla senza essere istruito"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

La variabile `LED_IS_ON` è memorizzata come variabile globale, il che significa che è accessibile da qualsiasi parte del codice. Queste sono tipicamente malviste nella programmazione, e ai principianti viene insegnato di evitarle nei loro programmi. Tuttavia, nella programmazione _embedded_ come stiamo facendo qui, sono in realtà un modo molto efficiente e previsto di fare questo. Fai solo attenzione a non usare lo stesso nome in più posti!

:::

Se carichiamo questo sulla scheda CanSat NeXT e la avviamo... Non succede nulla. Questo è ovviamente previsto, poiché al momento non abbiamo alcun comando in arrivo.

Dal lato della stazione di terra, il codice non è molto complicato. Inizializziamo il sistema, e poi nel ciclo inviamo un messaggio ogni 1000 ms, cioè una volta al secondo. Nel programma attuale, il messaggio effettivo non importa, ma solo che qualcosa venga inviato nella stessa rete.

```Cpp title="Stazione di terra che invia messaggi"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Messaggio dalla stazione di terra");
}
```

Ora, quando programmiamo questo codice sulla stazione di terra (non dimenticare di premere il pulsante BOOT) e il satellite è ancora acceso, il LED sul satellite inizia a lampeggiare, accendendosi e spegnendosi dopo ogni messaggio. Il messaggio viene anche stampato sul terminale.

:::tip[Esercizio]

Carica il frammento di codice qui sotto sulla scheda della stazione di terra. Cosa succede sul lato satellite? Puoi cambiare il programma del satellite in modo che reagisca accendendo il LED solo quando riceve `LED ON` e spegnendolo con `LED OFF`, e altrimenti stampi solo il testo.

```Cpp title="Stazione di terra che invia messaggi"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Non fare nulla, questo è solo un messaggio",
  "Ciao a CanSat!",
  "Woop woop",
  "Preparati!"
};

void loop() {
  delay(400);
  
  // Genera un indice casuale per scegliere un messaggio
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Invia il messaggio selezionato casualmente
  sendData(messages[randomIndex]);
}
```

:::

Nota anche che ricevere messaggi non blocca l'invio di essi, quindi potremmo (e lo faremo) inviare messaggi da entrambi i lati contemporaneamente. Il satellite può trasmettere dati continuamente, mentre la stazione di terra può continuare a inviare comandi al satellite. Se i messaggi sono simultanei (entro lo stesso millisecondo circa), ci può essere un conflitto e il messaggio non passa. Tuttavia, CanSat NeXT ritrasmetterà automaticamente il messaggio se rileva un conflitto. Quindi fai attenzione che possa accadere, ma che molto probabilmente passerà inosservato.

---

Nella prossima lezione, espanderemo questo per eseguire il **controllo del flusso** a distanza, o cambiare il comportamento del satellite in base ai comandi ricevuti.

[Click qui per la prossima lezione!](./lesson8)