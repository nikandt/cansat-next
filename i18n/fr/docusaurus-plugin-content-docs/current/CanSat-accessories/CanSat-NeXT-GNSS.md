---
sidebar_position: 1
---

# Module GNSS CanSat NeXT

Le module GNSS CanSat NeXT étend CanSat NeXT avec des capacités de suivi de localisation et d'horloge en temps réel précise. Le module est basé sur le récepteur GNSS U-Blox SAM-M10Q de U-Blox.

![Module GNSS CanSat NeXT](./img/GNSS.png)

## Matériel

Le module connecte le récepteur GNSS au CanSat NeXT via l'UART dans l'en-tête d'extension. L'appareil utilise les broches 16 et 17 de l'en-tête d'extension pour l'UART RX et TX, et prend également l'alimentation de la ligne +3V3 dans l'en-tête d'extension.

Par défaut, les registres de sauvegarde du module GNSS sont alimentés par la ligne +3V3. Bien que cela rende le module facile à utiliser, cela signifie que le module doit toujours recommencer à zéro lorsqu'il essaie de trouver une solution. Pour atténuer cela, il est possible de fournir une source d'alimentation externe via la ligne de tension de sauvegarde à travers les en-têtes J103. La tension fournie à la broche V_BCK doit être de 2 à 6,5 volts, et la consommation de courant est constante à 65 microampères, même lorsque l'alimentation principale est coupée. Fournir la tension de sauvegarde permet au récepteur GNSS de maintenir tous les paramètres, mais aussi, de manière cruciale, les données d'almanach et d'éphémérides - réduisant le temps pour obtenir une solution de ~30 secondes à 1-2 secondes si l'appareil n'a pas bougé de manière significative entre les commutations d'alimentation.

Il existe de nombreux autres modules et breakouts GNSS disponibles auprès de sociétés telles que Sparkfun et Adafruit, entre autres. Ceux-ci peuvent être connectés au CanSat NeXT via la même interface UART, ou en utilisant SPI et I2C, selon le module. La bibliothèque CanSat NeXT devrait également prendre en charge d'autres breakouts utilisant des modules U-blox. Lors de la recherche de breakouts GNSS, essayez d'en trouver un où le PCB de base est aussi grand que possible - la plupart présentent des PCBs trop petits, ce qui rend leur performance d'antenne très faible par rapport aux modules avec des PCBs plus grands. Toute taille inférieure à 50x50 mm commencera à nuire à la performance et à la capacité de trouver et de maintenir une solution.

Pour plus d'informations sur le module GNSS et le grand nombre de paramètres et de fonctionnalités disponibles, consultez la fiche technique du récepteur GNSS sur le [site Web de U-Blox](https://www.u-blox.com/en/product/sam-m10q-module).

L'intégration matérielle du module au CanSat NeXT est vraiment simple - après avoir ajouté des entretoises aux trous de vis, insérez soigneusement les broches d'en-tête dans les sockets de broches. Si vous avez l'intention de créer une pile électronique multi-couches, assurez-vous de placer le GNSS comme module le plus haut pour permettre 

![Module GNSS CanSat NeXT](./img/stack.png)

## Logiciel

La façon la plus simple de commencer à utiliser le CanSat NeXT GNSS est avec notre propre bibliothèque Arduino, que vous pouvez trouver dans le gestionnaire de bibliothèques Arduino. Pour des instructions sur comment installer la bibliothèque, consultez la page [démarrage](./../course/lesson1).

La bibliothèque inclut des exemples sur comment lire la position et l'heure actuelle, ainsi que comment transmettre les données avec CanSat NeXT.

Une petite note sur les paramètres - le module doit être informé du type d'environnement dans lequel il sera utilisé, afin qu'il puisse mieux estimer la position de l'utilisateur. Typiquement, l'hypothèse est que l'utilisateur sera au niveau du sol, et bien qu'il puisse se déplacer, l'accélération n'est probablement pas très élevée. Ce n'est bien sûr pas le cas avec les CanSats, qui pourraient être lancés avec des fusées, ou toucher le sol avec des vitesses assez élevées. Par conséquent, la bibliothèque définit par défaut la position à calculer en supposant un environnement à haute dynamique, ce qui permet de maintenir la solution au moins partiellement pendant une accélération rapide, mais cela rend également la position au sol notablement moins précise. Si au contraire une haute précision une fois atterri est plus souhaitable, vous pouvez initialiser le module GNSS avec la commande `GNSS_init(DYNAMIC_MODEL_GROUND)`, remplaçant le `GNSS_init(DYNAMIC_MODEL_ROCKET)` par défaut = `GNSS_init()`. De plus, il existe `DYNAMIC_MODEL_AIRBORNE`, qui est légèrement plus précis que le modèle de fusée, mais suppose seulement une accélération modeste.

Cette bibliothèque privilégie la facilité d'utilisation et ne dispose que de fonctionnalités de base telles que l'obtention de la localisation et de l'heure à partir du GNSS. Pour les utilisateurs recherchant des fonctionnalités GNSS plus avancées, l'excellente SparkFun_u-blox_GNSS_Arduino_Library pourrait être un meilleur choix.

## Spécification de la bibliothèque

Voici les commandes disponibles de la bibliothèque CanSat GNSS.

### GNSS_Init

| Fonction             | uint8_t GNSS_Init(uint8_t dynamic_model)                          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 1 si l'initialisation a réussi, ou 0 s'il y a eu une erreur. |
| **Paramètres**       |                                                                    |
|                      | `uint8_t dynamic_model`                                           |
|                      | Cela choisit le modèle dynamique, ou l'environnement que le module GNSS suppose. Les choix possibles sont DYNAMIC_MODEL_GROUND, DYNAMIC_MODEL_AIRBORNE et DYNAMIC_MODEL_ROCKET. |
| **Description**      | Cette commande initialise le module GNSS, et vous devriez l'appeler dans la fonction setup. |

### readPosition

| Fonction             | uint8_t readPosition(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si la mesure a réussi.                           |
| **Paramètres**       |                                                                    |
|                      | `float &latitude, float &longitude, float &altitude`                                    |
|                      | `float &x`: Adresse d'une variable float où les données seront stockées. |
| **Utilisé dans l'exemple de croquis** | Tous                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire la position de l'appareil sous forme de coordonnées. Les valeurs seront semi-aléatoires avant que la solution ne soit obtenue. L'altitude est en mètres au-dessus du niveau de la mer, bien qu'elle ne soit pas très précise. |

### getSIV

| Fonction             | uint8_t getSIV()                  |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Nombre de satellites en vue |
| **Utilisé dans l'exemple de croquis** | AdditionalFunctions                                          |
| **Description**      | Retourne le nombre de satellites en vue. Typiquement, des valeurs inférieures à 3 indiquent qu'il n'y a pas de solution. |

### getTime

| Fonction             | uint32_t getTime()                  |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint32_t`                                                          |
| **Valeur de retour** | Temps actuel en Epoch |
| **Utilisé dans l'exemple de croquis** | AdditionalFunctions                                          |
| **Description**      | Retourne le temps actuel en epoch, tel qu'indiqué par les signaux des satellites GNSS. En d'autres termes, c'est le nombre de secondes écoulées depuis 00:00:00 UTC, jeudi le premier janvier 1970. |