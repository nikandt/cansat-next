---
sidebar_position: 9
---

# Lección 8: Sigue el Flujo

El tema de esta lección es el control de flujo, o cómo podemos gestionar lo que hace el procesador en diferentes momentos. Hasta ahora, la mayoría de nuestros programas se han centrado en una sola tarea, lo cual, aunque sencillo, limita el potencial del sistema. Al introducir diferentes **estados** en nuestro programa, podemos expandir sus capacidades.

Por ejemplo, el programa podría tener un estado de pre-lanzamiento, donde el satélite espera el despegue. Luego, podría pasar al modo de vuelo, donde lee datos de sensores y realiza su misión principal. Finalmente, podría activarse un modo de recuperación, en el cual el satélite envía señales para ayudar con la recuperación: luces parpadeantes, pitidos o ejecutando cualquier acción del sistema que hayamos diseñado.

El **disparador** para cambiar entre estados puede variar. Podría ser una lectura de sensor, como un cambio de presión, un comando externo, un evento interno (como un temporizador), o incluso una ocurrencia aleatoria, dependiendo de lo que se requiera. En esta lección, construiremos sobre lo que aprendimos anteriormente utilizando un comando externo como disparador.

## Control de Flujo con Disparadores Externos

Primero, modifiquemos el código de la estación terrestre para poder recibir mensajes del monitor Serial, de modo que podamos enviar comandos personalizados cuando sea necesario.

Como puedes ver, los únicos cambios están en el bucle principal. Primero, verificamos si hay datos recibidos del Serial. Si no, no se hace nada y el bucle continúa. Sin embargo, si hay datos, se leen en una variable, se imprimen para mayor claridad y luego se envían vía radio al satélite. Si todavía tienes el programa de la lección anterior cargado en el satélite, puedes probarlo.

```Cpp title="Estación terrestre capaz de enviar comandos"
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

## Serial In - Fuentes de Datos

Cuando leemos datos del objeto `Serial`, estamos accediendo a los datos almacenados en el buffer UART RX, que se transmiten a través de la conexión USB Serial Virtual. En la práctica, esto significa que cualquier software capaz de comunicarse a través de un puerto serial virtual, como el IDE de Arduino, programas de terminal o varios entornos de programación, puede usarse para enviar datos al CanSat.

Esto abre muchas posibilidades para controlar el CanSat desde programas externos. Por ejemplo, podemos enviar comandos escribiéndolos manualmente, pero también escribir scripts en Python u otros lenguajes para automatizar comandos, haciendo posible crear sistemas de control más avanzados. Al aprovechar estas herramientas, puedes enviar instrucciones precisas, realizar pruebas o monitorear el CanSat en tiempo real sin intervención manual.

:::

A continuación, veamos el lado del satélite. Dado que tenemos múltiples estados en el programa, se vuelve un poco más largo, pero desglosémoslo paso a paso.

Primero, inicializamos los sistemas como de costumbre. También hay un par de variables globales, que colocamos en la parte superior del archivo para que sea fácil ver qué nombres se están utilizando. El `LED_IS_ON` es familiar de nuestros ejemplos de código anteriores, y además tenemos una variable de estado global `STATE`, que almacena el... bueno, estado.

```Cpp title="Inicialización"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
A continuación, en el bucle simplemente verificamos qué subrutina debe ejecutarse según el estado actual, y llamamos a su función:

```Cpp title="Bucle"
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
    // modo desconocido
    delay(1000);
  }
}
```

En este caso particular, cada estado está representado por una función separada que se llama según el estado. El contenido de las funciones no es realmente importante aquí, pero aquí están:

```Cpp title="Subrutinas"
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

También hay una pequeña función auxiliar `blinkLED`, que ayuda a evitar la repetición de código al manejar el parpadeo del LED por nosotros.

Finalmente, el estado se cambia cuando la estación terrestre nos lo indica:

```Cpp title="Callback de comando recibido"
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
  <summary>Código completo</summary>
  <p>Aquí está el código completo para tu conveniencia.</p>
```Cpp title="Satélite con múltiples estados"
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
    // modo desconocido
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

Con esto, ahora podemos controlar lo que el satélite está haciendo sin siquiera tener acceso físico a él. Más bien, podemos simplemente enviar un comando con la estación terrestre y el satélite hace lo que queremos.

:::tip[Ejercicio]

Crea un programa que mida un sensor con una frecuencia específica, que se pueda cambiar con un comando remoto a cualquier valor. En lugar de usar subrutinas, intenta modificar un valor de retraso directamente con un comando.

Intenta también hacerlo tolerante a entradas inesperadas, como "-1", "ABCDFEG" o "".

Como ejercicio adicional, haz que la nueva configuración sea permanente entre reinicios, de modo que cuando el satélite se apague y encienda nuevamente, reanude la transmisión con la nueva frecuencia en lugar de volver a la original. Como consejo, revisar la [lección 5](./lesson5.md) puede ser útil.

:::

---

En la próxima lección, haremos que nuestro almacenamiento de datos, comunicación y manejo sean significativamente más eficientes y rápidos utilizando datos binarios. Aunque al principio pueda parecer abstracto, manejar datos como binarios en lugar de números simplifica muchas tareas, ya que es el lenguaje nativo de la computadora.

[¡Haz clic aquí para la próxima lección!](./lesson9)