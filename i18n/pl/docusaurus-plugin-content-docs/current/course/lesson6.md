---
sidebar_position: 6
---

# Lekcja 6: Telefonowanie do domu

Teraz, gdy dokonaliśmy pomiarów i zapisaliśmy je na karcie SD, następnym logicznym krokiem jest bezprzewodowe przesyłanie ich na ziemię, co otwiera zupełnie nowy świat w zakresie pomiarów i eksperymentów, które możemy przeprowadzić. Na przykład, próba lotu w stanie nieważkości z IMU byłaby znacznie bardziej interesująca (i łatwiejsza do skalibrowania), gdybyśmy mogli zobaczyć dane w czasie rzeczywistym. Zobaczmy, jak możemy to zrobić!

W tej lekcji wyślemy pomiary z CanSat NeXT do odbiornika stacji naziemnej. Później przyjrzymy się również wydawaniu poleceń CanSatowi za pomocą wiadomości wysyłanych przez stację naziemną.

## Anteny

Przed rozpoczęciem tej lekcji upewnij się, że masz jakiś rodzaj anteny podłączonej do płytki CanSat NeXT i stacji naziemnej.

:::note

Nigdy nie powinieneś próbować przesyłać czegokolwiek bez anteny. Nie tylko prawdopodobnie to nie zadziała, ale istnieje możliwość, że odbita moc uszkodzi nadajnik.

:::

Ponieważ używamy pasma 2,4 GHz, które jest współdzielone przez systemy takie jak Wi-Fi, Bluetooth, ISM, drony itp., dostępnych jest wiele komercyjnych anten. Większość anten Wi-Fi działa naprawdę dobrze z CanSat NeXT, ale często będziesz potrzebować adaptera, aby podłączyć je do płytki CanSat NeXT. Przetestowaliśmy również kilka modeli adapterów, które są dostępne w sklepie internetowym.

