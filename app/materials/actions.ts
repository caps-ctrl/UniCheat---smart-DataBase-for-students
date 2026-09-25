"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const studySelectionSchema = z.object({
  facultyId: z.coerce.number().int().positive("Wybierz wydział."),
  courseId: z.coerce.number().int().positive("Wybierz kierunek."),
});

export type StudySelectionState = {
  status: "idle" | "error";
  message: string;
  errors?: {
    facultyId?: string[];
    courseId?: string[];
  };
};

export async function saveStudySelection(
  _previousState: StudySelectionState,
  formData: FormData,
): Promise<StudySelectionState> {
  const parsed = studySelectionSchema.safeParse({
    facultyId: formData.get("facultyId"),
    courseId: formData.get("courseId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Wybierz wydział i kierunek, aby przejść dalej.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    return {
      status: "error",
      message: "Sesja wygasła. Zaloguj się ponownie.",
    };
  }

  const { facultyId, courseId } = parsed.data;
  const [facultyResult, courseResult] = await Promise.all([
    supabase
      .from("faculties")
      .select("id, slug")
      .eq("id", facultyId)
      .maybeSingle(),
    supabase
      .from("courses")
      .select("id, slug, faculty_id")
      .eq("id", courseId)
      .eq("faculty_id", facultyId)
      .maybeSingle(),
  ]);

  if (
    facultyResult.error ||
    courseResult.error ||
    !facultyResult.data ||
    !courseResult.data
  ) {
    return {
      status: "error",
      message: "Wybrany kierunek nie należy do wskazanego wydziału.",
    };
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      faculty_id: facultyId,
      course_id: courseId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedProfile) {
    console.error("Nie udało się zapisać kierunku użytkownika:", updateError);
    return {
      status: "error",
      message: "Nie udało się zapisać wyboru. Spróbuj ponownie.",
    };
  }

  revalidatePath("/materials");
  revalidatePath("/profile");

  redirect(
    `/materials/${encodeURIComponent(facultyResult.data.slug)}/${encodeURIComponent(courseResult.data.slug)}`,
  );
}
