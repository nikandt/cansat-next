---
sidebar_position: 2
---

# Lekcja 2: Odczuwanie ciśnienia

W tej drugiej lekcji zaczniemy korzystać z czujników na płytce CanSat NeXT. Tym razem skupimy się na pomiarze otaczającego ciśnienia atmosferycznego. Użyjemy wbudowanego barometru [LPS22HB](./../CanSat-hardware/on_board_sensors#barometer) do odczytu ciśnienia, a także do odczytu temperatury samego barometru.

Zacznijmy od kodu barometru w przykładach biblioteki. W Arduino IDE wybierz File-> Examples->CanSat NeXT->Baro.

Początek programu wygląda dość znajomo z poprzedniej lekcji. Ponownie zaczynamy od dołączenia biblioteki CanSat NeXT, ustawienia połączenia szeregowego oraz inicjalizacji systemów CanSat NeXT.

```Cpp title="Setup"
#include "CanSatNeXT.h"

void setup() {

  // Initialize serial
  Serial.begin(115200);

  // Initialize the CanSatNeXT on-board systems
  CanSatInit();
}
```

Wywołanie funkcji `CanSatInit()` inicjalizuje dla nas wszystkie czujniki, w tym barometr. Możemy więc zacząć go używać w funkcji loop.

Poniższe dwie linie to miejsce, gdzie faktycznie odczytywane są temperatura i ciśnienie. Gdy wywoływane są funkcje `readTemperature()` i `readPressure()`, procesor wysyła polecenie do barometru, który mierzy ciśnienie lub temperaturę i zwraca wynik do procesora.

```Cpp title="Reading to variables"
float t = readTemperature();
float p = readPressure(); 
```

W przykładzie wartości są drukowane, a następnie następuje opóźnienie 1000 ms, tak aby pętla powtarzała się mniej więcej raz na sekundę.

```Cpp title="Printing the variables"
Serial.print("Pressure: ");
Serial.print(p);
Serial.print("hPa\ttemperature: ");
Serial.print(t);
Serial.println("*C\n");


delay(1000);
```

### Wykorzystanie danych

Możemy również użyć danych w kodzie, a nie tylko je drukować lub zapisywać. Na przykład, możemy napisać kod, który wykrywa, czy ciśnienie spada o określoną wartość, i na przykład włącza diodę LED. Albo cokolwiek innego, co chcesz zrobić. Spróbujmy włączyć wbudowaną diodę LED.

Aby to zaimplementować, musimy nieco zmodyfikować kod w przykładzie. Najpierw zacznijmy śledzić poprzednią wartość ciśnienia. Aby utworzyć **zmienne globalne**, czyli takie, które nie istnieją tylko podczas wykonywania określonej funkcji, możesz po prostu napisać je poza jakąkolwiek konkretną funkcją. Zmienna previousPressure jest aktualizowana przy każdym cyklu funkcji loop, zaraz na końcu. W ten sposób śledzimy starą wartość i możemy ją porównać z nową wartością.

Możemy użyć instrukcji if, aby porównać stare i nowe wartości. W poniższym kodzie idea jest taka, że jeśli poprzednie ciśnienie jest o 0.1 hPa niższe niż nowa wartość, włączymy diodę LED, a w przeciwnym razie dioda LED pozostanie wyłączona.

```Cpp title="Reacting to pressure drops"
float previousPressure = 1000;

void loop() {

  // read temperature to a float - variable
  float t = readTemperature();

  // read pressure to a float
  float p = readPressure(); 

  // Print the pressure and temperature
  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.print("hPa\ttemperature: ");
  Serial.print(t);
  Serial.println("*C");

  if(previousPressure - 0.1 > p)
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  // Wait one second before starting the loop again
  delay(1000);

  previousPressure = p;
}
```

Jeśli wgrasz tę zmodyfikowaną pętlę do CanSat NeXT, powinna ona zarówno drukować wartości zmiennych jak wcześniej, ale teraz także szukać spadku ciśnienia. Ciśnienie atmosferyczne spada o około 0.12 hPa / metr podczas wznoszenia się, więc jeśli spróbujesz szybko podnieść CanSat NeXT o metr wyżej, dioda LED powinna się włączyć na jeden cykl pętli (1 sekunda), a następnie wyłączyć. Najlepiej jest odłączyć kabel USB przed próbą tego!

Możesz także spróbować zmodyfikować kod. Co się stanie, jeśli zmienisz opóźnienie? A co, jeśli zmienisz **histerezę** 0.1 hPa lub całkowicie ją usuniesz?

---

W następnej lekcji będziemy mieli jeszcze więcej aktywności fizycznej, gdy spróbujemy użyć innego zintegrowanego czujnika IC - jednostki pomiaru inercyjnego.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson3)