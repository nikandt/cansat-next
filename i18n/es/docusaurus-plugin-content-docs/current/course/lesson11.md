---
sidebar_position: 12
---

# Lección 11: El Satélite Debe Crecer

Aunque el CanSat NeXT ya tiene muchos sensores y dispositivos integrados en la propia placa del satélite, muchas misiones emocionantes de CanSat requieren el uso de otros sensores externos, servos, cámaras, motores u otros actuadores y dispositivos. Esta lección es ligeramente diferente a las anteriores, ya que discutiremos la integración de varios dispositivos externos al CanSat. Es probable que tu caso de uso específico no esté considerado, pero quizás algo similar sí lo esté. Sin embargo, si hay algo que sientes que debería cubrirse aquí, por favor envíame tus comentarios a samuli@kitsat.fi.

Esta lección es ligeramente diferente a las anteriores, ya que aunque toda la información es útil, deberías sentirte libre de saltar a las áreas que son relevantes para tu proyecto específicamente, y usar esta página como referencia. Sin embargo, antes de continuar con esta lección, por favor revisa los materiales presentados en la sección de [hardware](./../CanSat-hardware/CanSat-hardware.md) de la documentación de CanSat NeXT, ya que cubre mucha información necesaria para integrar dispositivos externos.

## Conectando dispositivos externos

