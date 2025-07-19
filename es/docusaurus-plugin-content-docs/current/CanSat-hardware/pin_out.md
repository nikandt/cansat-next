---
sidebar_position: 4
---

# Pinouts

Este artículo muestra los nombres de los pines utilizados por el procesador en CanSat NeXT, así como los pines que puedes usar para extender tu proyecto.

# Pinout

La imagen a continuación muestra los pines para usar el encabezado de extensión para agregar electrónica externa a la placa.

![CanSat NeXT board pinout](./img/pinout.png)

Aquí está la lista completa de pines utilizados por la placa CanSat NeXT. El uso interno se refiere al pin que se utiliza para los recursos a bordo, y la extensión se refiere a los pines que han sido enrutados a la interfaz de extensión. Algunos pines, aquellos para I2C y SPI, se utilizan tanto interna como externamente. El nombre de la biblioteca se refiere a un nombre de macro, que se puede usar en lugar del número de pin cuando se ha incluido la biblioteca CanSatNeXT.

| Número de Pin | Nombre de Biblioteca | Nota                                                    | Interno/Externo     |
|---------------|-----------------------|---------------------------------------------------------|---------------------|
|             0 | BOOT                  |                                                         | Usado internamente  |
|             1 | USB_UART_TX           | Usado para USB                                          | Usado internamente  |
|             3 | USB_UART_RX           | Usado para USB                                          | Usado internamente  |
|             4 | SD_CS                 | Selección de chip de tarjeta SD                         | Usado internamente  |
|             5 | LED                   | Se puede usar para parpadear el LED a bordo             | Usado internamente  |
|            12 | GPIO12                |                                                         | Interfaz de extensión |
|            13 | MEAS_EN               | Conducir alto para habilitar LDR y termistor            | Usado internamente  |
|            14 | GPIO14                | Se puede usar para leer si la tarjeta SD está en su lugar | Usado internamente  |
|            15 | GPIO15                |                                                         | Interfaz de extensión |
|            16 | GPIO16                | UART2 RX                                                | Interfaz de extensión |
|            17 | GPIO17                | UART2 TX                                                | Interfaz de extensión |
|            18 | SPI_CLK               | Usado por la tarjeta SD, también disponible externamente | Ambos               |
|            19 | SPI_MISO              | Usado por la tarjeta SD, también disponible externamente | Ambos               |
|            21 | I2C_SDA               | Usado por los sensores a bordo, también disponible externamente | Ambos               |
|            22 | I2C_SCL               | Usado por los sensores a bordo, también disponible externamente | Ambos               |
|            23 | SPI_MOSI              | Usado por la tarjeta SD, también disponible externamente | Ambos               |
|            25 | GPIO25                |                                                         | Interfaz de extensión |
|            26 | GPIO26                |                                                         | Interfaz de extensión |
|            27 | GPIO27                |                                                         | Interfaz de extensión |
|            32 | GPIO32                | ADC                                                     | Interfaz de extensión |
|            33 | GPIO33                | ADC                                                     | Interfaz de extensión |
|            34 | LDR                   | ADC para el LDR a bordo                                 | Usado internamente  |
|            35 | NTC                   | ADC para el termistor                                   | Usado internamente  |
|            36 | VDD                   | ADC usado para monitorear el voltaje de suministro      | Usado internamente  |
|            39 | BATT                  | ADC usado para monitorear el voltaje de la batería      | Usado internamente  |