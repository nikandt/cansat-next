---
sidebar_position: 5
---

# Lezione 5: Salvare Bit & Byte

A volte ottenere i dati direttamente su un PC non è fattibile, come quando stiamo lanciando il dispositivo, lanciandolo con un razzo o prendendo misurazioni in luoghi difficili da raggiungere. In tali casi, è meglio salvare i dati misurati su una scheda SD per un'elaborazione successiva. Inoltre, la scheda SD può essere utilizzata anche per memorizzare impostazioni - ad esempio potremmo avere un tipo di impostazione di soglia o impostazioni di indirizzo memorizzate sulla scheda SD.

## Scheda SD nella libreria CanSat NeXT

La libreria CanSat NeXT supporta un'ampia gamma di operazioni con le schede SD. Può essere utilizzata per salvare e leggere file, ma anche per creare directory e nuovi file, spostarli o persino eliminarli. Tutto ciò potrebbe essere utile in varie circostanze, ma concentriamoci qui sulle due cose di base - leggere un file e scrivere dati su un file.

:::note

Se desideri il pieno controllo del filesystem, puoi trovare i comandi nella [Specificazione della Libreria](./../CanSat-software/library_specification.md#sdcardpresent) o nell'esempio della libreria "SD_advanced".

:::

Come esercizio, modifichiamo il codice della lezione precedente in modo che invece di scrivere le misurazioni LDR sulla seriale, le salveremo sulla scheda SD.

Per prima cosa, definiamo il nome del file che utilizzeremo. Aggiungiamolo prima della funzione setup come **variabile globale**.

```Cpp title="Setup Modificato"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Ora che abbiamo un filepath, possiamo scrivere sulla scheda SD. Ci servono solo due righe per farlo. Il comando migliore da usare per salvare i dati di misurazione è `appendFile()`, che prende semplicemente il filepath e scrive i nuovi dati alla fine del file. Se il file non esiste, lo crea. Questo rende l'uso del comando molto semplice (e sicuro). Possiamo semplicemente aggiungere direttamente i dati e poi seguire con un cambio di linea in modo che i dati siano più facili da leggere. E questo è tutto! Ora stiamo memorizzando le misurazioni.

```Cpp title="Salvare i dati LDR sulla scheda SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("Valore LDR:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Per impostazione predefinita, il comando `appendFile()` memorizza i numeri in virgola mobile con due valori dopo il punto decimale. Per una funzionalità più specifica, potresti prima creare una stringa nello sketch e usare il comando `appendFile()` per memorizzare quella stringa sulla scheda SD. Quindi, ad esempio:

```Cpp title="Salvare i dati LDR sulla scheda SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Qui la stringa finale viene creata per prima, con `String(LDR_voltage, 6)` che specifica che vogliamo 6 decimali dopo il punto. Possiamo usare la stessa stringa per stampare e memorizzare i dati. (Così come trasmetterli via radio)

## Lettura dei Dati

È spesso utile memorizzare qualcosa sulla scheda SD per un uso futuro nel programma. Questi potrebbero essere, ad esempio, impostazioni sullo stato attuale del dispositivo, in modo che se il programma si resetta, possiamo caricare nuovamente lo stato attuale dalla scheda SD invece di partire dai valori predefiniti.

Per dimostrare questo, aggiungi sul PC un nuovo file alla scheda SD chiamato "delay_time" e scrivi un numero nel file, come 200. Proviamo a sostituire il tempo di ritardo impostato staticamente nel nostro programma con un'impostazione letta da un file.

Proviamo a leggere il file di impostazione nel setup. Per prima cosa, introduciamo una nuova variabile globale. Le ho dato un valore predefinito di 1000, in modo che se non riusciamo a modificare il tempo di ritardo, questo è ora l'impostazione predefinita.

Nel setup, dovremmo prima controllare se il file esiste. Questo può essere fatto usando il comando `fileExists()`. Se non esiste, usiamo semplicemente il valore predefinito. Dopo di ciò, i dati possono essere letti usando `readFile()`. Tuttavia, dovremmo notare che è una stringa - non un intero come ci serve. Quindi, convertiamolo usando il comando Arduino `toInt()`. Infine, controlliamo se la conversione è stata effettuata con successo. Se non lo è stata, il valore sarà zero, nel qual caso continueremo a usare il valore predefinito.

```Cpp title="Lettura di un'impostazione nel setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Infine, non dimenticare di cambiare il ritardo nel loop per usare la nuova variabile.

```Cpp title="Valore di ritardo impostato dinamicamente"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Ora puoi provare a cambiare il valore sulla scheda SD, o persino rimuovere la scheda SD, nel qual caso dovrebbe ora usare il valore predefinito per la lunghezza del ritardo.

:::note

Per riscrivere l'impostazione nel tuo programma, puoi usare il comando [writeFile](./../CanSat-software/library_specification.md#writefile). Funziona proprio come [appendFile](./../CanSat-software/library_specification.md#appendfile), ma sovrascrive qualsiasi dato esistente.

:::

:::tip[Exercise]

Continua dalla tua soluzione all'esercizio nella lezione 4, in modo che lo stato venga mantenuto anche se il dispositivo viene resettato. Cioè, memorizza lo stato attuale sulla scheda SD e leggilo nel setup. Questo simulerebbe uno scenario in cui il tuo CanSat si resetta improvvisamente in volo o prima del volo, e con questo programma otterresti comunque un volo di successo.

:::

---

Nella prossima lezione, vedremo come utilizzare la radio per trasmettere dati tra processori. Dovresti avere un qualche tipo di antenna nel tuo CanSat NeXT e nella stazione di terra prima di iniziare quegli esercizi. Se non l'hai già fatto, dai un'occhiata al tutorial per costruire un'antenna di base: [Costruire un'antenna](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

[Clicca qui per la prossima lezione!](./lesson6)