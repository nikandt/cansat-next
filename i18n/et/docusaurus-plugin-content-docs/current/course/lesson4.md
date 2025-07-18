---
Külgriba_positsioon: 4
---

# 4. õppetund: vastupanu pole mõttetu

Siiani oleme keskendunud digitaalsete andurite seadmete kasutamisele, et saada väärtusi otse SI ühikutes. Elektriseadmed muudavad mõõtmise tavaliselt kaudselt ja seejärel tehakse soovitud ühikuteks muundamine pärast seda. Seda tegid varem sensoriseadmed ise (ja CanSat järgmise raamatukogu abil), kuid paljud meie kasutatavad andurid on palju lihtsamad. Üks analoogsensorite tüüp on takistuslikud andurid, kus anduri elemendi takistus muutub sõltuvalt mõnest nähtusest. Takistuslikud andurid eksisteerivad paljude koguste puhul - sealhulgas jõud, temperatuur, valguse intensiivsus, keemilised kontsentratsioonid, pH ja paljud teised.

Selles õppetunnis kasutame ümbritseva valguse intensiivsuse mõõtmiseks CanSat'i järgmisel tahvlil valgust sõltumatu takisti (LDR). Kuigi Themistorit kasutatakse väga sarnasel viisil, on see tulevase õppetunni keskmes. Samad oskused kehtivad otse LDR -i ja termistori, aga ka paljude teiste takistuslike andurite kasutamisel.

! [LDR asukoht tahvlil] (./../ cansathardware/img/ldr.png)

## takistussensorite füüsika

Selle asemel, et otse tarkvara juurde hüpata, astume sammu tagasi ja arutame, kuidas takistava anduri lugemine üldiselt töötab. Mõelge allpool olevale skemaatilisele. Pinge LDR_EN on 3,3 volti (protsessori tööpinge) ja selle teele on ühendatud kaks takisti. Üks neist on ** ldr ** (R402), teine aga ** referentsiit ** (R402). Võrdlustakisti takistus on 10 kilo-karmi, samas kui LDR-i takistus varieerub sõltuvalt valgustingimustest 5-300 kilohmi.

! [LDR -skemaatiline] (./ IMG/LDR.PNG)

Kuna takistid on ühendatud järjestikku, on kogutakistus 

$$
R = r_ {401} + r_ {ldr},
$$

ja takistite kaudu vool on 

$$
I_ {ldr} = \ frac {v_ {op}} {r},
$$

kus $ v_ {op} $ on MCU toimiv pinge. Pidage meeles, et vool peab mõlema takisti kaudu olema sama. Seetõttu saame arvutada pinge languse LDR -i kohal 

$$
V_ {ldr} = r_ {ldr} * i_ {ldr} = v_ {op} \ frac {r_ {ldr}}} {r_ {401} + r_ {ldr}}.
$$

Ja see pinge langus on LDR-i pinge, mida saame mõõta analoog-digitaalmuunduriga. Tavaliselt saab seda pinget otse korreleerida või kalibreerida vastavalt mõõdetud väärtustele, näiteks pingest temperatuuri või heleduseni. Kuid mõnikord on soovitav kõigepealt arvutada mõõdetud takistus. Vajadusel saab selle arvutada järgmiselt:

$$
R_ {ldr} = \ frac {v_ {ldr}} {i_ {ldr}} = \ frac {v_ {ldr}}} {v_ {op}}} (r_ {401} + r_ {ldr}) = r_ {401}) \ frac {\ frac {v_ {ldr}} {v_ {op}}}} {1- \ frac {v_ {ldr}} {v_ {op}}}}}
$$

## LDR -i lugemine praktikas

LDR-i või muude takistuslike andurite lugemine on väga lihtne, kuna peame lihtsalt pinge analoog-digitaalmuundurilt küsima. Alustame seekord uue Arduino visandi nullist. Fail -> uus visand.

Esiteks alustame visandit nagu varem, lisades raamatukogu. Seda tehakse visandi alguses. Alustage seadistuses jada ja lähtestage CANSAT, täpselt nagu varem.

`` `CPP Title =" BASIC SETUP "
#include "canSatNext.h"

void setup () {
  Seeria.Begin (115200);
  Cansatinit ();
}
`` `

LDR -i lugemise põhsilm pole palju keerulisem. Takistid R401 ja R402 on juba laual ja peame lihtsalt lugema nende ühisest sõlmest pinge. Lugeme ADC väärtust ja printime see.

`` `CPP Title =" BASIC LDR Loop "
tühine Loop () {
    int väärtus = analoograam (LDR);
    Seeria.print ("LDR väärtus:");
    Seeria.println (väärtus);
    viivitus (200);
}
`` `

Selle programmi abil reageerivad väärtused selgelt valgustustingimustele. Kui LDR on valguse käes, saame madalamad väärtused ja tumedamad väärtused. Kuid väärtused on sadades ja tuhandetes, mitte eeldatavas pingevahemikus. Seda seetõttu, et loeme nüüd ADC otsest väljundit. Iga bit tähistab pinge redelit, sõltuvalt pingest üks või null. Väärtused on nüüd sõltuvalt sisendpingest 0-4095 (2^12-1). Jällegi, see otsene mõõtmine on tõenäoliselt see, mida soovite kasutada, kui teete midagi sellist, nagu [LDR-iga impulsside tuvastamine] (./../../ ajaveeb/esmaprojekt#Pulse-detection), kuid üsna sageli on tavalised voltid tore töötada. Ehkki pinge enda arvutamine on hea harjutus, sisaldab raamatukogu konversioonifunktsiooni, mis arvestab ka ADC mittelineaarsust, mis tähendab, et väljund on täpsem kui lihtsa lineaarse muundamise tõttu.

`` `CPP Title =" LDR -pinge lugemine "
tühine Loop () {
    ujuk ldr_voltage = analogreadvoltage (LDR);
    Seeria.print ("LDR väärtus:");
    Seeria.println (ldr_voltage);
    viivitus (200);
}
`` `

::: Märkus

See kood ühildub Arduino koodi jadaplotteriga. Proovige järele!

:::

::: Näpunäide [treening]

Raketist kasutatud CanSat tuvastamine võib olla kasulik, nii et näiteks langevarju saaks õigel ajal kasutusele võtta. Kas saate kirjutada programmi, mis tuvastab simuleeritud juurutamise? Simuleerige käivitamine, kattes kõigepealt LDR (raketi integreerimine) ja avastades selle (juurutamine). Programm võiks välja anda kasutuselevõtu terminali või pilgutada, et näidata, et juurutamine toimus.

:::

---

Järgmine õppetund on SD-CARD kasutamine mõõtmiste, seadete ja muu salvestamiseks!

[Klõpsake järgmise õppetunni saamiseks siin!] (./ õppetund5)