import type { Metadata } from "next";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import LecturersDirectory from "./LecturersDirectory";
import styles from "./wykladowcy.module.css";
import { getLecturers } from "./getLecturers";
export const metadata: Metadata = {
  title: "Wykładowcy | uniCheat",
  description: "Wykładowcy",
};

export default async function LecturersPage() {
  const lecturers = await getLecturers();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <NavBar />
        <section className={styles.hero} aria-labelledby="lecturers-title">
          <p className={styles.eyebrow}>Poznaj prowadzących</p>
          <h1 id="lecturers-title">
            Wykładowcy
          </h1>
          <p className={styles.lead}>
            Wyszukaj prowadzącego i szybko znajdź jego dane kontaktowe.
          </p>
          <div className={styles.heroStats} aria-label="Statystyki katalogu">
            <div>
              <strong>{lecturers.length}</strong>
              <span>wykładowców</span>
            </div>
          </div>
        </section>

        <LecturersDirectory lecturers={lecturers} />
      </div>
    </main>
  );
}
