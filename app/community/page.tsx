import type { Metadata } from "next";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import CommunityForum from "./CommunityForum";
import styles from "./spolecznosc.module.css";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Społeczność studentów | uniCheat",
  description:
    "Forum studentów ZUT: pytania, dyskusje, pomoc w nauce i wymiana doświadczeń.",
};




export default function CommunityPage() {
  const supabase = createClient();


  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <NavBar />

        <section className={styles.hero} aria-labelledby="community-title">
          <div>
            <p className={styles.eyebrow}>Studenci pomagają studentom</p>
            <h1 id="community-title">
              Społeczność, która <span>zna odpowiedź.</span>
            </h1>
            <p>
              Zadawaj pytania, dziel się doświadczeniem i rozmawiaj z osobami,
              które studiują dokładnie to samo co Ty.
            </p>
          </div>
          <div className={styles.heroStats} aria-label="Statystyki społeczności">
            <div>
              <strong>6 280</strong>
              <span>studentów</span>
            </div>
            <div>
              <strong>420</strong>
              <span>dyskusji w tym tygodniu</span>
            </div>
            <div>
              <strong>92%</strong>
              <span>pytań z odpowiedzią</span>
            </div>
          </div>
        </section>

        <CommunityForum />
      </div>
    </main>
  );
}
