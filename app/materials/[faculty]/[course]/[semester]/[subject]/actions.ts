"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const channelTypes = ["lecture", "lab", "exercises"] as const;

const materialSchema = z.object({
  subjectId: z.number().int().positive(),
  channelType: z.enum(channelTypes),
  title: z.string().trim().min(3).max(120),
  filePath: z.string().min(1).max(500),
  fileName: z.string().min(1).max(255),
  pagePath: z.string().startsWith("/materials/").max(700),
});

export type AddMaterialInput = z.infer<typeof materialSchema>;

export type AddMaterialResult = {
  success: boolean;
  message: string;
};

function databaseErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("row-level security")) {
    return "Nie masz uprawnień do dodania materiału. Sprawdź polityki RLS tabeli materials.";
  }

  if (normalized.includes("schema cache")) {
    return "Tabela materials nie jest jeszcze dostępna przez Supabase Data API.";
  }

  return "Plik został wysłany, ale nie udało się zapisać materiału w bazie.";
}

export async function addMaterial(
  input: AddMaterialInput,
): Promise<AddMaterialResult> {
  const parsed = materialSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Dane materiału są nieprawidłowe." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Zaloguj się, aby dodać materiał.",
    };
  }

  const { subjectId, channelType, title, filePath, fileName, pagePath } =
    parsed.data;
  const expectedPrefix = `${user.id}/${subjectId}/`;

  if (!filePath.startsWith(expectedPrefix) || filePath.includes("..")) {
    return { success: false, message: "Nieprawidłowa ścieżka pliku." };
  }

  const { data: channel, error: channelError } = await supabase
    .from("subject_channels")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("type", channelType)
    .maybeSingle();

  if (channelError || !channel) {
    const bucket = process.env.SUPABASE_MATERIALS_BUCKET ?? "materials";
    await supabase.storage.from(bucket).remove([filePath]);

    return {
      success: false,
      message: "Wybrana sekcja nie należy do tego przedmiotu.",
    };
  }

  const { error } = await supabase.from("materials").insert({
    title,
    subject_id: subjectId,
    channel_type: channelType,
    uploaded_by: user.id,
    file_path: filePath,
    file_name: fileName,
  });

  if (error) {
    const bucket = process.env.SUPABASE_MATERIALS_BUCKET ?? "materials";
    await supabase.storage.from(bucket).remove([filePath]);

    console.error("Nie udało się zapisać materiału:", error);
    return { success: false, message: databaseErrorMessage(error.message) };
  }

  revalidatePath(pagePath);

  return {
    success: true,
    message: "Materiał został dodany.",
  };
}
