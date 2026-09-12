import Link from "next/link";
import {
  CalendarDays,
  Flag,
  FolderOpen,
  GraduationCap,
  Hourglass,
  Milestone,
  Route,
  Timer,
} from "lucide-react";
import styles from "../../materials.module.css";





type SemesterListProps = {
  faculty: string;
  course: string;
};

const semesters = [
  {
    number: 1,
    label: "Początek studenckiej drogi",
    category: "Start • pierwsze tygodnie",
    theme: "themeStart",
    artwork: "start",
    icon: Flag,
    progress: 14,
  },
  {
    number: 2,
    label: "Pierwszy rok nabiera tempa",
    category: "Pierwsze zaliczenia",
    theme: "themeCalendar",
    artwork: "calendar",
    icon: CalendarDays,
    progress: 28,
  },
  {
    number: 3,
    label: "Wiesz już, dokąd zmierzasz",
    category: "Kierunek obrany",
    theme: "themeRoute",
    artwork: "route",
    icon: Route,
    progress: 43,
  },
  {
    number: 4,
    label: "Połowa drogi jest już za Tobą",
    category: "Półmetek studiów",
    theme: "themeMilestone",
    artwork: "milestone",
    icon: Milestone,
    progress: 57,
  },
  {
    number: 5,
    label: "Doświadczenie zaczyna procentować",
    category: "Tempo rośnie",
    theme: "themeTime",
    artwork: "time",
    icon: Hourglass,
    progress: 71,
  },
  {
    number: 6,
    label: "Ostatnia prosta przed finałem",
    category: "Dyplom na horyzoncie",
    theme: "themeCountdown",
    artwork: "countdown",
    icon: Timer,
    progress: 86,
  },
  {
    number: 7,
    label: "Dyplom jest na wyciągnięcie ręki",
    category: "Finał • obrona",
    theme: "themeDiploma",
    artwork: "diploma",
    icon: GraduationCap,
    progress: 100,
  },
];





function SemesterArtwork({ kind }: { kind: string }) {
  if (kind === "start") {
    return (
      <div className={`${styles.semesterArtwork} ${styles.artworkStart}`}>
        <Flag size={34} />
        <span />
        <span />
        <span />
        <strong>START</strong>
      </div>
    );
  }

  if (kind === "calendar") {
    return (
      <div className={`${styles.semesterArtwork} ${styles.artworkCalendar}`}>
        <CalendarDays size={28} />
        <strong>SEM 02</strong>
        <span>
          <i />
          Pierwszy rok
        </span>
        <span>
          <i />
          Zaliczenia
        </span>
      </div>
    );
  }

  if (kind === "route") {
    return (
      <div className={`${styles.semesterArtwork} ${styles.artworkRoute}`}>
        <Route size={38} />
        <span />
        <span />
        <span />
        <strong>CEL</strong>
      </div>
    );
  }

  if (kind === "milestone") {
    return (
      <div className={`${styles.semesterArtwork} ${styles.artworkMilestone}`}>
        <Milestone size={30} />
        <strong>50%</strong>
        <span>PÓŁMETEK</span>
      </div>
    );
  }

  if (kind === "time") {
    return (
      <div className={`${styles.semesterArtwork} ${styles.artworkTime}`}>
        <Hourglass size={42} />
        <span />
        <span />
        <strong>5 / 7</strong>
      </div>
    );
  }

  if (kind === "countdown") {
    return (
      <div className={`${styles.semesterArtwork} ${styles.artworkCountdown}`}>
        <Timer size={36} />
        <strong>1</strong>
        <span>SEMESTR DO FINAŁU</span>
      </div>
    );
  }

  return (
    <div className={`${styles.semesterArtwork} ${styles.artworkDiploma}`}>
      <GraduationCap size={36} />
      <strong>DYPLOM</strong>
      <span />
    </div>
  );
}

export default async function SemesterList({ faculty, course }: SemesterListProps) {





  return (
    <section
      className={styles.semesterList}
      aria-labelledby="semester-list-title"
    >
      <header className={styles.semesterListHeader}>
        <div>
          <span className={styles.semesterEyebrow}>
            <GraduationCap size={15} aria-hidden="true" />7 semestrów • jeden
            cel
          </span>
          <h2 id="semester-list-title">Twoja droga do dyplomu</h2>
        </div>
        <p>
          Każdy semestr to kolejny etap, nowe doświadczenia i coraz krótszy
          dystans do obrony. Wybierz moment swojej studenckiej drogi.
        </p>
      </header>

      <div className={styles.semesterListGrid}>
        {semesters.map((semester, index) => (
          <div className={styles.semesterEntry} key={semester.number}>
            <div className={styles.semesterYearSlot}>
              {index % 2 === 0 && <h3>{Math.ceil(index / 2) + 1} Rok</h3>}
            </div>
            <Link
              href={`/materials/${encodeURIComponent(faculty)}/${encodeURIComponent(course)}/${semester.number}`}
              className={styles.semesterTileLink}
            >
              <article
                className={`${styles.semesterTile} ${styles[semester.theme]}`}
              >
                <div className={styles.semesterTileTop}>
                  <span className={styles.semesterOrdinal}>
                    {String(semester.number).padStart(2, "0")}
                  </span>
                  <span className={styles.semesterIcon} aria-hidden="true">
                    <semester.icon size={18} />
                  </span>
                </div>

                <div className={styles.semesterTileCopy}>
                  <span>{semester.category}</span>
                  <h3>Semestr {semester.number}</h3>
                  <p>{semester.label}</p>
                </div>

                <div className={styles.semesterTileFooter}>
                  <FolderOpen size={13} aria-hidden="true" />
                  <span>Otwórz materiały</span>
                  <i aria-hidden="true" />
                </div>

                <div
                  className={styles.semesterProgress}
                  aria-label={`${semester.progress}% drogi do dyplomu`}
                >
                  <span>{semester.progress}% drogi do dyplomu</span>
                  <div aria-hidden="true">
                    <i style={{ width: `${semester.progress}%` }} />
                  </div>
                </div>

                <SemesterArtwork kind={semester.artwork} />
              </article>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
