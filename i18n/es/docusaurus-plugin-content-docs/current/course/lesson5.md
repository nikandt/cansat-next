---
sidebar_position: 5
---

# Lección 5: Guardando Bits y Bytes

A veces, obtener los datos directamente a una PC no es factible, como cuando estamos lanzando el dispositivo, lanzándolo con un cohete o tomando mediciones en lugares de difícil acceso. En tales casos, es mejor guardar los datos medidos en una tarjeta SD para procesarlos más tarde. Además, la tarjeta SD también se puede usar para almacenar configuraciones; por ejemplo, podríamos tener algún tipo de configuración de umbral o configuraciones de dirección almacenadas en la tarjeta SD.

## Tarjeta SD en la biblioteca CanSat NeXT

La biblioteca CanSat NeXT admite una amplia gama de operaciones con tarjetas SD. Se puede usar para guardar y leer archivos, pero también para crear directorios y nuevos archivos, moverlos o incluso eliminarlos. Todo esto podría ser útil en diversas circunstancias, pero mantengamos el enfoque aquí en las dos cosas básicas: leer un archivo y escribir datos en un archivo.

:::note

Si deseas tener control total del sistema de archivos, puedes encontrar los comandos en la [Especificación de la Biblioteca](./../CanSat-software/library_specification.md#sdcardpresent) o en el ejemplo de la biblioteca "SD_advanced".

:::

Como ejercicio, modifiquemos el código de la última lección para que en lugar de escribir las mediciones del LDR en el serial, las guardemos en la tarjeta SD.

Primero, definamos el nombre del archivo que usaremos. Agreguémoslo antes de la función de configuración como una **variable global**.

```Cpp title="Configuración Modificada"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Ahora que tenemos una ruta de archivo, podemos escribir en la tarjeta SD. Solo necesitamos dos líneas para hacerlo. El mejor comando para usar al guardar datos de medición es `appendFile()`, que solo toma la ruta del archivo y escribe los nuevos datos al final del archivo. Si el archivo no existe, lo crea. Esto hace que usar el comando sea muy fácil (y seguro). Podemos simplemente agregar los datos directamente y luego seguir eso con un cambio de línea para que los datos sean más fáciles de leer. ¡Y eso es todo! Ahora estamos almacenando las mediciones.

```Cpp title="Guardando datos del LDR en la tarjeta SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("Valor LDR:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Por defecto, el comando `appendFile()` almacena números de punto flotante con dos valores después del punto decimal. Para una funcionalidad más específica, podrías primero crear una cadena en el sketch y usar el comando `appendFile()` para almacenar esa cadena en la tarjeta SD. Por ejemplo:

```Cpp title="Guardando datos del LDR en la tarjeta SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Aquí se crea primero la cadena final, con `String(LDR_voltage, 6)` especificando que queremos 6 decimales después del punto. Podemos usar la misma cadena para imprimir y almacenar los datos. (Así como para transmitir vía radio)

## Leyendo Datos

A menudo es útil almacenar algo en la tarjeta SD para su uso futuro en el programa también. Estos podrían ser, por ejemplo, configuraciones sobre el estado actual del dispositivo, de modo que si el programa se reinicia, podamos cargar el estado actual nuevamente desde la tarjeta SD en lugar de comenzar desde valores predeterminados.

Para demostrar esto, agrega en la PC un nuevo archivo a la tarjeta SD llamado "delay_time", y escribe un número en el archivo, como 200. Intentemos reemplazar el tiempo de retraso configurado estáticamente en nuestro programa con una configuración leída de un archivo.

Intentemos leer el archivo de configuración en la configuración. Primero, introduzcamos una nueva variable global. Le di un valor predeterminado de 1000, para que si no logramos modificar el tiempo de retraso, este sea ahora el valor predeterminado.

En la configuración, primero deberíamos verificar si el archivo siquiera existe. Esto se puede hacer usando el comando `fileExists()`. Si no existe, simplemente usemos el valor predeterminado. Después de esto, los datos se pueden leer usando `readFile()`. Sin embargo, debemos tener en cuenta que es una cadena, no un entero como necesitamos que sea. Así que, convirtámoslo usando el comando de Arduino `toInt()`. Finalmente, verificamos si la conversión fue exitosa. Si no lo fue, el valor será cero, en cuyo caso simplemente seguiremos usando el valor predeterminado.

```Cpp title="Leyendo una configuración en la configuración"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Finalmente, no olvides cambiar el retraso en el bucle para usar la nueva variable.

```Cpp title="Valor de retraso configurado dinámicamente"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Ahora puedes intentar cambiar el valor en la tarjeta SD, o incluso quitar la tarjeta SD, en cuyo caso ahora debería usar el valor predeterminado para la duración del retraso.

:::note

Para reescribir la configuración en tu programa, puedes usar el comando [writeFile](./../CanSat-software/library_specification.md#writefile). Funciona igual que [appendFile](./../CanSat-software/library_specification.md#appendfile), pero sobrescribe cualquier dato existente.

:::

:::tip[Ejercicio]

Continúa desde tu solución al ejercicio en la lección 4, de modo que el estado se mantenga incluso si el dispositivo se reinicia. Es decir, almacena el estado actual en la tarjeta SD y léelo en la configuración. Esto simularía un escenario donde tu CanSat se reinicia repentinamente en vuelo o antes del vuelo, y con este programa aún tendrías un vuelo exitoso.

:::

---

En la próxima lección, veremos cómo usar la radio para transmitir datos entre procesadores. Deberías tener algún tipo de antena en tu CanSat NeXT y la estación base antes de comenzar esos ejercicios. Si aún no lo has hecho, echa un vistazo al tutorial para construir una antena básica: [Construyendo una antena](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

[¡Haz clic aquí para la próxima lección!](./lesson6)