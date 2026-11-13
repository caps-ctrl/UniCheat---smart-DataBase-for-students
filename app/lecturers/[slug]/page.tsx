import type { Metadata } from "next";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ExternalLink,
  Mail,
  MessageSquareText,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/Navbar/NavBar";
import { createClient } from "@/lib/supabase/server";
import {
  getLecturerBySlug,
  getLecturerComments,
  getLecturerRatingSummary,
} from "../getLecturers";
import CommentForm from "./CommentForm";
import EditCommentForm from "./EditCommentForm";
import ReportCommentForm from "./ReportCommentForm";
import styles from "./lecturerProfile.module.css";

type LecturerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

const avatarColors = ["mint", "blue", "violet", "amber", "rose", "cyan"] as const;

const commentDateFormatter = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Warsaw",
});

const averageRatingFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function getRatingCountLabel(count: number) {
  if (count === 1) return "1 ocena";

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  const noun =
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
      ? "oceny"
      : "ocen";

  return `${count} ${noun}`;
}

function getProfileUrl(profileUrl: string | null) {
  if (!profileUrl) return null;

  try {
    const url = new URL(profileUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: LecturerProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const lecturer = await getLecturerBySlug(slug);

  if (!lecturer) {
    return { title: "Nie znaleziono wykładowcy | uniCheat" };
  }

  const fullName = `${lecturer.first_name} ${lecturer.last_name}`;

  return {
    title: `${fullName} | uniCheat`,
    description: `Profil wykładowcy ${fullName} oraz prowadzone przedmioty.`,
  };
}

export default async function LecturerProfilePage({
  params,
}: LecturerProfilePageProps) {
  const { slug } = await params;
  const lecturer = await getLecturerBySlug(slug);

  if (!lecturer) {
    notFound();
  }

  const fullName = `${lecturer.first_name} ${lecturer.last_name}`;
  const initials = `${lecturer.first_name.at(0) ?? ""}${lecturer.last_name.at(0) ?? ""}`.toLocaleUpperCase(
    "pl",
  );
  const color = avatarColors[lecturer.id % avatarColors.length];
  const profileUrl = getProfileUrl(lecturer.profile_url);
  const supabase = await createClient();
  const [comments, ratingSummary, userResult] = await Promise.all([
    getLecturerComments(lecturer.id),
    getLecturerRatingSummary(lecturer.id),
    supabase.auth.getUser(),
  ]);
  const currentUser = userResult.data.user;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <NavBar />

        <Link href="/lecturers" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          Wróć do katalogu
        </Link>

        <section className={styles.profileHero}>
          <div
            className={`${styles.avatar} ${styles[color]}`}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className={styles.identity}>
            <span className={styles.facultyBadge}>
              <Building2 size={15} aria-hidden="true" />
              {lecturer.faculty?.short_name ?? "ZUT"}
            </span>
            <h1>
              {lecturer.academic_title && `${lecturer.academic_title} `}
              {fullName}
            </h1>
            {lecturer.faculty && (
              <p className={styles.identityMeta}>{lecturer.faculty.name}</p>
            )}
            <div
              className={styles.ratingSummary}
              aria-label={
                ratingSummary.average === null
                  ? "Ten wykładowca nie ma jeszcze ocen"
                  : `Średnia ocena ${averageRatingFormatter.format(ratingSummary.average)} na 5, ${getRatingCountLabel(ratingSummary.count)}`
              }
            >
              <Star size={17} fill="currentColor" aria-hidden="true" />
              {ratingSummary.average === null ? (
                <span>Brak ocen</span>
              ) : (
                <>
                  <strong>
                    {averageRatingFormatter.format(ratingSummary.average)}
                  </strong>
                  <span>/ 5 · {getRatingCountLabel(ratingSummary.count)}</span>
                </>
              )}
            </div>
          </div>

          {lecturer.email && (
            <a className={styles.contactButton} href={`mailto:${lecturer.email}`}>
              <Mail size={17} aria-hidden="true" />
              Napisz wiadomość
            </a>
          )}
        </section>

        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeading}>
                <span>
                  <BookOpen size={19} aria-hidden="true" />
                </span>
                <div>
                  <h2>Prowadzone przedmioty</h2>
                  <p>Przedmioty przypisane do tego wykładowcy.</p>
                </div>
              </div>

              {lecturer.subjects.length > 0 ? (
                <div className={styles.subjectList}>
                  {lecturer.subjects.map((subject, index) => (
                    <div className={styles.subjectRow} key={subject.id}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{subject.name}</strong>
                      {subject.semester?.course?.faculty && (
                        <Link
                          className={styles.subjectAction}
                          href={`/materials/${encodeURIComponent(subject.semester.course.faculty.slug)}/${encodeURIComponent(subject.semester.course.slug)}/${subject.semester.number}/${encodeURIComponent(subject.slug)}`}
                        >
                          Zobacz przedmiot
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptySubjects}>
                  Ten wykładowca nie ma jeszcze przypisanych przedmiotów.
                </p>
              )}
            </section>

            <section className={styles.card} id="comments">
              <div className={styles.cardHeading}>
                <span>
                  <MessageSquareText size={19} aria-hidden="true" />
                </span>
                <div>
                  <h2>Komentarze studentów</h2>
                  <p>
                    {comments.length} {comments.length === 1 ? "komentarz" : "komentarzy"}
                  </p>
                </div>
              </div>

              {currentUser ? (
                <CommentForm lecturerId={lecturer.id} slug={lecturer.slug} />
              ) : (
                <p className={styles.loginPrompt}>
                  <Link href="/login">Zaloguj się</Link>, aby dodać komentarz.
                </p>
              )}

              {comments.length > 0 ? (
                <div className={styles.commentList}>
                  {comments.map((comment) => (
                    <article className={styles.comment} key={comment.id}>
                      <header>
                        <strong>
                          {comment.user_id === currentUser?.id
                            ? "Twój komentarz"
                            : comment.author?.username ?? "Konto prywatne"}
                        </strong>
                        <span className={styles.commentRating}>
                          <Star size={14} fill="currentColor" aria-hidden="true" />
                          {comment.rating}/5
                        </span>
                        <time dateTime={comment.created_at}>
                          {commentDateFormatter.format(new Date(comment.created_at))}
                        </time>
                      </header>
                      <p>{comment.content}</p>
                      {currentUser && (
                        <footer className={styles.commentFooter}>
                          {comment.user_id === currentUser.id && (
                            <EditCommentForm
                              commentId={comment.id}
                              lecturerId={lecturer.id}
                              slug={lecturer.slug}
                              initialContent={comment.content}
                              initialRating={comment.rating}
                            />
                          )}
                          <ReportCommentForm
                            commentId={comment.id}
                            lecturerId={lecturer.id}
                            slug={lecturer.slug}
                          />
                        </footer>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyComments}>
                  Nie ma jeszcze komentarzy. Dodaj pierwszy.
                </p>
              )}
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section className={styles.infoCard}>
              <h2>Informacje</h2>
              <dl>
                {lecturer.faculty && (
                  <div>
                    <dt>
                      <Building2 size={17} aria-hidden="true" /> Wydział
                    </dt>
                    <dd>{lecturer.faculty.name}</dd>
                  </div>
                )}
                {lecturer.email && (
                  <div>
                    <dt>
                      <Mail size={17} aria-hidden="true" /> E-mail
                    </dt>
                    <dd>
                      <a href={`mailto:${lecturer.email}`}>{lecturer.email}</a>
                    </dd>
                  </div>
                )}
                {profileUrl && (
                  <div>
                    <dt>
                      <ExternalLink size={17} aria-hidden="true" /> Profil
                    </dt>
                    <dd>
                      <a href={profileUrl} target="_blank" rel="noreferrer">
                        Profil uczelniany
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
