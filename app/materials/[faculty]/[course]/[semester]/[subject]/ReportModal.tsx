"use client";

import {
    type FormEvent,
    useEffect,
    useId,
    useRef,
    useState,
    useTransition,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Flag, X } from "lucide-react";
import { reportMaterial } from "@/lib/actions/reportMaterial";
import { Button } from "@/components/ui/Button";
import styles from "./subject.module.css";

type ReportModalProps = {
    materialId: number;
    materialTitle: string;
};

const MAX_REASON_LENGTH = 500;

export default function ReportModal({
    materialId,
    materialTitle,
}: ReportModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);
    const [isPending, startTransition] = useTransition();
    const triggerRef = useRef<HTMLSpanElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    const openModal = () => {
        setReason("");
        setError(null);
        setIsSent(false);
        setIsOpen(true);
    };

    const closeModal = () => {
        if (isPending) return;

        setIsOpen(false);
        requestAnimationFrame(() =>
            triggerRef.current?.querySelector("button")?.focus()
        );
    };

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isPending) {
                setIsOpen(false);
                requestAnimationFrame(() =>
                    triggerRef.current?.querySelector("button")?.focus()
                );
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isPending]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedReason = reason.trim();

        if (normalizedReason.length < 3) {
            setError("Opisz problem w co najmniej 3 znakach.");
            return;
        }

        setError(null);

        startTransition(async () => {
            try {
                await reportMaterial(materialId, normalizedReason);
                setIsSent(true);
            } catch (caughtError) {
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : "Nie udało się wysłać zgłoszenia. Spróbuj ponownie."
                );
            }
        });
    };

    return (
        <>
            <span ref={triggerRef} className={styles.reportTrigger}>
                <Button
                    className={styles.reportButton}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Flag size={14} strokeWidth={2.2} />}
                    aria-label={`Zgłoś materiał ${materialTitle}`}
                    onClick={openModal}
                >
                    Zgłoś
                </Button>
            </span>

            {isOpen &&
                createPortal(
                    <div
                        className={styles.reportModalBackdrop}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) closeModal();
                        }}
                    >
                        <section
                            className={styles.reportModal}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={titleId}
                            aria-describedby={isSent ? undefined : descriptionId}
                        >
                            <header className={styles.reportModalHeader}>
                                <span
                                    className={styles.reportModalIcon}
                                    aria-hidden="true"
                                >
                                    <Flag size={21} strokeWidth={2.2} />
                                </span>

                                <div>
                                    <span className={styles.reportModalEyebrow}>
                                        Zgłoszenie materiału
                                    </span>
                                    <h2 id={titleId}>Zgłoś problem</h2>
                                </div>

                                <button
                                    className={styles.reportModalClose}
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isPending}
                                    aria-label="Zamknij okno zgłoszenia"
                                >
                                    <X size={20} />
                                </button>
                            </header>

                            {isSent ? (
                                <div className={styles.reportModalSuccess}>
                                    <CheckCircle2 size={42} aria-hidden="true" />
                                    <h3>Dziękujemy za zgłoszenie</h3>
                                    <p>
                                        Sprawdzimy materiał „{materialTitle}” tak szybko,
                                        jak to możliwe.
                                    </p>
                                    <Button onClick={closeModal}>Gotowe</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <p
                                        id={descriptionId}
                                        className={styles.reportModalDescription}
                                    >
                                        Napisz, co jest nie tak z materiałem „{materialTitle}”.
                                        Twoje zgłoszenie trafi do moderatorów.
                                    </p>

                                    <label
                                        className={styles.reportReasonLabel}
                                        htmlFor={`${titleId}-reason`}
                                    >
                                        Powód zgłoszenia
                                    </label>
                                    <textarea
                                        id={`${titleId}-reason`}
                                        className={styles.reportReasonInput}
                                        value={reason}
                                        onChange={(event) => {
                                            setReason(event.target.value);
                                            if (error) setError(null);
                                        }}
                                        placeholder="Np. plik jest uszkodzony, zawiera niewłaściwe treści albo dotyczy innego przedmiotu..."
                                        minLength={3}
                                        maxLength={MAX_REASON_LENGTH}
                                        rows={5}
                                        required
                                        autoFocus
                                        disabled={isPending}
                                    />

                                    <div className={styles.reportReasonMeta}>
                                        <span>{reason.length}/{MAX_REASON_LENGTH}</span>
                                    </div>

                                    {error && (
                                        <p
                                            className={styles.reportModalError}
                                            role="alert"
                                        >
                                            <AlertTriangle size={16} aria-hidden="true" />
                                            {error}
                                        </p>
                                    )}

                                    <footer className={styles.reportModalActions}>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={closeModal}
                                            disabled={isPending}
                                        >
                                            Anuluj
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="danger"
                                            isLoading={isPending}
                                            leftIcon={<Flag size={16} />}
                                        >
                                            Wyślij zgłoszenie
                                        </Button>
                                    </footer>
                                </form>
                            )}
                        </section>
                    </div>,
                    document.body
                )}
        </>
    );
}
