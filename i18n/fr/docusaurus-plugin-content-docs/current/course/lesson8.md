---
sidebar_position: 9
---

# Leçon 8 : Suivre le Flux

Le sujet de cette leçon est le contrôle de flux, ou comment nous pouvons gérer ce que le processeur fait à différents moments. Jusqu'à présent, la plupart de nos programmes se sont concentrés sur une seule tâche, ce qui, bien que simple, limite le potentiel du système. En introduisant différents **états** dans notre programme, nous pouvons élargir ses capacités.

Par exemple, le programme pourrait avoir un état de pré-lancement, où le satellite attend le décollage. Ensuite, il pourrait passer en mode vol, où il lit les données des capteurs et accomplit sa mission principale. Enfin, un mode de récupération pourrait s'activer, dans lequel le satellite envoie des signaux pour aider à la récupération—clignotement des lumières, bips, ou exécution de toute autre action système que nous avons conçue.

Le **déclencheur** pour passer d'un état à un autre peut varier. Cela pourrait être une lecture de capteur, comme un changement de pression, une commande externe, un événement interne (comme un minuteur), ou même un événement aléatoire, selon ce qui est requis. Dans cette leçon, nous allons nous appuyer sur ce que nous avons appris précédemment en utilisant une commande externe comme déclencheur.

## Contrôle de Flux avec Déclencheurs Externes

Tout d'abord, modifions le code de la station au sol pour pouvoir recevoir des messages du moniteur série, afin que nous puissions envoyer des commandes personnalisées lorsque nécessaire.

Comme vous pouvez le voir, les seuls changements se trouvent dans la boucle principale. Tout d'abord, nous vérifions s'il y a des données reçues du Série. Si ce n'est pas le cas, rien n'est fait, et la boucle continue. Cependant, s'il y a des données, elles sont lues dans une variable, imprimées pour plus de clarté, puis envoyées via la radio au satellite. Si vous avez encore le programme de la leçon précédente téléchargé sur le satellite, vous pouvez l'essayer.

```Cpp title="Station au sol capable d'envoyer des commandes"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Entrée Série - Sources de Données

Lorsque nous lisons des données de l'objet `Serial`, nous accédons aux données stockées dans le tampon RX UART, qui sont transmises via la connexion USB Série Virtuelle. En pratique, cela signifie que tout logiciel capable de communiquer via un port série virtuel, tel que l'IDE Arduino, des programmes de terminal, ou divers environnements de programmation, peut être utilisé pour envoyer des données au CanSat.

Cela ouvre de nombreuses possibilités pour contrôler le CanSat à partir de programmes externes. Par exemple, nous pouvons envoyer des commandes en les tapant manuellement, mais aussi écrire des scripts en Python ou d'autres langages pour automatiser les commandes, rendant possible la création de systèmes de contrôle plus avancés. En tirant parti de ces outils, vous pouvez envoyer des instructions précises, effectuer des tests, ou surveiller le CanSat en temps réel sans intervention manuelle.

:::

Ensuite, regardons le côté satellite. Puisque nous avons plusieurs états dans le programme, il devient un peu plus long, mais décomposons-le étape par étape.

Tout d'abord, nous initialisons les systèmes comme d'habitude. Il y a aussi quelques variables globales, que nous plaçons en haut du fichier pour qu'il soit facile de voir quels noms sont utilisés. Le `LED_IS_ON` est familier de nos exemples de code précédents, et nous avons en plus une variable d'état globale `STATE`, qui stocke... eh bien, l'état.

```Cpp title="Initialisation"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Ensuite, dans la boucle, nous vérifions simplement quelle sous-routine doit être exécutée selon l'état actuel, et appelons sa fonction :

```Cpp title="Boucle"
void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // mode inconnu
    delay(1000);
  }
}
```

Dans ce cas particulier, chaque état est représenté par une fonction distincte qui est appelée en fonction de l'état. Le contenu des fonctions n'est pas vraiment important ici, mais les voici :

```Cpp title="Sous-routines"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}
```

Il y a aussi une petite fonction d'assistance `blinkLED`, qui aide à éviter la répétition de code en gérant le basculement de la LED pour nous.

Enfin, l'état est changé lorsque la station au sol nous le dit :

```Cpp title="Callback de commande reçue"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```

<details>
  <summary>Code complet</summary>
  <p>Voici le code complet pour votre commodité.</p>
```Cpp title="Satellite avec plusieurs états"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // mode inconnu
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Avec cela, nous pouvons maintenant contrôler ce que fait le satellite sans même avoir un accès physique à celui-ci. Au lieu de cela, nous pouvons simplement envoyer une commande avec la station au sol et le satellite fait ce que nous voulons.

:::tip[Exercice]

Créez un programme qui mesure un capteur avec une fréquence spécifique, qui peut être changée avec une commande à distance à n'importe quelle valeur. Au lieu d'utiliser des sous-routines, essayez de modifier directement une valeur de délai avec une commande.

Essayez également de le rendre tolérant aux entrées inattendues, telles que "-1", "ABCDFEG" ou "".

En exercice bonus, faites en sorte que le nouveau paramètre soit permanent entre les réinitialisations, de sorte que lorsque le satellite est éteint et rallumé, il reprenne la transmission avec la nouvelle fréquence au lieu de revenir à l'originale. Comme conseil, revisiter la [leçon 5](./lesson5.md) peut être utile.

:::

---

Dans la prochaine leçon, nous rendrons notre stockage de données, communication et gestion beaucoup plus efficaces et rapides en utilisant des données binaires. Bien que cela puisse sembler abstrait au début, manipuler les données sous forme binaire au lieu de nombres simplifie de nombreuses tâches, car c'est le langage natif de l'ordinateur.

[Cliquez ici pour la prochaine leçon !](./lesson9)