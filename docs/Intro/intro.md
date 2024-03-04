---
sidebar_position: 2
---

# Getting Started with CanSat NeXT

# CanSatNeXT library

CanSat NeXT is an ESP32 development board developed for CanSat competitions in collaboration with ESERO Finland. This library provides easy access to the hardware resources of the development board. The hardware resources include a barometer, an inertial measurement unit, an SD card and a point-to-point communication radio. The library supports both the satellite and the receiver. The receiver can be similar to the CanSat NeXT board but also any other ESP32 development board.

# Getting started

This is an Arduino library, designed to be primarily used through the Arduino IDE. Here are the basic steps to get started with the library:

1. Install the Arduino IDE: Download and install the Arduino IDE from the official website if you haven't already.

2. Install ESP32 Support: 
   - Open the Arduino IDE.
   - Navigate to Tools -> Board -> Boards Manager.
   - In the search bar, type "ESP32" and find the option provided by Espressif.
   - Click on the "Install" button to add ESP32 support to your Arduino IDE.

3. Install the CanSatNeXT Library:
   - In the Arduino IDE, go to Sketch -> Include Library -> Manage Libraries.
   - In the search bar, type "CanSatNeXT" and find the corresponding library.
   - Click on the "Install" button to install the library. If the Arduino IDE asks if you want to install with dependencies - click yes.
   - Alternatively, you can manually add the library by downloading this repository and saving it into the Arduino libraries folder on your computer.

4. Connect the CanSatNeXT Board:
   - Select the board type in the Arduino IDE from Tools -> Board -> esp32 and select ESP32 Dev Module
   - Plug the CanSatNeXT board into your PC using a USB cable.
   - Your PC should automatically detect the board, but if it doesn't, you may need to install the necessary drivers.
   - Drivers can be found on the Silicon Labs website: [https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)
   - The driver installer can be downloaded on the Silicon Labs website from Downloads -> CP210x Windows Drivers (Mac and Linux don't need a specific driver with this chip).
   - For additional help with setting up the ESP32, refer to the following tutorial: [https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html)

6. Get Started with the CanSatNeXT Board:
   - Once you have installed the Arduino IDE, ESP32 support, and the CanSatNeXT library (and possibly the drivers), you are ready to start using the board.
   - To explore the use of the various hardware resources, go to File -> Examples -> CanSatNeXT in the Arduino IDE.


# License

This library and the CanSat NeXT board are developed by Samuli Nyman, in collaboration with ESERO Finland and Arctic Astronautics Oy. The development is also supported by the Finnish Physical Society. This software library is licensed under the MIT license.

# Contribution

If you wish to contribute to the library or if you have feedback, please contact me through samuli@kitsat.fi or start a GitHub issue. You are also welcome to create a pull request.

