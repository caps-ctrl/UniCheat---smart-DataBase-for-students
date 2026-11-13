"use client";

import { Flag, X } from "lucide-react";
import { useActionState, useId, useState } from "react";
import {
  reportLecturerComment,
  type ReportCommentState,
} from "./actions";
import styles from "./lecturerProfile.module.css";

const initialState: ReportCommentState = {
  status: "idle",
  message: "",
};

const reportMaxLength = 500;

type ReportCommentFormProps = {
  commentId: number;
  lecturerId: number;
  slug: string;
};

export default function ReportCommentForm({
  commentId,
  lecturerId,
  slug,
}: ReportCommentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reasonLength, setReasonLength] = useState(0);
  const reasonId = useId();
  const action = reportLecturerComment.bind(null, {
    commentId,
    lecturerId,
    slug,
  });
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.status === "success") {
    return (
      <p className={styles.reportSuccess} role="status">
        <Flag size={14} aria-hidden="true" />
        {state.message}
      </p>
    );
  }

  if (!isOpen) {
    return (
      <button
        className={styles.reportTrigger}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Flag size={14} aria-hidden="true" />
        Zgłoś komentarz
      </button>
    );
  }

  return (
    <form action={formAction} className={styles.reportForm}>
      <div className={styles.reportFormHeading}>
        <label htmlFor={reasonId}>Powód zgłoszenia</label>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Zamknij formularz zgłoszenia"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <textarea
        id={reasonId}
        name="reason"
        minLength={3}
        maxLength={reportMaxLength}
        rows={3}
        placeholder="Opisz, dlaczego ten komentarz powinien zostać sprawdzony..."
        onInput={(event) => setReasonLength(event.currentTarget.value.length)}
        disabled={isPending}
        required
      />

      <div className={styles.reportFormFooter}>
        <p
          className={state.status === "error" ? styles.formError : undefined}
          aria-live="polite"
        >
          {state.message || `${reasonLength} / ${reportMaxLength}`}
        </p>
        <button type="submit" disabled={isPending}>
          {isPending ? "Wysyłanie..." : "Wyślij zgłoszenie"}
        </button>
      </div>
    </form>
  );
}
