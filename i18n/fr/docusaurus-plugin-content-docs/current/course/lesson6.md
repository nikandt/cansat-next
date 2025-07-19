---
sidebar_position: 6
---

# Leçon 6 : Appel à la maison

Nous avons maintenant pris des mesures et les avons également enregistrées sur une carte SD. La prochaine étape logique est de les transmettre sans fil au sol, ce qui ouvre un tout nouveau monde en termes de mesures et d'expériences que nous pouvons réaliser. Par exemple, essayer le vol en apesanteur avec l'IMU aurait été beaucoup plus intéressant (et facile à calibrer) si nous avions pu voir les données en temps réel. Voyons comment nous pouvons faire cela !

Dans cette leçon, nous enverrons des mesures de CanSat NeXT au récepteur de la station au sol. Plus tard, nous examinerons également comment commander le CanSat avec des messages envoyés par la station au sol.

## Antennes

Avant de commencer cette leçon, assurez-vous d'avoir un type d'antenne connecté à la carte CanSat NeXT et à la station au sol.

:::note

Vous ne devez jamais essayer de transmettre quoi que ce soit sans antenne. Non seulement cela ne fonctionnera probablement pas, mais il y a une possibilité que la puissance réfléchie endommage l'émetteur.

:::

Puisque nous utilisons la bande de 2,4 GHz, qui est partagée par des systèmes comme le Wi-Fi, le Bluetooth, l'ISM, les drones, etc., il existe de nombreuses antennes commerciales disponibles. La plupart des antennes Wi-Fi fonctionnent très bien avec CanSat NeXT, mais vous aurez souvent besoin d'un adaptateur pour les connecter à la carte CanSat NeXT. Nous avons également testé certains modèles d'adaptateurs, disponibles dans la boutique en ligne.

Plus d'informations sur les antennes peuvent être trouvées dans la documentation matérielle : [Communication et Antennes](./../CanSat-hardware/communication). Cet article contient également des [instructions](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) pour construire votre propre antenne à partir des matériaux du kit CanSat NeXT.

## Envoi de données

Avec la discussion sur les antennes terminée, commençons à envoyer quelques bits. Nous commencerons à nouveau par examiner la configuration, qui a en fait une différence clé cette fois-ci - nous avons ajouté un nombre en tant qu'**argument** à la commande `CanSatInit()`.

```Cpp title="Configuration pour la transmission"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Passer une valeur numérique à `CanSatInit()` indique au CanSat NeXT que nous voulons maintenant utiliser la radio. Le nombre indique la valeur de l'octet final de l'adresse MAC. Vous pouvez le considérer comme une clé pour votre réseau spécifique - vous ne pouvez communiquer qu'avec des CanSats partageant la même clé. Ce nombre doit être partagé entre votre CanSat NeXT et votre station au sol. Vous pouvez choisir votre numéro préféré entre 0 et 255. J'ai choisi 28, car il est [parfait](https://en.wikipedia.org/wiki/Perfect_number).

Avec la radio initialisée, transmettre les données est vraiment simple. Cela fonctionne en fait comme le `appendFile()` que nous avons utilisé dans la dernière leçon - vous pouvez ajouter n'importe quelle valeur et elle la transmettra dans un format par défaut, ou vous pouvez utiliser une chaîne formatée et l'envoyer à la place.

```Cpp title="Transmission des données"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Avec ce code simple, nous transmettons maintenant la mesure LDR presque 10 fois par seconde. Ensuite, voyons comment la recevoir.

:::note

