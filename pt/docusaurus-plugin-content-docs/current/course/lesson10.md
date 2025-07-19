---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Aula 10: Dividir e Conquistar

À medida que nossos projetos se tornam mais detalhados, o código pode se tornar difícil de gerenciar, a menos que tenhamos cuidado. Nesta aula, vamos examinar algumas práticas que ajudarão a manter projetos maiores gerenciáveis. Isso inclui dividir o código em vários arquivos, gerenciar dependências e, finalmente, introduzir o controle de versão para rastrear mudanças, fazer backup do código e auxiliar na colaboração.

## Dividindo o código em vários arquivos

Em projetos pequenos, ter todo o código-fonte em um arquivo pode parecer bom, mas à medida que o projeto cresce, as coisas podem ficar confusas e mais difíceis de gerenciar. Uma boa prática é dividir seu código em diferentes arquivos com base na funcionalidade. Quando bem feito, isso também produz pequenos módulos que você pode reutilizar em diferentes projetos sem introduzir componentes desnecessários em outros projetos. Um grande benefício de múltiplos arquivos é que isso facilita a colaboração, pois outras pessoas podem trabalhar em outros arquivos, ajudando a evitar situações em que o código é difícil de mesclar.

O texto a seguir assume que você está usando o Arduino IDE 2. Usuários avançados podem se sentir mais à vontade com sistemas como o [Platformio](https://platformio.org/), mas aqueles de vocês já estarão familiarizados com esses conceitos.

No Arduino IDE 2, todos os arquivos na pasta do projeto são exibidos como abas no IDE. Novos arquivos podem ser criados diretamente no IDE ou através do seu sistema operacional. Existem três tipos diferentes de arquivos, **headers** `.h`, **arquivos de origem** `.cpp` e **arquivos Arduino** `.ino`.

Desses três, os arquivos Arduino são os mais fáceis de entender. Eles são simplesmente arquivos extras, que são copiados no final do seu script principal `.ino` durante a compilação. Assim, você pode facilmente usá-los para criar estruturas de código mais compreensíveis e ocupar todo o espaço necessário para uma função complicada sem tornar o arquivo de origem difícil de ler. A melhor abordagem geralmente é pegar uma funcionalidade e implementá-la em um arquivo. Assim, você poderia ter, por exemplo, um arquivo separado para cada modo de operação, um arquivo para transferências de dados, um arquivo para interpretação de comandos, um arquivo para armazenamento de dados e um arquivo principal onde você combina tudo isso em um script funcional.

Headers e arquivos de origem são um pouco mais especializados, mas felizmente funcionam da mesma forma que no C++ em outros lugares, então há muito material escrito sobre como usá-los, por exemplo [aqui](https://www.learncpp.com/cpp-tutorial/header-files/).

## Estrutura de exemplo

Como exemplo, vamos pegar o código confuso da [Aula 8](./lesson8.md) e refatorá-lo.

<details>
  <summary>Código original confuso da Aula 8</summary>
  <p>Aqui está o código completo para sua frustração.</p>
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
  Serial.println("Esperando...");
  sendData("Esperando...");
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

Isso nem é tão ruim, mas você pode ver como poderia se tornar seriamente difícil de ler se expandíssemos as funcionalidades ou adicionássemos novos comandos para interpretar. Em vez disso, vamos dividir isso em arquivos de código separados com base nas funcionalidades separadas.

Separei cada um dos modos de operação em seu próprio arquivo, adicionei um arquivo para interpretação de comandos e, finalmente, fiz um pequeno arquivo de utilidades para manter funcionalidades que são necessárias em muitos lugares. Esta é uma estrutura de projeto simples bastante típica, mas já torna o programa como um todo muito mais fácil de entender. Isso pode ser ainda mais auxiliado por uma boa documentação e fazendo um gráfico, por exemplo, que mostra como os arquivos se conectam entre si.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Esboço principal"
#include "CanSatNeXT.h"

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
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Modo de pré-lançamento"
void preLaunch() {
  Serial.println("Esperando...");
  sendData("Esperando...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Modo de voo"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Modo de recuperação"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Interpretação de comandos"
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
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Utilitários"
bool LED_IS_ON = false;

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
```
  </TabItem>

</Tabs>

Embora essa abordagem já seja muito melhor do que ter um único arquivo para tudo, ainda requer gerenciamento cuidadoso. Por exemplo, o **namespace** é compartilhado entre os diferentes arquivos, o que pode causar confusão em um projeto maior ou ao reutilizar código. Se houver funções ou variáveis com os mesmos nomes, o código não saberá qual usar, levando a conflitos ou comportamentos inesperados.

Além disso, essa abordagem não se presta bem à **encapsulamento**—que é fundamental para construir um código mais modular e reutilizável. Quando suas funções e variáveis existem todas no mesmo espaço global, torna-se mais difícil evitar que uma parte do código afete inadvertidamente outra. É aqui que técnicas mais avançadas, como namespaces, classes e programação orientada a objetos (OOP), entram em jogo. Estas estão fora do escopo deste curso, mas a pesquisa individual sobre esses tópicos é incentivada.

:::tip[Exercício]

Pegue um de seus projetos anteriores e dê-lhe uma reformulação! Divida seu código em vários arquivos e organize suas funções com base em seus papéis (por exemplo, gerenciamento de sensores, manipulação de dados, comunicação). Veja como seu projeto se torna muito mais limpo e fácil de gerenciar!

:::

## Controle de Versão

À medida que os projetos crescem — e especialmente quando várias pessoas estão trabalhando neles — é fácil perder o controle das mudanças ou sobrescrever (ou reescrever) código acidentalmente. É aí que entra o **controle de versão**. **Git** é a ferramenta padrão da indústria para controle de versão que ajuda a rastrear mudanças, gerenciar versões e organizar grandes projetos com múltiplos colaboradores.

Aprender Git pode parecer assustador e até redundante para projetos pequenos, mas posso garantir que você se agradecerá por aprendê-lo. Mais tarde, você se perguntará como conseguiu viver sem ele!

Aqui está um ótimo lugar para começar: [Introdução ao Git](https://docs.github.com/en/get-started/getting-started-with-git).

Existem vários serviços Git disponíveis, com os mais populares incluindo:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

O GitHub é uma escolha sólida devido à sua popularidade e à abundância de suporte disponível. De fato, esta página da web e as bibliotecas [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) estão hospedadas no GitHub.

O Git não é apenas conveniente — é uma habilidade essencial para qualquer pessoa que trabalhe profissionalmente em engenharia ou ciência. A maioria das equipes das quais você fará parte estará usando Git, então é uma boa ideia tornar seu uso um hábito familiar.

Mais tutoriais sobre Git:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)

:::tip[Exercício]

Configure um repositório Git para o seu projeto CanSat e envie seu código para o novo repositório. Isso ajudará você a desenvolver software tanto para o satélite quanto para a estação terrestre de uma maneira organizada e colaborativa.

:::

---

Na próxima aula, falaremos sobre várias maneiras de estender o CanSat com sensores externos e outros dispositivos.

[Clique aqui para a próxima aula!](./lesson11)