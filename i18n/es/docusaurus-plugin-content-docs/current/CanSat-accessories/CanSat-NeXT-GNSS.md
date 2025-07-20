---
sidebar_position: 1
---

# Módulo GNSS de CanSat NeXT

El módulo GNSS de CanSat NeXT extiende CanSat NeXT con capacidades de seguimiento de ubicación y reloj en tiempo real preciso. El módulo está basado en el receptor GNSS U-Blox SAM-M10Q de U-Blox.

![Módulo GNSS de CanSat NeXT](./img/GNSS.png)

## Hardware

El módulo conecta el receptor GNSS al CanSat NeXT a través del UART en el encabezado de extensión. El dispositivo utiliza los pines 16 y 17 del encabezado de extensión para UART RX y TX, y también toma la fuente de alimentación de la línea +3V3 en el encabezado de extensión.

Por defecto, los registros de respaldo del módulo GNSS son alimentados desde la línea +3V3. Aunque esto hace que el módulo sea fácil de usar, significa que el módulo siempre tiene que comenzar desde cero al intentar encontrar una solución. Para mitigar esto, es posible proporcionar una fuente de alimentación externa a través de la línea de voltaje de respaldo a través de los encabezados J103. El voltaje proporcionado al pin V_BCK debe ser de 2-6.5 voltios, y el consumo de corriente es constante de 65 microamperios, incluso cuando la alimentación principal está apagada. Proporcionar el voltaje de respaldo permite que el receptor GNSS mantenga todos los ajustes, pero también, crucialmente, los datos del almanaque y efemérides, reduciendo el tiempo para obtener una solución de ~30 segundos a 1-2 segundos si el dispositivo no se ha movido significativamente entre los cambios de energía.

Existen muchos otros módulos y breakout GNSS disponibles de compañías como Sparkfun y Adafruit, entre otros. Estos pueden conectarse al CanSat NeXT a través de la misma interfaz UART, o utilizando SPI e I2C, dependiendo del módulo. La biblioteca de CanSat NeXT también debería soportar otros breakouts que utilicen módulos U-blox. Al buscar breakouts GNSS, intenta encontrar uno donde el PCB base sea lo más grande posible; la mayoría presenta PCBs demasiado pequeños, lo que hace que su rendimiento de antena sea muy débil en comparación con módulos con PCBs más grandes. Cualquier tamaño menor a 50x50 mm comenzará a obstaculizar el rendimiento y la capacidad para encontrar y mantener una solución.

Para más información sobre el módulo GNSS y la gran cantidad de configuraciones y características disponibles, consulta la hoja de datos del receptor GNSS en el [sitio web de U-Blox](https://www.u-blox.com/en/product/sam-m10q-module).

La integración de hardware del módulo al CanSat NeXT es realmente simple: después de agregar separadores a los agujeros de los tornillos, inserta cuidadosamente los pines del encabezado en los sockets de pines. Si planeas hacer una pila electrónica de múltiples capas, asegúrate de colocar el GNSS como el módulo más alto para permitir

![Módulo GNSS de CanSat NeXT](./img/stack.png)

## Software

La forma más fácil de comenzar a usar el CanSat NeXT GNSS es con nuestra propia biblioteca de Arduino, que puedes encontrar en el administrador de bibliotecas de Arduino. Para instrucciones sobre cómo instalar la biblioteca, consulta la página de [primeros pasos](./../course/lesson1).

La biblioteca incluye ejemplos de cómo leer la posición y la hora actual, así como cómo transmitir los datos con CanSat NeXT.

Una nota rápida sobre las configuraciones: el módulo necesita saber en qué tipo de entorno se usará, para poder aproximar mejor la posición del usuario. Típicamente, se asume que el usuario estará a nivel del suelo, y aunque puede estar en movimiento, la aceleración probablemente no sea muy alta. Esto, por supuesto, no es el caso con los CanSats, que podrían ser lanzados con cohetes, o golpear el suelo con velocidades bastante altas. Por lo tanto, la biblioteca establece por defecto que la posición se calcule asumiendo un entorno de alta dinámica, lo que permite mantener la solución al menos en parte durante una aceleración rápida, pero también hace que la posición en tierra sea notablemente menos precisa. Si en cambio se desea una alta precisión una vez aterrizado, puedes inicializar el módulo GNSS con el comando `GNSS_init(DYNAMIC_MODEL_GROUND)`, reemplazando el `GNSS_init(DYNAMIC_MODEL_ROCKET)` = `GNSS_init()` por defecto. Además, existe `DYNAMIC_MODEL_AIRBORNE`, que es ligeramente más preciso que el modelo de cohete, pero asume solo una aceleración modesta.

Esta biblioteca prioriza la facilidad de uso, y solo tiene funcionalidades básicas como obtener la ubicación y la hora del GNSS. Para usuarios que buscan características GNSS más avanzadas, la excelente SparkFun_u-blox_GNSS_Arduino_Library podría ser una mejor opción.

## Especificación de la biblioteca

Aquí están los comandos disponibles de la biblioteca GNSS de CanSat.

### GNSS_Init

| Función              | uint8_t GNSS_Init(uint8_t dynamic_model)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 1 si la inicialización fue exitosa, o 0 si hubo un error. |
| **Parámetros**       |                                                                    |
|                      | `uint8_t dynamic_model`                                           |
|                      | Esto elige el modelo dinámico, o el entorno que el módulo GNSS asume. Las opciones posibles son DYNAMIC_MODEL_GROUND, DYNAMIC_MODEL_AIRBORNE y DYNAMIC_MODEL_ROCKET. |
| **Descripción**      | Este comando inicializa el módulo GNSS, y debes llamarlo en la función de configuración. |

### readPosition

| Función              | uint8_t readPosition(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Devuelve 0 si la medición fue exitosa.                             |
| **Parámetros**       |                                                                    |
|                      | `float &latitude, float &longitude, float &altitude`                                    |
|                      | `float &x`: Dirección de una variable float donde se almacenarán los datos. |
| **Usado en el ejemplo de sketch** | Todos                                                  |
| **Descripción**      | Esta función se puede usar para leer la posición del dispositivo como coordenadas. Los valores serán semi-aleatorios antes de obtener la solución. La altitud es en metros sobre el nivel del mar, aunque no es muy precisa. |

### getSIV

| Función              | uint8_t getSIV()                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Número de satélites en vista |
| **Usado en el ejemplo de sketch** | AdditionalFunctions                                          |
| **Descripción**      | Devuelve el número de satélites en vista. Típicamente, valores por debajo de 3 indican que no hay solución. |

### getTime

| Función              | uint32_t getTime()                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint32_t`                                                          |
| **Valor de Retorno** | Tiempo actual en Epoch |
| **Usado en el ejemplo de sketch** | AdditionalFunctions                                          |
| **Descripción**      | Devuelve el tiempo actual en epoch, según lo indicado por las señales de los satélites GNSS. En otras palabras, este es el número de segundos transcurridos desde las 00:00:00 UTC, jueves primero de enero de 1970. |