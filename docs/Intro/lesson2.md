---
sidebar_position: 2
---

# Lesson 2: Feeling the Pressure

In this second lesson, we will start using the sensors on the CanSat NeXT board. This time, we will focus on measuring the surrounding atmospheric pressure. We will use the on-board barometer [LPS22HB](./../CanSat-hardware/on_board_sensors.md#barometer) to read the pressure, as well as to read the temperature of the barometer itself.

Let's start from the barometer code in the library examples. In Arduino IDE, select File-> Examples->CanSat NeXT->Baro. 

The beginning of the program looks quite familiar from the last lesson. Again, we start by including the CanSat NeXT library, and setting up the serial connection as well as initializing CanSat NeXT systems.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

The function call to CanSatInit() initializes all the sensors for us, including the barometer. So, we can start using it in the loop function.

The below two lines are where the temperature and pressure are actually read. When the functions readTemperature and readPressure are called, the processor sends a command to the barometer, which measures the pressure or temperature, and returns the result to the processor.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

In the example, the values are printed, and then this is followed by a delay of 1000 ms, so that the loop will repeat roughly once a second.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Using the data

We can also use the data in the code, rather than just to print it or save it. For example, we could make a code that detects if the pressure drops by a certain amount, and for instance turn the LED on. Or anything else you'd like to do. Let's try turning the on-board LED on.

To implement this, we need to slighly modify the code in the example. First, let's start tracking the previous pressure value. To create **global variables**, i.e. ones that don't only exist while we are executing a specific function, you can simply write them outside any specific function. The variable previousPressure is updated on each cycle of the loop function, right at the end. This way we keep track of the the old value, and can compare it to the newer value.

We can use an if-statement to compare the old and new values. In the code below, the idea is that if the previous pressure is 0.1 hPa lower than the new value, we will turn the LED on, and otherwise the LED is kept off.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

If you flash this modified loop to the CanSat NeXT, it should both print the variable values like before, but now also look for the pressure drop. The atmospheric pressure drops roughly 0.12 hPa / meter when going up, so if you try to rapidly lifting the CanSat NeXT a meter higher, the LED should turn on for one loop cycle (1 second), and then turn back off. It is probably best to disconnect the USB cable before trying this!

You can also try modifying the code. What happens if the delay is changed? What about if the **hysteresis** of 0.1 hPa is changed, or even totally removed?

In the next lesson, we will get even more physical activity, as we try using the other integrated sensor IC - the inertial measurement unit.

[Click here for the next lesson!](./lesson3)