Więcej informacji o antenach można znaleźć w dokumentacji sprzętowej: [Komunikacja i anteny](./../CanSat-hardware/communication). Ten artykuł zawiera również [instrukcje](./../CanSat-hardware/communication#building-a-quarter-wave-monopole-antenna) dotyczące budowy własnej anteny z materiałów w zestawie CanSat NeXT.

## Wysyłanie danych

Po omówieniu anten, zacznijmy wysyłać trochę bitów. Zaczniemy od spojrzenia na konfigurację, która tym razem ma kluczową różnicę - dodaliśmy liczbę jako **argument** do polecenia `CanSatInit()`.

```Cpp title="Konfiguracja do transmisji"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Przekazanie wartości liczbowej do `CanSatInit()` informuje CanSat NeXT, że chcemy teraz używać radia. Liczba wskazuje wartość ostatniego bajtu adresu MAC. Możesz myśleć o tym jako o kluczu do swojej konkretnej sieci - możesz komunikować się tylko z CanSatami, które mają ten sam klucz. Ta liczba powinna być wspólna dla twojego CanSat NeXT i stacji naziemnej. Możesz wybrać swoją ulubioną liczbę między 0 a 255. Wybrałem 28, ponieważ jest [doskonała](https://en.wikipedia.org/wiki/Perfect_number).

Po zainicjowaniu radia, przesyłanie danych jest naprawdę proste. Działa to właściwie tak samo jak `appendFile()`, którego używaliśmy w poprzedniej lekcji - możesz dodać dowolną wartość i zostanie ona przesłana w domyślnym formacie, lub możesz użyć sformatowanego ciągu znaków i wysłać go zamiast tego.

```Cpp title="Przesyłanie danych"
void loop() {
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  delay(100);
}
```

Dzięki temu prostemu kodowi przesyłamy teraz pomiar LDR prawie 10 razy na sekundę. Następnie przyjrzyjmy się, jak go odebrać.

:::note

Osoby zaznajomione z programowaniem niskopoziomowym mogą czuć się bardziej komfortowo, przesyłając dane w formie binarnej. Nie martw się, mamy to pokryte. Polecenia binarne są wymienione w [Specyfikacji Biblioteki](./../CanSat-software/library_specification.md#senddata-binary-variant).

:::

## Odbieranie danych

Ten kod powinien teraz zostać zaprogramowany na innym ESP32. Zwykle jest to druga płytka kontrolera dołączona do zestawu, jednak praktycznie każde inne ESP32 również będzie działać - w tym inny CanSat NeXT.

:::note

Jeśli używasz płytki rozwojowej ESP32 jako stacji naziemnej, pamiętaj, aby nacisnąć przycisk Boot na płytce podczas wgrywania z IDE. Ustawia to ESP32 w odpowiedni tryb rozruchowy do ponownego programowania procesora. CanSat NeXT robi to automatycznie, ale płytki rozwojowe najczęściej tego nie robią.

:::

Kod konfiguracji jest dokładnie taki sam jak wcześniej. Pamiętaj tylko, aby zmienić klucz radiowy na swoją ulubioną liczbę.

```Cpp title="Konfiguracja do odbioru"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```

Jednak po tym rzeczy stają się nieco inne. Tworzymy całkowicie pustą funkcję pętli! Dzieje się tak, ponieważ właściwie nie mamy nic do zrobienia w pętli, ale zamiast tego odbiór odbywa się za pomocą **callbacków**.

```Cpp title="Ustawianie callbacka"
void loop() {
  // Nie mamy nic do zrobienia w pętli.
}

// To jest funkcja callback. Jest uruchamiana za każdym razem, gdy radio odbiera dane.
void onDataReceived(String data)
{
  Serial.println(data);
}
```

Podczas gdy funkcja `setup()` uruchamia się tylko raz na początku, a `loop()` działa ciągle, funkcja `onDataReceived()` uruchamia się tylko wtedy, gdy radio odbierze nowe dane. W ten sposób możemy obsłużyć dane w funkcji callback. W tym przykładzie po prostu je drukujemy, ale moglibyśmy je również modyfikować w dowolny sposób.

Zauważ, że funkcja `loop()` nie musi być pusta, możesz jej używać do czegokolwiek chcesz z jednym zastrzeżeniem - należy unikać opóźnień, ponieważ funkcja `onDataReceived()` również nie uruchomi się, dopóki opóźnienie się nie skończy.

Jeśli teraz oba programy działają na różnych płytkach jednocześnie, powinno być całkiem sporo pomiarów przesyłanych bezprzewodowo do twojego komputera.

:::note

Dla osób zorientowanych na binaria - możesz użyć funkcji callback onBinaryDataReceived.

:::

## Zero-G w czasie rzeczywistym

Dla zabawy, powtórzmy eksperyment zero-g, ale z radiami. Kod odbiornika może pozostać taki sam, jak również konfiguracja w kodzie CanSat.

Dla przypomnienia, stworzyliśmy program w lekcji IMU, który wykrywał swobodny spadek i włączał diodę LED w tym scenariuszu. Oto stary kod:

```Cpp title="Funkcja pętli wykrywająca swobodny spadek"
unsigned long LEDOnTill = 0;

void loop() {
  // Odczyt przyspieszenia
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Oblicz całkowite przyspieszenie (kwadrat)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Aktualizuj timer, jeśli wykryjemy upadek
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Kontroluj diodę LED na podstawie timera
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Kusi, aby po prostu dodać `sendData()` bezpośrednio do starego przykładu, jednak musimy wziąć pod uwagę czas. Zwykle nie chcemy wysyłać wiadomości więcej niż ~20 razy na sekundę, ale z drugiej strony chcemy, aby pętla działała ciągle, aby dioda LED nadal się włączała.

Musimy dodać kolejny timer - tym razem, aby wysyłać dane co 50 milisekund. Timer jest realizowany przez porównanie bieżącego czasu z ostatnim czasem, kiedy dane zostały wysłane. Ostatni czas jest następnie aktualizowany za każdym razem, gdy dane są wysyłane. Zwróć także uwagę, jak tutaj tworzony jest ciąg znaków. Można go również przesłać w częściach, ale w ten sposób jest odbierany jako pojedyncza wiadomość, zamiast wielu wiadomości.

```Cpp title="Wykrywanie swobodnego spadku + transmisja danych"
unsigned long LEDOnTill = 0;

unsigned long lastSendTime = 0;
const unsigned long sendDataInterval = 50;


void loop() {

  // Odczyt przyspieszenia
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Oblicz całkowite przyspieszenie (kwadrat)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Aktualizuj timer, jeśli wykryjemy upadek
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Kontroluj diodę LED na podstawie timera
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }

  if (millis() - lastSendTime >= sendDataInterval) {
    String dataString = "Acceleration_squared:" + String(totalSquared);

    sendData(dataString);

    // Aktualizuj ostatni czas wysyłania na bieżący czas
    lastSendTime = millis();
  }

}
```

Format danych tutaj jest ponownie kompatybilny z ploterem szeregowym - patrząc na te dane, staje się całkiem jasne, dlaczego byliśmy w stanie wykryć swobodny spadek wcześniej tak czysto - wartości naprawdę spadają do zera, gdy urządzenie jest upuszczane lub rzucane.

---

W następnej sekcji zrobimy krótką przerwę, aby przejrzeć to, czego się do tej pory nauczyliśmy i upewnić się, że jesteśmy przygotowani do kontynuowania budowania na tych koncepcjach.

[Kliknij tutaj, aby przejść do pierwszej recenzji!](./review1)