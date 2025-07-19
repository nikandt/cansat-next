---
sidebar_position: 2
---

# Lección 2: Sintiendo la Presión

En esta segunda lección, comenzaremos a usar los sensores en la placa CanSat NeXT. Esta vez, nos enfocaremos en medir la presión atmosférica circundante. Usaremos el barómetro a bordo [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) para leer la presión, así como para leer la temperatura del propio barómetro.

Comencemos con el código del barómetro en los ejemplos de la biblioteca. En Arduino IDE, selecciona Archivo-> Ejemplos->CanSat NeXT->Baro. 

El comienzo del programa se ve bastante familiar desde la última lección. Nuevamente, comenzamos incluyendo la biblioteca CanSat NeXT, configurando la conexión serial e inicializando los sistemas CanSat NeXT.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

La llamada a la función `CanSatInit()` inicializa todos los sensores por nosotros, incluido el barómetro. Así que podemos comenzar a usarlo en la función loop.

Las siguientes dos líneas son donde realmente se leen la temperatura y la presión. Cuando se llaman las funciones `readTemperature()` y `readPressure()`, el procesador envía un comando al barómetro, que mide la presión o la temperatura, y devuelve el resultado al procesador.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

En el ejemplo, los valores se imprimen, y luego esto es seguido por un retraso de 1000 ms, para que el ciclo se repita aproximadamente una vez por segundo.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Usando los datos

También podemos usar los datos en el código, en lugar de solo imprimirlos o guardarlos. Por ejemplo, podríamos hacer un código que detecte si la presión cae por una cierta cantidad, y por ejemplo encender el LED. O cualquier otra cosa que te gustaría hacer. Intentemos encender el LED a bordo.

Para implementar esto, necesitamos modificar ligeramente el código en el ejemplo. Primero, comencemos a rastrear el valor de presión anterior. Para crear **variables globales**, es decir, aquellas que no solo existen mientras estamos ejecutando una función específica, simplemente puedes escribirlas fuera de cualquier función específica. La variable previousPressure se actualiza en cada ciclo de la función loop, justo al final. De esta manera, mantenemos el seguimiento del valor antiguo y podemos compararlo con el valor más nuevo.

Podemos usar una declaración if para comparar los valores antiguos y nuevos. En el código a continuación, la idea es que si la presión anterior es 0.1 hPa menor que el nuevo valor, encenderemos el LED, y de lo contrario, el LED se mantendrá apagado.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

Si cargas este bucle modificado al CanSat NeXT, debería imprimir los valores de las variables como antes, pero ahora también buscará la caída de presión. La presión atmosférica cae aproximadamente 0.12 hPa / metro al subir, así que si intentas levantar rápidamente el CanSat NeXT un metro más alto, el LED debería encenderse por un ciclo de bucle (1 segundo) y luego apagarse nuevamente. ¡Probablemente sea mejor desconectar el cable USB antes de intentar esto!

También puedes intentar modificar el código. ¿Qué sucede si se cambia el retraso? ¿Qué pasa si se cambia la **histéresis** de 0.1 hPa, o incluso se elimina por completo?

---

En la próxima lección, tendremos aún más actividad física, ya que intentaremos usar el otro sensor integrado IC: la unidad de medición inercial.

[¡Haz clic aquí para la próxima lección!](./lesson3)