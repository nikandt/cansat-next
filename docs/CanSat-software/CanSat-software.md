---
sidebar_position: 3
---

# CanSat NeXT Software

The recommended way to use CanSat NeXT is with the CanSat NeXT Arduino library, available from the Arduino library manager and Github. Prior to installing the CanSat NeXT library, you have to install Arduino IDE and ESP32 board support.

## Getting started

### Install Arduino IDE

If you haven’t already, download and install the Arduino IDE from the official website https://www.arduino.cc/en/software.

### Add ESP32 support

CanSat NeXT is based on the ESP32 microcontroller, which is not included in the Arduino IDE default installation. If you haven’t used ESP32 microcontrollers with Arduino before, the support for the board needs to be installed first. It can be done in Arduino IDE from *Tools->board->Board Manager* (or just press (Ctrl+Shift+B) anywhere). In the board manager, search for ESP32, and install the esp32 by Espressif.

### Install Cansat NeXT library

The CanSat NeXT library can be downloaded from the Arduino IDE's Library Manager from *Sketch > Include Libraries > Manage Libraries*.

![Adding new Libraries with Arduino IDE.](./img/LibraryManager_1.png)

*Image source: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

In the Library Manager search bar, type "CanSatNeXT" and choose "Install". If the IDE asks if you want to also install the dependencies, click yes.

## Manual installation

The library is also hosted on its own [GitHub repository](https://github.com/netnspace/CanSatNeXT_library) and can be cloned or downloaded and installed from source.

In this case, you need to extract the library and move it in to the directory where Arduino IDE can find it. You can find the exact location in *File > Preferences > Sketchbook*.

![Adding new Libraries with Arduino IDE.](./img/LibraryManager_2.png)

*Image source: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Connecting to PC

After installing the CanSat NeXT software library, you can plug in the CanSat NeXT to your computer. In case it is not detected, you may need to install the necessary drivers first. The driver installation is done automatically in most cases, however, on some PCs it needs to be done manually.  Drivers can be found on the Silicon Labs website: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
For additional help with setting up the ESP32, refer to the following tutorial: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# You are ready to go!

You can now find CanSatNeXT examples from the Arduino IDE from *File->Examples->CanSatNeXT*.