"use client";

import { BookOpen, Mail, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lecturer } from "./getLecturers";
import styles from "./wykladowcy.module.css";

const avatarColors = [
  "mint",
  "blue",
  "violet",
  "amber",
  "rose",
  "cyan",
] as const;

function getInitials(lecturer: Lecturer) {
  return `${lecturer.first_name.at(0) ?? ""}${lecturer.last_name.at(0) ?? ""}`.toLocaleUpperCase(
    "pl",
  );
}

type LecturersDirectoryProps = {
  lecturers: Lecturer[];
};

export default function LecturersDirectory({
  lecturers,
}: LecturersDirectoryProps) {
  const [query, setQuery] = useState("");

  const visibleLecturers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pl");

    return lecturers.filter((lecturer) => {
      const searchableContent = [
        lecturer.first_name,
        lecturer.last_name,
        lecturer.academic_title,
        lecturer.email,
        ...lecturer.subjects.map((subject) => subject.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pl");

      return searchableContent.includes(normalizedQuery);
    });
  }, [lecturers, query]);

  return (
    <section className={styles.directory} aria-labelledby="directory-title">
      <div className={styles.toolbar}>
        <div>
          <h2 id="directory-title">Katalog wykładowców</h2>
          <p>
            {visibleLecturers.length}{" "}
            {visibleLecturers.length === 1
              ? "znaleziony profil"
              : "znalezionych profili"}
          </p>
        </div>
        <div className={styles.controls}>
          <label className={styles.search}>
            <Search size={18} aria-hidden="true" />
            <span className={styles.visuallyHidden}>Szukaj wykładowcy</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Imię lub nazwisko..."
            />
          </label>
        </div>
      </div>

      {visibleLecturers.length > 0 ? (
        <div className={styles.grid}>
          {visibleLecturers.map((lecturer, index) => {
            const color = avatarColors[index % avatarColors.length];

            return (
              <article className={styles.card} key={lecturer.id}>
                <div className={styles.cardTop}>
                  <div
                    className={`${styles.avatar} ${styles[color]}`}
                    aria-hidden="true"
                  >
                    {getInitials(lecturer)}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3>
                    {lecturer.academic_title && `${lecturer.academic_title} `}
                    {lecturer.first_name} {lecturer.last_name}
                  </h3>
                  {lecturer.email && (
                    <a
                      className={styles.email}
                      href={`mailto:${lecturer.email}`}
                    >
                      <Mail size={15} aria-hidden="true" />
                      {lecturer.email}
                    </a>
                  )}

                  <div className={styles.subjects}>
                    <span className={styles.subjectsLabel}>
                      <BookOpen size={15} aria-hidden="true" />
                      Prowadzone przedmioty
                    </span>
                    {lecturer.subjects.length > 0 ? (
                      <ul>
                        {lecturer.subjects.map((subject) => (
                          <li key={subject.id}>{subject.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.noSubjects}>
                        Brak przypisanych przedmiotów
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  className={styles.cardAction}
                  href={`/lecturers/${encodeURIComponent(lecturer.slug)}`}
                  aria-label={`Zobacz profil: ${lecturer.first_name} ${lecturer.last_name}`}
                >
                  Zobacz profil
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Search size={28} aria-hidden="true" />
          <h3>
            {lecturers.length === 0
              ? "Brak wykładowców w bazie"
              : "Brak pasujących wykładowców"}
          </h3>
          <p>
            {lecturers.length === 0
              ? "Katalog jest jeszcze pusty."
              : "Zmień wyszukiwaną frazę."}
          </p>
          {lecturers.length > 0 && (
            <button type="button" onClick={() => setQuery("")}>
              Wyczyść filtry
            </button>
          )}
        </div>
      )}
    </section>
  );
}
