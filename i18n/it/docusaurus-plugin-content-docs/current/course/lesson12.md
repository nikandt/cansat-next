---
sidebar_position: 13
---

# Lezione 12: Pronti al Decollo?

In questa lezione finale, parleremo di come preparare il satellite, la stazione a terra e il team per il lancio. Dopo questa lezione, avremo anche una *revisione* per verificare la prontezza al volo, ma questa lezione si concentra sul massimizzare le possibilità di una missione di successo. In questa lezione, parleremo di come preparare i tuoi componenti elettronici meccanicamente ed elettricamente, controllare il sistema di comunicazione radio e infine discutere alcuni utili passaggi di preparazione da fare ben prima dell'evento di lancio effettivo.

Questa lezione è di nuovo un po' diversa, poiché invece di esaminare nuovi concetti di programmazione, stiamo discutendo su come migliorare l'affidabilità del dispositivo nella missione. Inoltre, mentre probabilmente non hai ancora finito di costruire (o definire) la missione del satellite se stai ora seguendo il corso per la prima volta, è bene leggere i materiali su questa pagina, considerare questi aspetti quando pianifichi il tuo dispositivo e la tua missione, e ritornarci quando ti prepari effettivamente per il lancio.

## Considerazioni meccaniche

Innanzitutto, come discusso nella lezione precedente, lo **stack** elettronico dovrebbe essere costruito in modo tale da rimanere insieme anche in caso di forti vibrazioni e urti. Un buon modo per progettare l'elettronica è utilizzare schede perforate, che sono tenute insieme da [distanziatori](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) e collegate elettricamente tramite connettori o con un cavo ben supportato. Infine, l'intero stack elettronico dovrebbe essere fissato al telaio del satellite in modo che non si muova. Un collegamento rigido con viti è sempre una scelta solida (gioco di parole voluto), ma non è l'unica opzione. Un'alternativa potrebbe essere progettare il sistema per rompersi all'impatto, simile a una [zona di deformazione](https://en.wikipedia.org/wiki/Crumple_zone). In alternativa, un sistema di montaggio ammortizzato con gomma, schiuma o un sistema simile potrebbe ridurre le sollecitazioni subite dall'elettronica, aiutando a creare sistemi multiuso.

In un tipico CanSat, ci sono alcuni elementi particolarmente vulnerabili a problemi durante il lancio o atterraggi più veloci del previsto. Questi sono le batterie, la scheda SD e l'antenna.

### Fissare le batterie

Sul CanSat NeXT, la scheda è progettata in modo tale che una fascetta possa essere fissata attorno alla scheda per garantire che le batterie siano tenute in posizione durante le vibrazioni. Altrimenti, tendono a uscire dalle prese. Un'altra preoccupazione riguardo alle batterie è che alcune batterie sono più corte di quanto sarebbe ideale per il portabatterie, ed è possibile che in un urto particolarmente forte, i contatti della batteria si pieghino sotto il peso delle batterie in modo tale da perdere il contatto. Per mitigare questo, i contatti possono essere supportati aggiungendo un pezzo di fascetta, schiuma o altro riempitivo dietro i contatti a molla. Nei test di caduta accidentali (e intenzionali), questo ha migliorato l'affidabilità, sebbene i CanSat NeXT integrati in CanSat ben costruiti abbiano sopravvissuto a cadute da fino a 1000 metri (senza paracadute) anche senza queste misure di protezione. Un modo ancora migliore per supportare le batterie è progettare una struttura di supporto direttamente nel telaio del CanSat, in modo che sostenga il peso delle batterie all'impatto invece del portabatterie.

![CanSat con fascetta](./img/cansat_with_ziptie.png)

### Fissare il cavo dell'antenna

Il connettore dell'antenna è U.Fl, che è un tipo di connettore classificato per uso automobilistico. Gestiscono bene le vibrazioni e gli urti nonostante non abbiano supporti meccanici esterni. Tuttavia, l'affidabilità può essere migliorata fissando l'antenna con piccole fascette. La scheda CanSat NeXT ha piccole fessure accanto all'antenna per questo scopo. Per mantenere l'antenna in una posizione neutra, un [supporto può essere stampato](../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) per essa.

