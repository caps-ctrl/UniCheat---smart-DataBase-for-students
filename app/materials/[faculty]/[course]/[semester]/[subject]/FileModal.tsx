"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Download,
    Eye,
    FileQuestion,
    FileText,
    Headphones,
    ImageIcon,
    Video,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./subject.module.css";

type FileModalProps = {
    materialTitle: string;
    fileName: string;
    previewUrl: string;
    downloadUrl: string;
};

type PreviewType = "document" | "text" | "audio" | "video" | "unsupported";

const DOCUMENT_EXTENSIONS = new Set([
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "avif",
    "bmp",
    "svg",
]);
const TEXT_EXTENSIONS = new Set(["txt", "md", "csv", "json", "xml"]);
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "ogg", "m4a", "aac"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "ogv", "mov"]);

function getFileExtension(fileName: string) {
    return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function getPreviewType(extension: string): PreviewType {
    if (DOCUMENT_EXTENSIONS.has(extension)) return "document";
    if (TEXT_EXTENSIONS.has(extension)) return "text";
    if (AUDIO_EXTENSIONS.has(extension)) return "audio";
    if (VIDEO_EXTENSIONS.has(extension)) return "video";
    return "unsupported";
}

function PreviewIcon({ type }: { type: PreviewType }) {
    if (type === "audio") return <Headphones size={30} />;
    if (type === "video") return <Video size={30} />;
    if (type === "document") return <ImageIcon size={30} />;
    if (type === "text") return <FileText size={30} />;
    return <FileQuestion size={30} />;
}

export default function FileModal({
    materialTitle,
    fileName,
    previewUrl,
    downloadUrl,
}: FileModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [previewFailed, setPreviewFailed] = useState(false);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const titleId = useId();
    const extension = getFileExtension(fileName);
    const previewType = getPreviewType(extension);

    const focusTrigger = () => {
        requestAnimationFrame(() =>
            triggerRef.current?.querySelector("button")?.focus()
        );
    };

    const openModal = () => {
        setPreviewFailed(false);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        focusTrigger();
    };

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                focusTrigger();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const showFallback = previewType === "unsupported" || previewFailed;

    return (
        <>
            <span ref={triggerRef} className={styles.filePreviewTrigger}>
                <Button
                    className={styles.filePreviewButton}
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye size={15} strokeWidth={2.2} />}
                    aria-label={`Wyświetl podgląd pliku ${fileName}`}
                    onClick={openModal}
                >
                    Podgląd
                </Button>
            </span>

            {isOpen &&
                createPortal(
                    <div
                        className={styles.fileModalBackdrop}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) closeModal();
                        }}
                    >
                        <section
                            className={styles.fileModal}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={titleId}
                        >
                            <header className={styles.fileModalHeader}>
                                <span className={styles.fileModalIcon} aria-hidden="true">
                                    <PreviewIcon type={previewType} />
                                </span>

                                <div className={styles.fileModalHeading}>
                                    <span>Podgląd materiału</span>
                                    <h2 id={titleId}>{materialTitle}</h2>
                                    <p title={fileName}>{fileName}</p>
                                </div>

                                {extension && (
                                    <span className={styles.fileTypeBadge}>
                                        {extension.toUpperCase()}
                                    </span>
                                )}

                                <button
                                    className={styles.fileModalClose}
                                    type="button"
                                    onClick={closeModal}
                                    aria-label="Zamknij podgląd pliku"
                                >
                                    <X size={21} />
                                </button>
                            </header>

                            <div className={styles.filePreviewCanvas}>
                                {showFallback ? (
                                    <div className={styles.filePreviewFallback}>
                                        <span aria-hidden="true">
                                            <FileQuestion size={52} />
                                        </span>
                                        <h3>Podgląd tego formatu jest niedostępny</h3>
                                        <p>
                                            Pobierz plik, aby otworzyć go w odpowiedniej
                                            aplikacji na swoim urządzeniu.
                                        </p>
                                        <a
                                            className={styles.fileModalDownloadPrimary}
                                            href={downloadUrl}
                                        >
                                            <Download size={17} aria-hidden="true" />
                                            Pobierz plik
                                        </a>
                                    </div>
                                ) : previewType === "audio" ? (
                                    <div className={styles.fileMediaPreview}>
                                        <Headphones size={62} aria-hidden="true" />
                                        <audio controls src={previewUrl}>
                                            Twoja przeglądarka nie obsługuje odtwarzania audio.
                                        </audio>
                                    </div>
                                ) : previewType === "video" ? (
                                    <video
                                        className={styles.fileVideoPreview}
                                        controls
                                        src={previewUrl}
                                        onError={() => setPreviewFailed(true)}
                                    >
                                        Twoja przeglądarka nie obsługuje odtwarzania wideo.
                                    </video>
                                ) : previewType === "text" ? (
                                    <iframe
                                        className={styles.filePreviewFrame}
                                        src={previewUrl}
                                        title={`Podgląd pliku ${fileName}`}
                                        sandbox=""
                                        onError={() => setPreviewFailed(true)}
                                    />
                                ) : (
                                    <object
                                        className={styles.filePreviewObject}
                                        data={previewUrl}
                                        aria-label={`Podgląd pliku ${fileName}`}
                                        onError={() => setPreviewFailed(true)}
                                    >
                                        <p>Nie udało się wyświetlić podglądu pliku.</p>
                                    </object>
                                )}
                            </div>

                            <footer className={styles.fileModalFooter}>
                                <span>
                                    Podgląd jest dostępny przez ograniczony czas.
                                </span>
                                <div>
                                    <Button variant="ghost" onClick={closeModal}>
                                        Zamknij
                                    </Button>
                                    <a
                                        className={styles.fileModalDownload}
                                        href={downloadUrl}
                                    >
                                        <Download size={16} aria-hidden="true" />
                                        Pobierz
                                    </a>
                                </div>
                            </footer>
                        </section>
                    </div>,
                    document.body
                )}
        </>
    );
}
