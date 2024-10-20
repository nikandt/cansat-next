---
sidebar_position: 9
---

# Lesson 8: Go with the Flow

The topic of this lesson is flow control, or how we can manage what the processor does at different points in time. Up until now, most of our programs have focused on a single task, which, while straightforward, limits the system's potential. By introducing different **states** in our program, we can expand its capabilities.

For example, the program could have a pre-launch state, where the satellite is waiting for liftoff. Then, it could transition to flight mode, where it reads sensor data and performs its main mission. Finally, a recovery mode might activate, in which the satellite sends signals to help with recovery—blinking lights, beeping, or executing whatever system actions we’ve designed.

The **trigger** for changing between states can vary. It could be a sensor reading, like a pressure change, an external command, an internal event (such as a timer), or even a random occurrence, depending on what’s required. In this lesson, we'll build on what we learned previously by using an external command as the trigger.

## Flow Control with External Triggers

First, let's modify the ground station code to be able to receive messages from the Serial monitor, so that we can send custom commands when needed.

As you can see, the only changes are in the main loop. First, we check if there is data received from the Serial. If not, nothing is done, and the loop continues. However, if there is data, it is read into a variable, printed for clarity, and then sent via the radio to the satellite. If you still have the program from the previous lesson uploaded to the satellite, you can try it out.

```Cpp title="Ground station able to send commands"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Serial In - Data Sources

When we read data from the `Serial` object, we are accessing the data stored in the UART RX buffer, which is transmitted via the USB Virtual Serial connection. In practice, this means that any software capable of communicating over a virtual serial port, such as the Arduino IDE, terminal programs, or various programming environments, can be used to send data to the CanSat.

This opens up many possibilities for controlling the CanSat from external programs. For example, we can send commands by manually typing them, but also write scripts in Python or other languages to automate commands, making it possible to create more advanced control systems. By leveraging these tools, you can send precise instructions, run tests, or monitor the CanSat in real time without manual intervention.

:::

Next, let’s look at the satellite side. Since we have multiple states in the program, it gets a bit longer, but let’s break it down step by step.

First, we initialize the systems as usual. TThere are also a couple of global variables, which we place at the top of the file so that it's easy to see what names are being used. The `LED_IS_ON` is familiar from our previous code examples, and additionally we have a global state variable `STATE`, which stores the... well, state.

```Cpp title="Initialization"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Next, in the loop we simply check which subroutine should be executed according to the current state, and calls its function:

```Cpp title="Loop"
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
```

In this particular case, each state is represented by a separate function that gets called based on the state. The content of the functions isn't really important here, but here they are:

```Cpp title="Subroutines"
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
```

There is also a small helper function `blinkLED`, which helps avoid code repetition by handling LED toggling for us.

Finally, the state is changed when the ground station tells us to:

```Cpp title="Command received callback"
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


<details>
  <summary>Whole code</summary>
  <p>Here is the whole code for your convenience.</p>
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


With this, we can now control what the satellite is doing without even having physical access to it. Rather, we can just send a command with the ground station and the satellite does what we want.

:::tip[Exercise]


Create a program which measures a sensor with a specific frequency, which can be changed with a remote command to any value. Instead of using subroutines, try to modify a delay value directly with a command. 

Try to also make it tolerant of unexpected inputs, such as "-1", "ABCDFEG" or "".

As a bonus exercise, make the new setting permanent between resets, so that when the satellite is turned off and on again, it will resume transmitting with the new frequency instead of reverting to the original one. As a tip, revisiting [lesson 5](./lesson5.md) may be helpful.

:::

---

In the next lesson, we will make our data storage, communication and handling significantly more efficient, fast by using binary data. While it might seem abstract at first, handling data as binary instead of numbers simplifies many tasks, as it is the computer's native language.

[Click here for the next lesson!](./lesson9)
