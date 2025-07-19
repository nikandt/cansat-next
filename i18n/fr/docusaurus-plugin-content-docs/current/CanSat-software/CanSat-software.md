---
sidebar_position: 3
---

# Logiciel CanSat NeXT

La manière recommandée d'utiliser CanSat NeXT est avec la bibliothèque Arduino CanSat NeXT, disponible depuis le gestionnaire de bibliothèques Arduino et sur Github. Avant d'installer la bibliothèque CanSat NeXT, vous devez installer l'IDE Arduino et le support de la carte ESP32.

## Commencer

### Installer l'IDE Arduino

Si ce n'est pas déjà fait, téléchargez et installez l'IDE Arduino depuis le site officiel https://www.arduino.cc/en/software.

### Ajouter le support ESP32

CanSat NeXT est basé sur le microcontrôleur ESP32, qui n'est pas inclus dans l'installation par défaut de l'IDE Arduino. Si vous n'avez jamais utilisé de microcontrôleurs ESP32 avec Arduino auparavant, le support pour la carte doit d'abord être installé. Cela peut être fait dans l'IDE Arduino depuis *Outils->Carte->Gestionnaire de cartes* (ou appuyez simplement sur (Ctrl+Shift+B) n'importe où). Dans le gestionnaire de cartes, recherchez ESP32 et installez l'esp32 par Espressif.

### Installer la bibliothèque CanSat NeXT

La bibliothèque CanSat NeXT peut être téléchargée depuis le Gestionnaire de Bibliothèques de l'IDE Arduino depuis *Croquis > Inclure des bibliothèques > Gérer les bibliothèques*.

![Ajout de nouvelles bibliothèques avec l'IDE Arduino.](./img/LibraryManager_1.png)

*Source de l'image : Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

Dans la barre de recherche du Gestionnaire de Bibliothèques, tapez "CanSatNeXT" et choisissez "Installer". Si l'IDE vous demande si vous souhaitez également installer les dépendances, cliquez sur oui.

## Installation manuelle

La bibliothèque est également hébergée sur son propre [répertoire GitHub](https://github.com/netnspace/CanSatNeXT_library) et peut être clonée ou téléchargée et installée depuis la source.

Dans ce cas, vous devez extraire la bibliothèque et la déplacer dans le répertoire où l'IDE Arduino peut la trouver. Vous pouvez trouver l'emplacement exact dans *Fichier > Préférences > Répertoire de croquis*.

![Ajout de nouvelles bibliothèques avec l'IDE Arduino.](./img/LibraryManager_2.png)

*Source de l'image : Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Connexion au PC

Après avoir installé la bibliothèque logicielle CanSat NeXT, vous pouvez connecter le CanSat NeXT à votre ordinateur. Dans le cas où il n'est pas détecté, vous devrez peut-être installer d'abord les pilotes nécessaires. L'installation des pilotes se fait automatiquement dans la plupart des cas, cependant, sur certains PC, elle doit être effectuée manuellement. Les pilotes peuvent être trouvés sur le site de Silicon Labs : https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Pour une aide supplémentaire avec la configuration de l'ESP32, consultez le tutoriel suivant : https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Vous êtes prêt à partir !

Vous pouvez maintenant trouver des exemples CanSatNeXT depuis l'IDE Arduino depuis *Fichier->Exemples->CanSatNeXT*.