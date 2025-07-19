---
sidebar_position: 10
---

# Lekcja 9: Jedynki i Zera

Do tej pory używaliśmy tekstu do przechowywania lub przesyłania danych. Choć to ułatwia interpretację, jest również nieefektywne. Komputery wewnętrznie używają danych **binarnych**, gdzie dane są przechowywane jako zestawy jedynek i zer. W tej lekcji przyjrzymy się sposobom używania danych binarnych z CanSat NeXT i omówimy, gdzie i dlaczego może to być przydatne.

:::info

## Różne typy danych

W formie binarnej wszystkie dane — czy to liczby, tekst, czy odczyty z czujników — są reprezentowane jako seria jedynek i zer. Różne typy danych używają różnych ilości pamięci i interpretują wartości binarne w specyficzny sposób. Krótko przejrzyjmy niektóre powszechne typy danych i jak są one przechowywane w postaci binarnej:

- **Integer (int)**:  
  Liczby całkowite reprezentują liczby całkowite. W 16-bitowej liczbie całkowitej, na przykład, 16 jedynek i zer może reprezentować wartości od \(-32,768\) do \(32,767\). Liczby ujemne są przechowywane za pomocą metody zwanej **dopełnieniem do dwóch**.

- **Unsigned Integer (uint)**:  
  Liczby całkowite bez znaku reprezentują liczby nieujemne. 16-bitowa liczba całkowita bez znaku może przechowywać wartości od \(0\) do \(65,535\), ponieważ żaden bit nie jest zarezerwowany dla znaku.

