---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Lekcja 10: Dziel i rządź

W miarę jak nasze projekty stają się bardziej szczegółowe, kod może stać się trudny do zarządzania, chyba że będziemy ostrożni. W tej lekcji przyjrzymy się praktykom, które pomogą utrzymać większe projekty w ryzach. Obejmują one dzielenie kodu na wiele plików, zarządzanie zależnościami, a na koniec wprowadzenie kontroli wersji do śledzenia zmian, tworzenia kopii zapasowych kodu i wspomagania współpracy.

## Dzielenie kodu na wiele plików

W małych projektach umieszczenie całego kodu źródłowego w jednym pliku może wydawać się w porządku, ale w miarę jak projekt się rozrasta, rzeczy mogą stać się chaotyczne i trudniejsze do zarządzania. Dobrym rozwiązaniem jest podzielenie kodu na różne pliki w oparciu o funkcjonalność. Kiedy jest to dobrze zrobione, tworzy to również ładne małe moduły, które można ponownie wykorzystać w różnych projektach bez wprowadzania niepotrzebnych komponentów do innych projektów. Jedną z wielkich zalet wielu plików jest również to, że ułatwiają współpracę, ponieważ inne osoby mogą pracować nad innymi plikami, pomagając uniknąć sytuacji, w których kod jest trudny do scalania.

Poniższy tekst zakłada, że używasz Arduino IDE 2. Zaawansowani użytkownicy mogą czuć się bardziej komfortowo z systemami takimi jak [Platformio](https://platformio.org/), ale ci z was będą już zaznajomieni z tymi koncepcjami.

W Arduino IDE 2 wszystkie pliki w folderze projektu są wyświetlane jako karty w IDE. Nowe pliki można tworzyć bezpośrednio w IDE lub za pośrednictwem systemu operacyjnego. Istnieją trzy różne typy plików: **nagłówki** `.h`, **pliki źródłowe** `.cpp` i **pliki Arduino** `.ino`.

Spośród tych trzech, pliki Arduino są najłatwiejsze do zrozumienia. Są to po prostu dodatkowe pliki, które są kopiowane na końcu głównego skryptu `.ino` podczas kompilacji. Dzięki temu można je łatwo wykorzystać do tworzenia bardziej zrozumiałych struktur kodu i zajmować całą potrzebną przestrzeń dla skomplikowanej funkcji bez utrudniania czytania pliku źródłowego. Najlepszym podejściem jest zazwyczaj wzięcie jednej funkcjonalności i zaimplementowanie jej w jednym pliku. Można na przykład mieć osobny plik dla każdego trybu operacyjnego, jeden plik do transferu danych, jeden plik do interpretacji poleceń, jeden plik do przechowywania danych i jeden główny plik, w którym łączy się to wszystko w funkcjonalny skrypt.

Nagłówki i pliki źródłowe są nieco bardziej wyspecjalizowane, ale na szczęście działają tak samo jak w C++ gdzie indziej, więc istnieje wiele materiałów napisanych na temat ich używania, na przykład [tutaj](https://www.learncpp.com/cpp-tutorial/header-files/).

## Przykładowa struktura

Jako przykład, weźmy chaotyczny kod z [Lekcji 8](./lesson8.md) i zrefaktorujmy go.

<details>
  <summary>Oryginalny chaotyczny kod z Lekcji 8</summary>
  <p>Oto cały kod dla twojej frustracji.</p>
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
    // unknown mode
    delay(1000);
  }
}

void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
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

To nawet nie jest takie złe, ale można zobaczyć, jak mogłoby stać się poważnie trudne do odczytania, gdybyśmy rozwijali funkcjonalności lub dodawali nowe polecenia do interpretacji. Zamiast tego podzielmy to na schludne, oddzielne pliki kodu w oparciu o oddzielne funkcjonalności.

Podzieliłem każdy z trybów operacyjnych na osobny plik, dodałem plik do interpretacji poleceń i na koniec stworzyłem mały plik narzędziowy, aby przechowywać funkcjonalność potrzebną w wielu miejscach. To dość typowa prosta struktura projektu, ale już sprawia, że program jako całość jest znacznie łatwiejszy do zrozumienia. Można to dodatkowo wspomóc dobrą dokumentacją i stworzeniem na przykład wykresu, który pokazuje, jak pliki są ze sobą powiązane.

<Tabs>
  <TabItem value="main" label="main.ino" default>

```Cpp title="Główny szkic"
#include "CanSatNeXT.h"

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
    delay(1000);
  }
}
```
  </TabItem>
  <TabItem value="preLaunch" label="mode_prelaunch.ino" default>

