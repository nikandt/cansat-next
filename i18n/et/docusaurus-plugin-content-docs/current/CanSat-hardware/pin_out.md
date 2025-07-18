---
Külgriba_positsioon: 4
---

# Pinouts

See artikkel näitab CanSatis järgmisena kasutatud PIN -nimesid, samuti näitab, milliseid tihvte saate oma projekti laiendamiseks kasutada.

# Pinout

Alloleval pildil on esitatud tihvtid pikenduspäise kasutamiseks välise elektroonika lisamiseks tahvlile.

! [Cansat järgmine tahvel pinout] (./ img/pinout.png)

Siin on CanSat järgmise tahvli kasutatud tihvtide täielik loetelu. Sisemine kasutamine viitab pardal olevate ressursside jaoks kasutatava tihvtiga ja laiendus viitab tihvtide jaoks, mis on suunatud pikendusliidesesse. Mõningaid tihvte, I2C ja SPI jaoks, kasutatakse nii sisemiselt kui ka väliselt. Raamatukogu nimi viitab makronimele, mida saab kasutada PIN -numbri asemel, kui CanSatNext teek on lisatud.

| Pin number | Raamatukogu nimi | Märkus | Sisemine/väline |
| ------------ | -------------- | ------------------------------------------------------------- | --------------------- |
|          0 | Saabas |                                                         | Kasutatakse sisemiselt |
|          1 | USB_UART_TX | Kasutatud USB jaoks | Kasutatakse sisemiselt |
|          3 | USB_UART_RX | Kasutatud USB jaoks | Kasutatakse sisemiselt |
|          4 | SD_CS | SD -kaardikiip Select | Kasutatakse sisemiselt |
|          5 | LED | Saab kasutada pardal LED-i vilkumiseks | Kasutatakse sisemiselt |
|         12 | GPIO12 |                                                         | Pikenduse liides |
|         13 | METY_EN | Sõitke kõrgele LDR ja termistori võimaldamiseks | Kasutatakse sisemiselt |
|         14 | GPIO14 | Saab kasutada lugemiseks, kui SD-CARD on paigas | Kasutatakse sisemiselt |
|         15 | GPIO15 |                                                         | Pikenduse liides |
|         16 | GPIO16 | UART2 rx | Pikenduse liides |
|         17 | GPIO17 | UART2 TX | Pikenduse liides |
|         18 | Spi_CLK | Kasutab SD-CARD, saadaval ka väliselt | Mõlemad |
|         19 | Spi_miso | Kasutab SD-CARD, saadaval ka väliselt | Mõlemad |
|         21 | I2c_sda | Kasutab pardaandurid, saadaval ka väliselt | Mõlemad |
|         22 | I2c_scl | Kasutab pardaandurid, saadaval ka väliselt | Mõlemad |
|         23 | Spi_mosi | Kasutab SD-CARD, saadaval ka väliselt | Mõlemad |
|         25 | GPIO25 |                                                         | Pikenduse liides |
|         26 | GPIO26 |                                                         | Pikenduse liides |
|         27 | GPIO27 |                                                         | Pikenduse liides |
|         32 | GPIO32 | ADC | Pikenduse liides |
|         33 | GPIO33 | ADC | Pikenduse liides |
|         34 | LDR | ADC pardal LDR | Kasutatakse sisemiselt |
|         35 | NTC | ADC termistori jaoks | Kasutatakse sisemiselt |
|         36 | VDD | ADC kasutati toitepinge jälgimiseks | Kasutatakse sisemiselt |
|         39 | Batt | ADC kasutati aku pinge jälgimiseks | Kasutatakse sisemiselt |