- **Float**:  
  Liczby zmiennoprzecinkowe reprezentują wartości dziesiętne. W 32-bitowej liczbie zmiennoprzecinkowej część bitów reprezentuje znak, wykładnik i mantysę, co pozwala komputerom obsługiwać bardzo duże i bardzo małe liczby. Jest to zasadniczo binarna forma [notacji naukowej](https://en.wikipedia.org/wiki/Scientific_notation).

- **Characters (char)**:  
  Znaki są przechowywane przy użyciu schematów kodowania, takich jak **ASCII** lub **UTF-8**. Każdy znak odpowiada określonej wartości binarnej (np. 'A' w ASCII jest przechowywane jako `01000001`).

- **Strings**:  
  Ciągi znaków to po prostu kolekcje znaków. Każdy znak w ciągu jest przechowywany w sekwencji jako indywidualne wartości binarne. Na przykład, ciąg `"CanSat"` byłby przechowywany jako seria znaków takich jak `01000011 01100001 01101110 01010011 01100001 01110100` (każdy reprezentujący 'C', 'a', 'n', 'S', 'a', 't'). Jak widać, reprezentowanie liczb jako ciągów, jak robiliśmy to do tej pory, jest mniej efektywne w porównaniu do przechowywania ich jako wartości binarne.

- **Arrays and `uint8_t`**:  
  Podczas pracy z danymi binarnymi często używa się tablicy `uint8_t` do przechowywania i obsługi surowych danych bajtowych. Typ `uint8_t` reprezentuje 8-bitową liczbę całkowitą bez znaku, która może przechowywać wartości od 0 do 255. Ponieważ każdy bajt składa się z 8 bitów, ten typ jest dobrze przystosowany do przechowywania danych binarnych.
  Tablice `uint8_t` są często używane do tworzenia buforów bajtowych do przechowywania sekwencji surowych danych binarnych (np. pakietów). Niektórzy preferują `char` lub inne zmienne, ale nie ma to większego znaczenia, o ile zmienna ma długość 1 bajta.
:::

## Przesyłanie danych binarnych

Zacznijmy od wgrania prostego programu do CanSat i skupmy się bardziej na stronie stacji naziemnej. Oto prosty kod, który przesyła odczyt w formacie binarnym:

```Cpp title="Transmit LDR data as binary"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(&LDR_voltage, sizeof(LDR_voltage));
  delay(1000);
}
```

Kod wygląda znajomo, ale `sendData` teraz przyjmuje dwa argumenty zamiast jednego - najpierw **adres pamięci** danych do przesłania, a następnie **długość** danych do przesłania. W tym uproszczonym przypadku używamy po prostu adresu i długości zmiennej `LDR_voltage`.

Jeśli spróbujesz odebrać to za pomocą typowego kodu stacji naziemnej, po prostu wydrukuje bzdury, ponieważ próbuje interpretować dane binarne tak, jakby były ciągiem znaków. Zamiast tego musimy określić stacji naziemnej, co zawierają dane.

Najpierw sprawdźmy, jak długie są dane, które faktycznie otrzymujemy.

```Cpp title="Check length of the received data"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {}

void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");
}
```

Za każdym razem, gdy satelita przesyła dane, otrzymujemy 4 bajty na stacji naziemnej. Ponieważ przesyłamy 32-bitową liczbę zmiennoprzecinkową, wydaje się to poprawne.

Aby odczytać dane, musimy wziąć bufor danych binarnych ze strumienia wejściowego i skopiować dane do odpowiedniej zmiennej. W tym prostym przypadku możemy to zrobić:

```Cpp title="Store the data into a variable"
void onBinaryDataReceived(const uint8_t *data, int len)
{
  Serial.print("Received ");
  Serial.print(len);
  Serial.println(" bytes");

  float LDR_reading;
  memcpy(&LDR_reading, data, 4);

  Serial.print("Data: ");
  Serial.println(LDR_reading);
}
```

Najpierw wprowadzamy zmienną `LDR_reading`, aby przechować dane, które *wiemy*, że mamy w buforze. Następnie używamy `memcpy` (kopiowanie pamięci), aby skopiować dane binarne z bufora `data` do **adresu pamięci** `LDR_reading`. To zapewnia, że dane są przenoszone dokładnie tak, jak zostały przechowane, zachowując ten sam format, co na satelicie.

Teraz, jeśli wydrukujemy dane, to tak, jakbyśmy je odczytali bezpośrednio po stronie GS. Nie jest to już tekst, jak to było wcześniej, ale rzeczywiste te same dane, które odczytaliśmy po stronie satelity. Teraz możemy łatwo je przetworzyć po stronie GS, jak chcemy.

## Tworzenie własnego protokołu

Prawdziwa moc transferu danych binarnych staje się widoczna, gdy mamy więcej danych do przesłania. Musimy jednak nadal zapewnić, że satelita i stacja naziemna zgadzają się, który bajt reprezentuje co. Nazywa się to **protokołem pakietowym**.

Protokół pakietowy definiuje strukturę przesyłanych danych, określając, jak spakować wiele fragmentów danych do jednej transmisji i jak odbiorca powinien interpretować przychodzące bajty. Zbudujmy prosty protokół, który przesyła wiele odczytów z czujników w uporządkowany sposób.

Najpierw odczytajmy wszystkie kanały akcelerometru i żyroskopu i stwórzmy **pakiet danych** z odczytów.

```Cpp title="Transmit LDR data as binary"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {
  float ax = readAccelX();
  float ay = readAccelY();
  float az = readAccelZ();
  float gx = readGyroX();
  float gy = readGyroY();
  float gz = readGyroZ();

  // Create an array to hold the data
  uint8_t packet[24];

  // Copy data into the packet
  memcpy(&packet[0], &ax, 4);  // Copy accelerometer X into bytes 0-3
  memcpy(&packet[4], &ay, 4);
  memcpy(&packet[8], &az, 4);
  memcpy(&packet[12], &gx, 4);
  memcpy(&packet[16], &gy, 4);
  memcpy(&packet[20], &gz, 4); // Copy gyroscope Z into bytes 20-23
  
  sendData(packet, sizeof(packet));

  delay(1000);
}
```

Tutaj najpierw odczytujemy dane tak jak w Lekcji 3, ale potem **kodujemy** dane do pakietu danych. Najpierw tworzony jest rzeczywisty bufor, który jest po prostu pustym zestawem 24 bajtów. Każda zmienna danych może być następnie zapisana do tego pustego bufora za pomocą `memcpy`. Ponieważ używamy `float`, dane mają długość 4 bajtów. Jeśli nie jesteś pewien długości zmiennej, zawsze możesz ją sprawdzić za pomocą `sizeof(variable)`.

:::tip[Ćwiczenie]

Utwórz oprogramowanie stacji naziemnej do interpretacji i drukowania danych z akcelerometru i żyroskopu.

:::

## Przechowywanie danych binarnych na karcie SD

Zapisywanie danych jako binarne na karcie SD może być przydatne podczas pracy z bardzo dużymi ilościami danych, ponieważ przechowywanie binarne jest bardziej kompaktowe i efektywne niż tekstowe. Pozwala to na zapisanie większej ilości danych przy mniejszej ilości miejsca na przechowywanie, co może być przydatne w systemach z ograniczoną pamięcią.

Jednak używanie danych binarnych do przechowywania wiąże się z kompromisami. W przeciwieństwie do plików tekstowych, pliki binarne nie są czytelne dla człowieka, co oznacza, że nie można ich łatwo otworzyć i zrozumieć za pomocą standardowych edytorów tekstu lub zaimportować do programów takich jak Excel. Aby odczytać i zinterpretować dane binarne, trzeba opracować specjalistyczne oprogramowanie lub skrypty (np. w Pythonie), które poprawnie analizują format binarny.

Dla większości zastosowań, gdzie ważny jest łatwy dostęp i elastyczność (takich jak analiza danych na komputerze później), zalecane są formaty tekstowe, takie jak CSV. Te formaty są łatwiejsze do pracy w różnych narzędziach programowych i zapewniają większą elastyczność w szybkiej analizie danych.

Jeśli jesteś zdecydowany na używanie przechowywania binarnego, przyjrzyj się głębiej "pod maską", przeglądając, jak biblioteka CanSat obsługuje wewnętrznie przechowywanie danych. Możesz bezpośrednio używać metod obsługi plików w stylu C do zarządzania plikami, strumieniami i innymi operacjami niskiego poziomu efektywnie. Więcej informacji można również znaleźć w [bibliotece karty SD Arduino](https://docs.arduino.cc/libraries/sd/).

---

Nasze programy zaczynają się robić coraz bardziej skomplikowane, a także są pewne komponenty, które byłoby miło ponownie wykorzystać gdzie indziej. Aby uniknąć trudności w zarządzaniu naszym kodem, byłoby miło móc udostępniać niektóre komponenty do różnych plików i utrzymywać kod czytelny. Zobaczmy, jak to można osiągnąć za pomocą Arduino IDE.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson10)