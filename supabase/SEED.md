# Pełny seed deweloperski uniCheat

## Uruchomienie

Wymagany Node.js 22+, zainstalowane zależności (`npm install`), aktualny schemat
bazy oraz przynajmniej jedno konto utworzone przez aplikację.

Ustaw w ignorowanym przez Git pliku `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TWOJ-PROJEKT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_MATERIALS_BUCKET=materials
```

Można użyć `SUPABASE_SERVICE_ROLE_KEY` zamiast `SUPABASE_SECRET_KEY`.
Klucz secret/service_role jest administracyjnym kluczem API projektu. Nie używaj
przed nim prefiksu `NEXT_PUBLIC_` i nie dodawaj go do kodu przeglądarki.
Zwykły klucz publishable/anon nie wystarczy do seeda.

Z katalogu projektu:

```sh
npm run seed
```

To samodzielny skrypt Node: nie wymaga wklejania SQL ani uruchamiania strony.
Korzysta z istniejącego schematu i Storage API. Nie zmienia polityk RLS ani
uprawnień profili. Uruchamiaj go na bazie przeznaczonej do pracy i testów.

## Zestaw danych

| Obszar | Docelowa liczba w katalogu seeda |
| --- | ---: |
| Wydziały | 3 |
| Kierunki | 6 |
| Semestry | 42 (po 7 na kierunek) |
| Przedmioty | 126 (po 3 na semestr) |
| Kanały przedmiotów | 378 |
| Fikcyjni wykładowcy | 12 (po 4 na wydział) |
| Powiązania wykładowców z przedmiotami | 252 |
| Materiały z plikami PDF w Storage | 90 |
| Zgłoszenia materiałów | 36 |
| Opinie o wykładowcach | 9–27 |
| Zgłoszenia opinii | 6–18 |

Kierunki: Informatyka, Informatyka stosowana, Elektrotechnika, Automatyka
i robotyka, Ekonomia, Zarządzanie. Wydziały: Informatyki, Elektryczny, Ekonomiczny.
To katalog demonstracyjny, a nie oficjalny program studiów.

Istniejące wydziały i kierunki są rozpoznawane po nazwie/slugach (wydziały także
po skrócie). Ich identyfikatory i nazwy pozostają bez zmian. Liczby w tabeli
obejmują również rozpoznane istniejące rekordy; dodatkowe własne rekordy
spoza katalogu seeda pozostają w bazie. Skrypt wypisuje liczbę faktycznie dodanych
rekordów każdej tabeli.

Seed używa maksymalnie trzech istniejących profili do autorstwa i zgłoszeń.
Działa także z jednym profilem; wtedy ma 9 opinii i 6 zgłoszeń opinii.
Nie tworzy użytkowników Auth ani profili, nie zmienia ról, wydziałów i kierunków
przypisanych do kont. Przy jednym koncie część zgłoszeń dotyczy własnej treści.
Do testowania interakcji między użytkownikami przydadzą się trzy konta utworzone
zwykłą rejestracją w aplikacji.

## Co można przetestować

- Nawigację przez wszystkie 7 semestrów każdego kierunku.
- Wszystkie rodzaje kanałów, ikon i motywów przedmiotów.
- Podgląd i pobieranie prawdziwych PDF-ów dla pierwszych trzech semestrów.
- Puste sekcje: późniejsze semestry mają przedmioty i kanały, ale bez materiałów;
  część kanałów ćwiczeń również jest pusta.
- Limit listy materiałów: pierwszy przedmiot ma 13 plików w kanale wykładów.
  Skrypt wypisuje ścieżkę do niego.
- Listę i profil wykładowcy: kontakty dostępne i puste, różne tytuły naukowe,
  przedmioty prowadzone przez dwóch wykładowców, oceny od 1 do 5.
- Brak opinii u trzech wykładowców; pozostali mają opinie.
- Moderację: oba typy zgłoszeń, statusy pending/resolved/rejected,
  ponad 20 oczekujących zgłoszeń materiałów, zróżnicowane daty.

Wykładowcy i opinie są fikcyjni, e-maile używają domeny `example.invalid`.
PDF-y są oznaczone jako demonstracyjne; nie są rzeczywistymi rozwiązaniami
zadań. Nazwy w treści PDF-ów są transliterowane do ASCII, a w tabelach i
metadanych Storage pozostają polskie znaki.

## Zgodność plików z bazą i ponawianie

Pliki trafiają do `SUPABASE_MATERIALS_BUCKET` (domyślnie `materials`),
ze ścieżkami `seed/development-v1/subject-ID/KANAL-NUMER.pdf`.
Nowy bucket jest prywatny i dopuszcza PDF-y; ustawienia istniejącego bucketa
pozostają bez zmian. Podgląd w aplikacji używa istniejących signed URLs.

Każdy plik jest wysyłany przez Storage API z MIME `application/pdf` i metadanymi
`title`, `file_name`, `subject_id`, `channel_type`, `seed`. Skrypt pobiera go
ponownie i porównuje MIME oraz zawartość bajt po bajcie. Dopiero wtedy zapisuje
nowy rekord `materials` wskazujący dokładnie tę ścieżkę. `status_priority`
w zgłoszeniach pozostaje wyliczane przez bazę.

Możesz powtarzać `npm run seed`: brakujące rekordy zostaną uzupełnione,
bez resetowania statusów zgłoszeń, zmodyfikowanych opinii i profili.
Pliki w przestrzeni nazw seeda zostaną nadpisane, aby naprawić ich brak
lub uszkodzenie. Pozostałe pliki w buckecie nie są dotykane.
Nie uruchamiaj dwóch kopii seeda jednocześnie.

Nie ma wspólnej transakcji pomiędzy Storage a bazą: po błędzie może pozostać
częściowy zestaw danych lub plik bez rekordu. Po usunięciu przyczyny błędu
ponów polecenie; skrypt uzupełni resztę. Nie czyści danych automatycznie.

## Sprawdzenie skryptu bez połączenia z Twoją bazą

```sh
npm run seed:check
```

Testy używają prawdziwego SDK Supabase z lokalnym transportem w pamięci.
Sprawdzają powiązania, metadane plików, ponawianie, brak duplikatów,
zachowanie statusów i błędy uploadu/odczytu/zapisu.
