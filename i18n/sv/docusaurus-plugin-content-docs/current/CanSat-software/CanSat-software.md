---
sidebar_position: 3
---

# CanSat NeXT-programvara

Det rekommenderade sättet att använda CanSat NeXT är med CanSat NeXT Arduino-biblioteket, tillgängligt från Arduino-bibliotekshanteraren och Github. Innan du installerar CanSat NeXT-biblioteket måste du installera Arduino IDE och ESP32-kortstöd.

## Komma igång

### Installera Arduino IDE

Om du inte redan har gjort det, ladda ner och installera Arduino IDE från den officiella webbplatsen https://www.arduino.cc/en/software.

### Lägg till ESP32-stöd

CanSat NeXT är baserad på ESP32-mikrokontrollern, som inte ingår i Arduino IDE:s standardinstallation. Om du inte har använt ESP32-mikrokontroller med Arduino tidigare, måste stödet för kortet installeras först. Det kan göras i Arduino IDE från *Verktyg->kort->Kortshanterare* (eller tryck bara på (Ctrl+Shift+B) var som helst). I kortshanteraren, sök efter ESP32 och installera esp32 av Espressif.

### Installera Cansat NeXT-biblioteket

CanSat NeXT-biblioteket kan laddas ner från Arduino IDE:s Bibliotekshanterare från *Skiss > Inkludera bibliotek > Hantera bibliotek*.

![Lägga till nya bibliotek med Arduino IDE.](./img/LibraryManager_1.png)

*Bildkälla: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

I sökfältet i Bibliotekshanteraren, skriv "CanSatNeXT" och välj "Installera". Om IDE:n frågar om du också vill installera beroenden, klicka ja.

## Manuell installation

Biblioteket finns också på sitt eget [GitHub-repository](https://github.com/netnspace/CanSatNeXT_library) och kan klonas eller laddas ner och installeras från källan.

I detta fall måste du extrahera biblioteket och flytta det till den katalog där Arduino IDE kan hitta det. Du kan hitta den exakta platsen i *Arkiv > Inställningar > Skissbok*.

![Lägga till nya bibliotek med Arduino IDE.](./img/LibraryManager_2.png)

*Bildkälla: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Ansluta till PC

Efter att ha installerat CanSat NeXT-programvarubiblioteket kan du ansluta CanSat NeXT till din dator. Om den inte upptäcks kan du behöva installera nödvändiga drivrutiner först. Drivrutinsinstallationen sker automatiskt i de flesta fall, men på vissa datorer måste det göras manuellt. Drivrutiner kan hittas på Silicon Labs webbplats: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
För ytterligare hjälp med att ställa in ESP32, se följande handledning: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Du är redo att börja!

Du kan nu hitta CanSatNeXT-exempel från Arduino IDE från *Arkiv->Exempel->CanSatNeXT*.