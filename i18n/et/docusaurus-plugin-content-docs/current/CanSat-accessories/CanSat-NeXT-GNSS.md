---
sidebar_position: 1
---

# CanSat NeXT GNSS Moodul

CanSat NeXT GNSS moodul laiendab CanSat NeXT-i asukoha jälgimise ja täpse reaalajas kella võimalustega. Moodul põhineb U-Blox SAM-M10Q GNSS vastuvõtjal, mille on loonud U-Blox.

![CanSat NeXT GNSS moodul](./img/GNSS.png)

## Riistvara

Moodul ühendab GNSS vastuvõtja CanSat NeXT-iga laienduspealkirja kaudu UART-i abil. Seade kasutab UART RX ja TX jaoks laienduspealkirja kontakte 16 ja 17 ning võtab toiteallika +3V3 liinilt laienduspealkirjas.

Vaikimisi on GNSS mooduli varuregistrid toidetud +3V3 liinilt. Kuigi see muudab mooduli kasutamise lihtsaks, tähendab see, et moodul peab alati alustama nullist, kui üritab leida fikseeritud asukohta. Selle leevendamiseks on võimalik pakkuda välist toiteallikat varupinge liini kaudu J103 pealkirjade kaudu. V_BCK pinni antav pinge peaks olema 2-6,5 volti ja voolutarve on pidev 65 mikroamprit, isegi kui peamine toide on välja lülitatud. Varupinge andmine võimaldab GNSS vastuvõtjal säilitada kõik seaded, aga ka kriitiliselt almanahhi ja efemeriidi andmed - vähendades fikseeritud asukoha leidmise aega ~30 sekundilt 1-2 sekundile, kui seade pole oluliselt liikunud toitelülituste vahel.

Turul on saadaval palju teisi GNSS mooduleid ja mooduleid ettevõtetelt nagu Sparkfun ja Adafruit, teiste seas. Neid saab ühendada CanSat NeXT-iga sama UART-liidese kaudu või kasutades SPI ja I2C, sõltuvalt moodulist. CanSat NeXT raamatukogu peaks toetama ka teisi U-blox mooduleid kasutavaid mooduleid. GNSS mooduleid otsides proovige leida selline, mille põhitrükkplaat on võimalikult suur - enamikul on liiga väikesed trükkplaadid, mis muudab nende antenni jõudluse väga nõrgaks võrreldes suuremate trükkplaatidega moodulitega. Igasugune suurus alla 50x50 mm hakkab takistama jõudlust ja võimet leida ja säilitada fikseeritud asukohta.

