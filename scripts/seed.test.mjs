import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { seedDevelopment } from './seed.mjs';

// Transport in-memory: uzywa prawdziwego SDK Supabase, ale nie laczy sie z baza uzytkownika.
export function fixture(profileCount = 3) {
  const tableNames = ['profiles', 'faculties', 'courses', 'semesters', 'subjects', 'subject_channels',
    'lecturers', 'subject_lecturers', 'lecturer_comments', 'materials', 'material_reports', 'reported_lecturer_comments'];
  const tables = Object.fromEntries(tableNames.map((table) => [table, []]));
  tables.profiles = Array.from({ length: profileCount }, (_, i) => ({
    id: `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`, username: `student${i + 1}`, role: 'user',
  }));
  tables.faculties.push({ id: 71, name: 'Wydział Informatyki', short_name: 'WI', slug: 'informatyka-wydzial' });
  tables.courses.push({ id: 92, name: 'Informatyka', slug: 'informatyka', faculty_id: 71 });
  const objects = new Map();
  const state = { tables, objects, bucket: null, failUpload: false, failInsert: false, corruptDownload: false, bucketDenied: false };
  let id = 200;
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const fetch = async (input, options = {}) => {
    const url = new URL(input);
    const path = decodeURIComponent(url.pathname);
    const method = options.method ?? 'GET';
    const headers = new Headers(options.headers);
    if (path.startsWith('/storage/v1/bucket')) {
      if (state.bucketDenied) return json({ statusCode: '403', message: 'Access denied' }, 403);
      if (method === 'POST') { state.bucket = JSON.parse(options.body); return json({ name: state.bucket.id }); }
      return state.bucket ? json(state.bucket) : json({ statusCode: '404', message: 'Bucket not found' }, 404);
    }
    if (path.startsWith('/storage/v1/object/')) {
      const key = path.slice('/storage/v1/object/'.length);
      if (method === 'POST') {
        if (state.failUpload) return json({ statusCode: '500', message: 'Upload failed' }, 500);
        assert.equal(headers.get('content-type'), 'application/pdf');
        const metadata = JSON.parse(Buffer.from(headers.get('x-metadata'), 'base64').toString());
        objects.set(key, { bytes: Buffer.from(options.body), metadata });
        return json({ Id: key, Key: key });
      }
      const file = objects.get(key);
      assert(file, `Plik nie istnieje: ${key}`);
      return new Response(state.corruptDownload ? 'uszkodzony' : file.bytes, { headers: { 'Content-Type': 'application/pdf' } });
    }
    assert(path.startsWith('/rest/v1/'), path);
    const table = path.split('/').at(-1);
    assert(tables[table], `Nieznana tabela ${table}`);
    if (method === 'POST') {
      assert.notEqual(table, 'profiles', 'Seed nie moze tworzyc kont ani zmieniac profili');
      if (state.failInsert && table === 'materials') return json({ message: 'Material insert failed' }, 400);
      const row = { id: id++, ...JSON.parse(options.body) };
      assert(!('status_priority' in row), 'Pole generowane nie moze byc wstawiane');
      if (table === 'material_reports') {
        assert(!tables[table].some((item) => item.material_id === row.material_id && item.reported_by === row.reported_by),
          'Jeden uzytkownik moze zglosic material tylko raz');
      }
      if (table === 'subject_lecturers') delete row.id;
      if (table === 'lecturer_comments') {
        assert(row.content.length >= 3 && row.content.length <= 150);
        assert(row.rating >= 1 && row.rating <= 5);
        assert(!tables[table].some((item) => item.user_id === row.user_id && item.lecturer_id === row.lecturer_id));
      }
      tables[table].push(row);
      return json(row, 201);
    }
    assert.equal(method, 'GET', 'Seed nie usuwa ani nie zmienia istniejacych rekordow');
    const start = Number(url.searchParams.get('offset') ?? 0);
    const end = start + Number(url.searchParams.get('limit') ?? 1000);
    return json(tables[table].slice(start, end));
  };
  state.client = createClient('http://seed-test.invalid', 'test-secret-key', {
    global: { fetch }, auth: { persistSession: false, autoRefreshToken: false },
  });
  state.run = () => seedDevelopment(state.client, { log() {} });
  return state;
}

