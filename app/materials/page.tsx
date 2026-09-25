import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpenCheck, LogIn } from "lucide-react";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import { getCurrentProfile } from "@/lib/queries/getCurrentProfile";
import { getProfileFormOptions } from "@/lib/queries/getProfileFormOptions";
import StudySelectionForm from "./StudySelectionForm";
import styles from "./materials.module.css";


export const metadata: Metadata = {
  title: "Materiały studenckie | uniCheat",
  description:
    "Notatki, opracowania, zestawy zadań i materiały przekazane przez poprzednich studentów ZUT.",
};


export default async function MaterialsPage() {
  const profile = await getCurrentProfile();

  if (profile) {
    const facultySlug = profile.faculty?.slug;
    const courseSlug = profile.course?.slug;

    if (
      profile.faculty_id !== null &&
      profile.course_id !== null &&
      facultySlug &&
      courseSlug
    ) {
      redirect(
        `/materials/${encodeURIComponent(facultySlug)}/${encodeURIComponent(courseSlug)}`,
      );
    }

    const options = await getProfileFormOptions();

    return (
      <main className={styles.page}>
        <div className={styles.shell}>
          <NavBar />

          {options &&
          options.faculties.length > 0 &&
          options.courses.length > 0 ? (
            <StudySelectionForm
              faculties={options.faculties}
              courses={options.courses}
              initialFacultyId={profile.faculty_id}
              initialCourseId={profile.course_id}
            />
          ) : (
            <section
              className={styles.accessGate}
              aria-labelledby="options-error-title"
            >
              <span className={styles.accessIcon} aria-hidden="true">
                <BookOpenCheck size={34} />
              </span>
              <p className={styles.eyebrow}>Materiały dla Twojego kierunku</p>
              <h1 id="options-error-title">Nie udało się pobrać kierunków</h1>
              <p>Odśwież stronę lub spróbuj ponownie za chwilę.</p>
            </section>
          )}
        </div>
      </main>
    );
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
