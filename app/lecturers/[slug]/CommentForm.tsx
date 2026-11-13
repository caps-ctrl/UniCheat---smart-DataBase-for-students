"use client";

import { Star } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { addLecturerComment, type AddCommentState } from "./actions";
import styles from "./lecturerProfile.module.css";

const initialState: AddCommentState = {
  status: "idle",
  message: "",
};

const commentMaxLength = 500;

type CommentFormProps = {
  lecturerId: number;
  slug: string;
};

export default function CommentForm({ lecturerId, slug }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const characterCountRef = useRef<HTMLOutputElement>(null);
  const action = addLecturerComment.bind(null, { lecturerId, slug });
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      if (characterCountRef.current) {
        characterCountRef.current.value = `0 / ${commentMaxLength}`;
      }
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className={styles.commentForm}>
      <fieldset className={styles.ratingFieldset} disabled={isPending}>
        <legend>Ocena</legend>
        <div className={styles.ratingControl}>
          <div className={styles.stars}>
            {[5, 4, 3, 2, 1].map((value) => (
              <span className={styles.ratingChoice} key={value}>
                <input
                  className={styles.ratingInput}
                  id={`comment-rating-${value}`}
                  type="radio"
                  name="rating"
                  value={value}
                  defaultChecked={value === 5}
                  aria-label={`${value} ${value === 1 ? "gwiazdka" : "gwiazdek"}`}
                  required
                />
                <label
                  className={styles.ratingOption}
                  htmlFor={`comment-rating-${value}`}
                >
                  <Star size={28} aria-hidden="true" />
                </label>
              </span>
            ))}
          </div>
        </div>
      </fieldset>

      <label htmlFor="comment-content">Twój komentarz</label>
      <textarea
        id="comment-content"
        name="content"
        minLength={3}
        maxLength={commentMaxLength}
        rows={5}
        placeholder="Napisz, jak oceniasz zajęcia z tym wykładowcą..."
        aria-describedby="comment-character-limit"
        onInput={(event) => {
          if (characterCountRef.current) {
            characterCountRef.current.value = `${event.currentTarget.value.length} / ${commentMaxLength}`;
          }
        }}
        required
      />
      <div className={styles.commentLimit}>
        <span>Minimum 3 znaki</span>
        <output
          ref={characterCountRef}
          id="comment-character-limit"
          htmlFor="comment-content"
          aria-live="polite"
        >
          0 / {commentMaxLength}
        </output>
      </div>

      <div className={styles.commentFormFooter}>
        <p
          className={
            state.status === "error" ? styles.formError : styles.formSuccess
          }
          aria-live="polite"
        >
          {state.message}
        </p>
        <button type="submit" disabled={isPending}>
          {isPending ? "Dodawanie..." : "Dodaj komentarz"}
        </button>
      </div>
    </form>
  );
}
