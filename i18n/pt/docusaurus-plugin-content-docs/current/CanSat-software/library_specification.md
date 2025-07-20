---
sidebar_position: 1
---

# Especificação da Biblioteca

# Funções

Você pode usar todas as funcionalidades regulares do Arduino com o CanSat NeXT, bem como quaisquer bibliotecas do Arduino. As funções do Arduino podem ser encontradas aqui: https://www.arduino.cc/reference/en/.

A biblioteca CanSat NeXT adiciona várias funções fáceis de usar para utilizar os diferentes recursos a bordo, como sensores, rádio e o cartão SD. A biblioteca vem com um conjunto de exemplos de esboços que mostram como usar essas funcionalidades. A lista abaixo também mostra todas as funções disponíveis.

## Funções de Inicialização do Sistema

### CanSatInit

| Função               | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a inicialização foi bem-sucedida, ou um valor diferente de zero se houve um erro. |
| **Parâmetros**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Endereço MAC de 6 bytes compartilhado pelo satélite e pela estação terrestre. Este é um parâmetro opcional - quando não é fornecido, o rádio não é inicializado. Usado no exemplo de esboço: Todos |
| **Descrição**        | Este comando é encontrado no `setup()` de quase todos os scripts do CanSat NeXT. É usado para inicializar o hardware do CanSatNeXT, incluindo os sensores e o cartão SD. Além disso, se o `macAddress` for fornecido, ele inicia o rádio e começa a escutar mensagens recebidas. O endereço MAC deve ser compartilhado pela estação terrestre e pelo satélite. O endereço MAC pode ser escolhido livremente, mas existem alguns endereços não válidos, como todos os bytes sendo `0x00`, `0x01` e `0xFF`. Se a função de inicialização for chamada com um endereço não válido, ela reportará o problema para o Serial. |

### CanSatInit (especificação simplificada do endereço MAC)

| Função               | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a inicialização foi bem-sucedida, ou um valor diferente de zero se houve um erro. |
| **Parâmetros**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Último byte do endereço MAC, usado para diferenciar entre diferentes pares CanSat-GS. |
| **Descrição**        | Esta é uma versão simplificada do CanSatInit com endereço MAC, que define os outros bytes automaticamente para um valor seguro conhecido. Isso permite que os usuários diferenciem seus pares Transmissor-Receptor com apenas um valor, que pode ser de 0-255.|

### GroundStationInit

| Função               | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a inicialização foi bem-sucedida, ou um valor diferente de zero se houve um erro. |
| **Parâmetros**       |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | Endereço MAC de 6 bytes compartilhado pelo satélite e pela estação terrestre. |
| **Usado no exemplo de esboço** | Groundstation receive                                          |
| **Descrição**        | Este é um parente próximo da função CanSatInit, mas sempre requer o endereço MAC. Esta função apenas inicializa o rádio, não outros sistemas. A estação terrestre pode ser qualquer placa ESP32, incluindo qualquer placa de desenvolvimento ou até mesmo outra placa CanSat NeXT. |

### GroundStationInit (especificação simplificada do endereço MAC)

| Função               | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a inicialização foi bem-sucedida, ou um valor diferente de zero se houve um erro. |
| **Parâmetros**       |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Último byte do endereço MAC, usado para diferenciar entre diferentes pares CanSat-GS. |
| **Descrição**        | Esta é uma versão simplificada do GroundStationInit com endereço MAC, que define os outros bytes automaticamente para um valor seguro conhecido. Isso permite que os usuários diferenciem seus pares Transmissor-Receptor com apenas um valor, que pode ser de 0-255.|

## Funções IMU

### readAcceleration

| Função               | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a medição foi bem-sucedida.                           |
| **Parâmetros**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Endereço de uma variável float onde os dados do eixo x serão armazenados. |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a aceleração do IMU a bordo. Os parâmetros são endereços para variáveis float para cada eixo. O exemplo IMU mostra como usar esta função para ler a aceleração. A aceleração é retornada em unidades de G (9.81 m/s). |

### readAccelX

| Função               | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Retorna a aceleração linear no eixo X em unidades de G.                           |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a aceleração do IMU a bordo em um eixo específico. O exemplo IMU mostra como usar esta função para ler a aceleração. A aceleração é retornada em unidades de G (9.81 m/s). |

### readAccelY

