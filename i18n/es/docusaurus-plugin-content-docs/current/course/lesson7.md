---
sidebar_position: 8
---

# Lección 7: Responder

Los CanSats a menudo se programan para operar con una lógica bastante simple, por ejemplo, tomando mediciones cada n milisegundos, guardando y transmitiendo los datos y repitiendo. En contraste, enviar comandos al satélite para cambiar su comportamiento en medio de la misión podría habilitar muchas nuevas posibilidades. Quizás te gustaría encender o apagar un sensor, o comandar al satélite para que emita un sonido y así poder encontrarlo. Hay muchas posibilidades, pero quizás la más útil es la capacidad de encender dispositivos que consumen mucha energía en el satélite justo antes del lanzamiento del cohete, dándote mucha más flexibilidad y libertad para operar después de que el satélite ya ha sido integrado al cohete.

En esta lección, intentemos encender y apagar el LED en la placa del satélite a través de la estación terrestre. Esto representa un escenario donde el satélite no hace nada sin que se le indique hacerlo, y esencialmente tiene un sistema de comandos simple.

:::info

## Callbacks de Software

La recepción de datos en la biblioteca CanSat está programada como **callbacks**, que es una función que se llama... bueno, de vuelta, cuando ocurre un cierto evento. Mientras que hasta ahora en nuestros programas el código siempre ha seguido exactamente las líneas que hemos escrito, ahora parece que ocasionalmente ejecuta otra función entre medio antes de continuar en el bucle principal. Esto puede sonar confuso, pero será bastante claro cuando se vea en acción.

:::

## Parpadeo Remoto

Para este ejercicio, intentemos replicar el parpadeo del LED de la primera lección, pero esta vez el LED está realmente controlado de forma remota.

Veamos primero el programa del lado del satélite. La inicialización es muy familiar a estas alturas, pero el bucle es ligeramente más sorprendente: no hay nada allí. Esto se debe a que toda la lógica se maneja a través de la función de callback de forma remota desde la estación terrestre, por lo que podemos simplemente dejar el bucle vacío.

Lo más interesante ocurre en la función `onDataReceived(String data)`. Esta es la función de callback mencionada, que está programada en la biblioteca para ser llamada cada vez que la radio recibe cualquier dato. El nombre de la función está programado en la biblioteca, por lo que mientras uses el mismo nombre exacto que aquí, se llamará cuando haya datos disponibles.

En este ejemplo a continuación, los datos se imprimen cada vez solo para visualizar lo que está sucediendo, pero el estado del LED también cambia cada vez que se recibe un mensaje, independientemente del contenido.

```Cpp title="Código del satélite para no hacer nada sin ser indicado"
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

La variable `LED_IS_ON` se almacena como una variable global, lo que significa que es accesible desde cualquier parte del código. Estas típicamente son mal vistas en programación, y se enseña a los principiantes a evitarlas en sus programas. Sin embargo, en programación _embebida_ como la que estamos haciendo aquí, son en realidad una forma muy eficiente y esperada de hacerlo. Solo ten cuidado de no usar el mismo nombre en múltiples lugares.

:::

Si cargamos esto en la placa CanSat NeXT y la iniciamos... No pasa nada. Esto es, por supuesto, esperado, ya que no tenemos ningún comando entrando en este momento.

En el lado de la estación terrestre, el código no es muy complicado. Inicializamos el sistema, y luego en el bucle enviamos un mensaje cada 1000 ms, es decir, una vez por segundo. En el programa actual, el mensaje real no importa, sino solo que se esté enviando algo en la misma red.

```Cpp title="Estación terrestre enviando mensajes"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Mensaje desde la estación terrestre");
}
```

Ahora, cuando programamos este código en la estación terrestre (no olvides presionar el botón BOOT) y el satélite sigue encendido, el LED en el satélite comienza a parpadear, encendiéndose y apagándose después de cada mensaje. El mensaje también se imprime en la terminal.

:::tip[Ejercicio]

Carga el fragmento de código a continuación en la placa de la estación terrestre. ¿Qué sucede en el lado del satélite? ¿Puedes cambiar el programa del satélite para que solo reaccione encendiendo el LED al recibir `LED ON` y apagándolo con `LED OFF`, y de lo contrario solo imprima el texto?

```Cpp title="Estación terrestre enviando mensajes"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "No hacer nada, esto es solo un mensaje",
  "¡Hola a CanSat!",
  "Woop woop",
  "¡Prepárate!"
};

void loop() {
  delay(400);
  
  // Generar un índice aleatorio para elegir un mensaje
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Enviar el mensaje seleccionado aleatoriamente
  sendData(messages[randomIndex]);
}
```

:::

Nota también que recibir mensajes no bloquea el envío de ellos, por lo que podríamos (y lo haremos) estar enviando mensajes desde ambos extremos al mismo tiempo. El satélite puede estar transmitiendo datos continuamente, mientras que la estación terrestre puede seguir enviando comandos al satélite. Si los mensajes son simultáneos (dentro del mismo milisegundo o así), puede haber un choque y el mensaje no pasa. Sin embargo, CanSat NeXT retransmitirá automáticamente el mensaje si detecta un choque. Así que solo ten en cuenta que puede suceder, pero que probablemente pasará desapercibido.

---

En la próxima lección, ampliaremos esto para realizar **control de flujo** de forma remota, o cambiar el comportamiento del satélite basado en los comandos recibidos.

[¡Haz clic aquí para la próxima lección!](./lesson8)