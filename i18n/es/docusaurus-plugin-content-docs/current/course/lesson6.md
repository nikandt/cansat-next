---
sidebar_position: 6
---

# Lección 6: Llamando a Casa

Ahora hemos tomado mediciones y también las hemos guardado en una tarjeta SD. El siguiente paso lógico es transmitirlas de forma inalámbrica a la estación terrestre, lo que permite un mundo completamente nuevo en términos de mediciones y experimentos que podemos realizar. Por ejemplo, probar el vuelo de gravedad cero con IMU habría sido mucho más interesante (y fácil de calibrar) si hubiéramos podido ver los datos en tiempo real. ¡Veamos cómo podemos hacer eso!

En esta lección, enviaremos mediciones desde CanSat NeXT al receptor de la estación terrestre. Más adelante, también veremos cómo comandar el CanSat con mensajes enviados por la estación terrestre.

## Antenas

Antes de comenzar esta lección, asegúrate de tener algún tipo de antena conectada a la placa CanSat NeXT y a la estación terrestre.

:::note

Nunca deberías intentar transmitir nada sin una antena. No solo probablemente no funcionará, existe la posibilidad de que la potencia reflejada dañe el transmisor.

:::

Dado que estamos usando la banda de 2.4 GHz, que es compartida por sistemas como Wi-Fi, Bluetooth, ISM, drones, etc., hay muchas antenas comerciales disponibles. La mayoría de las antenas Wi-Fi funcionan realmente bien con CanSat NeXT, pero a menudo necesitarás un adaptador para conectarlas a la placa CanSat NeXT. También hemos probado algunos modelos de adaptadores, que están disponibles en la tienda en línea.

