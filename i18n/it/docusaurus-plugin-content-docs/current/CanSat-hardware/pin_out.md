---
sidebar_position: 4
---

# Pinouts

Questo articolo mostra i nomi dei pin utilizzati dal processore in CanSat NeXT e quali pin puoi utilizzare per estendere il tuo progetto.

# Pinout

L'immagine qui sotto mostra i pin per l'utilizzo dell'intestazione di estensione per aggiungere elettronica esterna alla scheda.

![Pinout della scheda CanSat NeXT](./img/pinout.png)

Ecco l'elenco completo dei pin utilizzati dalla scheda CanSat NeXT. L'uso interno si riferisce al pin utilizzato per le risorse a bordo, mentre l'estensione si riferisce ai pin instradati all'interfaccia di estensione. Alcuni pin, quelli per I2C e SPI, sono utilizzati sia internamente che esternamente. Il nome della libreria si riferisce a un nome macro, che può essere utilizzato al posto del numero del pin quando la libreria CanSatNeXT è stata inclusa.

| Numero Pin | Nome libreria | Nota                                                   | Interno/Esterno     |
|------------|---------------|--------------------------------------------------------|---------------------|
|          0 | BOOT          |                                                        | Usato internamente  |
|          1 | USB_UART_TX   | Usato per USB                                          | Usato internamente  |
|          3 | USB_UART_RX   | Usato per USB                                          | Usato internamente  |
|          4 | SD_CS         | Selezione chip scheda SD                               | Usato internamente  |
|          5 | LED           | Può essere usato per lampeggiare il LED a bordo        | Usato internamente  |
|         12 | GPIO12        |                                                        | Interfaccia estensione |
|         13 | MEAS_EN       | Portare alto per abilitare LDR e termistore            | Usato internamente  |
|         14 | GPIO14        | Può essere usato per leggere se la scheda SD è presente | Usato internamente  |
|         15 | GPIO15        |                                                        | Interfaccia estensione |
|         16 | GPIO16        | UART2 RX                                               | Interfaccia estensione |
|         17 | GPIO17        | UART2 TX                                               | Interfaccia estensione |
|         18 | SPI_CLK       | Usato dalla scheda SD, disponibile anche esternamente  | Entrambi            |
|         19 | SPI_MISO      | Usato dalla scheda SD, disponibile anche esternamente  | Entrambi            |
|         21 | I2C_SDA       | Usato dai sensori a bordo, disponibile anche esternamente | Entrambi            |
|         22 | I2C_SCL       | Usato dai sensori a bordo, disponibile anche esternamente | Entrambi            |
|         23 | SPI_MOSI      | Usato dalla scheda SD, disponibile anche esternamente  | Entrambi            |
|         25 | GPIO25        |                                                        | Interfaccia estensione |
|         26 | GPIO26        |                                                        | Interfaccia estensione |
|         27 | GPIO27        |                                                        | Interfaccia estensione |
|         32 | GPIO32        | ADC                                                    | Interfaccia estensione |
|         33 | GPIO33        | ADC                                                    | Interfaccia estensione |
|         34 | LDR           | ADC per il LDR a bordo                                 | Usato internamente  |
|         35 | NTC           | ADC per il termistore                                  | Usato internamente  |
|         36 | VDD           | ADC usato per monitorare la tensione di alimentazione  | Usato internamente  |
|         39 | BATT          | ADC usato per monitorare la tensione della batteria    | Usato internamente  |