---
sidebar_position: 6
---

# Mechanical Design

## PCB Dimensions

![CanSat NeXT board dimensions](./img/PCB_dimensions.png)

The CanSat NeXT main board is built on a 70 x 50 x 1.6 mm PCB, with electronics on the top side and battery on the bottom side. The PCB has mounting points on each corner, 4 mm from the sides. The mounting points have a diameter of 3.2 mm with a grounded pad area of 6.4 mm, and they are intended for M3 screws or standoffs. The pad area is also large enough to fit a M3 nut. Additionally, the board has two trapezoidal 8 x 1.5 mm cutouts on the sides and a component-free area on the top side in the center, so that a zip tie or other extra support can be added for the batteries for flight operations. Similarly, two 8 x 1.3 mm slots can be found next to the MCU antenna connector so that the antenna can be secured to the board with a small zip tie or piece of string. The USB connector is slightly intruded to the board to prevent any extrusions. A small cutout is added to accommodate certain USB cables despite the intrusion. The extension headers are standard 0.1 inch (2.54 mm) female headers, and they are placed so that the center of the mounting hole is 2 mm from the long edge of the board. The header closest to the short edge is 10 mm away from it. The thickness of the PCB is 1.6 mm, and the height of the batteries from the board is roughly 13.5 mm. The headers are roughly 7.2 mm tall. This makes the height of the enclosing volume roughly 22.3 mm. Furthermore, if standoffs are used to stack compatible boards together, the standoffs, spacers or other mechanical mounting system should separate the boards at least 7.5 mm. When using standard pin headers, the recommended board separation is 12 mm.

Below, you can download a .step file of the perf-board, which can be used to add the PCB into a CAD-design for reference, or even as a starting point for a modified board.

[Download step-file](./../../static/assets/3d-files/cansat.step)


## Designing a Custom PCB

If you want to take your electronics design to the next level, you should consider making a custom PCB for the electronics. KiCAD is a great, free software that can be used to design PCBs, and getting them manufactured is surprisingly affordable.

Here are resources on getting started with KiCAD: https://docs.kicad.org/#_getting_started

Here is a KiCAD template for starting your own CanSat compatible circuit board: [Download KiCAD template](./../../static/assets/kicad/Breakout-template.zip)
