---
sidebar_position: 10
---

# Leçon 9 : Un et Zéro

Jusqu'à présent, nous avons utilisé du texte pour stocker ou transmettre des données. Bien que cela facilite l'interprétation, c'est également inefficace. Les ordinateurs utilisent en interne des données **binaires**, où les données sont stockées sous forme d'ensembles de uns et de zéros. Dans cette leçon, nous allons examiner les moyens d'utiliser les données binaires avec CanSat NeXT, et discuter des endroits et des raisons pour lesquelles cela peut être utile.

:::info

## Différents types de données

Sous forme binaire, toutes les données—qu'il s'agisse de nombres, de texte ou de relevés de capteurs—sont représentées comme une série de uns et de zéros. Différents types de données utilisent différentes quantités de mémoire et interprètent les valeurs binaires de manière spécifique. Passons brièvement en revue certains types de données courants et comment ils sont stockés en binaire :

- **Entier (int)** :  
  Les entiers représentent des nombres entiers. Dans un entier de 16 bits, par exemple, 16 uns et zéros peuvent représenter des valeurs de \(-32,768\) à \(32,767\). Les nombres négatifs sont stockés en utilisant une méthode appelée **complément à deux**.

- **Entier non signé (uint)** :  
  Les entiers non signés représentent des nombres non négatifs. Un entier non signé de 16 bits peut stocker des valeurs de \(0\) à \(65,535\), car aucun bit n'est réservé pour le signe.

- **Flottant (float)** :  
  Les nombres à virgule flottante représentent des valeurs décimales. Dans un flottant de 32 bits, une partie des bits représente le signe, l'exposant et la mantisse, permettant aux ordinateurs de gérer des nombres très grands et très petits. C'est essentiellement une forme binaire de la [notation scientifique](https://fr.wikipedia.org/wiki/Notation_scientifique).

- **Caractères (char)** :  
  Les caractères sont stockés en utilisant des schémas d'encodage comme **ASCII** ou **UTF-8**. Chaque caractère correspond à une valeur binaire spécifique (par exemple, 'A' en ASCII est stocké comme `01000001`).

- **Chaînes** :  
  Les chaînes sont simplement des collections de caractères. Chaque caractère d'une chaîne est stocké en séquence sous forme de valeurs binaires individuelles. Par exemple, la chaîne `"CanSat"` serait stockée comme une série de caractères tels que `01000011 01100001 01101110 01010011 01100001 01110100` (chacun représentant 'C', 'a', 'n', 'S', 'a', 't'). Comme vous pouvez le voir, représenter des nombres sous forme de chaînes, comme nous l'avons fait jusqu'à présent, est moins efficace que de les stocker sous forme de valeurs binaires.

- **Tableaux et `uint8_t`** :  
  Lorsqu'on travaille avec des données binaires, il est courant d'utiliser un tableau de `uint8_t` pour stocker et manipuler des données brutes en octets. Le type `uint8_t` représente un entier non signé de 8 bits, qui peut contenir des valeurs de 0 à 255. Comme chaque octet est composé de 8 bits, ce type est bien adapté pour contenir des données binaires.
  Les tableaux de `uint8_t` sont souvent utilisés pour créer des tampons d'octets pour contenir des séquences de données binaires brutes (par exemple, des paquets). Certaines personnes préfèrent `char` ou d'autres variables, mais peu importe laquelle est utilisée tant que la variable a une longueur de 1 octet.
:::

## Transmettre des données binaires

Commençons par flasher un programme simple sur le CanSat, et concentrons-nous davantage sur le côté station au sol. Voici un code simple qui transmet une lecture au format binaire :

```Cpp title="Transmettre les données LDR sous forme binaire"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

Le code semble par ailleurs très familier, mais `sendData` prend maintenant deux arguments au lieu d'un seul - d'abord, l'**adresse mémoire** des données à transmettre, puis la **longueur** des données à transmettre. Dans ce cas simplifié, nous utilisons simplement l'adresse et la longueur de la variable `LDR_voltage`.

Si vous essayez de recevoir cela avec le code typique de la station au sol, il imprimera simplement du charabia, car il essaie d'interpréter les données binaires comme si c'était une chaîne. Au lieu de cela, nous devrons spécifier à la station au sol ce que les données incluent.

Tout d'abord, vérifions la longueur des données que nous recevons réellement.

```Cpp title="Vérifier la longueur des données reçues"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Reçu ");
  Serial.print(len);
  Serial.println(" octets");
}
```

Chaque fois que le satellite transmet, nous recevons 4 octets sur la station au sol. Comme nous transmettons un flottant de 32 bits, cela semble correct.

Pour lire les données, nous devons prendre le tampon de données binaires du flux d'entrée et copier les données dans une variable appropriée. Pour ce cas simple, nous pouvons faire ceci :

```Cpp title="Stocker les données dans une variable"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Reçu ");
  Serial.print(len);
  Serial.println(" octets");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Données : ");
  Serial.println(LDR_reading);
}
```

Tout d'abord, nous introduisons la variable `LDR_reading` pour contenir les données que nous *savons* avoir dans le tampon. Ensuite, nous utilisons `memcpy` (copie de mémoire) pour copier les données binaires du tampon `data` dans l'**adresse mémoire** de `LDR_reading`. Cela garantit que les données sont transférées exactement comme elles ont été stockées, en conservant le même format que sur le satellite.

Maintenant, si nous imprimons les données, c'est comme si nous les lisions directement du côté GS. Ce n'est plus du texte comme avant, mais les mêmes données que nous avons lues du côté satellite. Nous pouvons maintenant facilement les traiter du côté GS comme nous le souhaitons.

## Créer notre propre protocole

La véritable puissance du transfert de données binaires devient évidente lorsque nous avons plus de données à transmettre. Cependant, nous devons toujours nous assurer que le satellite et la station au sol conviennent de quel octet représente quoi. Cela est appelé un **protocole de paquet**.

Un protocole de paquet définit la structure des données transmises, spécifiant comment emballer plusieurs morceaux de données dans une seule transmission, et comment le récepteur doit interpréter les octets entrants. Construisons un protocole simple qui transmet plusieurs relevés de capteurs de manière structurée.

Tout d'abord, lisons tous les canaux de l'accéléromètre et du gyroscope et créons le **paquet de données** à partir des relevés.

```Cpp title="Transmettre les données LDR sous forme binaire"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Créer un tableau pour contenir les données
  uint8_t packet[24];

  // Copier les données dans le paquet
  memcpy(&packet[0], &ax, 4);  // Copier l'accéléromètre X dans les octets 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copier le gyroscope Z dans les octets 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Ici, nous lisons d'abord les données comme dans la leçon 3, mais ensuite nous **encodons** les données dans un paquet de données. Tout d'abord, le tampon réel est créé, qui est juste un ensemble vide de 24 octets. Chaque variable de données peut ensuite être écrite dans ce tampon vide avec `memcpy`. Comme nous utilisons `float`, les données ont une longueur de 4 octets. Si vous n'êtes pas sûr de la longueur d'une variable, vous pouvez toujours la vérifier avec `sizeof(variable)`.

