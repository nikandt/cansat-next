---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lesson 10: The Code Must Grow

As our projects become more detailed, the code can become hard to manage unless we are careful. In this lesson, we'll take a look at some practices that will help keep larger projects manageable. These include splitting code into multiple files, managing dependecies, and finally introducting version control to track changes, back up code, and assist in collaboration.

## Splitting code into multiple files

In small projects, having all of the source code in one file might seem fine, but as the project scales, things can get messy and harder to manage. A good practice is to split your code into different files based on functionality. When made well, this also produces nice little modules that you can reuse in different projects without introducing unnecessary components to other projects.

The following text assumes that you are using Arduino IDE 2. Advanced users might feel more home with systems such as [Platformio](https://platformio.org/), but those of you will be familiar with these concepts already.

In Arduino IDE 2, all files in the project folder are shown as tabs in the IDE. New files can be created in the IDE directly, or through your operating system. There are three different types of files, **headers** `.h`, **source files** `.cpp`, and **Arduino files** `.ino`.  

Of these three, Arduino files are the easiest to grasp. They are simply extra files, that are copied at the end of your main `.ino` script when compiling. As such, you can easily use them to create more understandable code structures and take the all space you need for a complicated function without making the source file difficult to read. The best approach is usually to take one functionality, and implement that it one file. So you could have for instance a separate file for each operating mode, one file for data transfers, one file for command interpretation, one file for data storage, and one main file where you combine this all into a functional script.

Headers and source files are bit more specialized, but luckily they work just the same as with C++ elsewhere, so there is a lot of material written about using them, for example [here](https://www.learncpp.com/cpp-tutorial/header-files/).

## Example structure

As an example, let's take the messy code from [Lesson 8](./lesson8.md) and refactor it.

<details>
  <summary>Original messy code from Lesson 8</summary>
  <p>Here is the whole code for your frustration.</p>
```Cpp title="Satellite with multiple states"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // unknown mode
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

This isn't even that bad, but you can see how it could get seriously difficult to read if we fleshed out the functionalities or added new commands to interpret. Instead, let's divide this into neat separate code files based on the separate functionalities.

I separated each of the operating modes into its own file, added a file for command interpretation, and finally made a small utilities file to hold functionality that is needed in many places. This is a pretty typical simple project structure, but already makes the program as a whole much easier to understand. This can be further aided by good documentation, and making a graph for instance which shows how the files link to each other.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Main sketch"
#include "CanSatNeXT.h"

int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Pre-launch mode"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Flight mode"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Recovery mode"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Command interpretation"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Utilities"
bool LED_IS_ON = false;

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```
  </TabItem>

</Tabs>

While this approach is already miles better than having a single file for everything, it still requires careful management. For instance, the **namespace** is shared between the different files, which may cause confusion in a larger project or when reusing code. If there are functions or variables with the same names, the code doesn't know which one to use, leading to conflicts or unexpected behavior.

Additionally, this approach doesn't lend itself well to **encapsulation**—which is key to building more modular and reusable code. When your functions and variables all exist in the same global space, it becomes harder to prevent one part of the code from inadvertently affecting another. This is where more advanced techniques like namespaces, classes, and object-oriented programming (OOP) come into play. These fall outside the scope of this course, but individual research into those topics is encouraged.


:::tip[Exercise]

Take one of your previous projects and give it a makeover! Split your code into multiple files, and organize your functions based on their roles (e.g., sensor management, data handling, communication). See how much cleaner and easier to manage your project becomes!

:::


## Version Control

---

This concludes the lessons for now. We will add more soon, but in the meanwhile you can find more information about using CanSat NeXT from the other Arduino examples, our [blog](./../../blog/) and the [software](./../CanSat-software/CanSat-software.md) and [hardware](./../CanSat-hardware/CanSat-hardware.md) documentation. I would love to hear your feedback and ideas regarding CanSat NeXT and these materials, so don't hesitate to contact me at samuli@kitsat.fi.