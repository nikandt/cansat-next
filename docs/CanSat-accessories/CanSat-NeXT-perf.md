---
sidebar_position: 3
---

import perfboard_render from './img/perf_render.png';


# CanSat NeXT Perf Board

CanSat NeXT Perf Board is an accessory intended to make integration of external devices to CanSat easier, and to make your own electronics mechanically more secure and better organized. It is essentially a perf board, which shares the shape of the CanSat NeXT board, and also provides easy connectivity to the extension pin header.

![CanSat NeXT Perf Board](./img/perfboard.png)

The main feature of the perf board are plated holes, spaced 0.1 inches (2.54 mm) apart, which is the standard **pitch** used in electronics, especially in hobby electronics. This makes integration of most commercial breakouts and many commercial ICs extremely easy, as they can be directly soldered to the contacts on the perf board.

On the top side, the holes have a small plated annular to aid in connectivity, but on the bottom side there are large plated rectangels, that make it much easier to create solder bridges between the squares, aiding in creating the electrical connectivity between the devices on your board, and between the added devices and CanSat NeXT.

Furthermore, some of the plated holes closest to the header are already connected to the extension pin headers. This helps you avoid needing to add cables between the pin header and the main area of the perf board, aiding also in stacking multiple perf boards on top of each other, especially when using [stacking pin headers](https://spacelabnextdoor.com/electronics/32-cansat-next-stacking-header). To check which extension pin does what, refer to the [Pinout](../CanSat-hardware/pin_out.md)

<img src={perfboard_render} alt="Render of the perf board" style={{width: 400}} />
