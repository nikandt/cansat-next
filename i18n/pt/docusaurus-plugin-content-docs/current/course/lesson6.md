---
sidebar_position: 6
---

# Aula 6: Ligando para Casa

Agora que fizemos medições e também as salvamos em um cartão SD, o próximo passo lógico é transmiti-las sem fio para a estação terrestre, o que possibilita um mundo completamente novo em termos de medições e experimentos que podemos realizar. Por exemplo, testar o voo em gravidade zero com o IMU teria sido muito mais interessante (e fácil de calibrar) se pudéssemos ver os dados em tempo real. Vamos ver como podemos fazer isso!

Nesta aula, enviaremos medições do CanSat NeXT para o receptor da estação terrestre. Mais tarde, também veremos como comandar o CanSat com mensagens enviadas pela estação terrestre.

## Antenas

Antes de começar esta aula, certifique-se de que você tem algum tipo de antena conectada à placa CanSat NeXT e à estação terrestre.

:::note

Você nunca deve tentar transmitir nada sem uma antena. Não só provavelmente não funcionará, como há a possibilidade de que a potência refletida danifique o transmissor.

:::

Como estamos usando a banda de 2,4 GHz, que é compartilhada por sistemas como Wi-Fi, Bluetooth, ISM, drones etc., há muitas antenas comerciais disponíveis. A maioria das antenas Wi-Fi realmente funciona muito bem com o CanSat NeXT, mas você frequentemente precisará de um adaptador para conectá-las à placa CanSat NeXT. Também testamos alguns modelos de adaptadores, que estão disponíveis na loja online.

Mais informações sobre antenas podem ser encontradas na documentação de hardware: [Comunicação e Antenas](./../CanSat-hardware/communication). Este artigo também possui [instruções](./../CanSat-hardware/communication#quarter-wave-antenna) sobre como construir sua própria antena a partir dos materiais do kit CanSat NeXT.

## Enviando Dados

Com a discussão sobre antenas fora do caminho, vamos começar a enviar alguns bits. Começaremos novamente olhando para a configuração, que na verdade tem uma diferença chave desta vez - adicionamos um número como um **argumento** ao comando `CanSatInit()`.

```Cpp title="Configuração para transmissão"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Passar um valor numérico para `CanSatInit()` informa ao CanSat NeXT que agora queremos usar o rádio. O número indica o valor do último byte do endereço MAC. Você pode pensar nisso como uma chave para sua rede específica - você só pode se comunicar com CanSats que compartilham a mesma chave. Este número deve ser compartilhado entre seu CanSat NeXT e sua estação terrestre. Você pode escolher seu número favorito entre 0 e 255. Eu escolhi 28, pois é [perfeito](https://en.wikipedia.org/wiki/Perfect_number).

Com o rádio inicializado, transmitir os dados é realmente simples. Ele opera exatamente como o `appendFile()` que usamos na última aula - você pode adicionar qualquer valor e ele o transmitirá em um formato padrão, ou você pode usar uma string formatada e enviar isso em vez disso.

```Cpp title="Transmitindo os dados"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Com este código simples, agora estamos transmitindo a medição do LDR quase 10 vezes por segundo. Em seguida, vamos ver como recebê-lo.

:::note

Aqueles familiarizados com programação de baixo nível podem se sentir mais confortáveis enviando os dados em formato binário. Não se preocupe, nós cobrimos isso. Os comandos binários estão listados na [Especificação da Biblioteca](./../CanSat-software/library_specification#sendData-binary).

:::

## Recebendo Dados

Este código agora deve ser programado em outro ESP32. Normalmente, é a segunda placa controladora incluída no kit, no entanto, praticamente qualquer outro ESP32 também funcionará - incluindo outro CanSat NeXT.

:::note

Se você estiver usando uma placa de desenvolvimento ESP32 como estação terrestre, lembre-se de pressionar o botão Boot na placa enquanto estiver gravando a partir do IDE. Isso define o ESP32 para o modo de inicialização correto para reprogramar o processador. O CanSat NeXT faz isso automaticamente, mas as placas de desenvolvimento geralmente não.

:::

O código de configuração é exatamente o mesmo de antes. Apenas lembre-se de mudar a chave do rádio para seu número favorito.

```Cpp title="Configuração para recepção"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

No entanto, depois disso, as coisas ficam um pouco diferentes. Fazemos uma função de loop completamente vazia! Isso porque na verdade não temos nada a fazer no loop, mas em vez disso, a recepção é feita através de **callbacks**.

```Cpp title="Configurando um callback"
void loop() {
  // Não temos nada a fazer no loop.
}

// Esta é uma função de callback. Ela é executada toda vez que o rádio recebe dados.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Enquanto a função `setup()` é executada apenas uma vez no início e `loop()` é executada continuamente, a função `onDataReceived()` é executada apenas quando o rádio recebe novos dados. Desta forma, podemos manipular os dados na função de callback. Neste exemplo, apenas os imprimimos, mas poderíamos também modificá-los da forma que quiséssemos.

Note que a função `loop()` não *precisa* estar vazia, você pode realmente usá-la para o que quiser com uma ressalva - atrasos devem ser evitados, pois a função `onDataReceived()` também não será executada até que o atraso termine.

Se agora você tiver ambos os programas rodando em placas diferentes ao mesmo tempo, deve haver uma quantidade considerável de medições sendo enviadas sem fio para o seu PC.

:::note

Para aqueles orientados a binário - você pode usar a função de callback onBinaryDataReceived.

:::

## Gravidade Zero em Tempo Real

Só por diversão, vamos repetir o experimento de gravidade zero, mas com rádios. O código do receptor pode permanecer o mesmo, assim como a configuração no código do CanSat.

Como lembrete, fizemos um programa na aula do IMU que detectava queda livre e acendia um LED nesse cenário. Aqui está o código antigo:

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

É tentador apenas adicionar o `sendData()` diretamente ao exemplo antigo, no entanto, precisamos considerar o tempo. Normalmente, não queremos enviar mensagens mais de ~20 vezes por segundo, mas por outro lado, queremos que o loop esteja rodando continuamente para que o LED ainda acenda.

Precisamos adicionar outro temporizador - desta vez para enviar dados a cada 50 milissegundos. O temporizador é feito comparando o tempo atual com o tempo atual da última vez que os dados foram enviados. A última vez é então atualizada cada vez que os dados são enviados. Veja também como a string é feita aqui. Ela também poderia ser transmitida em partes, mas desta forma é recebida como uma única mensagem, em vez de múltiplas mensagens.

```Cpp title="Detecção de queda livre + transmissão de dados"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


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

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Atualizar o último tempo de envio para o tempo atual
    lastSendTime = millis();
  }

}
```

O formato dos dados aqui é novamente compatível com o plotador serial - olhando para esses dados, fica bastante claro por que fomos capazes de detectar a queda livre anteriormente de forma tão limpa - os valores realmente caem para zero assim que o dispositivo é solto ou lançado.

---

Na próxima seção, faremos uma pequena pausa para revisar o que aprendemos até agora e garantir que estamos preparados para continuar construindo sobre esses conceitos.

[Clique aqui para a primeira revisão!](./review1)