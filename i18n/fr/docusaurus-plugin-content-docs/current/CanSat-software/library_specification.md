---
sidebar_position: 1
---

# Spécification de la bibliothèque

# Fonctions

Vous pouvez utiliser toutes les fonctionnalités Arduino régulières avec CanSat NeXT, ainsi que toutes les bibliothèques Arduino. Les fonctions Arduino peuvent être trouvées ici : https://www.arduino.cc/reference/en/.

La bibliothèque CanSat NeXT ajoute plusieurs fonctions faciles à utiliser pour exploiter les différentes ressources embarquées, telles que les capteurs, la radio et la carte SD. La bibliothèque est accompagnée d'un ensemble d'exemples de croquis qui montrent comment utiliser ces fonctionnalités. La liste ci-dessous montre également toutes les fonctions disponibles.

## Fonctions d'initialisation du système

### CanSatInit

| Fonction             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si l'initialisation a réussi, ou une valeur non nulle s'il y a eu une erreur. |
| **Paramètres**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Adresse MAC de 6 octets partagée par le satellite et la station au sol. C'est un paramètre optionnel - lorsqu'il n'est pas fourni, la radio n'est pas initialisée. Utilisé dans l'exemple de croquis : Tous |
| **Description**      | Cette commande se trouve dans le `setup()` de presque tous les scripts CanSat NeXT. Elle est utilisée pour initialiser le matériel CanSatNeXT, y compris les capteurs et la carte SD. De plus, si le `macAddress` est fourni, elle démarre la radio et commence à écouter les messages entrants. L'adresse MAC doit être partagée par la station au sol et le satellite. L'adresse MAC peut être choisie librement, mais certaines adresses ne sont pas valides, comme tous les octets étant `0x00`, `0x01`, et `0xFF`. Si la fonction d'initialisation est appelée avec une adresse non valide, elle signalera le problème au Serial. |

### CanSatInit (spécification simplifiée de l'adresse MAC)

| Fonction             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si l'initialisation a réussi, ou une valeur non nulle s'il y a eu une erreur. |
| **Paramètres**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Dernier octet de l'adresse MAC, utilisé pour différencier les différentes paires CanSat-GS. |
| **Description**      | Il s'agit d'une version simplifiée de CanSatInit avec adresse MAC, qui définit automatiquement les autres octets à une valeur sûre connue. Cela permet aux utilisateurs de différencier leurs paires Émetteur-Récepteur avec une seule valeur, qui peut être de 0 à 255.|

### GroundStationInit

| Fonction             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si l'initialisation a réussi, ou une valeur non nulle en cas d'erreur. |
| **Paramètres**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Adresse MAC de 6 octets partagée par le satellite et la station au sol. |
| **Utilisé dans l'exemple de croquis** | Réception de la station au sol                                          |
| **Description**      | C'est un proche parent de la fonction CanSatInit, mais elle nécessite toujours l'adresse MAC. Cette fonction initialise uniquement la radio, pas d'autres systèmes. La station au sol peut être n'importe quelle carte ESP32, y compris n'importe quelle carte de développement ou même une autre carte CanSat NeXT. |

### GroundStationInit (spécification simplifiée de l'adresse MAC)

| Fonction             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si l'initialisation a réussi, ou une valeur non nulle en cas d'erreur. |
| **Paramètres**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Dernier octet de l'adresse MAC, utilisé pour différencier les différentes paires CanSat-GS. |
| **Description**      | Il s'agit d'une version simplifiée de GroundStationInit avec adresse MAC, qui définit automatiquement les autres octets à une valeur sûre connue. Cela permet aux utilisateurs de différencier leurs paires Émetteur-Récepteur avec une seule valeur, qui peut être de 0 à 255. |

## Fonctions IMU

### readAcceleration

| Fonction             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si la mesure a réussi.                           |
| **Paramètres**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adresse d'une variable float où les données de l'axe x seront stockées. |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire l'accélération de l'IMU embarqué. Les paramètres sont des adresses de variables float pour chaque axe. L'exemple IMU montre comment utiliser cette fonction pour lire l'accélération. L'accélération est retournée en unités de G (9,81 m/s²). |

### readAccelX

| Fonction             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                          |
| **Valeur de retour** | Retourne l'accélération linéaire sur l'axe X en unités de G.                           |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire l'accélération de l'IMU embarqué sur un axe spécifique. L'exemple IMU montre comment utiliser cette fonction pour lire l'accélération. L'accélération est retournée en unités de G (9,81 m/s²). |

### readAccelY

