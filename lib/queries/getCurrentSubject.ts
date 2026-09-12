import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getCurrentSubject = cache(
  async (
    facultySlug: string,
    courseSlug: string,
    semesterNumber: number,
    subjectSlug: string,
  ) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("subjects")
      .select(
        `
          name,
          slug,
          theme,
          icon,
          subject_channels(type, label),
          semesters!inner(
            number,
            courses!inner(
              slug,
              faculties!inner(slug)
            )
          )
        `,
      )
      .eq("slug", subjectSlug)
      .eq("semesters.number", semesterNumber)
      .eq("semesters.courses.slug", courseSlug)
      .eq("semesters.courses.faculties.slug", facultySlug)
      .maybeSingle();

    if (error) {
      console.error("Nie udało się pobrać wybranego przedmiotu:", error);
      return null;
    }

    if (!data) return null;

    return {
      semester: { number: data.semesters.number },
      subject: {
        name: data.name,
        slug: data.slug,
        theme: data.theme,
        icon: data.icon,
        subject_channels: data.subject_channels ?? [],
      },
    };
  },
);
