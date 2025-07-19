---
sidebar_position: 4
---

# Pinagens

Este artigo mostra os nomes dos pinos usados pelo processador no CanSat NeXT, bem como mostra quais pinos você pode usar para expandir seu projeto.

# Pinagem

A imagem abaixo mostra os pinos para usar o cabeçalho de extensão para adicionar eletrônicos externos à placa.

![Pinagem da placa CanSat NeXT](./img/pinout.png)

Aqui está a lista completa de pinos usados pela placa CanSat NeXT. O uso interno refere-se ao pino sendo usado para os recursos da placa, e a extensão refere-se aos pinos que foram roteados para a interface de extensão. Alguns pinos, aqueles para I2C e SPI, são usados tanto internamente quanto externamente. O nome da biblioteca refere-se a um nome de macro, que pode ser usado em vez do número do pino quando a biblioteca CanSatNeXT foi incluída.

| Número do Pino | Nome da Biblioteca | Nota                                                   | Interno/Externo     |
|----------------|--------------------|--------------------------------------------------------|---------------------|
|              0 | BOOT               |                                                        | Usado internamente  |
|              1 | USB_UART_TX        | Usado para USB                                         | Usado internamente  |
|              3 | USB_UART_RX        | Usado para USB                                         | Usado internamente  |
|              4 | SD_CS              | Seleção de chip do cartão SD                           | Usado internamente  |
|              5 | LED                | Pode ser usado para piscar o LED da placa              | Usado internamente  |
|             12 | GPIO12             |                                                        | Interface de extensão |
|             13 | MEAS_EN            | Ativar alto para habilitar LDR e termistor             | Usado internamente  |
|             14 | GPIO14             | Pode ser usado para verificar se o cartão SD está no lugar | Usado internamente  |
|             15 | GPIO15             |                                                        | Interface de extensão |
|             16 | GPIO16             | UART2 RX                                               | Interface de extensão |
|             17 | GPIO17             | UART2 TX                                               | Interface de extensão |
|             18 | SPI_CLK            | Usado pelo cartão SD, também disponível externamente   | Ambos               |
|             19 | SPI_MISO           | Usado pelo cartão SD, também disponível externamente   | Ambos               |
|             21 | I2C_SDA            | Usado pelos sensores da placa, também disponível externamente | Ambos               |
|             22 | I2C_SCL            | Usado pelos sensores da placa, também disponível externamente | Ambos               |
|             23 | SPI_MOSI           | Usado pelo cartão SD, também disponível externamente   | Ambos               |
|             25 | GPIO25             |                                                        | Interface de extensão |
|             26 | GPIO26             |                                                        | Interface de extensão |
|             27 | GPIO27             |                                                        | Interface de extensão |
|             32 | GPIO32             | ADC                                                    | Interface de extensão |
|             33 | GPIO33             | ADC                                                    | Interface de extensão |
|             34 | LDR                | ADC para o LDR da placa                                | Usado internamente  |
|             35 | NTC                | ADC para o termistor                                   | Usado internamente  |
|             36 | VDD                | ADC usado para monitorar a tensão de alimentação       | Usado internamente  |
|             39 | BATT               | ADC usado para monitorar a tensão da bateria           | Usado internamente  |