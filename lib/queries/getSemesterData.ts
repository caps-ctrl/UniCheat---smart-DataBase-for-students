import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

type SemesterLookup = {
  facultySlug: string;
  courseSlug: string;
  semesterNumber: number;
};

export const getSemesterData = cache(
  async ({ facultySlug, courseSlug, semesterNumber }: SemesterLookup) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("semesters")
      .select(
        `
          number,
          courses!inner(
            slug,
            faculties!inner(slug)
          ),
          subjects(
            id,
            name,
            slug,
            theme,
            icon,
            subject_channels(type, label)
          )
        `,
      )
      .eq("number", semesterNumber)
      .eq("courses.slug", courseSlug)
      .eq("courses.faculties.slug", facultySlug)
      .maybeSingle();

    if (error) {
      console.error("Nie udało się pobrać przedmiotów dla semestru:", error);
      return null;
    }

    if (!data) return null;

    return {
      number: data.number,
      subjects: data.subjects ?? [],
    };
  },
);
