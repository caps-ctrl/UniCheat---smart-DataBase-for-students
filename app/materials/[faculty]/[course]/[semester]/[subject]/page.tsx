import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Atom,
  BookOpenText,
  CheckCircle2,
  Code2,
  FileQuestion,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  Lightbulb,
  PencilRuler,
  Sigma,
  Sparkles,
  Upload,
  UsersRound,
} from "lucide-react";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import {
  semesters,
  type ChannelType,
  type Subject,
} from "../../../../TempData";
import styles from "./subject.module.css";

type SubjectPageProps = {
  params: Promise<{
    semester: string;
    subject: string;
  }>;
  searchParams: Promise<{
    channel?: string | string[];
  }>;
};

const subjectIcons = {
  sigma: Sigma,
  atom: Atom,
  code: Code2,
  flask: FlaskConical,
};

const channelDetails: Record<
  ChannelType,
  {
    label: string;
    shortLabel: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    icon: typeof BookOpenText;
  }
> = {
  lecture: {
    label: "Materiały z wykładów",
    shortLabel: "Wykłady",
    description: "Notatki, prezentacje, opracowania i zagadnienia teoretyczne.",
    emptyTitle: "Tu pojawią się materiały z wykładów",
    emptyDescription:
      "Notatki, prezentacje i opracowania studentów będą widoczne w tym miejscu.",
    icon: BookOpenText,
  },
  lab: {
    label: "Materiały laboratoryjne",
    shortLabel: "Laboratoria",
    description: "Instrukcje, sprawozdania, kod i praktyczne przykłady.",
    emptyTitle: "Laboratorium czeka na pierwsze materiały",
    emptyDescription:
      "Instrukcje, sprawozdania i rozwiązania zadań laboratoryjnych pojawią się tutaj.",
    icon: FlaskConical,
  },
  exercises: {
    label: "Materiały z ćwiczeń",
    shortLabel: "Ćwiczenia",
    description: "Listy zadań, rozwiązania i przygotowanie do kolokwiów.",
    emptyTitle: "Tu pojawią się zadania i rozwiązania",
    emptyDescription:
      "Listy ćwiczeń, przykładowe rozwiązania i powtórki przed kolokwium będą w jednym miejscu.",
    icon: PencilRuler,
  },
};

function findSubject(semesterParam: string, subjectSlug: string) {
  const semesterNumber = Number(semesterParam);
  const semester = semesters.find((item) => item.number === semesterNumber);
  const subject = semester?.subjects.find((item) => item.slug === subjectSlug);

  if (!semester || !subject) return null;

  return { semester, subject };
}

function getActiveChannel(subject: Subject, channelParam?: string | string[]) {
  const requestedChannel = Array.isArray(channelParam)
    ? channelParam[0]
    : channelParam;

  return (
    subject.channels.find((channel) => channel.type === requestedChannel) ??
    subject.channels[0]
  );
}

