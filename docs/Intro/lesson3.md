---
sidebar_position: 3
---

# Lesson 3: Sensing the Spin

CanSat NeXT has two sensor ICs on the CanSat NeXT board. One of them is the barometer we used in the last lesson, and the other one is _inertial measurement unit_ [LSM6DS3](./../CanSat-hardware/on_board_sensors.md#inertial-measurement-unit). The LSM6DS3 is a 6-axis IMU, which means that it is able to perform 6 different measurements. In this case, it is linear acceleration on three axis (x, y, z) and angular velocity on three axis.

In this lesson, we will look at the IMU example in the library, and also use the IMU to do a small experiment.

## Library Example

Let's start by looking at how the library example works. Load it from File -> Examples -> CanSat NeXT -> IMU.

The initial setup is again the same - include the library, initialize serial and CanSat. So, let's focus on the loop. However, the loop also looks really familiar! We read the values just like in the last lesson, only this time there are many more of them. 

```Cpp title="Reading IMU values"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Each axis is actually read some hundreds of microseconds apart. If you need them to be updated simultaneously, check out the functions [readAcceleration](./../CanSat-software/library_specification#readacceleration) and [readGyro](./../CanSat-software/library_specification#readgyro).

:::

After reading the values, we can print them as usually. This could be done using Serial.print and println just like in the last lesson, but this example shows an alternative way to print the data, with much less manual writing.

First, a buffer of 128 chars is created. Then this is first initialized so that each value is 0, using memset. After this, the values are written to the buffer using `snprintf()`, which is a function that can be used to write strings with a specified format. Finally, this is just printed with `Serial.println()`.

```Cpp title="Fancy Printing"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

If the above feels confusing, you can just use the more familiar style using print and println. However, this gets a bit annoying when there are many values to print.

```Cpp title="Regular Printing"
Serial.print("Ax:");
Serial.println(ay);
// etc
```

Finally, there is again a short delay before starting the loop again. This is mainly there to ensure that the output is readable - without a delay the numbers would be changing so fast that it is hard to read them.

The acceleration is read in Gs, or multiples of $9.81 \text{ m}/\text{s}^2$. The angular velocity is in units of $\text{mrad}/\text{s}$.

:::tip[Exercise]

Try to identify the axis based on the readings!

:::

## Free Fall detection

As an exercise, let's try to detect if the device is in free fall. The idea is that we would throw the board in the air, CanSat NeXT would detect the free fall and turn the LED on for couple of seconds after detecting a free fall event, so that we can tell that our check had triggered even after again catching it.

We can keep the setup just like it was, and just focus on the loop. Let's clear the old loop function, and start fresh. Just for fun, let's read the data using the alternative method.

```Cpp title="Read Acceleration"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Let's define free fall as an event when the total acceleration is below a treshold value. We can calculate the total acceleration from the individual axis as

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Which would look in code something like this.

```Cpp title="Calculating total acceleration"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

And while this would work, we should note that calculating the square root is really slow computationally, so we should avoid doing it if possible. After all, we could just calculate

$$a^2 = a_x^2+a_y^2+a_z^2$$

and compare this to a predefined treshold.

```Cpp title="Calculating total acceleration squared"
float totalSquared = ax*ax+ay*ay+az*az;
```

Now that we have a value, let's start controlling the LED. We could have the LED on always when the total acceleration is below a treshold, however reading it would be easier if the LED stayed on for a while after detection. One way to do this is to make another variable, let's call it LEDOnTill, where we simply write the time to where we want to keep the LED on.

```Cpp title="Timer variable"
unsigned long LEDOnTill = 0;
```

Now we can update the timer if we detect a free fall event. Let's use treshold of 0.1 for now. Arduino provides a function called `millis()`, which returns the time since the program started in milliseconds.

```Cpp title="Updating the timer"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Finally, we can just check if the current time is more or less than the specified `LEDOnTill`, and control the LED based on that. Here is what the new loop function looks like:

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

Trying out this program, you can see how fast it now reacts since we don't have a delay in the loop. The LED turns on immediately after leaving the hand when being thrown.

:::tip[Exercises]

1. Try reintroducing the delay in the loop function. What happens?
2. Currently we don't have any printing in the loop. If you just add a print statement to the loop, the output will be really difficult to read and the printing will slow down the loop cycle time significantly. Can you come up with way to only print once a second, even if the loop is running continuously? Tip: look at how the LED timer was implemented
3. Create your own experiment, using either the acceleration or spinning to detect some type of event.

:::

In the next lesson, we will leave the digital domain and try using a different style of sensor - an analogue light meter.

[Click here for the next lesson!](./lesson4)