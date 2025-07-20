---
sidebar_position: 6
---

# Design Mecânico

## Dimensões da PCB

![Dimensões da placa CanSat NeXT](./img/PCB_dimensions.png)

A placa principal do CanSat NeXT é construída em uma PCB de 70 x 50 x 1.6 mm, com eletrônicos na parte superior e bateria na parte inferior. A PCB possui pontos de montagem em cada canto, a 4 mm das bordas. Os pontos de montagem têm um diâmetro de 3.2 mm com uma área de pad aterrada de 6.4 mm, e são destinados para parafusos ou espaçadores M3. A área do pad também é grande o suficiente para acomodar uma porca M3. Além disso, a placa possui dois recortes trapezoidais de 8 x 1.5 mm nas laterais e uma área livre de componentes na parte superior no centro, para que uma abraçadeira ou outro suporte extra possa ser adicionado para as baterias durante operações de voo. Da mesma forma, dois slots de 8 x 1.3 mm podem ser encontrados próximos ao conector da antena MCU para que a antena possa ser fixada à placa com uma pequena abraçadeira ou pedaço de corda. O conector USB é ligeiramente intrusado na placa para evitar quaisquer extrusões. Um pequeno recorte é adicionado para acomodar certos cabos USB, apesar da intrusão. Os headers de extensão são headers fêmea padrão de 0.1 polegada (2.54 mm), e são posicionados de modo que o centro do furo de montagem esteja a 2 mm da borda longa da placa. O header mais próximo da borda curta está a 10 mm dela. A espessura da PCB é de 1.6 mm, e a altura das baterias a partir da placa é de aproximadamente 13.5 mm. Os headers têm aproximadamente 7.2 mm de altura. Isso faz com que a altura do volume de fechamento seja de aproximadamente 22.3 mm. Além disso, se espaçadores forem usados para empilhar placas compatíveis, os espaçadores, distanciadores ou outro sistema de montagem mecânica devem separar as placas em pelo menos 7.5 mm. Ao usar headers de pinos padrão, a separação recomendada entre as placas é de 12 mm.

Abaixo, você pode baixar um arquivo .step da perf-board, que pode ser usado para adicionar a PCB em um projeto CAD como referência, ou até mesmo como ponto de partida para uma placa modificada.

[Baixar arquivo step](/assets/3d-files/cansat.step)


## Projetando uma PCB Personalizada {#custom-PCB}

Se você deseja levar o design de seus eletrônicos para o próximo nível, deve considerar fazer uma PCB personalizada para os eletrônicos. KiCAD é um ótimo software gratuito que pode ser usado para projetar PCBs, e fabricá-las é surpreendentemente acessível.

Aqui estão recursos para começar com o KiCAD: https://docs.kicad.org/#_getting_started

Aqui está um template KiCAD para iniciar sua própria placa de circuito compatível com CanSat: [Baixar template KiCAD](/assets/kicad/Breakout-template.zip)