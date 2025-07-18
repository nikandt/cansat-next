---
külgriba_positsioon: 1
---

# Raamatukogu spetsifikatsioon

# Funktsioonid

Järgmisena saate kasutada kõiki tavalisi Arduino funktsioone, aga ka kõiki Arduino raamatukogusid. Arduino funktsioone leiate siit: https://www.arduino.cc/reference/en/.

CanSat järgmine teek lisab mitmeid hõlpsasti kasutatavaid funktsioone erinevate pardal olevate ressursside, näiteks andurite, raadio ja SD-CARD kasutamiseks. Raamatukogu on kaasas visandite näitekomplekt, mis näitab, kuidas neid funktsioone kasutada. Allolevas loendis on ka kõik saadaolevad funktsioonid.

## Süsteemi initsialiseerimise funktsioonid

### cansatinit

| Funktsioon | uint8_t cansatinit (uint8_t macaddress [6]) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0 Kui initsialiseerimine oli edukas, või kui tõrge oli null. |
| ** Parameetrid ** |                                                                    |
|                      | `uint8_t macaddress [6]` |
|                      | 6-baidise MAC-aadress, mida jagab satelliit ja maapealne jaam. See on valikuline parameeter - kui seda ei pakuta, ei lähtestata raadio. Kasutatakse näites visandis: kõik |
| ** Kirjeldus ** | See käsk leiab peaaegu kõigi CanSat järgmiste skriptide seadistusest () `. Seda kasutatakse CanSatNext riistvara, sealhulgas andurite ja SD-kaardi, lähtestamiseks. Lisaks, kui pakutakse `Macaddress", alustab see raadiot ja hakkab kuulama sissetulevaid sõnumeid. Mac -aadressi peaks jagama maapealne jaam ja satelliit. MAC-aadressi saab vabalt valida, kuid on olemas mõned mittevaldkonnad, näiteks kõik baitid on `0x00`,` 0x01` ja `0xff`. Kui funktsiooni init-funktsiooni kutsutakse mittevaliku aadressiga, annab see probleemist seeria. |

### CanSatInit (lihtsustatud MAC-Addressi spetsifikatsioon)

| Funktsioon | uint8_t cansatinit (uint8_t macaddress) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0 Kui initsialiseerimine oli edukas, või kui tõrge oli null. |
| ** Parameetrid ** |                                                                    |
|                      | `uint8_t macaddress` |
|                      | MAC-Addressi viimane bait, mida kasutatakse erinevate CanSat-GS paaride eristamiseks. |
| ** Kirjeldus ** | See on CanSatIniti lihtsustatud versioon koos Mac -aadressiga, mis seab teise baidid automaatselt teadaoleva ohutu väärtuseni. See võimaldab kasutajatel eristada oma saatja-vastuvõtja paare vaid ühe väärtusega, mis võib olla 0-255. |

### GroundStationInit

| Funktsioon | uint8_t GroundStationInit (uint8_t macaddress [6]) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0 Kui initsialiseerimine oli edukas, või kui tõrge oli null. |
| ** Parameetrid ** |                                                                    |
|                      | `uint8_t macaddress [6]` |
|                      | 6-baidise MAC-aadress, mida jagab satelliit ja maapealne jaam. |
| ** Kasutatud näites visandis ** | GroundStation vastuvõtmine |
| ** Kirjeldus ** | See on CanSatIniti funktsiooni lähedane sugulane, kuid see nõuab alati MAC -aadressi. See funktsioon initsialiseerib ainult raadio, mitte muud süsteemid. Maajaam võib olla mis tahes ESP32 tahvel, sealhulgas mis tahes devboard või isegi teine CanSat järgmine tahvel. |

### GroundStationInit (lihtsustatud MAC-Adressi spetsifikatsioon)

