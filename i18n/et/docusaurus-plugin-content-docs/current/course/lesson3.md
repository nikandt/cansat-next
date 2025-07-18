---
külgriba_positsioon: 3
---

# 3. õppetund: spinni tundmine

CanSat järgmisel on CanSat järgmisel tahvlil kaks andurit. Üks neist on baromeeter, mida kasutasime viimases õppetunnis, ja teine on _inertial mõõtmisüksus_ [lsm6ds3] (./../ cansat-hardware/on_board_sensors.md#inertsiaalsed mõõtude-ühendid). LSM6DS3 on 6-teljeline IMU, mis tähendab, et see on võimeline tegema 6 erinevat mõõtmist. Sel juhul on see lineaarne kiirendus kolmel teljel (x, y, z) ja nurkkiirus kolmel teljel.

Selles õppetunnis vaatame raamatukogus IMU näidet ja kasutame ka IMU -d väikese katse tegemiseks.

## Raamatukogu näide

Alustame sellest, kuidas raamatukogu näide töötab. Laadige see failist -> Näited -> CANSAT Next -> IMU.

Esialgne seadistamine on jällegi sama - lisage teek, lähtestage seeria- ja pune. Keskendume siis silmusele. Kuid ka silmus näeb välja tõesti tuttav! Lugesime väärtusi nagu viimases õppetunnis, ainult seekord on neid veel palju. 

`` `CPP Title =" IMU väärtuste lugemine "
ujuki kirves = reduccelx ();
ujuk ay = readAccely ();
ujuk az = reduccelz ();
float gx = readgyrox ();
ujuk gy = Readgyroy ();
ujuk Gz = Readgyroz ();
`` `

::: Märkus

Iga telje loetakse tegelikult sadu mikrosekunditest. Kui teil on vaja neid samaaegselt värskendada, vaadake funktsioone [ReadAcceleration] (./../ CANSAT-SOFTWARE/Library_Specication#READACCELATSIOON) ja [READGYRO] (.

:::

Pärast väärtuste lugemist saame need printida nagu tavaliselt. Seda saaks teha kasutades Serial.print ja Println täpselt nagu viimases õppetunnis, kuid see näide näitab alternatiivset viisi andmete printimiseks koos palju vähem käsitsi kirjutamisega.

Esiteks luuakse puhver 128 söe. Seejärel lähtestatakse see kõigepealt nii, et iga väärtus on 0, kasutades memset. Pärast seda kirjutatakse väärtused puhvrile, kasutades `snprintf ()`, mis on funktsioon, mida saab kasutada stringide kirjutamiseks määratud vorminguga. Lõpuks trükitakse see lihtsalt `serial.println ()`.

`` `CPP Title =" Fancy Printing "
CHAR aruanne [128];
memset (aruanne, 0, suurus (aruanne));
Snprintf (aruanne, suurus (aruanne), "A: %4,2F %4,2F %4,2F G: %4,2F %4,2F %4,2F",
    kirves, ay, az, gx, gy, gz);
Serial.println (aruanne);
`` `

Kui ülaltoodud on segane, saate printimise ja printlni abil lihtsalt kasutada tuttavamat stiili. Kuid see muutub pisut tüütuks, kui printimiseks on palju väärtusi.

`` `CPP Title =" Regulaarne printimine "
Seeria.print ("kirves:");
Seeria.println (ay);
// jne
`` `

Lõpuks on enne silmuse alustamist jälle lühike viivitus. See on peamiselt selleks, et väljund oleks loetav - viivitusega muutuksid numbrid nii kiiresti, et neid on raske lugeda.

Kiirendust loetakse GS -is ehk korrutistes 9,81 dollarit \ tekst {m}/\ tekst {s}^2 $. Nurgakiirus on $ \ teksti {mrad}/\ tekst {s} $ ühikutes.

::: Näpunäide [treening]

Proovige telje tuvastada lugemiste põhjal!

:::

## Vaba kukkumise tuvastamine

Proovime harjutusena tuvastada, kas seade on vaba langus. Idee on see, et viskaksime tahvli õhku, CanSat järgmisena tuvastaks vaba kukkumise ja lülitaks LED -i paariks sekundiks pärast vabade sügise sündmuse tuvastamist, et saaksime öelda, et meie tšekk oli käivitunud isegi pärast seda, kui see on uuesti püüdnud.

Saame seadistust hoida täpselt nii, nagu see oli, ja keskendume lihtsalt silmusele. Tühjendame vana silmuse funktsiooni ja alustame värskelt. Lihtsalt lõbu pärast lugege andmeid alternatiivse meetodi abil.

`` `CPP Title =" Loe kiirendust "
ujuk kirves, ay, az;
READACCERETION (AX, AY, AZ);
`` `

Määratleme vaba kukkumise sündmusena, kui kogukiirendus on allapoole treshold väärtuse. Saame arvutada kogu kiirenduse individuaalsest teljest

$$ a = \ sqrt {a_x^2+a_y^2+a_z^2} $$

Mis näeks koodi midagi sellist välja.

`` `CPP Title =" kogukiirenduse arvutamine "
ujuki koguarvustatud = ax*ax+ay*ay+az*az;
ujuki kiirendus = math.sqrt (konarsquared);
`` `

Ja kuigi see toimiks, peaksime arvestama, et ruutjuure arvutamine on arvutuslikult aeglane, nii et peaksime selle võimaluse korral vältima. Lõppude lõpuks saaksime lihtsalt arvutada

$$ a^2 = a_x^2+a_y^2+a_z^2 $$

ja võrrelge seda eelnevalt määratletud tresholdiga.

`` `CPP Title =" Kogu kiirenduse ruudu arvutamine "
ujuki koguarvustatud = ax*ax+ay*ay+az*az;
`` `

Nüüd, kui meil on väärtus, hakkame LED -i kontrollima. Meil võiksime alati juhtida, kui kogukiirendus on allapoole tresholdist, kuid lugemine oleks lihtsam, kui LED jääks pärast avastamist mõneks ajaks sisse. Üks viis selleks on teha veel üks muutuja, nimetagem seda Ledontilliks, kus me lihtsalt kirjutame aega sinna, kus tahame LED -i peal hoida.

`` `CPP Title =" Taimerimuutuja "
allkirjastamata pikk ledontill = 0;
`` `

Nüüd saame taimerit värskendada, kui tuvastame tasuta sügise sündmuse. Kasutagem praegu Tresholdi 0,1. Arduino pakub funktsiooni nimega `Millis ()`, mis tagastab aega pärast programmi algust millisekundites.

`` `CPP Title =" Taimeri värskendamine "
if (koguarvuga <0,1)
{
Ledontill = Millis () + 2000;
}
`` `

Lõpuks saame lihtsalt kontrollida, kas praegune aeg on enam -vähem kui määratud `Ledontill`, ja kontrollida LED -i selle põhjal. See näeb välja uus silmuse funktsioon:

`` `CPP Title =" Vaba sügise tuvastamise funktsioon "
allkirjastamata pikk ledontill = 0;

tühine Loop () {
  // Loe kiirendust
  ujuk kirves, ay, az;
  READACCERETION (AX, AY, AZ);

  // Arvutage kogukiirendus (ruut)
  ujuki koguarvustatud = ax*ax+ay*ay+az*az;
  
  // Värskendage taimerit, kui tuvastame kukkumise
  if (koguarvuga <0,1)
  {
    Ledontill = Millis () + 2000;
  }

  // Kontrollige LED taimeri põhjal
  if (ledontill> = millilis ())
  {
    DigitalWrite (LED, High);
  } else {
    DigitalWrite (LED, madal);
  }
}
`` `

Seda programmi proovides näete, kui kiiresti see nüüd reageerib, kuna meil pole silmuses viivitust. LED lülitub kohe pärast käest lahkumist sisse.

::: Näpunäide [harjutused]

1. proovige silmuse funktsiooni viivitus uuesti tutvustada. Mis juhtub?
2. Praegu pole meil silmuses ühtegi printimist. Kui lisate silmusesse lihtsalt trükiväljaande, on väljundit tõesti keeruline lugeda ja printimine aeglustab silmuse tsükli aega märkimisväärselt. Kas saate välja mõelda, kuidas printida ainult üks kord sekund, isegi kui silmus töötab pidevalt? Näpunäide. Vaadake, kuidas LED -taimerit rakendati
3. Looge oma eksperiment, kasutades teatud tüüpi sündmuste tuvastamiseks kas kiirendust või ketrumist.

:::

---

Järgmises õppetunnis lahkume digitaalsest domeenist ja proovime kasutada teistsugust anduri stiili - analoogvalgustite arvesti.

[Klõpsake järgmise õppetunni saamiseks siin!] (./ Õppetund 4)