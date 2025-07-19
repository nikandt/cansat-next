---
sidebar_position: 4
---

# Pinoutit

Tässä artikkelissa esitetään CanSat NeXT -prosessorin käyttämät pinnit sekä näytetään, mitä pinnejä voit käyttää projektisi laajentamiseen.

# Pinout

Alla oleva kuva näyttää laajennusliittimen pinnit ulkoisten elektroniikkakomponenttien lisäämiseen piirilevylle.

![CanSat NeXT board pinout](./img/pinout.png)

Tässä on täydellinen luettelo CanSat NeXT -piirilevyn käyttämistä pinneistä. Sisäinen käyttö viittaa siihen, että pinniä käytetään piirilevyn resursseihin, ja laajennus viittaa pinneihin, jotka on reititetty laajennusliitäntään. Jotkut pinnit, kuten I2C ja SPI, ovat käytössä sekä sisäisesti että ulkoisesti. Kirjaston nimi viittaa makronimeen, jota voidaan käyttää pinnin numeron sijasta, kun CanSatNeXT-kirjasto on sisällytetty.

| Pin-numero | Kirjaston nimi | Huomautus                                              | Sisäinen/Ulkoisesti |
|------------|----------------|--------------------------------------------------------|---------------------|
|          0 | BOOT           |                                                        | Käytössä sisäisesti |
|          1 | USB_UART_TX    | Käytetään USB:lle                                      | Käytössä sisäisesti |
|          3 | USB_UART_RX    | Käytetään USB:lle                                      | Käytössä sisäisesti |
|          4 | SD_CS          | SD-kortin siruvalinta                                  | Käytössä sisäisesti |
|          5 | LED            | Voidaan käyttää vilkuttamaan piirilevyn LED:iä         | Käytössä sisäisesti |
|         12 | GPIO12         |                                                        | Laajennusliitäntä   |
|         13 | MEAS_EN        | Aja korkealle aktivoidaksesi LDR ja termistorin        | Käytössä sisäisesti |
|         14 | GPIO14         | Voidaan käyttää lukemaan, onko SD-kortti paikallaan    | Käytössä sisäisesti |
|         15 | GPIO15         |                                                        | Laajennusliitäntä   |
|         16 | GPIO16         | UART2 RX                                               | Laajennusliitäntä   |
|         17 | GPIO17         | UART2 TX                                               | Laajennusliitäntä   |
|         18 | SPI_CLK        | Käytössä SD-kortilla, saatavilla myös ulkoisesti       | Molemmat            |
|         19 | SPI_MISO       | Käytössä SD-kortilla, saatavilla myös ulkoisesti       | Molemmat            |
|         21 | I2C_SDA        | Käytössä piirilevyn antureilla, saatavilla myös ulkoisesti | Molemmat        |
|         22 | I2C_SCL        | Käytössä piirilevyn antureilla, saatavilla myös ulkoisesti | Molemmat        |
|         23 | SPI_MOSI       | Käytössä SD-kortilla, saatavilla myös ulkoisesti       | Molemmat            |
|         25 | GPIO25         |                                                        | Laajennusliitäntä   |
|         26 | GPIO26         |                                                        | Laajennusliitäntä   |
|         27 | GPIO27         |                                                        | Laajennusliitäntä   |
|         32 | GPIO32         | ADC                                                    | Laajennusliitäntä   |
|         33 | GPIO33         | ADC                                                    | Laajennusliitäntä   |
|         34 | LDR            | ADC piirilevyn LDR:lle                                 | Käytössä sisäisesti |
|         35 | NTC            | ADC termistorille                                      | Käytössä sisäisesti |
|         36 | VDD            | ADC käytetään syöttöjännitteen valvontaan              | Käytössä sisäisesti |
|         39 | BATT           | ADC käytetään akun jännitteen valvontaan               | Käytössä sisäisesti |