---
sidebar_position: 1
---

# Library specification

# Functions

You can use all regular Arduino functionalities with CanSat NeXT, as well as any Arduino libraries. Arduino functions can be found here: https://www.arduino.cc/reference/en/.

CanSat NeXT library adds several easy to use functions for using the different on-board resources, such as sensors, radio and the SD-card. The library comes with a set of example sketches that show how to use these functionalities. The list below also shows all available functions.

## System Initialization Functions

### CanSatInit

| Function             | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if initialization was successful, or non-zero if there was an error. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-byte MAC address shared by the satellite and the ground station. This is an optional parameter - when it is not provided, the radio is not initialized. Used in example sketch: All |
| **Description**      | This command is found in the `setup()` of almost all CanSat NeXT scripts. It is used to initialize the CanSatNeXT hardware, including the sensors and the SD-card. Additionally, if the `macAddress` is provided, it starts the radio and starts to listen for incoming messages. The MAC address should be shared by the ground station and the satellite. The MAC address can be chosen freely, but there are some non-valid addresses such as all bytes being `0x00`, `0x01`, and `0xFF`. If the init function is called with a non-valid address, it will report the problem to the Serial. |

### CanSatInit (simplified MAC-address specification)

| Function             | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if initialization was successful, or non-zero if there was an error. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Last byte of the MAC-address, used to differentiate between different CanSat-GS pairs. |
| **Description**      | This is a simplified version of the CanSatInit with MAC address, which sets the other bytes automatically to a known safe value. This enables the users to differentiate their Transmitter-Receiver pairs with just one value, which can be 0-255.|

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

### GroundStationInit (simplified MAC-address specification)

| Function             | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if initialization was successful, or non-zero if there was an error. |
| **Parameters**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Last byte of the MAC-address, used to differentiate between different CanSat-GS pairs. |
| **Description**      | This is a simplified version of the GroundStationInit with MAC address, which sets the other bytes automatically to a known safe value. This enables the users to differentiate their Transmitter-Receiver pairs with just one value, which can be 0-255.|

## IMU Functions

### readAcceleration

| Function             | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if measurement was successful.                           |
| **Parameters**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Address of a float variable where the x-axis data will be stored. |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read acceleration from the on-board IMU. The parameters are addresses to float variables for each axis. The example IMU shows how to use this function to read the acceleration. The acceleration is returned in units of G (9.81 m/s). |

### readAccelX

| Function             | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                          |
| **Return Value**     | Returns linear acceleration on X-axis in units of G.                           |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read acceleration from the on-board IMU on a specific axis. The example IMU shows how to use this function to read the acceleration. The acceleration is returned in units of G (9.81 m/s). |

### readAccelY

| Function             | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                          |
| **Return Value**     | Returns linear acceleration on Y-axis in units of G.                           |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read acceleration from the on-board IMU on a specific axis. The example IMU shows how to use this function to read the acceleration. The acceleration is returned in units of G (9.81 m/s). |

### readAccelZ

| Function             | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                          |
| **Return Value**     | Returns linear acceleration on Z-axis in units of G.                           |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read acceleration from the on-board IMU on a specific axis. The example IMU shows how to use this function to read the acceleration. The acceleration is returned in units of G (9.81 m/s). |

### readGyro

| Function             | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if measurement was successful.                           |
| **Parameters**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Address of a float variable where the x-axis data will be stored. |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read angular velocity from the on-board IMU. The parameters are addresses to float variables for each axis. The example IMU shows how to use this function to read the angular velocity. The angular velocity is returned in units mrad/s. |

### readGyroX

| Function             | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                          |
| **Return Value**     | Returns angular velocity on X-axis in units of mrad/s.                           |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read angular velocity from the on-board IMU on a specific axis. The parameters are addresses to float variables for each axis. The angular velocity is returned in units mrad/s. |

### readGyroY

| Function             | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                          |
| **Return Value**     | Returns angular velocity on Y-axis in units of mrad/s.                           |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read angular velocity from the on-board IMU on a specific axis. The parameters are addresses to float variables for each axis. The angular velocity is returned in units mrad/s. |

### readGyroZ

| Function             | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                          |
| **Return Value**     | Returns angular velocity on Z-axis in units of mrad/s.                           |
| **Used in example sketch** | IMU                                                  |
| **Description**      | This function can be used to read angular velocity from the on-board IMU on a specific axis. The parameters are addresses to float variables for each axis. The angular velocity is returned in units mrad/s. |

## Barometer Functions

### readPressure

| Function             | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                            |
| **Return Value**     | Pressure in mbar                                                   |
| **Parameters**       | None                                                               |
| **Used in example sketch** | Baro                                                        |
| **Description**      | This function returns pressure as reported by the on-board barometer. The pressure is in units of millibar. |

### readTemperature

| Function             | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                            |
| **Return Value**     | Temperature in Celsius                                            |
| **Parameters**       | None                                                               |
| **Used in example sketch** | Baro                                                        |
| **Description**      | This function returns temperature as reported by the on-board barometer. The unit of the reading is Celsius. Note that this is the internal temperature measured by the barometer, so it might not reflect the external temperature. |

## SD Card / File System Functions

### SDCardPresent

| Function             | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `bool`                                                             |
| **Return Value**     | Returns true if it detects an SD-card, false if not.               |
| **Parameters**       | None                                                               |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function can be used to check if the SD-card is mechanically present. The SD-card connector has a mechanical switch, which is read when this function is called. Returns true or false depending on whether the SD-card is detected. |

### appendFile