| Funktsioon | uint8_t GroundStationInit (uint8_t macaddress) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0 Kui initsialiseerimine oli edukas, või kui tõrge oli null. |
| ** Parameetrid ** |                                                                    |
|                      | `uint8_t macaddress` |
|                      | MAC-Addressi viimane bait, mida kasutatakse erinevate CanSat-GS paaride eristamiseks. |
| ** Kirjeldus ** | See on GroundStationIniti lihtsustatud versioon koos Mac -aadressiga, mis seab teine baidid automaatselt teadaolevale ohutu väärtusele. See võimaldab kasutajatel eristada oma saatja-vastuvõtja paare vaid ühe väärtusega, mis võib olla 0-255. |

## IMU funktsioonid

### ReadAcceseration

| Funktsioon | UINT8_T READACCECELATION (ujuk ja X, ujuk ja Y, ujuk ja z) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0, kui mõõtmine õnnestus.                           |
| ** Parameetrid ** |                                                                    |
|                      | `Float & X, ujuk ja Y, ujuk ja z` |
|                      | `Float & X`: ujuki muutuja aadress, kus salvestatakse x-telje andmeid. |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kiirenduse lugemiseks pardal IMU-st. Parameetrid on iga telje muutujate hõljumise aadressid. Näide IMU näitab, kuidas seda funktsiooni kiirenduse lugemiseks kasutada. Kiirendus tagastatakse G (9,81 m/s) ühikutes. |

### READACCELX

| Funktsioon | Float ReadAcCelx () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Tagastab lineaarse kiirenduse x-teljele G. ühikutes |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada kiirenduse lugemiseks pardal IMU-st konkreetsel teljel. Näide IMU näitab, kuidas seda funktsiooni kiirenduse lugemiseks kasutada. Kiirendus tagastatakse G (9,81 m/s) ühikutes. |

### ReadAccally

| Funktsioon | Ujuge ReadAccally () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Tagastab y-telje lineaarse kiirenduse G. ühikutes |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada kiirenduse lugemiseks pardal IMU-st konkreetsel teljel. Näide IMU näitab, kuidas seda funktsiooni kiirenduse lugemiseks kasutada. Kiirendus tagastatakse G (9,81 m/s) ühikutes. |

### READACCELZ

| Funktsioon | Float ReadAccelz () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Tagastab z-telje lineaarse kiirenduse G. ühikutes |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada kiirenduse lugemiseks pardal IMU-st konkreetsel teljel. Näide IMU näitab, kuidas seda funktsiooni kiirenduse lugemiseks kasutada. Kiirendus tagastatakse G (9,81 m/s) ühikutes. |

### Readgyro

| Funktsioon | uint8_t Readgyro (ujuk ja x, ujuk ja Y, ujuk ja z) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0, kui mõõtmine õnnestus.                           |
| ** Parameetrid ** |                                                                    |
|                      | `Float & X, ujuk ja Y, ujuk ja z` |
|                      | `Float & X`: ujuki muutuja aadress, kus salvestatakse x-telje andmeid. |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada nurkkiiruse lugemiseks pardal IMU-st. Parameetrid on iga telje muutujate hõljumise aadressid. Näide IMU näitab, kuidas seda funktsiooni nurkkiiruse lugemiseks kasutada. Nurgakiirus tagastatakse ühikutes mrad/s. |

### Readgyrox

| Funktsioon | ujuk Readgyrox () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Tagastab X-telje nurkkiiruse MRAD/S ühikutes.                           |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada nurkkiiruse lugemiseks pardal IMU-st konkreetsel teljel. Parameetrid on iga telje muutujate hõljumise aadressid. Nurgakiirus tagastatakse ühikutes mrad/s. |

### Readgyroy

| Funktsioon | ujuk Readgyroy () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Tagastab y-telje nurkkiiruse MRAD/S ühikutes.                           |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada nurkkiiruse lugemiseks pardal IMU-st konkreetsel teljel. Parameetrid on iga telje muutujate hõljumise aadressid. Nurgakiirus tagastatakse ühikutes mrad/s. |

### Readgyroz

| Funktsioon | ujuk Readgyroz () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Tagastab z-telje nurkkiiruse MRAD/S ühikutes.                           |
| ** Kasutatud näites visandis ** | IMU |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada nurkkiiruse lugemiseks pardal IMU-st konkreetsel teljel. Parameetrid on iga telje muutujate hõljumise aadressid. Nurgakiirus tagastatakse ühikutes mrad/s. |

