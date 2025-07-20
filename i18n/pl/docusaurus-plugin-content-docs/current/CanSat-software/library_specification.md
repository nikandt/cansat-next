---
sidebar_position: 1
---

# Specyfikacja biblioteki

# Funkcje

Możesz używać wszystkich standardowych funkcji Arduino z CanSat NeXT, jak również dowolnych bibliotek Arduino. Funkcje Arduino można znaleźć tutaj: https://www.arduino.cc/reference/en/.

Biblioteka CanSat NeXT dodaje kilka łatwych w użyciu funkcji do korzystania z różnych zasobów na pokładzie, takich jak czujniki, radio i karta SD. Biblioteka zawiera zestaw przykładowych szkiców pokazujących, jak korzystać z tych funkcji. Poniższa lista pokazuje również wszystkie dostępne funkcje.

## Funkcje inicjalizacji systemu

### CanSatInit

| Funkcja              | uint8_t CanSatInit(uint8_t macAddress[6])                          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli inicjalizacja zakończyła się sukcesem, lub wartość niezerową, jeśli wystąpił błąd. |
| **Parametry**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-bajtowy adres MAC współdzielony przez satelitę i stację naziemną. Jest to opcjonalny parametr - gdy nie jest podany, radio nie jest inicjalizowane. Używany w przykładowym szkicu: Wszystkie |
| **Opis**             | Ta komenda znajduje się w `setup()` prawie wszystkich skryptów CanSat NeXT. Służy do inicjalizacji sprzętu CanSatNeXT, w tym czujników i karty SD. Dodatkowo, jeśli podany jest `macAddress`, uruchamia radio i zaczyna nasłuchiwać przychodzących wiadomości. Adres MAC powinien być współdzielony przez stację naziemną i satelitę. Adres MAC można wybrać dowolnie, ale istnieją pewne nieprawidłowe adresy, takie jak wszystkie bajty będące `0x00`, `0x01` i `0xFF`. Jeśli funkcja inicjalizacji zostanie wywołana z nieprawidłowym adresem, zgłosi problem do Serial. |

### CanSatInit (uproszczona specyfikacja adresu MAC)

| Funkcja              | uint8_t CanSatInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli inicjalizacja zakończyła się sukcesem, lub wartość niezerową, jeśli wystąpił błąd. |
| **Parametry**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Ostatni bajt adresu MAC, używany do rozróżnienia różnych par CanSat-GS. |
| **Opis**             | Jest to uproszczona wersja CanSatInit z adresem MAC, która automatycznie ustawia pozostałe bajty na znaną bezpieczną wartość. Umożliwia to użytkownikom rozróżnienie swoich par Nadajnik-Odbiornik za pomocą tylko jednej wartości, która może wynosić 0-255.|

### GroundStationInit

| Funkcja              | uint8_t GroundStationInit(uint8_t macAddress[6])                  |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli inicjalizacja zakończyła się sukcesem, lub wartość niezerową, jeśli wystąpił błąd. |
| **Parametry**        |                                                                    |
|                      | `uint8_t macAddress[6]`                                           |
|                      | 6-bajtowy adres MAC współdzielony przez satelitę i stację naziemną. |
| **Używane w przykładzie szkicu** | Groundstation receive                                          |
| **Opis**             | Jest to bliski krewny funkcji CanSatInit, ale zawsze wymaga adresu MAC. Ta funkcja inicjalizuje tylko radio, a nie inne systemy. Stacja naziemna może być dowolną płytką ESP32, w tym dowolną płytką deweloperską lub nawet inną płytką CanSat NeXT. |

### GroundStationInit (uproszczona specyfikacja adresu MAC)

| Funkcja              | uint8_t GroundStationInit(uint8_t macAddress)                          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli inicjalizacja zakończyła się sukcesem, lub wartość niezerową, jeśli wystąpił błąd. |
| **Parametry**        |                                                                    |
|                      | `uint8_t macAddress`                                           |
|                      | Ostatni bajt adresu MAC, używany do rozróżnienia różnych par CanSat-GS. |
| **Opis**             | Jest to uproszczona wersja GroundStationInit z adresem MAC, która automatycznie ustawia pozostałe bajty na znaną bezpieczną wartość. Umożliwia to użytkownikom rozróżnienie swoich par Nadajnik-Odbiornik za pomocą tylko jednej wartości, która może wynosić 0-255.|

## Funkcje IMU

### readAcceleration

