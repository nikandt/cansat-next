---
sidebar_position: 3
---

# Software CanSat NeXT

A maneira recomendada de usar o CanSat NeXT é com a biblioteca Arduino CanSat NeXT, disponível no gerenciador de bibliotecas do Arduino e no Github. Antes de instalar a biblioteca CanSat NeXT, você deve instalar o Arduino IDE e o suporte para placas ESP32.

## Começando

### Instalar Arduino IDE

Se ainda não o fez, baixe e instale o Arduino IDE a partir do site oficial https://www.arduino.cc/en/software.

### Adicionar suporte para ESP32

O CanSat NeXT é baseado no microcontrolador ESP32, que não está incluído na instalação padrão do Arduino IDE. Se você ainda não usou microcontroladores ESP32 com Arduino antes, o suporte para a placa precisa ser instalado primeiro. Isso pode ser feito no Arduino IDE em *Tools->board->Board Manager* (ou simplesmente pressione (Ctrl+Shift+B) em qualquer lugar). No gerenciador de placas, procure por ESP32 e instale o esp32 da Espressif.

### Instalar a biblioteca CanSat NeXT

A biblioteca CanSat NeXT pode ser baixada do Gerenciador de Bibliotecas do Arduino IDE em *Sketch > Include Libraries > Manage Libraries*.

![Adicionando novas Bibliotecas com Arduino IDE.](./img/LibraryManager_1.png)

*Fonte da imagem: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

Na barra de pesquisa do Gerenciador de Bibliotecas, digite "CanSatNeXT" e escolha "Install". Se o IDE perguntar se você também deseja instalar as dependências, clique em sim.

## Instalação manual

A biblioteca também está hospedada em seu próprio [repositório GitHub](https://github.com/netnspace/CanSatNeXT_library) e pode ser clonada ou baixada e instalada a partir do código-fonte.

Nesse caso, você precisa extrair a biblioteca e movê-la para o diretório onde o Arduino IDE possa encontrá-la. Você pode encontrar a localização exata em *File > Preferences > Sketchbook*.

![Adicionando novas Bibliotecas com Arduino IDE.](./img/LibraryManager_2.png)

*Fonte da imagem: Arduino Docs, https://docs.arduino.cc/software/ide-v1/tutorials/installing-libraries*

# Conectando ao PC

Após instalar a biblioteca de software CanSat NeXT, você pode conectar o CanSat NeXT ao seu computador. Caso não seja detectado, pode ser necessário instalar os drivers necessários primeiro. A instalação do driver é feita automaticamente na maioria dos casos, no entanto, em alguns PCs, precisa ser feita manualmente. Os drivers podem ser encontrados no site da Silicon Labs: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
Para ajuda adicional com a configuração do ESP32, consulte o seguinte tutorial: https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/establish-serial-connection.html

# Você está pronto para começar!

Agora você pode encontrar exemplos do CanSatNeXT no Arduino IDE em *File->Examples->CanSatNeXT*.