:::tip[Exercice]

Créez un logiciel de station au sol pour interpréter et imprimer les données de l'accéléromètre et du gyroscope.

:::

## Stocker des données binaires sur une carte SD

Écrire des données sous forme binaire sur la carte SD peut être utile lorsqu'on travaille avec de très grandes quantités de données, car le stockage binaire est plus compact et efficace que le texte. Cela vous permet de sauvegarder plus de données avec moins d'espace de stockage, ce qui peut être utile dans un système à mémoire limitée.

Cependant, l'utilisation de données binaires pour le stockage comporte des compromis. Contrairement aux fichiers texte, les fichiers binaires ne sont pas lisibles par l'homme, ce qui signifie qu'ils ne peuvent pas être facilement ouverts et compris avec des éditeurs de texte standard ou importés dans des programmes comme Excel. Pour lire et interpréter les données binaires, des logiciels ou scripts spécialisés (par exemple, en Python) doivent être développés pour analyser correctement le format binaire.

Pour la plupart des applications, où la facilité d'accès et la flexibilité sont importantes (comme l'analyse des données sur un ordinateur plus tard), les formats basés sur le texte comme CSV sont recommandés. Ces formats sont plus faciles à utiliser dans une variété d'outils logiciels et offrent plus de flexibilité pour une analyse rapide des données.

Si vous êtes déterminé à utiliser le stockage binaire, examinez de plus près "sous le capot" en examinant comment la bibliothèque CanSat gère le stockage des données en interne. Vous pouvez directement utiliser les méthodes de gestion de fichiers de style C pour gérer les fichiers, les flux et d'autres opérations de bas niveau de manière efficace. Plus d'informations peuvent également être trouvées dans la [bibliothèque de carte SD Arduino](https://docs.arduino.cc/libraries/sd/).

---

Nos programmes commencent à devenir de plus en plus compliqués, et il y a aussi certains composants qui seraient agréables à réutiliser ailleurs. Pour éviter de rendre notre code difficile à gérer, il serait agréable de pouvoir partager certains composants dans différents fichiers et de garder le code lisible. Voyons comment cela peut être accompli avec l'IDE Arduino.

[Cliquez ici pour la leçon suivante !](./lesson10)