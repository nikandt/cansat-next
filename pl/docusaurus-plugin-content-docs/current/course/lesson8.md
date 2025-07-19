---
sidebar_position: 9
---

# Lekcja 8: Płynne przejścia

Tematem tej lekcji jest kontrola przepływu, czyli jak możemy zarządzać tym, co procesor robi w różnych momentach czasu. Do tej pory większość naszych programów skupiała się na pojedynczym zadaniu, co, choć proste, ogranicza potencjał systemu. Wprowadzając różne **stany** w naszym programie, możemy rozszerzyć jego możliwości.

Na przykład, program mógłby mieć stan przedstartowy, w którym satelita czeka na start. Następnie mógłby przejść do trybu lotu, gdzie odczytuje dane z czujników i wykonuje swoją główną misję. Na koniec może aktywować się tryb odzyskiwania, w którym satelita wysyła sygnały pomagające w odzyskiwaniu — migające światła, sygnały dźwiękowe lub wykonywanie zaprojektowanych przez nas działań systemowych.

**Wyzwalacz** zmiany między stanami może się różnić. Może to być odczyt z czujnika, jak zmiana ciśnienia, polecenie zewnętrzne, zdarzenie wewnętrzne (takie jak timer) lub nawet przypadkowe zdarzenie, w zależności od wymagań. W tej lekcji zbudujemy na podstawie tego, czego nauczyliśmy się wcześniej, używając zewnętrznego polecenia jako wyzwalacza.

## Kontrola przepływu z zewnętrznymi wyzwalaczami

Najpierw zmodyfikujmy kod stacji naziemnej, aby mogła odbierać wiadomości z monitora szeregowego, dzięki czemu będziemy mogli wysyłać niestandardowe polecenia w razie potrzeby.

Jak widać, jedyne zmiany są w głównej pętli. Najpierw sprawdzamy, czy są dane odebrane z Serial. Jeśli nie, nic się nie dzieje i pętla trwa dalej. Jednak jeśli są dane, są one odczytywane do zmiennej, drukowane dla przejrzystości, a następnie wysyłane przez radio do satelity. Jeśli nadal masz program z poprzedniej lekcji wgrany do satelity, możesz go wypróbować.

```Cpp title="Stacja naziemna zdolna do wysyłania poleceń"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedMessage = Serial.readStringUntil('\n'); 

    Serial.print("Odebrano polecenie: ");
    Serial.println(receivedMessage);

    sendData(receivedMessage);  
  }
}

void onDataReceived(String data)
{
  Serial.println(data);
}
```

:::info

## Serial In - Źródła danych

Kiedy odczytujemy dane z obiektu `Serial`, uzyskujemy dostęp do danych przechowywanych w buforze UART RX, które są przesyłane przez połączenie USB Virtual Serial. W praktyce oznacza to, że każde oprogramowanie zdolne do komunikacji przez wirtualny port szeregowy, takie jak Arduino IDE, programy terminalowe czy różne środowiska programistyczne, może być używane do wysyłania danych do CanSat.

Otwiera to wiele możliwości kontrolowania CanSat z zewnętrznych programów. Na przykład, możemy wysyłać polecenia, wpisując je ręcznie, ale także pisać skrypty w Pythonie lub innych językach, aby zautomatyzować polecenia, co umożliwia tworzenie bardziej zaawansowanych systemów sterowania. Wykorzystując te narzędzia, można wysyłać precyzyjne instrukcje, przeprowadzać testy lub monitorować CanSat w czasie rzeczywistym bez ręcznej interwencji.

:::

Następnie spójrzmy na stronę satelity. Ponieważ mamy wiele stanów w programie, staje się on nieco dłuższy, ale rozbijmy go krok po kroku.

Najpierw inicjalizujemy systemy jak zwykle. Mamy również kilka zmiennych globalnych, które umieszczamy na początku pliku, aby łatwo było zobaczyć, jakie nazwy są używane. `LED_IS_ON` jest znane z naszych poprzednich przykładów kodu, a dodatkowo mamy globalną zmienną stanu `STATE`, która przechowuje... cóż, stan.

```Cpp title="Inicjalizacja"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}
```
Następnie w pętli po prostu sprawdzamy, która podprocedura powinna być wykonana zgodnie z bieżącym stanem, i wywołujemy jej funkcję:

```Cpp title="Pętla"
void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // nieznany tryb
    delay(1000);
  }
}
```

W tym szczególnym przypadku każdy stan jest reprezentowany przez osobną funkcję, która jest wywoływana na podstawie stanu. Zawartość funkcji nie jest tutaj naprawdę istotna, ale oto one:

```Cpp title="Podprocedury"
void preLaunch() {
  Serial.println("Czekam...");
  sendData("Czekam...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}
```

Jest również mała funkcja pomocnicza `blinkLED`, która pomaga uniknąć powtarzania kodu, obsługując przełączanie LED za nas.

Na koniec stan zmienia się, gdy stacja naziemna nam to powie:

```Cpp title="Callback odbierający polecenie"
void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```

<details>
  <summary>Cały kod</summary>
  <p>Oto cały kod dla Twojej wygody.</p>
```Cpp title="Satelita z wieloma stanami"
#include "CanSatNeXT.h"

bool LED_IS_ON = false;
int STATE = 0;

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}


void loop() {
  if(STATE == 0)
  {
    preLaunch();
  }else if(STATE == 1)
  {
    flight_mode();
  }else if(STATE == 2){
    recovery_mode();
  }else{
    // nieznany tryb
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Czekam...");
  sendData("Czekam...");
  blinkLED();
  
  delay(1000);
}

void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}


void recovery_mode()
{
  blinkLED();
  delay(500);
}

void blinkLED()
{
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}

void onDataReceived(String data)
{
  Serial.println(data);
  if(data == "PRELAUNCH")
  {
    STATE = 0;
  }
  if(data == "FLIGHT")
  {
    STATE = 1;
  }
  if(data == "RECOVERY")
  {
    STATE = 2;
  }
}
```
</details>

Dzięki temu możemy teraz kontrolować, co robi satelita, nawet nie mając do niego fizycznego dostępu. Zamiast tego możemy po prostu wysłać polecenie ze stacji naziemnej, a satelita zrobi to, czego chcemy.

:::tip[Ćwiczenie]

Utwórz program, który mierzy czujnik z określoną częstotliwością, którą można zmienić za pomocą zdalnego polecenia na dowolną wartość. Zamiast używać podprocedur, spróbuj bezpośrednio zmodyfikować wartość opóźnienia za pomocą polecenia.

Spróbuj również uczynić go odpornym na nieoczekiwane dane wejściowe, takie jak "-1", "ABCDFEG" czy "".

Jako ćwiczenie dodatkowe, spraw, aby nowe ustawienie było trwałe między resetami, tak aby po wyłączeniu i ponownym włączeniu satelita wznowił nadawanie z nową częstotliwością zamiast powracać do oryginalnej. Jako wskazówka, przydatne może być ponowne przejrzenie [lekcji 5](./lesson5.md).

:::

---

W następnej lekcji uczynimy nasze przechowywanie danych, komunikację i obsługę znacznie bardziej efektywnymi i szybki, używając danych binarnych. Choć na początku może się to wydawać abstrakcyjne, obsługa danych jako binarnych zamiast liczb upraszcza wiele zadań, ponieważ jest to język natywny komputera.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson9)