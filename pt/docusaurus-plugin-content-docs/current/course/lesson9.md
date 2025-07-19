---
sidebar_position: 10
---

# Aula 9: Uns e Zeros

Até agora, temos usado texto ao armazenar ou transmitir dados. Embora isso facilite a interpretação, também é ineficiente. Computadores usam internamente dados **binários**, onde os dados são armazenados como conjuntos de uns e zeros. Nesta aula, veremos maneiras de usar dados binários com o CanSat NeXT e discutiremos onde e por que pode ser útil fazê-lo.

:::info

## Diferentes tipos de dados

Em forma binária, todos os dados—sejam números, texto ou leituras de sensores—são representados como uma série de uns e zeros. Diferentes tipos de dados usam diferentes quantidades de memória e interpretam os valores binários de maneiras específicas. Vamos revisar brevemente alguns tipos de dados comuns e como eles são armazenados em binário:

- **Inteiro (int)**:  
  Inteiros representam números inteiros. Em um inteiro de 16 bits, por exemplo, 16 uns e zeros podem representar valores de \(-32.768\) a \(32.767\). Números negativos são armazenados usando um método chamado **complemento de dois**.

- **Inteiro sem sinal (uint)**:  
  Inteiros sem sinal representam números não negativos. Um inteiro sem sinal de 16 bits pode armazenar valores de \(0\) a \(65.535\), já que nenhum bit é reservado para o sinal.

- **Float**:  
  Números de ponto flutuante representam valores decimais. Em um float de 32 bits, parte dos bits representa o sinal, o expoente e a mantissa, permitindo que os computadores lidem com números muito grandes e muito pequenos. É essencialmente uma forma binária da [notação científica](https://en.wikipedia.org/wiki/Scientific_notation).

- **Caracteres (char)**:  
  Caracteres são armazenados usando esquemas de codificação como **ASCII** ou **UTF-8**. Cada caractere corresponde a um valor binário específico (por exemplo, 'A' em ASCII é armazenado como `01000001`).

- **Strings**:  
  Strings são simplesmente coleções de caracteres. Cada caractere em uma string é armazenado em sequência como valores binários individuais. Por exemplo, a string `"CanSat"` seria armazenada como uma série de caracteres como `01000011 01100001 01101110 01010011 01100001 01110100` (cada um representando 'C', 'a', 'n', 'S', 'a', 't'). Como você pode ver, representar números como strings, como temos feito até agora, é menos eficiente em comparação com armazená-los como valores binários.

- **Arrays e `uint8_t`**:  
  Ao trabalhar com dados binários, é comum usar um array de `uint8_t` para armazenar e manipular dados brutos de bytes. O tipo `uint8_t` representa um inteiro sem sinal de 8 bits, que pode conter valores de 0 a 255. Como cada byte consiste em 8 bits, este tipo é bem adequado para armazenar dados binários. Arrays de `uint8_t` são frequentemente usados para criar buffers de bytes para armazenar sequências de dados binários brutos (por exemplo, pacotes). Algumas pessoas preferem `char` ou outras variáveis, mas não importa realmente qual é usado, desde que a variável tenha comprimento de 1 byte.
:::

## Transmitindo dados binários

Vamos começar carregando um programa simples no CanSat e focar mais no lado da estação terrestre. Aqui está um código simples que transmite uma leitura em formato binário:

```Cpp title="Transmitir dados LDR como binário"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

O código parece muito familiar, mas o `sendData` agora leva dois argumentos em vez de apenas um - primeiro, o **endereço de memória** dos dados a serem transmitidos e, em seguida, o **comprimento** dos dados a serem transmitidos. Neste caso simplificado, usamos apenas o endereço e o comprimento da variável `LDR_voltage`.

Se você tentar receber isso com o código típico da estação terrestre, ele apenas imprimirá caracteres sem sentido, pois está tentando interpretar os dados binários como se fosse uma string. Em vez disso, teremos que especificar para a estação terrestre o que os dados incluem.

Primeiro, vamos verificar qual é o comprimento dos dados que estamos realmente recebendo.

```Cpp title="Verificar comprimento dos dados recebidos"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Recebido ");
  Serial.print(len);
  Serial.println(" bytes");
}
```

Toda vez que o satélite transmite, recebemos 4 bytes na estação terrestre. Como estamos transmitindo um float de 32 bits, isso parece correto.

Para ler os dados, temos que pegar o buffer de dados binários do fluxo de entrada e copiar os dados para uma variável adequada. Para este caso simples, podemos fazer isso:

```Cpp title="Armazenar os dados em uma variável"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Recebido ");
  Serial.print(len);
  Serial.println(" bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Dados: ");
  Serial.println(LDR_reading);
}
```

Primeiro, introduzimos a variável `LDR_reading` para armazenar os dados que *sabemos* que temos no buffer. Em seguida, usamos `memcpy` (cópia de memória) para copiar os dados binários do buffer `data` para o **endereço de memória** de `LDR_reading`. Isso garante que os dados sejam transferidos exatamente como foram armazenados, mantendo o mesmo formato que no satélite.

Agora, se imprimirmos os dados, é como se os tivéssemos lido diretamente no lado da GS. Não é mais texto como costumava ser, mas os mesmos dados que lemos no lado do satélite. Agora podemos facilmente processá-los no lado da GS como quisermos.

## Criando nosso próprio protocolo

O verdadeiro poder da transferência de dados binários torna-se evidente quando temos mais dados para transmitir. No entanto, ainda precisamos garantir que o satélite e a estação terrestre concordem sobre qual byte representa o quê. Isso é chamado de **protocolo de pacote**.

Um protocolo de pacote define a estrutura dos dados sendo transmitidos, especificando como empacotar várias peças de dados em uma única transmissão e como o receptor deve interpretar os bytes recebidos. Vamos construir um protocolo simples que transmite várias leituras de sensores de forma estruturada.

Primeiro, vamos ler todos os canais do acelerômetro e giroscópio e criar o **pacote de dados** a partir das leituras.

```Cpp title="Transmitir dados LDR como binário"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Criar um array para armazenar os dados
  uint8_t packet[24];

  // Copiar dados para o pacote
  memcpy(&packet[0], &ax, 4);  // Copiar acelerômetro X para bytes 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copiar giroscópio Z para bytes 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Aqui, primeiro lemos os dados como na Aula 3, mas depois **codificamos** os dados em um pacote de dados. Primeiro, o buffer real é criado, que é apenas um conjunto vazio de 24 bytes. Cada variável de dados pode então ser escrita neste buffer vazio com `memcpy`. Como estamos usando `float`, os dados têm comprimento de 4 bytes. Se você não tiver certeza sobre o comprimento de uma variável, sempre pode verificá-lo com `sizeof(variable)`.

