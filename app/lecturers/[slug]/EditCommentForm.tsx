"use client";

import { Pencil, Star, X } from "lucide-react";
import { useActionState, useId, useState } from "react";
import {
  editLecturerComment,
  type EditCommentState,
} from "./actions";
import styles from "./lecturerProfile.module.css";

const initialState: EditCommentState = {
  status: "idle",
  message: "",
};

const commentMaxLength = 500;

type EditCommentFormProps = {
  commentId: number;
  lecturerId: number;
  slug: string;
  initialContent: string;
  initialRating: number;
};

export default function EditCommentForm({
  commentId,
  lecturerId,
  slug,
  initialContent,
  initialRating,
}: EditCommentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentLength, setContentLength] = useState(initialContent.length);
  const fieldId = useId();
  const action = editLecturerComment.bind(null, {
    commentId,
    lecturerId,
    slug,
  });
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.status === "success") {
    return (
      <p className={styles.editSuccess} role="status">
        <Pencil size={14} aria-hidden="true" />
        {state.message}
      </p>
    );
  }

  if (!isOpen) {
    return (
      <button
        className={styles.editTrigger}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Pencil size={14} aria-hidden="true" />
        Edytuj
      </button>
    );
  }

  return (
    <form action={formAction} className={styles.editForm}>
      <div className={styles.editFormHeading}>
        <strong>Edytuj swój komentarz</strong>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Zamknij formularz edycji"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <fieldset className={styles.ratingFieldset} disabled={isPending}>
        <legend>Ocena</legend>
        <div className={styles.stars}>
          {[5, 4, 3, 2, 1].map((value) => (
            <span className={styles.ratingChoice} key={value}>
              <input
                className={styles.ratingInput}
                id={`${fieldId}-rating-${value}`}
                type="radio"
                name="rating"
                value={value}
                defaultChecked={value === initialRating}
                aria-label={`${value} ${value === 1 ? "gwiazdka" : "gwiazdek"}`}
                required
              />
              <label
                className={styles.ratingOption}
                htmlFor={`${fieldId}-rating-${value}`}
              >
                <Star size={24} aria-hidden="true" />
              </label>
            </span>
          ))}
        </div>
      </fieldset>

      <label htmlFor={`${fieldId}-content`}>Treść komentarza</label>
      <textarea
        id={`${fieldId}-content`}
        name="content"
        minLength={3}
        maxLength={commentMaxLength}
        rows={4}
        defaultValue={initialContent}
        onInput={(event) => setContentLength(event.currentTarget.value.length)}
        disabled={isPending}
        required
      />

      <div className={styles.editFormFooter}>
        <p
          className={state.status === "error" ? styles.formError : undefined}
          aria-live="polite"
        >
          {state.message || `${contentLength} / ${commentMaxLength}`}
        </p>
        <button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
        </button>
      </div>
    </form>
  );
}
