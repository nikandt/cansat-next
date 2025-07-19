---
sidebar_position: 4
---

# Pinoutid

See artikkel näitab CanSat NeXT protsessori kasutatavaid pin-nimesid ning milliseid pinne saate oma projekti laiendamiseks kasutada.

# Pinout

Allolev pilt näitab pinne, mida saab kasutada laienduspeaga, et lisada plaadile väliseid elektroonikaseadmeid.

![CanSat NeXT plaadi pinout](./img/pinout.png)

Siin on täielik nimekiri CanSat NeXT plaadi kasutatavatest pinnidest. Sisemine kasutus viitab pinnile, mida kasutatakse pardal olevate ressursside jaoks, ja laiendus viitab pinnidele, mis on suunatud laiendusliidesesse. Mõned pinnid, nagu I2C ja SPI, on kasutusel nii sisemiselt kui ka väliselt. Raamatukogu nimi viitab makro nimele, mida saab kasutada pinni numbri asemel, kui CanSatNeXT raamatukogu on lisatud.

| Pin Number | Library name | Note                                                    | Internal/External   |
|------------|--------------|---------------------------------------------------------|---------------------|
|          0 | BOOT         |                                                         | Used internally     |
|          1 | USB_UART_TX  | Used for USB                                            | Used internally     |
|          3 | USB_UART_RX  | Used for USB                                            | Used internally     |
|          4 | SD_CS        | SD kaardi kiibi valik                                   | Used internally     |
|          5 | LED          | Saab kasutada pardal oleva LEDi vilgutamiseks           | Used internally     |
|         12 | GPIO12       |                                                         | Extension interface |
|         13 | MEAS_EN      | Kõrgeks ajamine LDR ja termistori lubamiseks            | Used internally     |
|         14 | GPIO14       | Saab kasutada SD-kaardi olemasolu lugemiseks            | Used internally     |
|         15 | GPIO15       |                                                         | Extension interface |
|         16 | GPIO16       | UART2 RX                                                | Extension interface |
|         17 | GPIO17       | UART2 TX                                                | Extension interface |
|         18 | SPI_CLK      | Kasutatakse SD-kaardi poolt, saadaval ka väliselt       | Both                |
|         19 | SPI_MISO     | Kasutatakse SD-kaardi poolt, saadaval ka väliselt       | Both                |
|         21 | I2C_SDA      | Kasutatakse pardal olevate andurite poolt, saadaval ka väliselt | Both                |
|         22 | I2C_SCL      | Kasutatakse pardal olevate andurite poolt, saadaval ka väliselt | Both                |
|         23 | SPI_MOSI     | Kasutatakse SD-kaardi poolt, saadaval ka väliselt       | Both                |
|         25 | GPIO25       |                                                         | Extension interface |
|         26 | GPIO26       |                                                         | Extension interface |
|         27 | GPIO27       |                                                         | Extension interface |
|         32 | GPIO32       | ADC                                                     | Extension interface |
|         33 | GPIO33       | ADC                                                     | Extension interface |
|         34 | LDR          | ADC pardal oleva LDR jaoks                              | Used internally     |
|         35 | NTC          | ADC termistori jaoks                                    | Used internally     |
|         36 | VDD          | ADC toitepinge jälgimiseks                              | Used internally     |
|         39 | BATT         | ADC aku pinge jälgimiseks                               | Used internally     |