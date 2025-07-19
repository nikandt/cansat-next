---
sidebar_position: 2
---

# Interface d'extension

Des dispositifs personnalisés peuvent être construits et utilisés avec CanSat. Ceux-ci peuvent être utilisés pour réaliser des projets intéressants, pour lesquels vous pouvez trouver des idées sur notre [Blog](/blog).

L'interface d'extension de CanSat dispose d'une ligne UART libre, de deux broches ADC et de 5 broches d'E/S numériques libres. De plus, les lignes SPI et I2C sont disponibles pour l'interface d'extension, bien qu'elles soient partagées avec la carte SD et l'ensemble de capteurs, respectivement.

L'utilisateur peut également choisir d'utiliser les broches UART2 et ADC comme E/S numériques, au cas où la communication série ou la conversion analogique-numérique ne serait pas nécessaire dans leur solution.

| Numéro de broche | Nom de la broche | Utilisation comme | Remarques                  |
|------------------|------------------|-------------------|----------------------------|
| 12               | GPIO12           | E/S numérique     | Libre                      |
| 15               | GPIO15           | E/S numérique     | Libre                      |
| 16               | GPIO16           | UART2 RX          | Libre                      |
| 17               | GPIO17           | UART2 TX          | Libre                      |
| 18               | SPI_CLK          | SPI CLK           | Co-utilisation avec carte SD|
| 19               | SPI_MISO         | SPI MISO          | Co-utilisation avec carte SD|
| 21               | I2C_SDA          | I2C SDA           | Co-utilisation avec ensemble de capteurs |
| 22               | I2C_SCL          | I2C SCL           | Co-utilisation avec ensemble de capteurs |
| 23               | SPI_MOSI         | SPI MOSI          | Co-utilisation avec carte SD|
| 25               | GPIO25           | E/S numérique     | Libre                      |
| 26               | GPIO26           | E/S numérique     | Libre                      |
| 27               | GPIO27           | E/S numérique     | Libre                      |
| 32               | GPIO32           | ADC               | Libre                      |
| 33               | GPIO33           | ADC               | Libre                      |

*Tableau : Tableau de recherche des broches de l'interface d'extension. Le nom de la broche se réfère au nom de la broche de la bibliothèque.*

# Options de communication

La bibliothèque CanSat n'inclut pas de wrappers de communication pour les dispositifs personnalisés. Pour la communication UART, I2C et SPI entre CanSat NeXT et votre dispositif de charge utile personnalisé, référez-vous aux bibliothèques par défaut d'Arduino [UART](https://docs.arduino.cc/learn/communication/uart/), [Wire](https://docs.arduino.cc/learn/communication/wire/), et [SPI](https://docs.arduino.cc/learn/communication/spi/), respectivement.

## UART

La ligne UART2 est une bonne alternative car elle sert d'interface de communication non allouée pour les charges utiles étendues.

Pour envoyer des données via la ligne UART, veuillez vous référer à l'Arduino

```
       CanSat NeXT
          ESP32                          Dispositif de l'utilisateur
   +----------------+                 +----------------+
   |                |   TX (Transmit) |                |
   |       TX  o----|---------------->| RX  (Receive)  |
   |                |                 |                |
   |       RX  o<---|<----------------| TX             |
   |                |   GND (Ground)  |                |
   |       GND  o---|-----------------| GND            |
   +----------------+                 +----------------+
```
*Image : Protocole UART en ASCII*


## I2C

L'utilisation de l'I2C est prise en charge, mais l'utilisateur doit garder à l'esprit qu'un autre sous-système existe sur la ligne.

Avec plusieurs esclaves I2C, le code utilisateur doit spécifier quel esclave I2C le CanSat utilise à un moment donné. Cela se distingue par une adresse esclave, qui est un code hexadécimal unique pour chaque dispositif et peut être trouvé dans la fiche technique du dispositif du sous-système.

## SPI

L'utilisation du SPI est également prise en charge, mais l'utilisateur doit garder à l'esprit qu'un autre sous-système existe sur la ligne.

Avec le SPI, la distinction des esclaves est faite en spécifiant une broche de sélection de puce. L'utilisateur doit dédier l'une des broches GPIO libres pour être une sélection de puce pour leur dispositif de charge utile étendu personnalisé. La broche de sélection de puce de la carte SD est définie dans le fichier de bibliothèque ``CanSatPins.h`` comme ``SD_CS``.

![Bus I2C CanSat NeXT.](./img/i2c_bus2.png)

*Image : le bus I2C CanSat NeXT avec plusieurs sous-systèmes secondaires, ou "esclaves". Dans ce contexte, l'ensemble de capteurs est l'un des sous-systèmes esclaves.*

![Bus SPI CanSat NeXT.](./img/spi_bus.png)

*Image : la configuration du bus SPI CanSat NeXT lorsque deux sous-systèmes secondaires, ou "esclaves", sont présents. Dans ce contexte, la carte SD est l'un des sous-systèmes esclaves.*