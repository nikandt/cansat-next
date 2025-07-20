---
sidebar_position: 13
---

# Lição 12: Pronto para Decolar?

Nesta última lição, falaremos sobre como preparar o satélite, a estação terrestre e a equipe para o lançamento. Após esta lição, também faremos uma *revisão* para verificar a prontidão para o voo, mas esta lição se concentra em maximizar as chances de uma missão bem-sucedida. Nesta lição, falaremos sobre a preparação dos seus eletrônicos mecanicamente e eletricamente, verificando o sistema de comunicação por rádio e, finalmente, discutindo algumas etapas úteis de preparação a serem feitas bem antes do evento de lançamento real.

Esta lição é novamente um pouco diferente, pois, em vez de explorar novos conceitos de programação, estamos discutindo como melhorar a confiabilidade do dispositivo na missão. Além disso, embora você provavelmente não tenha terminado de construir (ou definir) a missão do satélite se estiver agora passando pelo curso pela primeira vez, é bom ler os materiais desta página, considerar esses aspectos ao planejar seu dispositivo e missão, e voltar a eles ao realmente se preparar para o lançamento.

## Considerações mecânicas

Primeiramente, como discutido na lição anterior, a **pilha** de eletrônicos deve ser construída de forma que permaneça unida mesmo em vibrações e choques pesados. Uma boa maneira de projetar os eletrônicos é usar placas de perfuração, que são mantidas juntas por [standoffs](https://spacelabnextdoor.com/electronics/27-cansat-next-rp-sma-ufl) e conectadas eletricamente através de conectores ou com um cabo bem suportado. Finalmente, toda a pilha de eletrônicos deve ser fixada à estrutura do satélite de forma que não se mova. Uma conexão rígida com parafusos é sempre uma escolha sólida (trocadilho intencional), mas essa não é a única opção. Uma alternativa poderia ser projetar o sistema para quebrar no impacto, semelhante a uma [zona de deformação](https://en.wikipedia.org/wiki/Crumple_zone). Alternativamente, um sistema de montagem acolchoado com borracha, espuma ou sistema similar poderia reduzir os estresses experimentados pelos eletrônicos, ajudando a criar sistemas de uso múltiplo.

Em um CanSat típico, há alguns itens que são particularmente vulneráveis a problemas durante o lançamento ou pousos mais rápidos do que o esperado. Estes são as baterias, o cartão SD e a antena.

### Fixando as baterias

No CanSat NeXT, a placa é projetada de forma que uma abraçadeira de nylon possa ser fixada ao redor da placa para garantir que as baterias sejam mantidas no lugar durante a vibração. Caso contrário, elas tendem a saltar dos soquetes. Outra preocupação com as baterias é que algumas são mais curtas do que seria ideal para o suporte da bateria, e é possível que, em um choque particularmente alto, os contatos da bateria se dobrem sob o peso das baterias de forma que um contato seja perdido. Para mitigar isso, os contatos podem ser suportados adicionando um pedaço de abraçadeira de nylon, espuma ou outro preenchimento atrás dos contatos de mola. Em testes de queda acidentais (e intencionais), isso melhorou a confiabilidade, embora CanSat NeXTs integrados em CanSats bem construídos tenham sobrevivido a quedas de até 1000 metros (sem paraquedas) mesmo sem essas medidas de proteção. Uma maneira ainda melhor de suportar as baterias é projetar uma estrutura de suporte diretamente na estrutura do CanSat, de forma que ela suporte o peso das baterias no impacto em vez do suporte da bateria.

![CanSat com abraçadeira de nylon](./img/cansat_with_ziptie.png)

### Fixando o cabo da antena

O conector da antena é U.Fl, que é um tipo de conector classificado para automóveis. Eles lidam bem com vibrações e choques, apesar de não terem suportes mecânicos externos. No entanto, a confiabilidade pode ser melhorada fixando a antena com pequenas abraçadeiras de nylon. A placa CanSat NeXT possui pequenos slots próximos à antena para esse fim. Para manter a antena em uma posição neutra, um [suporte pode ser impresso](../CanSat-hardware/communication#quarter-wave-antenna) para ela.

![Antena fixada no lugar com um suporte impresso em 3D](../CanSat-hardware/img/qw_6.png)

### Fixando o cartão SD

O cartão SD pode sair do suporte em choques altos. Novamente, as placas sobreviveram a quedas e voos, mas a confiabilidade pode ser melhorada colando ou colando o cartão SD ao suporte. As placas CanSat NeXT mais recentes (≥1.02) estão equipadas com suportes de cartão SD de alta segurança para mitigar ainda mais esse problema.

## Teste de comunicações

Um dos detalhes mais vitais para garantir uma missão bem-sucedida é ter um link de rádio confiável. Há mais informações sobre a seleção e/ou construção das antenas na [seção de hardware](../CanSat-hardware/communication#antenna-options) da documentação. No entanto, independentemente da antena selecionada, o teste é uma parte vital de qualquer sistema de rádio.

O teste adequado da antena pode ser complicado e requer equipamentos especializados, como [VNAs](https://en.wikipedia.org/wiki/Network_analyzer_(electrical)), mas podemos fazer um teste funcional diretamente com o kit CanSat NeXT.

Primeiro, programe o satélite para enviar dados, por exemplo, uma leitura de dados uma vez por segundo. Em seguida, programe a estação terrestre para receber dados e imprimir os valores de **RSSI** (Indicador de força do sinal recebido), conforme fornecido pela função `getRSSI()`, que faz parte da biblioteca CanSat NeXT.

```Cpp title="Read RSSI"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onDataReceived(String data)
{
  int rssi = getRSSI();
  Serial.print("RSSI: ");
  Serial.println(rssi);
}
```

Este valor representa a **potência** elétrica real recebida pela estação terrestre através de sua antena quando recebe uma mensagem. O valor é expresso em [decibelmiliwatts](https://en.wikipedia.org/wiki/DBm). Uma leitura típica com uma antena funcionando em ambas as extremidades quando os dispositivos estão na mesma mesa é -30 dBm (1000 nanowatts), e deve cair rapidamente quando a distância aumenta. No espaço livre, segue aproximadamente a lei do inverso do quadrado, mas não exatamente devido a ecos, zonas de Fresnel e outras imperfeições. Com as configurações de rádio que o CanSat NeXT usa por padrão, o RSSI pode ser reduzido para aproximadamente -100 dBm (0.1 picowatt) e ainda assim alguns dados são transmitidos.

Isso geralmente corresponde a uma distância de aproximadamente um quilômetro ao usar as antenas monopolo, mas pode ser muito mais se a antena da estação terrestre tiver ganho significativo, o que adiciona diretamente à leitura em dBm.

## Testes de energia

É uma boa ideia medir o consumo de corrente do seu satélite usando um multímetro. É fácil também, basta remover uma das baterias e segurá-la manualmente de forma que você possa usar a medição de corrente do multímetro para conectar entre uma extremidade da bateria e o contato da bateria. Esta leitura deve estar na ordem de 130-200 mA se o rádio CanSat NeXT estiver ativo e não houver dispositivos externos. O consumo de corrente aumenta à medida que as baterias são descarregadas, pois mais corrente é necessária para manter a tensão em 3.3 volts a partir da tensão da bateria em queda.

Baterias AAA típicas têm capacidade de cerca de 1200 mAh, o que significa que o consumo de corrente do dispositivo deve ser inferior a 300 mA para garantir que as baterias durem toda a missão. Isso também é o motivo pelo qual é uma boa ideia ter múltiplos modos de operação se houver dispositivos que consomem muita corrente a bordo, pois eles podem ser ligados pouco antes do voo para garantir uma boa vida útil da bateria.

Embora a abordagem matemática para estimar a vida útil da bateria seja um bom começo, ainda é melhor fazer uma medição real da vida útil da bateria obtendo baterias novas e realizando uma missão simulada.

## Testes aeroespaciais

Na indústria aeroespacial, todo satélite passa por testes rigorosos para garantir que possa sobreviver às condições adversas de lançamento, espaço e, às vezes, reentrada. Embora os CanSats operem em um ambiente ligeiramente diferente, você ainda pode adaptar alguns desses testes para melhorar a confiabilidade. Abaixo estão alguns testes aeroespaciais comuns usados para CubeSats e pequenos satélites, juntamente com ideias de como você poderia implementar testes semelhantes para seu CanSat.

### Teste de vibração

O teste de vibração é usado em sistemas de pequenos satélites por dois motivos. O motivo principal é que o teste visa identificar frequências de ressonância da estrutura para garantir que a vibração do foguete não comece a ressoar em nenhuma estrutura do satélite, o que pode levar a uma falha nos sistemas do satélite. O motivo secundário também é relevante para sistemas CanSat, que é confirmar a qualidade da construção e garantir que o sistema sobreviverá ao lançamento do foguete. O teste de vibração do satélite é feito com bancadas de teste de vibração especializadas, mas o efeito pode ser simulado com soluções mais criativas também. Tente encontrar uma maneira de realmente sacudir o satélite (ou preferencialmente seu sobressalente) e veja se algo quebra. Como poderia ser melhorado?

### Teste de choque

Um primo dos testes de vibração, os testes de choque simulam a separação explosiva de estágios durante o lançamento do foguete. A aceleração de choque pode chegar a 100 Gs, o que pode facilmente quebrar sistemas. Isso poderia ser simulado com um teste de queda, mas considere como fazê-lo com segurança para que o satélite, você ou o chão não quebrem.

### Teste térmico

O teste térmico inclui expor todo o satélite aos extremos da faixa de operação planejada e também mover-se rapidamente entre essas temperaturas. No contexto do CanSat, isso poderia significar testar o satélite em um freezer, simulando um lançamento em um dia frio, ou em um forno levemente aquecido para simular um dia de lançamento quente. Tenha cuidado para que os eletrônicos, plásticos ou sua pele não sejam expostos diretamente a temperaturas extremas.

## Boas ideias gerais

Aqui estão algumas dicas adicionais para ajudar a garantir uma missão bem-sucedida. Elas variam de preparações técnicas a práticas organizacionais que melhorarão a confiabilidade geral do seu CanSat. Sinta-se à vontade para sugerir novas ideias para adicionar aqui através do canal usual (samuli@kitsat.fi).

- Considere ter uma lista de verificação para evitar esquecer algo pouco antes do lançamento
- Teste toda a sequência de voo antecipadamente em um voo simulado
- Teste o satélite também em condições ambientais semelhantes às esperadas no voo. Certifique-se de que o paraquedas também esteja OK com as temperaturas esperadas.
- Tenha baterias sobressalentes e pense em como elas são instaladas, se necessário
- Tenha um cartão SD sobressalente, eles falham às vezes
- Tenha um computador sobressalente e desative as atualizações no computador antes do lançamento.
- Tenha abraçadeiras de nylon, parafusos e o que mais você precisar para montar o satélite
- Tenha algumas ferramentas básicas à mão para ajudar na desmontagem e montagem
- Tenha antenas extras
- Você também pode ter várias estações terrestres operando ao mesmo tempo, que também podem ser usadas para triangular o satélite, especialmente se houver RSSI disponível.
- Tenha papéis claros para cada membro da equipe durante o lançamento, operações e recuperação.

---

Este é o fim das lições por enquanto. Na próxima página está uma revisão de prontidão para voo, que é uma prática que ajuda a garantir missões bem-sucedidas.

[Clique aqui para a revisão de prontidão para voo!](./review2)