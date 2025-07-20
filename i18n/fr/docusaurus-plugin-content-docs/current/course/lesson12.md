---
sidebar_position: 13
---

# Leçon 12 : Prêt pour le décollage ?

Dans cette dernière leçon, nous parlerons de la préparation du satellite, de la station au sol et de l'équipe pour le lancement. Après cette leçon, nous aurons également une *révision* pour vérifier la préparation au vol, mais cette leçon se concentre sur la maximisation des chances d'une mission réussie. Dans cette leçon, nous parlerons de la préparation de vos composants électroniques mécaniquement et électriquement, de la vérification du système de communication radio, et enfin de quelques étapes de préparation utiles à effectuer bien avant l'événement de lancement réel.

Cette leçon est encore un peu différente, car au lieu d'explorer de nouveaux concepts de programmation, nous discutons de la manière d'améliorer la fiabilité de l'appareil dans la mission. De plus, bien que vous n'ayez probablement pas terminé la construction (ou la définition) de la mission du satellite si vous suivez maintenant le cours pour la première fois, il est bon de lire les documents de cette page, de prendre en compte ces aspects lors de la planification de votre appareil et de votre mission, et de revenir à eux lors de la préparation réelle pour le lancement.

## Considérations mécaniques

Tout d'abord, comme discuté dans la leçon précédente, la **pile** électronique doit être construite de manière à rester ensemble même en cas de fortes vibrations et de chocs. Une bonne façon de concevoir l'électronique est d'utiliser des plaques de montage, maintenues ensemble par des [entretoises](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) et connectées électriquement soit par un connecteur, soit avec un câble bien soutenu. Enfin, l'ensemble de la pile électronique doit être fixé au cadre du satellite de manière à ne pas bouger. Une connexion rigide avec des vis est toujours un choix solide (jeu de mots intentionnel), mais ce n'est pas la seule option. Une alternative pourrait être de concevoir le système pour qu'il se casse à l'impact, similaire à une [zone de déformation](https://en.wikipedia.org/wiki/Crumple_zone). Alternativement, un système de montage amorti avec du caoutchouc, de la mousse ou un système similaire pourrait réduire les contraintes subies par l'électronique, aidant à créer des systèmes réutilisables.

Dans un CanSat typique, certains éléments sont particulièrement vulnérables aux problèmes lors du lancement ou des atterrissages plus rapides que prévu. Ce sont les batteries, la carte SD et l'antenne.

### Sécurisation des batteries

Sur CanSat NeXT, la carte est conçue de manière à ce qu'un collier de serrage puisse être attaché autour de la carte pour s'assurer que les batteries restent en place en cas de vibration. Sinon, elles ont tendance à sortir des sockets. Une autre inquiétude concernant les batteries est que certaines sont plus courtes que ce qui serait idéal pour le support de batterie, et il est possible qu'en cas de choc particulièrement fort, les contacts de la batterie se plient sous le poids des batteries de manière à ce qu'un contact soit perdu. Pour atténuer cela, les contacts peuvent être soutenus en ajoutant un morceau de collier de serrage, de mousse ou autre matériau de remplissage derrière les contacts à ressort. Lors de tests de chute accidentels (et intentionnels), cela a amélioré la fiabilité, bien que les CanSat NeXT intégrés dans des CanSats bien construits aient survécu à des chutes de jusqu'à 1000 mètres (sans parachute) même sans ces mesures de protection. Une manière encore meilleure de soutenir les batteries est de concevoir une structure de support directement sur le cadre du CanSat, de sorte qu'elle supporte le poids des batteries à l'impact au lieu du support de batterie.

![CanSat avec collier de serrage](./img/cansat_with_ziptie.png)

### Sécurisation du câble d'antenne

