---
sidebar_position: 5
---

# Lição 5: Salvando Bits & Bytes

Às vezes, obter os dados diretamente para um PC não é viável, como quando estamos lançando o dispositivo, lançando-o com um foguete ou fazendo medições em locais de difícil acesso. Nesses casos, é melhor salvar os dados medidos em um cartão SD para processamento posterior. Além disso, o cartão SD também pode ser usado para armazenar configurações - por exemplo, poderíamos ter algum tipo de configuração de limite ou configurações de endereço armazenadas no cartão SD.

## Cartão SD na biblioteca CanSat NeXT

A biblioteca CanSat NeXT suporta uma ampla gama de operações com cartão SD. Pode ser usada para salvar e ler arquivos, mas também para criar diretórios e novos arquivos, movê-los ou até mesmo excluí-los. Tudo isso pode ser útil em várias circunstâncias, mas vamos manter o foco aqui nas duas coisas básicas - ler um arquivo e escrever dados em um arquivo.

:::note

Se você deseja controle total do sistema de arquivos, pode encontrar os comandos na [Especificação da Biblioteca](./../CanSat-software/library_specification.md#sdcardpresent) ou no exemplo da biblioteca "SD_advanced".

:::

Como exercício, vamos modificar o código da última lição para que, em vez de escrever as medições do LDR para o serial, salvemos no cartão SD.

Primeiro, vamos definir o nome do arquivo que usaremos. Vamos adicioná-lo antes da função de configuração como uma **variável global**.

```Cpp title="Configuração Modificada"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Agora que temos um caminho de arquivo, podemos escrever no cartão SD. Precisamos de apenas duas linhas para fazer isso. O melhor comando para usar para salvar dados de medição é `appendFile()`, que apenas leva o caminho do arquivo e escreve os novos dados no final do arquivo. Se o arquivo não existir, ele o cria. Isso torna o uso do comando muito fácil (e seguro). Podemos simplesmente adicionar os dados diretamente a ele e, em seguida, seguir com uma mudança de linha para que os dados sejam mais fáceis de ler. E é isso! Agora estamos armazenando as medições.

```Cpp title="Salvando dados do LDR no cartão SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("Valor do LDR:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Por padrão, o comando `appendFile()` armazena números de ponto flutuante com dois valores após o ponto decimal. Para uma funcionalidade mais específica, você poderia primeiro criar uma string no sketch e usar o comando `appendFile()` para armazenar essa string no cartão SD. Então, por exemplo:

```Cpp title="Salvando dados do LDR no cartão SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Aqui, a string final é feita primeiro, com `String(LDR_voltage, 6)` especificando que queremos 6 decimais após o ponto. Podemos usar a mesma string para imprimir e armazenar os dados. (Bem como transmitir via rádio)

## Lendo Dados

É bastante útil armazenar algo no cartão SD para uso futuro no programa também. Esses poderiam ser, por exemplo, configurações sobre o estado atual do dispositivo, para que, se o programa for reiniciado, possamos carregar o status atual novamente do cartão SD em vez de começar com valores padrão.

Para demonstrar isso, adicione no PC um novo arquivo ao cartão SD chamado "delay_time" e escreva um número no arquivo, como 200. Vamos tentar substituir o tempo de atraso definido estaticamente em nosso programa por uma configuração lida de um arquivo.

Vamos tentar ler o arquivo de configuração na configuração. Primeiro, vamos introduzir uma nova variável global. Dei a ela um valor padrão de 1000, para que, se não conseguirmos modificar o tempo de atraso, este seja agora o valor padrão.

Na configuração, devemos primeiro verificar se o arquivo existe. Isso pode ser feito usando o comando `fileExists()`. Se não existir, vamos apenas usar o valor padrão. Após isso, os dados podem ser lidos usando `readFile()`. No entanto, devemos notar que é uma string - não um inteiro como precisamos que seja. Então, vamos convertê-lo usando o comando Arduino `toInt()`. Finalmente, verificamos se a conversão foi bem-sucedida. Se não foi, o valor será zero, caso em que continuaremos usando o valor padrão.

```Cpp title="Lendo uma configuração na configuração"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Finalmente, não se esqueça de alterar o atraso no loop para usar a nova variável.

```Cpp title="Definindo dinamicamente o valor do atraso"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Agora você pode tentar mudar o valor no cartão SD, ou até mesmo remover o cartão SD, caso em que ele deve agora usar o valor padrão para o comprimento do atraso.

:::note

Para reescrever a configuração em seu programa, você pode usar o comando [writeFile](./../CanSat-software/library_specification.md#writefile). Funciona exatamente como [appendFile](./../CanSat-software/library_specification.md#appendfile), mas sobrescreve qualquer dado existente.

:::

:::tip[Exercício]

Continue a partir da sua solução para o exercício na lição 4, para que o estado seja mantido mesmo se o dispositivo for reiniciado. Ou seja, armazene o estado atual no cartão SD e leia-o na configuração. Isso simularia um cenário em que seu CanSat reinicia repentinamente em voo ou antes do voo, e com este programa você ainda teria um voo bem-sucedido.

:::

---

Na próxima lição, veremos o uso de rádio para transmitir dados entre processadores. Você deve ter algum tipo de antena no seu CanSat NeXT e na estação terrestre antes de começar esses exercícios. Se ainda não o fez, dê uma olhada no tutorial para construir uma antena básica: [Construindo uma antena](./../CanSat-hardware/communication#quarter-wave-antenna).

[Clique aqui para a próxima lição!](./lesson6)