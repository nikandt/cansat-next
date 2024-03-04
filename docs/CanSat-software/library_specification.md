---
sidebar_position: 1
---

# Library specification

## Functions

You can use all regular Arduino functionalities with CanSat NeXT, as well as any Arduino libraries. Arduino functions can be found here: https://www.arduino.cc/reference/en/.

CanSat NeXT library adds several easy to use functions for using the different on-board resources, such as sensors, radio and the SD-card. The library comes with a set of example sketches that show how to use these functionalities. The list below also shows all available functions.

### CanSatInit

| Function             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if initialization was successful, or non-zero if there was an error. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC address shared by the satellite and the ground station. This is an optional parameter - when it is not provided, the radio is not initialized. Used in example sketch: All |
| **Description**      | This command is found in the `setup()` of almost all CanSat NeXT scripts. It is used to initialize the CanSatNeXT hardware, including the sensors and the SD-card. Additionally, if the `macAddress` is provided, it starts the radio and starts to listen for incoming messages. The MAC address should be shared by the ground station and the satellite. The MAC address can be chosen freely, but there are some non-valid addresses such as all bytes being `0x00`, `0x01`, and `0xFF`. If the init function is called with a non-valid address, it will report the problem to the Serial. |

### GroundStationInit

| Function             | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if initialization was successful, or non-zero if there was an error. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC address shared by the satellite and the ground station. |
| **Used in example sketch** | Groundstation receive                                          |
| **Description**      | This is a close relative of the CanSatInit function, but it always requires the MAC address. This function only initializes the radio, not other systems. The ground station can be any ESP32 board, including any devboard or even another CanSat NeXT board. |
