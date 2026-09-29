-- =========================================================
-- LOCAL DEV USERS
-- Tylko do lokalnego Supabase / seed.sql
-- =========================================================




-- =========================================================
-- FACULTIES
-- =========================================================

INSERT INTO public.faculties (name, short_name, slug)
VALUES
  ( 'Wydział Informatyki','WI', 'wi');


-- =========================================================
-- COURSES
-- =========================================================

INSERT INTO public.courses ( faculty_id, name, slug)
VALUES
  ( 1, 'Informatyka', 'informatyka');


-- =========================================================
-- SEMESTERS
-- =========================================================

INSERT INTO public.semesters ( course_id, number)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7);


-- =========================================================
-- SUBJECTS
-- =========================================================

INSERT INTO public.subjects
  ( semester_id, name, slug, theme, icon)
VALUES

  -- SEMESTER 1
  (1, 'Matematyka 1', 'matematyka-1', 'blue', 'sigma'),
  (1, 'Podstawy programowania', 'podstawy-programowania', 'ink', 'code'),
  (1, 'Fizyka', 'fizyka', 'violet', 'atom'),

  -- SEMESTER 2
  (2, 'Matematyka 2', 'matematyka-2', 'blue', 'sigma'),
  (2, 'Programowanie obiektowe', 'programowanie-obiektowe', 'ink', 'code'),
  (2, 'Algorytmy i struktury danych', 'algorytmy-i-struktury-danych', 'sand', 'code'),

  -- SEMESTER 3
  (3, 'Bazy danych', 'bazy-danych', 'blue', 'code'),
  (3, 'Programowanie aplikacji internetowych', 'programowanie-aplikacji-internetowych', 'ink', 'code'),
  (3, 'Systemy operacyjne', 'systemy-operacyjne', 'violet', 'code'),

  -- SEMESTER 4
  (4, 'Inżynieria oprogramowania', 'inzynieria-oprogramowania', 'blue', 'code'),
  (4, 'Sieci komputerowe', 'sieci-komputerowe', 'sand', 'code'),

  -- SEMESTER 5
  (5, 'Projektowanie aplikacji', 'projektowanie-aplikacji', 'ink', 'code'),
  (5, 'Bezpieczeństwo systemów', 'bezpieczenstwo-systemow', 'violet', 'code'),

  -- SEMESTER 6
  (6, 'Projekt zespołowy', 'projekt-zespolowy', 'blue', 'code'),
  (6, 'Technologie internetowe', 'technologie-internetowe', 'ink', 'code'),

  -- SEMESTER 7
  (7, 'Praca dyplomowa', 'praca-dyplomowa', 'sand', 'code');


-- =========================================================
-- SUBJECT CHANNELS
-- =========================================================

INSERT INTO public.subject_channels
  (subject_id, type, label)
SELECT
  id,
  'lecture',
  'Wykłady'
FROM public.subjects;


INSERT INTO public.subject_channels
  (subject_id, type, label)
SELECT
  id,
  'lab',
  'Laboratoria'
FROM public.subjects;


INSERT INTO public.subject_channels
  (subject_id, type, label)
SELECT
  id,
  'exercises',
  'Ćwiczenia'
FROM public.subjects;


-- =========================================================
-- MATERIALS
-- =========================================================

-- Celowo puste.
-- Materiały będziemy dodawać podczas testowania aplikacji.


-- =========================================================
-- MATERIAL REPORTS
-- =========================================================

-- Celowo puste.
-- Raporty będą powstawały podczas testowania aplikacji.