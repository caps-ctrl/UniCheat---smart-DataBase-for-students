import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type FacultyOption = Pick<
  Database["public"]["Tables"]["faculties"]["Row"],
  "id" | "name"
>;

type CourseOption = Pick<
  Database["public"]["Tables"]["courses"]["Row"],
  "id" | "name" | "faculty_id"
>;

export type ProfileFormOptions = {
  faculties: FacultyOption[];
  courses: CourseOption[];
};

export async function getProfileFormOptions(): Promise<ProfileFormOptions | null> {
  const supabase = await createClient();

  const [facultiesResult, coursesResult] = await Promise.all([
    supabase.from("faculties").select("id, name").order("name"),
    supabase
      .from("courses")
      .select("id, name, faculty_id")
      .order("name"),
  ]);

  if (facultiesResult.error || coursesResult.error) {
    console.error("Błąd pobierania opcji profilu:", {
      facultiesError: facultiesResult.error,
      coursesError: coursesResult.error,
    });
    return null;
  }

  return {
    faculties: facultiesResult.data,
    courses: coursesResult.data,
  };
}