function verifyRelations(tables) {
  const relations = {
    courses: { faculty_id: 'faculties' }, semesters: { course_id: 'courses' }, subjects: { semester_id: 'semesters' },
    subject_channels: { subject_id: 'subjects' }, lecturers: { faculty_id: 'faculties' },
    subject_lecturers: { subject_id: 'subjects', lecturer_id: 'lecturers' },
    lecturer_comments: { lecturer_id: 'lecturers', user_id: 'profiles' },
    materials: { subject_id: 'subjects', uploaded_by: 'profiles' },
    material_reports: { material_id: 'materials', reported_by: 'profiles' },
    reported_lecturer_comments: { coment_id: 'lecturer_comments', reported_by: 'profiles' },
  };
  for (const [table, fields] of Object.entries(relations)) {
    for (const row of tables[table]) {
      for (const [field, target] of Object.entries(fields)) {
        assert(tables[target].some((parent) => parent.id === row[field]), `${table}.${field} bez powiazania`);
      }
    }
  }
}

test('pelny seed, powiazania, pliki, stany puste, paginacja i ponowne uruchomienie', async () => {
  const state = fixture();
  const originalProfiles = structuredClone(state.tables.profiles);
  const result = await state.run();
  const t = state.tables;
  const expected = { faculties: 3, courses: 6, semesters: 42, subjects: 126, subject_channels: 378,
    lecturers: 12, subject_lecturers: 252, lecturer_comments: 27, materials: 90,
    material_reports: 36, reported_lecturer_comments: 18 };
  for (const [table, count] of Object.entries(expected)) assert.equal(t[table].length, count, table);
  assert.deepEqual(t.profiles, originalProfiles);
  assert.equal(t.faculties[0].id, 71);
  assert.equal(t.courses[0].id, 92);
  assert(result.paginationSubject.path.startsWith('/materials/informatyka-wydzial/'));
  assert.equal(result.filesVerified, 90);
  assert.equal(state.bucket.public, false);
  verifyRelations(t);
  const busy = t.materials.filter((row) => row.subject_id === result.paginationSubject.id && row.channel_type === 'lecture');
  assert.equal(busy.length, 13);
  assert(t.material_reports.filter((row) => row.status === 'pending').length > 20);
  assert.equal(t.lecturers.filter((teacher) => !t.lecturer_comments.some((row) => row.lecturer_id === teacher.id)).length, 3);
  assert(t.subjects.some((subject) => !t.materials.some((row) => row.subject_id === subject.id)));
  assert.deepEqual(new Set(t.material_reports.map((row) => row.status)), new Set(['pending', 'resolved', 'rejected']));
  for (const row of t.materials) {
    const file = state.objects.get(`materials/${row.file_path}`);
    assert(file.bytes.subarray(0, 8).toString().startsWith('%PDF-1.4'));
    for (const field of ['subject_id', 'channel_type', 'title', 'file_name']) assert.equal(file.metadata[field], row[field]);
  }
  t.material_reports[0].status = 'resolved';
  const before = structuredClone(t);
  const second = await state.run();
  assert.deepEqual(t, before);
  assert(Object.values(second.added).every((count) => count === 0));
  state.objects.delete(`materials/${t.materials[0].file_path}`);
  await state.run();
  assert.equal(state.objects.size, 90, 'Wznowienie naprawia brakujace pliki');
});

test('dziala z jednym kontem i nie dodaje sztucznych profili', async () => {
  const state = fixture(1);
  await state.run();
  assert.equal(state.tables.profiles.length, 1);
  assert.equal(state.tables.lecturer_comments.length, 9);
  assert.equal(state.tables.reported_lecturer_comments.length, 6);
  assert.equal(state.tables.material_reports.length, 36);
});

test('brak konta lub dostepu do bucketa zatrzymuje seed przed zapisem', async () => {
  const empty = fixture(0);
  await assert.rejects(empty.run(), /Brak profili/);
  assert.equal(empty.tables.lecturers.length, 0);
  assert.equal(empty.bucket, null);
  const denied = fixture(); denied.bucketDenied = true;
  await assert.rejects(denied.run(), /Access denied/);
  assert.equal(denied.tables.lecturers.length, 0);
});

test('blad uploadu lub uszkodzony odczyt nie tworzy materialu', async () => {
  const state = fixture(); state.failUpload = true;
  await assert.rejects(state.run(), /Upload failed/);
  assert.equal(state.tables.materials.length, 0);
  state.failUpload = false; state.corruptDownload = true;
  await assert.rejects(state.run(), /Weryfikacja pliku/);
  assert.equal(state.tables.materials.length, 0);
});

test('blad zapisu po uploadzie mozna naprawic ponownym uruchomieniem', async () => {
  const state = fixture(); state.failInsert = true;
  await assert.rejects(state.run(), /Material insert failed/);
  assert.equal(state.objects.size, 1);
  assert.equal(state.tables.materials.length, 0);
  state.failInsert = false;
  await state.run();
  assert.equal(state.tables.materials.length, 90);
  assert.equal(state.objects.size, 90);
  verifyRelations(state.tables);
});
