---
sidebar_position: 8
---

# Aula 7: Respondendo

Os CanSats são frequentemente programados para operar com uma lógica bastante simples - por exemplo, fazer medições a cada n milissegundos, salvar e transmitir os dados e repetir. Em contraste, enviar comandos para o satélite para mudar seu comportamento no meio da missão pode possibilitar muitas novas possibilidades. Talvez você queira ligar ou desligar um sensor, ou comandar o satélite para emitir um som para que você possa encontrá-lo. Há muitas possibilidades, mas talvez a mais útil seja a capacidade de ligar dispositivos que consomem muita energia no satélite apenas pouco antes do lançamento do foguete, dando a você muito mais flexibilidade e liberdade para operar após o satélite já ter sido integrado ao foguete.

Nesta aula, vamos tentar ligar e desligar o LED na placa do satélite via a estação terrestre. Isso representa um cenário onde o satélite não faz nada sem ser instruído a fazê-lo e, essencialmente, tem um sistema de comando simples.

:::info

## Callbacks de Software

A recepção de dados na biblioteca CanSat é programada como **callbacks**, que é uma função que é chamada... bem, de volta, quando um certo evento ocorre. Enquanto até agora em nossos programas o código sempre seguiu exatamente as linhas que escrevemos, agora parece ocasionalmente executar outra função no meio antes de continuar no loop principal. Isso pode parecer confuso, mas ficará bastante claro quando visto em ação.

:::

## Pisca-pisca Remoto

Para este exercício, vamos tentar replicar o piscar do LED da primeira aula, mas desta vez o LED é controlado remotamente.

Vamos primeiro olhar para o programa do lado do satélite. A inicialização é muito familiar agora, mas o loop é ligeiramente mais surpreendente - não há nada nele. Isso ocorre porque toda a lógica é tratada através da função de callback remotamente da estação terrestre, então podemos simplesmente deixar o loop vazio.

As coisas mais interessantes acontecem na função `onDataReceived(String data)`. Esta é a função de callback mencionada, que é programada na biblioteca para ser chamada toda vez que o rádio recebe qualquer dado. O nome da função é programado na biblioteca, então, desde que você use o mesmo nome exato como aqui, ela será chamada quando houver dados disponíveis.

Neste exemplo abaixo, os dados são impressos a cada vez apenas para visualizar o que está acontecendo, mas o estado do LED também é alterado a cada vez que uma mensagem é recebida, independentemente do conteúdo.

```Cpp title="Código do satélite para não fazer nada sem ser instruído"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

A variável `LED_IS_ON` é armazenada como uma variável global, o que significa que é acessível de qualquer lugar no código. Estas são tipicamente mal vistas na programação, e os iniciantes são ensinados a evitá-las em seus programas. No entanto, na programação _embarcada_ como estamos fazendo aqui, elas são na verdade uma maneira muito eficiente e esperada de fazer isso. Apenas tenha cuidado para não usar o mesmo nome em vários lugares!

:::

Se carregarmos isso na placa CanSat NeXT e a iniciarmos... Nada acontece. Isso é claro esperado, já que não temos nenhum comando chegando no momento.

Do lado da estação terrestre, o código não é muito complicado. Inicializamos o sistema e, em seguida, no loop enviamos uma mensagem a cada 1000 ms, ou seja, uma vez por segundo. No programa atual, a mensagem real não importa, mas apenas que algo está sendo enviado na mesma rede.

```Cpp title="Estação terrestre enviando mensagens"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Mensagem da estação terrestre");
}
```

Agora, quando programamos este código na estação terrestre (não se esqueça de pressionar o botão BOOT) e o satélite ainda está ligado, o LED no satélite começa a piscar, ligando e desligando após cada mensagem. A mensagem também é impressa no terminal.

:::tip[Exercício]

Carregue o trecho de código abaixo na placa da estação terrestre. O que acontece do lado do satélite? Você pode alterar o programa do satélite para que ele só reaja ligando o LED ao receber `LED ON` e desligando com `LED OFF`, e caso contrário apenas imprima o texto.

```Cpp title="Estação terrestre enviando mensagens"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Não faça nada, isso é apenas uma mensagem",
  "Olá para o CanSat!",
  "Woop woop",
  "Prepare-se!"
};

void loop() {
  delay(400);
  
  // Gera um índice aleatório para escolher uma mensagem
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Envia a mensagem selecionada aleatoriamente
  sendData(messages[randomIndex]);
}
```

:::

Note também que receber mensagens não bloqueia o envio delas, então poderíamos (e iremos) enviar mensagens de ambos os lados ao mesmo tempo. O satélite pode estar transmitindo dados continuamente, enquanto a estação terrestre pode continuar enviando comandos para o satélite. Se as mensagens forem simultâneas (dentro do mesmo milissegundo ou algo assim), pode haver um conflito e a mensagem não passar. No entanto, o CanSat NeXT retransmitirá automaticamente a mensagem se detectar um conflito. Portanto, apenas esteja ciente de que isso pode acontecer, mas que provavelmente passará despercebido.

---

Na próxima aula, expandiremos isso para realizar o **controle de fluxo** remotamente, ou mudar o comportamento do satélite com base nos comandos recebidos.

[Clique aqui para a próxima aula!](./lesson8)