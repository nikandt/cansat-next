---
sidebar_position: 5
---

# Lesson 5: Saving Bits & Bytes

Sometimes getting the data directly to a PC isn't feasible, like when we are throwing the device around, launching it with a rocket, or taking measurements in hard-to-reach places. In such cases, it is best to save the measured data to an SD card for further processing later. Additionally, the SD card can also be used to store settings - for example we could have some type of treshold setting or address settings stored on the SD card. 

## SD card in CanSat NeXT library

CanSat NeXT library supports a large range of SD card operations. It can be used to save and read files, but also to create directories and new files, move them around or even delete them. All of these could be useful in various circumstances, but let's keep the focus here on the two basic things - reading a file, and writing data to a file. 

:::note

If you want full control of the filesystem, you can find the commands from the [Library Specification](./../CanSat-software/library_specification.md#sdcardpresent) or from the library example "SD_advanced".

:::

As an exercise, let's modify the code from the last lesson so that instead of writing the LDR measurements to the serial, we will save them on the SD card.

First, let's define the name of the file we will use. Let's add it before the setup function as a **global variable**.

```Cpp title="Modified Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Now that we have a filepath, we can write to the SD card. We need just two lines to do it. The best command to use for saving measurement data is appendFile, which just takes the filepath, and writes the new data at the end of the file. If the file doesn't exist, it creates it. This makes using the command very easy (and safe). We can just directly add the data to it, and then follow that with a line change so that the data is easier to read. And that's it! Now we are storing the measurements.

```Cpp title="Saving LDR data to the SD card"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR value:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

By default, the appendFile command stores floating point numbers with two values after the decimal point. For more specific functionality, you could first create a string in the sketch, and use command appendFile to store that string to the SD card. So for example:

```Cpp title="Saving LDR data to the SD card"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Here the final string is made first, with the String(LDR_voltage, 6) specifying that we want 6 decimals after the point. We can use the same string for printing and storing the data. (As well as transmitting via radio)

## Reading Data

It is quite often useful to store something on the SD card for future use in the program as well. These could be for example settings about the current state of the device, so that if the program resets, we can load the current status again from the SD card instead of starting from default values. 

To demonstrate this, add on PC a new file to the SD card called "delay_time", and write a number into the file, like 200. Let's try to replace the statically set delay time in our program with a setting read from a file.

Let's try to read the setting file in the setup. First, let's introduce a new global variable. I gave it a default value of 1000, so that if we don't manage to modify the delay time, this is now the default setting. 

In the setup, we should first check if the file even exists. This can be done using command fileExists. If it doesn't let's just use the default value. After this, the data can be read using readFile. However, we should note that it is a string - not an integer like we need it to be. So, let's convert it using Arduino command "toInt()". Finally, we check if the conversion was succesful. If it wasn't, the value will be zero, in which case we will just keep using the default value.

```Cpp title="Reading a setting in the setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Finally, don't forget to change the delay in the loop to use the new variable.

```Cpp title="Dynamically set delay value"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

You can now try changing the value on the SD card, or even removing the SD card, in which case it should now use the default value for the delay length.

:::note

To rewrite the setting in your program, you can use command [writeFile](./../CanSat-software/library_specification.md#writefile). It works just like [appendFile](./../CanSat-software/library_specification.md#appendfile), but overwrites any existing data.

:::

:::tip[Exercise]

Continue from your solution to the exercise in lesson 4, so that the state is maintained even if the device is reset. I.e. store the current state on the SD-card and read it in the setup. This would simulate a scenario where your CanSat suddenly resets in flight or before the flight, and with this program you would still get a succesful flight.

:::

In the next lesson, we will look at using radio to transmit data between processors. You should have some type of antenna in your CanSat NeXT and the groundstation before starting those exercises. If you haven't already, take a look at the tutorial for building a basic antenna: [Building an antenna](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

[Click here for the next lesson!](./lesson6)