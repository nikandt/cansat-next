---
sidebar_position: 4
---

# Brochages

Cet article montre les noms des broches utilisés par le processeur dans CanSat NeXT, ainsi que les broches que vous pouvez utiliser pour étendre votre projet.

# Brochage

L'image ci-dessous montre les broches pour utiliser l'en-tête d'extension pour ajouter des composants électroniques externes à la carte.

![Brochage de la carte CanSat NeXT](./img/pinout.png)

Voici la liste complète des broches utilisées par la carte CanSat NeXT. L'utilisation interne fait référence à la broche utilisée pour les ressources embarquées, et l'extension fait référence aux broches ayant été routées vers l'interface d'extension. Certaines broches, celles pour I2C et SPI, sont utilisées à la fois en interne et en externe. Le nom de la bibliothèque fait référence à un nom de macro, qui peut être utilisé à la place du numéro de broche lorsque la bibliothèque CanSatNeXT a été incluse.

| Numéro de broche | Nom de la bibliothèque | Remarque                                                | Interne/Externe     |
|------------------|------------------------|---------------------------------------------------------|---------------------|
|                0 | BOOT                   |                                                         | Utilisé en interne  |
|                1 | USB_UART_TX            | Utilisé pour USB                                        | Utilisé en interne  |
|                3 | USB_UART_RX            | Utilisé pour USB                                        | Utilisé en interne  |
|                4 | SD_CS                  | Sélection de puce de la carte SD                         | Utilisé en interne  |
|                5 | LED                    | Peut être utilisé pour faire clignoter la LED embarquée  | Utilisé en interne  |
|               12 | GPIO12                 |                                                         | Interface d'extension |
|               13 | MEAS_EN                | Mettre à haut pour activer LDR et thermistor             | Utilisé en interne  |
|               14 | GPIO14                 | Peut être utilisé pour vérifier si la carte SD est en place | Utilisé en interne  |
|               15 | GPIO15                 |                                                         | Interface d'extension |
|               16 | GPIO16                 | UART2 RX                                                | Interface d'extension |
|               17 | GPIO17                 | UART2 TX                                                | Interface d'extension |
|               18 | SPI_CLK                | Utilisé par la carte SD, également disponible en externe | Les deux            |
|               19 | SPI_MISO               | Utilisé par la carte SD, également disponible en externe | Les deux            |
|               21 | I2C_SDA                | Utilisé par les capteurs embarqués, également disponible en externe | Les deux            |
|               22 | I2C_SCL                | Utilisé par les capteurs embarqués, également disponible en externe | Les deux            |
|               23 | SPI_MOSI               | Utilisé par la carte SD, également disponible en externe | Les deux            |
|               25 | GPIO25                 |                                                         | Interface d'extension |
|               26 | GPIO26                 |                                                         | Interface d'extension |
|               27 | GPIO27                 |                                                         | Interface d'extension |
|               32 | GPIO32                 | ADC                                                     | Interface d'extension |
|               33 | GPIO33                 | ADC                                                     | Interface d'extension |
|               34 | LDR                    | ADC pour le LDR embarqué                                | Utilisé en interne  |
|               35 | NTC                    | ADC pour le thermistor                                  | Utilisé en interne  |
|               36 | VDD                    | ADC utilisé pour surveiller la tension d'alimentation    | Utilisé en interne  |
|               39 | BATT                   | ADC utilisé pour surveiller la tension de la batterie    | Utilisé en interne  |