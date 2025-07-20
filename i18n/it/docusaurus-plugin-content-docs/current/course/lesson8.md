---
sidebar_position: 9
---

# Lezione 8: Segui il Flusso

L'argomento di questa lezione è il controllo del flusso, ovvero come possiamo gestire ciò che il processore fa in diversi momenti. Fino ad ora, la maggior parte dei nostri programmi si è concentrata su un singolo compito, il che, sebbene semplice, limita il potenziale del sistema. Introducendo diversi **stati** nel nostro programma, possiamo espandere le sue capacità.

Ad esempio, il programma potrebbe avere uno stato di pre-lancio, in cui il satellite è in attesa del decollo. Poi, potrebbe passare alla modalità di volo, dove legge i dati dei sensori e svolge la sua missione principale. Infine, potrebbe attivarsi una modalità di recupero, in cui il satellite invia segnali per aiutare nel recupero—luci lampeggianti, beep, o eseguendo qualsiasi azione di sistema che abbiamo progettato.

Il **trigger** per cambiare tra stati può variare. Potrebbe essere una lettura di un sensore, come un cambiamento di pressione, un comando esterno, un evento interno (come un timer), o anche un evento casuale, a seconda di ciò che è richiesto. In questa lezione, costruiremo su ciò che abbiamo imparato precedentemente usando un comando esterno come trigger.

## Controllo del Flusso con Trigger Esterni

Per prima cosa, modifichiamo il codice della stazione di terra per poter ricevere messaggi dal monitor Serial, in modo da poter inviare comandi personalizzati quando necessario.

Come puoi vedere, le uniche modifiche sono nel loop principale. Prima, controlliamo se ci sono dati ricevuti dal Serial. Se non ci sono, non viene fatto nulla, e il loop continua. Tuttavia, se ci sono dati, vengono letti in una variabile, stampati per chiarezza, e poi inviati via radio al satellite. Se hai ancora il programma dalla lezione precedente caricato sul satellite, puoi provarlo.

```Cpp title="Stazione di terra in grado di inviare comandi"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Serial In - Fonti di Dati

Quando leggiamo dati dall'oggetto `Serial`, stiamo accedendo ai dati memorizzati nel buffer UART RX, che vengono trasmessi tramite la connessione USB Virtual Serial. In pratica, ciò significa che qualsiasi software in grado di comunicare su una porta seriale virtuale, come l'IDE di Arduino, programmi terminali, o vari ambienti di programmazione, può essere utilizzato per inviare dati al CanSat.

Questo apre molte possibilità per controllare il CanSat da programmi esterni. Ad esempio, possiamo inviare comandi digitandoli manualmente, ma anche scrivere script in Python o altri linguaggi per automatizzare i comandi, rendendo possibile creare sistemi di controllo più avanzati. Sfruttando questi strumenti, puoi inviare istruzioni precise, eseguire test, o monitorare il CanSat in tempo reale senza intervento manuale.

:::

Successivamente, diamo un'occhiata al lato satellite. Poiché abbiamo più stati nel programma, diventa un po' più lungo, ma analizziamolo passo dopo passo.

Per prima cosa, inizializziamo i sistemi come al solito. Ci sono anche un paio di variabili globali, che posizioniamo nella parte superiore del file in modo che sia facile vedere quali nomi vengono utilizzati. `LED_IS_ON` è familiare dai nostri esempi di codice precedenti, e inoltre abbiamo una variabile di stato globale `STATE`, che memorizza lo... stato.

```Cpp title="Inizializzazione"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Successivamente, nel loop controlliamo semplicemente quale subroutine dovrebbe essere eseguita in base allo stato corrente, e chiama la sua funzione:

```Cpp title="Loop"
void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // modalità sconosciuta
    delay(1000);
  }
}
```

In questo caso particolare, ogni stato è rappresentato da una funzione separata che viene chiamata in base allo stato. Il contenuto delle funzioni non è davvero importante qui, ma eccole:

```Cpp title="Subroutine"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}
```

C'è anche una piccola funzione di supporto `blinkLED`, che aiuta ad evitare la ripetizione del codice gestendo per noi l'accensione e lo spegnimento del LED.

Infine, lo stato viene cambiato quando la stazione di terra ce lo dice:

```Cpp title="Callback comando ricevuto"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```

<details>
  <summary>Codice completo</summary>
  <p>Ecco il codice completo per tua comodità.</p>
```Cpp title="Satellite con più stati"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // modalità sconosciuta
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Con questo, ora possiamo controllare cosa fa il satellite senza nemmeno avere accesso fisico ad esso. Piuttosto, possiamo semplicemente inviare un comando con la stazione di terra e il satellite fa ciò che vogliamo.

:::tip[Esercizio]

Crea un programma che misura un sensore con una frequenza specifica, che può essere cambiata con un comando remoto a qualsiasi valore. Invece di usare subroutine, prova a modificare direttamente un valore di delay con un comando.

Prova anche a renderlo tollerante agli input inaspettati, come "-1", "ABCDFEG" o "".

Come esercizio bonus, rendi la nuova impostazione permanente tra i reset, in modo che quando il satellite viene spento e riacceso, riprenda a trasmettere con la nuova frequenza invece di tornare a quella originale. Come suggerimento, potrebbe essere utile rivedere la [lezione 5](./lesson5.md).

:::

---

Nella prossima lezione, renderemo la nostra memorizzazione dei dati, comunicazione e gestione significativamente più efficienti e veloci utilizzando dati binari. Anche se potrebbe sembrare astratto all'inizio, gestire i dati come binari invece che come numeri semplifica molti compiti, poiché è il linguaggio nativo del computer.

[Clicca qui per la prossima lezione!](./lesson9)