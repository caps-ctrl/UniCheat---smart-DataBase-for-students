"use server";

import { createClient } from "@/lib/supabase/server";

export async function reportMaterial(
    materialId: number,
    reason: string
) {
    const normalizedReason = reason.trim();

    if (!Number.isInteger(materialId) || materialId <= 0) {
        throw new Error("Nieprawidłowy materiał");
    }

    if (normalizedReason.length < 3 || normalizedReason.length > 500) {
        throw new Error("Powód zgłoszenia musi mieć od 3 do 500 znaków");
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Musisz być zalogowany");
    }

    const { error } = await supabase
        .from("material_reports")
        .insert({
            material_id: materialId,
            reported_by: user.id,
            reason: normalizedReason,
        });

    if (error) {
        throw new Error("Nie udało się wysłać zgłoszenia. Spróbuj ponownie.");
    }
}