| Funkcja              | uint8_t readAcceleration(float &x, float &y, float &z)          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli pomiar zakończył się sukcesem.                           |
| **Parametry**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adres zmiennej typu float, w której zostaną zapisane dane osi x. |
| **Używane w przykładzie szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu przyspieszenia z wbudowanego IMU. Parametry to adresy zmiennych typu float dla każdej osi. Przykład IMU pokazuje, jak używać tej funkcji do odczytu przyspieszenia. Przyspieszenie jest zwracane w jednostkach G (9.81 m/s). |

### readAccelX

| Funkcja              | float readAccelX()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                          |
| **Wartość zwracana** | Zwraca liniowe przyspieszenie na osi X w jednostkach G.                           |
| **Używane w przykładzie szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu przyspieszenia z wbudowanego IMU na konkretnej osi. Przykład IMU pokazuje, jak używać tej funkcji do odczytu przyspieszenia. Przyspieszenie jest zwracane w jednostkach G (9.81 m/s). |

### readAccelY

| Funkcja              | float readAccelY()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                          |
| **Wartość zwracana** | Zwraca liniowe przyspieszenie na osi Y w jednostkach G.                           |
| **Używane w przykładowym szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu przyspieszenia z wbudowanego IMU na określonej osi. Przykład IMU pokazuje, jak używać tej funkcji do odczytu przyspieszenia. Przyspieszenie jest zwracane w jednostkach G (9,81 m/s). |

### readAccelZ

| Funkcja              | float readAccelZ()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                          |
| **Wartość zwracana** | Zwraca liniowe przyspieszenie na osi Z w jednostkach G.                           |
| **Używane w przykładowym szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu przyspieszenia z wbudowanego IMU na określonej osi. Przykład IMU pokazuje, jak używać tej funkcji do odczytu przyspieszenia. Przyspieszenie jest zwracane w jednostkach G (9,81 m/s). |

### readGyro

| Funkcja              | uint8_t readGyro(float &x, float &y, float &z)                    |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli pomiar zakończył się sukcesem.                           |
| **Parametry**        |                                                                    |
|                      | `float &x, float &y, float &z`                                    |
|                      | `float &x`: Adres zmiennej typu float, w której będą przechowywane dane z osi x. |
| **Używane w przykładowym szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu prędkości kątowej z wbudowanego IMU. Parametry to adresy zmiennych typu float dla każdej osi. Przykład IMU pokazuje, jak używać tej funkcji do odczytu prędkości kątowej. Prędkość kątowa jest zwracana w jednostkach mrad/s. |

### readGyroX

| Funkcja              | float readGyroX()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                          |
| **Wartość zwracana** | Zwraca prędkość kątową na osi X w jednostkach mrad/s.                           |
| **Używane w przykładowym szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu prędkości kątowej z wbudowanego IMU na określonej osi. Parametry to adresy zmiennych typu float dla każdej osi. Prędkość kątowa jest zwracana w jednostkach mrad/s. |

### readGyroY

| Funkcja              | float readGyroY()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                          |
| **Wartość zwracana** | Zwraca prędkość kątową na osi Y w jednostkach mrad/s.                           |
| **Używane w przykładowym szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu prędkości kątowej z wbudowanego IMU na określonej osi. Parametry to adresy zmiennych typu float dla każdej osi. Prędkość kątowa jest zwracana w jednostkach mrad/s. |

### readGyroZ

| Funkcja              | float readGyroZ()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                          |
| **Wartość zwracana** | Zwraca prędkość kątową na osi Z w jednostkach mrad/s.                           |
| **Używane w przykładzie szkicu** | IMU                                                  |
| **Opis**             | Ta funkcja może być używana do odczytu prędkości kątowej z wbudowanego IMU na określonej osi. Parametry to adresy do zmiennych typu float dla każdej osi. Prędkość kątowa jest zwracana w jednostkach mrad/s. |

## Funkcje Barometru

### readPressure

| Funkcja              | float readPressure()                                              |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                            |
| **Wartość zwracana** | Ciśnienie w mbar                                                   |
| **Parametry**        | Brak                                                               |
| **Używane w przykładzie szkicu** | Baro                                                        |
| **Opis**             | Ta funkcja zwraca ciśnienie zgłaszane przez wbudowany barometr. Ciśnienie jest w jednostkach milibar. |

### readTemperature

