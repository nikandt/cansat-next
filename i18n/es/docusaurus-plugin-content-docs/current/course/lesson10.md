---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lección 10: Divide y vencerás

A medida que nuestros proyectos se vuelven más detallados, el código puede volverse difícil de manejar a menos que tengamos cuidado. En esta lección, veremos algunas prácticas que ayudarán a mantener proyectos más grandes manejables. Estas incluyen dividir el código en múltiples archivos, gestionar dependencias y, finalmente, introducir el control de versiones para rastrear cambios, respaldar el código y ayudar en la colaboración.

## Dividiendo el código en múltiples archivos

En proyectos pequeños, tener todo el código fuente en un solo archivo puede parecer bien, pero a medida que el proyecto escala, las cosas pueden volverse desordenadas y más difíciles de manejar. Una buena práctica es dividir tu código en diferentes archivos basados en la funcionalidad. Cuando se hace bien, esto también produce pequeños módulos que puedes reutilizar en diferentes proyectos sin introducir componentes innecesarios en otros proyectos. Un gran beneficio de tener múltiples archivos es que facilita la colaboración, ya que otras personas pueden trabajar en otros archivos, ayudando a evitar situaciones donde el código es difícil de fusionar.

El siguiente texto asume que estás usando Arduino IDE 2. Los usuarios avanzados podrían sentirse más cómodos con sistemas como [Platformio](https://platformio.org/), pero aquellos de ustedes ya estarán familiarizados con estos conceptos.

En Arduino IDE 2, todos los archivos en la carpeta del proyecto se muestran como pestañas en el IDE. Los nuevos archivos pueden ser creados directamente en el IDE, o a través de tu sistema operativo. Hay tres tipos diferentes de archivos, **headers** `.h`, **archivos fuente** `.cpp`, y **archivos de Arduino** `.ino`.

De estos tres, los archivos de Arduino son los más fáciles de entender. Son simplemente archivos extra, que se copian al final de tu script principal `.ino` al compilar. Como tal, puedes usarlos fácilmente para crear estructuras de código más comprensibles y tomar todo el espacio que necesites para una función complicada sin hacer que el archivo fuente sea difícil de leer. El mejor enfoque suele ser tomar una funcionalidad e implementarla en un archivo. Así podrías tener, por ejemplo, un archivo separado para cada modo de operación, un archivo para transferencias de datos, un archivo para interpretación de comandos, un archivo para almacenamiento de datos y un archivo principal donde combines todo esto en un script funcional.

Los headers y archivos fuente son un poco más especializados, pero afortunadamente funcionan igual que en C++ en otros lugares, por lo que hay mucho material escrito sobre su uso, por ejemplo [aquí](https://www.learncpp.com/cpp-tutorial/header-files/).

## Ejemplo de estructura

Como ejemplo, tomemos el código desordenado de [Lección 8](./lesson8.md) y refactoricémoslo.

<details>
  <summary>Código desordenado original de la Lección 8</summary>
  <p>Aquí está todo el código para tu frustración.</p>
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
  Serial.println("Esperando...");
  sendData("Esperando...");
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

Esto ni siquiera es tan malo, pero puedes ver cómo podría volverse seriamente difícil de leer si ampliamos las funcionalidades o añadimos nuevos comandos para interpretar. En su lugar, dividamos esto en archivos de código separados y ordenados basados en las funcionalidades separadas.

He separado cada uno de los modos de operación en su propio archivo, añadido un archivo para la interpretación de comandos y finalmente hice un pequeño archivo de utilidades para contener funcionalidades que se necesitan en muchos lugares. Esta es una estructura de proyecto simple bastante típica, pero ya hace que el programa en su conjunto sea mucho más fácil de entender. Esto puede ser aún más fácil con una buena documentación y haciendo un gráfico, por ejemplo, que muestre cómo los archivos se enlazan entre sí.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Esquema principal"
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

```Cpp title="Modo pre-lanzamiento"
void preLaunch() {
  Serial.println("Esperando...");
  sendData("Esperando...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Modo de vuelo"
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

```Cpp title="Modo de recuperación"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Interpretación de comandos"
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

```Cpp title="Utilidades"
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

Aunque este enfoque ya es mucho mejor que tener un solo archivo para todo, todavía requiere una gestión cuidadosa. Por ejemplo, el **namespace** es compartido entre los diferentes archivos, lo que puede causar confusión en un proyecto más grande o al reutilizar código. Si hay funciones o variables con los mismos nombres, el código no sabe cuál usar, lo que lleva a conflictos o comportamientos inesperados.

Además, este enfoque no se presta bien a la **encapsulación**, que es clave para construir un código más modular y reutilizable. Cuando tus funciones y variables existen todas en el mismo espacio global, se vuelve más difícil evitar que una parte del código afecte inadvertidamente a otra. Aquí es donde entran en juego técnicas más avanzadas como namespaces, clases y programación orientada a objetos (OOP). Estos temas están fuera del alcance de este curso, pero se anima a la investigación individual sobre esos temas.

:::tip[Ejercicio]

¡Toma uno de tus proyectos anteriores y dale un cambio de imagen! Divide tu código en múltiples archivos y organiza tus funciones según sus roles (por ejemplo, gestión de sensores, manejo de datos, comunicación). ¡Observa cuán más limpio y fácil de manejar se vuelve tu proyecto!

:::

## Control de versiones

A medida que los proyectos crecen, y especialmente cuando varias personas están trabajando en ellos, es fácil perder el rastro de los cambios o sobrescribir (o reescribir) código accidentalmente. Ahí es donde entra el **control de versiones**. **Git** es la herramienta estándar de control de versiones en la industria que ayuda a rastrear cambios, gestionar versiones y organizar grandes proyectos con múltiples colaboradores.

Aprender Git puede parecer desalentador e incluso redundante para proyectos pequeños, pero te prometo que te agradecerás haberlo aprendido. Más tarde, ¡te preguntarás cómo te las arreglaste sin él!

Aquí hay un buen lugar para comenzar: [Comenzando con Git](https://docs.github.com/en/get-started/getting-started-with-git).

Hay varios servicios de Git disponibles, siendo los más populares:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub es una elección sólida debido a su popularidad y la abundancia de soporte disponible. De hecho, esta página web y las bibliotecas de [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) están alojadas en GitHub.

Git no solo es conveniente, es una habilidad esencial para cualquiera que trabaje profesionalmente en ingeniería o ciencia. La mayoría de los equipos de los que formarás parte estarán usando Git, por lo que es una buena idea hacer que su uso sea un hábito familiar.

Más tutoriales sobre Git:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)

:::tip[Ejercicio]

Configura un repositorio de Git para tu proyecto CanSat y sube tu código al nuevo repositorio. Esto te ayudará a desarrollar software tanto para el satélite como para la estación terrestre de una manera organizada y colaborativa.

:::

---

En la próxima lección, hablaremos sobre varias formas de extender el CanSat con sensores externos y otros dispositivos.

[¡Haz clic aquí para la próxima lección!](./lesson11)