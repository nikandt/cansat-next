---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lezione 10: Divide et Impera

Man mano che i nostri progetti diventano più dettagliati, il codice può diventare difficile da gestire a meno che non siamo attenti. In questa lezione, esamineremo alcune pratiche che aiuteranno a mantenere gestibili i progetti più grandi. Queste includono la suddivisione del codice in più file, la gestione delle dipendenze e infine l'introduzione del controllo di versione per tracciare le modifiche, eseguire il backup del codice e assistere nella collaborazione.

## Suddivisione del codice in più file

Nei progetti piccoli, avere tutto il codice sorgente in un unico file potrebbe sembrare accettabile, ma man mano che il progetto cresce, le cose possono diventare disordinate e più difficili da gestire. Una buona pratica è suddividere il codice in file diversi in base alla funzionalità. Quando fatto bene, questo produce anche piccoli moduli che puoi riutilizzare in diversi progetti senza introdurre componenti non necessari in altri progetti. Un grande vantaggio di avere più file è anche che rende la collaborazione più facile, poiché altre persone possono lavorare su altri file, aiutando a evitare situazioni in cui il codice è difficile da unire.

Il testo seguente presume che tu stia utilizzando Arduino IDE 2. Gli utenti avanzati potrebbero sentirsi più a loro agio con sistemi come [Platformio](https://platformio.org/), ma chi di voi sarà già familiare con questi concetti.

In Arduino IDE 2, tutti i file nella cartella del progetto vengono mostrati come schede nell'IDE. I nuovi file possono essere creati direttamente nell'IDE o tramite il sistema operativo. Ci sono tre diversi tipi di file, **header** `.h`, **file sorgente** `.cpp` e **file Arduino** `.ino`.

Di questi tre, i file Arduino sono i più facili da comprendere. Sono semplicemente file extra, che vengono copiati alla fine del tuo script principale `.ino` durante la compilazione. In questo modo, puoi facilmente usarli per creare strutture di codice più comprensibili e prendere tutto lo spazio necessario per una funzione complicata senza rendere il file sorgente difficile da leggere. L'approccio migliore è di solito prendere una funzionalità e implementarla in un file. Quindi potresti avere, ad esempio, un file separato per ogni modalità operativa, un file per i trasferimenti di dati, un file per l'interpretazione dei comandi, un file per l'archiviazione dei dati e un file principale in cui combini tutto questo in uno script funzionale.

Gli header e i file sorgente sono un po' più specializzati, ma fortunatamente funzionano esattamente come con C++ altrove, quindi c'è molto materiale scritto sull'uso di essi, ad esempio [qui](https://www.learncpp.com/cpp-tutorial/header-files/).

## Struttura di esempio

Come esempio, prendiamo il codice disordinato dalla [Lezione 8](./lesson8.md) e rifattorizziamolo.

<details>
  <summary>Codice disordinato originale dalla Lezione 8</summary>
  <p>Ecco tutto il codice per la tua frustrazione.</p>
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
  Serial.println("In attesa...");
  sendData("In attesa...");
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

Questo non è nemmeno così male, ma puoi vedere come potrebbe diventare seriamente difficile da leggere se ampliassimo le funzionalità o aggiungessimo nuovi comandi da interpretare. Invece, dividiamo questo in file di codice separati ordinati in base alle funzionalità separate.

Ho separato ciascuna delle modalità operative in un proprio file, aggiunto un file per l'interpretazione dei comandi e infine creato un piccolo file di utilità per contenere funzionalità necessarie in molti punti. Questa è una struttura di progetto semplice abbastanza tipica, ma rende già il programma nel suo insieme molto più facile da comprendere. Questo può essere ulteriormente aiutato da una buona documentazione e dalla creazione di un grafico, ad esempio, che mostra come i file si collegano tra loro.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Sketch principale"
#include "CanSatNeXT.h"

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
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Modalità pre-lancio"
void preLaunch() {
  Serial.println("In attesa...");
  sendData("In attesa...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Modalità volo"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Modalità recupero"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Interpretazione dei comandi"
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
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Utilità"
bool LED_IS_ON = false;

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
```
  </TabItem>

</Tabs>

Mentre questo approccio è già molto meglio rispetto ad avere un unico file per tutto, richiede comunque una gestione attenta. Ad esempio, il **namespace** è condiviso tra i diversi file, il che può causare confusione in un progetto più grande o quando si riutilizza il codice. Se ci sono funzioni o variabili con gli stessi nomi, il codice non sa quale usare, portando a conflitti o comportamenti inaspettati.

Inoltre, questo approccio non si presta bene all'**incapsulamento**—che è fondamentale per costruire codice più modulare e riutilizzabile. Quando le tue funzioni e variabili esistono tutte nello stesso spazio globale, diventa più difficile impedire che una parte del codice influisca involontariamente su un'altra. Qui entrano in gioco tecniche più avanzate come i namespace, le classi e la programmazione orientata agli oggetti (OOP). Questi argomenti esulano dall'ambito di questo corso, ma è incoraggiata la ricerca individuale su tali argomenti.

:::tip[Esercizio]

Prendi uno dei tuoi progetti precedenti e dagli un restyling! Dividi il tuo codice in più file e organizza le tue funzioni in base ai loro ruoli (ad esempio, gestione dei sensori, gestione dei dati, comunicazione). Guarda quanto più pulito e facile da gestire diventa il tuo progetto!

:::

## Controllo di Versione

Man mano che i progetti crescono — e specialmente quando più persone ci lavorano — è facile perdere traccia delle modifiche o sovrascrivere (o riscrivere) accidentalmente il codice. È qui che entra in gioco il **controllo di versione**. **Git** è lo strumento standard del settore per il controllo di versione che aiuta a tracciare le modifiche, gestire le versioni e organizzare grandi progetti con più collaboratori.

Imparare Git potrebbe sembrare scoraggiante, e persino ridondante per progetti piccoli, ma posso prometterti che ti ringrazierai per averlo imparato. Più tardi, ti chiederai come hai fatto a gestire senza!

Ecco un ottimo punto di partenza: [Iniziare con Git](https://docs.github.com/en/get-started/getting-started-with-git).

Ci sono diversi servizi Git disponibili, tra cui i più popolari sono:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub è una scelta solida per la sua popolarità e l'abbondanza di supporto disponibile. Infatti, questa pagina web e le librerie [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) sono ospitate su GitHub.

Git non è solo conveniente — è una competenza essenziale per chiunque lavori professionalmente in ingegneria o scienza. La maggior parte dei team di cui farai parte utilizzerà Git, quindi è una buona idea farne un'abitudine familiare.

Altri tutorial su Git:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)

:::tip[Esercizio]

Configura un repository Git per il tuo progetto CanSat e carica il tuo codice nel nuovo repository. Questo ti aiuterà a sviluppare software sia per il satellite che per la stazione di terra in modo organizzato e collaborativo.

:::

---

Nella prossima lezione, parleremo di vari modi per estendere il CanSat con sensori esterni e altri dispositivi.

[Clicca qui per la prossima lezione!](./lesson11)