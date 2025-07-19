---
sidebar_position: 2
---

# Lezione 2: Sentire la Pressione

In questa seconda lezione, inizieremo a utilizzare i sensori sulla scheda CanSat NeXT. Questa volta ci concentreremo sulla misurazione della pressione atmosferica circostante. Utilizzeremo il barometro integrato [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) per leggere la pressione, così come per leggere la temperatura del barometro stesso.

Iniziamo dal codice del barometro negli esempi della libreria. In Arduino IDE, seleziona File-> Esempi->CanSat NeXT->Baro.

L'inizio del programma sembra abbastanza familiare dalla lezione precedente. Ancora una volta, iniziamo includendo la libreria CanSat NeXT, configurando la connessione seriale e inizializzando i sistemi CanSat NeXT.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Inizializza la seriale
  Serial.begin(115200);

  // Inizializza i sistemi integrati di CanSatNeXT
  CanSatInit();
}
```

La chiamata alla funzione `CanSatInit()` inizializza tutti i sensori per noi, incluso il barometro. Quindi, possiamo iniziare a usarlo nella funzione loop.

Le due righe seguenti sono dove la temperatura e la pressione vengono effettivamente lette. Quando le funzioni `readTemperature()` e `readPressure()` vengono chiamate, il processore invia un comando al barometro, che misura la pressione o la temperatura, e restituisce il risultato al processore.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

Nell'esempio, i valori vengono stampati, e poi segue un ritardo di 1000 ms, in modo che il loop si ripeta approssimativamente una volta al secondo.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");

delay(1000);
```

### Utilizzare i dati

Possiamo anche utilizzare i dati nel codice, piuttosto che solo stamparli o salvarli. Ad esempio, potremmo creare un codice che rileva se la pressione scende di una certa quantità, e per esempio accendere il LED. O qualsiasi altra cosa tu voglia fare. Proviamo ad accendere il LED integrato.

Per implementare questo, dobbiamo modificare leggermente il codice nell'esempio. Per prima cosa, iniziamo a tracciare il valore di pressione precedente. Per creare **variabili globali**, cioè quelle che non esistono solo mentre stiamo eseguendo una funzione specifica, puoi semplicemente scriverle al di fuori di qualsiasi funzione specifica. La variabile previousPressure viene aggiornata a ogni ciclo della funzione loop, proprio alla fine. In questo modo teniamo traccia del vecchio valore e possiamo confrontarlo con il valore più recente.

Possiamo usare un'istruzione if per confrontare i vecchi e nuovi valori. Nel codice seguente, l'idea è che se la pressione precedente è 0,1 hPa inferiore al nuovo valore, accenderemo il LED, altrimenti il LED rimane spento.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // leggi la temperatura in una variabile float
  float t = readTemperature();

  // leggi la pressione in un float
  float p = readPressure(); 

  // Stampa la pressione e la temperatura
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Attendi un secondo prima di ricominciare il loop
  delay(1000);

  previousPressure = p;
}
```

Se carichi questo loop modificato sul CanSat NeXT, dovrebbe stampare i valori delle variabili come prima, ma ora anche cercare il calo di pressione. La pressione atmosferica scende di circa 0,12 hPa / metro quando si sale, quindi se provi a sollevare rapidamente il CanSat NeXT di un metro, il LED dovrebbe accendersi per un ciclo di loop (1 secondo), e poi spegnersi di nuovo. Probabilmente è meglio scollegare il cavo USB prima di provare questo!

Puoi anche provare a modificare il codice. Cosa succede se il ritardo viene cambiato? E se l'**isteresi** di 0,1 hPa viene cambiata o addirittura completamente rimossa?

---

Nella prossima lezione, faremo ancora più attività fisica, mentre proviamo a utilizzare l'altro sensore integrato - l'unità di misura inerziale.

[Clicca qui per la prossima lezione!](./lesson3)