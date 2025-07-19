---
sidebar_position: 10
---

# Lección 9: Unos y Ceros

Hasta ahora hemos estado usando texto al almacenar o transmitir datos. Aunque esto facilita la interpretación, también es ineficiente. Las computadoras utilizan internamente datos **binarios**, donde los datos se almacenan como conjuntos de unos y ceros. En esta lección, veremos formas de usar datos binarios con CanSat NeXT y discutiremos dónde y por qué puede ser útil hacerlo.

:::info

## Diferentes tipos de datos

En forma binaria, todos los datos, ya sean números, texto o lecturas de sensores, se representan como una serie de unos y ceros. Diferentes tipos de datos utilizan diferentes cantidades de memoria e interpretan los valores binarios de maneras específicas. Revisemos brevemente algunos tipos de datos comunes y cómo se almacenan en binario:

- **Entero (int)**:  
  Los enteros representan números enteros. En un entero de 16 bits, por ejemplo, 16 unos y ceros pueden representar valores desde \(-32,768\) hasta \(32,767\). Los números negativos se almacenan usando un método llamado **complemento a dos**.

- **Entero sin signo (uint)**:  
  Los enteros sin signo representan números no negativos. Un entero sin signo de 16 bits puede almacenar valores desde \(0\) hasta \(65,535\), ya que no se reservan bits para el signo.

- **Flotante (float)**:  
  Los números de punto flotante representan valores decimales. En un flotante de 32 bits, parte de los bits representa el signo, el exponente y la mantisa, lo que permite a las computadoras manejar números muy grandes y muy pequeños. Es esencialmente una forma binaria de la [notación científica](https://es.wikipedia.org/wiki/Notaci%C3%B3n_cient%C3%ADfica).

- **Caracteres (char)**:  
  Los caracteres se almacenan utilizando esquemas de codificación como **ASCII** o **UTF-8**. Cada carácter corresponde a un valor binario específico (por ejemplo, 'A' en ASCII se almacena como `01000001`).

- **Cadenas (Strings)**:  
  Las cadenas son simplemente colecciones de caracteres. Cada carácter en una cadena se almacena en secuencia como valores binarios individuales. Por ejemplo, la cadena `"CanSat"` se almacenaría como una serie de caracteres como `01000011 01100001 01101110 01010011 01100001 01110100` (cada uno representando 'C', 'a', 'n', 'S', 'a', 't'). Como puedes ver, representar números como cadenas, como lo hemos estado haciendo hasta ahora, es menos eficiente en comparación con almacenarlos como valores binarios.

- **Arreglos y `uint8_t`**:  
  Al trabajar con datos binarios, es común usar un arreglo de `uint8_t` para almacenar y manejar datos de bytes en bruto. El tipo `uint8_t` representa un entero sin signo de 8 bits, que puede contener valores de 0 a 255. Dado que cada byte consta de 8 bits, este tipo es adecuado para contener datos binarios. Los arreglos de `uint8_t` se utilizan a menudo para crear búferes de bytes para contener secuencias de datos binarios en bruto (por ejemplo, paquetes). Algunas personas prefieren `char` u otras variables, pero realmente no importa cuál se use siempre que la variable tenga una longitud de 1 byte.
:::

## Transmitiendo datos binarios

Comencemos cargando un programa simple en el CanSat y centrémonos más en el lado de la estación terrestre. Aquí un código simple que transmite una lectura en formato binario:

```Cpp title="Transmitir datos LDR como binario"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

El código parece muy familiar, pero `sendData` ahora toma dos argumentos en lugar de solo uno: primero, la **dirección de memoria** de los datos a transmitir, y luego la **longitud** de los datos a transmitir. En este caso simplificado, solo usamos la dirección y longitud de la variable `LDR_voltage`.

Si intentas recibir esto con el código típico de la estación terrestre, solo imprimirá galimatías, ya que está tratando de interpretar los datos binarios como si fueran una cadena. En su lugar, tendremos que especificar a la estación terrestre qué incluyen los datos.

Primero, verifiquemos cuán largos son realmente los datos que estamos recibiendo.

```Cpp title="Verificar la longitud de los datos recibidos"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Recibido ");
  Serial.print(len);
  Serial.println(" bytes");
}
```

Cada vez que el satélite transmite, recibimos 4 bytes en la estación terrestre. Como estamos transmitiendo un flotante de 32 bits, esto parece correcto.

Para leer los datos, debemos tomar el búfer de datos binarios del flujo de entrada y copiar los datos a una variable adecuada. Para este caso simple, podemos hacer esto:

```Cpp title="Almacenar los datos en una variable"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Recibido ");
  Serial.print(len);
  Serial.println(" bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Datos: ");
  Serial.println(LDR_reading);
}
```

Primero introducimos la variable `LDR_reading` para contener los datos que *sabemos* que tenemos en el búfer. Luego usamos `memcpy` (copia de memoria) para copiar los datos binarios del búfer `data` en la **dirección de memoria** de `LDR_reading`. Esto asegura que los datos se transfieran exactamente como se almacenaron, manteniendo el mismo formato que en el satélite.

Ahora, si imprimimos los datos, es como si los leyéramos directamente en el lado de la estación terrestre. Ya no es texto como solía ser, sino los mismos datos que leímos en el lado del satélite. Ahora podemos procesarlo fácilmente en el lado de la estación terrestre como queramos.

## Creando nuestro propio protocolo

El verdadero poder de la transferencia de datos binarios se hace evidente cuando tenemos más datos para transmitir. Sin embargo, todavía necesitamos asegurarnos de que el satélite y la estación terrestre estén de acuerdo sobre qué byte representa qué. Esto se conoce como un **protocolo de paquete**.

Un protocolo de paquete define la estructura de los datos que se transmiten, especificando cómo empaquetar múltiples piezas de datos en una sola transmisión y cómo el receptor debe interpretar los bytes entrantes. Construyamos un protocolo simple que transmita múltiples lecturas de sensores de manera estructurada.

Primero, leamos todos los canales del acelerómetro y giroscopio y creemos el **paquete de datos** a partir de las lecturas.

```Cpp title="Transmitir datos LDR como binario"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Crear un arreglo para contener los datos
  uint8_t packet[24];

  // Copiar datos en el paquete
  memcpy(&packet[0], &ax, 4);  // Copiar acelerómetro X en bytes 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copiar giroscopio Z en bytes 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Aquí, primero leemos los datos como en la Lección 3, pero luego **codificamos** los datos en un paquete de datos. Primero, se crea el búfer real, que es solo un conjunto vacío de 24 bytes. Cada variable de datos se puede escribir en este búfer vacío con `memcpy`. Como estamos usando `float`, los datos tienen una longitud de 4 bytes. Si no estás seguro sobre la longitud de una variable, siempre puedes verificarla con `sizeof(variable)`.