Hay dos excelentes maneras de conectar dispositivos externos al CanSat NeXT: Usando [Placas de Protoboard](../CanSat-accessories/CanSat-NeXT-perf.md) y PCBs personalizadas. Hacer tu propio PCB es más fácil (y barato) de lo que podrías pensar, y para comenzar con ellos, un buen punto de partida es este [tutorial de KiCAD](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). También tenemos una [plantilla](../CanSat-hardware/mechanical_design#custom-PCB) disponible para KiCAD, por lo que hacer tus placas en el mismo formato es muy fácil.

Dicho esto, para la mayoría de las misiones de CanSat, soldar los sensores externos u otros dispositivos a una placa de protoboard es una excelente manera de crear pilas de electrónica confiables y robustas.

Una manera aún más fácil de comenzar, especialmente cuando se está prototipando por primera vez, es usar cables jumper (también llamados cables Dupont o cables de protoboard). Estos típicamente incluso se proporcionan con los sensores, pero también se pueden comprar por separado. Comparten el mismo paso de 0.1 pulgadas utilizado por el encabezado de pines de extensión, lo que hace que conectar dispositivos con cables sea muy fácil. Sin embargo, aunque los cables son fáciles de usar, son bastante voluminosos e inestables. Por esta razón, se recomienda encarecidamente evitar los cables para el modelo de vuelo de tu CanSat.

## Compartiendo energía a los dispositivos

CanSat NeXT utiliza 3.3 voltios para todos sus propios dispositivos, por lo que es la única línea de voltaje proporcionada al encabezado de extensión. Muchos módulos comerciales, especialmente los más antiguos, también soportan operación a 5 voltios, ya que es el voltaje utilizado por los Arduinos antiguos. Sin embargo, la gran mayoría de los dispositivos también soportan operación directamente a través de 3.3 voltios.

Para los pocos casos donde 5 voltios son absolutamente necesarios, puedes incluir un **convertidor de aumento** en la placa. Hay módulos listos disponibles, pero también puedes soldar directamente muchos dispositivos a la placa de protoboard. Dicho esto, intenta primero usar el dispositivo desde 3.3 voltios, ya que hay una buena probabilidad de que funcione.

La corriente máxima recomendada desde la línea de 3.3 voltios es de 300 mA, por lo que para dispositivos que consumen mucha corriente, como motores o calentadores, considera una fuente de energía externa.

## Líneas de datos

El encabezado de extensión tiene un total de 16 pines, de los cuales dos están reservados para líneas de tierra y energía. El resto son diferentes tipos de entradas y salidas, la mayoría de las cuales tienen múltiples usos posibles. El diagrama de pines de la placa muestra lo que cada uno de los pines puede hacer.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Todos los pines expuestos pueden usarse como entradas y salidas de propósito general (GPIO), lo que significa que puedes realizar funciones `digitalWrite` y `digitalRead` con ellos en el código.

### ADC

Los pines 33 y 32 tienen un convertidor analógico a digital (ADC), lo que significa que puedes usar `analogRead` (y `adcToVoltage`) para leer el voltaje en este pin.

### DAC

Estos pines pueden usarse para crear un voltaje específico en la salida. Ten en cuenta que producen el voltaje deseado, sin embargo, solo pueden proporcionar una cantidad muy pequeña de corriente. Estos podrían usarse como puntos de referencia para sensores, o incluso como una salida de audio, sin embargo, necesitarás un amplificador (o dos). Puedes usar `dacWrite` para escribir el voltaje. También hay un ejemplo en la biblioteca de CanSat para esto.

### SPI

El Serial Peripheral Interface (SPI) es una línea de datos estándar, a menudo utilizada por módulos de Arduino y dispositivos similares. Un dispositivo SPI necesita cuatro pines:

| **Nombre del Pin** | **Descripción**                                              | **Uso**                                                       |
|--------------------|--------------------------------------------------------------|---------------------------------------------------------------|
| **MOSI**           | Principal Salida Secundaria Entrada                          | Datos enviados desde el dispositivo principal (por ejemplo, CanSat) al dispositivo secundario. |
| **MISO**           | Principal Entrada Secundaria Salida                          | Datos enviados desde el dispositivo secundario de vuelta al dispositivo principal. |
| **SCK**            | Reloj Serial                                                 | Señal de reloj generada por el dispositivo principal para sincronizar la comunicación. |
| **SS/CS**          | Selección Secundaria/Selección de Chip                       | Usado por el dispositivo principal para seleccionar con qué dispositivo secundario comunicarse. |

Aquí, el principal es la placa CanSat NeXT, y el secundario es cualquier dispositivo con el que quieras comunicarte. Los pines MOSI, MISO y SCK pueden ser compartidos por múltiples secundarios, sin embargo, todos ellos necesitan su propio pin CS. El pin CS puede ser cualquier pin GPIO, por lo que no hay uno dedicado en el bus.

(Nota: Los materiales antiguos a veces usan los términos "maestro" y "esclavo" para referirse a los dispositivos principal y secundario. Estos términos ahora se consideran obsoletos).

En la placa CanSat NeXT, la tarjeta SD utiliza la misma línea SPI que el encabezado de extensión. Al conectar otro dispositivo SPI al bus, esto no importa. Sin embargo, si los pines SPI se usan como GPIO, la tarjeta SD queda efectivamente deshabilitada.

Para usar SPI, a menudo necesitas especificar qué pines del procesador se utilizan. Un ejemplo podría ser así, donde se utilizan **macros** incluidas en la biblioteca de CanSat para establecer los otros pines, y el pin 12 se establece como selección de chip.

```Cpp title="Inicializando la línea SPI para un sensor"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

Las macros `SPI_CLK`, `SPI_MOSI`, y `SPI_MISO` son reemplazadas por el compilador con 18, 23, y 19, respectivamente.

### I2C

El Circuito Inter-Integrado es otro protocolo de bus de datos popular, especialmente utilizado para pequeños sensores integrados, como el sensor de presión y la IMU en la placa CanSat NeXT.

I2C es útil ya que solo requiere dos pines, SCL y SDA. Tampoco hay un pin de selección de chip separado, sino que los diferentes dispositivos se separan por diferentes **direcciones**, que se utilizan para establecer la comunicación. De esta manera, puedes tener múltiples dispositivos en el mismo bus, siempre y cuando todos tengan una dirección única.

| **Nombre del Pin** | **Descripción**          | **Uso**                                                     |
|--------------------|--------------------------|-------------------------------------------------------------|
| **SDA**            | Línea de Datos Serial    | Línea de datos bidireccional utilizada para la comunicación entre dispositivos principal y secundario. |
| **SCL**            | Línea de Reloj Serial    | Señal de reloj generada por el dispositivo principal para sincronizar la transferencia de datos con dispositivos secundarios. |

El barómetro y la IMU están en el mismo bus I2C que el encabezado de extensión. Revisa las direcciones de esos dispositivos en la página [Sensores a bordo](../CanSat-hardware/on_board_sensors#IMU). Similar al SPI, puedes usar estos pines para conectar otros dispositivos I2C, pero si se usan como pines GPIO, la IMU y el barómetro quedan deshabilitados.

En la programación de Arduino, I2C a veces se llama `Wire`. A diferencia de SPI, donde el pinout a menudo se especifica para cada sensor, I2C se usa a menudo en Arduino estableciendo primero una línea de datos y luego haciendo referencia a esa línea para cada sensor. A continuación se muestra un ejemplo de cómo se inicializa el barómetro por la biblioteca CanSat NeXT:

```Cpp title="Inicializando la segunda línea serial"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Entonces, primero se inicializa un `Wire` diciéndole los pines I2C correctos. Las macros `I2C_SDA` y `I2C_SCL` establecidas en la biblioteca CanSat NeXT son reemplazadas por el compilador con 22 y 21, respectivamente.

### UART

El receptor-transmisor asíncrono universal (UART) es en algunos aspectos el protocolo de datos más simple, ya que simplemente envía los datos como binario a una frecuencia especificada. Como tal, está limitado a la comunicación punto a punto, lo que significa que generalmente no puedes tener múltiples dispositivos en el mismo bus.

| **Nombre del Pin** | **Descripción**          | **Uso**                                                     |
|--------------------|--------------------------|-------------------------------------------------------------|
| **TX**             | Transmitir               | Envía datos desde el dispositivo principal al dispositivo secundario. |
| **RX**             | Recibir                  | Recibe datos del dispositivo secundario al dispositivo principal. |

En CanSat, el UART en el encabezado de extensión no se usa para nada más. Sin embargo, hay otra línea UART, pero se usa para la comunicación USB entre el satélite y una computadora. Esto es lo que se usa al enviar datos al `Serial`.

La otra línea UART puede inicializarse en el código de esta manera:

```Cpp title="Inicializando la segunda línea serial"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Algunos dispositivos también usan [modulación por ancho de pulso](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) como su entrada de control. También puede usarse para LEDs regulables o controlar la salida de potencia en algunas situaciones, entre muchos otros casos de uso.

Con Arduino, solo ciertos pines pueden usarse como PWM. Sin embargo, como CanSat NeXT es un dispositivo basado en ESP32, todos los pines de salida pueden usarse para crear una salida PWM. El PWM se controla con `analogWrite`.

## ¿Qué pasa con (mi caso de uso específico)?

Para la mayoría de los dispositivos, puedes encontrar mucha información en internet. Por ejemplo, busca en Google el módulo específico que tienes y utiliza estos documentos para modificar los ejemplos que encuentres para usarlos con CanSat NeXT. Además, los sensores y otros dispositivos tienen **hojas de datos**, que deberían tener mucha información sobre cómo usar el dispositivo, aunque a veces pueden ser un poco difíciles de descifrar. Si sientes que hay algo que esta página debería haber cubierto, por favor házmelo saber en samuli@kitsat.fi.

En la próxima y última lección, discutiremos cómo preparar tu satélite para el lanzamiento.

[¡Haz clic aquí para la próxima lección!](./lesson12)