Le connecteur d'antenne est U.Fl, qui est un type de connecteur classé pour l'automobile. Ils supportent bien les vibrations et les chocs malgré l'absence de supports mécaniques externes. Cependant, la fiabilité peut être améliorée en sécurisant l'antenne avec de petits colliers de serrage. La carte CanSat NeXT a de petites fentes à côté de l'antenne à cet effet. Pour garder l'antenne dans une position neutre, un [support peut être imprimé](../CanSat-hardware/communication#quarter-wave-antenna) pour elle.

![Antenne sécurisée en place avec un support imprimé en 3D](../CanSat-hardware/img/qw_6.png)

### Sécurisation de la carte SD

La carte SD peut sortir du support en cas de chocs élevés. Encore une fois, les cartes ont survécu à des chutes et des vols, mais la fiabilité peut être améliorée en scotchant ou en collant la carte SD au support. Les nouvelles cartes CanSat NeXT (≥1.02) sont équipées de supports de carte SD haute sécurité pour atténuer davantage ce problème.

## Test de communication

L'un des détails les plus vitaux à bien maîtriser pour une mission réussie est d'avoir un lien radio fiable. Il y a plus d'informations sur la sélection et/ou la construction des antennes dans [la section matériel](../CanSat-hardware/communication#antenna-options) de la documentation. Cependant, quel que soit l'antenne sélectionnée, le test est une partie vitale de tout système radio.

Le test d'antenne approprié peut être délicat et nécessite un équipement spécialisé tel que des [VNAs](https://en.wikipedia.org/wiki/Network_analyzer_(electrical)), mais nous pouvons faire un test fonctionnel directement avec le kit CanSat NeXT.

Tout d'abord, programmez le satellite pour envoyer des données, par exemple une lecture de données une fois par seconde. Ensuite, programmez la station au sol pour recevoir les données et imprimer les valeurs **RSSI** (indicateur de force du signal reçu), comme donné par la fonction `getRSSI()`, qui fait partie de la bibliothèque CanSat NeXT.

```Cpp title="Lire RSSI"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI : ");
  Serial.println(rssi);
}
```

Cette valeur représente la **puissance** électrique réelle reçue par la station au sol via son antenne lorsqu'elle reçoit un message. La valeur est exprimée en [décibelmilliwatts](https://en.wikipedia.org/wiki/DBm). Une lecture typique avec une antenne fonctionnelle aux deux extrémités lorsque les appareils sont sur une même table est de -30 dBm (1000 nanowatts), et elle devrait diminuer rapidement lorsque la distance augmente. Dans l'espace libre, elle suit approximativement la loi de l'inverse du carré, mais pas exactement en raison des échos, des zones de Fresnel et d'autres imperfections. Avec les paramètres radio que CanSat NeXT utilise par défaut, le RSSI peut être abaissé à environ -100 dBm (0,1 picowatt) et encore quelques données passent.

Cela correspond généralement à une distance d'environ un kilomètre lors de l'utilisation des antennes monopoles, mais peut être beaucoup plus si l'antenne de la station au sol a un gain significatif, ce qui ajoute directement à la lecture en dBm.

## Tests de puissance

Il est judicieux de mesurer la consommation de courant de votre satellite à l'aide d'un multimètre. C'est facile aussi, il suffit de retirer une des batteries et de la tenir manuellement de manière à pouvoir utiliser la mesure de courant du multimètre pour connecter entre une extrémité de la batterie et le contact de la batterie. Cette lecture devrait être de l'ordre de 130-200 mA si la radio CanSat NeXT est active et qu'il n'y a pas de dispositifs externes. La consommation de courant augmente à mesure que les batteries se déchargent, car plus de courant est nécessaire pour maintenir la tension à 3,3 volts à partir de la tension de la batterie en baisse.

Les piles AAA typiques ont une capacité d'environ 1200 mAh, ce qui signifie que la consommation de courant de l'appareil doit être inférieure à 300 mA pour garantir que les batteries dureront toute la mission. C'est aussi pourquoi il est judicieux d'avoir plusieurs modes de fonctionnement si des dispositifs gourmands en courant sont à bord, car ils peuvent être activés juste avant le vol pour garantir une bonne autonomie de la batterie.

Bien qu'une approche mathématique pour estimer la durée de vie de la batterie soit un bon début, il est toujours préférable de faire une mesure réelle de la durée de vie de la batterie en obtenant des batteries neuves et en effectuant une mission simulée.

## Tests aérospatiaux

Dans l'industrie aérospatiale, chaque satellite subit des tests rigoureux pour s'assurer qu'il peut survivre aux conditions difficiles du lancement, de l'espace et parfois de la rentrée. Bien que les CanSats opèrent dans un environnement légèrement différent, vous pourriez toujours adapter certains de ces tests pour améliorer la fiabilité. Voici quelques tests aérospatiaux courants utilisés pour les CubeSats et les petits satellites, ainsi que des idées sur la façon dont vous pourriez mettre en œuvre des tests similaires pour votre CanSat.

### Test de vibration

Le test de vibration est utilisé dans les systèmes de petits satellites pour deux raisons. La raison principale est que le test vise à identifier les fréquences de résonance de la structure pour s'assurer que la vibration de la fusée ne commence pas à résonner dans une structure du satellite, ce qui pourrait entraîner une défaillance des systèmes du satellite. La raison secondaire est également pertinente pour les systèmes CanSat, qui est de confirmer la qualité de l'artisanat et de s'assurer que le système survivra au lancement de la fusée. Les tests de vibration des satellites sont effectués avec des bancs de test de vibration spécialisés, mais l'effet peut être simulé avec des solutions plus créatives aussi. Essayez de trouver un moyen de vraiment secouer le satellite (ou de préférence son double), et voyez si quelque chose se casse. Comment cela pourrait-il être amélioré ?

### Test de choc

Cousin des tests de vibration, les tests de choc simulent la séparation explosive des étages lors du lancement de la fusée. L'accélération de choc peut atteindre jusqu'à 100 Gs, ce qui peut facilement casser les systèmes. Cela pourrait être simulé avec un test de chute, mais réfléchissez à la manière de le faire en toute sécurité pour que le satellite, vous-même ou le sol ne se casse pas.

### Test thermique

Le test thermique consiste à exposer l'ensemble du satellite aux extrêmes de la plage de fonctionnement prévue et également à passer rapidement entre ces températures. Dans le contexte du CanSat, cela pourrait signifier tester le satellite dans un congélateur, simulant un lancement par temps froid, ou dans un four légèrement chauffé pour simuler un jour de lancement chaud. Faites attention à ce que l'électronique, les plastiques ou votre peau ne soient pas exposés directement à des températures extrêmes.

## Bonnes idées générales

Voici quelques conseils supplémentaires pour aider à assurer une mission réussie. Ceux-ci vont des préparations techniques aux pratiques organisationnelles qui amélioreront la fiabilité globale de votre CanSat. N'hésitez pas à suggérer de nouvelles idées à ajouter ici via le canal habituel (samuli@kitsat.fi).

- Envisagez d'avoir une liste de contrôle pour éviter d'oublier quelque chose juste avant le lancement
- Testez toute la séquence de vol à l'avance dans un vol simulé
- Testez également le satellite dans des conditions environnementales similaires à celles attendues lors du vol. Assurez-vous que le parachute est également correct avec les températures attendues.
- Ayez des piles de rechange et réfléchissez à la manière dont elles sont installées si nécessaire
- Ayez une carte SD de rechange, elles échouent parfois
- Ayez un ordinateur de rechange et désactivez les mises à jour sur l'ordinateur avant le lancement.
- Ayez des colliers de serrage, des vis et tout ce dont vous avez besoin pour assembler le satellite
- Ayez quelques outils de base à portée de main pour aider au démontage et à l'assemblage
- Ayez des antennes supplémentaires
- Vous pouvez également avoir plusieurs stations au sol fonctionnant en même temps, qui peuvent également être utilisées pour trianguler le satellite, surtout s'il y a un RSSI disponible.
- Ayez des rôles clairs pour chaque membre de l'équipe pendant le lancement, les opérations et la récupération.

---

C'est la fin des leçons pour l'instant. Sur la page suivante se trouve une révision de la préparation au vol, qui est une pratique aidant à assurer des missions réussies.

[Cliquez ici pour la révision de la préparation au vol !](./review2)