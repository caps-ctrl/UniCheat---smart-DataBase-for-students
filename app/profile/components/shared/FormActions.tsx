import styles from "../../profile.module.css";

export function FormActions({
  onCancel,
  isPending = false,
}: {
  onCancel?: () => void;
  isPending?: boolean;
}) {
  return (
    <div className={styles.formActions}>
      <button
        type="reset"
        className={styles.secondaryButton}
        onClick={onCancel}
        disabled={isPending}
      >
        Anuluj zmiany
      </button>
      <button
        type="submit"
        className={styles.primaryButton}
        disabled={isPending}
      >
        {isPending ? "Zapisywanie..." : "Zapisz zmiany"}
      </button>
    </div>
  );
}
