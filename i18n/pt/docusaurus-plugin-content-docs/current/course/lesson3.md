---
sidebar_position: 3
---

# Lição 3: Sentindo a Rotação

O CanSat NeXT possui dois CIs de sensores na placa CanSat NeXT. Um deles é o barômetro que usamos na última lição, e o outro é a _unidade de medição inercial_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#IMU). O LSM6DS3 é uma IMU de 6 eixos, o que significa que é capaz de realizar 6 medições diferentes. Neste caso, é a aceleração linear em três eixos (x, y, z) e a velocidade angular em três eixos.

Nesta lição, vamos examinar o exemplo de IMU na biblioteca e também usar a IMU para fazer um pequeno experimento.

## Exemplo de Biblioteca

Vamos começar vendo como o exemplo da biblioteca funciona. Carregue-o a partir de Arquivo -> Exemplos -> CanSat NeXT -> IMU.

A configuração inicial é novamente a mesma - incluir a biblioteca, inicializar a serial e o CanSat. Então, vamos focar no loop. No entanto, o loop também parece muito familiar! Lemos os valores exatamente como na última lição, só que desta vez há muitos mais deles.

```Cpp title="Lendo valores da IMU"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Cada eixo é realmente lido com alguns centenas de microssegundos de diferença. Se você precisar que eles sejam atualizados simultaneamente, confira as funções [readAcceleration](./../CanSat-software/library_specification#readacceleration) e [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Após ler os valores, podemos imprimi-los como de costume. Isso poderia ser feito usando Serial.print e println exatamente como na última lição, mas este exemplo mostra uma maneira alternativa de imprimir os dados, com muito menos escrita manual.

Primeiro, um buffer de 128 caracteres é criado. Em seguida, este é inicializado para que cada valor seja 0, usando memset. Depois disso, os valores são escritos no buffer usando `snprintf()`, que é uma função que pode ser usada para escrever strings com um formato especificado. Finalmente, isso é apenas impresso com `Serial.println()`.

```Cpp title="Impressão Elegante"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Se o acima parecer confuso, você pode simplesmente usar o estilo mais familiar usando print e println. No entanto, isso se torna um pouco irritante quando há muitos valores para imprimir.

```Cpp title="Impressão Regular"
Serial.print("Ax:");
Serial.println(ay);
// etc
```

Finalmente, há novamente um pequeno atraso antes de iniciar o loop novamente. Isso está principalmente lá para garantir que a saída seja legível - sem um atraso, os números mudariam tão rapidamente que seria difícil lê-los.

A aceleração é lida em Gs, ou múltiplos de $9.81 \text{ m}/\text{s}^2$. A velocidade angular está em unidades de $\text{mrad}/\text{s}$.

:::tip[Exercício]

Tente identificar o eixo com base nas leituras!

:::

## Detecção de Queda Livre

Como exercício, vamos tentar detectar se o dispositivo está em queda livre. A ideia é que jogássemos a placa no ar, o CanSat NeXT detectaria a queda livre e acenderia o LED por alguns segundos após detectar um evento de queda livre, para que possamos saber que nossa verificação foi acionada mesmo após pegá-lo novamente.

Podemos manter a configuração como estava e apenas focar no loop. Vamos limpar a função de loop antiga e começar do zero. Só por diversão, vamos ler os dados usando o método alternativo.

```Cpp title="Ler Aceleração"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Vamos definir queda livre como um evento quando a aceleração total está abaixo de um valor limite. Podemos calcular a aceleração total a partir dos eixos individuais como

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

O que ficaria no código algo assim.

```Cpp title="Calculando aceleração total"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

E enquanto isso funcionaria, devemos notar que calcular a raiz quadrada é realmente lento computacionalmente, então devemos evitar fazê-lo se possível. Afinal, poderíamos simplesmente calcular

$$a^2 = a_x^2+a_y^2+a_z^2$$

e comparar isso a um valor limite predefinido.

```Cpp title="Calculando aceleração total ao quadrado"
float totalSquared = ax*ax+ay*ay+az*az;
```

Agora que temos um valor, vamos começar a controlar o LED. Poderíamos ter o LED aceso sempre que a aceleração total estiver abaixo de um valor limite, no entanto, seria mais fácil ler se o LED permanecesse aceso por um tempo após a detecção. Uma maneira de fazer isso é criar outra variável, vamos chamá-la de LEDOnTill, onde simplesmente escrevemos o tempo até onde queremos manter o LED aceso.

```Cpp title="Variável de Temporizador"
unsigned long LEDOnTill = 0;
```

Agora podemos atualizar o temporizador se detectarmos um evento de queda livre. Vamos usar um valor limite de 0.1 por enquanto. O Arduino fornece uma função chamada `millis()`, que retorna o tempo desde que o programa começou em milissegundos.

```Cpp title="Atualizando o temporizador"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Finalmente, podemos apenas verificar se o tempo atual é mais ou menos do que o especificado em `LEDOnTill`, e controlar o LED com base nisso. Aqui está como a nova função de loop se parece:

```Cpp title="Função de loop de detecção de queda livre"
unsigned long LEDOnTill = 0;

void loop() {
  // Ler Aceleração
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Calcular aceleração total (ao quadrado)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Atualizar o temporizador se detectarmos uma queda
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Controlar o LED com base no temporizador
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Testando este programa, você pode ver quão rápido ele agora reage, já que não temos um atraso no loop. O LED acende imediatamente após deixar a mão ao ser jogado.

:::tip[Exercícios]

1. Tente reintroduzir o atraso na função de loop. O que acontece?
2. Atualmente, não temos nenhuma impressão no loop. Se você apenas adicionar uma instrução de impressão ao loop, a saída será realmente difícil de ler e a impressão diminuirá significativamente o tempo do ciclo do loop. Você consegue pensar em uma maneira de imprimir apenas uma vez por segundo, mesmo que o loop esteja rodando continuamente? Dica: veja como o temporizador do LED foi implementado.
3. Crie seu próprio experimento, usando a aceleração ou a rotação para detectar algum tipo de evento.

:::

---

Na próxima lição, deixaremos o domínio digital e tentaremos usar um estilo diferente de sensor - um medidor de luz analógico.

[Clique aqui para a próxima lição!](./lesson4)