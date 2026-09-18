"use server";


import { reportRateLimit } from "../redis/rateLimit";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const reportMaterialSchema = z.object({
    materialId: z
        .number()
        .int("Nieprawidłowy materiał")
        .positive("Nieprawidłowy materiał"),
    reason: z
        .string()
        .trim()
        .min(3, "Powód zgłoszenia musi mieć co najmniej 3 znaki")
        .max(200, "Powód zgłoszenia może mieć maksymalnie 200 znaków"),
});

export async function reportMaterial(
    materialId: number,
    reason: string
) {


    const parsed = reportMaterialSchema.safeParse({ materialId, reason });

    if (!parsed.success) {
        throw new Error(
            parsed.error.issues[0]?.message ?? "Nieprawidłowe dane zgłoszenia"
        );
    }

    const { materialId: validatedMaterialId, reason: normalizedReason } =
        parsed.data;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Musisz być zalogowany");
    }

    const { success } = await reportRateLimit.limit(user.id)

    if (!success) {
        throw new Error(
            "Osiągnięto limit zgłoszeń. Spróbuj ponownie za kilka minut."
        );
    }
    const { error } = await supabase
        .from("material_reports")
        .insert({
            material_id: validatedMaterialId,
            reported_by: user.id,
            reason: normalizedReason,
        });

    if (error) {
        throw new Error("Nie udało się wysłać zgłoszenia. Spróbuj ponownie.");
    }
}