## Baromeetri funktsioonid

### ReadPressure

| Funktsioon | ujuk ReadPressure () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Rõhk Mbaris |
| ** Parameetrid ** | Puudub |
| ** Kasutatud näites visandis ** | Baro |
| ** Kirjeldus ** | See funktsioon tagastab rõhku, nagu teatas pardal olev baromeeter. Surve on Millibari ühikutes. |

### ReadTemprature

| Funktsioon | Ujuk ReadTeMPerature () |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Temperatuur Celsiuse juures |
| ** Parameetrid ** | Puudub |
| ** Kasutatud näites visandis ** | Baro |
| ** Kirjeldus ** | See funktsioon tagastab temperatuuri, nagu teatas pardal olev baromeeter. Lugemise üksus on Celsius. Pange tähele, et see on baromeetri abil mõõdetud sisetemperatuur, nii et see ei pruugi kajastada välist temperatuuri. |

## SD -kaardi / failisüsteemi funktsioonid

### sdcardpresent

| Funktsioon | bool sdcardpresent () |
| ---------------------- |
| ** tagastamise tüüp ** | `Bool` |
| ** tagastamise väärtus ** | Tagastab tõese, kui see tuvastab SD-kaardi, vale, kui mitte.               |
| ** Parameetrid ** | Puudub |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada, kas SD-CARD on mehaaniliselt olemas. SD-kaardi pistikul on mehaaniline lüliti, mida loetakse selle funktsiooni kutsutamisel. Tagastab tõese või vale, sõltuvalt sellest, kas SD-CARD on tuvastatud. |

### AppendFile

| Funktsioon | uint8_t appendfile (stringi failinimi, t andmed) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0, kui kirjutamine õnnestus.                                |
| ** Parameetrid ** |                                                                    |
|                      | `String failName`: lisatava faili aadress. Kui faili pole olemas, luuakse see. |
|                      | `T andmed”: faili lõpus lisatavad andmed.         |
| ** Kasutatud näites visandis ** | Sd_write |
| ** Kirjeldus ** | See on põhiline kirjutamisfunktsioon, mida kasutatakse näitude salvestamiseks SD-CARD-i. |

### printfilesystem

| Funktsioon | void printfilesystem () |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** | Puudub |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | See on väike abistaja funktsioon SD-kaardil olevate failide ja kaustade nimede printimiseks. Saab arengus kasutada. |

### Newdir

| Funktsioon | void newdir (stringi tee) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | `String Path": uue kataloogi tee. Kui see on juba olemas, ei tehta midagi. |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Kasutatakse SD-CAR-i uute kataloogide loomiseks.                     |

### Deletedir

| Funktsioon | void deletedir (stringi tee) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | `String Path’: kustutatava kataloogi tee.                |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Kasutatakse SD-kaardi kataloogide kustutamiseks.                          |

### FileExists

| Funktsioon | booli fileExists (String Path) |
| ---------------------- |
| ** tagastamise tüüp ** | `Bool` |
| ** tagastamise väärtus ** | Tagastab tõese, kui fail on olemas.                                   |
| ** Parameetrid ** |                                                                    |
|                      | `String Path": tee faili juurde.                                   |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada SD-CAR-i faili olemasolu kontrollimiseks. |

### failize

| Funktsioon | uint32_t failize (stringi tee) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint32_t` |
| ** tagastamise väärtus ** | Faili suurus baitides.                                         |
| ** Parameetrid ** |                                                                    |
|                      | `String Path": tee faili juurde.                                   |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada SD-kaardi faili suuruse lugemiseks. |

### kirjutafile

| Funktsioon | uint8_t kirjutafile (stringi failinimi, t andmed) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0, kui kirjutamine õnnestus.                                 |
| ** Parameetrid ** |                                                                    |
|                      | `String failName`: kirjutatava faili aadress.              |
|                      | `T andmed": faili kirjutatud andmed.                     |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | See funktsioon on sarnane AppendFile () `-ga, kuid see kirjutab üle olemasolevad andmed SD-CARD-i kohta. Andmete salvestamiseks tuleks selle asemel kasutada appendfile'i. See funktsioon võib olla kasulik näiteks sätete salvestamiseks. |

