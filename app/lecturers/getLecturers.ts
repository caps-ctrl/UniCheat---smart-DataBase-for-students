import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type Lecturer = {
  id: number;
  slug: string;
  academic_title: string | null;
  email: string | null;
  first_name: string;
  last_name: string;
  profile_url: string | null;
  subjects: Array<{
    id: number;
    name: string;
  }>;
};

export type LecturerProfile = Omit<Lecturer, "subjects"> & {
  faculty: {
    id: number;
    name: string;
    short_name: string;
    slug: string;
  } | null;
  subjects: Array<{
    id: number;
    name: string;
    slug: string;
    semester: {
      number: number;
      course: {
        slug: string;
        faculty: {
          slug: string;
        } | null;
      } | null;
    } | null;
  }>;
};

export type LecturerComment = {
  id: number;
  lecturer_id: number;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
  author: {
    username: string;
  } | null;
};

export type LecturerRatingSummary = {
  average: number | null;
  count: number;
};

export async function getLecturers(): Promise<Lecturer[]> {
  // Lokalny plik database.types.ts nie odzwierciedla jeszcze aktualnego
  // schematu tabeli lecturers, dlatego zapytanie opieramy na typie wyniku poniżej.
  const supabase: SupabaseClient = await createClient();
  const { data, error } = await supabase
    .from("lecturers")
    .select(
      "id, slug, academic_title, email, first_name, last_name, profile_url, subjects(id, name)",
    )
    .order("last_name")
    .order("first_name");

  if (error) {
    throw new Error(`Nie udało się pobrać wykładowców: ${error.message}`);
  }
  return data;
}

export async function getLecturerBySlug(
  slug: string,
): Promise<LecturerProfile | null> {
  const supabase: SupabaseClient = await createClient();
  const { data, error } = await supabase
    .from("lecturers")
    .select(
      "id, slug, academic_title, email, first_name, last_name, profile_url, faculty:faculties(id, name, short_name, slug), subjects(id, name, slug, semester:semesters(number, course:courses(slug, faculty:faculties(slug))))",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Nie udało się pobrać wykładowcy: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const subjects = data.subjects.map((subject) => {
    const semester = Array.isArray(subject.semester)
      ? (subject.semester[0] ?? null)
      : subject.semester;
    const course = semester
      ? Array.isArray(semester.course)
        ? (semester.course[0] ?? null)
        : semester.course
      : null;
    const faculty = course
      ? Array.isArray(course.faculty)
        ? (course.faculty[0] ?? null)
        : course.faculty
      : null;

    return {
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      semester: semester
        ? {
          number: semester.number,
          course: course
            ? {
              slug: course.slug,
              faculty: faculty ? { slug: faculty.slug } : null,
            }
            : null,
        }
        : null,
    };
  });

  return {
    ...data,
    faculty: Array.isArray(data.faculty)
      ? (data.faculty[0] ?? null)
      : data.faculty,
    subjects,
  } as LecturerProfile;
}

export async function getLecturerComments(
  lecturerId: number,
): Promise<LecturerComment[]> {
  const supabase: SupabaseClient = await createClient();
  const { data, error } = await supabase
    .from("lecturer_comments")
    .select("id, lecturer_id, user_id, content, rating, created_at, author:profiles(username)")
    .is("deleted_at", null)
    .eq("lecturer_id", lecturerId)
    .order("created_at", { ascending: false })
    .limit(50);
  console.log("getLecturerComments data:", data);

  if (error) {
    throw new Error(`Nie udało się pobrać komentarzy: ${error.message}`);
  }

  return data.map((comment) => ({
    ...comment,
    author: Array.isArray(comment.author)
      ? (comment.author[0] ?? null)
      : comment.author,
  }));
}

export async function getLecturerRatingSummary(
  lecturerId: number,
): Promise<LecturerRatingSummary> {
  const supabase: SupabaseClient = await createClient();
  const pageSize = 1000;
  let lastSeenId = 0;
  let ratingSum = 0;
  let ratingCount = 0;

  while (true) {
    const { data, error } = await supabase
      .from("lecturer_comments")
      .select("id, rating")
      .is("deleted_at", null)
      .eq("lecturer_id", lecturerId)
      .gt("id", lastSeenId)
      .order("id", { ascending: true })
      .limit(pageSize);

    if (error) {
      throw new Error(`Nie udało się obliczyć średniej ocen: ${error.message}`);
    }

    for (const comment of data) {
      ratingSum += comment.rating;
      ratingCount += 1;
    }

    if (data.length < pageSize) {
      break;
    }

    lastSeenId = data[data.length - 1].id;
  }

  return {
    average:
      ratingCount > 0
        ? Math.round((ratingSum / ratingCount) * 10) / 10
        : null,
    count: ratingCount,
  };
}