| Function             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if write was successful.                                |
| **Parameters**       |                                                                    |
|                      | `String filename`: Address of the file to be appended. If the file doesn’t exist, it is created. |
|                      | `T data`: Data to be appended at the end of the file.         |
| **Used in example sketch** | SD_write                                               |
| **Description**      | This is the basic write function used to store readings to the SD-card. |

### printFileSystem

| Function             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       | None                                                               |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This is a small helper function to print names of files and folders present on the SD-card. Can be used in development. |

### newDir

| Function             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Path of the new directory. If it already exists, nothing is done. |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Used to create new directories on the SD-card.                     |

### deleteDir

| Function             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Path of the directory to be deleted.                |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Used to delete directories on the SD-card.                          |

### fileExists

| Function             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `bool`                                                             |
| **Return Value**     | Returns true if the file exists.                                   |
| **Parameters**       |                                                                    |
|                      | `String path`: Path to the file.                                   |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function can be used to check if a file exists on the SD-card.|

### fileSize

| Function             | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint32_t`                                                         |
| **Return Value**     | Size of the file in bytes.                                         |
| **Parameters**       |                                                                    |
|                      | `String path`: Path to the file.                                   |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function can be used to read the size of a file on the SD-card.|

### writeFile

| Function             | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Returns 0 if write was successful.                                 |
| **Parameters**       |                                                                    |
|                      | `String filename`: Address of the file to be written.              |
|                      | `T data`: Data to be written to the file.                     |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function is similar to the `appendFile()`, but it overwrites existing data on the SD-card. For data storage, `appendFile` should be used instead. This function can be useful for storing settings, for example.|

### readFile

| Function             | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `String`                                                           |
| **Return Value**     | All content in the file.                                           |
| **Parameters**       |                                                                    |
|                      | `String path`: Path to the file.                                   |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function can be used to read all data from a file into a variable. Attempting to read large files can cause problems, but it is fine for small files, such as configuration or setting files.|

### renameFile

| Function             | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String oldpath`: Original path to the file.                      |
|                      | `String newpath`: New path of the file.                           |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function can be used to rename or move files on the SD-card.  |

### deleteFile

| Function             | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Path of the file to be deleted.                    |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | This function can be used to delete files from the SD-card.        |

## Radio Functions

### onDataReceived

| Function             | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String data`: Received data as an Arduino String.                |
| **Used in example sketch** | Groundstation_receive                                      |
| **Description**      | This is a callback function that is called when data is received. The user code should define this function, and the CanSat NeXT will call it automatically when data is received. |

### onBinaryDataReceived

| Function             | void onBinaryDataReceived(const uint8_t *data, int len)           |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `const uint8_t *data`: Received data as a uint8_t array.          |
|                      | `int len`: Length of received data in bytes.                      |
| **Used in example sketch** | None                                                 |
| **Description**      | This is similar to the `onDataReceived` function, but the data is provided as binary instead of a String object. This is provided for advanced users who find the String object limiting. |

### onDataSent

| Function             | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `const bool success`: Boolean indicating if data was sent successfully. |
| **Used in example sketch** | None                                                 |
| **Description**      | This is another callback function that can be added to the user code if required. It can be used to check if the reception was acknowledged by another radio. |


### getRSSI

| Function             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `int8_t`                                                          |
| **Return Value**     | RSSI of the last received message. Returns 1 if no messages have been received since boot.                           |
| **Used in example sketch** | None                                                  |
| **Description**      | This function can be used to monitor the signal strength of the reception. It can be used to test antennas or the gauge the radio range. The value is expressed in [dBm](https://en.wikipedia.org/wiki/DBm), however the scale is not accurate.  |

### sendData (String variant)

| Function             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | 0 if data was sent (does not indicate acknowledgment).            |
| **Parameters**       |                                                                    |
|                      | `T data`: Data to be sent. Any type of data can be used, but is converted to a string internally.                  |
| **Used in example sketch** | Send_data                                             |
| **Description**      | This is the main function for sending data between the ground station and the satellite. Note that the return value does not indicate if data was actually received, just that it was sent. The callback `onDataSent` can be used to check if the data was received by the other end. |

### sendData (Binary variant)

| Function             | uint8_t sendData(char *data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | 0 if data was sent (does not indicate acknowledgment).            |
| **Parameters**       |                                                                    |
|                      | `char *data`: Data to be sent as a char array.                    |
|                      | `uint16_t len`: Length of the data in bytes.                      |
| **Used in example sketch** | None                                                 |
| **Description**      | A binary variant of the `sendData` function, provided for advanced users who feel limited by the String object. |

## ADC Functions

### adcToVoltage

| Function             | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                            |
| **Return Value**     | Converted voltage as volts.                                       |
| **Parameters**       |                                                                    |
|                      | `int value`: ADC reading to be converted to voltage.              |
| **Used in example sketch** | AccurateAnalogRead                                    |
| **Description**      | This function converts an ADC reading to voltage using a calibrated third-order polynomial for more linear conversion. Note that this function calculates the voltage at the input pin, so to calculate the battery voltage, you need to also consider the resistor network. |

### analogReadVoltage

| Function             | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `float`                                                            |
| **Return Value**     | ADC voltage as volts.                                             |
| **Parameters**       |                                                                    |
|                      | `int pin`: Pin to be read.                                        |
| **Used in example sketch** | AccurateAnalogRead                                    |
| **Description**      | This function reads voltage directly instead of using `analogRead` and converts the reading to voltage internally using `adcToVoltage`. |