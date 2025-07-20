---
sidebar_position: 12
---

# Leçon 11 : Le Satellite Doit Grandir

Bien que le CanSat NeXT dispose déjà de nombreux capteurs et dispositifs intégrés sur la carte satellite elle-même, de nombreuses missions CanSat passionnantes nécessitent l'utilisation d'autres capteurs externes, servos, caméras, moteurs ou autres actionneurs et dispositifs. Cette leçon est légèrement différente des précédentes, car nous discuterons de l'intégration de divers dispositifs externes au CanSat. Votre cas d'utilisation réel n'est probablement pas pris en compte, mais peut-être que quelque chose de similaire l'est. Cependant, si vous pensez qu'il y a quelque chose qui devrait être couvert ici, n'hésitez pas à m'envoyer vos commentaires à samuli@kitsat.fi.

Cette leçon est légèrement différente des précédentes, car bien que toutes les informations soient utiles, vous devriez vous sentir libre de passer aux domaines qui sont pertinents pour votre projet spécifique et d'utiliser cette page comme référence. Cependant, avant de continuer cette leçon, veuillez parcourir les documents présentés dans la section [matériel](./../CanSat-hardware/CanSat-hardware.md) de la documentation CanSat NeXT, car elle couvre beaucoup d'informations nécessaires pour intégrer des dispositifs externes.

## Connecter des dispositifs externes

