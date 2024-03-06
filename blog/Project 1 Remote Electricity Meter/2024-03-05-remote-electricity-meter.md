---
slug: first-project
title: Remote Electricity Meter
date: 2024-03-05T09:00:00.000Z
authors: samuli
tags: [LDR, CanSat NeXT]
---

In this first project, I'll be using CanSat NeXT board to add a real-time remote reading feature to the the electricity meter in my house. Most modern electricity meters have a pulse LED, which blinks once per measured watt-hour of electricity. My idea is to use the light-dependant resistor (LDR) on the CanSat NeXT board to monitor this LED, and use that to calculate the real time power consumption of my home.

The basic concept is that the resistance of the LDR will change depending on the intensity of light hitting it, and by mounting the board so that most variability comes from the indicator LED itself, we could try to detect when it is on and when it is off based on the LDR voltage.

The indicator LED is mounted on a panel inside the electricity meter, which makes reading it with a CanSat NeXT shaped board slightly difficult. To mitigate this, I designed a support structure with a baffel built in, which can be used to mount the board to the electricity meter, so that only the light from the indicator LED can reach the LDR. 

![Structure with the baffle.](./img/baffle.png)

The structure is designed so that the distance to the board is 12 mm, which is the same distance as with the breakout boards. This way, I can use the basic standoffs to directly mount the baffle to the PCB. The baffle will be mounted to the electricity meter with the help of some two-sided tape. Keep it simple, stupid!

After some 3d-printing, this is what it looks like. Some light was able to leak through the PCB from the side, so I added a piece of electric tape to mitigate that.

![CanSat with baffle.](./img/cansat_with_baffle.png)

Next, I'd like to test if we are able to see the pulses in the data. We can use the plotting tool in Arduino IDE to see the pulses, however there is a small problem - it can only display 50 values on the x-axis, which means that if we want to see even 5 seconds of data, we need to print only once every 100 ms. This means that the pulses might happen between the readings. So, instead of just reading the data every 100 ms and printing the value, I actually read the data as fast as the MCU can read the analog input - roughly 10 times per millisecond. Finally, it keeps track of the lowest value (highest brightness) and prints this lowest value every 100 milliseconds.


```Cpp title="Brightness plotter"
#include "CanSatNeXT.h"

unsigned long previousMillis = 0; // Stores last time the LDR value was updated
const long interval = 100;        // Interval at which to print the LDR value (100ms)
int minValue = 4095;              // Initialize with the highest possible value from analogRead

void setup() {
  Serial.begin(115200);
  CanSatInit();
}

void loop() {
  unsigned long currentMillis = millis();

  int value = analogRead(LDR);
  // Update minValue if the current reading is lower than the previous minValue
  if (value < minValue) {
    minValue = value;
  }

  // Check if 100ms have passed
  if (currentMillis - previousMillis >= interval) {
    // Save the last time the LDR value was updated
    previousMillis = currentMillis;

    // Print the lowest LDR value
    Serial.print("LDR:");
    Serial.println(minValue);

    // Reset minValue for the next interval
    minValue = 4095;
  }
}
```

With this code, it seems to detect all fast light changes very reliably. Time to mount it to the meter!