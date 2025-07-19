---
sidebar_position: 4
---

# Kiosztások

Ez a cikk bemutatja a CanSat NeXT processzor által használt lábneveket, valamint azt, hogy mely lábakat használhatod a projekted bővítésére.

# Kiosztás

Az alábbi kép a bővítőfej használatához szükséges lábakat mutatja, amelyek külső elektronika hozzáadására szolgálnak az áramköri laphoz.

![CanSat NeXT board pinout](./img/pinout.png)

Itt található a CanSat NeXT áramköri lap által használt lábak teljes listája. A belső használat arra utal, hogy a láb az áramköri lap erőforrásaihoz van használva, míg a bővítés azt jelenti, hogy a lábak a bővítő interfészhez vannak vezetve. Néhány láb, mint például az I2C és SPI, mind belső, mind külső használatra van. A könyvtár neve egy makró névre utal, amely a lábszám helyett használható, amikor a CanSatNeXT könyvtár be van vonva.

| Láb Szám | Könyvtár neve | Megjegyzés                                              | Belső/Külső         |
|----------|---------------|----------------------------------------------------------|---------------------|
|        0 | BOOT          |                                                          | Belső használatban  |
|        1 | USB_UART_TX   | USB-hez használva                                        | Belső használatban  |
|        3 | USB_UART_RX   | USB-hez használva                                        | Belső használatban  |
|        4 | SD_CS         | SD kártya chip kiválasztás                               | Belső használatban  |
|        5 | LED           | Használható a fedélzeti LED villogtatására               | Belső használatban  |
|       12 | GPIO12        |                                                          | Bővítő interfész    |
|       13 | MEAS_EN       | Magasra hajtva engedélyezi az LDR-t és a termisztort     | Belső használatban  |
|       14 | GPIO14        | Használható az SD-kártya jelenlétének érzékelésére       | Belső használatban  |
|       15 | GPIO15        |                                                          | Bővítő interfész    |
|       16 | GPIO16        | UART2 RX                                                 | Bővítő interfész    |
|       17 | GPIO17        | UART2 TX                                                 | Bővítő interfész    |
|       18 | SPI_CLK       | Az SD-kártya használja, külsőleg is elérhető             | Mindkettő           |
|       19 | SPI_MISO      | Az SD-kártya használja, külsőleg is elérhető             | Mindkettő           |
|       21 | I2C_SDA       | A fedélzeti szenzorok használják, külsőleg is elérhető   | Mindkettő           |
|       22 | I2C_SCL       | A fedélzeti szenzorok használják, külsőleg is elérhető   | Mindkettő           |
|       23 | SPI_MOSI      | Az SD-kártya használja, külsőleg is elérhető             | Mindkettő           |
|       25 | GPIO25        |                                                          | Bővítő interfész    |
|       26 | GPIO26        |                                                          | Bővítő interfész    |
|       27 | GPIO27        |                                                          | Bővítő interfész    |
|       32 | GPIO32        | ADC                                                      | Bővítő interfész    |
|       33 | GPIO33        | ADC                                                      | Bővítő interfész    |
|       34 | LDR           | ADC a fedélzeti LDR-hez                                  | Belső használatban  |
|       35 | NTC           | ADC a termisztorhoz                                      | Belső használatban  |
|       36 | VDD           | ADC a tápfeszültség figyelésére                          | Belső használatban  |
|       39 | BATT          | ADC az akkumulátor feszültségének figyelésére            | Belső használatban  |