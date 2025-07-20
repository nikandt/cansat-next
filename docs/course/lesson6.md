---
sidebar_position: 6
---

# Lesson 6: Phoning Home

Now we have taken measurements and also saved them on an SD-card. The next logical step is to transmit them wirelessly to the ground, which enables completely new world in terms of measurements and experiments we can perform. For example, trying out the zero-g flight with IMU would have been quite a bit more interesting (and easy to calibrate), if we could have seen the data in real time. Let's take a look at how we can do that!

In this lesson, we will send measurements from CanSat NeXT to the ground station receiver. Later on, we will also take a look at commanding the CanSat with messaged sent by the ground station.

## Antennas

Before starting this lesson, please make sure you have some type of antenna connected to the CanSat NeXT board and the ground station. 

:::note

You should never try transmitting anything without an antenna. Not only will it probably not work, there is a possibility that the reflected power will damage the transmitter.

:::

Since we are using 2.4 GHz band, which is shared by systems like Wi-Fi, Bluetooth, ISM, drones etc, there are a lot of commercial antennas available. Most Wi-Fi antennas actually work really well with CanSat NeXT, but you will often need an adapter to connect them to the CanSat NeXT board. We have also tested some adapter models, which are available in the webstore. 

More information about antennas can be found in the hardware documentation: [Communication and Antennas](./../CanSat-hardware/communication.md). This article also has [instructions](./../CanSat-hardware/communication#quarter-wave-antenna)  on building your own antenna from the materials in the CanSat NeXT kit.

## Sending Data

With the discussion about antennas out of the way, let's start sending some bits. We will start again by looking at the setup, which has actually a key difference this time - we've added a number as an **argument** to the `CanSatInit()` command. 

```Cpp title="Setup for transmission"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Passing a number value to `CanSatInit()` tells the CanSat NeXT that we want to now use the radio. The number indicates the value of the last byte of the MAC address. You can think of it as a key to your specific network - you can only communicate to CanSats that share the same key. This number should be shared between your CanSat NeXT and your ground station. You can pick your favorite number between 0 and 255. I picked 28, since it is [perfect](https://en.wikipedia.org/wiki/Perfect_number).

With the radio initialized, transmitting the data is really simple. It actually operates just like the `appendFile()` that we used in the last lesson - you can add any value and it will transmit it in a default format, or you can use a formatted string and send that instead.

```Cpp title="Transmitting the data"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

With this simple code, we are now transmitting the LDR measurement almost 10 times per second. Next let's take a look at how to receive it.

:::note

Those familiar to low-level programming might feel more comfortable sending the data in binary form. Don't worry, we've got you covered. The binary commands are listed in the [Library Specification](./../CanSat-software/library_specification#sendData-binary).

:::

## Receiving Data

This code should now be programmed to another ESP32. Usually it is the second controller board included in the kit, however pretty much any other ESP32 will work as well - including another CanSat NeXT. 

:::note

If you are using an ESP32 development board as the ground station, remember to press the Boot-button on the board while flashing from the IDE. This sets the ESP32 to the right boot-mode for reprogramming the processor. CanSat NeXT does this automatically, but the development boards most often do not.

:::

The setup code is exactly the same as before. Just remember to change the radio key to your favorite number.

```Cpp title="Setup for reception"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

However, after that things get a bit different. We make a completely empty loop function! This is because we have actually nothing to do in the loop, but instead the receiving is done through **callbacks**.

```Cpp title="Setting up a callback"
void loop() {
  // We have nothing to do in the loop.
}

// This is a callback function. It is run every time the radio receives data.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Where as the function `setup()` runs just once at the start and `loop()` runs continuously, the function `onDataReceived()` runs only when the radio has received new data. This way, we can handle the data in the callback function. In this example, we just print it, but we could have also modified it however we wanted.

Note that the `loop()` function doesn't *have* to be empty, you can actually use it for whatever you want with one caviat - delays should be avoided, as the `onDataReceived()` function will also not run until the delay is over.

If you now have both programs running on different boards at the same time, there should be quite a lot of measurements being sent wirelessly to your PC.

:::note

For binary oriented folks - you can use the callback function onBinaryDataReceived.

:::

## Real time Zero-G

Just for fun, let's repeat the zero-g experiment but with radios. The receiver code can stay the same, as actually does the setup in the CanSat code. 

As a reminder, we made a program in the IMU lesson that detected free-fall and turned an a LED in this scenario. Here is the old code:

```Cpp title="Free fall detecting loop function"
unsigned long LEDOnTill = 0;

void loop() {
  // Read Acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculate total acceleration (squared)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Update the timer if we detect a fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Control the LED based on the timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

It is tempting to just add the `sendData()` directly to the old example, however we need to consider the timing. We don't usually want to send messages more than ~20 times per second, but on the other hand we want to the loop to be running continuously so that the LED still turns on.

We need to add another timer - this time to send data every 50 milliseconds. The timer is done by comparing the current time to the current time to the last time when data was sent. The last time is then updated each time data is sent. Take also a look at how the string is made here. It could also be transmitted in parts, but this way it is received as a single message, instead of multiple messages.

```Cpp title="Free fall detection + data transmission"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Read Acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calculate total acceleration (squared)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Update the timer if we detect a fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Control the LED based on the timer
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Update the last send time to the current time
    lastSendTime = millis();
  }

}
```

The data format here is actually compatible again with the serial plotter - looking at that data makes it quite clear why we were able to detect the free fall earlier so cleanly - the values really do drop to zero as soon as the device is dropped or thrown.

---

In the next section, we will take a short break to review what we've learned so far and ensure we are prepared to continue building on these concepts.

[Click here for the first review!](./review1)