| Funkcja              | float readTemperature()                                           |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                            |
| **Wartość zwracana** | Temperatura w stopniach Celsjusza                                 |
| **Parametry**        | Brak                                                               |
| **Używane w przykładzie szkicu** | Baro                                                        |
| **Opis**             | Ta funkcja zwraca temperaturę zgłaszaną przez wbudowany barometr. Jednostką odczytu jest Celsjusz. Należy zauważyć, że jest to temperatura wewnętrzna mierzona przez barometr, więc może nie odzwierciedlać temperatury zewnętrznej. |

## Funkcje Karty SD / Systemu Plików

### SDCardPresent

| Funkcja              | bool SDCardPresent()                                              |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `bool`                                                             |
| **Wartość zwracana** | Zwraca true, jeśli wykryje kartę SD, false w przeciwnym razie.     |
| **Parametry**        | Brak                                                               |
| **Używane w przykładzie szkicu** | SD_advanced                                                |
| **Opis**             | Ta funkcja może być używana do sprawdzenia, czy karta SD jest mechanicznie obecna. Złącze karty SD ma mechaniczny przełącznik, który jest odczytywany, gdy ta funkcja jest wywoływana. Zwraca true lub false w zależności od tego, czy karta SD jest wykryta. |

### appendFile

| Funkcja              | uint8_t appendFile(String filename, T data)                   |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli zapis zakończył się sukcesem.                      |
| **Parametry**        |                                                                    |
|                      | `String filename`: Adres pliku, do którego ma być dodana zawartość. Jeśli plik nie istnieje, zostanie utworzony. |
|                      | `T data`: Dane do dodania na końcu pliku.                          |
| **Używane w przykładowym szkicu** | SD_write                                               |
| **Opis**             | To jest podstawowa funkcja zapisu używana do przechowywania odczytów na karcie SD. |

### printFileSystem

| Funkcja              | void printFileSystem()                                            |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        | Brak                                                               |
| **Używane w przykładowym szkicu** | SD_advanced                                                |
| **Opis**             | To jest mała funkcja pomocnicza do drukowania nazw plików i folderów obecnych na karcie SD. Może być używana w trakcie rozwoju. |

### newDir

| Funkcja              | void newDir(String path)                                          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `String path`: Ścieżka nowego katalogu. Jeśli już istnieje, nic nie jest robione. |
| **Używane w przykładowym szkicu** | SD_advanced                                                |
| **Opis**             | Używane do tworzenia nowych katalogów na karcie SD.                |

### deleteDir