Il existe deux excellentes façons de connecter des dispositifs externes au CanSat NeXT : en utilisant des [plaques de prototypage](../CanSat-accessories/CanSat-NeXT-perf.md) et des PCB personnalisés. Fabriquer votre propre PCB est plus facile (et moins cher) que vous ne le pensez, et pour commencer, un bon point de départ est ce [tutoriel KiCAD](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Nous avons également un [modèle](../CanSat-hardware/mechanical_design#custom-PCB) disponible pour KiCAD, ce qui rend très facile la fabrication de vos cartes au même format.

Cela dit, pour la plupart des missions CanSat, souder les capteurs externes ou autres dispositifs sur une plaque de prototypage est un excellent moyen de créer des piles électroniques fiables et robustes.

Un moyen encore plus simple de commencer, surtout lors des premiers prototypes, est d'utiliser des câbles de raccordement (également appelés câbles Dupont ou fils de plaque d'essai). Ils sont généralement même fournis avec les capteurs, mais peuvent également être achetés séparément. Ils partagent le même pas de 0,1 pouce utilisé par le connecteur d'extension, ce qui rend très facile la connexion des dispositifs avec des câbles. Cependant, bien que les câbles soient faciles à utiliser, ils sont plutôt encombrants et peu fiables. Pour cette raison, il est fortement recommandé d'éviter les câbles pour le modèle de vol de votre CanSat.

## Partager l'alimentation avec les dispositifs

Le CanSat NeXT utilise 3,3 volts pour tous ses propres dispositifs, c'est pourquoi c'est la seule ligne de tension fournie au connecteur d'extension. De nombreux capteurs commerciaux, en particulier les plus anciens, prennent également en charge le fonctionnement à 5 volts, car c'est la tension utilisée par les anciens Arduinos. Cependant, la grande majorité des dispositifs prennent également en charge le fonctionnement directement à 3,3 volts.

Pour les rares cas où 5 volts sont absolument nécessaires, vous pouvez inclure un **convertisseur boost** sur la carte. Il existe des modules prêts à l'emploi disponibles, mais vous pouvez également souder directement de nombreux dispositifs sur la plaque de prototypage. Cela dit, essayez d'abord d'utiliser le dispositif à partir de 3,3 volts, car il y a de bonnes chances qu'il fonctionne.

Le courant maximal recommandé à tirer de la ligne de 3,3 volts est de 300 mA, donc pour les dispositifs gourmands en courant tels que les moteurs ou les chauffages, envisagez une source d'alimentation externe.

## Lignes de données

Le connecteur d'extension comporte un total de 16 broches, dont deux sont réservées aux lignes de masse et d'alimentation. Le reste sont différents types d'entrées et de sorties, dont la plupart ont plusieurs utilisations possibles. Le schéma de brochage de la carte montre ce que chacune des broches peut faire.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Toutes les broches exposées peuvent être utilisées comme entrées et sorties à usage général (GPIO), ce qui signifie que vous pouvez effectuer les fonctions `digitalWrite` et `digitalRead` avec elles dans le code.

### ADC

Les broches 33 et 32 ont un convertisseur analogique-numérique (ADC), ce qui signifie que vous pouvez utiliser `analogRead` (et `adcToVoltage`) pour lire la tension sur cette broche.

### DAC

Ces broches peuvent être utilisées pour créer une tension spécifique sur la sortie. Notez qu'elles produisent la tension souhaitée, mais elles ne peuvent fournir qu'une très petite quantité de courant. Elles pourraient être utilisées comme points de référence pour les capteurs, ou même comme sortie audio, cependant vous aurez besoin d'un amplificateur (ou deux). Vous pouvez utiliser `dacWrite` pour écrire la tension. Il y a aussi un exemple dans la bibliothèque CanSat pour cela.

### SPI

Le Serial Peripheral Interface (SPI) est une ligne de données standard, souvent utilisée par les capteurs Arduino et les dispositifs similaires. Un dispositif SPI nécessite quatre broches :

| **Nom de la broche** | **Description**                                              | **Utilisation**                                                       |
|----------------------|--------------------------------------------------------------|-----------------------------------------------------------------------|
| **MOSI**             | Main Out Secondary In                                         | Données envoyées du dispositif principal (par exemple, CanSat) au dispositif secondaire. |
| **MISO**             | Main In Secondary Out                                         | Données envoyées du dispositif secondaire au dispositif principal.      |
| **SCK**              | Serial Clock                                                  | Signal d'horloge généré par le dispositif principal pour synchroniser la communication. |
| **SS/CS**            | Secondary Select/Chip Select                                  | Utilisé par le dispositif principal pour sélectionner le dispositif secondaire avec lequel communiquer. |

Ici, le principal est la carte CanSat NeXT, et le secondaire est le dispositif avec lequel vous souhaitez communiquer. Les broches MOSI, MISO et SCK peuvent être partagées par plusieurs secondaires, cependant chacun d'eux a besoin de sa propre broche CS. La broche CS peut être n'importe quelle broche GPIO, c'est pourquoi il n'y en a pas une dédiée dans le bus.

(Note : Les documents anciens utilisent parfois les termes "maître" et "esclave" pour désigner les dispositifs principal et secondaire. Ces termes sont maintenant considérés comme obsolètes.)

Sur la carte CanSat NeXT, la carte SD utilise la même ligne SPI que le connecteur d'extension. Lors de la connexion d'un autre dispositif SPI au bus, cela n'a pas d'importance. Cependant, si les broches SPI sont utilisées comme GPIO, la carte SD est effectivement désactivée.

Pour utiliser SPI, vous devez souvent spécifier quelles broches du processeur sont utilisées. Un exemple pourrait être comme ceci, où des **macros** incluses dans la bibliothèque CanSat sont utilisées pour définir les autres broches, et la broche 12 est définie comme sélection de puce.

```Cpp title="Initialisation de la ligne SPI pour un capteur"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Les macros `SPI_CLK`, `SPI_MOSI`, et `SPI_MISO` sont remplacées par le compilateur par 18, 23, et 19, respectivement.

### I2C

Inter-Integrated Circuit est un autre protocole de bus de données populaire, particulièrement utilisé pour les petits capteurs intégrés, tels que le capteur de pression et l'IMU sur la carte CanSat NeXT.

I2C est pratique car il ne nécessite que deux broches, SCL et SDA. Il n'y a pas de broche de sélection de puce séparée, mais à la place, les différents dispositifs sont séparés par différentes **adresses**, qui sont utilisées pour établir la communication. De cette façon, vous pouvez avoir plusieurs dispositifs sur le même bus, tant qu'ils ont tous une adresse unique.

| **Nom de la broche** | **Description**          | **Utilisation**                                                     |
|----------------------|--------------------------|---------------------------------------------------------------------|
| **SDA**              | Serial Data Line          | Ligne de données bidirectionnelle utilisée pour la communication entre les dispositifs principal et secondaire. |
| **SCL**              | Serial Clock Line         | Signal d'horloge généré par le dispositif principal pour synchroniser le transfert de données avec les dispositifs secondaires. |

Le baromètre et l'IMU sont sur le même bus I2C que le connecteur d'extension. Vérifiez les adresses de ces dispositifs sur la page [Capteurs intégrés](../CanSat-hardware/on_board_sensors#IMU). Comme pour SPI, vous pouvez utiliser ces broches pour connecter d'autres dispositifs I2C, mais si elles sont utilisées comme broches GPIO, l'IMU et le baromètre sont désactivés.

En programmation Arduino, I2C est parfois appelé `Wire`. Contrairement à SPI, où le brochage est souvent spécifié pour chaque capteur, I2C est souvent utilisé dans Arduino en établissant d'abord une ligne de données, puis en la référant pour chaque capteur. Voici un exemple de la façon dont le baromètre est initialisé par la bibliothèque CanSat NeXT :

```Cpp title="Initialisation de la deuxième ligne série"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Ainsi, un `Wire` est d'abord initialisé en lui indiquant les bonnes broches I2C. Les macros `I2C_SDA` et `I2C_SCL` définies dans la bibliothèque CanSat NeXT sont remplacées par le compilateur par 22 et 21, respectivement.

### UART

Le récepteur-transmetteur universel asynchrone (UART) est à certains égards le protocole de données le plus simple, car il envoie simplement les données sous forme binaire à une fréquence spécifiée. En tant que tel, il est limité à la communication point à point, ce qui signifie que vous ne pouvez généralement pas avoir plusieurs dispositifs sur le même bus.

| **Nom de la broche** | **Description**          | **Utilisation**                                                     |
|----------------------|--------------------------|---------------------------------------------------------------------|
| **TX**               | Transmit                  | Envoie des données du dispositif principal au dispositif secondaire.       |
| **RX**               | Receive                   | Reçoit des données du dispositif secondaire au dispositif principal.    |

Sur CanSat, l'UART dans le connecteur d'extension n'est utilisé pour rien d'autre. Il y a une autre ligne UART cependant, mais elle est utilisée pour la communication USB entre le satellite et un ordinateur. C'est ce qui est utilisé lors de l'envoi de données au `Serial`.

L'autre ligne UART peut être initialisée dans le code comme ceci :

```Cpp title="Initialisation de la deuxième ligne série"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Certains dispositifs utilisent également la [modulation de largeur d'impulsion](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) comme entrée de commande. Elle peut également être utilisée pour les LED dimmables ou pour contrôler la sortie de puissance dans certaines situations, parmi de nombreux autres cas d'utilisation.

Avec Arduino, seules certaines broches peuvent être utilisées comme PWM. Cependant, comme CanSat NeXT est un dispositif basé sur ESP32, toutes les broches de sortie peuvent être utilisées pour créer une sortie PWM. Le PWM est contrôlé avec `analogWrite`.

## Qu'en est-il de (mon cas d'utilisation spécifique) ?

Pour la plupart des dispositifs, vous pouvez trouver beaucoup d'informations sur internet. Par exemple, recherchez sur Google le capteur spécifique que vous avez, et utilisez ces documents pour modifier les exemples que vous trouvez pour les utiliser avec CanSat NeXT. De plus, les capteurs et autres dispositifs ont des **fiches techniques**, qui devraient contenir beaucoup d'informations sur la façon d'utiliser le dispositif, bien qu'elles puissent parfois être un peu difficiles à déchiffrer. Si vous pensez qu'il y a quelque chose que cette page aurait dû couvrir, n'hésitez pas à me le faire savoir à samuli@kitsat.fi.

Dans la prochaine et dernière leçon, nous discuterons de la façon de préparer votre satellite pour le lancement.

[Cliquez ici pour la prochaine leçon !](./lesson12)