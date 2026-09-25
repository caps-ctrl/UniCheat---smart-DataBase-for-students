"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState, useTransition } from "react";
import { FileUp, LoaderCircle, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addMaterial, type AddMaterialResult } from "./actions";
import type { ChannelType } from "../types";
import styles from "./subject.module.css";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

type MaterialUploaderProps = {
  bucketName: string;
  channelType: ChannelType;
  subjectId: number;
};



export function MaterialUploader({

  channelType,
  subjectId,
}: MaterialUploaderProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<AddMaterialResult | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const file = formData.get("file");

    if (title.length < 3 || title.length > 120) {
      setResult({
        success: false,
        message: "Tytuł musi mieć od 3 do 120 znaków.",
      });
      return;
    }

    if (!(file instanceof File) || file.size === 0) {
      setResult({ success: false, message: "Wybierz plik do wysłania." });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResult({
        success: false,
        message: "Plik może mieć maksymalnie 6 MB.",
      });
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setResult({
          success: false,
          message: "Zaloguj się, aby dodać materiał.",
        });
        return;
      }




      const actionResult = await addMaterial({
        subjectId,
        channelType,
        title,

        file,
        fileName: file.name.slice(0, 255),
        pagePath: window.location.pathname,
      });





      setResult(actionResult);

      if (actionResult.success) {
        formRef.current?.reset();
        setSelectedFileName(null);
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} className={styles.uploadForm} onSubmit={handleSubmit}>
      <label className={styles.uploadField}>
        <span>Tytuł materiału</span>
        <input
          name="title"
          type="text"
          minLength={3}
          maxLength={120}
          placeholder="np. Notatki do kolokwium 1"
          disabled={isPending}
          required
        />
      </label>

      <label className={styles.fileField}>
        <FileUp size={18} aria-hidden="true" />
        <span>{selectedFileName ?? "Wybierz plik (maks. 6 MB)"}</span>
        <input
          name="file"
          type="file"
          disabled={isPending}
          required
          onChange={(event) =>
            setSelectedFileName(event.currentTarget.files?.[0]?.name ?? null)
          }
        />
      </label>

      {result && (
        <p
          className={result.success ? styles.uploadSuccess : styles.uploadError}
          role={result.success ? "status" : "alert"}
        >
          {result.message}{" "}
          {!result.success && result.message.startsWith("Zaloguj") && (
            <Link href="/login">Przejdź do logowania</Link>
          )}
        </p>
      )}

      <button className={styles.uploadButton} type="submit" disabled={isPending}>
        {isPending ? (
          <LoaderCircle className={styles.spinner} size={16} aria-hidden="true" />
        ) : (
          <Upload size={16} aria-hidden="true" />
        )}
        {isPending ? "Dodawanie…" : "Dodaj materiał"}
      </button>
    </form>
  );
}
