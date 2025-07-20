---
sidebar_position: 9
---

# Lição 8: Siga o Fluxo

O tema desta lição é o controle de fluxo, ou como podemos gerenciar o que o processador faz em diferentes momentos. Até agora, a maioria dos nossos programas se concentrou em uma única tarefa, o que, embora simples, limita o potencial do sistema. Ao introduzir diferentes **estados** em nosso programa, podemos expandir suas capacidades.

Por exemplo, o programa poderia ter um estado de pré-lançamento, onde o satélite está aguardando a decolagem. Em seguida, ele poderia transitar para o modo de voo, onde lê dados de sensores e realiza sua missão principal. Finalmente, um modo de recuperação pode ser ativado, no qual o satélite envia sinais para ajudar na recuperação — piscando luzes, emitindo bipes ou executando quaisquer ações do sistema que tenhamos projetado.

O **gatilho** para mudar entre estados pode variar. Pode ser uma leitura de sensor, como uma mudança de pressão, um comando externo, um evento interno (como um temporizador) ou até mesmo uma ocorrência aleatória, dependendo do que é necessário. Nesta lição, vamos construir sobre o que aprendemos anteriormente usando um comando externo como gatilho.

## Controle de Fluxo com Gatilhos Externos

Primeiro, vamos modificar o código da estação terrestre para ser capaz de receber mensagens do monitor Serial, para que possamos enviar comandos personalizados quando necessário.

Como você pode ver, as únicas mudanças estão no loop principal. Primeiro, verificamos se há dados recebidos do Serial. Se não, nada é feito e o loop continua. No entanto, se houver dados, eles são lidos em uma variável, impressos para clareza e, em seguida, enviados via rádio para o satélite. Se você ainda tiver o programa da lição anterior carregado no satélite, pode experimentá-lo.

```Cpp title="Estação terrestre capaz de enviar comandos"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Received command: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Serial In - Fontes de Dados

Quando lemos dados do objeto `Serial`, estamos acessando os dados armazenados no buffer UART RX, que são transmitidos via conexão USB Virtual Serial. Na prática, isso significa que qualquer software capaz de se comunicar por uma porta serial virtual, como o Arduino IDE, programas de terminal ou vários ambientes de programação, pode ser usado para enviar dados para o CanSat.

Isso abre muitas possibilidades para controlar o CanSat a partir de programas externos. Por exemplo, podemos enviar comandos digitando-os manualmente, mas também escrever scripts em Python ou outras linguagens para automatizar comandos, tornando possível criar sistemas de controle mais avançados. Ao aproveitar essas ferramentas, você pode enviar instruções precisas, executar testes ou monitorar o CanSat em tempo real sem intervenção manual.

:::

Em seguida, vamos olhar para o lado do satélite. Como temos múltiplos estados no programa, ele fica um pouco mais longo, mas vamos dividi-lo passo a passo.

Primeiro, inicializamos os sistemas como de costume. Também há algumas variáveis globais, que colocamos no topo do arquivo para que seja fácil ver quais nomes estão sendo usados. O `LED_IS_ON` é familiar de nossos exemplos de código anteriores, e adicionalmente temos uma variável de estado global `STATE`, que armazena o... bem, estado.

```Cpp title="Inicialização"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Em seguida, no loop, simplesmente verificamos qual sub-rotina deve ser executada de acordo com o estado atual e chamamos sua função:

```Cpp title="Loop"
void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // modo desconhecido
    delay(1000);
  }
}
```

Neste caso particular, cada estado é representado por uma função separada que é chamada com base no estado. O conteúdo das funções não é realmente importante aqui, mas aqui estão elas:

```Cpp title="Sub-rotinas"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}
```

Há também uma pequena função auxiliar `blinkLED`, que ajuda a evitar a repetição de código ao lidar com a alternância do LED para nós.

Finalmente, o estado é alterado quando a estação terrestre nos diz para:

```Cpp title="Callback de comando recebido"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```

<details>
  <summary>Código completo</summary>
  <p>Aqui está o código completo para sua conveniência.</p>
```Cpp title="Satélite com múltiplos estados"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // modo desconhecido
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Com isso, agora podemos controlar o que o satélite está fazendo sem nem mesmo ter acesso físico a ele. Em vez disso, podemos simplesmente enviar um comando com a estação terrestre e o satélite faz o que queremos.

:::tip[Exercício]

Crie um programa que meça um sensor com uma frequência específica, que pode ser alterada com um comando remoto para qualquer valor. Em vez de usar sub-rotinas, tente modificar um valor de atraso diretamente com um comando.

Tente também torná-lo tolerante a entradas inesperadas, como "-1", "ABCDFEG" ou "".

Como exercício bônus, faça a nova configuração ser permanente entre reinicializações, para que quando o satélite for desligado e ligado novamente, ele retome a transmissão com a nova frequência em vez de reverter para a original. Como dica, revisitar a [lição 5](./lesson5.md) pode ser útil.

:::

---

Na próxima lição, tornaremos nosso armazenamento de dados, comunicação e manipulação significativamente mais eficientes e rápidos usando dados binários. Embora possa parecer abstrato no início, lidar com dados como binários em vez de números simplifica muitas tarefas, pois é a linguagem nativa do computador.

[Clique aqui para a próxima lição!](./lesson9)