| Fonction             | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                          |
| **Valeur de retour** | Retourne l'accélération linéaire sur l'axe Y en unités de G.                           |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire l'accélération de l'IMU embarqué sur un axe spécifique. L'exemple IMU montre comment utiliser cette fonction pour lire l'accélération. L'accélération est retournée en unités de G (9,81 m/s). |

### readAccelZ

| Fonction             | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                          |
| **Valeur de retour** | Retourne l'accélération linéaire sur l'axe Z en unités de G.                           |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire l'accélération de l'IMU embarqué sur un axe spécifique. L'exemple IMU montre comment utiliser cette fonction pour lire l'accélération. L'accélération est retournée en unités de G (9,81 m/s). |

### readGyro

| Fonction             | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si la mesure a réussi.                           |
| **Paramètres**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adresse d'une variable float où les données de l'axe x seront stockées. |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire la vitesse angulaire de l'IMU embarqué. Les paramètres sont des adresses vers des variables float pour chaque axe. L'exemple IMU montre comment utiliser cette fonction pour lire la vitesse angulaire. La vitesse angulaire est retournée en unités mrad/s. |

### readGyroX

| Fonction             | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                          |
| **Valeur de retour** | Retourne la vitesse angulaire sur l'axe X en unités de mrad/s.                           |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire la vitesse angulaire de l'IMU embarqué sur un axe spécifique. Les paramètres sont des adresses vers des variables float pour chaque axe. La vitesse angulaire est retournée en unités mrad/s. |

### readGyroY

| Fonction             | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                          |
| **Valeur de retour** | Retourne la vitesse angulaire sur l'axe Y en unités de mrad/s.                           |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire la vitesse angulaire de l'IMU embarqué sur un axe spécifique. Les paramètres sont des adresses vers des variables float pour chaque axe. La vitesse angulaire est retournée en unités mrad/s. |

### readGyroZ

| Fonction             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                          |
| **Valeur de retour** | Retourne la vitesse angulaire sur l'axe Z en unités de mrad/s.                           |
| **Utilisé dans l'exemple de croquis** | IMU                                                  |
| **Description**      | Cette fonction peut être utilisée pour lire la vitesse angulaire de l'IMU embarqué sur un axe spécifique. Les paramètres sont des adresses vers des variables float pour chaque axe. La vitesse angulaire est retournée en unités de mrad/s. |

## Fonctions du Baromètre

### readPressure

| Fonction             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                            |
| **Valeur de retour** | Pression en mbar                                                   |
| **Paramètres**       | Aucun                                                               |
| **Utilisé dans l'exemple de croquis** | Baro                                                        |
| **Description**      | Cette fonction retourne la pression telle que rapportée par le baromètre embarqué. La pression est en unités de millibar. |

### readTemperature

| Fonction             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                            |
| **Valeur de retour** | Température en Celsius                                            |
| **Paramètres**       | Aucun                                                               |
| **Utilisé dans l'exemple de croquis** | Baro                                                        |
| **Description**      | Cette fonction retourne la température telle que rapportée par le baromètre embarqué. L'unité de la lecture est Celsius. Notez qu'il s'agit de la température interne mesurée par le baromètre, elle pourrait donc ne pas refléter la température externe. |

## Fonctions de la Carte SD / Système de Fichiers

### SDCardPresent

| Fonction             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `bool`                                                             |
| **Valeur de retour** | Retourne vrai si une carte SD est détectée, faux sinon.               |
| **Paramètres**       | Aucun                                                               |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                                |
| **Description**      | Cette fonction peut être utilisée pour vérifier si la carte SD est mécaniquement présente. Le connecteur de la carte SD a un interrupteur mécanique, qui est lu lorsque cette fonction est appelée. Retourne vrai ou faux selon que la carte SD est détectée ou non. |

### appendFile

| Fonction             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si l'écriture a réussi.                                |
| **Paramètres**       |                                                                    |
|                      | `String filename`: Adresse du fichier à ajouter. Si le fichier n'existe pas, il est créé. |
|                      | `T data`: Données à ajouter à la fin du fichier.                  |
| **Utilisé dans l'exemple de croquis** | SD_write                                         |
| **Description**      | Il s'agit de la fonction d'écriture de base utilisée pour stocker les relevés sur la carte SD. |

### printFileSystem

| Fonction             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       | Aucun                                                              |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Il s'agit d'une petite fonction d'aide pour imprimer les noms des fichiers et dossiers présents sur la carte SD. Peut être utilisée en développement. |

### newDir

| Fonction             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `String path`: Chemin du nouveau répertoire. S'il existe déjà, rien n'est fait. |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Utilisé pour créer de nouveaux répertoires sur la carte SD.       |

