---
sidebar_position: 3
---

# Lektion 3: Registrering af rotation

CanSat NeXT har to sensor-IC'er på CanSat NeXT-boardet. Den ene er barometeret, som vi brugte i den sidste lektion, og den anden er _inertial measurement unit_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). LSM6DS3 er en 6-akset IMU, hvilket betyder, at den kan udføre 6 forskellige målinger. I dette tilfælde er det lineær acceleration på tre akser (x, y, z) og vinkelhastighed på tre akser.

I denne lektion vil vi se på IMU-eksemplet i biblioteket og også bruge IMU'en til at lave et lille eksperiment.

## Bibliotekseksempel

Lad os starte med at se på, hvordan bibliotekseksemplet fungerer. Indlæs det fra File -> Examples -> CanSat NeXT -> IMU.

Den indledende opsætning er igen den samme - inkluder biblioteket, initialisér serial og CanSat. Så lad os fokusere på loopet. Men loopet ser også virkelig velkendt ud! Vi læser værdierne ligesom i den sidste lektion, kun denne gang er der mange flere af dem.

```Cpp title="Reading IMU values"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Hver akse læses faktisk med nogle hundrede mikrosekunders mellemrum. Hvis du har brug for, at de opdateres samtidigt, så tjek funktionerne [readAcceleration](./../CanSat-software/library_specification#readacceleration) og [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Efter at have læst værdierne kan vi printe dem som sædvanligt. Dette kunne gøres med Serial.print og println ligesom i den sidste lektion, men dette eksempel viser en alternativ måde at printe data på, med meget mindre manuelt skrivearbejde.

Først oprettes en buffer på 128 chars. Derefter initialiseres den først, så hver værdi er 0, ved hjælp af memset. Efter dette skrives værdierne til bufferen med `snprintf()`, som er en funktion, der kan bruges til at skrive strenge med et specificeret format. Til sidst printes dette bare med `Serial.println()`.

```Cpp title="Fancy Printing"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Hvis ovenstående virker forvirrende, kan du bare bruge den mere velkendte stil med print og println. Det bliver dog lidt irriterende, når der er mange værdier at printe.

```Cpp title="Regular Printing"
Serial.print("Ax:");
Serial.println(ay);
// etc
```

Til sidst er der igen en kort forsinkelse, før loopet starter igen. Den er primært der for at sikre, at outputtet er læsbart - uden en forsinkelse ville tallene ændre sig så hurtigt, at det er svært at læse dem.

Accelerationen læses i G'er, eller multipla af $9.81 \text{ m}/\text{s}^2$. Vinkelhastigheden er i enheder af $\text{mrad}/\text{s}$.

:::tip[Øvelse]

Prøv at identificere akserne ud fra målingerne!

:::

## Detektion af frit fald

Som en øvelse kan vi prøve at detektere, om enheden er i frit fald. Ideen er, at vi ville kaste boardet op i luften; CanSat NeXT ville detektere det frie fald og tænde LED'en i et par sekunder efter at have detekteret en frit fald-hændelse, så vi kan se, at vores tjek blev udløst, selv efter at vi igen har grebet den.

Vi kan beholde setup'et, som det var, og bare fokusere på loopet. Lad os rydde den gamle loop-funktion og starte forfra. Bare for sjov, lad os læse data ved hjælp af den alternative metode.

```Cpp title="Read Acceleration"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Lad os definere frit fald som en hændelse, hvor den samlede acceleration er under en tærskelværdi. Vi kan beregne den samlede acceleration ud fra de individuelle akser som

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Hvilket i kode ville se nogenlunde sådan ud.

```Cpp title="Calculating total acceleration"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Og selvom dette ville virke, bør vi bemærke, at beregning af kvadratroden er virkelig langsom beregningsmæssigt, så vi bør undgå at gøre det, hvis det er muligt. Vi kunne trods alt bare beregne

$$a^2 = a_x^2+a_y^2+a_z^2$$

og sammenligne dette med en foruddefineret tærskel.

```Cpp title="Calculating total acceleration squared"
float totalSquared = ax*ax+ay*ay+az*az;
```

Nu hvor vi har en værdi, lad os begynde at styre LED'en. Vi kunne have LED'en tændt hele tiden, når den samlede acceleration er under en tærskel; det ville dog være lettere at aflæse, hvis LED'en forblev tændt et stykke tid efter detektion. En måde at gøre dette på er at lave en anden variabel, lad os kalde den LEDOnTill, hvor vi simpelthen skriver tidspunktet, indtil hvornår vi vil holde LED'en tændt.

```Cpp title="Timer variable"
unsigned long LEDOnTill = 0;
```

Nu kan vi opdatere timeren, hvis vi detekterer en frit fald-hændelse. Lad os bruge en tærskel på 0.1 for nu. Arduino stiller en funktion til rådighed, der hedder `millis()`, som returnerer tiden siden programmet startede i millisekunder.

```Cpp title="Updating the timer"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Til sidst kan vi bare tjekke, om den aktuelle tid er mere eller mindre end den specificerede `LEDOnTill`, og styre LED'en baseret på det. Her er, hvordan den nye loop-funktion ser ud:

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

Når du prøver dette program, kan du se, hvor hurtigt det nu reagerer, da vi ikke har en forsinkelse i loopet. LED'en tænder med det samme efter at have forladt hånden, når den bliver kastet.

:::tip[Øvelser]

1. Prøv at genindføre forsinkelsen i loop-funktionen. Hvad sker der?
2. I øjeblikket har vi ingen udskrift i loopet. Hvis du bare tilføjer en print-sætning til loopet, vil outputtet være virkelig svært at læse, og udskrivningen vil sænke loop-cyklustiden betydeligt. Kan du finde på en måde kun at printe én gang i sekundet, selvom loopet kører kontinuerligt? Tip: se på, hvordan LED-timeren blev implementeret
3. Lav dit eget eksperiment ved at bruge enten accelerationen eller rotationen til at detektere en type hændelse.

:::

---

I den næste lektion vil vi forlade det digitale domæne og prøve at bruge en anden type sensor - en analog lysmåler.

[Klik her for den næste lektion!](./lesson4)