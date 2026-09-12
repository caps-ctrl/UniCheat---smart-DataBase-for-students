import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenCheck, LogIn } from "lucide-react";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import { getCurrentProfile } from "@/lib/queries/getCurrentProfile";
import styles from "./materials.module.css";


export const metadata: Metadata = {
  title: "Materiały studenckie | uniCheat",
  description:
    "Notatki, opracowania, zestawy zadań i materiały przekazane przez poprzednich studentów ZUT.",
};


export default async function MaterialsPage() {
  const profile = await getCurrentProfile();

  if (profile) {
    const faculty = encodeURIComponent(String(profile.faculty?.slug));
    const course = encodeURIComponent(String(profile.course?.slug));
    if (profile?.faculty_id == null || profile.course_id == null) return "TUTAJ DAC LINK DO UZUPELNIENIA PROFILU";
    redirect(`/materials/${faculty}/${course}`);
  }

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
