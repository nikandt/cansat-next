---
sidebar_position: 10
---

# Lesson 9: Ones and Zeros

So far we have been using text when storing or transmitting data. While this makes it easy to interpret, it is also inefficient. Computers use internally **binary** data, where the data is stored as sets of ones and zeros. In this lesson, we'll look at ways of using binary data with CanSat NeXT, and discuss where and why it may be useful to do so.

:::info

## Different data types

In binary form, all data—whether it's numbers, text, or sensor readings—is represented as a series of ones and zeros. Different data types use different amounts of memory and interpret the binary values in specific ways. Let's briefly review some common data types and how they are stored in binary:

- **Integer (int)**:  
  Integers represent whole numbers. In a 16-bit integer, for example, 16 ones and zeros can represent values from \(-32,768\) to \(32,767\). Negative numbers are stored using a method called **two's complement**.

- **Unsigned Integer (uint)**:  
  Unsigned integers represent non-negative numbers. A 16-bit unsigned integer can store values from \(0\) to \(65,535\), since no bits are reserved for the sign.

- **Float**:  
  Floating-point numbers represent decimal values. In a 32-bit float, part of the bits represents the sign, exponent, and mantissa, allowing computers to handle very large and very small numbers. It's essentially a binary form of the [scientific notation](https://en.wikipedia.org/wiki/Scientific_notation).

- **Characters (char)**:  
  Characters are stored using encoding schemes like **ASCII** or **UTF-8**. Each character corresponds to a specific binary value (e.g., 'A' in ASCII is stored as `01000001`).

- **Strings**:  
  Strings are simply collections of characters. Each character in a string is stored in sequence as individual binary values. For example, the string `"CanSat"` would be stored as a series of characters like `01000011 01100001 01101110 01010011 01100001 01110100` (each representing 'C', 'a', 'n', 'S', 'a', 't'). As you can see, that representing numbers as strings, as we've been doing so far, is less efficient compared to storing them as binary values.

- **Arrays and `uint8_t`**:  
  When working with binary data, it's common to use an array of `uint8_t` to store and handle raw byte data. The `uint8_t` type represents an unsigned 8-bit integer, which can hold values from 0 to 255. Since each byte consists of 8 bits, this type is well suited for holding binary data.
  Arrays of `uint8_t` are often used to create byte buffers to hold sequences of raw binary data (e.g., packets). Some people prefer `char` or other variables, but it doesn't really matter which one is used as long as the variable has length of 1 byte.
:::

## Transmitting binary data

Let's start by flashing a simple program to the CanSat, and focus more on the ground station side. Here a simple code that transmits a reading in binary format:

```Cpp title="Transmit LDR data as binary"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

The code looks otherwise very familiar, but the `sendData` now takes two arguments instead of just one - first, the **memory address** of the data to be transmitted, and then the **length** of the data to be transmitted. In this simplified case, we just use the address and length of the variable `LDR_voltage`.

If you try to receive this with the typical ground station code, it will just print gobbledygook, as it is trying to interpret the binary data as if it was a string. Instead, we'll have to specify to the ground station what the data includes.

First, let's check how long the data actually is that we are receiving.

```Cpp title="Check length of the received data"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");
}
```

Every time the satellite transmits, we receive 4 bytes on the ground station. As we are transmitting a 32 bit float, this seems right.

To read the data, we have to take the binary data buffer from the input stream, and copy the data to a suitable variable. For this simple case, we can do this:


```Cpp title="Store the data into a variable"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Data: ");
  Serial.println(LDR_reading);
}
```

First we introduce variable `LDR_reading` to hold the data we *know* we have in the buffer. Then we use `memcpy` (memory copy) to copy the binary data from the `data` buffer into the **memory address** of `LDR_reading`.  This ensures the data is transferred exactly as it was stored, maintaining the same format as on the satellite.

Now if we print the data, it's as if we read it directly on the GS side. It's not text anymore like it used to be, but the actual same data we read on the satellite side. Now we can easily process it on the GS side as we want.

## Making our own protocol

The real power of binary data transfer becomes evident when we have more data to transmit. However, we still need to ensure that the satellite and ground station agree which byte represents what. This is referred to as a **packet protocol**.

A packet protocol defines the structure of the data being transmitted, specifying how to pack multiple pieces of data into a single transmission, and how the receiver should interpret the incoming bytes. Let’s build a simple protocol that transmits multiple sensor readings in a structured way.

First, let's read all accelerometer and gyroscope channels and create the **data packet** from the readings.

```Cpp title="Transmit LDR data as binary"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Create an array to hold the data
  uint8_t packet[24];

  // Copy data into the packet
  memcpy(&packet[0], &ax, 4);  // Copy accelerometer X into bytes 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copy gyroscope Z into bytes 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Here, we first read the data just like in Lesson 3, but then we **encode** the data into a data packet. First, the actual buffer is created, which is just an empty set of 24 bytes. Each data variable can then be written to this empty buffer with `memcpy`. As we are using `float`, the data has length of 4 bytes. If you are unsure about the length of a variable, you can always check it with `sizeof(variable)`.

:::tip[Exercise]

Create a ground station software to interpret and print the accelerometer and gyroscope data.

:::

## Storing binary data on SD card

Writing data as binary to the SD card can be useful when working with very large amounts of data, as binary storage is more compact and efficient than text. This allows you to save more data with less storage space, which can be useful in memory-constrained system.

However, using binary data for storage comes with trade-offs. Unlike text files, binary files are not human-readable, meaning they can't be easily opened and understood with standard text editors or imported into programs like Excel. To read and interpret binary data, specialized software or scripts (e.q., in Python) need to be developed to parse the binary format correctly.

For most applications, where ease of access and flexibility is important (such as analyzing data on a computer later), text-based formats like CSV are recommended. These formats are easier to work with in a variety of software tools and provide more flexibility for quick data analysis.

If you are committed to using binary storage, take a deeper look "under the hood" by reviewing how the CanSat library handles data storage internally. You can directly use C-style file handling methods to manage files, streams, and other low-level operations efficiently. More information can also be found from the [Arduino SD card libary](https://docs.arduino.cc/libraries/sd/).

---

This concludes the lessons for now. We will add more soon, but in the meanwhile you can find more information about using CanSat NeXT from the other Arduino examples, our [blog](./../../blog/) and the [software](./../CanSat-software/CanSat-software.md) and [hardware](./../CanSat-hardware/CanSat-hardware.md) documentation. I would love to hear your feedback and ideas regarding CanSat NeXT and these materials, so don't hesitate to contact me at samuli@kitsat.fi.