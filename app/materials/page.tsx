import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenCheck, LogIn } from "lucide-react";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import { createClient } from "@/lib/supabase/server";
import styles from "./materials.module.css";


export const metadata: Metadata = {
  title: "Materiały studenckie | uniCheat",
  description:
    "Notatki, opracowania, zestawy zadań i materiały przekazane przez poprzednich studentów ZUT.",
};

async function getMaterialsDestination() {
  // NOTE: Jeśli ta kontrola będzie używana poza /materials, warto przenieść
  // ją do np. lib/queries/materials-access.ts. Na razie celowo pozostaje lokalna.
  const supabase = await createClient();


  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;




  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `faculty_id,
       course_id,
     faculty:faculties(slug),
      course:courses(slug)`,
    )
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Błąd sprawdzania dostępu do materiałów:", profileError);
    return null;
  }

  if (profile?.faculty_id == null || profile.course_id == null) return null;


  const faculty = encodeURIComponent(String(profile.faculty?.slug));
  const course = encodeURIComponent(String(profile.course?.slug));

  return `/materials/${faculty}/${course}`;
}

export default async function MaterialsPage() {
  const destination = await getMaterialsDestination();

  if (destination) redirect(destination);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <NavBar />

        <section className={styles.accessGate} aria-labelledby="access-title">
          <span className={styles.accessIcon} aria-hidden="true">
            <BookOpenCheck size={34} />
          </span>
          <p className={styles.eyebrow}>Materiały dla Twojego kierunku</p>
          <h1 id="access-title">Zaloguj się, aby otworzyć materiały</h1>
          <p>
            Po zalogowaniu sprawdzimy Twój wydział i kierunek, a następnie
            przeniesiemy Cię prosto do wyboru semestru.
          </p>
          <Link href="/login" className={styles.accessAction}>
            <LogIn size={18} aria-hidden="true" />
            Przejdź do logowania
          </Link>
        </section>
      </div>
    </main>
  );
}
