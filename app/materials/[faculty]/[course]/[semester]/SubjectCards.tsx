"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Atom,
  BookOpenText,
  Code2,
  FlaskConical,
  FolderOpen,
  PencilRuler,
  Sigma,
  X,
} from "lucide-react";

import styles from "./semester.module.css";
import type { Subject, ChannelType } from "./types";

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
    description: string;
    icon: typeof BookOpenText;
  }
> = {
  lecture: {
    label: "Wykłady",
    description: "Notatki, prezentacje i zagadnienia z wykładów",
    icon: BookOpenText,
  },
  lab: {
    label: "Laboratoria",
    description: "Instrukcje, sprawozdania i materiały praktyczne",
    icon: FlaskConical,
  },
  exercises: {
    label: "Ćwiczenia",
    description: "Listy zadań, rozwiązania i przygotowanie do kolokwiów",
    icon: PencilRuler,
  },
};

type SubjectCardsProps = {
  faculty: string;
  course: string;
  semesterNumber: number;
  subjects: Subject[];
};

export default function SubjectCards({
  faculty,
  course,
  semesterNumber,
  subjects,
}: SubjectCardsProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedSubject = subjects.find(
    (subject) => subject.slug === selectedSlug,
  );

  const closeModal = () => {
    setSelectedSlug(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!selectedSubject) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSubject]);

  return (
    <>
      <div className={styles.subjectGrid}>
        {subjects.map((subject, index) => {
          const SubjectIcon = subjectIcons[subject.icon];

          return (
            <button
              type="button"
              className={`${styles.subjectCard} ${styles[subject.theme]}`}
              key={subject.slug}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setSelectedSlug(subject.slug);
              }}
              aria-haspopup="dialog"
            >
              <div className={styles.cardTop}>
                <span className={styles.subjectNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.subjectIcon} aria-hidden="true">
                  <SubjectIcon size={24} />
                </span>
              </div>

              <div className={styles.subjectCopy}>
                <span>Przedmiot</span>
                <h2>{subject.name}</h2>
                <p>
                  Kliknij kafelek i wybierz materiały z wykładów, laboratoriów
                  lub ćwiczeń.
                </p>
              </div>

              <div className={styles.channelPreview} aria-hidden="true">
                {subject.subject_channels.map((channel) => {
                  const details = channelDetails[channel.type];
                  const ChannelIcon = details.icon;

                  return (
                    <span key={channel.type}>
                      <ChannelIcon size={14} />
                      {details.label}
                    </span>
                  );
                })}
              </div>

              <footer className={styles.cardFooter}>
                <span>
                  <FolderOpen size={13} aria-hidden="true" />
                  {subject.subject_channels.length}{" "}
                  {subject.subject_channels.length === 1 ? "sekcja" : "sekcje"}
                </span>
                <span className={styles.chooseAction}>
                  Wybierz materiały
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </footer>

              <div className={styles.cardArtwork} aria-hidden="true">
                <SubjectIcon size={62} />
                <i />
                <i />
              </div>
            </button>
          );
        })}
      </div>

      {selectedSubject && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className={styles.channelModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="channel-modal-title"
            aria-describedby="channel-modal-description"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Zamknij okno"
            >
              <X size={19} aria-hidden="true" />
            </button>

            <span className={styles.modalEyebrow}>Wybierz rodzaj zajęć</span>
            <h2 id="channel-modal-title">{selectedSubject.name}</h2>
            <p id="channel-modal-description">
              Do których materiałów chcesz teraz przejść?
            </p>

            <div className={styles.modalOptions}>
              {selectedSubject.subject_channels.map((channel) => {
                const details = channelDetails[channel.type];
                const ChannelIcon = details.icon;

                return (
                  <Link
                    key={channel.type}
                    href={`/materials/${encodeURIComponent(faculty)}/${encodeURIComponent(course)}/${semesterNumber}/${selectedSubject.slug}?channel=${channel.type}`}
                    className={styles.modalOption}
                  >
                    <span aria-hidden="true">
                      <ChannelIcon size={21} />
                    </span>
                    <span>
                      <strong>{details.label}</strong>
                      <small>{details.description}</small>
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.modalCancel}
              onClick={closeModal}
            >
              Anuluj
            </button>
          </section>
        </div>
      )}
    </>
  );
}
