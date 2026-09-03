import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen, LibraryBig } from "lucide-react";
import { NavBar } from "@/components/layout/Navbar/NavBar";
// import { semesters } from "../../../TempData";
import SubjectCards from "./SubjectCards";
import styles from "./semester.module.css";
import { createClient } from "@/lib/supabase/server";





type SemesterPageProps = {
  params: Promise<{
    faculty: string;
    course: string;
    semester: number;
  }>;
};



async function getSemesterData({ params }: SemesterPageProps) {
  const supabase = await createClient();

  const id = (await params).semester;

  const { data: semester, error: semesterError } = await supabase
    .from("semesters")
    .select(
      `number,
      subjects(
        name,
        slug,
        theme,
        icon,
        subject_channels(
          type,label
          )
          )`,

    )
    .eq("id", id)
    .single();

  if (semesterError) {
    console.error("Błąd sprawdzania dostępu do materiałów:", semesterError);
    return null;
  }

  if (semester.number == null) return null;






  return semester;

}











export async function generateMetadata({
  params,
}: SemesterPageProps): Promise<Metadata> {
  const { semester } = await params;

  return {
    title: `Semestr ${semester} — materiały | uniCheat`,
    description: `Przedmioty, wykłady, laboratoria i ćwiczenia z ${semester}. semestru.`,
  };
}

export default async function SemesterPage({ params }: SemesterPageProps) {

  const semesterData = await getSemesterData({ params });
  const { faculty, course, semester } = await params;




  console.log(semesterData?.subjects);
  if (!semesterData) notFound();




  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <NavBar />

        <Link
          href={`/materials/${encodeURIComponent(faculty)}/${encodeURIComponent(course)}`}
          className={styles.backLink}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Wróć do wszystkich semestrów
        </Link>

        <section className={styles.directory} aria-labelledby="subjects-title">
          <header className={styles.directoryHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                <LibraryBig size={15} aria-hidden="true" />
                Przedmioty na tym etapie
              </span>
              <h2 id="subjects-title">Czego dzisiaj szukasz?</h2>
            </div>
            <p>
              Każdy przedmiot prowadzi bezpośrednio do osobnych materiałów z
              wykładów, laboratoriów lub ćwiczeń.
            </p>
          </header>

          {semesterData.subjects.length > 0 ? (
            <SubjectCards
              subjects={semesterData.subjects}
              semesterNumber={semesterData.number}
              faculty={faculty}
              course={course}
            />
          ) : (
            <div className={styles.emptyState}>
              <span aria-hidden="true">
                <FolderOpen size={28} />
              </span>
              <div>
                <h2>Materiały są w przygotowaniu</h2>
                <p>
                  Przedmioty dla tego semestru pojawią się tutaj, gdy tylko
                  zostaną dodane do katalogu.
                </p>
              </div>
              <Link
                href={`/materials/${encodeURIComponent(faculty)}/${encodeURIComponent(course)}`}
              >
                Wybierz inny semestr
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
