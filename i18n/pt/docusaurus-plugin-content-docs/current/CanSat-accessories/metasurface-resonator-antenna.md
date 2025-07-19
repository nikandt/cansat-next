---
sidebar_position: 2
---

# Antena Ressoadora de Metassuperfície

A Antena Ressoadora de Metassuperfície CanSat NeXT é um módulo de antena externa, que pode ser usado na estação terrestre para aumentar o alcance da comunicação e também tornar a comunicação mais confiável.

![Antena Ressoadora de Metassuperfície CanSat NeXT](./img/resonator_antenna.png)

A [antena do kit](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) do CanSat NeXT foi usada com sucesso em missões CanSat onde o CanSat foi lançado a uma altitude de 1 quilômetro. No entanto, nessas distâncias, a antena monopolo começa a estar no limite do alcance operacional e também pode perder o sinal às vezes devido a erros de polarização decorrentes da polarização linear da antena monopolo. O kit de antena ressoadora de metassuperfície é projetado para permitir uma operação mais confiável nessas condições extremas e também permitir operação com alcances significativamente mais longos.

A antena ressoadora de metassuperfície consiste em duas placas. A antena principal está na placa do radiador, onde uma antena do tipo slot foi gravada no PCB. Esta placa por si só fornece aproximadamente 3 dBi de ganho e apresenta [polarização circular](https://en.wikipedia.org/wiki/Circular_polarization), o que na prática significa que a intensidade do sinal não depende mais da orientação da antena do satélite. Portanto, esta placa pode ser usada como uma antena em si, se uma *largura de feixe* mais ampla for desejável.

A outra placa, onde a antena recebe seu nome, é a característica especial deste kit de antena. Deve ser colocada a 10-15 mm da primeira placa e apresenta uma matriz de elementos ressoadores. Os elementos são energizados pela antena slot abaixo deles, e isso, por sua vez, torna a antena mais *diretiva*. Com esta adição, o ganho dobra para 6 dBi.

A imagem abaixo mostra o *coeficiente de reflexão* da antena medido com um analisador vetorial de redes (VNA). O gráfico mostra as frequências nas quais a antena é capaz de transmitir energia. Embora a antena tenha um desempenho de banda larga bastante bom, o gráfico mostra uma boa correspondência de impedância na faixa de frequência operacional de 2400-2490 MHz. Isso significa que nessas frequências, a maior parte da potência é transmitida como ondas de rádio em vez de ser refletida de volta. Os valores de reflexão mais baixos no centro da banda estão em torno de -18,2 dB, o que significa que apenas 1,51% da potência foi refletida de volta da antena. Embora seja mais difícil de medir, simulações sugerem que 3% adicionais da potência de transmissão são convertidos em calor na própria antena, mas os outros 95,5% - a eficiência de radiação da antena - são irradiados como radiação eletromagnética.

![Antena Ressoadora de Metassuperfície CanSat NeXT](./img/antenna_s11.png)

Como mencionado anteriormente, o ganho da antena é em torno de 6 dBi. Isso pode ser ainda mais aumentado com o uso de um *refletor* atrás da antena, que reflete as ondas de rádio de volta para a antena, melhorando a diretividade. Embora um disco parabólico fosse um refletor ideal, até mesmo um plano de metal plano pode ser muito útil para aumentar o desempenho da antena. De acordo com simulações e testes de campo, um plano de metal - como uma chapa de aço - colocado a 50-60 mm atrás da antena aumenta o ganho para aproximadamente 10 dBi. O plano de metal deve ter pelo menos 200 x 200 mm de tamanho - planos maiores devem ser melhores, mas apenas marginalmente. No entanto, não deve ser muito menor do que isso. O plano idealmente seria de metal sólido, como uma chapa de aço, mas até mesmo uma malha de arame funcionará, desde que os buracos sejam menores que 1/10 do comprimento de onda (~1,2 cm) em tamanho.