:::tip[Exercício]

Crie um software de estação terrestre para interpretar e imprimir os dados do acelerômetro e giroscópio.

:::

## Armazenando dados binários no cartão SD

Escrever dados como binário no cartão SD pode ser útil ao trabalhar com grandes quantidades de dados, pois o armazenamento binário é mais compacto e eficiente do que o texto. Isso permite que você salve mais dados com menos espaço de armazenamento, o que pode ser útil em sistemas com restrições de memória.

No entanto, usar dados binários para armazenamento vem com compensações. Ao contrário dos arquivos de texto, os arquivos binários não são legíveis por humanos, o que significa que não podem ser facilmente abertos e entendidos com editores de texto padrão ou importados em programas como o Excel. Para ler e interpretar dados binários, é necessário desenvolver software ou scripts especializados (por exemplo, em Python) para analisar corretamente o formato binário.

Para a maioria das aplicações, onde a facilidade de acesso e flexibilidade são importantes (como analisar dados em um computador posteriormente), formatos baseados em texto como CSV são recomendados. Esses formatos são mais fáceis de trabalhar em uma variedade de ferramentas de software e oferecem mais flexibilidade para análise rápida de dados.

Se você estiver comprometido em usar armazenamento binário, dê uma olhada mais profunda "sob o capô" revisando como a biblioteca CanSat lida com o armazenamento de dados internamente. Você pode usar diretamente métodos de manipulação de arquivos no estilo C para gerenciar arquivos, fluxos e outras operações de baixo nível de forma eficiente. Mais informações também podem ser encontradas na [biblioteca de cartão SD do Arduino](https://docs.arduino.cc/libraries/sd/).

---

Nossos programas começam a ficar cada vez mais complicados, e há também alguns componentes que seria bom reutilizar em outros lugares. Para evitar tornar nosso código difícil de gerenciar, seria bom poder compartilhar alguns componentes em diferentes arquivos e manter o código legível. Vamos ver como isso pode ser realizado com o Arduino IDE.

[Clique aqui para a próxima aula!](./lesson10)