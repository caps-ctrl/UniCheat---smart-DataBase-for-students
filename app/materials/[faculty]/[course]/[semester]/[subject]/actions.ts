"use server";

import { uploadRateLimit } from "@/lib/redis/rateLimit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const channelTypes = ["lecture", "lab", "exercises"] as const;
//przenies do schema i dodac obostrzenia do file
const materialSchema = z.object({
  subjectId: z.number().int().positive(),
  channelType: z.enum(channelTypes),
  title: z.string().trim().min(3).max(100),
  file: z.file(),
  fileName: z.string().min(1).max(255),
  pagePath: z.string().startsWith("/materials/").max(700),
});

type AddMaterialInput = {

  subjectId: number;

  channelType: string;

  title: string;

  file: File;

  fileName: string;

  pagePath: string;

};

export type AddMaterialResult = {
  success: boolean;
  message: string;
};

//polaczyc error message
function storageErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("bucket not found")) {
    return "Nie znaleziono bucketa materiałów w Supabase Storage.";
  }

  if (
    normalized.includes("row-level security") ||
    normalized.includes("unauthorized")
  ) {
    return "Nie masz uprawnień do wysłania pliku. Sprawdź polityki Storage.";
  }

  return "Nie udało się wysłać pliku. Spróbuj ponownie.";
}

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

  const { success } = await uploadRateLimit.limit(user.id);

  if (!success) {
    return {
      success: false,
      message: "Osiągnięto limit przesyłania materiałów. Spróbuj ponownie za kilka minut.",
    };
  }

  const { subjectId, channelType, title, fileName, pagePath, file } =
    parsed.data;

  const filePath = `materials/subjects/${subjectId}/${crypto.randomUUID()}-${fileName}`;


  const { error: uploadError } = await supabase.storage
    .from("materials")
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) {

    return { success: false, message: storageErrorMessage(uploadError.message) };
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
