import { createClient } from '@supabase/supabase-js';
import { pathToFileURL } from 'node:url';
import { FACULTIES, COURSES, LECTURERS, CHANNELS, COMMENTS, slugify } from './lib/seed-data.mjs';
import { createSeedPdf } from './lib/seed-pdf.mjs';

const SEED = 'development-v1';
const PREFIX = `seed/${SEED}`;
const TABLES = ['profiles', 'faculties', 'courses', 'semesters', 'subjects', 'subject_channels',
  'lecturers', 'subject_lecturers', 'lecturer_comments', 'materials', 'material_reports', 'reported_lecturer_comments'];

function checked({ data, error }, operation) {
  if (error) throw new Error(`${operation}: ${error.message}`);
  return data;
}

async function readTable(client, table) {
  const rows = [];
  for (let start = 0; ; start += 500) {
    let query = client.from(table).select('*');
    query = table === 'subject_lecturers'
      ? query.order('subject_id').order('lecturer_id') : query.order('id');
    const page = checked(await query.range(start, start + 499), `Odczyt ${table}`);
    rows.push(...page);
    if (page.length < 500) return rows;
  }
}

export async function seedDevelopment(client, { bucket = 'materials', log = console.log } = {}) {
  // Walidacja dostepnosci wszystkich tabel przed pierwszym zapisem.
  const entries = await Promise.all(TABLES.map(async (table) => [table, await readTable(client, table)]));
  const db = Object.fromEntries(entries);
  if (!db.profiles.length) throw new Error('Brak profili. Utworz przynajmniej jedno konto w aplikacji.');
  const profiles = db.profiles.slice(0, 3);
  const reportsPerMaterial = Math.min(2, profiles.length);
  const added = Object.fromEntries(TABLES.filter((table) => table !== 'profiles').map((table) => [table, 0]));
  const now = Date.now();
  const ago = (hours) => new Date(now - hours * 3600_000).toISOString();
  const status = (index) => ['pending', 'pending', 'pending', 'resolved', 'rejected'][index % 5];
  const summary = { added, filesVerified: 0, selectedCourses: [], paginationSubject: null };

  async function ensure(table, matches, row) {
    const found = db[table].filter(matches);
    if (found.length > 1) throw new Error(`Niejednoznaczne dane w ${table}; znaleziono ${found.length} pasujacych rekordow.`);
    if (found[0]) return found[0];
    const inserted = checked(await client.from(table).insert(row).select('*').single(), `Zapis ${table}`);
    db[table].push(inserted);
    added[table]++;
    return inserted;
  }

  const bucketResult = await client.storage.getBucket(bucket);
  if (bucketResult.error) {
    const code = String(bucketResult.error.statusCode ?? bucketResult.error.status);
    if (code !== '404') checked(bucketResult, 'Odczyt bucketa');
    checked(await client.storage.createBucket(bucket, {
      public: false, allowedMimeTypes: ['application/pdf'], fileSizeLimit: 20 * 1024 * 1024,
    }), 'Utworzenie bucketa');
  }
  const storage = client.storage.from(bucket);
  let materialIndex = 0;

  async function materialFor(subject, channel, edition = 1) {
    const filePath = `${PREFIX}/subject-${subject.id}/${channel.type}-${edition}.pdf`;
    const previous = db.materials.find((row) => row.file_path === filePath);
    if (previous && (previous.subject_id !== subject.id || previous.channel_type !== channel.type)) {
      throw new Error(`Metadane nie pasuja do sciezki ${filePath}.`);
    }
    const title = previous?.title ?? `${subject.name} - ${channel.title}${edition > 1 ? ` ${edition}` : ''}`;
    const fileName = previous?.file_name ?? `${subject.slug}-${channel.type}-${edition}.pdf`;
    const bytes = createSeedPdf({ title, subject: subject.name, channel: channel.type, fileName });
    checked(await storage.upload(filePath, bytes, {
      contentType: 'application/pdf', cacheControl: '0', upsert: true,
      metadata: { seed: SEED, title, file_name: fileName, subject_id: subject.id, channel_type: channel.type },
    }), `Upload ${filePath}`);
    const blob = checked(await storage.download(filePath), `Odczyt pliku ${filePath}`);
    if (blob.type.split(';')[0] !== 'application/pdf' || !Buffer.from(await blob.arrayBuffer()).equals(bytes)) {
      throw new Error(`Weryfikacja pliku nie powiodla sie: ${filePath}`);
    }
    summary.filesVerified++;
    const material = await ensure('materials', (row) => row.file_path === filePath, {
      subject_id: subject.id, channel_type: channel.type, title, file_name: fileName, file_path: filePath,
      uploaded_by: profiles[materialIndex % profiles.length].id, created_at: ago(24 + materialIndex * 7),
    });
    // 36 zgloszen, w tym ponad 20 pending, do testow paginacji moderatora.
    if (materialIndex < 36 / reportsPerMaterial) {
      for (let i = 0; i < reportsPerMaterial; i++) {
        const reason = `[seed:${SEED}:${i + 1}] ${i === 0 ? 'Podejrzenie bledow w tresci materialu.' : 'Material wymaga weryfikacji praw autorskich.'}`;
        const reporter = profiles[(materialIndex + i + 1) % profiles.length].id;
        await ensure('material_reports', (row) => row.material_id === material.id && row.reported_by === reporter, {
          material_id: material.id, reported_by: reporter,
          reason, status: status(materialIndex * reportsPerMaterial + i), created_at: ago(1 + materialIndex * 2 + i),
        });
      }
    }
    materialIndex++;
  }

  for (const [facultyIndex, definition] of FACULTIES.entries()) {
    const faculty = await ensure('faculties', (row) => row.slug === definition.slug
      || row.short_name.toLowerCase() === definition.short_name.toLowerCase()
      || slugify(row.name) === slugify(definition.name), {
      name: definition.name, short_name: definition.short_name, slug: definition.slug,
    });
    const teachers = [];
    for (let i = 0; i < 4; i++) {
      const teacherIndex = facultyIndex * 4 + i;
      const [first_name, last_name, academic_title] = LECTURERS[teacherIndex];
      const slug = `demo-${slugify(first_name)}-${slugify(last_name)}`;
      const teacher = await ensure('lecturers', (row) => row.slug === slug, {
        first_name, last_name, academic_title, slug, faculty_id: faculty.id,
        email: i === 3 ? null : `${slug}@example.invalid`, profile_url: null,
      });
      teachers.push(teacher);
      // Czwarty wykladowca na kazdym wydziale pozostaje bez opinii.
      if (i === 3) continue;
      for (const [profileIndex, profile] of profiles.entries()) {
        const comment = await ensure('lecturer_comments', (row) => row.lecturer_id === teacher.id && row.user_id === profile.id, {
          lecturer_id: teacher.id, user_id: profile.id,
          content: COMMENTS[(teacherIndex + profileIndex) % COMMENTS.length],
          rating: 1 + ((teacherIndex + profileIndex * 2) % 5),
          created_at: ago(12 + teacherIndex * 13 + profileIndex), updated_at: ago(2 + teacherIndex),
        });
        if (i >= 2) continue;
        const reason = `[seed:${SEED}] Prosba o sprawdzenie zgodnosci opinii z regulaminem.`;
        const reporter = profiles[(profileIndex + 1) % profiles.length].id;
        await ensure('reported_lecturer_comments', (row) => row.coment_id === comment.id && row.reported_by === reporter, {
          coment_id: comment.id, reason, reported_by: reporter,
          status: status(teacherIndex + profileIndex), created_at: ago(2 + teacherIndex + profileIndex),
        });
      }
    }

    for (const courseSlug of definition.courses) {
      const courseDefinition = COURSES[courseSlug];
      const course = await ensure('courses', (row) => row.faculty_id === faculty.id
        && (row.slug === courseSlug || slugify(row.name) === slugify(courseDefinition.name)), {
        faculty_id: faculty.id, name: courseDefinition.name, slug: courseSlug,
      });
      summary.selectedCourses.push(course.id);
      for (const [semesterIndex, names] of courseDefinition.semesters.entries()) {
        const semester = await ensure('semesters', (row) => row.course_id === course.id && row.number === semesterIndex + 1, {
          course_id: course.id, number: semesterIndex + 1,
        });
        for (const [subjectIndex, name] of names.entries()) {
          const slug = slugify(name);
          const subject = await ensure('subjects', (row) => row.semester_id === semester.id && row.slug === slug, {
            semester_id: semester.id, name, slug,
            icon: facultyIndex === 0 ? (subjectIndex === 0 ? 'sigma' : 'code') : facultyIndex === 1 ? 'atom' : 'sigma',
            theme: ['blue', 'ink', 'violet', 'sand'][(semesterIndex + subjectIndex) % 4],
          });
          for (const channel of CHANNELS) {
            await ensure('subject_channels', (row) => row.subject_id === subject.id && row.type === channel.type, {
              subject_id: subject.id, type: channel.type, label: channel.label,
            });
          }
          for (const teacher of [teachers[(semesterIndex + subjectIndex) % 4], teachers[(semesterIndex + subjectIndex + 1) % 4]]) {
            await ensure('subject_lecturers', (row) => row.subject_id === subject.id && row.lecturer_id === teacher.id, {
              subject_id: subject.id, lecturer_id: teacher.id,
            });
          }
          // Pierwsze 3 semestry sa wypelnione; kolejne sluza tez do testow pustych list.
          if (semesterIndex < 3) {
            await materialFor(subject, CHANNELS[0]);
            if (subjectIndex === 0) await materialFor(subject, CHANNELS[1]);
            if (semesterIndex === 0 && subjectIndex === 0) {
              await materialFor(subject, CHANNELS[2]);
              if (!summary.paginationSubject) {
                summary.paginationSubject = { id: subject.id, name: subject.name,
                  path: `/materials/${faculty.slug}/${course.slug}/1/${subject.slug}` };
                for (let edition = 2; edition <= 13; edition++) await materialFor(subject, CHANNELS[0], edition);
              }
            }
          }
        }
      }
      log(`OK ${faculty.short_name} / ${course.name}: 7 semestrow z przedmiotami i kanalami.`);
    }
  }
  log('Dodane rekordy:', added);
  log(`Sprawdzone pliki PDF: ${summary.filesVerified}. Paginacja materialow: ${summary.paginationSubject.path}`);
  return summary;
}

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Ustaw URL Supabase oraz SUPABASE_SECRET_KEY lub SUPABASE_SERVICE_ROLE_KEY w .env.local. Instrukcja: supabase/SEED.md.');
  }
  if (key.startsWith('sb_publishable_')) throw new Error('Seed wymaga klucza secret lub service_role, nie publishable.');
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  await seedDevelopment(client, { bucket: process.env.SUPABASE_MATERIALS_BUCKET ?? 'materials' });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`Seed przerwany: ${error.message}`);
    console.error('Po poprawieniu przyczyny uruchom npm run seed ponownie; uzupelni brakujace dane.');
    process.exitCode = 1;
  });
}
