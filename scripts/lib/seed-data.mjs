// Fikcyjny katalog do testow, nie oficjalny program studiow.
export const FACULTIES = [
  { name: 'Wydział Informatyki', short_name: 'WI', slug: 'wi', courses: ['informatyka', 'informatyka-stosowana'] },
  { name: 'Wydział Elektryczny', short_name: 'WE', slug: 'we', courses: ['elektrotechnika', 'automatyka-i-robotyka'] },
  { name: 'Wydział Ekonomiczny', short_name: 'WEK', slug: 'wek', courses: ['ekonomia', 'zarzadzanie'] },
];
export const COURSES = {
  'informatyka': { name: 'Informatyka', semesters: [
    ['Matematyka 1', 'Podstawy programowania', 'Fizyka'],
    ['Matematyka 2', 'Programowanie obiektowe', 'Algorytmy i struktury danych'],
    ['Bazy danych', 'Systemy operacyjne', 'Sieci komputerowe'],
    ['Inżynieria oprogramowania', 'Aplikacje internetowe', 'Grafika komputerowa'],
    ['Bezpieczeństwo systemów', 'Sztuczna inteligencja', 'Aplikacje mobilne'],
    ['Systemy rozproszone', 'Projekt zespołowy', 'Testowanie oprogramowania'],
    ['Seminarium dyplomowe', 'Praca dyplomowa', 'Praktyki zawodowe'],
  ] },
  'informatyka-stosowana': { name: 'Informatyka stosowana', semesters: [
    ['Analiza matematyczna', 'Wprowadzenie do informatyki', 'Logika'],
    ['Algebra liniowa', 'Programowanie w Pythonie', 'Statystyka'],
    ['Projektowanie baz danych', 'Analiza danych', 'Technologie WWW'],
    ['Wizualizacja danych', 'Uczenie maszynowe', 'Projektowanie interfejsów'],
    ['Przetwarzanie obrazów', 'Chmura obliczeniowa', 'Hurtownie danych'],
    ['Projekt aplikacji', 'Przetwarzanie języka naturalnego', 'Kontrola jakości'],
    ['Seminarium dyplomowe', 'Praca inżynierska', 'Praktyki zawodowe'],
  ] },
  'elektrotechnika': { name: 'Elektrotechnika', semesters: [
    ['Matematyka dla inżynierów', 'Fizyka techniczna', 'Podstawy elektrotechniki'],
    ['Teoria obwodów', 'Metrologia elektryczna', 'Materiały elektrotechniczne'],
    ['Maszyny elektryczne', 'Elektronika', 'Pomiary elektryczne'],
    ['Energoelektronika', 'Instalacje elektryczne', 'Technika cyfrowa'],
    ['Napędy elektryczne', 'Elektroenergetyka', 'Odnawialne źródła energii'],
    ['Automatyka napędów', 'Projekt instalacji', 'Diagnostyka urządzeń'],
    ['Seminarium dyplomowe', 'Praca inżynierska', 'Praktyki przemysłowe'],
  ] },
  'automatyka-i-robotyka': { name: 'Automatyka i robotyka', semesters: [
    ['Matematyka', 'Podstawy mechaniki', 'Wstęp do automatyki'],
    ['Teoria sterowania', 'Elektronika analogowa', 'Programowanie sterowników'],
    ['Robotyka', 'Czujniki i przetworniki', 'Układy cyfrowe'],
    ['Sterowanie procesami', 'Systemy wbudowane', 'Sieci przemysłowe'],
    ['Roboty mobilne', 'Wizja maszynowa', 'Projektowanie układów sterowania'],
    ['Projekt robota', 'Systemy SCADA', 'Bezpieczeństwo maszyn'],
    ['Seminarium dyplomowe', 'Praca inżynierska', 'Praktyki zawodowe'],
  ] },
  'ekonomia': { name: 'Ekonomia', semesters: [
    ['Mikroekonomia', 'Matematyka w ekonomii', 'Wprowadzenie do finansów'],
    ['Makroekonomia', 'Statystyka opisowa', 'Rachunkowość'],
    ['Ekonometria', 'Finanse publiczne', 'Analiza ekonomiczna'],
    ['Ekonomia międzynarodowa', 'Rynek kapitałowy', 'Prawo gospodarcze'],
    ['Polityka gospodarcza', 'Bankowość', 'Prognozowanie gospodarcze'],
    ['Analiza inwestycji', 'Projekt badawczy', 'Ekonomia sektora publicznego'],
    ['Seminarium dyplomowe', 'Praca dyplomowa', 'Praktyki zawodowe'],
  ] },
  'zarzadzanie': { name: 'Zarządzanie', semesters: [
    ['Podstawy zarządzania', 'Ekonomia dla menedżerów', 'Komunikacja biznesowa'],
    ['Marketing', 'Finanse przedsiębiorstwa', 'Zachowania organizacyjne'],
    ['Zarządzanie projektami', 'Analiza rynku', 'Zarządzanie zasobami ludzkimi'],
    ['Logistyka', 'Zarządzanie jakością', 'Prawo pracy'],
    ['Strategia przedsiębiorstwa', 'Przedsiębiorczość', 'Negocjacje'],
    ['Projekt biznesowy', 'Zarządzanie zmianą', 'Systemy informacyjne'],
    ['Seminarium dyplomowe', 'Praca dyplomowa', 'Praktyki zawodowe'],
  ] },
};
export const LECTURERS = [
  ['Anna', 'Malinowska', 'dr inż.'], ['Michał', 'Wysocki', 'dr hab. inż.'],
  ['Karolina', 'Zielińska', 'mgr inż.'], ['Tomasz', 'Brzozowski', null],
  ['Paweł', 'Jankowski', 'dr inż.'], ['Alicja', 'Sokołowska', 'dr hab. inż.'],
  ['Jakub', 'Lis', 'mgr inż.'], ['Natalia', 'Kwiatkowska', 'dr inż.'],
  ['Ewa', 'Kamińska', 'dr'], ['Piotr', 'Mazur', 'dr hab.'],
  ['Monika', 'Dąbrowska', 'mgr'], ['Adam', 'Woźniak', 'dr'],
];
export const CHANNELS = [
  { type: 'lecture', label: 'Wykłady', title: 'Notatki z wykładu' },
  { type: 'lab', label: 'Laboratoria', title: 'Instrukcja laboratorium' },
  { type: 'exercises', label: 'Ćwiczenia', title: 'Zestaw ćwiczeń' },
];
export const COMMENTS = [
  'Bardzo przejrzyste wyjaśnienia i dużo praktycznych przykładów. [demo]',
  'Zajęcia są wymagające, ale kryteria zaliczenia podano jasno. [demo]',
  'Przydałoby się więcej czasu na omówienie rozwiązań zadań. [demo]',
  'Materiały pomagają w nauce, konsultacje były przydatne. [demo]',
  'Tempo zajęć było dla mnie zbyt szybkie. [demo]',
  'Dobry kontakt i konkretne wskazówki do projektu. [demo]',
];
export function slugify(value) {
  return value.toLowerCase().replaceAll('ł', 'l').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
