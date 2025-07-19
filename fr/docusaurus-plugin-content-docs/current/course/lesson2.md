---
sidebar_position: 2
---

# Leçon 2 : Ressentir la pression

Dans cette deuxième leçon, nous allons commencer à utiliser les capteurs de la carte CanSat NeXT. Cette fois, nous nous concentrerons sur la mesure de la pression atmosphérique environnante. Nous utiliserons le baromètre embarqué [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) pour lire la pression, ainsi que pour lire la température du baromètre lui-même.

Commençons par le code du baromètre dans les exemples de la bibliothèque. Dans l'IDE Arduino, sélectionnez Fichier-> Exemples->CanSat NeXT->Baro.

Le début du programme semble assez familier par rapport à la dernière leçon. Encore une fois, nous commençons par inclure la bibliothèque CanSat NeXT, et configurer la connexion série ainsi qu'initialiser les systèmes CanSat NeXT.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

L'appel de fonction `CanSatInit()` initialise tous les capteurs pour nous, y compris le baromètre. Ainsi, nous pouvons commencer à l'utiliser dans la fonction loop.

Les deux lignes ci-dessous sont celles où la température et la pression sont effectivement lues. Lorsque les fonctions `readTemperature()` et `readPressure()` sont appelées, le processeur envoie une commande au baromètre, qui mesure la pression ou la température, et renvoie le résultat au processeur.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

Dans l'exemple, les valeurs sont imprimées, suivies d'un délai de 1000 ms, de sorte que la boucle se répète environ une fois par seconde.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Utiliser les données

Nous pouvons également utiliser les données dans le code, plutôt que de simplement les imprimer ou les enregistrer. Par exemple, nous pourrions créer un code qui détecte si la pression chute d'un certain montant, et par exemple allumer la LED. Ou tout autre chose que vous aimeriez faire. Essayons d'allumer la LED embarquée.

Pour implémenter cela, nous devons légèrement modifier le code de l'exemple. Tout d'abord, commençons à suivre la valeur de pression précédente. Pour créer des **variables globales**, c'est-à-dire celles qui n'existent pas seulement pendant l'exécution d'une fonction spécifique, vous pouvez simplement les écrire en dehors de toute fonction spécifique. La variable previousPressure est mise à jour à chaque cycle de la fonction loop, juste à la fin. De cette façon, nous gardons une trace de l'ancienne valeur et pouvons la comparer à la nouvelle valeur.

Nous pouvons utiliser une instruction if pour comparer les anciennes et nouvelles valeurs. Dans le code ci-dessous, l'idée est que si la pression précédente est inférieure de 0,1 hPa à la nouvelle valeur, nous allumerons la LED, sinon la LED restera éteinte.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

Si vous téléchargez cette boucle modifiée sur le CanSat NeXT, elle devrait à la fois imprimer les valeurs des variables comme avant, mais maintenant aussi rechercher la chute de pression. La pression atmosphérique chute d'environ 0,12 hPa / mètre en montant, donc si vous essayez de soulever rapidement le CanSat NeXT d'un mètre plus haut, la LED devrait s'allumer pour un cycle de boucle (1 seconde), puis s'éteindre. Il est probablement préférable de déconnecter le câble USB avant d'essayer cela !

Vous pouvez également essayer de modifier le code. Que se passe-t-il si le délai est modifié ? Qu'en est-il si l'**hystérésis** de 0,1 hPa est modifiée ou même totalement supprimée ?

---

Dans la prochaine leçon, nous allons faire encore plus d'activité physique, en essayant d'utiliser l'autre capteur intégré - l'unité de mesure inertielle.

[Cliquez ici pour la prochaine leçon !](./lesson3)