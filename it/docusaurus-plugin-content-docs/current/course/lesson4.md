---
sidebar_position: 4
---

# Lezione 4: La resistenza non è inutile

Finora ci siamo concentrati sull'uso di dispositivi sensori digitali per ottenere valori direttamente in unità SI. Tuttavia, i dispositivi elettrici effettuano la misurazione solitamente in modo indiretto, e la conversione alle unità desiderate viene poi fatta successivamente. Questo veniva fatto in precedenza dai dispositivi sensori stessi (e dalla libreria CanSat NeXT), ma molti sensori che usiamo sono molto più semplici. Un tipo di sensori analogici sono i sensori resistivi, dove la resistenza di un elemento sensore cambia a seconda di alcuni fenomeni. I sensori resistivi esistono per una moltitudine di quantità - inclusi forza, temperatura, intensità luminosa, concentrazioni chimiche, pH e molti altri.

In questa lezione, utilizzeremo il resistore dipendente dalla luce (LDR) sulla scheda CanSat NeXT per misurare l'intensità luminosa circostante. Mentre il termistore viene utilizzato in modo molto simile, sarà il focus di una lezione futura. Le stesse competenze si applicano direttamente all'uso dell'LDR e del termistore, così come a molti altri sensori resistivi.

![Posizione dell'LDR sulla scheda](./../CanSat-hardware/img/LDR.png)

## Fisica dei Sensori Resistivi

Invece di passare direttamente al software, facciamo un passo indietro e discutiamo di come funziona generalmente la lettura di un sensore resistivo. Considera lo schema sottostante. La tensione a LDR_EN è di 3,3 volt (tensione operativa del processore), e abbiamo due resistori collegati in serie sul suo percorso. Uno di questi è l'**LDR** (R402), mentre l'altro è un **resistore di riferimento** (R402). La resistenza del resistore di riferimento è di 10 kilo-ohm, mentre la resistenza dell'LDR varia tra 5-300 kilo-ohm a seconda delle condizioni di luce.

![Schema dell'LDR](./img/LDR.png)

Poiché i resistori sono collegati in serie, la resistenza totale è 

$$
R = R_{401} + R_{LDR},
$$

e la corrente attraverso i resistori è 

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

dove $V_{OP}$ è la tensione operativa dell'MCU. Ricorda che la corrente deve essere la stessa attraverso entrambi i resistori. Pertanto, possiamo calcolare la caduta di tensione sull'LDR come 

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

E questa caduta di tensione è la tensione dell'LDR che possiamo misurare con un convertitore analogico-digitale. Di solito questa tensione può essere direttamente correlata o calibrata per corrispondere ai valori misurati, come ad esempio dalla tensione alla temperatura o alla luminosità. Tuttavia, a volte è desiderabile calcolare prima la resistenza misurata. Se necessario, può essere calcolata come:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Lettura dell'LDR in Pratica

Leggere l'LDR o altri sensori resistivi è molto semplice, poiché dobbiamo solo interrogare il convertitore analogico-digitale per la tensione. Iniziamo questa volta un nuovo Sketch Arduino da zero. File -> Nuovo Sketch.

Per prima cosa, iniziamo lo sketch come prima includendo la libreria. Questo viene fatto all'inizio dello sketch. Nel setup, avvia il seriale e inizializza CanSat, proprio come prima.

```Cpp title="Impostazione di base"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Un ciclo base per leggere l'LDR non è molto più complicato. I resistori R401 e R402 sono già sulla scheda, e dobbiamo solo leggere la tensione dal loro nodo comune. Leggiamo il valore ADC e stampiamolo.

```Cpp title="Ciclo base LDR"
void loop() {
    int value = analogRead(LDR);
    Serial.print("Valore LDR:");
    Serial.println(value);
    delay(200);
}
```

Con questo programma, i valori reagiscono chiaramente alle condizioni di illuminazione. Otteniamo valori più bassi quando l'LDR è esposto alla luce e valori più alti quando è più scuro. Tuttavia, i valori sono in centinaia e migliaia, non in un intervallo di tensione previsto. Questo perché stiamo ora leggendo l'output diretto dell'ADC. Ogni bit rappresenta una scala di confronto di tensione che è uno o zero a seconda della tensione. I valori sono ora 0-4095 (2^12-1) a seconda della tensione di ingresso. Ancora una volta, questa misurazione diretta è probabilmente ciò che vuoi usare se stai facendo qualcosa come [rilevare impulsi con l'LDR](./../../blog/first-project#pulse-detection), ma spesso i volt regolari sono comodi da usare. Sebbene calcolare la tensione da soli sia un buon esercizio, la libreria include una funzione di conversione che considera anche la non linearità dell'ADC, il che significa che l'output è più accurato rispetto a una semplice conversione lineare.

```Cpp title="Lettura della tensione LDR"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("Valore LDR:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Questo codice è compatibile con il plotter seriale in Arduino Code. Provalo!

:::

:::tip[Esercizio]

Potrebbe essere utile rilevare che il CanSat è stato rilasciato dal razzo, in modo che, ad esempio, il paracadute possa essere dispiegato al momento giusto. Puoi scrivere un programma che rileva un rilascio simulato? Simula il lancio coprendo prima l'LDR (integrazione del razzo) e poi scoprendolo (rilascio). Il programma potrebbe segnalare il rilascio al terminale o far lampeggiare un LED per mostrare che il rilascio è avvenuto.

:::

---

La prossima lezione riguarda l'uso della scheda SD per memorizzare misurazioni, impostazioni e altro!

[Clicca qui per la prossima lezione!](./lesson5)