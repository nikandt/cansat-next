---
sidebar_position: 4
---

# Pinbelegungen

Dieser Artikel zeigt die vom Prozessor in CanSat NeXT verwendeten Pinnamen und welche Pins Sie verwenden können, um Ihr Projekt zu erweitern.

# Pinbelegung

Das untenstehende Bild zeigt die Pins zur Verwendung des Erweiterungsheaders, um externe Elektronik an das Board anzuschließen.

![CanSat NeXT Board Pinbelegung](./img/pinout.png)

Hier ist die vollständige Liste der vom CanSat NeXT Board verwendeten Pins. Die interne Nutzung bezieht sich darauf, dass der Pin für die On-Board-Ressourcen verwendet wird, und die Erweiterung darauf, dass die Pins zur Erweiterungsschnittstelle geführt wurden. Einige Pins, die für I2C und SPI, werden sowohl intern als auch extern verwendet. Der Bibliotheksname bezieht sich auf einen Makronamen, der anstelle der Pinnummer verwendet werden kann, wenn die CanSatNeXT-Bibliothek eingebunden wurde.

| Pinnummer  | Bibliotheksname | Hinweis                                               | Intern/Extern       |
|------------|-----------------|-------------------------------------------------------|---------------------|
|          0 | BOOT            |                                                       | Intern verwendet    |
|          1 | USB_UART_TX     | Wird für USB verwendet                                | Intern verwendet    |
|          3 | USB_UART_RX     | Wird für USB verwendet                                | Intern verwendet    |
|          4 | SD_CS           | SD-Karten-Chip-Auswahl                                | Intern verwendet    |
|          5 | LED             | Kann verwendet werden, um die On-Board-LED zu blinken | Intern verwendet    |
|         12 | GPIO12          |                                                       | Erweiterungsschnittstelle |
|         13 | MEAS_EN         | High ansteuern, um LDR und Thermistor zu aktivieren   | Intern verwendet    |
|         14 | GPIO14          | Kann verwendet werden, um zu lesen, ob SD-Karte vorhanden ist | Intern verwendet    |
|         15 | GPIO15          |                                                       | Erweiterungsschnittstelle |
|         16 | GPIO16          | UART2 RX                                              | Erweiterungsschnittstelle |
|         17 | GPIO17          | UART2 TX                                              | Erweiterungsschnittstelle |
|         18 | SPI_CLK         | Wird von der SD-Karte verwendet, auch extern verfügbar | Beide               |
|         19 | SPI_MISO        | Wird von der SD-Karte verwendet, auch extern verfügbar | Beide               |
|         21 | I2C_SDA         | Wird von den On-Board-Sensoren verwendet, auch extern verfügbar | Beide               |
|         22 | I2C_SCL         | Wird von den On-Board-Sensoren verwendet, auch extern verfügbar | Beide               |
|         23 | SPI_MOSI        | Wird von der SD-Karte verwendet, auch extern verfügbar | Beide               |
|         25 | GPIO25          |                                                       | Erweiterungsschnittstelle |
|         26 | GPIO26          |                                                       | Erweiterungsschnittstelle |
|         27 | GPIO27          |                                                       | Erweiterungsschnittstelle |
|         32 | GPIO32          | ADC                                                   | Erweiterungsschnittstelle |
|         33 | GPIO33          | ADC                                                   | Erweiterungsschnittstelle |
|         34 | LDR             | ADC für den On-Board-LDR                              | Intern verwendet    |
|         35 | NTC             | ADC für den Thermistor                                | Intern verwendet    |
|         36 | VDD             | ADC zur Überwachung der Versorgungsspannung           | Intern verwendet    |
|         39 | BATT            | ADC zur Überwachung der Batteriespannung              | Intern verwendet    |