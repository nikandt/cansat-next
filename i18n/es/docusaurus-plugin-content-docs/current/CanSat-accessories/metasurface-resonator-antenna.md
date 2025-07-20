---
sidebar_position: 2
---

# Antena Resonadora de Metasuperficie

La Antena Resonadora de Metasuperficie de CanSat NeXT es un módulo de antena externa, que puede ser utilizado en la estación terrestre para aumentar el rango de comunicación y también hacer la comunicación más confiable.

![Antena Resonadora de Metasuperficie de CanSat NeXT](./img/resonator_antenna.png)

La [antena del kit](./../CanSat-hardware/communication#quarter-wave-antenna) de CanSat NeXT ha sido utilizada exitosamente para operar misiones CanSat donde el CanSat fue lanzado a una altitud de 1 kilómetro. Sin embargo, a estas distancias la antena monopolo comienza a estar al límite del rango operativo y también podría perder la señal a veces debido a errores de polarización que surgen de la polarización lineal de la antena monopolo. El kit de antena resonadora de metasuperficie está diseñado para permitir una operación más confiable en este tipo de condiciones extremas, y también permitir la operación con rangos significativamente más largos.

La antena resonadora de metasuperficie consta de dos placas. La antena principal está en la placa del radiador, donde una antena tipo ranura ha sido grabada en el PCB. Esta placa por sí sola proporciona aproximadamente 3 dBi de ganancia, y presenta [polarización circular](https://en.wikipedia.org/wiki/Circular_polarization), lo que en la práctica significa que la intensidad de la señal ya no depende de la orientación de la antena del satélite. Por lo tanto, esta placa puede ser utilizada como una antena en sí misma, si se desea un *ancho de haz* más amplio.

La otra placa, de donde la antena obtiene su nombre, es la característica especial de este kit de antena. Debe colocarse a 10-15 mm de la primera placa, y presenta una matriz de elementos resonadores. Los elementos son energizados por la antena de ranura debajo de ellos, y esto a su vez hace que la antena sea más *directiva*. Con esta adición, la ganancia se duplica a 6 dBi.

La imagen a continuación muestra el *coeficiente de reflexión* de la antena medido con un analizador de redes vectoriales (VNA). El gráfico muestra las frecuencias en las que la antena es capaz de transmitir energía. Aunque la antena tiene un rendimiento de banda ancha bastante bueno, el gráfico muestra una buena coincidencia de impedancia en el rango de frecuencia operativo de 2400-2490 MHz. Esto significa que a estas frecuencias, la mayor parte de la potencia se transmite como ondas de radio en lugar de ser reflejada de nuevo. Los valores de reflexión más bajos en el centro de la banda están alrededor de -18.2 dB, lo que significa que solo el 1.51 % de la potencia fue reflejada de nuevo desde la antena. Aunque es más difícil de medir, las simulaciones sugieren que un 3 % adicional de la potencia de transmisión se convierte en calor en la propia antena, pero el otro 95.5 % - la eficiencia de radiación de la antena - se irradia como radiación electromagnética.

![Antena Resonadora de Metasuperficie de CanSat NeXT](./img/antenna_s11.png)

Como se mencionó antes, la ganancia de la antena es alrededor de 6 dBi. Esto puede aumentarse aún más con el uso de un *reflector* detrás de la antena, que refleja las ondas de radio de nuevo hacia la antena, mejorando la directividad. Aunque un disco parabólico sería un reflector ideal, incluso solo un plano de metal plano puede ser muy útil para aumentar el rendimiento de la antena. Según simulaciones y pruebas de campo, un plano de metal - como una hoja de acero - colocado a 50-60 mm detrás de la antena aumenta la ganancia a aproximadamente 10 dBi. El plano de metal debe tener al menos 200 x 200 mm de tamaño - los planos más grandes deberían ser mejores, pero solo marginalmente. Sin embargo, no debería ser mucho más pequeño que esto. El plano idealmente sería de metal sólido, como una hoja de acero, pero incluso una malla de alambre funcionará, siempre que los agujeros sean menores de 1/10 de longitud de onda (~1.2 cm) de tamaño.