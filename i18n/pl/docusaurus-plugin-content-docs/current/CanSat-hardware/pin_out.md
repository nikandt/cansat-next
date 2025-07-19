---
sidebar_position: 4
---

# Rozkład pinów

Ten artykuł pokazuje nazwy pinów używanych przez procesor w CanSat NeXT, a także pokazuje, jakie piny możesz użyć do rozszerzenia swojego projektu.

# Rozkład pinów

Poniższy obrazek pokazuje piny do użycia złącza rozszerzeń do dodawania zewnętrznej elektroniki do płytki.

![Rozkład pinów płytki CanSat NeXT](./img/pinout.png)

Oto pełna lista pinów używanych przez płytkę CanSat NeXT. Użycie wewnętrzne odnosi się do pinów używanych przez zasoby na płytce, a rozszerzenie odnosi się do pinów, które zostały poprowadzone do interfejsu rozszerzeń. Niektóre piny, te dla I2C i SPI, są używane zarówno wewnętrznie, jak i zewnętrznie. Nazwa biblioteki odnosi się do nazwy makra, które można użyć zamiast numeru pinu, gdy biblioteka CanSatNeXT została dołączona.

| Numer pinu | Nazwa biblioteki | Uwaga                                                   | Wewnętrzne/Zewnętrzne |
|------------|------------------|---------------------------------------------------------|-----------------------|
|          0 | BOOT             |                                                         | Używane wewnętrznie   |
|          1 | USB_UART_TX      | Używane dla USB                                         | Używane wewnętrznie   |
|          3 | USB_UART_RX      | Używane dla USB                                         | Używane wewnętrznie   |
|          4 | SD_CS            | Wybór układu karty SD                                   | Używane wewnętrznie   |
|          5 | LED              | Może być używane do migania diodą LED na płytce         | Używane wewnętrznie   |
|         12 | GPIO12           |                                                         | Interfejs rozszerzeń  |
|         13 | MEAS_EN          | Wysoki stan włącza LDR i termistor                      | Używane wewnętrznie   |
|         14 | GPIO14           | Może być używane do sprawdzenia obecności karty SD      | Używane wewnętrznie   |
|         15 | GPIO15           |                                                         | Interfejs rozszerzeń  |
|         16 | GPIO16           | UART2 RX                                                | Interfejs rozszerzeń  |
|         17 | GPIO17           | UART2 TX                                                | Interfejs rozszerzeń  |
|         18 | SPI_CLK          | Używane przez kartę SD, dostępne również zewnętrznie    | Oba                   |
|         19 | SPI_MISO         | Używane przez kartę SD, dostępne również zewnętrznie    | Oba                   |
|         21 | I2C_SDA          | Używane przez czujniki na płytce, dostępne również zewnętrznie | Oba                   |
|         22 | I2C_SCL          | Używane przez czujniki na płytce, dostępne również zewnętrznie | Oba                   |
|         23 | SPI_MOSI         | Używane przez kartę SD, dostępne również zewnętrznie    | Oba                   |
|         25 | GPIO25           |                                                         | Interfejs rozszerzeń  |
|         26 | GPIO26           |                                                         | Interfejs rozszerzeń  |
|         27 | GPIO27           |                                                         | Interfejs rozszerzeń  |
|         32 | GPIO32           | ADC                                                     | Interfejs rozszerzeń  |
|         33 | GPIO33           | ADC                                                     | Interfejs rozszerzeń  |
|         34 | LDR              | ADC dla LDR na płytce                                   | Używane wewnętrznie   |
|         35 | NTC              | ADC dla termistora                                      | Używane wewnętrznie   |
|         36 | VDD              | ADC używane do monitorowania napięcia zasilania         | Używane wewnętrznie   |
|         39 | BATT             | ADC używane do monitorowania napięcia baterii           | Używane wewnętrznie   |