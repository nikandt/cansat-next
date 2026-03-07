---
sidebar_position: 7
---

# Gennemgang 1: At samle det hele

På dette tidspunkt har du lært alle de nødvendige færdigheder til at implementere hovedmissionen for din CanSat. Selvom lektionerne ikke stopper her, vil de nu dykke ned i mere avancerede programmerings- og elektronikbegreber, som vil gøre dig i stand til at designe endnu mere kapable CanSats.

Før vi går videre, lad os tage et øjeblik til at gennemgå, hvad vi har lært indtil nu. I rumfartsingeniørarbejde er det sædvanligt at afholde en designgennemgang, før man går videre til næste fase—så lad os gøre det samme.


:::tip[Øvelse]

I professionel softwareudvikling begynder processen typisk med at definere klare **krav**, der specificerer, hvad softwaren skal opnå. Når kravene er fastlagt, implementeres softwaren for at opfylde disse specifikationer. Til sidst er det vigtigt at verificere, at softwaren fungerer som forventet og opfylder de definerede krav.

Lad os anvende denne tilgang på vores CanSat-projekt. Konkurrencereglerne opstiller nogle krav, som softwaren skal opfylde:

## Softwarekrav til primær mission

**Krav #1:**  
Mål lufttemperaturen mindst én gang i sekundet (≥ 1 Hz).

**Krav #2:**  
Mål lufttrykket mindst én gang i sekundet (≥ 1 Hz).

**Krav #3:**  
Gem de målte parametre lokalt.

**Krav #4:**  
Transmit de målte parametre til en jordstation.

Prøv at implementere softwaren, og tænk også over, hvordan du kan verificere, at kravene er opfyldt.

:::



I den første avancerede lektion vil vi udvide vores viden om radiotransmissioner for at etablere tovejskommunikation og styre satellitten i stedet for blot at modtage data på jordstationen. Dette er ikke nødvendigvis påkrævet for en vellykket CanSat-mission, men kan åbne nye interessante muligheder.  

[Klik her for den næste lektion!](./lesson7)