| Função               | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Retorna a aceleração linear no eixo Y em unidades de G.                           |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a aceleração do IMU integrado em um eixo específico. O exemplo IMU mostra como usar esta função para ler a aceleração. A aceleração é retornada em unidades de G (9.81 m/s). |

### readAccelZ

| Função               | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Retorna a aceleração linear no eixo Z em unidades de G.                           |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a aceleração do IMU integrado em um eixo específico. O exemplo IMU mostra como usar esta função para ler a aceleração. A aceleração é retornada em unidades de G (9.81 m/s). |

### readGyro

| Função               | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a medição foi bem-sucedida.                           |
| **Parâmetros**       |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Endereço de uma variável float onde os dados do eixo x serão armazenados. |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a velocidade angular do IMU integrado. Os parâmetros são endereços para variáveis float para cada eixo. O exemplo IMU mostra como usar esta função para ler a velocidade angular. A velocidade angular é retornada em unidades mrad/s. |

### readGyroX

| Função               | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Retorna a velocidade angular no eixo X em unidades de mrad/s.                           |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a velocidade angular do IMU integrado em um eixo específico. Os parâmetros são endereços para variáveis float para cada eixo. A velocidade angular é retornada em unidades mrad/s. |

### readGyroY

| Função               | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Retorna a velocidade angular no eixo Y em unidades de mrad/s.                           |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a velocidade angular do IMU integrado em um eixo específico. Os parâmetros são endereços para variáveis float para cada eixo. A velocidade angular é retornada em unidades mrad/s. |

### readGyroZ

| Função               | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                          |
| **Valor de Retorno** | Retorna a velocidade angular no eixo Z em unidades de mrad/s.                           |
| **Usado no exemplo de esboço** | IMU                                                  |
| **Descrição**        | Esta função pode ser usada para ler a velocidade angular do IMU integrado em um eixo específico. Os parâmetros são endereços para variáveis float para cada eixo. A velocidade angular é retornada em unidades de mrad/s. |

## Funções do Barômetro

### readPressure

| Função               | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Pressão em mbar                                                   |
| **Parâmetros**       | Nenhum                                                             |
| **Usado no exemplo de esboço** | Baro                                                        |
| **Descrição**        | Esta função retorna a pressão conforme relatado pelo barômetro integrado. A pressão está em unidades de milibar. |

### readTemperature

| Função               | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Temperatura em Celsius                                            |
| **Parâmetros**       | Nenhum                                                             |
| **Usado no exemplo de esboço** | Baro                                                        |
| **Descrição**        | Esta função retorna a temperatura conforme relatado pelo barômetro integrado. A unidade da leitura é Celsius. Note que esta é a temperatura interna medida pelo barômetro, portanto pode não refletir a temperatura externa. |

## Funções do Cartão SD / Sistema de Arquivos

### SDCardPresent

| Função               | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `bool`                                                             |
| **Valor de Retorno** | Retorna true se detectar um cartão SD, false caso contrário.       |
| **Parâmetros**       | Nenhum                                                             |
| **Usado no exemplo de esboço** | SD_advanced                                                |
| **Descrição**        | Esta função pode ser usada para verificar se o cartão SD está mecanicamente presente. O conector do cartão SD possui um interruptor mecânico, que é lido quando esta função é chamada. Retorna true ou false dependendo se o cartão SD é detectado. |

### appendFile

| Function             | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | Retorna 0 se a escrita foi bem-sucedida.                           |
| **Parameters**       |                                                                    |
|                      | `String filename`: Endereço do arquivo a ser anexado. Se o arquivo não existir, ele será criado. |
|                      | `T data`: Dados a serem anexados ao final do arquivo.              |
| **Used in example sketch** | SD_write                                               |
| **Description**      | Esta é a função básica de escrita usada para armazenar leituras no cartão SD. |

### printFileSystem

| Function             | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       | Nenhum                                                             |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Esta é uma pequena função auxiliar para imprimir nomes de arquivos e pastas presentes no cartão SD. Pode ser usada no desenvolvimento. |

### newDir

| Function             | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Caminho do novo diretório. Se já existir, nada é feito. |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Usado para criar novos diretórios no cartão SD.                    |

### deleteDir

| Function             | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `void`                                                             |
| **Parameters**       |                                                                    |
|                      | `String path`: Caminho do diretório a ser deletado.                |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Usado para deletar diretórios no cartão SD.                        |

### fileExists