### deleteDir

| Fonction             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `String path`: Chemin du répertoire à supprimer.                   |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Utilisé pour supprimer des répertoires sur la carte SD.           |

### fileExists

| Fonction             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `bool`                                                             |
| **Valeur de retour** | Retourne true si le fichier existe.                                |
| **Paramètres**       |                                                                    |
|                      | `String path`: Chemin vers le fichier.                             |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Cette fonction peut être utilisée pour vérifier si un fichier existe sur la carte SD. |

### fileSize

| Fonction             | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint32_t`                                                         |
| **Valeur de retour** | Taille du fichier en octets.                                       |
| **Paramètres**       |                                                                    |
|                      | `String path`: Chemin vers le fichier.                             |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Cette fonction peut être utilisée pour lire la taille d'un fichier sur la carte SD. |

### writeFile

| Fonction             | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | Retourne 0 si l'écriture a réussi.                                 |
| **Paramètres**       |                                                                    |
|                      | `String filename`: Adresse du fichier à écrire.                    |
|                      | `T data`: Données à écrire dans le fichier.                        |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Cette fonction est similaire à `appendFile()`, mais elle écrase les données existantes sur la carte SD. Pour le stockage de données, `appendFile` devrait être utilisé à la place. Cette fonction peut être utile pour stocker des paramètres, par exemple. |

### readFile

| Fonction             | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `String`                                                           |
| **Valeur de retour** | Tout le contenu du fichier.                                        |
| **Paramètres**       |                                                                    |
|                      | `String path`: Chemin vers le fichier.                             |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Cette fonction peut être utilisée pour lire toutes les données d'un fichier dans une variable. Tenter de lire de gros fichiers peut causer des problèmes, mais c'est acceptable pour les petits fichiers, tels que les fichiers de configuration ou de paramètres. |

### renameFile

| Fonction             | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `String oldpath`: Chemin original vers le fichier.                 |
|                      | `String newpath`: Nouveau chemin du fichier.                       |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                      |
| **Description**      | Cette fonction peut être utilisée pour renommer ou déplacer des fichiers sur la carte SD. |

### deleteFile

| Fonction             | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `String path`: Chemin du fichier à supprimer.                     |
| **Utilisé dans l'exemple de croquis** | SD_advanced                                                |
| **Description**      | Cette fonction peut être utilisée pour supprimer des fichiers de la carte SD.        |

## Fonctions Radio

### onDataReceived

| Fonction             | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `String data`: Données reçues sous forme de chaîne Arduino.       |
| **Utilisé dans l'exemple de croquis** | Groundstation_receive                                      |
| **Description**      | Il s'agit d'une fonction de rappel qui est appelée lorsque des données sont reçues. Le code utilisateur doit définir cette fonction, et le CanSat NeXT l'appellera automatiquement lorsque des données seront reçues. |

### onBinaryDataReceived

| Fonction             | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `const uint8_t *data`: Données reçues sous forme de tableau uint8_t.          |
|                      | `uint16_t len`: Longueur des données reçues en octets.                      |
| **Utilisé dans l'exemple de croquis** | Aucun                                                 |
| **Description**      | Ceci est similaire à la fonction `onDataReceived`, mais les données sont fournies sous forme binaire au lieu d'un objet String. Ceci est fourni pour les utilisateurs avancés qui trouvent l'objet String limitant. |

### onDataSent

| Fonction             | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `void`                                                             |
| **Paramètres**       |                                                                    |
|                      | `const bool success`: Booléen indiquant si les données ont été envoyées avec succès. |
| **Utilisé dans l'exemple de croquis** | Aucun                                                 |
| **Description**      | Il s'agit d'une autre fonction de rappel qui peut être ajoutée au code utilisateur si nécessaire. Elle peut être utilisée pour vérifier si la réception a été reconnue par une autre radio. |


### getRSSI

| Fonction             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `int8_t`                                                          |
| **Valeur de retour** | RSSI du dernier message reçu. Retourne 1 si aucun message n'a été reçu depuis le démarrage.                           |
| **Utilisé dans l'exemple de croquis** | Aucun                                                  |
| **Description**      | Cette fonction peut être utilisée pour surveiller la force du signal de la réception. Elle peut être utilisée pour tester les antennes ou évaluer la portée de la radio. La valeur est exprimée en [dBm](https://en.wikipedia.org/wiki/DBm), cependant l'échelle n'est pas précise.  |

### sendData (variante String)

| Fonction             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | 0 si les données ont été envoyées (n'indique pas l'accusé de réception).            |
| **Paramètres**       |                                                                    |
|                      | `T data`: Données à envoyer. Tout type de données peut être utilisé, mais est converti en chaîne de caractères en interne.                  |
| **Utilisé dans l'exemple de croquis** | Send_data                                             |
| **Description**      | Il s'agit de la fonction principale pour envoyer des données entre la station au sol et le satellite. Notez que la valeur de retour n'indique pas si les données ont été réellement reçues, juste qu'elles ont été envoyées. Le rappel `onDataSent` peut être utilisé pour vérifier si les données ont été reçues par l'autre extrémité. |

### sendData (Variante binaire) {#sendData-binary}

| Fonction             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                          |
| **Valeur de retour** | 0 si les données ont été envoyées (n'indique pas l'accusé de réception).            |
| **Paramètres**       |                                                                    |
|                      | `T* data`: Données à envoyer.                    |
|                      | `uint16_t len`: Longueur des données en octets.                      |
| **Utilisé dans l'exemple de croquis** | Aucun                                                 |
| **Description**      | Une variante binaire de la fonction `sendData`, fournie pour les utilisateurs avancés qui se sentent limités par l'objet String. |

### getRSSI

| Fonction             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `int8_t`                                                          |
| **Valeur de retour** | RSSI du dernier message reçu. Retourne 1 si aucun message n'a été reçu depuis le démarrage.                           |
| **Utilisé dans l'exemple de croquis** | Aucun                                                  |
| **Description**      | Cette fonction peut être utilisée pour surveiller la force du signal de réception. Elle peut être utilisée pour tester les antennes ou évaluer la portée radio. La valeur est exprimée en [dBm](https://en.wikipedia.org/wiki/DBm), cependant l'échelle n'est pas précise. 

### setRadioChannel

| Fonction             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Type de retour**   | `void`                                                          |
| **Valeur de retour** | Aucune                                                            |
| **Paramètres**       | `uint8_t newChannel`: Numéro de canal Wi-Fi souhaité (1–11). Toute valeur supérieure à 11 sera limitée à 11. |
| **Utilisé dans l'exemple de croquis** | Aucun                                                      |
| **Description**      | Définit le canal de communication ESP-NOW. Le nouveau canal doit être dans la plage des canaux Wi-Fi standards (1–11), qui correspondent à des fréquences commençant à 2.412 GHz avec des pas de 5 MHz. Le canal 1 est à 2.412, le canal 2 est à 2.417, et ainsi de suite. Appelez cette fonction avant l'initialisation de la bibliothèque. Le canal par défaut est 1. |

### getRadioChannel

| Fonction             | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Type de retour**   | `uint8_t`                                                       |
| **Valeur de retour** | Le canal Wi-Fi principal actuel. Retourne 0 s'il y a une erreur lors de la récupération du canal. |
| **Utilisé dans l'exemple de sketch** | Aucun                                           |
| **Description**      | Récupère le canal Wi-Fi principal actuellement utilisé. Cette fonction fonctionne uniquement après l'initialisation de la bibliothèque. |

### printRadioFrequency

| Fonction             | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Type de retour**   | `void`                                                          |
| **Valeur de retour** | Aucune                                                          |
| **Utilisé dans l'exemple de sketch** | Aucun                                           |
| **Description**      | Calcule et imprime la fréquence actuelle en GHz basée sur le canal Wi-Fi actif. Cette fonction fonctionne uniquement après l'initialisation de la bibliothèque. |


## Fonctions ADC

### adcToVoltage

| Fonction             | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                            |
| **Valeur de retour** | Tension convertie en volts.                                       |
| **Paramètres**       |                                                                    |
|                      | `int value`: Lecture ADC à convertir en tension.                  |
| **Utilisé dans l'exemple de sketch** | AccurateAnalogRead                                    |
| **Description**      | Cette fonction convertit une lecture ADC en tension en utilisant un polynôme de troisième ordre calibré pour une conversion plus linéaire. Notez que cette fonction calcule la tension à la broche d'entrée, donc pour calculer la tension de la batterie, vous devez également prendre en compte le réseau de résistances. |

### analogReadVoltage

| Fonction             | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Type de retour**   | `float`                                                            |
| **Valeur de retour** | Tension ADC en volts.                                             |
| **Paramètres**       |                                                                    |
|                      | `int pin`: Broche à lire.                                         |
| **Utilisé dans l'exemple de sketch** | AccurateAnalogRead                                    |
| **Description**      | Cette fonction lit la tension directement au lieu d'utiliser `analogRead` et convertit la lecture en tension en interne en utilisant `adcToVoltage`. |