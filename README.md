<div align="center">
  <img src="./public/icons/uniCheat.svg" alt="Logo uniCheat" width="180" />

  <h1>uniCheat</h1>

  <p>
    Platforma edukacyjna tworzona dla studentów<br />
    Zachodniopomorskiego Uniwersytetu Technologicznego w Szczecinie.
  </p>

  <p>
    <strong>Materiały • profile studentów • wykładowcy • społeczność</strong>
  </p>
</div>

---

## O projekcie

**uniCheat** porządkuje akademicką wiedzę w jednym miejscu. Użytkownik może utworzyć konto, skonfigurować swój wydział i kierunek, przechodzić przez semestry oraz przedmioty, a następnie przeglądać i udostępniać materiały innym studentom.

Projekt rozwijany jest jako aplikacja full-stack w Next.js. Warstwa uwierzytelniania, baza danych oraz pliki korzystają z Supabase, natomiast limity operacji obsługuje Upstash Redis.




### Konto i bezpieczeństwo

- rejestracja i logowanie przez Supabase Auth,
- potwierdzanie adresu e-mail przez callback PKCE/OTP,
- sesja SSR przechowywana w ciasteczkach i odświeżana przez Next.js Proxy,
- Cloudflare Turnstile w formularzach uwierzytelniania,
- walidacja formularzy przy użyciu Zod,
- ograniczanie liczby prób logowania i rejestracji przez Upstash Redis.

### Profil studenta

- dane osobowe i opis użytkownika,
- zainteresowania oraz odnośniki do GitHub i LinkedIn,
- wybór uczelni, wydziału, kierunku i semestru,
- publiczny lub prywatny profil,
- responsywny panel ustawień.

### Materiały edukacyjne

- ścieżka: **wydział → kierunek → semestr → przedmiot**,
- osobne kanały dla wykładów, laboratoriów i ćwiczeń,
- przesyłanie plików do Supabase Storage,
- lista materiałów z podglądem i pobieraniem przez czasowe signed URLs,
- limit przesyłania plików,
- zgłaszanie nieodpowiednich lub uszkodzonych materiałów,
- automatyczne dopasowanie katalogu materiałów do profilu studenta.

### Pozostałe moduły

- katalog wykładowców z wyszukiwaniem i profilami,
- widok społeczności studenckiej,
- sekcja FAQ,
- animowany landing page prezentujący platformę.

## Stan implementacji

| Obszar | Źródło danych | Stan |
| --- | --- | --- |
| Uwierzytelnianie | Supabase Auth | Podłączone |
| Profil użytkownika | Supabase Database | Podłączone |
| Wydziały, kierunki, semestry i przedmioty | Supabase Database | Podłączone |
| Materiały i zgłoszenia | Supabase Database + Storage | Podłączone |
| Limity operacji | Upstash Redis | Podłączone |
| Katalog wykładowców | Dane lokalne w `data/lecturers` | Wersja demonstracyjna |
| Społeczność | Dane lokalne w komponencie | Wersja demonstracyjna |

## Stack technologiczny

| Warstwa | Technologie |
| --- | --- |
| Framework | Next.js 16, App Router, React 19 |
| Język | TypeScript |
| Style | Tailwind CSS 4, CSS Modules, shadcn, Base UI |
| Backend | Server Components, Server Actions, Route Handlers |
| Uwierzytelnianie | Supabase Auth, `@supabase/ssr` |
| Dane | PostgreSQL przez Supabase Data API |
| Pliki | Supabase Storage |
| Walidacja | Zod |
| Rate limiting | Upstash Redis, `@upstash/ratelimit` |
| CAPTCHA | Cloudflare Turnstile |
| Animacje | Framer Motion, Lenis, Lottie |
| Ikony | Lucide React |

## Wymagania

Przed uruchomieniem przygotuj:

- Node.js 20 lub nowszy,
- npm,
- projekt Supabase,
- bazę Upstash Redis,
- widget Cloudflare Turnstile.

## Uruchomienie lokalne

1. Sklonuj repozytorium i przejdź do jego katalogu:

   ```bash
   git clone <adres-repozytorium>
   cd zutlearning
   ```

2. Zainstaluj zależności:

   ```bash
   npm install
   ```

