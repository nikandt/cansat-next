---
sidebar_position: 8
---

# Lekcja 7: Odpowiadanie

CanSaty są często programowane do działania na dość prostych zasadach - na przykład wykonywania pomiarów co n milisekund, zapisywania i przesyłania danych oraz powtarzania tego procesu. W przeciwieństwie do tego, wysyłanie poleceń do satelity w celu zmiany jego zachowania w trakcie misji mogłoby umożliwić wiele nowych możliwości. Być może chciałbyś włączyć lub wyłączyć czujnik, lub nakazać satelicie wydanie dźwięku, aby móc go znaleźć. Istnieje wiele możliwości, ale być może najważniejszą jest możliwość włączenia urządzeń o dużym poborze mocy w satelicie tuż przed startem rakiety, co daje znacznie większą elastyczność i swobodę działania po zintegrowaniu satelity z rakietą.

W tej lekcji spróbujmy włączyć i wyłączyć diodę LED na płytce satelity za pomocą stacji naziemnej. Reprezentuje to scenariusz, w którym satelita nie robi nic bez polecenia, i zasadniczo ma prosty system komend.

:::info

## Wywołania zwrotne oprogramowania

Odbiór danych w bibliotece CanSat jest zaprogramowany jako **wywołania zwrotne**, czyli funkcja, która jest wywoływana... cóż, z powrotem, gdy wystąpi określone zdarzenie. Podczas gdy do tej pory w naszych programach kod zawsze podążał dokładnie za liniami, które napisaliśmy, teraz okazuje się, że okazjonalnie wykonuje inną funkcję pomiędzy, zanim kontynuuje w głównej pętli. Może to brzmieć myląco, ale będzie to dość jasne, gdy zobaczymy to w akcji.

:::

## Zdalne Miganie

W tym ćwiczeniu spróbujmy powtórzyć miganie diodą LED z pierwszej lekcji, ale tym razem dioda LED jest faktycznie kontrolowana zdalnie.

Najpierw spójrzmy na program po stronie satelity. Inicjalizacja jest już dobrze znana, ale pętla jest nieco zaskakująca - nie ma w niej nic. Dzieje się tak, ponieważ cała logika jest obsługiwana przez funkcję wywołania zwrotnego zdalnie ze stacji naziemnej, więc możemy po prostu zostawić pętlę pustą.

Ciekawsze rzeczy dzieją się w funkcji `onDataReceived(String data)`. Jest to wspomniana wcześniej funkcja wywołania zwrotnego, która jest zaprogramowana w bibliotece, aby być wywoływana za każdym razem, gdy radio odbiera jakiekolwiek dane. Nazwa funkcji jest zaprogramowana w bibliotece, więc dopóki używasz dokładnie tej samej nazwy, co tutaj, zostanie wywołana, gdy dostępne są dane.

W poniższym przykładzie dane są drukowane za każdym razem, aby zobrazować, co się dzieje, ale stan diody LED jest również zmieniany za każdym razem, gdy wiadomość jest odbierana, niezależnie od jej treści.

```Cpp title="Kod satelity, który nic nie robi bez polecenia"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  CanSatInit(28);
}

void loop() {}


bool LED_IS_ON = false;
void onDataReceived(String data)
{
  Serial.println(data);
  if(LED_IS_ON)
  {
    digitalWrite(LED, LOW);
  }else{
    digitalWrite(LED, HIGH);
  }
  LED_IS_ON = !LED_IS_ON;
}
```

:::note

Zmienna `LED_IS_ON` jest przechowywana jako zmienna globalna, co oznacza, że jest dostępna z każdego miejsca w kodzie. Zazwyczaj są one źle widziane w programowaniu, a początkujący są uczeni, aby ich unikać w swoich programach. Jednak w programowaniu _wbudowanym_, takim jak to, które tu wykonujemy, są one faktycznie bardzo efektywnym i oczekiwanym sposobem działania. Uważaj tylko, aby nie używać tej samej nazwy w wielu miejscach!

:::

Jeśli wgramy to na płytkę CanSat NeXT i uruchomimy... Nic się nie dzieje. Jest to oczywiście oczekiwane, ponieważ w tej chwili nie mamy żadnych przychodzących poleceń.

Po stronie stacji naziemnej kod nie jest zbyt skomplikowany. Inicjalizujemy system, a następnie w pętli wysyłamy wiadomość co 1000 ms, czyli raz na sekundę. W obecnym programie rzeczywista wiadomość nie ma znaczenia, ważne jest tylko, że coś jest wysyłane w tej samej sieci.

```Cpp title="Stacja naziemna wysyłająca wiadomości"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
}

void loop() {
  delay(1000);
  sendData("Message from ground station");
}
```

Teraz, gdy zaprogramujemy ten kod do stacji naziemnej (nie zapomnij nacisnąć przycisku BOOT) i satelita jest nadal włączony, dioda LED na satelicie zaczyna migać, włączając się i wyłączając po każdej wiadomości. Wiadomość jest również drukowana na terminalu.

:::tip[Ćwiczenie]

Wgraj poniższy fragment kodu do płytki stacji naziemnej. Co dzieje się po stronie satelity? Czy możesz zmienić program satelity tak, aby reagował tylko włączając diodę LED po otrzymaniu `LED ON` i wyłączając ją po `LED OFF`, a w przeciwnym razie tylko drukował tekst.

```Cpp title="Stacja naziemna wysyłająca wiadomości"
#include "CanSatNeXT.h"

void setup() {
  Serial.begin(115200);
  GroundStationInit(28);
  randomSeed(analogRead(0));
}

String messages[] = {
  "LED ON",
  "LED OFF",
  "Do nothing, this is just a message",
  "Hello to CanSat!",
  "Woop woop",
  "Get ready!"
};

void loop() {
  delay(400);
  
  // Generowanie losowego indeksu do wyboru wiadomości
  int randomIndex = random(0, sizeof(messages) / sizeof(messages[0]));
  
  // Wysyłanie losowo wybranej wiadomości
  sendData(messages[randomIndex]);
}
```

:::

Zauważ również, że odbieranie wiadomości nie blokuje ich wysyłania, więc moglibyśmy (i będziemy) wysyłać wiadomości z obu końców jednocześnie. Satelita może ciągle przesyłać dane, podczas gdy stacja naziemna może nadal wysyłać polecenia do satelity. Jeśli wiadomości są jednoczesne (w tej samej milisekundzie lub podobnie), może dojść do kolizji i wiadomość nie przejdzie. Jednak CanSat NeXT automatycznie ponownie wyśle wiadomość, jeśli wykryje kolizję. Więc po prostu uważaj, że może się to zdarzyć, ale najprawdopodobniej pozostanie to niezauważone.

---

W następnej lekcji rozszerzymy to, aby wykonać **kontrolę przepływu** zdalnie, czyli zmieniać zachowanie satelity na podstawie otrzymanych poleceń.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson8)