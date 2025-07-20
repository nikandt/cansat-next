---
sidebar_position: 2
---

# Interfejs rozszerzeń

Urządzenia niestandardowe mogą być budowane i używane razem z CanSat. Mogą być one używane do tworzenia interesujących projektów, na które pomysły można znaleźć na naszym [Blogu](/blog).

Interfejs rozszerzeń CanSat oferuje wolną linię UART, dwa piny ADC oraz 5 wolnych cyfrowych pinów I/O. Dodatkowo, linie SPI i I2C są dostępne dla interfejsu rozszerzeń, chociaż są one współdzielone odpowiednio z kartą SD i zestawem czujników.

Użytkownik może również zdecydować się na użycie pinów UART2 i ADC jako cyfrowych I/O, w przypadku gdy komunikacja szeregowa lub konwersja analogowo-cyfrowa nie jest potrzebna w ich rozwiązaniu.

| Numer pinu | Nazwa pinu | Użycie jako  | Uwagi                       |
|------------|------------|--------------|-----------------------------|
| 12         | GPIO12     | Cyfrowe I/O  | Wolny                       |
| 15         | GPIO15     | Cyfrowe I/O  | Wolny                       |
| 16         | GPIO16     | UART2 RX     | Wolny                       |
| 17         | GPIO17     | UART2 TX     | Wolny                       |
| 18         | SPI_CLK    | SPI CLK      | Współużycie z kartą SD      |
| 19         | SPI_MISO   | SPI MISO     | Współużycie z kartą SD      |
| 21         | I2C_SDA    | I2C SDA      | Współużycie z zestawem czujników |
| 22         | I2C_SCL    | I2C SCL      | Współużycie z zestawem czujników |
| 23         | SPI_MOSI   | SPI MOSI     | Współużycie z kartą SD      |
| 25         | GPIO25     | Cyfrowe I/O  | Wolny                       |
| 26         | GPIO26     | Cyfrowe I/O  | Wolny                       |
| 27         | GPIO27     | Cyfrowe I/O  | Wolny                       |
| 32         | GPIO32     | ADC          | Wolny                       |
| 33         | GPIO33     | ADC          | Wolny                       |

*Tabela: Tabela wyszukiwania pinów interfejsu rozszerzeń. Nazwa pinu odnosi się do nazwy pinu w bibliotece.*

# Opcje komunikacji

Biblioteka CanSat nie zawiera wrapperów komunikacyjnych dla urządzeń niestandardowych. W przypadku komunikacji UART, I2C i SPI pomiędzy CanSat NeXT a Twoim niestandardowym urządzeniem ładunkowym, odwołaj się do domyślnych bibliotek Arduino [UART](https://docs.arduino.cc/learn/communication/uart/), [Wire](https://docs.arduino.cc/learn/communication/wire/) i [SPI](https://docs.arduino.cc/learn/communication/spi/).

## UART

Linia UART2 jest dobrą alternatywą, ponieważ służy jako nieprzydzielony interfejs komunikacyjny dla rozszerzonych ładunków.

Aby wysłać dane przez linię UART, odwołaj się do Arduino 

```
       CanSat NeXT
          ESP32                          Urządzenie użytkownika
   +----------------+                 +----------------+
   |                |   TX (Transmit) |                |
   |       TX  o----|---------------->| RX  (Receive)  |
   |                |                 |                |
   |       RX  o<---|<----------------| TX             |
   |                |   GND (Ground)  |                |
   |       GND  o---|-----------------| GND            |
   +----------------+                 +----------------+
```
*Obraz: Protokół UART w ASCII*


## I2C

Użycie I2C jest wspierane, ale użytkownik musi pamiętać, że na linii istnieje inny podsystem.

Przy wielu urządzeniach podrzędnych I2C, kod użytkownika musi określić, z którym urządzeniem podrzędnym I2C CanSat komunikuje się w danym momencie. Jest to rozróżniane za pomocą adresu podrzędnego, który jest unikalnym kodem szesnastkowym dla każdego urządzenia i można go znaleźć w arkuszu danych urządzenia podsystemu.

## SPI

Użycie SPI jest również wspierane, ale użytkownik musi pamiętać, że na linii istnieje inny podsystem.

W przypadku SPI, rozróżnienie urządzeń podrzędnych odbywa się poprzez określenie pinu wyboru układu. Użytkownik musi przeznaczyć jeden z wolnych pinów GPIO jako pin wyboru układu dla swojego niestandardowego rozszerzonego urządzenia ładunkowego. Pin wyboru układu karty SD jest zdefiniowany w pliku biblioteki ``CanSatPins.h`` jako ``SD_CS``.

![CanSat NeXT I2C bus.](./img/i2c_bus2.png)

*Obraz: Magistrala I2C CanSat NeXT z kilkoma podrzędnymi, lub "slave" podsystemami. W tym kontekście, zestaw czujników jest jednym z podrzędnych podsystemów.*

![CanSat NeXT I2C bus.](./img/spi_bus.png)

*Obraz: Konfiguracja magistrali SPI CanSat NeXT, gdy obecne są dwa podrzędne, lub "slave" podsystemy. W tym kontekście, karta SD jest jednym z podrzędnych podsystemów.*