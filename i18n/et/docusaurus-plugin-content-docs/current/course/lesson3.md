---
sidebar_position: 3
---

# Õppetund 3: Pöörlemise tunnetamine

CanSat NeXT pardal on kaks sensorit. Üks neist on baromeeter, mida kasutasime eelmises tunnis, ja teine on _inertsimõõteseade_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). LSM6DS3 on 6-teljeline IMU, mis tähendab, et see suudab teha 6 erinevat mõõtmist. Antud juhul on need lineaarne kiirendus kolmel teljel (x, y, z) ja nurkkiirus kolmel teljel.

Selles tunnis vaatleme raamatukogu näidet ja kasutame IMU-d väikese eksperimendi tegemiseks.

## Raamatukogu näide

Alustame, vaadates, kuidas raamatukogu näide töötab. Laadige see failist -> Näited -> CanSat NeXT -> IMU.

Algne seadistus on jälle sama - lisage raamatukogu, initsialiseerige serial ja CanSat. Seega keskendume tsüklile. Kuid ka tsükkel tundub väga tuttav! Loeme väärtusi samamoodi nagu eelmises tunnis, ainult et seekord on neid palju rohkem.

```Cpp title="IMU väärtuste lugemine"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Iga telg loetakse tegelikult mõnesaja mikrosekundi vahega. Kui vajate, et need uuendataks samaaegselt, vaadake funktsioone [readAcceleration](./../CanSat-software/library_specification#readacceleration) ja [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Pärast väärtuste lugemist saame need nagu tavaliselt välja printida. Seda võiks teha Serial.print ja println abil nagu eelmises tunnis, kuid see näide näitab alternatiivset viisi andmete printimiseks, palju vähem käsitsi kirjutades.

Esmalt luuakse 128 tähemärgi pikkune puhver. Seejärel initsialiseeritakse see nii, et iga väärtus on 0, kasutades memset. Pärast seda kirjutatakse väärtused puhvri `snprintf()` abil, mis on funktsioon, mida saab kasutada stringide kirjutamiseks määratud formaadis. Lõpuks prinditakse see lihtsalt `Serial.println()` abil.

```Cpp title="Kena printimine"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Kui eelnev tundub segane, võite lihtsalt kasutada tuttavamat stiili, kasutades print ja println. Kuid see muutub veidi tüütuks, kui on palju väärtusi, mida printida.

```Cpp title="Tavaline printimine"
Serial.print("Ax:");
Serial.println(ay);
// jne
```

Lõpuks on jälle lühike viivitus enne tsükli uuesti alustamist. See on peamiselt selleks, et tagada, et väljund oleks loetav - ilma viivituseta muutuksid numbrid nii kiiresti, et neid oleks raske lugeda.

Kiirendus loetakse G-des ehk $9.81 \text{ m}/\text{s}^2$ kordsetes. Nurkkiirus on ühikutes $\text{mrad}/\text{s}$.

:::tip[Harjutus]

Proovige tuvastada telg lugemite põhjal!

:::

## Vabalangemise tuvastamine

Harjutusena proovime tuvastada, kas seade on vabalangemises. Idee on selles, et viskame plaadi õhku, CanSat NeXT tuvastab vabalangemise ja lülitab LED-i sisse paariks sekundiks pärast vabalangemise sündmuse tuvastamist, et saaksime öelda, et meie kontroll oli käivitunud isegi pärast selle uuesti kinni püüdmist.

Saame seadistuse jätta samaks ja keskenduda ainult tsüklile. Puhastame vana tsükli funktsiooni ja alustame uuesti. Lõbu pärast loeme andmeid alternatiivse meetodi abil.

```Cpp title="Kiirenduse lugemine"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Määratleme vabalangemise sündmusena, kui kogu kiirendus on alla läviväärtuse. Saame arvutada kogu kiirenduse üksikute telgede põhjal järgmiselt:

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Mis näeks koodis välja umbes selline.

```Cpp title="Kogu kiirenduse arvutamine"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

Ja kuigi see töötaks, peaksime märkima, et ruutjuure arvutamine on arvutuslikult väga aeglane, seega peaksime seda võimalusel vältima. Lõppude lõpuks võiksime lihtsalt arvutada

$$a^2 = a_x^2+a_y^2+a_z^2$$

ja võrrelda seda eelnevalt määratud läviväärtusega.

```Cpp title="Kogu kiirenduse ruudu arvutamine"
float totalSquared = ax*ax+ay*ay+az*az;
```

Nüüd, kui meil on väärtus, alustame LED-i juhtimist. Me võiksime LED-i hoida alati sees, kui kogu kiirendus on alla läviväärtuse, kuid lugemine oleks lihtsam, kui LED jääks mõneks ajaks pärast tuvastamist sisse. Üks viis seda teha on luua teine muutuja, nimetame seda LEDOnTill, kuhu lihtsalt kirjutame aja, milleni soovime LED-i sees hoida.

```Cpp title="Taimeri muutuja"
unsigned long LEDOnTill = 0;
```

Nüüd saame taimerit uuendada, kui tuvastame vabalangemise sündmuse. Kasutame praegu läviväärtust 0.1. Arduino pakub funktsiooni `millis()`, mis tagastab aja, mis on möödunud programmi käivitamisest millisekundites.

```Cpp title="Taimeri uuendamine"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Lõpuks saame lihtsalt kontrollida, kas praegune aeg on rohkem või vähem kui määratud `LEDOnTill`, ja juhtida LED-i selle põhjal. Siin on, kuidas uus tsükli funktsioon välja näeb:

```Cpp title="Vabalangemise tuvastamise tsükli funktsioon"
unsigned long LEDOnTill = 0;

void loop() {
  // Kiirenduse lugemine
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Kogu kiirenduse (ruudu) arvutamine
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Taimeri uuendamine, kui tuvastame langemise
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // LED-i juhtimine taimeri põhjal
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Seda programmi proovides näete, kui kiiresti see nüüd reageerib, kuna meil pole tsüklis viivitust. LED süttib kohe pärast käest lahkumist, kui seda visatakse.

:::tip[Harjutused]

1. Proovige tsükli funktsiooni viivitus uuesti sisse viia. Mis juhtub?
2. Praegu pole meil tsüklis ühtegi printimist. Kui lisate lihtsalt printimisavalduse tsüklisse, on väljund väga raske loetav ja printimine aeglustab tsükli tsükli aega märkimisväärselt. Kas suudate välja mõelda viisi, kuidas printida ainult kord sekundis, isegi kui tsükkel töötab pidevalt? Vihje: vaadake, kuidas LED-i taimer oli rakendatud.
3. Looge oma eksperiment, kasutades kas kiirendust või pöörlemist mõne sündmuse tuvastamiseks.

:::

---

Järgmises tunnis lahkume digitaalsest maailmast ja proovime kasutada teistsugust sensorit - analoogvalgustugevuse mõõturit.

[Klõpsake siin, et minna järgmisse tundi!](./lesson4)