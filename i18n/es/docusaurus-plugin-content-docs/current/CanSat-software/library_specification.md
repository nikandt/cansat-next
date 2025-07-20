---
sidebar_position: 1
---

# Especificación de la biblioteca

# Funciones

Puedes usar todas las funcionalidades regulares de Arduino con CanSat NeXT, así como cualquier biblioteca de Arduino. Las funciones de Arduino se pueden encontrar aquí: https://www.arduino.cc/reference/en/.

La biblioteca CanSat NeXT añade varias funciones fáciles de usar para utilizar los diferentes recursos a bordo, como sensores, radio y la tarjeta SD. La biblioteca viene con un conjunto de ejemplos que muestran cómo usar estas funcionalidades. La lista a continuación también muestra todas las funciones disponibles.

## Funciones de Inicialización del Sistema

### CanSatInit

| Función              | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la inicialización fue exitosa, o un valor distinto de cero si hubo un error. |
| **Parámetros**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Dirección MAC de 6 bytes compartida por el satélite y la estación terrestre. Este es un parámetro opcional: cuando no se proporciona, la radio no se inicializa. Usado en el ejemplo: Todos |
| **Descripción**      | Este comando se encuentra en el `setup()` de casi todos los scripts de CanSat NeXT. Se utiliza para inicializar el hardware de CanSatNeXT, incluidos los sensores y la tarjeta SD. Además, si se proporciona el `macAddress`, inicia la radio y comienza a escuchar mensajes entrantes. La dirección MAC debe ser compartida por la estación terrestre y el satélite. La dirección MAC se puede elegir libremente, pero hay algunas direcciones no válidas, como todos los bytes siendo `0x00`, `0x01`, y `0xFF`. Si la función de inicialización se llama con una dirección no válida, informará del problema al Serial. |

### CanSatInit (especificación simplificada de la dirección MAC)

| Función              | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la inicialización fue exitosa, o un valor distinto de cero si hubo un error. |
| **Parámetros**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Último byte de la dirección MAC, usado para diferenciar entre diferentes pares CanSat-GS. |
| **Descripción**      | Esta es una versión simplificada de CanSatInit con dirección MAC, que establece los otros bytes automáticamente a un valor seguro conocido. Esto permite a los usuarios diferenciar sus pares Transmisor-Receptor con solo un valor, que puede ser de 0-255.|

### GroundStationInit

| Función              | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la inicialización fue exitosa, o un valor distinto de cero si hubo un error. |
| **Parámetros**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Dirección MAC de 6 bytes compartida por el satélite y la estación terrestre. |
| **Usado en el ejemplo de sketch** | Recepción de estación terrestre                                          |
| **Descripción**      | Este es un pariente cercano de la función CanSatInit, pero siempre requiere la dirección MAC. Esta función solo inicializa la radio, no otros sistemas. La estación terrestre puede ser cualquier placa ESP32, incluyendo cualquier placa de desarrollo o incluso otra placa CanSat NeXT. |

### GroundStationInit (especificación simplificada de dirección MAC)

| Función              | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la inicialización fue exitosa, o un valor distinto de cero si hubo un error. |
| **Parámetros**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Último byte de la dirección MAC, utilizado para diferenciar entre diferentes pares CanSat-GS. |
| **Descripción**      | Esta es una versión simplificada de GroundStationInit con dirección MAC, que establece los otros bytes automáticamente a un valor seguro conocido. Esto permite a los usuarios diferenciar sus pares Transmisor-Receptor con solo un valor, que puede ser de 0-255.|

## Funciones IMU

### readAcceleration

| Función              | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la medición fue exitosa.                           |
| **Parámetros**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Dirección de una variable float donde se almacenarán los datos del eje x. |
| **Usado en el ejemplo de sketch** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la aceleración del IMU a bordo. Los parámetros son direcciones a variables float para cada eje. El ejemplo de IMU muestra cómo usar esta función para leer la aceleración. La aceleración se devuelve en unidades de G (9.81 m/s). |

### readAccelX

| Función              | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Devuelve la aceleración lineal en el eje X en unidades de G.                           |
| **Usado en el ejemplo de sketch** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la aceleración del IMU a bordo en un eje específico. El ejemplo de IMU muestra cómo usar esta función para leer la aceleración. La aceleración se devuelve en unidades de G (9.81 m/s). |

### readAccelY

