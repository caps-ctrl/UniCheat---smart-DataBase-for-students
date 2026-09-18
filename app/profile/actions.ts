"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const nullableText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => value || null);

const nullableUrl = z
  .string()
  .trim()
  .max(300, "Adres URL jest zbyt długi.")
  .refine((value) => value === "" || URL.canParse(value), {
    message: "Wpisz poprawny adres URL.",
  })
  .transform((value) => value || null);

const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Imię jest wymagane.")
    .max(50, "Imię może mieć maksymalnie 50 znaków."),
  lastName: z
    .string()
    .trim()
    .min(1, "Nazwisko jest wymagane.")
    .max(70, "Nazwisko może mieć maksymalnie 70 znaków."),
  bio: nullableText(240),
  interests: z.string().trim().max(500),
  githubUrl: nullableUrl,
  linkedinUrl: nullableUrl,
  university: z
    .string()
    .trim()
    .min(2, "Nazwa uczelni jest wymagana.")
    .max(160, "Nazwa uczelni jest zbyt długa."),
  courseId: z.coerce.number().int().positive("Wybierz kierunek."),
  facultyId: z.coerce.number().int().positive("Wybierz wydział."),
  semester: z.coerce
    .number()
    .int()
    .min(1, "Wybierz semestr.")
    .max(7, "Nieprawidłowy semestr."),
  isPrivate: z.boolean(),
});

export type UpdateProfileState = {
  status: "idle" | "success" | "error";
  message: string;
};



export async function updateProfile(
  _previousState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    bio: formData.get("bio"),
    interests: formData.get("interests"),
    githubUrl: formData.get("githubUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    university: formData.get("university"),
    courseId: formData.get("course"),
    facultyId: formData.get("faculty"),
    semester: formData.get("semester"),
    isPrivate: formData.get("isPrivate") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Sprawdź poprawność danych profilu.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "Zaloguj się ponownie, aby zapisać profil." };
  }

  const {
    firstName,
    lastName,
    bio,
    interests,
    githubUrl,
    linkedinUrl,
    university,
    courseId,
    facultyId,
    semester,
    isPrivate,
  } = parsed.data;

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("faculty_id", facultyId)
    .maybeSingle();

  if (courseError || !course) {
    return {
      status: "error",
      message: "Wybrany kierunek nie należy do wskazanego wydziału.",
    };
  }

  const parsedInterests = Array.from(
    new Set(
      interests
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean),
    ),
  ).slice(0, 20);

  if (parsedInterests.some((interest) => interest.length > 40)) {
    return {
      status: "error",
      message: "Pojedyncze zainteresowanie może mieć maksymalnie 40 znaków.",
    };
  }

  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      full_name: `${firstName} ${lastName}`.trim(),
      bio,
      interests: parsedInterests,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      university,
      course_id: courseId,
      faculty_id: facultyId,
      semester,
      is_profile_public: !isPrivate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !updatedProfile) {
    console.error("Nie udało się zapisać profilu:", error);
    return {
      status: "error",
      message: "Nie udało się zapisać profilu. Spróbuj ponownie.",
    };
  }

  revalidatePath("/profile");

  return { status: "success", message: "Zmiany zostały zapisane." };
}
