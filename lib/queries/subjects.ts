import { cache } from "react"
import type { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/server"






export const getSubjects = cache(async (semesterId: number) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester_id", semesterId);

    if (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }

    return data;
});