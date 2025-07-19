---
sidebar_position: 2
---

# Aula 2: Sentindo a Pressão

Nesta segunda aula, começaremos a usar os sensores na placa CanSat NeXT. Desta vez, vamos nos concentrar em medir a pressão atmosférica ao redor. Usaremos o barômetro [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) a bordo para ler a pressão, bem como para ler a temperatura do próprio barômetro.

Vamos começar pelo código do barômetro nos exemplos da biblioteca. No Arduino IDE, selecione Arquivo-> Exemplos->CanSat NeXT->Baro.

O início do programa parece bastante familiar em relação à última aula. Novamente, começamos incluindo a biblioteca CanSat NeXT, configurando a conexão serial e inicializando os sistemas CanSat NeXT.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Inicializa a serial
  Serial.begin(115200);

  // Inicializa os sistemas a bordo do CanSatNeXT
  CanSatInit();
}
```

A chamada da função `CanSatInit()` inicializa todos os sensores para nós, incluindo o barômetro. Assim, podemos começar a usá-lo na função loop.

As duas linhas abaixo são onde a temperatura e a pressão são realmente lidas. Quando as funções `readTemperature()` e `readPressure()` são chamadas, o processador envia um comando para o barômetro, que mede a pressão ou temperatura, e retorna o resultado para o processador.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

No exemplo, os valores são impressos, seguidos por um atraso de 1000 ms, para que o loop se repita aproximadamente uma vez por segundo.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Usando os dados

Também podemos usar os dados no código, em vez de apenas imprimi-los ou salvá-los. Por exemplo, poderíamos fazer um código que detecta se a pressão cai por uma certa quantidade e, por exemplo, acender o LED. Ou qualquer outra coisa que você gostaria de fazer. Vamos tentar acender o LED a bordo.

Para implementar isso, precisamos modificar ligeiramente o código no exemplo. Primeiro, vamos começar a rastrear o valor de pressão anterior. Para criar **variáveis globais**, ou seja, aquelas que não existem apenas enquanto estamos executando uma função específica, você pode simplesmente escrevê-las fora de qualquer função específica. A variável previousPressure é atualizada em cada ciclo da função loop, bem no final. Desta forma, mantemos o controle do valor antigo e podemos compará-lo com o valor mais recente.

Podemos usar uma instrução if para comparar os valores antigo e novo. No código abaixo, a ideia é que, se a pressão anterior for 0.1 hPa menor que o novo valor, acenderemos o LED, caso contrário, o LED permanecerá apagado.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // lê a temperatura para uma variável float
  float t = readTemperature();

  // lê a pressão para um float
  float p = readPressure(); 

  // Imprime a pressão e a temperatura
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Aguarda um segundo antes de iniciar o loop novamente
  delay(1000);

  previousPressure = p;
}
```

Se você carregar este loop modificado no CanSat NeXT, ele deve imprimir os valores das variáveis como antes, mas agora também procurar pela queda de pressão. A pressão atmosférica cai aproximadamente 0.12 hPa / metro ao subir, então se você tentar levantar rapidamente o CanSat NeXT um metro mais alto, o LED deve acender por um ciclo de loop (1 segundo) e depois apagar novamente. Provavelmente é melhor desconectar o cabo USB antes de tentar isso!

Você também pode tentar modificar o código. O que acontece se o atraso for alterado? E se a **histerese** de 0.1 hPa for alterada ou até mesmo totalmente removida?

---

Na próxima aula, teremos ainda mais atividade física, enquanto tentamos usar o outro sensor integrado - a unidade de medição inercial.

[Clique aqui para a próxima aula!](./lesson3)