Más información sobre antenas se puede encontrar en la documentación de hardware: [Comunicación y Antenas](./../CanSat-hardware/communication). Este artículo también tiene [instrucciones](./../CanSat-hardware/communication#quarter-wave-antenna) sobre cómo construir tu propia antena con los materiales del kit CanSat NeXT.

## Enviando Datos

Con la discusión sobre antenas fuera del camino, comencemos a enviar algunos bits. Comenzaremos nuevamente viendo la configuración, que en realidad tiene una diferencia clave esta vez: hemos agregado un número como un **argumento** al comando `CanSatInit()`.

```Cpp title="Configuración para transmisión"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Pasar un valor numérico a `CanSatInit()` le dice al CanSat NeXT que ahora queremos usar la radio. El número indica el valor del último byte de la dirección MAC. Puedes pensar en él como una clave para tu red específica: solo puedes comunicarte con CanSats que compartan la misma clave. Este número debe ser compartido entre tu CanSat NeXT y tu estación terrestre. Puedes elegir tu número favorito entre 0 y 255. Yo elegí 28, ya que es [perfecto](https://en.wikipedia.org/wiki/Perfect_number).

Con la radio inicializada, transmitir los datos es realmente simple. En realidad, opera igual que el `appendFile()` que usamos en la última lección: puedes agregar cualquier valor y lo transmitirá en un formato predeterminado, o puedes usar una cadena formateada y enviar eso en su lugar.

```Cpp title="Transmitiendo los datos"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Con este código simple, ahora estamos transmitiendo la medición del LDR casi 10 veces por segundo. A continuación, veamos cómo recibirlo.

:::note

Aquellos familiarizados con la programación de bajo nivel podrían sentirse más cómodos enviando los datos en forma binaria. No te preocupes, te tenemos cubierto. Los comandos binarios están listados en la [Especificación de la Biblioteca](./../CanSat-software/library_specification#sendData-binary).

:::

## Recibiendo Datos

Este código ahora debería ser programado en otro ESP32. Por lo general, es la segunda placa controladora incluida en el kit, sin embargo, prácticamente cualquier otro ESP32 funcionará también, incluyendo otro CanSat NeXT.

:::note

Si estás usando una placa de desarrollo ESP32 como la estación terrestre, recuerda presionar el botón Boot en la placa mientras flasheas desde el IDE. Esto configura el ESP32 en el modo de arranque correcto para reprogramar el procesador. CanSat NeXT hace esto automáticamente, pero las placas de desarrollo a menudo no lo hacen.

:::

El código de configuración es exactamente el mismo que antes. Solo recuerda cambiar la clave de radio a tu número favorito.

```Cpp title="Configuración para recepción"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Sin embargo, después de eso, las cosas son un poco diferentes. ¡Hacemos una función de bucle completamente vacía! Esto se debe a que en realidad no tenemos nada que hacer en el bucle, sino que la recepción se realiza a través de **callbacks**.

```Cpp title="Configurando un callback"
void loop() {
  // No tenemos nada que hacer en el bucle.
}

// Esta es una función de callback. Se ejecuta cada vez que la radio recibe datos.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Mientras que la función `setup()` se ejecuta solo una vez al inicio y `loop()` se ejecuta continuamente, la función `onDataReceived()` se ejecuta solo cuando la radio ha recibido nuevos datos. De esta manera, podemos manejar los datos en la función de callback. En este ejemplo, solo los imprimimos, pero también podríamos haberlos modificado como quisiéramos.

Ten en cuenta que la función `loop()` no *tiene* que estar vacía, en realidad puedes usarla para lo que quieras con una advertencia: se deben evitar los retrasos, ya que la función `onDataReceived()` tampoco se ejecutará hasta que el retraso haya terminado.

Si ahora tienes ambos programas ejecutándose en diferentes placas al mismo tiempo, debería haber bastantes mediciones siendo enviadas de forma inalámbrica a tu PC.

:::note

Para los orientados al binario, puedes usar la función de callback onBinaryDataReceived.

:::

## Gravedad Cero en Tiempo Real

Solo por diversión, repitamos el experimento de gravedad cero pero con radios. El código del receptor puede permanecer igual, al igual que la configuración en el código de CanSat.

Como recordatorio, hicimos un programa en la lección de IMU que detectaba caída libre y encendía un LED en este escenario. Aquí está el código antiguo:

```Cpp title="Función de bucle de detección de caída libre"
unsigned long LEDOnTill = 0;

void loop() {
  // Leer Aceleración
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcular aceleración total (cuadrada)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Actualizar el temporizador si detectamos una caída
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Controlar el LED basado en el temporizador
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Es tentador simplemente agregar el `sendData()` directamente al ejemplo anterior, sin embargo, necesitamos considerar el tiempo. Por lo general, no queremos enviar mensajes más de ~20 veces por segundo, pero por otro lado queremos que el bucle se ejecute continuamente para que el LED aún se encienda.

Necesitamos agregar otro temporizador, esta vez para enviar datos cada 50 milisegundos. El temporizador se realiza comparando el tiempo actual con el tiempo actual de la última vez que se enviaron datos. La última vez se actualiza cada vez que se envían datos. Observa también cómo se crea la cadena aquí. También podría transmitirse en partes, pero de esta manera se recibe como un solo mensaje, en lugar de múltiples mensajes.

```Cpp title="Detección de caída libre + transmisión de datos"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Leer Aceleración
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcular aceleración total (cuadrada)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Actualizar el temporizador si detectamos una caída
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Controlar el LED basado en el temporizador
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Actualizar el último tiempo de envío al tiempo actual
    lastSendTime = millis();
  }

}
```

El formato de datos aquí es en realidad compatible nuevamente con el trazador serial: al observar esos datos, queda bastante claro por qué pudimos detectar la caída libre antes de manera tan clara: los valores realmente caen a cero tan pronto como el dispositivo se deja caer o se lanza.

---

En la siguiente sección, tomaremos un breve descanso para revisar lo que hemos aprendido hasta ahora y asegurarnos de que estamos preparados para continuar construyendo sobre estos conceptos.

[¡Haz clic aquí para la primera revisión!](./review1)