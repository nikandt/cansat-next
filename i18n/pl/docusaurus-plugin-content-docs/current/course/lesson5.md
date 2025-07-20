---
sidebar_position: 5
---

# Lekcja 5: Zapisywanie Bitów i Bajtów

Czasami przesyłanie danych bezpośrednio do komputera nie jest możliwe, na przykład gdy urządzenie jest rzucane, wystrzeliwane rakietą lub pomiary są wykonywane w trudno dostępnych miejscach. W takich przypadkach najlepiej jest zapisać zmierzone dane na karcie SD do dalszego przetwarzania później. Dodatkowo, karta SD może być również używana do przechowywania ustawień - na przykład możemy mieć jakiś rodzaj ustawienia progu lub ustawienia adresu przechowywane na karcie SD.

## Karta SD w bibliotece CanSat NeXT

Biblioteka CanSat NeXT obsługuje szeroki zakres operacji na kartach SD. Może być używana do zapisywania i odczytywania plików, ale także do tworzenia katalogów i nowych plików, przenoszenia ich lub nawet usuwania. Wszystkie te funkcje mogą być przydatne w różnych okolicznościach, ale skupmy się tutaj na dwóch podstawowych rzeczach - odczytywaniu pliku i zapisywaniu danych do pliku.

:::note

Jeśli chcesz mieć pełną kontrolę nad systemem plików, możesz znaleźć polecenia w [Specyfikacji Biblioteki](./../CanSat-software/library_specification.md#sdcardpresent) lub w przykładzie biblioteki "SD_advanced".

:::

Jako ćwiczenie, zmodyfikujmy kod z ostatniej lekcji, aby zamiast zapisywać pomiary LDR na serialu, zapisywać je na karcie SD.

Najpierw zdefiniujmy nazwę pliku, którego będziemy używać. Dodajmy to przed funkcją setup jako **zmienną globalną**.

```Cpp title="Zmodyfikowany Setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";

void setup() {
  Serial.begin(115200);
  CanSatInit();
}
```

Teraz, gdy mamy ścieżkę pliku, możemy zapisać dane na karcie SD. Potrzebujemy tylko dwóch linii, aby to zrobić. Najlepszym poleceniem do zapisywania danych pomiarowych jest `appendFile()`, które po prostu przyjmuje ścieżkę pliku i zapisuje nowe dane na końcu pliku. Jeśli plik nie istnieje, tworzy go. To sprawia, że użycie polecenia jest bardzo proste (i bezpieczne). Możemy po prostu bezpośrednio dodać do niego dane, a następnie dodać zmianę linii, aby dane były łatwiejsze do odczytania. I to wszystko! Teraz przechowujemy pomiary.

```Cpp title="Zapisywanie danych LDR na karcie SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  Serial.print("LDR value:");
  Serial.println(LDR_voltage);
  appendFile(filepath, LDR_voltage);
  appendFile(filepath, "\n");
  delay(200);
}
```

Domyślnie, polecenie `appendFile()` przechowuje liczby zmiennoprzecinkowe z dwoma wartościami po przecinku. Dla bardziej specyficznej funkcjonalności, możesz najpierw utworzyć ciąg znaków w szkicu i użyć polecenia `appendFile()`, aby zapisać ten ciąg na karcie SD. Na przykład:

```Cpp title="Zapisywanie danych LDR na karcie SD"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(200);
}
```

Tutaj najpierw tworzony jest końcowy ciąg znaków, z `String(LDR_voltage, 6)` określającym, że chcemy 6 miejsc po przecinku. Możemy użyć tego samego ciągu do drukowania i przechowywania danych. (A także do transmisji przez radio)

## Odczytywanie Danych

Często przydatne jest przechowywanie czegoś na karcie SD do przyszłego użycia w programie. Mogą to być na przykład ustawienia dotyczące bieżącego stanu urządzenia, tak aby w przypadku resetu programu można było ponownie załadować bieżący stan z karty SD zamiast zaczynać od wartości domyślnych.

Aby to zademonstrować, dodaj na komputerze nowy plik na karcie SD o nazwie "delay_time" i zapisz w nim liczbę, na przykład 200. Spróbujmy zastąpić statycznie ustawiony czas opóźnienia w naszym programie ustawieniem odczytanym z pliku.

Spróbujmy odczytać plik ustawień w setup. Najpierw wprowadźmy nową zmienną globalną. Nadałem jej domyślną wartość 1000, aby w przypadku, gdy nie uda nam się zmodyfikować czasu opóźnienia, była to teraz domyślna wartość.

W setup powinniśmy najpierw sprawdzić, czy plik w ogóle istnieje. Można to zrobić za pomocą polecenia `fileExists()`. Jeśli nie, po prostu użyjmy wartości domyślnej. Po tym dane można odczytać za pomocą `readFile()`. Należy jednak zauważyć, że jest to ciąg znaków - nie liczba całkowita, jakiej potrzebujemy. Więc przekształćmy to za pomocą polecenia Arduino `toInt()`. Na koniec sprawdzamy, czy konwersja się powiodła. Jeśli nie, wartość będzie zerowa, w takim przypadku będziemy nadal używać wartości domyślnej.

```Cpp title="Odczytywanie ustawienia w setup"
#include "CanSatNeXT.h"

const String filepath = "/LDR_data.csv";
const String settingFile = "/delay_time";

int delayTime = 1000;

void setup() {
  Serial.begin(115200);
  CanSatInit();

  if(fileExists(settingFile))
  {
    String contents = readFile(settingFile);
    int value = contents.toInt();
    if(value != 0){
      delayTime = value;
    }
  }
}
```

Na koniec, nie zapomnij zmienić opóźnienia w pętli, aby używało nowej zmiennej.

```Cpp title="Dynamicznie ustawiona wartość opóźnienia"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);

  String formattedString = String(LDR_voltage, 6) + "\n";
  Serial.print(formattedString);
  appendFile(filepath, formattedString);

  delay(delayTime);
}
```

Teraz możesz spróbować zmienić wartość na karcie SD lub nawet usunąć kartę SD, w takim przypadku powinna teraz używać wartości domyślnej dla długości opóźnienia.

:::note

Aby nadpisać ustawienie w swoim programie, możesz użyć polecenia [writeFile](./../CanSat-software/library_specification.md#writefile). Działa ono tak samo jak [appendFile](./../CanSat-software/library_specification.md#appendfile), ale nadpisuje wszelkie istniejące dane.

:::

:::tip[Ćwiczenie]

Kontynuuj od swojego rozwiązania ćwiczenia z lekcji 4, aby stan był utrzymywany nawet jeśli urządzenie zostanie zresetowane. Tzn. przechowuj bieżący stan na karcie SD i odczytuj go w setup. To symulowałoby scenariusz, w którym Twój CanSat nagle resetuje się w locie lub przed lotem, a dzięki temu programowi nadal uzyskasz udany lot.

:::

---

W następnej lekcji przyjrzymy się używaniu radia do przesyłania danych między procesorami. Powinieneś mieć jakiś rodzaj anteny w swoim CanSat NeXT i stacji naziemnej przed rozpoczęciem tych ćwiczeń. Jeśli jeszcze tego nie zrobiłeś, zapoznaj się z samouczkiem dotyczącym budowy podstawowej anteny: [Budowa anteny](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna).

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson6)