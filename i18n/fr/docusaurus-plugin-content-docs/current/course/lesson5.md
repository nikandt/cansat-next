---
sidebar_position: 5
---

# Leçon 5 : Sauvegarder les Bits & Octets

Parfois, il n'est pas possible d'envoyer directement les données à un PC, comme lorsque nous lançons l'appareil avec une fusée ou prenons des mesures dans des endroits difficiles d'accès. Dans de tels cas, il est préférable de sauvegarder les données mesurées sur une carte SD pour un traitement ultérieur. De plus, la carte SD peut également être utilisée pour stocker des paramètres - par exemple, nous pourrions avoir un type de réglage de seuil ou des paramètres d'adresse stockés sur la carte SD.

## Carte SD dans la bibliothèque CanSat NeXT

La bibliothèque CanSat NeXT prend en charge une large gamme d'opérations sur les cartes SD. Elle peut être utilisée pour sauvegarder et lire des fichiers, mais aussi pour créer des répertoires et de nouveaux fichiers, les déplacer ou même les supprimer. Toutes ces opérations peuvent être utiles dans diverses circonstances, mais concentrons-nous ici sur les deux choses de base - lire un fichier et écrire des données dans un fichier.

:::note

Si vous souhaitez un contrôle total du système de fichiers, vous pouvez trouver les commandes dans la [Spécification de la bibliothèque](./../CanSat-software/library_specification.md#sdcardpresent) ou dans l'exemple de bibliothèque "SD_advanced".

:::

Comme exercice, modifions le code de la dernière leçon afin que, au lieu d'écrire les mesures LDR sur le port série, nous les sauvegardions sur la carte SD.

Tout d'abord, définissons le nom du fichier que nous utiliserons. Ajoutons-le avant la fonction setup en tant que **variable globale**.

```Cpp title="Setup modifié"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Maintenant que nous avons un chemin de fichier, nous pouvons écrire sur la carte SD. Nous avons besoin de seulement deux lignes pour le faire. La meilleure commande à utiliser pour sauvegarder les données de mesure est `appendFile()`, qui prend simplement le chemin du fichier et écrit les nouvelles données à la fin du fichier. Si le fichier n'existe pas, il le crée. Cela rend l'utilisation de la commande très facile (et sûre). Nous pouvons simplement ajouter directement les données, puis suivre cela par un changement de ligne pour que les données soient plus faciles à lire. Et c'est tout ! Nous stockons maintenant les mesures.

```Cpp title="Sauvegarder les données LDR sur la carte SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("Valeur LDR :");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Par défaut, la commande `appendFile()` stocke les nombres à virgule flottante avec deux valeurs après la virgule. Pour une fonctionnalité plus spécifique, vous pourriez d'abord créer une chaîne dans le sketch et utiliser la commande `appendFile()` pour stocker cette chaîne sur la carte SD. Par exemple :

```Cpp title="Sauvegarder les données LDR sur la carte SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Ici, la chaîne finale est d'abord créée, avec `String(LDR_voltage, 6)` spécifiant que nous voulons 6 décimales après la virgule. Nous pouvons utiliser la même chaîne pour imprimer et stocker les données. (Ainsi que pour transmettre via radio)

## Lire les Données

Il est souvent utile de stocker quelque chose sur la carte SD pour une utilisation future dans le programme également. Cela pourrait être par exemple des paramètres sur l'état actuel de l'appareil, de sorte que si le programme se réinitialise, nous puissions recharger l'état actuel depuis la carte SD au lieu de repartir des valeurs par défaut.

Pour démontrer cela, ajoutez sur PC un nouveau fichier à la carte SD appelé "delay_time", et écrivez un nombre dans le fichier, comme 200. Essayons de remplacer le temps de délai défini statiquement dans notre programme par un paramètre lu à partir d'un fichier.

Essayons de lire le fichier de paramètres dans le setup. Tout d'abord, introduisons une nouvelle variable globale. Je lui ai donné une valeur par défaut de 1000, de sorte que si nous ne parvenons pas à modifier le temps de délai, c'est maintenant le paramètre par défaut.

Dans le setup, nous devrions d'abord vérifier si le fichier existe même. Cela peut être fait en utilisant la commande `fileExists()`. Si ce n'est pas le cas, utilisons simplement la valeur par défaut. Après cela, les données peuvent être lues en utilisant `readFile()`. Cependant, nous devrions noter que c'est une chaîne - pas un entier comme nous en avons besoin. Alors, convertissons-la en utilisant la commande Arduino `toInt()`. Enfin, nous vérifions si la conversion a réussi. Si ce n'est pas le cas, la valeur sera zéro, auquel cas nous continuerons simplement à utiliser la valeur par défaut.

```Cpp title="Lire un paramètre dans le setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Enfin, n'oubliez pas de changer le délai dans la boucle pour utiliser la nouvelle variable.

```Cpp title="Définir dynamiquement la valeur du délai"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Vous pouvez maintenant essayer de changer la valeur sur la carte SD, ou même retirer la carte SD, auquel cas elle devrait maintenant utiliser la valeur par défaut pour la durée du délai.

:::note

Pour réécrire le paramètre dans votre programme, vous pouvez utiliser la commande [writeFile](./../CanSat-software/library_specification.md#writefile). Elle fonctionne comme [appendFile](./../CanSat-software/library_specification.md#appendfile), mais écrase toutes les données existantes.

:::

:::tip[Exercice]

Continuez à partir de votre solution à l'exercice de la leçon 4, de sorte que l'état soit maintenu même si l'appareil est réinitialisé. C'est-à-dire, stockez l'état actuel sur la carte SD et lisez-le dans le setup. Cela simulerait un scénario où votre CanSat se réinitialise soudainement en vol ou avant le vol, et avec ce programme, vous auriez toujours un vol réussi.

:::

---

Dans la prochaine leçon, nous examinerons l'utilisation de la radio pour transmettre des données entre processeurs. Vous devriez avoir un type d'antenne dans votre CanSat NeXT et la station au sol avant de commencer ces exercices. Si ce n'est pas déjà fait, jetez un œil au tutoriel pour construire une antenne de base : [Construire une antenne](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

[Cliquez ici pour la prochaine leçon !](./lesson6)