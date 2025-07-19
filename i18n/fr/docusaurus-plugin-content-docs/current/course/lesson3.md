---
sidebar_position: 3
---

# Leçon 3 : Détecter la Rotation

CanSat NeXT dispose de deux capteurs IC sur la carte CanSat NeXT. L'un d'eux est le baromètre que nous avons utilisé dans la dernière leçon, et l'autre est l'_unité de mesure inertielle_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#inertial-measurement-unit). Le LSM6DS3 est un IMU à 6 axes, ce qui signifie qu'il est capable d'effectuer 6 mesures différentes. Dans ce cas, il s'agit de l'accélération linéaire sur trois axes (x, y, z) et de la vitesse angulaire sur trois axes.

Dans cette leçon, nous allons examiner l'exemple d'IMU dans la bibliothèque, et également utiliser l'IMU pour réaliser une petite expérience.

## Exemple de Bibliothèque

Commençons par voir comment fonctionne l'exemple de la bibliothèque. Chargez-le depuis Fichier -> Exemples -> CanSat NeXT -> IMU.

La configuration initiale est à nouveau la même - inclure la bibliothèque, initialiser le port série et CanSat. Concentrons-nous donc sur la boucle. Cependant, la boucle semble également très familière ! Nous lisons les valeurs comme dans la dernière leçon, seulement cette fois il y en a beaucoup plus.

```Cpp title="Lecture des valeurs de l'IMU"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Chaque axe est en fait lu à quelques centaines de microsecondes d'intervalle. Si vous avez besoin qu'ils soient mis à jour simultanément, consultez les fonctions [readAcceleration](./../CanSat-software/library_specification#readacceleration) et [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Après avoir lu les valeurs, nous pouvons les imprimer comme d'habitude. Cela pourrait être fait en utilisant Serial.print et println comme dans la dernière leçon, mais cet exemple montre une manière alternative d'imprimer les données, avec beaucoup moins d'écriture manuelle.

Tout d'abord, un tampon de 128 caractères est créé. Ensuite, il est initialisé pour que chaque valeur soit 0, en utilisant memset. Après cela, les valeurs sont écrites dans le tampon en utilisant `snprintf()`, qui est une fonction qui peut être utilisée pour écrire des chaînes avec un format spécifié. Enfin, cela est simplement imprimé avec `Serial.println()`.

```Cpp title="Impression sophistiquée"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Si cela vous semble déroutant, vous pouvez simplement utiliser le style plus familier en utilisant print et println. Cependant, cela devient un peu ennuyeux lorsqu'il y a beaucoup de valeurs à imprimer.

```Cpp title="Impression régulière"
Serial.print("Ax:");
Serial.println(ay);
// etc
```

Enfin, il y a à nouveau un court délai avant de recommencer la boucle. Cela est principalement là pour s'assurer que la sortie est lisible - sans délai, les chiffres changeraient si rapidement qu'il serait difficile de les lire.

L'accélération est lue en Gs, ou multiples de $9.81 \text{ m}/\text{s}^2$. La vitesse angulaire est en unités de $\text{mrad}/\text{s}$.

:::tip[Exercice]

Essayez d'identifier l'axe en fonction des lectures !

:::

## Détection de Chute Libre

Comme exercice, essayons de détecter si l'appareil est en chute libre. L'idée est que nous lancerions la carte en l'air, CanSat NeXT détecterait la chute libre et allumerait la LED pendant quelques secondes après avoir détecté un événement de chute libre, afin que nous puissions savoir que notre vérification a été déclenchée même après l'avoir rattrapée.

Nous pouvons garder la configuration telle qu'elle était, et nous concentrer uniquement sur la boucle. Effaçons la fonction de boucle ancienne, et recommençons à zéro. Juste pour le plaisir, lisons les données en utilisant la méthode alternative.

```Cpp title="Lire l'accélération"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Définissons la chute libre comme un événement lorsque l'accélération totale est inférieure à une valeur seuil. Nous pouvons calculer l'accélération totale à partir des axes individuels comme

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Ce qui ressemblerait dans le code à ceci.

```Cpp title="Calcul de l'accélération totale"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Et bien que cela fonctionnerait, nous devrions noter que calculer la racine carrée est vraiment lent sur le plan computationnel, donc nous devrions éviter de le faire si possible. Après tout, nous pourrions simplement calculer

$$a^2 = a_x^2+a_y^2+a_z^2$$

et comparer cela à un seuil prédéfini.

```Cpp title="Calcul de l'accélération totale au carré"
float totalSquared = ax*ax+ay*ay+az*az;
```

Maintenant que nous avons une valeur, commençons à contrôler la LED. Nous pourrions avoir la LED allumée toujours lorsque l'accélération totale est inférieure à un seuil, cependant il serait plus facile de la lire si la LED restait allumée pendant un moment après la détection. Une façon de faire cela est de créer une autre variable, appelons-la LEDOnTill, où nous écrivons simplement le temps pendant lequel nous voulons garder la LED allumée.

```Cpp title="Variable de minuterie"
unsigned long LEDOnTill = 0;
```

Maintenant, nous pouvons mettre à jour la minuterie si nous détectons un événement de chute libre. Utilisons un seuil de 0.1 pour l'instant. Arduino fournit une fonction appelée `millis()`, qui renvoie le temps écoulé depuis le démarrage du programme en millisecondes.

```Cpp title="Mise à jour de la minuterie"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Enfin, nous pouvons simplement vérifier si le temps actuel est supérieur ou inférieur à la valeur spécifiée `LEDOnTill`, et contrôler la LED en fonction de cela. Voici à quoi ressemble la nouvelle fonction de boucle :

```Cpp title="Fonction de boucle de détection de chute libre"
unsigned long LEDOnTill = 0;

void loop() {
  // Lire l'accélération
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculer l'accélération totale (au carré)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Mettre à jour la minuterie si nous détectons une chute
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Contrôler la LED en fonction de la minuterie
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

En essayant ce programme, vous pouvez voir à quelle vitesse il réagit maintenant puisque nous n'avons pas de délai dans la boucle. La LED s'allume immédiatement après avoir quitté la main lorsqu'elle est lancée.

:::tip[Exercices]

1. Essayez de réintroduire le délai dans la fonction de boucle. Que se passe-t-il ?
2. Actuellement, nous n'avons aucune impression dans la boucle. Si vous ajoutez simplement une instruction d'impression à la boucle, la sortie sera vraiment difficile à lire et l'impression ralentira considérablement le temps de cycle de la boucle. Pouvez-vous trouver un moyen d'imprimer seulement une fois par seconde, même si la boucle tourne en continu ? Astuce : regardez comment la minuterie de la LED a été implémentée.
3. Créez votre propre expérience, en utilisant soit l'accélération soit la rotation pour détecter un type d'événement.

:::

---

Dans la prochaine leçon, nous quitterons le domaine numérique et essaierons d'utiliser un style de capteur différent - un photomètre analogique.

[Cliquez ici pour la prochaine leçon !](./lesson4)