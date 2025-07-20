---
sidebar_position: 8
---

# Leçon 7 : Répondre

Les CanSats sont souvent programmés pour fonctionner selon une logique assez simple - par exemple, prendre des mesures toutes les n millisecondes, sauvegarder et transmettre les données, et répéter. En revanche, envoyer des commandes au satellite pour changer son comportement en cours de mission pourrait permettre de nombreuses nouvelles possibilités. Peut-être souhaitez-vous allumer ou éteindre un capteur, ou commander au satellite de produire un son pour le retrouver. Il y a beaucoup de possibilités, mais peut-être que la plus utile est la capacité d'allumer des appareils gourmands en énergie dans le satellite juste avant le lancement de la fusée, vous offrant ainsi beaucoup plus de flexibilité et de liberté pour opérer après que le satellite ait déjà été intégré à la fusée.

Dans cette leçon, essayons d'allumer et d'éteindre la LED sur la carte satellite via la station au sol. Cela représente un scénario où le satellite ne fait rien sans qu'on lui dise de le faire, et dispose essentiellement d'un système de commande simple.

:::info

## Rappels logiciels

La réception des données dans la bibliothèque CanSat est programmée sous forme de **rappels**, qui est une fonction appelée... eh bien, en retour, lorsqu'un certain événement se produit. Alors que jusqu'à présent, dans nos programmes, le code suivait toujours exactement les lignes que nous avions écrites, il semble maintenant exécuter occasionnellement une autre fonction entre-temps avant de continuer dans la boucle principale. Cela peut sembler déroutant, mais ce sera assez clair lorsqu'on le verra en action.

:::

## Blinky à distance

Pour cet exercice, essayons de reproduire le clignotement de la LED de la première leçon, mais cette fois la LED est en fait contrôlée à distance.

Regardons d'abord le programme côté satellite. L'initialisation est très familière maintenant, mais la boucle est légèrement plus surprenante - il n'y a rien dedans. Cela est dû au fait que toute la logique est gérée via la fonction de rappel à distance depuis la station au sol, donc nous pouvons simplement laisser la boucle vide.

Les choses plus intéressantes se passent dans la fonction `onDataReceived(String data)`. C'est la fonction de rappel susmentionnée, qui est programmée dans la bibliothèque pour être appelée chaque fois que la radio reçoit des données. Le nom de la fonction est programmé dans la bibliothèque, donc tant que vous utilisez exactement le même nom qu'ici, elle sera appelée lorsqu'il y a des données disponibles.

Dans cet exemple ci-dessous, les données sont imprimées à chaque fois juste pour visualiser ce qui se passe, mais l'état de la LED est également modifié à chaque fois qu'un message est reçu, indépendamment du contenu.

```Cpp title="Code satellite pour ne rien faire sans qu'on le lui dise"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

La variable `LED_IS_ON` est stockée en tant que variable globale, ce qui signifie qu'elle est accessible de n'importe où dans le code. Celles-ci sont généralement mal vues en programmation, et les débutants sont enseignés à les éviter dans leurs programmes. Cependant, dans la programmation _embarquée_ comme nous le faisons ici, elles sont en fait un moyen très efficace et attendu de procéder. Faites juste attention à ne pas utiliser le même nom à plusieurs endroits !

:::

Si nous flashons cela sur la carte CanSat NeXT et la démarrons... Rien ne se passe. C'est bien sûr attendu, car nous n'avons pas de commandes entrantes pour le moment.

Du côté de la station au sol, le code n'est pas très compliqué. Nous initialisons le système, puis dans la boucle, nous envoyons un message toutes les 1000 ms, c'est-à-dire une fois par seconde. Dans le programme actuel, le message réel n'a pas d'importance, mais seulement que quelque chose est envoyé dans le même réseau.

```Cpp title="Station au sol envoyant des messages"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Maintenant, lorsque nous programmons ce code sur la station au sol (n'oubliez pas d'appuyer sur le bouton BOOT) et que le satellite est toujours allumé, la LED sur le satellite commence à clignoter, s'allumant et s'éteignant après chaque message. Le message est également imprimé sur le terminal.

:::tip[Exercice]

Flashez le code ci-dessous sur la carte de la station au sol. Que se passe-t-il du côté du satellite ? Pouvez-vous modifier le programme du satellite pour qu'il ne réagisse en allumant la LED que lorsqu'il reçoit `LED ON` et en l'éteignant avec `LED OFF`, et sinon, qu'il imprime simplement le texte.

```Cpp title="Station au sol envoyant des messages"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Générer un index aléatoire pour choisir un message
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Envoyer le message sélectionné aléatoirement
  sendData(messages[randomIndex]);
}
```

:::

Notez également que la réception de messages ne bloque pas leur envoi, donc nous pourrions (et allons) envoyer des messages des deux côtés en même temps. Le satellite peut transmettre des données en continu, tandis que la station au sol peut continuer à envoyer des commandes au satellite. Si les messages sont simultanés (dans la même milliseconde environ), il peut y avoir un conflit et le message ne passe pas. Cependant, CanSat NeXT retransmettra automatiquement le message s'il détecte un conflit. Donc, soyez juste conscient que cela peut arriver, mais qu'il passera probablement inaperçu.

---

Dans la prochaine leçon, nous allons développer cela pour effectuer un **contrôle de flux** à distance, ou changer le comportement du satellite en fonction des commandes reçues.

[Cliquez ici pour la leçon suivante !](./lesson8)