![Antenna fissata in posizione con un supporto stampato in 3D](../CanSat-hardware/img/qw_6.png)

### Fissare la scheda SD

La scheda SD può uscire dal supporto in caso di urti elevati. Ancora una volta, le schede hanno sopravvissuto a cadute e voli, ma l'affidabilità può essere migliorata nastrando o incollando la scheda SD al supporto. Le schede CanSat NeXT più recenti (≥1.02) sono dotate di supporti per schede SD ad alta sicurezza per mitigare ulteriormente questo problema.

## Test di comunicazione

Uno dei dettagli più vitali per una missione di successo è avere un collegamento radio affidabile. Ci sono ulteriori informazioni sulla selezione e/o costruzione delle antenne nella [sezione hardware](../CanSat-hardware/communication#antenna-options) della documentazione. Tuttavia, indipendentemente dall'antenna selezionata, il test è una parte vitale di qualsiasi sistema radio.

Il test corretto dell'antenna può essere complicato e richiede attrezzature specializzate come [VNA](https://en.wikipedia.org/wiki/Network_analyzer_(electrical)), ma possiamo fare un test funzionale direttamente con il kit CanSat NeXT.

Prima, programma il satellite per inviare dati, ad esempio una lettura di dati una volta al secondo. Poi, programma la stazione a terra per ricevere dati e stampare i valori **RSSI** (Indicatore di forza del segnale ricevuto), come fornito dalla funzione `getRSSI()`, che fa parte della libreria CanSat NeXT.

```Cpp title="Leggi RSSI"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI: ");
  Serial.println(rssi);
}
```

Questo valore rappresenta la reale **potenza** elettrica ricevuta dalla stazione a terra attraverso la sua antenna quando riceve un messaggio. Il valore è espresso in [decibelmilliwatts](https://en.wikipedia.org/wiki/DBm). Una lettura tipica con un'antenna funzionante su entrambe le estremità quando i dispositivi sono sullo stesso tavolo è -30 dBm (1000 nanowatt), e dovrebbe diminuire rapidamente quando la distanza aumenta. In spazio libero, segue approssimativamente la legge dell'inverso del quadrato, ma non esattamente a causa di echi, zone di Fresnel e altre imperfezioni. Con le impostazioni radio che CanSat NeXT utilizza di default, l'RSSI può essere ridotto a circa -100 dBm (0.1 picowatt) e ancora alcuni dati passano.

Questo corrisponde di solito a una distanza di circa un chilometro quando si utilizzano le antenne monopolo, ma può essere molto di più se l'antenna della stazione a terra ha un guadagno significativo, che si aggiunge direttamente alla lettura in dBm.

## Test di potenza

È una buona idea misurare l'assorbimento di corrente del tuo satellite utilizzando un multimetro. È anche facile, basta rimuovere una delle batterie e tenerla manualmente in modo da poter utilizzare la misurazione della corrente del multimetro per connettere un'estremità della batteria e il contatto della batteria. Questa lettura dovrebbe essere nell'ordine di 130-200 mA se la radio CanSat NeXT è attiva e non ci sono dispositivi esterni. L'assorbimento di corrente aumenta man mano che le batterie si scaricano, poiché è necessaria più corrente per mantenere la tensione a 3.3 volt dalla tensione della batteria in calo.

Le tipiche batterie AAA hanno una capacità di circa 1200 mAh, il che significa che l'assorbimento di corrente del dispositivo dovrebbe essere inferiore a 300 mA per garantire che le batterie durino per tutta la missione. Questo è anche il motivo per cui è una buona idea avere più modalità operative se ci sono dispositivi affamati di corrente a bordo, poiché possono essere accesi appena prima del volo per garantire una buona durata della batteria.

Mentre un approccio matematico per stimare la durata della batteria è un buon inizio, è comunque meglio fare una misurazione effettiva della durata della batteria ottenendo batterie fresche e facendo una missione simulata.

## Test aerospaziali

Nell'industria aerospaziale, ogni satellite viene sottoposto a test rigorosi per garantire che possa sopravvivere alle condizioni difficili del lancio, dello spazio e talvolta del rientro. Anche se i CanSat operano in un ambiente leggermente diverso, potresti comunque adattare alcuni di questi test per migliorare l'affidabilità. Di seguito sono riportati alcuni test aerospaziali comuni utilizzati per CubeSat e piccoli satelliti, insieme a idee su come potresti implementare test simili per il tuo CanSat.

### Test di vibrazione

Il test di vibrazione viene utilizzato nei sistemi di piccoli satelliti per due motivi. Il motivo principale è che il test mira a identificare le frequenze di risonanza della struttura per garantire che la vibrazione del razzo non inizi a risuonare in nessuna struttura del satellite, il che potrebbe portare a un guasto nei sistemi del satellite. Il secondo motivo è anche rilevante per i sistemi CanSat, che è confermare la qualità della lavorazione e garantire che il sistema sopravviverà al lancio del razzo. Il test di vibrazione del satellite viene eseguito con banchi di prova di vibrazione specializzati, ma l'effetto può essere simulato anche con soluzioni più creative. Prova a trovare un modo per scuotere davvero il satellite (o preferibilmente il suo ricambio) e vedere se qualcosa si rompe. Come potrebbe essere migliorato?

### Test di shock

Un cugino dei test di vibrazione, i test di shock simulano la separazione esplosiva degli stadi durante il lancio del razzo. L'accelerazione di shock può arrivare fino a 100 G, il che può facilmente rompere i sistemi. Questo potrebbe essere simulato con un test di caduta, ma considera come farlo in sicurezza in modo che il satellite, tu o il pavimento non si rompano.

### Test termico

Il test termico include l'esposizione dell'intero satellite agli estremi dell'intervallo operativo pianificato e anche il passaggio rapido tra queste temperature. Nel contesto CanSat, questo potrebbe significare testare il satellite in un congelatore, simulando un lancio in una giornata fredda, o in un forno leggermente riscaldato per simulare una giornata di lancio calda. Fai attenzione che l'elettronica, le plastiche o la tua pelle non siano esposte direttamente a temperature estreme.

## Buone idee generali

Ecco alcuni suggerimenti aggiuntivi per aiutare a garantire una missione di successo. Questi vanno dalle preparazioni tecniche alle pratiche organizzative che miglioreranno l'affidabilità complessiva del tuo CanSat. Sentiti libero di suggerire nuove idee da aggiungere qui attraverso il canale usuale (samuli@kitsat.fi).

- Considera di avere una checklist per evitare di dimenticare qualcosa poco prima del lancio
- Testa l'intera sequenza di volo in anticipo in un volo simulato
- Testa il satellite anche in condizioni ambientali simili a quelle previste per il volo. Assicurati che il paracadute sia anche OK con le temperature previste.
- Avere batterie di riserva e pensare a come sono installate se necessario
- Avere una scheda SD di riserva, a volte falliscono
- Avere un computer di riserva e disabilitare gli aggiornamenti sul computer prima del lancio.
- Avere fascette, viti e tutto ciò che serve per assemblare il satellite
- Avere alcuni strumenti di base a portata di mano per aiutare nello smontaggio e montaggio
- Avere antenne extra
- Puoi anche avere più stazioni a terra che operano contemporaneamente, che possono anche essere utilizzate per triangolare il satellite, specialmente se è disponibile l'RSSI.
- Avere ruoli chiari per ogni membro del team durante il lancio, le operazioni e il recupero.

---

Questa è la fine delle lezioni per ora. Nella pagina successiva c'è una revisione della prontezza al volo, che è una pratica che aiuta a garantire missioni di successo.

[Clicca qui per la revisione della prontezza al volo!](./review2)