---
sidebar_position: 6
---

# Diseño Mecánico

## Dimensiones del PCB

![Dimensiones de la placa CanSat NeXT](./img/PCB_dimensions.png)

La placa principal del CanSat NeXT está construida sobre un PCB de 70 x 50 x 1.6 mm, con la electrónica en el lado superior y la batería en el lado inferior. El PCB tiene puntos de montaje en cada esquina, a 4 mm de los lados. Los puntos de montaje tienen un diámetro de 3.2 mm con un área de pad conectada a tierra de 6.4 mm, y están destinados para tornillos o separadores M3. El área del pad también es lo suficientemente grande como para acomodar una tuerca M3. Además, la placa tiene dos recortes trapezoidales de 8 x 1.5 mm en los lados y un área libre de componentes en el lado superior en el centro, para que se pueda agregar una brida o soporte adicional para las baterías durante las operaciones de vuelo. De manera similar, se pueden encontrar dos ranuras de 8 x 1.3 mm junto al conector de la antena del MCU para que la antena pueda asegurarse a la placa con una pequeña brida o un trozo de cuerda. El conector USB está ligeramente intruido en la placa para evitar cualquier extrusión. Se añade un pequeño recorte para acomodar ciertos cables USB a pesar de la intrusión. Los encabezados de extensión son encabezados hembra estándar de 0.1 pulgadas (2.54 mm), y están colocados de manera que el centro del agujero de montaje esté a 2 mm del borde largo de la placa. El encabezado más cercano al borde corto está a 10 mm de él. El grosor del PCB es de 1.6 mm, y la altura de las baterías desde la placa es aproximadamente de 13.5 mm. Los encabezados tienen aproximadamente 7.2 mm de altura. Esto hace que la altura del volumen de cierre sea aproximadamente de 22.3 mm. Además, si se utilizan separadores para apilar placas compatibles juntas, los separadores, espaciadores u otro sistema de montaje mecánico deben separar las placas al menos 7.5 mm. Al usar encabezados de pines estándar, la separación recomendada entre placas es de 12 mm.

A continuación, puedes descargar un archivo .step de la placa perforada, que puede usarse para agregar el PCB en un diseño CAD como referencia, o incluso como punto de partida para una placa modificada.

[Descargar archivo step](/assets/3d-files/cansat.step)


## Diseñando un PCB Personalizado

Si deseas llevar tu diseño electrónico al siguiente nivel, deberías considerar hacer un PCB personalizado para la electrónica. KiCAD es un excelente software gratuito que se puede usar para diseñar PCBs, y su fabricación es sorprendentemente asequible.

Aquí hay recursos para comenzar con KiCAD: https://docs.kicad.org/#_getting_started

Aquí tienes una plantilla de KiCAD para comenzar tu propia placa de circuito compatible con CanSat: [Descargar plantilla KiCAD](/assets/kicad/Breakout-template.zip)