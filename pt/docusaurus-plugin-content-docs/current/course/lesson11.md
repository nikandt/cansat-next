---
sidebar_position: 12
---

# Lição 11: O Satélite Precisa Crescer

Embora o CanSat NeXT já tenha muitos sensores e dispositivos integrados na própria placa do satélite, muitas missões emocionantes do CanSat exigem o uso de outros sensores externos, servos, câmeras, motores ou outros atuadores e dispositivos. Esta lição é um pouco diferente das anteriores, pois discutiremos a integração de vários dispositivos externos ao CanSat. Seu caso de uso real provavelmente não está considerado, mas talvez algo semelhante esteja. No entanto, se houver algo que você acha que deveria ser abordado aqui, por favor, envie seu feedback para mim em samuli@kitsat.fi.

Esta lição é um pouco diferente das anteriores, pois, embora todas as informações sejam úteis, você deve se sentir à vontade para pular para as áreas que são relevantes especificamente para o seu projeto e usar esta página como referência. No entanto, antes de continuar esta lição, por favor, consulte os materiais apresentados na seção [hardware](./../CanSat-hardware/CanSat-hardware.md) da documentação do CanSat NeXT, pois ela cobre muitas informações necessárias para integrar dispositivos externos.

## Conectando dispositivos externos

Existem duas ótimas maneiras de conectar dispositivos externos ao CanSat NeXT: Usando [Placas de Protótipo](../CanSat-accessories/CanSat-NeXT-perf.md) e PCBs personalizadas. Fazer seu próprio PCB é mais fácil (e barato) do que você pode imaginar, e para começar, um bom ponto de partida é este [tutorial de KiCAD](https://docs.kicad.org/8.0/en/getting_started_in_kicad/getting_started_in_kicad.html). Também temos um [modelo](../CanSat-hardware/mechanical_design.md#designing-a-custom-pcb) disponível para KiCAD, para que fazer suas placas no mesmo formato seja muito fácil.

Dito isso, para a maioria das missões do CanSat, soldar os sensores externos ou outros dispositivos a uma placa de protótipo é uma ótima maneira de criar pilhas de eletrônicos confiáveis e robustas.

Uma maneira ainda mais fácil de começar, especialmente ao prototipar pela primeira vez, é usar cabos jumper (também chamados de cabos Dupont ou fios de protoboard). Eles geralmente são fornecidos com os sensores, mas também podem ser comprados separadamente. Eles compartilham o mesmo passo de 0,1 polegada usado pelo cabeçalho de pinos de extensão, o que torna a conexão de dispositivos com cabos muito fácil. No entanto, embora os cabos sejam fáceis de usar, eles são bastante volumosos e pouco confiáveis. Por esse motivo, evitar cabos para o modelo de voo do seu CanSat é altamente recomendado.

## Compartilhando energia com os dispositivos

O CanSat NeXT usa 3,3 volts para todos os seus próprios dispositivos, razão pela qual é a única linha de tensão fornecida ao cabeçalho de extensão. Muitos sensores comerciais, especialmente os mais antigos, também suportam operação a 5 volts, pois essa é a tensão usada por Arduinos legados. No entanto, a grande maioria dos dispositivos também suporta operação diretamente através de 3,3 volts.

Para os poucos casos em que 5 volts são absolutamente necessários, você pode incluir um **conversor boost** na placa. Existem módulos prontos disponíveis, mas você também pode soldar diretamente muitos dispositivos na placa de protótipo. Dito isso, tente primeiro usar o dispositivo a partir de 3,3 volts, pois há uma boa chance de funcionar.

A corrente máxima recomendada da linha de 3,3 volts é de 300 mA, então para dispositivos que consomem muita corrente, como motores ou aquecedores, considere uma fonte de energia externa.

## Linhas de dados

O cabeçalho de extensão possui um total de 16 pinos, dos quais dois são reservados para linhas de terra e energia. O restante são diferentes tipos de entradas e saídas, a maioria das quais tem múltiplos usos possíveis. O pinout da placa mostra o que cada um dos pinos pode fazer.

![Pinout](../CanSat-hardware/img/pinout.png)

### GPIO

Todos os pinos expostos podem ser usados como entradas e saídas de propósito geral (GPIO), o que significa que você pode executar funções `digitalWrite` e `digitalRead` com eles no código.

### ADC

Os pinos 33 e 32 têm um conversor analógico para digital (ADC), o que significa que você pode usar `analogRead` (e `adcToVoltage`) para ler a tensão neste pino.

### DAC

Esses pinos podem ser usados para criar uma tensão específica na saída. Note que eles produzem a tensão desejada, no entanto, só podem fornecer uma quantidade muito pequena de corrente. Eles podem ser usados como pontos de referência para sensores, ou até mesmo como uma saída de áudio, no entanto, você precisará de um amplificador (ou dois). Você pode usar `dacWrite` para escrever a tensão. Há também um exemplo na biblioteca CanSat para isso.

### SPI

Interface Periférica Serial (SPI) é uma linha de dados padrão, frequentemente usada por sensores Arduino e dispositivos semelhantes. Um dispositivo SPI precisa de quatro pinos:

| **Nome do Pino** | **Descrição**                                               | **Uso**                                                        |
|------------------|-------------------------------------------------------------|----------------------------------------------------------------|
| **MOSI**         | Principal Saída Secundária Entrada                          | Dados enviados do dispositivo principal (por exemplo, CanSat) para o dispositivo secundário. |
| **MISO**         | Principal Entrada Secundária Saída                          | Dados enviados do dispositivo secundário de volta para o dispositivo principal. |
| **SCK**          | Relógio Serial                                              | Sinal de relógio gerado pelo dispositivo principal para sincronizar a comunicação. |
| **SS/CS**        | Seleção Secundária/Seleção de Chip                          | Usado pelo dispositivo principal para selecionar com qual dispositivo secundário se comunicar. |

Aqui, o principal é a placa CanSat NeXT, e o secundário é qualquer dispositivo com o qual você deseja se comunicar. Os pinos MOSI, MISO e SCK podem ser compartilhados por vários dispositivos secundários, no entanto, todos eles precisam de seu próprio pino CS. O pino CS pode ser qualquer pino GPIO, razão pela qual não há um dedicado no barramento.

(Nota: Materiais legados às vezes usam os termos "mestre" e "escravo" para se referir aos dispositivos principal e secundário. Esses termos agora são considerados desatualizados.)

Na placa CanSat NeXT, o cartão SD usa a mesma linha SPI que o cabeçalho de extensão. Ao conectar outro dispositivo SPI ao barramento, isso não importa. No entanto, se os pinos SPI forem usados como GPIO, o cartão SD é efetivamente desativado.

Para usar SPI, você geralmente precisa especificar quais pinos do processador são usados. Um exemplo poderia ser assim, onde **macros** incluídas na biblioteca CanSat são usadas para definir os outros pinos, e o pino 12 é definido como seleção de chip.

```Cpp title="Inicializando a linha SPI para um sensor"
adc.begin(SPI_CLK, SPI_MOSI, SPI_MISO, 12);
```

As macros `SPI_CLK`, `SPI_MOSI` e `SPI_MISO` são substituídas pelo compilador por 18, 23 e 19, respectivamente.

### I2C

Inter-Integrated Circuit é outro protocolo de barramento de dados popular, especialmente usado para pequenos sensores integrados, como o sensor de pressão e IMU na placa CanSat NeXT.

I2C é prático, pois requer apenas dois pinos, SCL e SDA. Também não há pino de seleção de chip separado, mas em vez disso, diferentes dispositivos são separados por diferentes **endereços**, que são usados para estabelecer comunicação. Desta forma, você pode ter vários dispositivos no mesmo barramento, desde que todos tenham um endereço único.

| **Nome do Pino** | **Descrição**          | **Uso**                                                     |
|------------------|------------------------|-------------------------------------------------------------|
| **SDA**          | Linha de Dados Serial  | Linha de dados bidirecional usada para comunicação entre dispositivos principal e secundário. |
| **SCL**          | Linha de Relógio Serial| Sinal de relógio gerado pelo dispositivo principal para sincronizar a transferência de dados com dispositivos secundários. |

O barômetro e o IMU estão no mesmo barramento I2C que o cabeçalho de extensão. Verifique os endereços desses dispositivos na página [Sensores a Bordo](../CanSat-hardware/on_board_sensors#inertial-measurement-unit). Semelhante ao SPI, você pode usar esses pinos para conectar outros dispositivos I2C, mas se eles forem usados como pinos GPIO, o IMU e o barômetro são desativados.

Na programação Arduino, o I2C às vezes é chamado de `Wire`. Ao contrário do SPI, onde o pinout é frequentemente especificado para cada sensor, o I2C é frequentemente usado no Arduino primeiro estabelecendo uma linha de dados e depois referenciando-a para cada sensor. Abaixo está um exemplo de como o barômetro é inicializado pela biblioteca CanSat NeXT:

```Cpp title="Inicializando a segunda linha serial"
Wire.begin(I2C_SDA, I2C_SCL);
initBaro(&Wire)
```

Então, primeiro um `Wire` é inicializado informando os pinos I2C corretos. As macros `I2C_SDA` e `I2C_SCL` definidas na biblioteca CanSat NeXT são substituídas pelo compilador por 22 e 21, respectivamente.

### UART

Receptor-transmissor assíncrono universal (UART) é de certa forma o protocolo de dados mais simples, pois simplesmente envia os dados como binário em uma frequência especificada. Como tal, é limitado à comunicação ponto a ponto, o que significa que você geralmente não pode ter vários dispositivos no mesmo barramento.

| **Nome do Pino** | **Descrição**          | **Uso**                                                     |
|------------------|------------------------|-------------------------------------------------------------|
| **TX**           | Transmitir             | Envia dados do dispositivo principal para o dispositivo secundário. |
| **RX**           | Receber                | Recebe dados do dispositivo secundário para o dispositivo principal. |

No CanSat, o UART no cabeçalho de extensão não é usado para mais nada. Há outra linha UART, no entanto, ela é usada para a comunicação USB entre o satélite e um computador. Isso é o que é usado ao enviar dados para o `Serial`.

A outra linha UART pode ser inicializada no código assim:

```Cpp title="Inicializando a segunda linha serial"
Serial2.begin(115200, SERIAL_8N1, 16, 17);
```

### PWM

Alguns dispositivos também usam [modulação por largura de pulso](https://en.wikipedia.org/wiki/Pulse-width_modulation) (PWM) como sua entrada de controle. Também pode ser usado para LEDs dimerizáveis ou para controlar a saída de energia em algumas situações, entre muitos outros casos de uso.

Com Arduino, apenas certos pinos podem ser usados como PWM. No entanto, como o CanSat NeXT é um dispositivo baseado em ESP32, todos os pinos de saída podem ser usados para criar uma saída PWM. O PWM é controlado com `analogWrite`.

## E quanto ao (meu caso de uso específico)?

Para a maioria dos dispositivos, você pode encontrar muitas informações na internet. Por exemplo, pesquise no Google o sensor específico que você possui e use estes documentos para modificar os exemplos que encontrar para uso com o CanSat NeXT. Além disso, os sensores e outros dispositivos têm **folhas de dados**, que devem ter muitas informações sobre como usar o dispositivo, embora possam ser um pouco difíceis de decifrar às vezes. Se você sentir que há algo que esta página deveria ter abordado, por favor, me avise em samuli@kitsat.fi.

Na próxima e última lição, discutiremos como preparar seu satélite para o lançamento.

[Clique aqui para a próxima lição!](./lesson12)