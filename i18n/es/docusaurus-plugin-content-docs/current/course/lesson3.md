---
sidebar_position: 3
---

# Lección 3: Detectando el Giro

CanSat NeXT tiene dos ICs de sensores en la placa CanSat NeXT. Uno de ellos es el barómetro que usamos en la última lección, y el otro es la _unidad de medición inercial_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). El LSM6DS3 es un IMU de 6 ejes, lo que significa que es capaz de realizar 6 mediciones diferentes. En este caso, es la aceleración lineal en tres ejes (x, y, z) y la velocidad angular en tres ejes.

En esta lección, veremos el ejemplo de IMU en la biblioteca y también usaremos el IMU para hacer un pequeño experimento.

## Ejemplo de Biblioteca

Comencemos viendo cómo funciona el ejemplo de la biblioteca. Cárgalo desde Archivo -> Ejemplos -> CanSat NeXT -> IMU.

La configuración inicial es nuevamente la misma: incluir la biblioteca, inicializar el serial y CanSat. Así que, enfoquémonos en el bucle. Sin embargo, el bucle también se ve muy familiar. Leemos los valores tal como en la última lección, solo que esta vez hay muchos más de ellos.

```Cpp title="Leyendo valores del IMU"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Cada eje se lee con una diferencia de algunos cientos de microsegundos. Si necesitas que se actualicen simultáneamente, revisa las funciones [readAcceleration](./../CanSat-software/library_specification#readacceleration) y [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Después de leer los valores, podemos imprimirlos como de costumbre. Esto se podría hacer usando Serial.print y println tal como en la última lección, pero este ejemplo muestra una forma alternativa de imprimir los datos, con mucho menos escritura manual.

Primero, se crea un buffer de 128 caracteres. Luego, este se inicializa para que cada valor sea 0, usando memset. Después de esto, los valores se escriben en el buffer usando `snprintf()`, que es una función que se puede usar para escribir cadenas con un formato especificado. Finalmente, esto se imprime con `Serial.println()`.

```Cpp title="Impresión Elegante"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Si lo anterior te resulta confuso, puedes simplemente usar el estilo más familiar usando print y println. Sin embargo, esto se vuelve un poco molesto cuando hay muchos valores para imprimir.

```Cpp title="Impresión Regular"
Serial.print("Ax:");
Serial.println(ay);
// etc
```

Finalmente, hay nuevamente un breve retraso antes de comenzar el bucle nuevamente. Esto está principalmente para asegurar que la salida sea legible; sin un retraso, los números cambiarían tan rápido que sería difícil leerlos.

La aceleración se lee en Gs, o múltiplos de $9.81 \text{ m}/\text{s}^2$. La velocidad angular está en unidades de $\text{mrad}/\text{s}$.

:::tip[Ejercicio]

¡Intenta identificar el eje basado en las lecturas!

:::

## Detección de Caída Libre

Como ejercicio, intentemos detectar si el dispositivo está en caída libre. La idea es que lanzaríamos la placa al aire, CanSat NeXT detectaría la caída libre y encendería el LED durante un par de segundos después de detectar un evento de caída libre, para que podamos saber que nuestra verificación se activó incluso después de atraparlo nuevamente.

Podemos mantener la configuración tal como estaba y solo enfocarnos en el bucle. Vamos a limpiar la función de bucle anterior y comenzar de nuevo. Solo por diversión, leamos los datos usando el método alternativo.

```Cpp title="Leer Aceleración"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Definamos la caída libre como un evento cuando la aceleración total está por debajo de un valor umbral. Podemos calcular la aceleración total a partir de los ejes individuales como

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Lo cual se vería en el código algo así.

```Cpp title="Calculando aceleración total"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Y aunque esto funcionaría, deberíamos notar que calcular la raíz cuadrada es realmente lento computacionalmente, por lo que deberíamos evitar hacerlo si es posible. Después de todo, podríamos simplemente calcular

$$a^2 = a_x^2+a_y^2+a_z^2$$

y comparar esto con un umbral predefinido.

```Cpp title="Calculando aceleración total al cuadrado"
float totalSquared = ax*ax+ay*ay+az*az;
```

Ahora que tenemos un valor, comencemos a controlar el LED. Podríamos tener el LED encendido siempre que la aceleración total esté por debajo de un umbral, sin embargo, sería más fácil leerlo si el LED permaneciera encendido por un tiempo después de la detección. Una forma de hacer esto es crear otra variable, llamémosla LEDOnTill, donde simplemente escribimos el tiempo hasta donde queremos mantener el LED encendido.

```Cpp title="Variable de temporizador"
unsigned long LEDOnTill = 0;
```

Ahora podemos actualizar el temporizador si detectamos un evento de caída libre. Usemos un umbral de 0.1 por ahora. Arduino proporciona una función llamada `millis()`, que devuelve el tiempo desde que el programa comenzó en milisegundos.

```Cpp title="Actualizando el temporizador"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Finalmente, podemos simplemente verificar si el tiempo actual es mayor o menor que el especificado en `LEDOnTill`, y controlar el LED en base a eso. Aquí está cómo se ve la nueva función de bucle:

```Cpp title="Función de bucle para detectar caída libre"
unsigned long LEDOnTill = 0;

void loop() {
  // Leer Aceleración
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcular aceleración total (al cuadrado)
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

Probando este programa, puedes ver qué tan rápido reacciona ahora ya que no tenemos un retraso en el bucle. El LED se enciende inmediatamente después de dejar la mano al ser lanzado.

:::tip[Ejercicios]

1. Intenta reintroducir el retraso en la función de bucle. ¿Qué sucede?
2. Actualmente no tenemos ninguna impresión en el bucle. Si solo agregas una declaración de impresión al bucle, la salida será realmente difícil de leer y la impresión ralentizará significativamente el tiempo del ciclo del bucle. ¿Puedes idear una forma de imprimir solo una vez por segundo, incluso si el bucle está corriendo continuamente? Consejo: mira cómo se implementó el temporizador del LED.
3. Crea tu propio experimento, usando ya sea la aceleración o el giro para detectar algún tipo de evento.

:::

---

En la próxima lección, dejaremos el dominio digital e intentaremos usar un estilo diferente de sensor: un medidor de luz analógico.

[¡Haz clic aquí para la próxima lección!](./lesson4)