export function generateStaticParams() {
  return semesters.flatMap((semester) =>
    semester.subjects.map((subject) => ({
      semester: String(semester.number),
      subject: subject.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { semester, subject: subjectSlug } = await params;
  const data = findSubject(semester, subjectSlug);

  if (!data) return {};

  return {
    title: `${data.subject.name} — materiały | uniCheat`,
    description: `Wykłady, laboratoria i ćwiczenia z przedmiotu ${data.subject.name}, semestr ${data.semester.number}.`,
  };
}

export default async function SubjectPage({
  params,
  searchParams,
}: SubjectPageProps) {
  const [{ semester, subject: subjectSlug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const data = findSubject(semester, subjectSlug);

  if (!data) notFound();

  const activeChannel = getActiveChannel(data.subject, query.channel);
  if (!activeChannel) notFound();

  const SubjectIcon = subjectIcons[data.subject.icon];
  const ActiveChannelIcon = channelDetails[activeChannel.type].icon;
  const activeDetails = channelDetails[activeChannel.type];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <NavBar />

        <nav className={styles.breadcrumbs} aria-label="Okruszki">
          <Link href={`/materials/semesters/${data.semester.number}`}>
            <ArrowLeft size={15} aria-hidden="true" />
            Semestr {data.semester.number}
          </Link>
          <span aria-hidden="true">/</span>
          <span>{data.subject.name}</span>
        </nav>

        <section
          className={`${styles.subjectHero} ${styles[data.subject.theme]}`}
          aria-labelledby="subject-title"
        >
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <GraduationCap size={15} aria-hidden="true" />
              Semestr {data.semester.number} • przedmiot
            </span>
            <h1 id="subject-title">{data.subject.name}</h1>
            <p>
              Wszystkie materiały do tego przedmiotu są uporządkowane według
              rodzaju zajęć. Wybierz sekcję i korzystaj z wiedzy przekazanej
              przez innych studentów.
            </p>

            <div className={styles.heroMeta}>
              <span>
                <FolderOpen size={14} aria-hidden="true" />
                {data.subject.channels.length}{" "}
                {data.subject.channels.length === 1 ? "sekcja" : "sekcje"}
              </span>
              <span>
                <UsersRound size={14} aria-hidden="true" />
                materiały społeczności
              </span>
              <span>
                <CheckCircle2 size={14} aria-hidden="true" />
                uporządkowane tematycznie
              </span>
            </div>
          </div>

          <div className={styles.heroArtwork} aria-hidden="true">
            <div>
              <SubjectIcon size={64} />
              <span>{String(data.semester.number).padStart(2, "0")}</span>
            </div>
            <i />
            <i />
          </div>
        </section>

        <section className={styles.workspace} aria-labelledby="materials-title">
          <header className={styles.workspaceHeader}>
            <div>
              <span className={styles.workspaceEyebrow}>
                <Sparkles size={14} aria-hidden="true" />
                Biblioteka przedmiotu
              </span>
              <h2 id="materials-title">{activeDetails.label}</h2>
              <p>{activeDetails.description}</p>
            </div>

            <div className={styles.channelTabs} aria-label="Rodzaj zajęć">
              {data.subject.channels.map((channel) => {
                const details = channelDetails[channel.type];
                const ChannelIcon = details.icon;
                const isActive = channel.type === activeChannel.type;

                return (
                  <Link
                    key={channel.type}
                    href={`/materials/semesters/${data.semester.number}/${data.subject.slug}?channel=${channel.type}`}
                    className={isActive ? styles.activeTab : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <ChannelIcon size={16} aria-hidden="true" />
                    {details.shortLabel}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className={styles.contentGrid}>
            <div className={styles.emptyMaterials}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <ActiveChannelIcon size={30} />
              </span>
              <div>
                <span className={styles.statusBadge}>Katalog jest gotowy</span>
                <h3>{activeDetails.emptyTitle}</h3>
                <p>{activeDetails.emptyDescription}</p>
              </div>
              <button type="button" disabled>
                <Upload size={16} aria-hidden="true" />
                Dodawanie materiałów wkrótce
              </button>
              <FileQuestion
                className={styles.emptyDecoration}
                size={86}
                aria-hidden="true"
              />
            </div>

            <aside
              className={styles.sidebar}
              aria-label="Informacje o materiałach"
            >
              <div className={styles.tipCard}>
                <span aria-hidden="true">
                  <Lightbulb size={20} />
                </span>
                <div>
                  <h3>Masz przydatne materiały?</h3>
                  <p>
                    Wkrótce będzie można dodać notatki i pomóc kolejnym
                    studentom zaliczyć ten przedmiot.
                  </p>
                </div>
              </div>

              <div className={styles.safetyCard}>
                <strong>Warto pamiętać</strong>
                <p>
                  Zawsze porównuj materiały społeczności z aktualnymi
                  wymaganiami prowadzącego.
                </p>
                <Link href="/faq">
                  Zasady korzystania
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