3. Utwórz plik `.env.local`:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=twoj_publishable_key

   # Adres aplikacji używany w linkach potwierdzających e-mail
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Cloudflare Turnstile
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=twoj_site_key

   # Upstash Redis — nazwy wymagane przez Redis.fromEnv()
   UPSTASH_REDIS_REST_URL=https://twoja-baza.upstash.io
   UPSTASH_REDIS_REST_TOKEN=twoj_token

   # Opcjonalne; domyślna wartość to "materials"
   SUPABASE_MATERIALS_BUCKET=materials
   ```

4. Uruchom środowisko developerskie:

   ```bash
   npm run dev
   ```

5. Otwórz [http://localhost:3000](http://localhost:3000).

## Konfiguracja Supabase

Repozytorium zawiera wygenerowane typy bazy w `lib/database.types.ts`, ale nie zawiera kompletnego zestawu migracji. Projekt oczekuje następujących tabel:

- `profiles`,
- `faculties`,
- `courses`,
- `semesters`,
- `subjects`,
- `subject_channels`,
- `materials`,
- `material_reports`.

W Supabase należy dodatkowo:

1. Utworzyć prywatny bucket Storage o nazwie `materials`.
2. Włączyć RLS dla tabel dostępnych przez Data API.
3. Dodać polityki umożliwiające użytkownikowi odczyt potrzebnych danych oraz zarządzanie własnym profilem i materiałami.
4. Skonfigurować callback uwierzytelniania:

   ```text
   http://localhost:3000/auth/confirm
   ```

5. W ustawieniach Supabase Auth skonfigurować Cloudflare Turnstile przy użyciu odpowiadającego mu secret key.

Materiały są udostępniane przez signed URLs ważne przez godzinę, dlatego bucket nie musi być publiczny.

## Skrypty

| Polecenie | Działanie |
| --- | --- |
| `npm run dev` | Uruchamia serwer developerski z hot reloadem |
| `npm run build` | Tworzy zoptymalizowany build produkcyjny i sprawdza typy |
| `npm run start` | Uruchamia wcześniej zbudowaną wersję produkcyjną |
| `npm run lint` | Uruchamia ESLint dla całego projektu |

Przed wysłaniem zmian warto wykonać:

```bash
npm run lint
npm run build
```

## Główne trasy

| Trasa | Opis |
| --- | --- |
| `/` | Landing page projektu |
| `/login` | Logowanie |
| `/register` | Rejestracja |
| `/profile` | Ustawienia profilu zalogowanego użytkownika |
| `/materials` | Wejście do materiałów i konfiguracja ścieżki studiów |
| `/materials/[faculty]/[course]` | Lista semestrów kierunku |
| `/materials/[faculty]/[course]/[semester]` | Przedmioty wybranego semestru |
| `/materials/[faculty]/[course]/[semester]/[subject]` | Materiały konkretnego przedmiotu |
| `/lecturer` | Katalog wykładowców |
| `/lecturer/[slug]` | Profil wykładowcy |
| `/spolecznosc` | Widok społeczności |
| `/faq` | Najczęściej zadawane pytania |

## Struktura projektu

```text
zutlearning/
├── app/                    # Trasy App Routera, strony i Server Actions
│   ├── auth/               # Logowanie, rejestracja i callback Auth
│   ├── materials/          # Nawigacja akademicka i materiały
│   ├── profile/            # Profil oraz ustawienia użytkownika
│   ├── lecturer/           # Katalog i profile wykładowców
│   ├── spolecznosc/        # Moduł społeczności
│   └── faq/                # FAQ
├── components/             # Komponenty współdzielone, layout i UI
├── data/                   # Lokalne dane demonstracyjne
├── lib/
│   ├── queries/            # Zapytania do Supabase
│   ├── redis/              # Klient i limity Upstash
│   └── supabase/           # Klienci browser/server oraz obsługa sesji
├── public/                 # Ikony i animacje Lottie
├── proxy.ts                # Odświeżanie sesji i ochrona tras
└── lib/database.types.ts   # Typy wygenerowane ze schematu Supabase
```

## Architektura uwierzytelniania

```text
Przeglądarka
    │
    ▼
Next.js Proxy ── weryfikacja claims i odświeżanie cookies
    │
    ▼
Server Components / Server Actions
    │
    ├── Supabase Auth
    ├── Supabase Database
    ├── Supabase Storage
    └── Upstash Redis
```

Proxy chroni trasę `/profile` i przekierowuje zalogowanych użytkowników z `/login` oraz `/register` do ich profilu. Operacje modyfikujące dane ponownie sprawdzają użytkownika po stronie serwera — dostęp nie opiera się wyłącznie na przekierowaniu.

## Zasady pracy z projektem

- Nie zapisuj sekretów ani plików `.env*` w repozytorium.
- Po zmianie schematu Supabase zaktualizuj `lib/database.types.ts`.
- Wszystkie nowe tabele dostępne przez Data API powinny mieć włączone RLS.
- Waliduj dane zarówno w interfejsie, jak i w Server Actions.
- Dla plików i operacji użytkownika zachowuj limity oraz kontrolę właściciela zasobu.

## Dalszy rozwój

Najbliższe naturalne kierunki rozwoju projektu:

- przeniesienie forum społeczności do bazy danych,
- podłączenie katalogu wykładowców i opinii do Supabase,
- panel moderacji materiałów i zgłoszeń,
- trwała obsługa zdjęć profilowych,
- testy jednostkowe, integracyjne i end-to-end,
- automatyczne migracje oraz seed danych akademickich.

---

<div align="center">
  Tworzone z myślą o studentach ZUT.
</div>
