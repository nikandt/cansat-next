---
sidebar_position: 4
---

# Lección 4: La resistencia no es inútil

Hasta ahora nos hemos centrado en usar dispositivos sensores digitales para obtener valores directamente en unidades del SI. Sin embargo, los dispositivos eléctricos realizan la medición generalmente de manera indirecta, y la conversión a las unidades deseadas se hace después. Esto se hacía anteriormente por los propios dispositivos sensores (y por la biblioteca CanSat NeXT), pero muchos sensores que usamos son mucho más simples. Un tipo de sensores analógicos son los sensores resistivos, donde la resistencia de un elemento sensor cambia dependiendo de algún fenómeno. Existen sensores resistivos para una multitud de cantidades, incluyendo fuerza, temperatura, intensidad de luz, concentraciones químicas, pH, y muchos otros.

En esta lección, utilizaremos la resistencia dependiente de la luz (LDR) en la placa CanSat NeXT para medir la intensidad de luz circundante. Mientras que el termistor se usa de una manera muy similar, eso será el enfoque de una lección futura. Las mismas habilidades se aplican directamente al uso del LDR y el termistor, así como a muchos otros sensores resistivos.

![Ubicación del LDR en la placa](./../CanSat-hardware/img/LDR.png)

## Física de los Sensores Resistivos

En lugar de saltar directamente al software, demos un paso atrás y discutamos cómo funciona generalmente la lectura de un sensor resistivo. Considera el esquema a continuación. El voltaje en LDR_EN es de 3.3 voltios (voltaje de operación del procesador), y tenemos dos resistencias conectadas en serie en su camino. Una de estas es el **LDR** (R402), mientras que la otra es una **resistencia de referencia** (R402). La resistencia de la resistencia de referencia es de 10 kilo-ohmios, mientras que la resistencia del LDR varía entre 5-300 kilo-ohmios dependiendo de las condiciones de luz.

![Esquema del LDR](./img/LDR.png)

Dado que las resistencias están conectadas en serie, la resistencia total es 

$$
R = R_{401} + R_{LDR},
$$

y la corriente a través de las resistencias es 

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

donde $V_{OP}$ es el voltaje operativo del MCU. Recuerda que la corriente tiene que ser la misma a través de ambas resistencias. Por lo tanto, podemos calcular la caída de voltaje sobre el LDR como 

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

Y esta caída de voltaje es el voltaje del LDR que podemos medir con un convertidor analógico a digital. Usualmente este voltaje puede correlacionarse o calibrarse directamente para corresponder a valores medidos, como por ejemplo de voltaje a temperatura o brillo. Sin embargo, a veces es deseable calcular primero la resistencia medida. Si es necesario, se puede calcular como:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Leyendo el LDR en la Práctica

Leer el LDR u otros sensores resistivos es muy fácil, ya que solo necesitamos consultar el convertidor analógico a digital para el voltaje. Comencemos esta vez un nuevo Sketch de Arduino desde cero. Archivo -> Nuevo Sketch.

Primero, comencemos el sketch como antes, incluyendo la biblioteca. Esto se hace al principio del sketch. En la configuración, inicia el serial e inicializa CanSat, tal como antes.

```Cpp title="Configuración Básica"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Un bucle básico para leer el LDR no es mucho más complicado. Las resistencias R401 y R402 ya están en la placa, y solo necesitamos leer el voltaje desde su nodo común. Leamos el valor del ADC e imprimámoslo.

```Cpp title="Bucle básico del LDR"
void loop() {
    int value = analogRead(LDR);
    Serial.print("Valor del LDR:");
    Serial.println(value);
    delay(200);
}
```

Con este programa, los valores reaccionan claramente a las condiciones de iluminación. Obtenemos valores más bajos cuando el LDR está expuesto a la luz, y valores más altos cuando está más oscuro. Sin embargo, los valores están en cientos y miles, no en un rango de voltaje esperado. Esto se debe a que ahora estamos leyendo la salida directa del ADC. Cada bit representa una comparación de voltaje siendo uno o cero dependiendo del voltaje. Los valores ahora son de 0-4095 (2^12-1) dependiendo del voltaje de entrada. Nuevamente, esta medición directa es probablemente lo que deseas usar si estás haciendo algo como [detectar pulsos con el LDR](./../../blog/first-project#pulse-detection), pero a menudo los voltios regulares son agradables para trabajar. Aunque calcular el voltaje tú mismo es un buen ejercicio, la biblioteca incluye una función de conversión que también considera la no linealidad del ADC, lo que significa que la salida es más precisa que una simple conversión lineal.

```Cpp title="Leyendo el voltaje del LDR"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("Valor del LDR:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Este código es compatible con el trazador serial en Arduino Code. ¡Pruébalo!

:::

:::tip[Ejercicio]

Podría ser útil detectar que el CanSat ha sido desplegado desde el cohete, para que, por ejemplo, el paracaídas pueda desplegarse en el momento adecuado. ¿Puedes escribir un programa que detecte un despliegue simulado? Simula el lanzamiento cubriendo primero el LDR (integración del cohete) y luego descubriéndolo (despliegue). El programa podría mostrar el despliegue en el terminal, o parpadear un LED para mostrar que el despliegue ocurrió.

:::

---

La próxima lección trata sobre el uso de la tarjeta SD para almacenar mediciones, configuraciones y más.

[¡Haz clic aquí para la próxima lección!](./lesson5)