| Función              | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Devuelve la aceleración lineal en el eje Y en unidades de G.                           |
| **Usado en el ejemplo de boceto** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la aceleración del IMU a bordo en un eje específico. El ejemplo de IMU muestra cómo usar esta función para leer la aceleración. La aceleración se devuelve en unidades de G (9.81 m/s). |

### readAccelZ

| Función              | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Devuelve la aceleración lineal en el eje Z en unidades de G.                           |
| **Usado en el ejemplo de boceto** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la aceleración del IMU a bordo en un eje específico. El ejemplo de IMU muestra cómo usar esta función para leer la aceleración. La aceleración se devuelve en unidades de G (9.81 m/s). |

### readGyro

| Función              | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la medición fue exitosa.                           |
| **Parámetros**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Dirección de una variable float donde se almacenarán los datos del eje x. |
| **Usado en el ejemplo de boceto** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la velocidad angular del IMU a bordo. Los parámetros son direcciones a variables float para cada eje. El ejemplo de IMU muestra cómo usar esta función para leer la velocidad angular. La velocidad angular se devuelve en unidades de mrad/s. |

### readGyroX

| Función              | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Devuelve la velocidad angular en el eje X en unidades de mrad/s.                           |
| **Usado en el ejemplo de boceto** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la velocidad angular del IMU a bordo en un eje específico. Los parámetros son direcciones a variables float para cada eje. La velocidad angular se devuelve en unidades de mrad/s. |

### readGyroY

| Función              | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Devuelve la velocidad angular en el eje Y en unidades de mrad/s.                           |
| **Usado en el ejemplo de boceto** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la velocidad angular del IMU a bordo en un eje específico. Los parámetros son direcciones a variables float para cada eje. La velocidad angular se devuelve en unidades de mrad/s. |

### readGyroZ

| Función             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Devuelve la velocidad angular en el eje Z en unidades de mrad/s.                           |
| **Usado en el ejemplo** | IMU                                                  |
| **Descripción**      | Esta función se puede usar para leer la velocidad angular del IMU a bordo en un eje específico. Los parámetros son direcciones a variables float para cada eje. La velocidad angular se devuelve en unidades de mrad/s. |

## Funciones del Barómetro

### readPressure

| Función             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Presión en mbar                                                   |
| **Parámetros**       | Ninguno                                                            |
| **Usado en el ejemplo** | Baro                                                        |
| **Descripción**      | Esta función devuelve la presión según lo informado por el barómetro a bordo. La presión está en unidades de milibar. |

### readTemperature

| Función             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Temperatura en Celsius                                            |
| **Parámetros**       | Ninguno                                                            |
| **Usado en el ejemplo** | Baro                                                        |
| **Descripción**      | Esta función devuelve la temperatura según lo informado por el barómetro a bordo. La unidad de la lectura es Celsius. Tenga en cuenta que esta es la temperatura interna medida por el barómetro, por lo que podría no reflejar la temperatura externa. |

## Funciones de Tarjeta SD / Sistema de Archivos

### SDCardPresent

| Función             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `bool`                                                             |
| **Valor de Retorno** | Devuelve true si detecta una tarjeta SD, false si no.               |
| **Parámetros**       | Ninguno                                                            |
| **Usado en el ejemplo** | SD_advanced                                                |
| **Descripción**      | Esta función se puede usar para verificar si la tarjeta SD está presente mecánicamente. El conector de la tarjeta SD tiene un interruptor mecánico, que se lee cuando se llama a esta función. Devuelve true o false dependiendo de si se detecta la tarjeta SD. |

### appendFile

| Función             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la escritura fue exitosa.                           |
| **Parámetros**       |                                                                    |
|                      | `String filename`: Dirección del archivo al que se añadirá. Si el archivo no existe, se crea. |
|                      | `T data`: Datos que se añadirán al final del archivo.         |
| **Usado en el ejemplo de sketch** | SD_write                                               |
| **Descripción**      | Esta es la función básica de escritura utilizada para almacenar lecturas en la tarjeta SD. |

### printFileSystem

| Función             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       | Ninguno                                                            |
| **Usado en el ejemplo de sketch** | SD_advanced                                                |
| **Descripción**      | Esta es una pequeña función auxiliar para imprimir nombres de archivos y carpetas presentes en la tarjeta SD. Puede ser utilizada en desarrollo. |

### newDir

| Función             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `String path`: Ruta del nuevo directorio. Si ya existe, no se hace nada. |
| **Usado en el ejemplo de sketch** | SD_advanced                                                |
| **Descripción**      | Usada para crear nuevos directorios en la tarjeta SD.              |