Lisateabe saamiseks GNSS mooduli ja paljude saadaolevate seadete ja funktsioonide kohta vaadake GNSS vastuvõtja andmelehte [U-Blox veebisaidilt](https://www.u-blox.com/en/product/sam-m10q-module).

Mooduli riistvara integreerimine CanSat NeXT-iga on tõesti lihtne - pärast vahetükkide lisamist kruviaukudesse sisestage hoolikalt pealkirjakontaktid pistikupesadesse. Kui kavatsete luua mitmekihilise elektroonikapaki, veenduge, et GNSS oleks kõige ülemine moodul, et võimaldada 

![CanSat NeXT GNSS moodul](./img/stack.png)

## Tarkvara

Lihtsaim viis CanSat NeXT GNSS-i kasutamise alustamiseks on meie enda Arduino raamatukogu, mille leiate Arduino raamatukogu haldurist. Juhised raamatukogu installimiseks leiate [alustamise](./../course/lesson1.md) lehelt.

Raamatukogu sisaldab näiteid, kuidas lugeda asukohta ja praegust aega, samuti kuidas edastada andmeid CanSat NeXT-iga.

Üks kiire märkus seadete kohta - moodulile tuleb öelda, millist tüüpi keskkonnas seda kasutatakse, et see saaks kasutaja asukohta kõige paremini hinnata. Tavaliselt eeldatakse, et kasutaja on maapinnal ja kuigi nad võivad liikuda, ei ole kiirendus tõenäoliselt väga suur. See ei kehti muidugi CanSatide kohta, mis võivad olla rakettidega käivitatud või tabada maapinda üsna suurte kiirustega. Seetõttu määrab raamatukogu vaikimisi asukoha arvutamise kõrge dünaamilise keskkonna eeldusel, mis võimaldab fikseeritud asukohta säilitada vähemalt mingil määral kiire kiirenduse ajal, kuid muudab ka maapinnal asukoha märgatavalt vähem täpseks. Kui selle asemel on soovitav suurem täpsus pärast maandumist, saate GNSS mooduli initsialiseerida käsuga `GNSS_init(DYNAMIC_MODEL_GROUND)`, asendades vaikimisi `GNSS_init(DYNAMIC_MODEL_ROCKET)` = `GNSS_init()`. Lisaks on olemas `DYNAMIC_MODEL_AIRBORNE`, mis on veidi täpsem kui raketimudel, kuid eeldab ainult mõõdukat kiirendust.

See raamatukogu eelistab kasutusmugavust ja sisaldab ainult põhifunktsioone, nagu asukoha ja aja saamine GNSS-ist. Kasutajatele, kes otsivad arenenumaid GNSS funktsioone, võib suurepärane SparkFun_u-blox_GNSS_Arduino_Library olla parem valik.

## Raamatukogu spetsifikatsioon

Siin on CanSat GNSS raamatukogu saadaval olevad käsud.

### GNSS_Init

| Funktsioon           | uint8_t GNSS_Init(uint8_t dynamic_model)                          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 1, kui initsialiseerimine oli edukas, või 0, kui esines viga. |
| **Parameetrid**      |                                                                    |
|                      | `uint8_t dynamic_model`                                           |
|                      | See valib dünaamilise mudeli või keskkonna, mida GNSS moodul eeldab. Võimalikud valikud on DYNAMIC_MODEL_GROUND, DYNAMIC_MODEL_AIRBORNE ja DYNAMIC_MODEL_ROCKET. |
| **Kirjeldus**        | See käsk initsialiseerib GNSS mooduli ja seda tuleks kutsuda seadistamise funktsioonis. |

### readPosition

| Funktsioon           | uint8_t readPosition(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Tagastab 0, kui mõõtmine oli edukas.                           |
| **Parameetrid**      |                                                                    |
|                      | `float &latitude, float &longitude, float &altitude`                                    |
|                      | `float &x`: Ujuvpunkti muutuja aadress, kuhu andmed salvestatakse. |
| **Kasutatud näites** | Kõik                                                  |
| **Kirjeldus**        | Seda funktsiooni saab kasutada seadme asukoha lugemiseks koordinaatidena. Väärtused on pooljuhuslikud enne, kui fikseeritud asukoht on saadud. Kõrgus on meetrites merepinnast, kuigi see pole väga täpne. |


### getSIV

| Funktsioon           | uint8_t getSIV()                  |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint8_t`                                                          |
| **Tagastusväärtus**  | Nähtavate satelliitide arv |
| **Kasutatud näites** | AdditionalFunctions                                          |
| **Kirjeldus**        | Tagastab nähtavate satelliitide arvu. Tavaliselt väärtused alla 3 viitavad fikseeritud asukoha puudumisele. |

### getTime

| Funktsioon           | uint32_t getTime()                  |
|----------------------|--------------------------------------------------------------------|
| **Tagastustüüp**     | `uint32_t`                                                          |
| **Tagastusväärtus**  | Praegune epohhiaeg |
| **Kasutatud näites** | AdditionalFunctions                                          |
| **Kirjeldus**        | Tagastab praeguse epohhiaja, nagu GNSS satelliitide signaalid näitavad. Teisisõnu, see on sekundite arv, mis on möödunud alates 00:00:00 UTC, neljapäev, 1. jaanuar 1970. |