:::tip[Ejercicio]

Crea un software de estación terrestre para interpretar e imprimir los datos del acelerómetro y giroscopio.

:::

## Almacenando datos binarios en tarjeta SD

Escribir datos como binarios en la tarjeta SD puede ser útil cuando se trabaja con grandes cantidades de datos, ya que el almacenamiento binario es más compacto y eficiente que el texto. Esto te permite guardar más datos con menos espacio de almacenamiento, lo cual puede ser útil en sistemas con limitaciones de memoria.

Sin embargo, usar datos binarios para almacenamiento tiene sus desventajas. A diferencia de los archivos de texto, los archivos binarios no son legibles por humanos, lo que significa que no se pueden abrir y entender fácilmente con editores de texto estándar o importar en programas como Excel. Para leer e interpretar datos binarios, se necesita desarrollar software o scripts especializados (por ejemplo, en Python) para analizar el formato binario correctamente.

Para la mayoría de las aplicaciones, donde la facilidad de acceso y flexibilidad es importante (como analizar datos en una computadora más tarde), se recomiendan formatos basados en texto como CSV. Estos formatos son más fáciles de trabajar en una variedad de herramientas de software y proporcionan más flexibilidad para un análisis rápido de datos.

Si estás decidido a usar almacenamiento binario, echa un vistazo más profundo "bajo el capó" revisando cómo la biblioteca CanSat maneja el almacenamiento de datos internamente. Puedes usar directamente métodos de manejo de archivos al estilo C para gestionar archivos, flujos y otras operaciones de bajo nivel de manera eficiente. Más información también se puede encontrar en la [biblioteca de tarjetas SD de Arduino](https://docs.arduino.cc/libraries/sd/).

---

Nuestros programas comienzan a ser cada vez más complicados, y también hay algunos componentes que sería bueno reutilizar en otros lugares. Para evitar que nuestro código sea difícil de manejar, sería bueno poder compartir algunos componentes en diferentes archivos y mantener el código legible. Veamos cómo se puede lograr esto con Arduino IDE.

[¡Haz clic aquí para la próxima lección!](./lesson10)