### deleteDir

| Función             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `String path`: Ruta del directorio a eliminar.                     |
| **Usado en el ejemplo de sketch** | SD_advanced                                                |
| **Descripción**      | Usada para eliminar directorios en la tarjeta SD.                  |

### fileExists

| Función             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `bool`                                                             |
| **Valor de Retorno** | Devuelve true si el archivo existe.                                |
| **Parámetros**       |                                                                    |
|                      | `String path`: Ruta al archivo.                                    |
| **Usado en el ejemplo de sketch** | SD_advanced                                                |
| **Descripción**      | Esta función puede ser utilizada para verificar si un archivo existe en la tarjeta SD. |

### fileSize

| Función              | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint32_t`                                                         |
| **Valor de Retorno** | Tamaño del archivo en bytes.                                       |
| **Parámetros**       |                                                                    |
|                      | `String path`: Ruta al archivo.                                    |
| **Usado en ejemplo de boceto** | SD_advanced                                                |
| **Descripción**      | Esta función se puede usar para leer el tamaño de un archivo en la tarjeta SD.|

### writeFile

| Función              | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 si la escritura fue exitosa.                             |
| **Parámetros**       |                                                                    |
|                      | `String filename`: Dirección del archivo a escribir.               |
|                      | `T data`: Datos a escribir en el archivo.                          |
| **Usado en ejemplo de boceto** | SD_advanced                                                |
| **Descripción**      | Esta función es similar a `appendFile()`, pero sobrescribe los datos existentes en la tarjeta SD. Para el almacenamiento de datos, se debe usar `appendFile`. Esta función puede ser útil para almacenar configuraciones, por ejemplo.|

### readFile

| Función              | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `String`                                                           |
| **Valor de Retorno** | Todo el contenido del archivo.                                     |
| **Parámetros**       |                                                                    |
|                      | `String path`: Ruta al archivo.                                    |
| **Usado en ejemplo de boceto** | SD_advanced                                                |
| **Descripción**      | Esta función se puede usar para leer todos los datos de un archivo en una variable. Intentar leer archivos grandes puede causar problemas, pero es adecuado para archivos pequeños, como archivos de configuración o ajustes.|

### renameFile

| Función              | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `String oldpath`: Ruta original al archivo.                       |
|                      | `String newpath`: Nueva ruta del archivo.                         |
| **Usado en ejemplo de boceto** | SD_advanced                                                |
| **Descripción**      | Esta función se puede usar para renombrar o mover archivos en la tarjeta SD.|

### deleteFile

| Función              | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `String path`: Ruta del archivo a eliminar.                        |
| **Usado en el ejemplo de sketch** | SD_advanced                                                |
| **Descripción**      | Esta función se puede usar para eliminar archivos de la tarjeta SD. |

## Funciones de Radio

### onDataReceived

| Función              | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `String data`: Datos recibidos como un String de Arduino.          |
| **Usado en el ejemplo de sketch** | Groundstation_receive                                      |
| **Descripción**      | Esta es una función de callback que se llama cuando se reciben datos. El código del usuario debe definir esta función, y el CanSat NeXT la llamará automáticamente cuando se reciban datos. |

### onBinaryDataReceived

| Función              | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `const uint8_t *data`: Datos recibidos como un array de uint8_t.   |
|                      | `uint16_t len`: Longitud de los datos recibidos en bytes.          |
| **Usado en el ejemplo de sketch** | Ninguno                                                 |
| **Descripción**      | Esto es similar a la función `onDataReceived`, pero los datos se proporcionan como binarios en lugar de un objeto String. Esto se proporciona para usuarios avanzados que encuentran limitaciones en el objeto String. |

### onDataSent

| Función              | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parámetros**       |                                                                    |
|                      | `const bool success`: Booleano que indica si los datos se enviaron con éxito. |
| **Usado en el ejemplo de sketch** | Ninguno                                                 |
| **Descripción**      | Esta es otra función de callback que se puede agregar al código del usuario si es necesario. Se puede usar para verificar si la recepción fue reconocida por otro radio. |

### getRSSI

| Función              | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `int8_t`                                                          |
| **Valor de Retorno** | RSSI del último mensaje recibido. Devuelve 1 si no se han recibido mensajes desde el inicio.                           |
| **Usado en el ejemplo de sketch** | Ninguno                                                  |
| **Descripción**      | Esta función se puede usar para monitorear la fuerza de la señal de la recepción. Se puede usar para probar antenas o medir el alcance del radio. El valor se expresa en [dBm](https://en.wikipedia.org/wiki/DBm), sin embargo, la escala no es precisa. |

### sendData (Variante String)

| Función              | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | 0 si los datos fueron enviados (no indica reconocimiento).         |
| **Parámetros**       |                                                                    |
|                      | `T data`: Datos a enviar. Se puede usar cualquier tipo de datos, pero se convierte internamente a una cadena.                  |
| **Usado en el ejemplo** | Send_data                                             |
| **Descripción**      | Esta es la función principal para enviar datos entre la estación terrestre y el satélite. Tenga en cuenta que el valor de retorno no indica si los datos fueron realmente recibidos, solo que fueron enviados. El callback `onDataSent` se puede usar para verificar si los datos fueron recibidos por el otro extremo. |

### sendData (Variante binaria) {#sendData-binary}

| Función              | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | 0 si los datos fueron enviados (no indica reconocimiento).         |
| **Parámetros**       |                                                                    |
|                      | `T* data`: Datos a enviar.                    |
|                      | `uint16_t len`: Longitud de los datos en bytes.                      |
| **Usado en el ejemplo** | Ninguno                                                 |
| **Descripción**      | Una variante binaria de la función `sendData`, proporcionada para usuarios avanzados que se sienten limitados por el objeto String. |

### getRSSI

| Función              | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `int8_t`                                                          |
| **Valor de Retorno** | RSSI del último mensaje recibido. Devuelve 1 si no se han recibido mensajes desde el arranque.                           |
| **Usado en el ejemplo** | Ninguno                                                  |
| **Descripción**      | Esta función se puede usar para monitorear la fuerza de la señal de recepción. Se puede usar para probar antenas o medir el alcance de la radio. El valor se expresa en [dBm](https://en.wikipedia.org/wiki/DBm), sin embargo, la escala no es precisa. 

### setRadioChannel

| Función              | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                          |
| **Valor de Retorno** | Ninguno                                                          |
| **Parámetros**       | `uint8_t newChannel`: Número de canal Wi-Fi deseado (1–11). Cualquier valor por encima de 11 se limitará a 11. |
| **Usado en el ejemplo** | Ninguno                                                      |
| **Descripción**      | Establece el canal de comunicación ESP-NOW. El nuevo canal debe estar dentro del rango de canales Wi-Fi estándar (1–11), que corresponden a frecuencias comenzando desde 2.412 GHz con pasos de 5 MHz. El canal 1 es 2.412, el canal 2 es 2.417 y así sucesivamente. Llame a esta función antes de la inicialización de la biblioteca. El canal predeterminado es 1. |

### getRadioChannel

| Función              | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                       |
| **Valor de Retorno** | El canal principal de Wi-Fi actual. Devuelve 0 si hay un error al obtener el canal. |
| **Usado en ejemplo** | Ninguno                                                         |
| **Descripción**      | Recupera el canal principal de Wi-Fi que se está utilizando actualmente. Esta función solo funciona después de la inicialización de la biblioteca. |

### printRadioFrequency

| Función              | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                          |
| **Valor de Retorno** | Ninguno                                                         |
| **Usado en ejemplo** | Ninguno                                                         |
| **Descripción**      | Calcula e imprime la frecuencia actual en GHz basada en el canal Wi-Fi activo. Esta función solo funciona después de la inicialización de la biblioteca. |


## Funciones ADC

### adcToVoltage

| Función              | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Voltaje convertido en voltios.                                    |
| **Parámetros**       |                                                                    |
|                      | `int value`: Lectura ADC a convertir en voltaje.                  |
| **Usado en ejemplo** | AccurateAnalogRead                                                |
| **Descripción**      | Esta función convierte una lectura ADC a voltaje usando un polinomio calibrado de tercer orden para una conversión más lineal. Tenga en cuenta que esta función calcula el voltaje en el pin de entrada, por lo que para calcular el voltaje de la batería, también debe considerar la red de resistencias. |

### analogReadVoltage

| Función              | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Voltaje ADC en voltios.                                           |
| **Parámetros**       |                                                                    |
|                      | `int pin`: Pin a leer.                                            |
| **Usado en ejemplo** | AccurateAnalogRead                                                |
| **Descripción**      | Esta función lee el voltaje directamente en lugar de usar `analogRead` y convierte la lectura a voltaje internamente usando `adcToVoltage`. |