---
sidebar_position: 3
---

# Lezione 3: Rilevare la Rotazione

CanSat NeXT ha due sensori IC sulla scheda CanSat NeXT. Uno di questi è il barometro che abbiamo utilizzato nella lezione precedente, e l'altro è l'_unità di misura inerziale_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#inertial-measurement-unit). L'LSM6DS3 è un IMU a 6 assi, il che significa che è in grado di effettuare 6 misurazioni diverse. In questo caso, si tratta di accelerazione lineare su tre assi (x, y, z) e velocità angolare su tre assi.

In questa lezione, esamineremo l'esempio dell'IMU nella libreria e utilizzeremo l'IMU per fare un piccolo esperimento.

## Esempio di Libreria

Iniziamo esaminando come funziona l'esempio della libreria. Caricalo da File -> Esempi -> CanSat NeXT -> IMU.

L'impostazione iniziale è di nuovo la stessa: includere la libreria, inizializzare la seriale e CanSat. Quindi, concentriamoci sul loop. Tuttavia, il loop sembra davvero familiare! Leggiamo i valori proprio come nella lezione precedente, solo che questa volta ce ne sono molti di più.

```Cpp title="Lettura dei valori dell'IMU"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Ogni asse viene effettivamente letto a qualche centinaio di microsecondi di distanza. Se hai bisogno che vengano aggiornati simultaneamente, dai un'occhiata alle funzioni [readAcceleration](./../CanSat-software/library_specification#readacceleration) e [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Dopo aver letto i valori, possiamo stamparli come al solito. Questo potrebbe essere fatto usando Serial.print e println proprio come nella lezione precedente, ma questo esempio mostra un modo alternativo per stampare i dati, con molto meno scrittura manuale.

Prima, viene creato un buffer di 128 caratteri. Poi questo viene inizializzato in modo che ogni valore sia 0, usando memset. Dopo di ciò, i valori vengono scritti nel buffer usando `snprintf()`, che è una funzione che può essere utilizzata per scrivere stringhe con un formato specificato. Infine, questo viene semplicemente stampato con `Serial.println()`.

```Cpp title="Stampa Elegante"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Se quanto sopra ti sembra confuso, puoi semplicemente usare lo stile più familiare usando print e println. Tuttavia, questo diventa un po' fastidioso quando ci sono molti valori da stampare.

```Cpp title="Stampa Regolare"
Serial.print("Ax:");
Serial.println(ay);
// ecc
```

Infine, c'è di nuovo un breve ritardo prima di ricominciare il loop. Questo serve principalmente a garantire che l'output sia leggibile - senza un ritardo i numeri cambierebbero così velocemente che sarebbe difficile leggerli.

L'accelerazione è letta in G, o multipli di $9.81 \text{ m}/\text{s}^2$. La velocità angolare è in unità di $\text{mrad}/\text{s}$.

:::tip[Esercizio]

Prova a identificare l'asse in base alle letture!

:::

## Rilevamento della Caduta Libera

Come esercizio, proviamo a rilevare se il dispositivo è in caduta libera. L'idea è che lanceremmo la scheda in aria, CanSat NeXT rileverebbe la caduta libera e accenderebbe il LED per un paio di secondi dopo aver rilevato un evento di caduta libera, in modo che possiamo dire che il nostro controllo è stato attivato anche dopo averlo ripreso.

Possiamo mantenere l'impostazione così com'è e concentrarci solo sul loop. Cancelliamo la vecchia funzione loop e iniziamo da capo. Solo per divertimento, leggiamo i dati usando il metodo alternativo.

```Cpp title="Lettura dell'Accelerazione"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Definiamo la caduta libera come un evento quando l'accelerazione totale è al di sotto di un valore di soglia. Possiamo calcolare l'accelerazione totale dagli assi individuali come

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Che nel codice apparirebbe in questo modo.

```Cpp title="Calcolo dell'accelerazione totale"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

E mentre questo funzionerebbe, dovremmo notare che calcolare la radice quadrata è davvero lento dal punto di vista computazionale, quindi dovremmo evitarlo se possibile. Dopotutto, potremmo semplicemente calcolare

$$a^2 = a_x^2+a_y^2+a_z^2$$

e confrontarlo con una soglia predefinita.

```Cpp title="Calcolo dell'accelerazione totale al quadrato"
float totalSquared = ax*ax+ay*ay+az*az;
```

Ora che abbiamo un valore, iniziamo a controllare il LED. Potremmo avere il LED acceso sempre quando l'accelerazione totale è al di sotto di una soglia, tuttavia sarebbe più facile leggerlo se il LED rimanesse acceso per un po' dopo il rilevamento. Un modo per farlo è creare un'altra variabile, chiamiamola LEDOnTill, dove semplicemente scriviamo il tempo fino a cui vogliamo mantenere il LED acceso.

```Cpp title="Variabile Timer"
unsigned long LEDOnTill = 0;
```

Ora possiamo aggiornare il timer se rileviamo un evento di caduta libera. Usiamo una soglia di 0.1 per ora. Arduino fornisce una funzione chiamata `millis()`, che restituisce il tempo trascorso dall'inizio del programma in millisecondi.

```Cpp title="Aggiornamento del timer"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Infine, possiamo semplicemente controllare se il tempo corrente è maggiore o minore del valore specificato in `LEDOnTill`, e controllare il LED in base a ciò. Ecco come appare la nuova funzione loop:

```Cpp title="Funzione loop per rilevare la caduta libera"
unsigned long LEDOnTill = 0;

void loop() {
  // Lettura dell'Accelerazione
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcolo dell'accelerazione totale (al quadrato)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Aggiornamento del timer se rileviamo una caduta
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Controllo del LED in base al timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Provando questo programma, puoi vedere quanto velocemente ora reagisce poiché non abbiamo un ritardo nel loop. Il LED si accende immediatamente dopo aver lasciato la mano quando viene lanciato.

:::tip[Esercizi]

1. Prova a reintrodurre il ritardo nella funzione loop. Cosa succede?
2. Attualmente non abbiamo alcuna stampa nel loop. Se aggiungi semplicemente un'istruzione di stampa al loop, l'output sarà davvero difficile da leggere e la stampa rallenterà significativamente il tempo del ciclo del loop. Puoi trovare un modo per stampare solo una volta al secondo, anche se il loop sta girando continuamente? Suggerimento: guarda come è stato implementato il timer del LED.
3. Crea il tuo esperimento, utilizzando l'accelerazione o la rotazione per rilevare un tipo di evento.

:::

---

Nella prossima lezione, lasceremo il dominio digitale e proveremo a utilizzare un diverso tipo di sensore - un misuratore di luce analogico.

[Clicca qui per la prossima lezione!](./lesson4)