```Cpp title="Tryb przedstartowy"
void preLaunch() {
  Serial.println("Waiting...");
  sendData("Waiting...");
  blinkLED();
  
  delay(1000);
}
```
  </TabItem>
      <TabItem value="flight_mode" label="mode_flight.ino" default>

```Cpp title="Tryb lotu"
void flight_mode(){
  sendData("WEEE!!!");
  float LDR_voltage = analogReadVoltage(LDR);
  sendData(LDR_voltage);
  blinkLED();

  delay(100);
}
```
  </TabItem>
    <TabItem value="recovery" label="mode_recovery.ino" default>

```Cpp title="Tryb odzyskiwania"
void recovery_mode()
{
  blinkLED();
  delay(500);
}
```
  </TabItem>
    <TabItem value="interpret" label="command_interpretation.ino" default>

```Cpp title="Interpretacja poleceń"
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
  </TabItem>
    <TabItem value="utils" label="utils.ino" default>

```Cpp title="Narzędzia"
bool LED_IS_ON = false;

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
```
  </TabItem>

</Tabs>

Chociaż to podejście jest już o wiele lepsze niż posiadanie jednego pliku na wszystko, nadal wymaga starannego zarządzania. Na przykład **przestrzeń nazw** jest współdzielona między różnymi plikami, co może powodować zamieszanie w większym projekcie lub podczas ponownego użycia kodu. Jeśli istnieją funkcje lub zmienne o tych samych nazwach, kod nie wie, której użyć, co prowadzi do konfliktów lub nieoczekiwanego zachowania.

Dodatkowo, to podejście nie sprzyja **enkapsulacji** — co jest kluczowe dla budowania bardziej modułowego i wielokrotnego użytku kodu. Kiedy wszystkie twoje funkcje i zmienne istnieją w tej samej globalnej przestrzeni, staje się trudniej zapobiec, aby jedna część kodu nie wpływała przypadkowo na inną. Tutaj wchodzą w grę bardziej zaawansowane techniki, takie jak przestrzenie nazw, klasy i programowanie obiektowe (OOP). Te tematy wykraczają poza zakres tego kursu, ale zachęcamy do indywidualnego badania tych tematów.

:::tip[Ćwiczenie]

Weź jeden ze swoich poprzednich projektów i odśwież go! Podziel swój kod na wiele plików i zorganizuj swoje funkcje w oparciu o ich role (np. zarządzanie czujnikami, obsługa danych, komunikacja). Zobacz, jak dużo czystszy i łatwiejszy do zarządzania staje się twój projekt!

:::

## Kontrola wersji

W miarę jak projekty rosną — a zwłaszcza gdy pracuje nad nimi wiele osób — łatwo jest stracić ślad zmian lub przypadkowo nadpisać (lub przepisać) kod. Właśnie tutaj wkracza **kontrola wersji**. **Git** to standardowe narzędzie do kontroli wersji, które pomaga śledzić zmiany, zarządzać wersjami i organizować duże projekty z wieloma współpracownikami.

Nauka Gita może wydawać się przytłaczająca, a nawet zbędna dla małych projektów, ale mogę obiecać, że podziękujesz sobie za jego naukę. Później będziesz się zastanawiać, jak kiedykolwiek sobie radziłeś bez niego!

Oto świetne miejsce, aby zacząć: [Rozpoczęcie pracy z Git](https://docs.github.com/en/get-started/getting-started-with-git).

Istnieje kilka dostępnych usług Git, z popularnymi w tym:

[GitHub](https://github.com/)

[GitLab](https://about.gitlab.com/)

[BitBucket](https://bitbucket.org/product/)

GitHub to solidny wybór ze względu na swoją popularność i obfitość dostępnego wsparcia. W rzeczywistości ta strona internetowa i biblioteki [CanSat NeXT](https://github.com/netnspace/CanSatNeXT_library) są hostowane na GitHubie.

Git nie jest tylko wygodny — to niezbędna umiejętność dla każdego, kto pracuje profesjonalnie w inżynierii lub nauce. Większość zespołów, w których będziesz pracować, będzie używać Gita, więc warto uczynić jego używanie znajomym nawykiem.

Więcej samouczków na temat Gita:

[https://www.w3schools.com/git/](https://www.w3schools.com/git/)

[https://git-scm.com/docs/gittutorial/](https://git-scm.com/docs/gittutorial/)

:::tip[Ćwiczenie]

Utwórz repozytorium Git dla swojego projektu CanSat i wypchnij swój kod do nowego repozytorium. To pomoże ci rozwijać oprogramowanie zarówno dla satelity, jak i stacji naziemnej w zorganizowany, współpracujący sposób.

:::

---

W następnej lekcji porozmawiamy o różnych sposobach rozszerzenia CanSat o zewnętrzne czujniki i inne urządzenia.

[Kliknij tutaj, aby przejść do następnej lekcji!](./lesson11)