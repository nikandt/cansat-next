---
sidebar_position: 4
---

# Aula 4: Resistência não é Fútil

Até agora, focamos em usar dispositivos sensores digitais para obter valores diretamente em unidades SI. No entanto, dispositivos elétricos geralmente fazem a medição de forma indireta, e a conversão para as unidades desejadas é feita posteriormente. Isso era feito anteriormente pelos próprios dispositivos sensores (e pela biblioteca CanSat NeXT), mas muitos sensores que usamos são muito mais simples. Um tipo de sensores analógicos são os sensores resistivos, onde a resistência de um elemento sensor muda dependendo de algum fenômeno. Sensores resistivos existem para uma infinidade de quantidades - incluindo força, temperatura, intensidade de luz, concentrações químicas, pH, e muitos outros.

Nesta aula, usaremos o resistor dependente de luz (LDR) na placa CanSat NeXT para medir a intensidade da luz ambiente. Enquanto o termistor é usado de forma muito similar, isso será o foco de uma aula futura. As mesmas habilidades se aplicam diretamente ao uso do LDR e do termistor, assim como muitos outros sensores resistivos.

![Localização do LDR na placa](./../CanSat-hardware/img/LDR.png)

## Física dos Sensores Resistivos

Em vez de pular diretamente para o software, vamos dar um passo atrás e discutir como a leitura de um sensor resistivo geralmente funciona. Considere o esquema abaixo. A tensão em LDR_EN é de 3,3 volts (tensão de operação do processador), e temos dois resistores conectados em série no seu caminho. Um deles é o **LDR** (R402), enquanto o outro é um **resistor de referência** (R402). A resistência do resistor de referência é de 10 kilo-ohms, enquanto a resistência do LDR varia entre 5-300 kilo-ohms dependendo das condições de luz.

![Esquema do LDR](./img/LDR.png)

Como os resistores estão conectados em série, a resistência total é 

$$
R = R_{401} + R_{LDR},
$$

e a corrente através dos resistores é 

$$
I_{LDR} = \frac{V_{OP}}{R},
$$

onde $V_{OP}$ é a tensão operacional do MCU. Lembre-se de que a corrente tem que ser a mesma através de ambos os resistores. Portanto, podemos calcular a queda de tensão sobre o LDR como 

$$
V_{LDR} = R_{LDR} * I_{LDR} =  V_{OP} \frac{R_{LDR}}{R_{401} + R_{LDR}}.
$$

E essa queda de tensão é a tensão do LDR que podemos medir com um conversor analógico-digital. Normalmente, essa tensão pode ser diretamente correlacionada ou calibrada para corresponder a valores medidos, como por exemplo de tensão para temperatura ou brilho. No entanto, às vezes é desejável primeiro calcular a resistência medida. Se necessário, pode ser calculada como:

$$
R_{LDR} = \frac{V_{LDR}}{I_{LDR}} = \frac{V_{LDR}}{V_{OP}} (R_{401} + R_{LDR}) = R_{401} \frac{\frac{V_{LDR}}{V_{OP}}}{1-\frac{V_{LDR}}{V_{OP}}}
$$

## Lendo o LDR na Prática

Ler o LDR ou outros sensores resistivos é muito fácil, pois só precisamos consultar o conversor analógico-digital para a tensão. Vamos começar desta vez um novo Sketch Arduino do zero. Arquivo -> Novo Sketch.

Primeiro, vamos começar o sketch como antes, incluindo a biblioteca. Isso é feito no início do sketch. No setup, inicie o serial e inicialize o CanSat, assim como antes.

```Cpp title="Configuração Básica"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Um loop básico para ler o LDR não é muito mais complicado. Os resistores R401 e R402 já estão na placa, e só precisamos ler a tensão do nó comum deles. Vamos ler o valor do ADC e imprimi-lo.

```Cpp title="Loop Básico do LDR"
void loop() {
    int value = analogRead(LDR);
    Serial.print("Valor do LDR:");
    Serial.println(value);
    delay(200);
}
```

Com este programa, os valores reagem claramente às condições de iluminação. Obtemos valores mais baixos quando o LDR é exposto à luz e valores mais altos quando está mais escuro. No entanto, os valores estão na casa das centenas e milhares, não em uma faixa de tensão esperada. Isso ocorre porque agora estamos lendo a saída direta do ADC. Cada bit representa uma comparação de tensão sendo um ou zero dependendo da tensão. Os valores agora são de 0-4095 (2^12-1) dependendo da tensão de entrada. Novamente, essa medição direta é provavelmente o que você quer usar se estiver fazendo algo como [detectar pulsos com o LDR](./../../blog/first-project#pulse-detection), mas muitas vezes volts regulares são agradáveis de se trabalhar. Embora calcular a tensão você mesmo seja um bom exercício, a biblioteca inclui uma função de conversão que também considera a não-linearidade do ADC, o que significa que a saída é mais precisa do que uma conversão linear simples.

```Cpp title="Lendo a tensão do LDR"
void loop() {
    float LDR_voltage = analogReadVoltage(LDR);
    Serial.print("Valor do LDR:");
    Serial.println(LDR_voltage);
    delay(200);
}
```

:::note

Este código é compatível com o plotador serial no Arduino Code. Experimente!

:::

:::tip[Exercício]

Pode ser útil detectar o CanSat tendo sido liberado do foguete, para que, por exemplo, o paraquedas possa ser acionado no momento certo. Você pode escrever um programa que detecta uma simulação de liberação? Simule o lançamento cobrindo primeiro o LDR (integração do foguete) e depois descobrindo-o (liberação). O programa pode enviar a liberação para o terminal ou piscar um LED para mostrar que a liberação aconteceu.

:::

---

A próxima aula é sobre usar o cartão SD para armazenar medições, configurações e mais!

[Clique aqui para a próxima aula!](./lesson5)