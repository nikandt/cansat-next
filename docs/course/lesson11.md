---
sidebar_position: 12
---

# Lesson 11: Satellite Must Grow

While the CanSat NeXT already has many integrated sensors and devices on the satellite board itself, many exciting CanSat missions require the use of other external sensors, servos, cameras, motors, or other actuators and devices. This lesson is slightly different to the previous ones, as we'll discuss the integration of various external devices to CanSat. Your actual use case is probably not considered, but perhaps something similar is. However, if there is something you feel should be covered here, please do send feedback to me at samuli@kitsat.fi.

Before continuing this lesson, please look through the materials presented in the [hardware](./../CanSat-hardware/CanSat-hardware.md) section of CanSat NeXT documentation, as it covers a lot of information required for integrating external devices.

## Connecting the external devices

There are two great ways to connect external devices to the CanSat NeXT: Using [Perf Boards](../CanSat-accessories/CanSat-NeXT-perf.md) and custom PCBs. Making your own PCB is easier (and cheaper) than you might think, and to get started with them, a good starting point is this [KiCAD tutorial](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). We also have a [template](../CanSat-hardware/mechanical_design.md#designing-a-custom-pcb) available for KiCAD, so that making your boards to the same format is very easy.

That being said, for most CanSat missions soldering the external sensors or other devices to a perf board is a great way to create reliable, sturdy electronics stacks.

An even easier way to get started, especially when first prototyping, is to use jumper cables (Also called Dupont cables or breadboard wire). They are typically even provided with the sensor breakouts, but can also be bought separately. These share the same 0.1 inch pitch used by the extension pin header, which makes connecting devices with cables very easy. However, although cables are easy to use, they are rather bulky and unreliable. For this reason, avoiding cables for the flight model of your CanSat is warmly recommended.

## Sharing power to the devices

CanSat NeXT uses 3.3 volts for all of its own devices, which is why it is the only voltage line provided to the extension header as well. Many commercial breakouts, especially older ones, support also 5 volt operation, as that is the voltage used by legacy Arduinos. However, the vast majority of devices also support operation directly through 3.3 volts.

For the few cases where 5 volts is absolutely required, you can include a **boost converter** on the board. There are ready made modules available, but you can also directly solder a lot of devices to the perf board. That being said, do try to first use the device from 3.3 volts instead, as there is a good chance it will work.

## Data lines


---

This concludes the lessons for now. We will add more soon, but in the meanwhile you can find more information about using CanSat NeXT from the other Arduino examples, our [blog](./../../blog/) and the [software](./../CanSat-software/CanSat-software.md) and [hardware](./../CanSat-hardware/CanSat-hardware.md) documentation. I would love to hear your feedback and ideas regarding CanSat NeXT and these materials, so don't hesitate to contact me at samuli@kitsat.fi.