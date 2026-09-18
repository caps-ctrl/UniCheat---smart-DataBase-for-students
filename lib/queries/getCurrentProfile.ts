import { createClient } from "@/lib/supabase/server";


export async function getCurrentProfile() {

    const supabase = await createClient();


    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;




    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
            `*,
     faculty:faculties(slug),
      course:courses(slug)`,
        )
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("Błąd pobierania profilu", profileError);
        return null;
    }


    return profile;
}
