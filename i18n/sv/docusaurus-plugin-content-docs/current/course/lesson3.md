---
sidebar_position: 3
---

# Lektion 3: Känna av rotationen

CanSat NeXT har två sensor-IC:er på CanSat NeXT-kortet. En av dem är barometern vi använde i förra lektionen, och den andra är _inertial measurement unit_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). LSM6DS3 är en 6-axlig IMU, vilket betyder att den kan utföra 6 olika mätningar. I detta fall är det linjär acceleration på tre axlar (x, y, z) och vinkelhastighet på tre axlar.

I denna lektion kommer vi att titta på IMU-exemplet i biblioteket och även använda IMU:n för att göra ett litet experiment.

## Biblioteksexempel

Låt oss börja med att titta på hur biblioteksexemplet fungerar. Ladda det från Fil -> Exempel -> CanSat NeXT -> IMU.

Den initiala inställningen är återigen densamma - inkludera biblioteket, initiera seriell och CanSat. Så, låt oss fokusera på loopen. Men loopen ser också väldigt bekant ut! Vi läser värdena precis som i förra lektionen, bara att det denna gång finns många fler av dem.

```Cpp title="Läsa IMU-värden"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Varje axel läses faktiskt med några hundra mikrosekunders mellanrum. Om du behöver att de uppdateras samtidigt, kolla in funktionerna [readAcceleration](./../CanSat-software/library_specification#readacceleration) och [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Efter att ha läst värdena kan vi skriva ut dem som vanligt. Detta kan göras med Serial.print och println precis som i förra lektionen, men detta exempel visar ett alternativt sätt att skriva ut data, med mycket mindre manuell skrivning.

Först skapas en buffer på 128 tecken. Sedan initieras denna så att varje värde är 0, med hjälp av memset. Efter detta skrivs värdena till bufferten med `snprintf()`, som är en funktion som kan användas för att skriva strängar med ett specificerat format. Slutligen skrivs detta bara ut med `Serial.println()`.

```Cpp title="Snygg utskrift"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Om ovanstående känns förvirrande kan du bara använda den mer bekanta stilen med print och println. Men detta blir lite irriterande när det finns många värden att skriva ut.

```Cpp title="Vanlig utskrift"
Serial.print("Ax:");
Serial.println(ay);
// etc
```

Slutligen finns det återigen en kort fördröjning innan loopen startar igen. Detta är främst där för att säkerställa att utgången är läsbar - utan en fördröjning skulle siffrorna ändras så snabbt att det är svårt att läsa dem.

Accelerationen läses i Gs, eller multiplar av $9.81 \text{ m}/\text{s}^2$. Vinkelhastigheten är i enheter av $\text{mrad}/\text{s}$.

:::tip[Övning]

Försök identifiera axeln baserat på avläsningarna!

:::

## Fritt fall-detektering

Som en övning, låt oss försöka upptäcka om enheten är i fritt fall. Idén är att vi skulle kasta kortet i luften, CanSat NeXT skulle upptäcka det fria fallet och tända LED-lampan i ett par sekunder efter att ha upptäckt ett fritt fall, så att vi kan se att vår kontroll har utlösts även efter att vi fångat det igen.

Vi kan behålla inställningen precis som den var och bara fokusera på loopen. Låt oss rensa den gamla loop-funktionen och börja om från början. Bara för skojs skull, låt oss läsa data med den alternativa metoden.

```Cpp title="Läsa acceleration"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Låt oss definiera fritt fall som en händelse när den totala accelerationen är under ett tröskelvärde. Vi kan beräkna den totala accelerationen från de individuella axlarna som

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Vilket skulle se ut i kod ungefär så här.

```Cpp title="Beräkna total acceleration"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Och även om detta skulle fungera, bör vi notera att beräkning av kvadratroten är riktigt långsamt beräkningsmässigt, så vi bör undvika att göra det om möjligt. Trots allt kan vi bara beräkna

$$a^2 = a_x^2+a_y^2+a_z^2$$

och jämföra detta med ett fördefinierat tröskelvärde.

```Cpp title="Beräkna total acceleration i kvadrat"
float totalSquared = ax*ax+ay*ay+az*az;
```

Nu när vi har ett värde, låt oss börja kontrollera LED-lampan. Vi skulle kunna ha LED-lampan tänd alltid när den totala accelerationen är under ett tröskelvärde, men det skulle vara lättare att läsa om LED-lampan stannade på ett tag efter detektering. Ett sätt att göra detta är att skapa en annan variabel, låt oss kalla den LEDOnTill, där vi helt enkelt skriver tiden till när vi vill hålla LED-lampan tänd.

```Cpp title="Timer-variabel"
unsigned long LEDOnTill = 0;
```

Nu kan vi uppdatera timern om vi upptäcker ett fritt fall. Låt oss använda ett tröskelvärde på 0,1 för nu. Arduino tillhandahåller en funktion som heter `millis()`, som returnerar tiden sedan programmet startade i millisekunder.

```Cpp title="Uppdatera timern"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Slutligen kan vi bara kontrollera om den aktuella tiden är mer eller mindre än den specificerade `LEDOnTill`, och kontrollera LED-lampan baserat på det. Här är hur den nya loop-funktionen ser ut:

```Cpp title="Fritt fall-detekterande loop-funktion"
unsigned long LEDOnTill = 0;

void loop() {
  // Läs acceleration
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Beräkna total acceleration (i kvadrat)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Uppdatera timern om vi upptäcker ett fall
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Kontrollera LED-lampan baserat på timern
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

När du provar detta program kan du se hur snabbt det nu reagerar eftersom vi inte har någon fördröjning i loopen. LED-lampan tänds omedelbart efter att ha lämnat handen när den kastas.

:::tip[Övningar]

1. Försök att återinföra fördröjningen i loop-funktionen. Vad händer?
2. För närvarande har vi ingen utskrift i loopen. Om du bara lägger till ett utskriftskommando i loopen kommer utgången att bli riktigt svår att läsa och utskriften kommer att sakta ner loopens cykeltid avsevärt. Kan du komma på ett sätt att bara skriva ut en gång per sekund, även om loopen körs kontinuerligt? Tips: titta på hur LED-timern implementerades.
3. Skapa ditt eget experiment, använd antingen accelerationen eller rotationen för att upptäcka någon typ av händelse.

:::

---

I nästa lektion kommer vi att lämna den digitala domänen och försöka använda en annan typ av sensor - en analog ljusmätare.

[Klicka här för nästa lektion!](./lesson4)