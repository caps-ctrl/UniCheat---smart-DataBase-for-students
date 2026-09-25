"use client";

import { useActionState, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  GraduationCap,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import type {
  ProfileCourseOption,
  ProfileFacultyOption,
} from "@/app/profile/types";
import {
  saveStudySelection,
  type StudySelectionState,
} from "./actions";
import styles from "./materials.module.css";

const initialState: StudySelectionState = {
  status: "idle",
  message: "",
};

type StudySelectionFormProps = {
  faculties: ProfileFacultyOption[];
  courses: ProfileCourseOption[];
  initialFacultyId: number | null;
  initialCourseId: number | null;
};

export default function StudySelectionForm({
  faculties,
  courses,
  initialFacultyId,
  initialCourseId,
}: StudySelectionFormProps) {
  const initialFacultyValue = initialFacultyId?.toString() ?? "";
  const initialCourseBelongsToFaculty = courses.some(
    (course) =>
      course.id === initialCourseId && course.faculty_id === initialFacultyId,
  );
  const [facultyId, setFacultyId] = useState(initialFacultyValue);
  const [courseId, setCourseId] = useState(
    initialCourseBelongsToFaculty ? initialCourseId?.toString() ?? "" : "",
  );
  const [state, formAction, isPending] = useActionState(
    saveStudySelection,
    initialState,
  );

  const availableCourses = useMemo(() => {
    const selectedFacultyId = Number(facultyId);

    return courses.filter(
      (course) => course.faculty_id === selectedFacultyId,
    );
  }, [courses, facultyId]);

  const canSubmit = Boolean(facultyId && courseId) && !isPending;

  return (
    <section
      className={styles.studySelection}
      aria-labelledby="study-selection-title"
    >
      <div className={styles.studySelectionIntro}>
        <span className={styles.selectionIcon} aria-hidden="true">
          <BookOpenCheck size={30} />
        </span>
        <p className={styles.eyebrow}>Pierwsza konfiguracja materiałów</p>
        <h1 id="study-selection-title">Dopasuj materiały do swoich studiów</h1>
        <p>
          Wskaż wydział i kierunek. Zapiszemy ten wybór w Twoim profilu i
          przeniesiemy Cię od razu do listy semestrów.
        </p>

        <ul className={styles.selectionBenefits}>
          <li>
            <ShieldCheck size={16} aria-hidden="true" />
            Wybór możesz później zmienić w profilu
          </li>
          <li>
            <GraduationCap size={16} aria-hidden="true" />
            Zobaczysz tylko materiały dla swojego kierunku
          </li>
        </ul>
      </div>

      <form className={styles.selectionForm} action={formAction}>
        <div className={styles.selectionFormHeading}>
          <span>Krok 1 z 1</span>
          <h2>Wybierz ścieżkę studiów</h2>
          <p>Najpierw wybierz wydział, a potem dostępny na nim kierunek.</p>
        </div>

        <label className={styles.selectionField}>
          <span className={styles.selectionFieldLabel}>
            <i>01</i>
            <span>
              <strong>Wydział</strong>
              <small>{faculties.length} dostępnych wydziałów</small>
            </span>
            <Building2 size={20} aria-hidden="true" />
          </span>
          <select
            name="facultyId"
            value={facultyId}
            onChange={(event) => {
              setFacultyId(event.target.value);
              setCourseId("");
            }}
            aria-invalid={Boolean(state.errors?.facultyId)}
            aria-describedby={
              state.errors?.facultyId ? "faculty-selection-error" : undefined
            }
            required
          >
            <option value="">Wybierz wydział</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          {state.errors?.facultyId && (
            <small
              className={styles.selectionFieldError}
              id="faculty-selection-error"
            >
              {state.errors.facultyId[0]}
            </small>
          )}
        </label>

        <label className={styles.selectionField}>
          <span className={styles.selectionFieldLabel}>
            <i>02</i>
            <span>
              <strong>Kierunek</strong>
              <small>
                {facultyId
                  ? `${availableCourses.length} dostępnych kierunków`
                  : "Najpierw wybierz wydział"}
              </small>
            </span>
            <GraduationCap size={20} aria-hidden="true" />
          </span>
          <select
            name="courseId"
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            disabled={!facultyId || availableCourses.length === 0}
            aria-invalid={Boolean(state.errors?.courseId)}
            aria-describedby={
              state.errors?.courseId ? "course-selection-error" : undefined
            }
            required
          >
            <option value="">
              {facultyId ? "Wybierz kierunek" : "Najpierw wybierz wydział"}
            </option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {state.errors?.courseId && (
            <small
              className={styles.selectionFieldError}
              id="course-selection-error"
            >
              {state.errors.courseId[0]}
            </small>
          )}
        </label>

        {state.status === "error" && (
          <p className={styles.selectionError} role="alert">
            {state.message}
          </p>
        )}

        <button
          className={styles.selectionSubmit}
          type="submit"
          disabled={!canSubmit}
        >
          {isPending ? (
            <LoaderCircle
              className={styles.selectionSpinner}
              size={18}
              aria-hidden="true"
            />
          ) : (
            <ArrowRight size={18} aria-hidden="true" />
          )}
          {isPending ? "Zapisywanie wyboru…" : "Przejdź do semestrów"}
        </button>
      </form>
    </section>
  );
}
