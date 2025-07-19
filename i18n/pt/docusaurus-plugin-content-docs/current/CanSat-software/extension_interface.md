---
sidebar_position: 2
---

# Interface de extensão

Dispositivos personalizados podem ser construídos e usados junto com o CanSat. Estes podem ser utilizados para criar projetos interessantes, para os quais você pode encontrar ideias em nosso [Blog](/blog).

A interface de extensão do CanSat possui uma linha UART livre, dois pinos ADC e 5 pinos de I/O digital livres. Além disso, linhas SPI e I2C estão disponíveis para a interface de extensão, embora sejam compartilhadas com o cartão SD e o conjunto de sensores, respectivamente.

O usuário também pode optar por usar os pinos UART2 e ADC como I/O digital, caso a comunicação serial ou a conversão de analógico para digital não sejam necessárias em sua solução.

| Número do pino | Nome do pino | Usar como    | Notas                     |
|----------------|--------------|--------------|---------------------------|
| 12             | GPIO12       | I/O Digital  | Livre                     |
| 15             | GPIO15       | I/O Digital  | Livre                     |
| 16             | GPIO16       | UART2 RX     | Livre                     |
| 17             | GPIO17       | UART2 TX     | Livre                     |
| 18             | SPI_CLK      | SPI CLK      | Uso conjunto com cartão SD|
| 19             | SPI_MISO     | SPI MISO     | Uso conjunto com cartão SD|
| 21             | I2C_SDA      | I2C SDA      | Uso conjunto com conjunto de sensores |
| 22             | I2C_SCL      | I2C SCL      | Uso conjunto com conjunto de sensores |
| 23             | SPI_MOSI     | SPI MOSI     | Uso conjunto com cartão SD|
| 25             | GPIO25       | I/O Digital  | Livre                     |
| 26             | GPIO26       | I/O Digital  | Livre                     |
| 27             | GPIO27       | I/O Digital  | Livre                     |
| 32             | GPIO32       | ADC          | Livre                     |
| 33             | GPIO33       | ADC          | Livre                     |

*Tabela: Tabela de consulta de pinos da interface de extensão. Nome do pino refere-se ao nome do pino da biblioteca.*

# Opções de comunicação

A biblioteca CanSat não inclui wrappers de comunicação para os dispositivos personalizados. Para comunicação UART, I2C e SPI entre o CanSat NeXT e seu dispositivo de carga útil personalizado, consulte as bibliotecas padrão do Arduino [UART](https://docs.arduino.cc/learn/communication/uart/), [Wire](https://docs.arduino.cc/learn/communication/wire/) e [SPI](https://docs.arduino.cc/learn/communication/spi/), respectivamente.

## UART

A linha UART2 é uma boa alternativa, pois serve como uma interface de comunicação não alocada para cargas úteis estendidas.

Para enviar dados através da linha UART, consulte o Arduino 

```
       CanSat NeXT
          ESP32                          Dispositivo do usuário
   +----------------+                 +----------------+
   |                |   TX (Transmitir) |                |
   |       TX  o----|---------------->| RX  (Receber)   |
   |                |                 |                |
   |       RX  o<---|<----------------| TX             |
   |                |   GND (Terra)   |                |
   |       GND  o---|-----------------| GND            |
   +----------------+                 +----------------+
```
*Imagem: Protocolo UART em ASCII*


## I2C

O uso de I2C é suportado, mas o usuário deve ter em mente que outro subsistema existe na linha.

Com múltiplos escravos I2C, o código do usuário precisa especificar qual escravo I2C o CanSat está usando em um determinado momento. Isso é distinguido com um endereço de escravo, que é um código hexadecimal único para cada dispositivo e pode ser encontrado na folha de dados do dispositivo do subsistema.

## SPI

O uso de SPI também é suportado, mas o usuário deve ter em mente que outro subsistema existe na linha.

Com SPI, a distinção do escravo é feita especificando um pino de seleção de chip. O usuário deve dedicar um dos pinos GPIO livres para ser um seletor de chip para seu dispositivo de carga útil estendida personalizada. O pino de seleção de chip do cartão SD é definido no arquivo de biblioteca ``CanSatPins.h`` como ``SD_CS``.

![Barramento I2C do CanSat NeXT.](./img/i2c_bus2.png)

*Imagem: o barramento I2C do CanSat NeXT apresentando vários subsistemas secundários, ou "escravos". Neste contexto, o conjunto de sensores é um dos subsistemas escravos.*

![Barramento SPI do CanSat NeXT.](./img/spi_bus.png)

*Imagem: a configuração do barramento SPI do CanSat NeXT quando dois subsistemas secundários, ou "escravos", estão presentes. Neste contexto, o cartão SD é um dos subsistemas escravos.*