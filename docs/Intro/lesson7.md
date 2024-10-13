---
sidebar_position: 7
---

# Lesson 7: Talking Back

CanSats are often programmed to operate on pretty simple logic - for example taking measurements every n milliseconds, saving and transmitting the data and repeating. In contrast, sending commands to the satellite to change its behavior in the middle of the mission could enable a lot of new possibilites. Perhaps you'd like to turn a sensor on or off, or command the satellite to make a sound so that you can find it. There are a lot of possibilites, but perhaps the most useful is the capability to turn on power-hungry devices in the satellite only just before the rocket launch, giving you much more flexibility and freedom to operate after the satellite has already been integrated to the rocket.

In this lesson, let's try to turn the LED on and off on the satellite board via the ground station. This presents a scenario where the satellite doesn't do anything without being told to do so, essentially a simple command system.


:::info

## Software Callbacks

The data reception in the CanSat library is programmed as **callbacks**, which is a function that gets called... well, back, when a certain event occurs. Where as so far we in our programs the code always has followed exactly the lines we have written, now it seems to occasionally execute another function in between before continuing in the main loop. This may sound confusing, but it will be quite clear when seen in action.

:::

## Remote Blinky

For this exercise, let's try to replicate the LED blinking from the first lesson, but this time the LED is actually controlled remotely.

Let's look first at the satellite side program. The initialization is very familiar by now, but the loop is slightly more surprising - there is nothing in there. This is because all logic is handled through the callback function remotely from the ground station, so we can just leave the loop empty.

The more interesting stuff happens in the function `onDataReceived(String data)`. This is the aforementioned callback function, which is programmed in the library to be called every time the radio receives any data. The name of the function is programmed into the library, so as long as you use the exact same name as here, it will get called when there is data available.

In this example below, the data is printed each time just to visualize what is happening, but the LED state is also changed each time a message is received, regardless of the content.

```Cpp title="Satellite code for doing nothing without being told to"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

The variable `LED_IS_ON` is stored as a global variable, which means that it is accessible from anywhere in the code. These are typically frowned upon in programming, and beginners are taught to avoid them in their programs. However, in _embedded_ programming such as we are doing here, they are actually very efficient and expected way of doing this. Just be careful that you are not using the same name in multiple places!

:::

If we flash this onto the CanSat NeXT board and start it up... Nothing happens. This is of course expected, as we don't have any commands coming in at the moment.

On the ground station side, the code isn't very complicated. We initialize the system, and then in the loop send a message every 1000 ms, i.e. once a second. In the current program, the actual message doesn't matter, but only that something is being sent in the same network.

```Cpp title="Ground station sending messages"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Now when we program this code to the ground station (don't forget to press the BOOT-button) and the satellite is still on, the LED on the satellite starts blinking, turning on and off after each message. The message is also printed to the terminal.

:::tip[Exercise]

Flash the code snippet below to the ground station board. What happens at the satellite side? Can you change the satellite program such that it only reacts by turning the LED on when receiving `LED ON` and off with `LED OFF`, and otherwise just prints the text.

```Cpp title="Ground station sending messages"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Generate a random index to pick a message
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Send the randomly selected message
  sendData(messages[randomIndex]);
}
```

:::

Note also that receiving messages does not block sending them, so we could (and will) be sending messages from both ends at the same time. The satellite can be transmitting data continuously, while the ground station can keep sending commands to the satellite. If the messages are simultaneous (within the same millisecond or so), there can be a clash and the message doesn't go through. However, CanSat NeXT will automatically retransmit the message if it detects a clash. So just beware that it may happen, but that it most probably will go unnoticed.

In the next lesson, we will expand on this to perform **flow control** remotely, or changing the behavior of the satellite based on received commands. 

[Click here for the next lesson!](./lesson8)