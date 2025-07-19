---
sidebar_position: 4
---

# Leçon 4 : La résistance n'est pas futile

Jusqu'à présent, nous nous sommes concentrés sur l'utilisation de dispositifs de capteurs numériques pour obtenir des valeurs directement en unités SI. Cependant, les dispositifs électriques effectuent généralement la mesure de manière indirecte, et la conversion dans les unités souhaitées est ensuite effectuée. Cela était fait auparavant par les dispositifs de capteurs eux-mêmes (et par la bibliothèque CanSat NeXT), mais de nombreux capteurs que nous utilisons sont beaucoup plus simples. Un type de capteurs analogiques est les capteurs résistifs, où la résistance d'un élément capteur change en fonction de certains phénomènes. Les capteurs résistifs existent pour une multitude de quantités - y compris la force, la température, l'intensité lumineuse, les concentrations chimiques, le pH, et bien d'autres.

Dans cette leçon, nous utiliserons la photorésistance (LDR) sur la carte CanSat NeXT pour mesurer l'intensité lumineuse ambiante. Bien que la thermistance soit utilisée de manière très similaire, ce sera le sujet d'une leçon future. Les mêmes compétences s'appliquent directement à l'utilisation de la LDR et de la thermistance, ainsi qu'à de nombreux autres capteurs résistifs.

![Emplacement de la LDR sur la carte](./../CanSat-hardware/img/LDR.png)

## Physique des capteurs résistifs

Au lieu de passer directement au logiciel, prenons du recul et discutons de la façon dont la lecture d'un capteur résistif fonctionne généralement. Considérons le schéma ci-dessous. La tension à LDR_EN est de 3,3 volts (tension de fonctionnement du processeur), et nous avons deux résistances connectées en série sur son chemin. L'une d'elles est la **LDR** (R402), tandis que l'autre est une **résistance de référence** (R402). La résistance de la résistance de référence est de 10 kilo-ohms, tandis que la résistance de la LDR varie entre 5-300 kilo-ohms selon les conditions lumineuses.

![Schéma de la LDR](./img/LDR.png)

Puisque les résistances sont connectées en série, la résistance totale est 

$$
R = R_{401} + R_{LDR},
$$

et le courant à travers les résistances est 

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

où $V_{OP}$ est la tension de fonctionnement du MCU. Rappelez-vous que le courant doit être le même à travers les deux résistances. Par conséquent, nous pouvons calculer la chute de tension sur la LDR comme 

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

Et cette chute de tension est la tension de la LDR que nous pouvons mesurer avec un convertisseur analogique-numérique. Habituellement, cette tension peut être directement corrélée ou calibrée pour correspondre aux valeurs mesurées, comme par exemple de la tension à la température ou à la luminosité. Cependant, il est parfois souhaitable de calculer d'abord la résistance mesurée. Si nécessaire, elle peut être calculée comme suit :

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Lecture de la LDR en pratique

Lire la LDR ou d'autres capteurs résistifs est très facile, car nous avons juste besoin d'interroger le convertisseur analogique-numérique pour la tension. Commençons cette fois un nouveau croquis Arduino à partir de zéro. Fichier -> Nouveau croquis.

Tout d'abord, commençons le croquis comme avant en incluant la bibliothèque. Cela se fait au début du croquis. Dans la configuration, démarrez le port série et initialisez CanSat, comme avant.

```Cpp title="Configuration de base"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Une boucle de base pour lire la LDR n'est pas beaucoup plus compliquée. Les résistances R401 et R402 sont déjà sur la carte, et nous avons juste besoin de lire la tension de leur nœud commun. Lisons la valeur de l'ADC et imprimons-la.

```Cpp title="Boucle de base LDR"
void loop() {
    int value = analogRead(LDR);
    Serial.print("Valeur LDR:");
    Serial.println(value);
    delay(200);
}
```

Avec ce programme, les valeurs réagissent clairement aux conditions d'éclairage. Nous obtenons des valeurs plus basses lorsque la LDR est exposée à la lumière, et des valeurs plus élevées lorsqu'il fait plus sombre. Cependant, les valeurs sont en centaines et milliers, pas dans une plage de tension attendue. Cela est dû au fait que nous lisons maintenant la sortie directe de l'ADC. Chaque bit représente une échelle de comparaison de tension étant un ou zéro selon la tension. Les valeurs sont maintenant de 0 à 4095 (2^12-1) selon la tension d'entrée. Encore une fois, cette mesure directe est probablement ce que vous voulez utiliser si vous faites quelque chose comme [détecter des impulsions avec la LDR](./../../blog/first-project#pulse-detection), mais souvent les volts réguliers sont agréables à utiliser. Bien que calculer la tension vous-même soit un bon exercice, la bibliothèque inclut une fonction de conversion qui prend également en compte la non-linéarité de l'ADC, ce qui signifie que la sortie est plus précise que celle d'une simple conversion linéaire.

```Cpp title="Lecture de la tension LDR"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("Valeur LDR:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Ce code est compatible avec le traceur série dans Arduino Code. Essayez-le !

:::

:::tip[Exercice]

Il pourrait être utile de détecter que le CanSat a été déployé depuis la fusée, afin que, par exemple, le parachute puisse être déployé au bon moment. Pouvez-vous écrire un programme qui détecte un déploiement simulé ? Simulez le lancement en couvrant d'abord la LDR (intégration de la fusée) puis en la découvrant (déploiement). Le programme pourrait afficher le déploiement sur le terminal, ou faire clignoter une LED pour montrer que le déploiement a eu lieu.

:::

---

La prochaine leçon porte sur l'utilisation de la carte SD pour stocker des mesures, des paramètres, et plus encore !

[Cliquez ici pour la prochaine leçon !](./lesson5)