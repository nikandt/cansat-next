---
külgriba_positsioon: 1
---

# CANSAT järgmine GNSS -moodul

CanSat järgmine GNSS -moodul laiendab CanSat järgmisena asukoha jälgimise ja täpse reaalajas kella võimalustega. Moodul põhineb U-Blox SAM-M10Q GNSS-i vastuvõtjal U-Bloxi poolt.

! [Cansat järgmine GNSS moodul] (./ IMG/GNSS.PNG)

## Riistvara

Moodul ühendab GNSS -i vastuvõtja CanSat'iga järgmise UART kaudu pikenduspäises. Seade kasutab UART RX ja TX jaoks pikenduspäiseid 16 ja 17 ning võtab ka toiteallika pikenduspäises asuvast +3V3 -st.

Vaikimisi toidetakse GNSS-mooduli varuregistrid +3V3 realt. Kuigi see muudab mooduli hõlpsaks kasutamiseks, tähendab see, et moodul peab paranduse leidmisel alati nullist alustama. Selle leevendamiseks on võimalik pakkuda välist toiteallikat läbi varunduspinge joone J103 päiste kaudu. V_BCK-tihvtile pakutav pinge peaks olema 2–6,5 volti ja praegune viik on konstantne 65 mikroamper, isegi kui põhivõimsus välja lülitatakse. Varupinge tarnimine võimaldab GNSS-i vastuvõtjal säilitada kõiki sätteid, aga ka ülioluliselt almanahhi ja ephemerise andmeid-vähendades parandust ~ 30 sekundilt 1-2 sekundini, kui seade pole energialülitite vahel märkimisväärselt liikunud.

Selliste ettevõtete nagu Sparkfun ja Adafruit on saadaval palju muid GNSS -i purunemisi ja mooduleid. Neid saab järgmisena sama UART liidese kaudu ühendada CanSat'iga või kasutades SPI ja I2C, sõltuvalt moodulist. CanSat järgmine teek peaks toetama ka muid U-Bloxi mooduleid kasutavaid väljalõikeid. GNSS -i purunemiste otsimisel proovige leida üks, kus baas PCB on võimalikult suur - kõige rohkem on liiga väikesed PCB -d, mis muudab nende antenni jõudluse väga nõrgaks võrreldes suuremate PCB -dega moodulitega. Mis tahes suurus, mis on väiksem kui 50x50 mm, takistab paranduse leidmise ja säilitamise jõudlust ja võimet.

GNSS-mooduli ning saadaolevate seadete ja funktsioonide arvu kohta lisateabe saamiseks lugege GNSS-i vastuvõtja andmelehte [U-Bloxi veebisaidilt] (https://www.u-blox.com/en/product/sam-m10q-module).

Mooduli riistvara integreerimine CanSatiks järgmisena on tõesti lihtne - pärast kruviaukudele väljalülituste lisamist sisestage päise tihvtid ettevaatlikult tihvtipesadesse. Kui kavatsete teha mitmekihilise elektroonilise virna, pange GNSS kindlasti kõige paremini mooduliks 

! [CANSAT järgmine GNSS moodul] (./ IMG/Stack.png)

## tarkvara

Lihtsaim viis CanSat järgmise GNSSi kasutamiseks on meie enda Arduino raamatukoguga, mille leiate Arduino raamatukoguhaldurist. Teegi installimise juhiseid leiate lehelt [Alustamine] (./../ kursus/õppetund1.md).

Raamatukogu sisaldab näiteid, kuidas lugeda positsiooni ja praegust aega, samuti andmeid edastada CanSat järgmisena.

Üks kiire märkus seadete kohta - moodulile tuleb öelda, millises keskkonnas seda kasutatakse, et see saaks kõige paremini lähendada kasutaja asukohta. Tavaliselt eeldatakse, et kasutaja on maapinnal ja kuigi nad võivad liikuda, pole kiirendus tõenäoliselt eriti kõrge. Muidugi ei kehti see CanSatsi puhul, mida võidakse käivitada rakettidega, või lüüa maapinnale üsna suure kiirusega. Seetõttu seab raamatukogu vaikimisi arvutatava positsiooni, eeldades suurt dünaamilist keskkonda, mis võimaldab kiiret kiirenduse ajal parandust vähemalt mõnevõrra säilitada, kuid see muudab ka positsiooni maapinnal eriti vähem täpseks. Kui selle asemel on soovitav kõrge täpsus, saate GNSS -mooduli initsialiseerida käsuga `gnss_init (Dynamic_model_ground)`, asendades vaikimisi `gnss_init (dünaamiline_model_rocket)` = `gnss_init ()`. Lisaks on seal `Dynamic_model_airborne`, mis on pisut täpsem kui raketimudel, kuid eeldab ainult tagasihoidlikku kiirendust.

See raamatukogu seab tähtsusega kasutusmugavust ja sellel on ainult põhifunktsioonid, näiteks GNSS-ist asukoha ja aja saamine. Kasutajatele, kes otsivad edasijõudnumaid GNSS-i funktsioone, võib parem valik olla suurepärane Sparkfun_U-Blox_GNSS_arduino_library.

## Raamatukogu spetsifikatsioon

Siin on saadaolevad käsud CanSat GNSS teegist.

### GNSS_INIT

| Funktsioon | uint8_t gnss_init (uint8_t dünamic_model) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 1 Kui initsialiseerimine oli edukas, või 0, kui tekkis tõrge. |
| ** Parameetrid ** |                                                                    |
|                      | `uint8_t Dynamic_model` |
|                      | See valib dünaamilise mudeli või keskkonna, mida GNSS -moodul eeldab. Võimalikud valikud on Dynamic_model_ground, Dynamic_model_airborne ja Dynamic_model_rocket. |
| ** Kirjeldus ** | See käsk initsialiseerib GNSS -mooduli ja peaksite seda helistama funktsioonis seadistusfunktsioonis. |

### Readpositsioon

| Funktsioon | uint8_t ReadPosition (ujuk ja x, ujuk ja Y, ujuk ja z) |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Tagastab 0, kui mõõtmine õnnestus.                           |
| ** Parameetrid ** |                                                                    |
|                      | `Ujuk ja laiuskraad, ujuk ja pikkus, ujuk ja kõrgus" |
|                      | `Float & X`: ujukmuutuja aadress, kus andmeid salvestatakse. |
| ** Kasutatud näites visandis ** | Kõik |
| ** Kirjeldus ** | Seda funktsiooni saab kasutada seadme asukoha lugemiseks koordinaatidena. Enne paranduse saamist on väärtused pooljuhuslikud. Kõrgus on meetrid merepinnast, ehkki see pole eriti täpne. |


### getiv

| Funktsioon | uint8_t getiv () |
| ---------------------- |
| ** tagastamise tüüp ** | `uint8_t` |
| ** tagastamise väärtus ** | Vaatatavate satelliitide arv |
| ** Kasutatud näites visandis ** | Lisafunktsioonid |
| ** Kirjeldus ** | Tagastab vaadeldud satelliitide arvu. Tavaliselt väärtused, mis on alla 3, näitavad parandust. |

### getTime

| Funktsioon | uint32_t getTime () |
| ---------------------- |
| ** tagastamise tüüp ** | `uint32_t` |
| ** tagastamise väärtus ** | Praegune ajastu aeg |
| ** Kasutatud näites visandis ** | Lisafunktsioonid |
| ** Kirjeldus ** | Tagastab praeguse ajajärgu aja, mida tähistavad GNSS-satelliitide signaalid. Teisisõnu, see on sekundite arv möödunud alates 00:00:00 UTC, neljapäeval, esimene jaanuar 1970. |