| Function             | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `bool`                                                             |
| **Return Value**     | Retorna true se o arquivo existir.                                 |
| **Parameters**       |                                                                    |
|                      | `String path`: Caminho para o arquivo.                             |
| **Used in example sketch** | SD_advanced                                                |
| **Description**      | Esta função pode ser usada para verificar se um arquivo existe no cartão SD. |

### fileSize

| Função               | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint32_t`                                                         |
| **Valor de Retorno** | Tamanho do arquivo em bytes.                                       |
| **Parâmetros**       |                                                                    |
|                      | `String path`: Caminho para o arquivo.                             |
| **Usado no exemplo de esboço** | SD_advanced                                                |
| **Descrição**        | Esta função pode ser usada para ler o tamanho de um arquivo no cartão SD.|

### writeFile

| Função               | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | Retorna 0 se a escrita foi bem-sucedida.                           |
| **Parâmetros**       |                                                                    |
|                      | `String filename`: Endereço do arquivo a ser escrito.              |
|                      | `T data`: Dados a serem escritos no arquivo.                      |
| **Usado no exemplo de esboço** | SD_advanced                                                |
| **Descrição**        | Esta função é semelhante ao `appendFile()`, mas sobrescreve dados existentes no cartão SD. Para armazenamento de dados, `appendFile` deve ser usado. Esta função pode ser útil para armazenar configurações, por exemplo.|

### readFile

| Função               | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `String`                                                           |
| **Valor de Retorno** | Todo o conteúdo do arquivo.                                        |
| **Parâmetros**       |                                                                    |
|                      | `String path`: Caminho para o arquivo.                             |
| **Usado no exemplo de esboço** | SD_advanced                                                |
| **Descrição**        | Esta função pode ser usada para ler todos os dados de um arquivo em uma variável. Tentar ler arquivos grandes pode causar problemas, mas é adequado para arquivos pequenos, como arquivos de configuração ou de definições.|

### renameFile

| Função               | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parâmetros**       |                                                                    |
|                      | `String oldpath`: Caminho original para o arquivo.                |
|                      | `String newpath`: Novo caminho do arquivo.                        |
| **Usado no exemplo de esboço** | SD_advanced                                                |
| **Descrição**        | Esta função pode ser usada para renomear ou mover arquivos no cartão SD.|

### deleteFile

| Função               | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parâmetros**       |                                                                    |
|                      | `String path`: Caminho do arquivo a ser deletado.                  |
| **Usado no exemplo de esboço** | SD_advanced                                                |
| **Descrição**        | Esta função pode ser usada para deletar arquivos do cartão SD.     |

## Funções de Rádio

### onDataReceived

| Função               | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parâmetros**       |                                                                    |
|                      | `String data`: Dados recebidos como uma String do Arduino.         |
| **Usado no exemplo de esboço** | Groundstation_receive                                      |
| **Descrição**        | Esta é uma função de callback que é chamada quando os dados são recebidos. O código do usuário deve definir esta função, e o CanSat NeXT irá chamá-la automaticamente quando os dados forem recebidos. |

### onBinaryDataReceived

| Função               | void onBinaryDataReceived(const uint8_t *data, uint16_t len)       |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parâmetros**       |                                                                    |
|                      | `const uint8_t *data`: Dados recebidos como um array de uint8_t.   |
|                      | `uint16_t len`: Comprimento dos dados recebidos em bytes.          |
| **Usado no exemplo de esboço** | Nenhum                                                   |
| **Descrição**        | Isto é similar à função `onDataReceived`, mas os dados são fornecidos como binário em vez de um objeto String. Isto é fornecido para usuários avançados que acham o objeto String limitante. |

### onDataSent

| Função               | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                             |
| **Parâmetros**       |                                                                    |
|                      | `const bool success`: Booleano indicando se os dados foram enviados com sucesso. |
| **Usado no exemplo de esboço** | Nenhum                                                   |
| **Descrição**        | Esta é outra função de callback que pode ser adicionada ao código do usuário, se necessário. Pode ser usada para verificar se a recepção foi reconhecida por outro rádio. |

### getRSSI

| Função               | int8_t getRSSI()                                                   |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `int8_t`                                                           |
| **Valor de Retorno** | RSSI da última mensagem recebida. Retorna 1 se nenhuma mensagem foi recebida desde o boot. |
| **Usado no exemplo de esboço** | Nenhum                                                   |
| **Descrição**        | Esta função pode ser usada para monitorar a força do sinal da recepção. Pode ser usada para testar antenas ou medir o alcance do rádio. O valor é expresso em [dBm](https://en.wikipedia.org/wiki/DBm), no entanto, a escala não é precisa. |

### sendData (variante String)

| Função               | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | 0 se os dados foram enviados (não indica reconhecimento).          |
| **Parâmetros**       |                                                                    |
|                      | `T data`: Dados a serem enviados. Qualquer tipo de dado pode ser usado, mas é convertido para uma string internamente.                  |
| **Usado no exemplo de sketch** | Send_data                                             |
| **Descrição**        | Esta é a função principal para enviar dados entre a estação terrestre e o satélite. Note que o valor de retorno não indica se os dados foram realmente recebidos, apenas que foram enviados. O callback `onDataSent` pode ser usado para verificar se os dados foram recebidos pela outra extremidade. |

### sendData (Variante Binária)

| Função               | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                          |
| **Valor de Retorno** | 0 se os dados foram enviados (não indica reconhecimento).          |
| **Parâmetros**       |                                                                    |
|                      | `T* data`: Dados a serem enviados.                    |
|                      | `uint16_t len`: Comprimento dos dados em bytes.                      |
| **Usado no exemplo de sketch** | Nenhum                                                 |
| **Descrição**        | Uma variante binária da função `sendData`, fornecida para usuários avançados que se sentem limitados pelo objeto String. |

### getRSSI

| Função               | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `int8_t`                                                          |
| **Valor de Retorno** | RSSI da última mensagem recebida. Retorna 1 se nenhuma mensagem foi recebida desde a inicialização.                           |
| **Usado no exemplo de sketch** | Nenhum                                                  |
| **Descrição**        | Esta função pode ser usada para monitorar a força do sinal da recepção. Pode ser usada para testar antenas ou medir o alcance do rádio. O valor é expresso em [dBm](https://en.wikipedia.org/wiki/DBm), no entanto, a escala não é precisa. 

### setRadioChannel

| Função               | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                          |
| **Valor de Retorno** | Nenhum                                                          |
| **Parâmetros**       | `uint8_t newChannel`: Número do canal Wi-Fi desejado (1–11). Qualquer valor acima de 11 será limitado a 11. |
| **Usado no exemplo de sketch** | Nenhum                                                      |
| **Descrição**        | Define o canal de comunicação ESP-NOW. O novo canal deve estar dentro do intervalo dos canais Wi-Fi padrão (1–11), que correspondem a frequências começando em 2.412 GHz com passos de 5 MHz. Canal 1 é 2.412, Canal 2 é 2.417 e assim por diante. Chame esta função antes da inicialização da biblioteca. O canal padrão é 1. |

### getRadioChannel

| Função               | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Tipo de Retorno**  | `uint8_t`                                                       |
| **Valor de Retorno** | O canal principal atual do Wi-Fi. Retorna 0 se houver um erro ao buscar o canal. |
| **Usado no exemplo de esboço** | Nenhum                                               |
| **Descrição**        | Recupera o canal principal do Wi-Fi atualmente em uso. Esta função funciona apenas após a inicialização da biblioteca. |

### printRadioFrequency

| Função               | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Tipo de Retorno**  | `void`                                                          |
| **Valor de Retorno** | Nenhum                                                          |
| **Usado no exemplo de esboço** | Nenhum                                               |
| **Descrição**        | Calcula e imprime a frequência atual em GHz com base no canal Wi-Fi ativo. Esta função funciona apenas após a inicialização da biblioteca. |


## Funções ADC

### adcToVoltage

| Função               | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Tensão convertida em volts.                                       |
| **Parâmetros**       |                                                                    |
|                      | `int value`: Leitura ADC a ser convertida para tensão.            |
| **Usado no exemplo de esboço** | AccurateAnalogRead                                    |
| **Descrição**        | Esta função converte uma leitura ADC para tensão usando um polinômio de terceira ordem calibrado para uma conversão mais linear. Note que esta função calcula a tensão no pino de entrada, então para calcular a tensão da bateria, você também precisa considerar a rede de resistores. |

### analogReadVoltage

| Função               | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Tipo de Retorno**  | `float`                                                            |
| **Valor de Retorno** | Tensão ADC em volts.                                              |
| **Parâmetros**       |                                                                    |
|                      | `int pin`: Pino a ser lido.                                       |
| **Usado no exemplo de esboço** | AccurateAnalogRead                                    |
| **Descrição**        | Esta função lê a tensão diretamente em vez de usar `analogRead` e converte a leitura para tensão internamente usando `adcToVoltage`. |