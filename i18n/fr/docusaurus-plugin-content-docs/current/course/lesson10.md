---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Leçon 10 : Diviser pour mieux régner

À mesure que nos projets deviennent plus détaillés, le code peut devenir difficile à gérer à moins que nous soyons prudents. Dans cette leçon, nous examinerons certaines pratiques qui aideront à garder les projets plus importants gérables. Celles-ci incluent la division du code en plusieurs fichiers, la gestion des dépendances, et enfin l'introduction du contrôle de version pour suivre les modifications, sauvegarder le code et faciliter la collaboration.

## Diviser le code en plusieurs fichiers

Dans les petits projets, avoir tout le code source dans un seul fichier peut sembler correct, mais à mesure que le projet s'agrandit, les choses peuvent devenir désordonnées et plus difficiles à gérer. Une bonne pratique consiste à diviser votre code en différents fichiers en fonction de la fonctionnalité. Lorsqu'ils sont bien réalisés, cela produit également de jolis petits modules que vous pouvez réutiliser dans différents projets sans introduire de composants inutiles dans d'autres projets. Un grand avantage des fichiers multiples est également qu'ils facilitent la collaboration, car d'autres personnes peuvent travailler sur d'autres fichiers, aidant à éviter les situations où le code est difficile à fusionner.

Le texte suivant suppose que vous utilisez Arduino IDE 2. Les utilisateurs avancés se sentiront peut-être plus à l'aise avec des systèmes tels que [Platformio](https://platformio.org/), mais ceux d'entre vous seront déjà familiers avec ces concepts.

Dans Arduino IDE 2, tous les fichiers du dossier du projet sont affichés sous forme d'onglets dans l'IDE. De nouveaux fichiers peuvent être créés directement dans l'IDE ou via votre système d'exploitation. Il existe trois types de fichiers différents, **headers** `.h`, **fichiers source** `.cpp`, et **fichiers Arduino** `.ino`.  

Parmi ces trois, les fichiers Arduino sont les plus faciles à comprendre. Ce sont simplement des fichiers supplémentaires, qui sont copiés à la fin de votre script principal `.ino` lors de la compilation. En tant que tels, vous pouvez facilement les utiliser pour créer des structures de code plus compréhensibles et prendre tout l'espace dont vous avez besoin pour une fonction compliquée sans rendre le fichier source difficile à lire. La meilleure approche consiste généralement à prendre une fonctionnalité et à l'implémenter dans un fichier. Vous pourriez donc avoir, par exemple, un fichier séparé pour chaque mode de fonctionnement, un fichier pour les transferts de données, un fichier pour l'interprétation des commandes, un fichier pour le stockage des données, et un fichier principal où vous combinez tout cela en un script fonctionnel.

Les headers et les fichiers source sont un peu plus spécialisés, mais heureusement, ils fonctionnent de la même manière qu'avec C++ ailleurs, donc il y a beaucoup de documentation écrite à leur sujet, par exemple [ici](https://www.learncpp.com/cpp-tutorial/header-files/).

## Exemple de structure

À titre d'exemple, prenons le code désordonné de la [Leçon 8](./lesson8.md) et refactorisons-le.

<details>
  <summary>Code désordonné original de la Leçon 8</summary>
  <p>Voici tout le code pour votre frustration.</p>
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
  Serial.println("En attente...");
  sendData("En attente...");
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

Ce n'est même pas si mal, mais vous pouvez voir comment cela pourrait devenir sérieusement difficile à lire si nous développions les fonctionnalités ou ajoutions de nouvelles commandes à interpréter. Au lieu de cela, divisons cela en fichiers de code séparés et bien organisés en fonction des fonctionnalités distinctes.

J'ai séparé chacun des modes de fonctionnement dans son propre fichier, ajouté un fichier pour l'interprétation des commandes, et enfin créé un petit fichier utilitaire pour contenir les fonctionnalités nécessaires à plusieurs endroits. C'est une structure de projet simple assez typique, mais elle rend déjà le programme dans son ensemble beaucoup plus facile à comprendre. Cela peut être encore amélioré par une bonne documentation, et en créant un graphique par exemple qui montre comment les fichiers sont liés les uns aux autres.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Croquis principal"
#include "CanSatNeXT.h"

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
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Mode pré-lancement"
void preLaunch() {
  Serial.println("En attente...");
  sendData("En attente...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Mode vol"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Mode récupération"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Interprétation des commandes"
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
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Utilitaires"
bool LED_IS_ON = false;

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
```
  </TabItem>

</Tabs>

Bien que cette approche soit déjà bien meilleure que d'avoir un seul fichier pour tout, elle nécessite toujours une gestion attentive. Par exemple, l'**espace de noms** est partagé entre les différents fichiers, ce qui peut causer de la confusion dans un projet plus important ou lors de la réutilisation de code. S'il y a des fonctions ou des variables avec les mêmes noms, le code ne sait pas laquelle utiliser, ce qui entraîne des conflits ou un comportement inattendu.

De plus, cette approche ne se prête pas bien à l'**encapsulation**—qui est essentielle pour construire un code plus modulaire et réutilisable. Lorsque vos fonctions et variables existent toutes dans le même espace global, il devient plus difficile d'empêcher une partie du code d'affecter involontairement une autre. C'est là que des techniques plus avancées comme les espaces de noms, les classes et la programmation orientée objet (POO) entrent en jeu. Celles-ci dépassent le cadre de ce cours, mais une recherche individuelle sur ces sujets est encouragée.


:::tip[Exercice]

Prenez l'un de vos projets précédents et donnez-lui un relooking ! Divisez votre code en plusieurs fichiers et organisez vos fonctions en fonction de leurs rôles (par exemple, gestion des capteurs, gestion des données, communication). Voyez à quel point votre projet devient plus propre et plus facile à gérer !

:::


## Contrôle de version

À mesure que les projets grandissent — et surtout lorsque plusieurs personnes travaillent dessus — il est facile de perdre la trace des modifications ou d'écraser (ou réécrire) accidentellement du code. C'est là que le **contrôle de version** entre en jeu. **Git** est l'outil de contrôle de version standard de l'industrie qui aide à suivre les modifications, gérer les versions, et organiser de grands projets avec plusieurs collaborateurs.

Apprendre Git peut sembler intimidant, et même redondant pour les petits projets, mais je peux vous promettre que vous vous remercierez de l'avoir appris. Plus tard, vous vous demanderez comment vous avez pu vous en passer !

Voici un excellent point de départ : [Commencer avec Git](https://docs.github.com/en/get-started/getting-started-with-git).

Il existe plusieurs services Git disponibles, parmi lesquels les plus populaires incluent :

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub est un choix solide en raison de sa popularité et de l'abondance de support disponible. En fait, cette page web et les bibliothèques [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) sont hébergées sur GitHub.

Git n'est pas seulement pratique — c'est une compétence essentielle pour quiconque travaille professionnellement dans l'ingénierie ou la science. La plupart des équipes dont vous ferez partie utiliseront Git, donc c'est une bonne idée de vous habituer à l'utiliser.

Plus de tutoriels sur Git :

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)



:::tip[Exercice]

Configurez un dépôt Git pour votre projet CanSat et poussez votre code vers le nouveau dépôt. Cela vous aidera à développer des logiciels pour le satellite et la station au sol de manière organisée et collaborative.

:::

---

Dans la prochaine leçon, nous parlerons des différentes façons d'étendre le CanSat avec des capteurs externes et d'autres dispositifs.

[Cliquez ici pour la prochaine leçon !](./lesson11)