| Funkcja              | void deleteDir(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `String path`: Ścieżka katalogu do usunięcia.                      |
| **Używane w przykładowym szkicu** | SD_advanced                                                |
| **Opis**             | Używane do usuwania katalogów na karcie SD.                        |

### fileExists

| Funkcja              | bool fileExists(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `bool`                                                             |
| **Wartość zwracana** | Zwraca true, jeśli plik istnieje.                                  |
| **Parametry**        |                                                                    |
|                      | `String path`: Ścieżka do pliku.                                   |
| **Używane w przykładowym szkicu** | SD_advanced                                                |
| **Opis**             | Ta funkcja może być używana do sprawdzania, czy plik istnieje na karcie SD. |

### fileSize

| Funkcja              | uint32_t fileSize(String path)                                    |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint32_t`                                                         |
| **Wartość zwracana** | Rozmiar pliku w bajtach.                                           |
| **Parametry**        |                                                                    |
|                      | `String path`: Ścieżka do pliku.                                   |
| **Używane w przykładzie** | SD_advanced                                                |
| **Opis**             | Ta funkcja może być używana do odczytu rozmiaru pliku na karcie SD.|

### writeFile

| Funkcja              | uint8_t writeFile(String filename, T data)                    |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                          |
| **Wartość zwracana** | Zwraca 0, jeśli zapis zakończył się sukcesem.                      |
| **Parametry**        |                                                                    |
|                      | `String filename`: Adres pliku do zapisu.                          |
|                      | `T data`: Dane do zapisania w pliku.                               |
| **Używane w przykładzie** | SD_advanced                                                |
| **Opis**             | Ta funkcja jest podobna do `appendFile()`, ale nadpisuje istniejące dane na karcie SD. Do przechowywania danych powinno się używać `appendFile`. Funkcja ta może być przydatna do przechowywania ustawień, na przykład.|

### readFile

| Funkcja              | String readFile(String path)                                       |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `String`                                                           |
| **Wartość zwracana** | Cała zawartość pliku.                                              |
| **Parametry**        |                                                                    |
|                      | `String path`: Ścieżka do pliku.                                   |
| **Używane w przykładzie** | SD_advanced                                                |
| **Opis**             | Ta funkcja może być używana do odczytu wszystkich danych z pliku do zmiennej. Próba odczytu dużych plików może powodować problemy, ale jest odpowiednia dla małych plików, takich jak pliki konfiguracyjne lub ustawień.|

### renameFile

| Funkcja              | void renameFile(String oldpath, String newpath)                   |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `String oldpath`: Oryginalna ścieżka do pliku.                     |
|                      | `String newpath`: Nowa ścieżka pliku.                              |
| **Używane w przykładzie** | SD_advanced                                                |
| **Opis**             | Ta funkcja może być używana do zmiany nazwy lub przenoszenia plików na karcie SD.|

### deleteFile

| Funkcja              | void deleteFile(String path)                                      |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `String path`: Ścieżka do pliku, który ma zostać usunięty.         |
| **Używane w przykładowym szkicu** | SD_advanced                                                |
| **Opis**             | Ta funkcja może być używana do usuwania plików z karty SD.         |

## Funkcje radiowe

### onDataReceived

| Funkcja              | void onDataReceived(String data)                                   |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `String data`: Otrzymane dane jako Arduino String.                 |
| **Używane w przykładowym szkicu** | Groundstation_receive                                      |
| **Opis**             | To jest funkcja zwrotna, która jest wywoływana, gdy dane są odbierane. Kod użytkownika powinien zdefiniować tę funkcję, a CanSat NeXT wywoła ją automatycznie, gdy dane zostaną odebrane. |

### onBinaryDataReceived

| Funkcja              | void onBinaryDataReceived(const uint8_t *data, uint16_t len)           |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `const uint8_t *data`: Otrzymane dane jako tablica uint8_t.        |
|                      | `uint16_t len`: Długość otrzymanych danych w bajtach.              |
| **Używane w przykładowym szkicu** | Brak                                                 |
| **Opis**             | Jest to podobne do funkcji `onDataReceived`, ale dane są dostarczane jako binarne zamiast obiektu String. Jest to przeznaczone dla zaawansowanych użytkowników, którzy uważają obiekt String za ograniczający. |

### onDataSent

| Funkcja              | void onDataSent(const bool success)                                |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                             |
| **Parametry**        |                                                                    |
|                      | `const bool success`: Wartość logiczna wskazująca, czy dane zostały wysłane pomyślnie. |
| **Używane w przykładowym szkicu** | Brak                                                 |
| **Opis**             | Jest to kolejna funkcja zwrotna, którą można dodać do kodu użytkownika, jeśli jest to wymagane. Może być używana do sprawdzenia, czy odbiór został potwierdzony przez inne radio. |

### getRSSI

| Funkcja              | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `int8_t`                                                          |
| **Wartość zwracana** | RSSI ostatniej odebranej wiadomości. Zwraca 1, jeśli od uruchomienia nie odebrano żadnych wiadomości.                           |
| **Używane w przykładowym szkicu** | Brak                                                  |
| **Opis**             | Ta funkcja może być używana do monitorowania siły sygnału odbioru. Może być używana do testowania anten lub oceny zasięgu radia. Wartość jest wyrażona w [dBm](https://en.wikipedia.org/wiki/DBm), jednak skala nie jest dokładna. |

### sendData (wariant String)

| Function             | uint8_t sendData(T data)                                      |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | 0, jeśli dane zostały wysłane (nie wskazuje potwierdzenia).            |
| **Parameters**       |                                                                    |
|                      | `T data`: Dane do wysłania. Można użyć dowolnego typu danych, ale wewnętrznie są one konwertowane na ciąg znaków.                  |
| **Used in example sketch** | Send_data                                             |
| **Description**      | To jest główna funkcja do wysyłania danych między stacją naziemną a satelitą. Należy zauważyć, że wartość zwracana nie wskazuje, czy dane zostały faktycznie odebrane, tylko że zostały wysłane. Callback `onDataSent` może być użyty do sprawdzenia, czy dane zostały odebrane przez drugą stronę. |

### sendData (Wariant binarny) {#sendData-binary}

| Function             | uint8_t sendData(T* data, uint16_t len)                        |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `uint8_t`                                                          |
| **Return Value**     | 0, jeśli dane zostały wysłane (nie wskazuje potwierdzenia).            |
| **Parameters**       |                                                                    |
|                      | `T* data`: Dane do wysłania.                    |
|                      | `uint16_t len`: Długość danych w bajtach.                      |
| **Used in example sketch** | None                                                 |
| **Description**      | Binarny wariant funkcji `sendData`, przeznaczony dla zaawansowanych użytkowników, którzy czują się ograniczeni przez obiekt String. |

### getRSSI

| Function             | int8_t getRSSI()          |
|----------------------|--------------------------------------------------------------------|
| **Return Type**      | `int8_t`                                                          |
| **Return Value**     | RSSI ostatniej odebranej wiadomości. Zwraca 1, jeśli od uruchomienia nie odebrano żadnych wiadomości.                           |
| **Used in example sketch** | None                                                  |
| **Description**      | Ta funkcja może być używana do monitorowania siły sygnału odbioru. Może być używana do testowania anten lub oceny zasięgu radia. Wartość jest wyrażona w [dBm](https://en.wikipedia.org/wiki/DBm), jednak skala nie jest dokładna. 

### setRadioChannel

| Function             | `void setRadioChannel(uint8_t newChannel)`                       |
|----------------------|------------------------------------------------------------------|
| **Return Type**      | `void`                                                          |
| **Return Value**     | None                                                            |
| **Parameters**       | `uint8_t newChannel`: Żądany numer kanału Wi-Fi (1–11). Każda wartość powyżej 11 zostanie ograniczona do 11. |
| **Used in example sketch** | None                                                      |
| **Description**      | Ustawia kanał komunikacji ESP-NOW. Nowy kanał musi być w zakresie standardowych kanałów Wi-Fi (1–11), które odpowiadają częstotliwościom zaczynającym się od 2.412 GHz z krokami co 5 MHz. Kanał 1 to 2.412, Kanał 2 to 2.417 i tak dalej. Wywołaj tę funkcję przed inicjalizacją biblioteki. Domyślny kanał to 1. |

### getRadioChannel

| Funkcja              | `uint8_t getRadioChannel()`                                      |
|----------------------|------------------------------------------------------------------|
| **Typ zwracany**     | `uint8_t`                                                       |
| **Wartość zwracana** | Aktualny główny kanał Wi-Fi. Zwraca 0, jeśli wystąpi błąd podczas pobierania kanału. |
| **Używane w przykładowym szkicu** | Brak                                                      |
| **Opis**             | Pobiera aktualnie używany główny kanał Wi-Fi. Ta funkcja działa tylko po zainicjowaniu biblioteki. |

### printRadioFrequency

| Funkcja              | `void printRadioFrequency()`                                     |
|----------------------|------------------------------------------------------------------|
| **Typ zwracany**     | `void`                                                          |
| **Wartość zwracana** | Brak                                                            |
| **Używane w przykładowym szkicu** | Brak                                                      |
| **Opis**             | Oblicza i drukuje aktualną częstotliwość w GHz na podstawie aktywnego kanału Wi-Fi. Ta funkcja działa tylko po zainicjowaniu biblioteki. |


## Funkcje ADC

### adcToVoltage

| Funkcja              | float adcToVoltage(int value)                                      |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                            |
| **Wartość zwracana** | Przekształcone napięcie w woltach.                                |
| **Parametry**        |                                                                    |
|                      | `int value`: Odczyt ADC do przekształcenia na napięcie.            |
| **Używane w przykładowym szkicu** | AccurateAnalogRead                                    |
| **Opis**             | Ta funkcja przekształca odczyt ADC na napięcie, używając skalibrowanego wielomianu trzeciego stopnia dla bardziej liniowej konwersji. Należy pamiętać, że ta funkcja oblicza napięcie na pinie wejściowym, więc aby obliczyć napięcie baterii, należy również uwzględnić sieć rezystorów. |

### analogReadVoltage

| Funkcja              | float analogReadVoltage(int pin)                                  |
|----------------------|--------------------------------------------------------------------|
| **Typ zwracany**     | `float`                                                            |
| **Wartość zwracana** | Napięcie ADC w woltach.                                           |
| **Parametry**        |                                                                    |
|                      | `int pin`: Pin do odczytu.                                        |
| **Używane w przykładowym szkicu** | AccurateAnalogRead                                    |
| **Opis**             | Ta funkcja odczytuje napięcie bezpośrednio zamiast używać `analogRead` i przekształca odczyt na napięcie wewnętrznie, używając `adcToVoltage`. |