### ReadFile

| Funktsioon | String ReadFile (String Path) |
| ---------------------- |
| ** tagastamise tüüp ** | `String` |
| ** tagastamise väärtus ** | Kogu sisu failis.                                           |
| ** Parameetrid ** |                                                                    |
|                      | `String Path": tee faili juurde.                                   |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada kõigi faili andmete lugemiseks muutujaks. Suurte failide lugemise katse võib põhjustada probleeme, kuid see sobib väikeste failide, näiteks konfiguratsiooni või failide seadistamise jaoks. |

### RemameFile

| Funktsioon | void RenameFile (String OldPath, String newPath) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | `String OldPath`: algne tee faili juurde.                      |
|                      | `String newPath`: faili uus tee.                           |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada failide SD-kaardil ümbernimetamiseks või teisaldamiseks.  |

### Deletefile

| Funktsioon | tühine deletefiil (stringi tee) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | `String Path`: kustutatava faili tee.                    |
| ** Kasutatud näites visandis ** | Sd_vanced |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada failide kustutamiseks SD-CARD-ist.        |

## Raadiofunktsioonid

### ondatareceitud

| Funktsioon | tühine ondatareceiving (stringi andmed) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | `String Data": saadud andmed Arduino stringina.                |
| ** Kasutatud näites visandis ** | GroundStation_receive |
| ** Kirjeldus ** | See on tagasihelistamise funktsioon, mida nimetatakse andmete vastuvõtmisel. Kasutajakood peaks selle funktsiooni määratlema ja järgmine CanSat helistab sellele automaatselt andmete vastuvõtmisel. |

### onbinaryDatareceitud

| Funktsioon | tühine onbinaryDatareCEITED (const uint8_t *andmed, uint16_t len) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | `CONST UINT8_T *andmed": saadud andmed UINT8_T massiivina.          |
|                      | `uint16_t len`: vastuvõetud andmete pikkus baitides.                      |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | See sarnaneb funktsiooniga "ondatareceived", kuid andmed antakse stringiobjekti asemel binaarseks. See on ette nähtud edasijõudnutele kasutajatele, kes leiavad, et stringobjekt piirab. |

### ondatasent

| Funktsioon | tühine ondatasent (const booli edu) |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** Parameetrid ** |                                                                    |
|                      | "Const Booli edu": Boolean näitab, kas andmeid saadeti edukalt. |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | See on veel üks tagasihelistamise funktsioon, mida saab vajadusel kasutajakoodile lisada. Seda saab kasutada kontrollimiseks, kas vastuvõttu kinnitas teine raadio. |


### getrssi

| Funktsioon | int8_t getRSSI () |
| ---------------------- |
| ** tagastamise tüüp ** | `int8_t` |
| ** tagastamise väärtus ** | Viimase saadud sõnumi RSSI. Tagastab 1, kui pärast alglaadimist pole sõnumeid laekunud.                           |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada vastuvõtu signaali tugevuse jälgimiseks. Seda saab kasutada antennide või raadiovahemiku gabariidi testimiseks. Väärtust väljendatakse [dbm] (https://en.wikipedia.org/wiki/dbm), kuid skaala pole täpne.  |

### SendData (stringi variant)

| Funktsioon | uint8_t sendData (t andmed) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | 0 Kui andmeid saadeti (ei näita kinnitust).            |
| ** Parameetrid ** |                                                                    |
|                      | `T andmed”: saadetavad andmed. Igat tüüpi andmeid saab kasutada, kuid see teisendatakse stringi sisemiselt.                  |
| ** Kasutatud näites visandis ** | Send_data |
| ** Kirjeldus ** | See on peamine funktsioon andmete saatmiseks maapealse jaama ja satelliidi vahel. Pange tähele, et tagastamise väärtus ei näita, kas andmeid tegelikult laekus, vaid see, et see saadeti. Tagasihelistamisperioodi "ondatasent" saab kasutada kontrollimiseks, kas andmed võeti vastu teise otsa. |