Ceux qui sont familiers avec la programmation bas niveau pourraient se sentir plus à l'aise en envoyant les données sous forme binaire. Ne vous inquiétez pas, nous avons ce qu'il vous faut. Les commandes binaires sont listées dans la [Spécification de la bibliothèque](./../CanSat-software/library_specification.md#senddata-binary-variant).

:::

## Réception des données

Ce code doit maintenant être programmé sur un autre ESP32. Habituellement, c'est la deuxième carte contrôleur incluse dans le kit, mais pratiquement n'importe quel autre ESP32 fonctionnera également - y compris un autre CanSat NeXT.

:::note

Si vous utilisez une carte de développement ESP32 comme station au sol, n'oubliez pas d'appuyer sur le bouton Boot de la carte lors du flashage depuis l'IDE. Cela met l'ESP32 en mode de démarrage approprié pour reprogrammer le processeur. CanSat NeXT le fait automatiquement, mais les cartes de développement ne le font généralement pas.

:::

Le code de configuration est exactement le même qu'avant. N'oubliez pas de changer la clé radio pour votre numéro préféré.

```Cpp title="Configuration pour la réception"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Cependant, après cela, les choses deviennent un peu différentes. Nous faisons une fonction de boucle complètement vide ! C'est parce que nous n'avons en fait rien à faire dans la boucle, mais à la place, la réception se fait via des **callbacks**.

```Cpp title="Configuration d'un callback"
void loop() {
  // Nous n'avons rien à faire dans la boucle.
}

// Ceci est une fonction de callback. Elle est exécutée chaque fois que la radio reçoit des données.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Alors que la fonction `setup()` s'exécute une seule fois au démarrage et que `loop()` s'exécute en continu, la fonction `onDataReceived()` ne s'exécute que lorsque la radio a reçu de nouvelles données. De cette façon, nous pouvons gérer les données dans la fonction de callback. Dans cet exemple, nous les imprimons simplement, mais nous aurions également pu les modifier comme nous le voulions.

Notez que la fonction `loop()` n'a pas *à* être vide, vous pouvez en fait l'utiliser pour ce que vous voulez avec une mise en garde - les délais doivent être évités, car la fonction `onDataReceived()` ne s'exécutera pas tant que le délai n'est pas terminé.

Si vous avez maintenant les deux programmes en cours d'exécution sur des cartes différentes en même temps, il devrait y avoir pas mal de mesures envoyées sans fil à votre PC.

:::note

Pour les adeptes du binaire - vous pouvez utiliser la fonction de callback onBinaryDataReceived.

:::

## Temps réel en apesanteur

Juste pour le plaisir, répétons l'expérience en apesanteur mais avec des radios. Le code du récepteur peut rester le même, tout comme la configuration dans le code CanSat.

Pour rappel, nous avons créé un programme dans la leçon IMU qui détectait la chute libre et allumait une LED dans ce scénario. Voici l'ancien code :

```Cpp title="Fonction de boucle de détection de chute libre"
unsigned long LEDOnTill = 0;

void loop() {
  // Lire l'accélération
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculer l'accélération totale (au carré)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Mettre à jour le minuteur si nous détectons une chute
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Contrôler la LED en fonction du minuteur
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Il est tentant d'ajouter directement le `sendData()` à l'ancien exemple, cependant nous devons considérer le timing. Nous ne voulons généralement pas envoyer de messages plus de ~20 fois par seconde, mais d'un autre côté, nous voulons que la boucle fonctionne en continu pour que la LED s'allume toujours.

Nous devons ajouter un autre minuteur - cette fois pour envoyer des données toutes les 50 millisecondes. Le minuteur est fait en comparant l'heure actuelle à l'heure actuelle de la dernière fois où les données ont été envoyées. La dernière heure est ensuite mise à jour chaque fois que les données sont envoyées. Regardez également comment la chaîne est créée ici. Elle pourrait également être transmise en parties, mais de cette façon, elle est reçue comme un seul message, au lieu de plusieurs messages.

```Cpp title="Détection de chute libre + transmission de données"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Lire l'accélération
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculer l'accélération totale (au carré)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Mettre à jour le minuteur si nous détectons une chute
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Contrôler la LED en fonction du minuteur
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Mettre à jour l'heure de la dernière envoi à l'heure actuelle
    lastSendTime = millis();
  }

}
```

Le format des données ici est en fait compatible à nouveau avec le traceur série - en regardant ces données, il devient assez clair pourquoi nous avons pu détecter la chute libre plus tôt si nettement - les valeurs tombent vraiment à zéro dès que l'appareil est lâché ou lancé.

---

Dans la prochaine section, nous ferons une courte pause pour revoir ce que nous avons appris jusqu'à présent et nous assurer que nous sommes prêts à continuer à développer ces concepts.

[Cliquez ici pour la première révision !](./review1)