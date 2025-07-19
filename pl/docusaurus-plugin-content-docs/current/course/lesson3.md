---
sidebar_position: 3
---

# Lekcja 3: Wykrywanie obrotu

CanSat NeXT ma dwa układy czujników na płytce CanSat NeXT. Jeden z nich to barometr, którego używaliśmy w poprzedniej lekcji, a drugi to _jednostka pomiaru inercyjnego_ [LSM6DS3](./../CanSat-hardware/on_board_sensors#inertial-measurement-unit). LSM6DS3 to 6-osiowy IMU, co oznacza, że jest w stanie wykonywać 6 różnych pomiarów. W tym przypadku jest to przyspieszenie liniowe na trzech osiach (x, y, z) oraz prędkość kątowa na trzech osiach.

W tej lekcji przyjrzymy się przykładowi IMU w bibliotece, a także wykorzystamy IMU do małego eksperymentu.

## Przykład biblioteki

Zacznijmy od przyjrzenia się, jak działa przykład z biblioteki. Załaduj go z File -> Examples -> CanSat NeXT -> IMU.

Początkowa konfiguracja jest ponownie taka sama - dołącz bibliotekę, zainicjuj serial i CanSat. Skupmy się jednak na pętli. Pętla wygląda bardzo znajomo! Odczytujemy wartości tak jak w poprzedniej lekcji, tylko tym razem jest ich znacznie więcej.

```Cpp title="Odczytywanie wartości IMU"
float ax = readAccelX();
float ay = readAccelY();
float az = readAccelZ();
float gx = readGyroX();
float gy = readGyroY();
float gz = readGyroZ();
```

:::note

Każda oś jest faktycznie odczytywana z kilkuset mikrosekundowym opóźnieniem. Jeśli potrzebujesz, aby były aktualizowane jednocześnie, sprawdź funkcje [readAcceleration](./../CanSat-software/library_specification#readacceleration) i [readGyro](./../CanSat-software/library_specification#readgyro).

:::

Po odczytaniu wartości możemy je wydrukować jak zwykle. Można to zrobić za pomocą Serial.print i println tak jak w poprzedniej lekcji, ale ten przykład pokazuje alternatywny sposób drukowania danych, z dużo mniejszą ilością ręcznego pisania.

Najpierw tworzony jest bufor o rozmiarze 128 znaków. Następnie jest on inicjowany tak, aby każda wartość była 0, za pomocą memset. Po tym wartości są zapisywane do bufora za pomocą `snprintf()`, która jest funkcją umożliwiającą zapisanie ciągów znaków w określonym formacie. Na koniec jest to po prostu drukowane za pomocą `Serial.println()`.

```Cpp title="Zaawansowane drukowanie"
char report[128];
memset(report, 0, sizeof(report));
snprintf(report, sizeof(report), "A: %4.2f %4.2f %4.2f    G: %4.2f %4.2f %4.2f",
    ax, ay, az, gx, gy, gz);
Serial.println(report);
```

Jeśli powyższe wydaje się mylące, możesz po prostu użyć bardziej znanego stylu z użyciem print i println. Jednak staje się to trochę uciążliwe, gdy jest wiele wartości do wydrukowania.

```Cpp title="Zwykłe drukowanie"
Serial.print("Ax:");
Serial.println(ay);
// itd.
```

Na koniec ponownie jest krótka przerwa przed ponownym rozpoczęciem pętli. Jest to głównie po to, aby zapewnić, że wyjście jest czytelne - bez opóźnienia liczby zmieniałyby się tak szybko, że trudno byłoby je odczytać.

Przyspieszenie jest odczytywane w jednostkach G, czyli wielokrotnościach $9.81 \text{ m}/\text{s}^2$. Prędkość kątowa jest w jednostkach $\text{mrad}/\text{s}$.

:::tip[Ćwiczenie]

Spróbuj zidentyfikować oś na podstawie odczytów!

:::

## Wykrywanie swobodnego spadku

Jako ćwiczenie, spróbujmy wykryć, czy urządzenie jest w swobodnym spadku. Pomysł polega na tym, że rzucimy płytkę w powietrze, CanSat NeXT wykryje swobodny spadek i włączy diodę LED na kilka sekund po wykryciu zdarzenia swobodnego spadku, abyśmy mogli stwierdzić, że nasza kontrola została uruchomiona nawet po ponownym złapaniu.

Możemy zachować konfigurację taką, jaka była, i skupić się tylko na pętli. Wyczyśćmy starą funkcję pętli i zacznijmy od nowa. Dla zabawy, odczytajmy dane za pomocą alternatywnej metody.

```Cpp title="Odczyt przyspieszenia"
float ax, ay, az;
readAcceleration(ax, ay, az);
```

Zdefiniujmy swobodny spadek jako zdarzenie, gdy całkowite przyspieszenie jest poniżej wartości progowej. Możemy obliczyć całkowite przyspieszenie z poszczególnych osi jako

$$a = \sqrt{a_x^2+a_y^2+a_z^2}$$

Co w kodzie wyglądałoby mniej więcej tak.

```Cpp title="Obliczanie całkowitego przyspieszenia"
float totalSquared = ax*ax+ay*ay+az*az;
float acceleration = Math.sqrt(totalSquared);
```

I chociaż to by działało, należy zauważyć, że obliczanie pierwiastka kwadratowego jest naprawdę wolne obliczeniowo, więc powinniśmy unikać tego, jeśli to możliwe. W końcu możemy po prostu obliczyć

$$a^2 = a_x^2+a_y^2+a_z^2$$

i porównać to do zdefiniowanej wartości progowej.

```Cpp title="Obliczanie całkowitego przyspieszenia kwadratowego"
float totalSquared = ax*ax+ay*ay+az*az;
```

Teraz, gdy mamy wartość, zacznijmy kontrolować diodę LED. Moglibyśmy mieć diodę LED włączoną zawsze, gdy całkowite przyspieszenie jest poniżej wartości progowej, jednak łatwiej byłoby to odczytać, gdyby dioda LED pozostała włączona przez chwilę po wykryciu. Jednym ze sposobów na to jest utworzenie innej zmiennej, nazwijmy ją LEDOnTill, w której po prostu zapisujemy czas, do którego chcemy, aby dioda LED była włączona.

```Cpp title="Zmienna czasomierza"
unsigned long LEDOnTill = 0;
```

Teraz możemy zaktualizować czasomierz, jeśli wykryjemy zdarzenie swobodnego spadku. Użyjmy progu 0.1 na razie. Arduino zapewnia funkcję `millis()`, która zwraca czas od uruchomienia programu w milisekundach.

```Cpp title="Aktualizacja czasomierza"
if(totalSquared < 0.1)
{
LEDOnTill = millis() + 2000;
}
```

Na koniec możemy po prostu sprawdzić, czy obecny czas jest większy czy mniejszy niż określony `LEDOnTill`, i kontrolować diodę LED na tej podstawie. Oto jak wygląda nowa funkcja pętli:

```Cpp title="Funkcja pętli wykrywająca swobodny spadek"
unsigned long LEDOnTill = 0;

void loop() {
  // Odczyt przyspieszenia
  float ax, ay, az;
  readAcceleration(ax, ay, az);

  // Obliczanie całkowitego przyspieszenia (kwadratowego)
  float totalSquared = ax*ax+ay*ay+az*az;
  
  // Aktualizacja czasomierza, jeśli wykryjemy spadek
  if(totalSquared < 0.1)
  {
    LEDOnTill = millis() + 2000;
  }

  // Kontrola diody LED na podstawie czasomierza
  if(LEDOnTill >= millis())
  {
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
}
```

Próbując ten program, możesz zobaczyć, jak szybko teraz reaguje, ponieważ nie mamy opóźnienia w pętli. Dioda LED włącza się natychmiast po opuszczeniu ręki podczas rzutu.

:::tip[Ćwiczenia]

1. Spróbuj ponownie wprowadzić opóźnienie w funkcji pętli. Co się dzieje?
2. Obecnie nie mamy żadnego drukowania w pętli. Jeśli po prostu dodasz instrukcję drukowania do pętli, wyjście będzie naprawdę trudne do odczytania, a drukowanie znacznie spowolni czas cyklu pętli. Czy możesz wymyślić sposób, aby drukować tylko raz na sekundę, nawet jeśli pętla działa nieprzerwanie? Wskazówka: spójrz, jak zaimplementowano czasomierz diody LED.
3. Stwórz własny eksperyment, używając przyspieszenia lub obrotu do wykrycia jakiegoś zdarzenia.

:::

---

W następnej lekcji opuścimy domenę cyfrową i spróbujemy użyć innego stylu czujnika - analogowego miernika światła.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson4)