### SendData (binaarne variant)

| Funktsioon | uint8_t sendData (t* andmed, uint16_t len) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | 0 Kui andmeid saadeti (ei näita kinnitust).            |
| ** Parameetrid ** |                                                                    |
|                      | "T* andmed": saatmiseks andmed.                    |
|                      | `uint16_t len`: andmete pikkus baitides.                      |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | Funktsiooni `SendData` binaarne variant, mis on ette nähtud edasijõudnutele kasutajatele, kes tunnevad end stringobjektiga piiratud. |

### getrssi

| Funktsioon | int8_t getRSSI () |
| ---------------------- |
| ** tagastamise tüüp ** | `int8_t` |
| ** tagastamise väärtus ** | Viimase saadud sõnumi RSSI. Tagastab 1, kui pärast alglaadimist pole sõnumeid laekunud.                           |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada vastuvõtu signaali tugevuse jälgimiseks. Seda saab kasutada antennide või raadiovahemiku gabariidi testimiseks. Väärtust väljendatakse [dbm] (https://en.wikipedia.org/wiki/dbm), kuid skaala pole täpne. 

### setradiochannel

| Funktsioon | `void setradiochannel (uint8_t newchannel)` |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** tagastamise väärtus ** | Puudub |
| ** Parameetrid ** | `uint8_t newchannel`: soovitud Wi-Fi kanali number (1–11). Mis tahes väärtus üle 11 piirneb 11 -ni. |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | Määrab Exi-Now Community Channel. Uus kanal peab olema standardsete WiFi-kanalite (1–11) vahemikus, mis vastab sagedustele, mis algavad 2,412 GHz, mille sammud on 5 MHz. Kanal 1 on 2,412, kanal 2 on 2,417 ja nii edasi. Helistage sellele funktsioonile enne raamatukogu initsialiseerimist. Vaikekanal on 1. |

### getradiochannel

| Funktsioon | `uint8_t getradiochannel ()` |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Praegune esmane WiFi-kanal. Tagastab 0, kui kanali tõmbamisel on tõrge. |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | Tavab praegu kasutusel oleva esmase WiFi-kanali. See funktsioon töötab alles pärast raamatukogu initsialiseerimist. |

### printradiofrecency

| Funktsioon | `tühine printradiofRequency ()` |
| ---------------------- |
| ** tagastamise tüüp ** | "tühine" |
| ** tagastamise väärtus ** | Puudub |
| ** Kasutatud näites visandis ** | Puudub |
| ** Kirjeldus ** | Arvutab ja prindib GHZ praeguse sageduse aktiivse WiFi-kanali põhjal. See funktsioon töötab alles pärast raamatukogu initsialiseerimist. |


## ADC funktsioonid

### ADCTOVALGE

| Funktsioon | Ujuk AdCTCTOVALGE (int väärtus) |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | Teisendatud pinge voltidena.                                       |
| ** Parameetrid ** |                                                                    |
|                      | `int väärtus`: ADC -lugemine tuleb teisendada pingeks.              |
| ** Kasutatud näites visandis ** | Accurateanalogread |
| ** Kirjeldus ** | See funktsioon teisendab ADC näidu pingeks, kasutades kalibreeritud kolmanda astme polünoomi lineaarsemaks muundamiseks. Pange tähele, et see funktsioon arvutab sisendnõela pinge, nii et aku pinge arvutamiseks peate kaaluma ka takistide võrku. |

### analoogpinge

| Funktsioon | ujuki analoogpinge (int pin) |
| ---------------------- |
| ** tagastamise tüüp ** | `ujuk" |
| ** tagastamise väärtus ** | ADC pinge voltidena.                                             |
| ** Parameetrid ** |                                                                    |
|                      | `int pin`: loetav tihvt.                                        |
| ** Kasutatud näites visandis ** | Accurateanalogread |
| ** Kirjeldus ** | See funktsioon loeb pinget otse, selle asemel, et kasutada analoograami ja teisendab näidu sisemiselt sisemiselt, kasutades `Adctovoltage”. |