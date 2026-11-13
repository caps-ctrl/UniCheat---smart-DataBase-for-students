"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  commentRateLimit,
  lecturerCommentReportRateLimit,
} from "@/lib/redis/rateLimit";
import { createClient } from "@/lib/supabase/server";

const commentSchema = z.object({
  lecturerId: z.number().int().positive(),
  slug: z.string().trim().min(1).max(160),
  content: z
    .string()
    .trim()
    .min(3, "Komentarz musi mieć co najmniej 3 znaki.")
    .max(150, "Komentarz może mieć maksymalnie 150 znaków."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Wybierz ocenę.")
    .max(5, "Ocena musi mieścić się w zakresie 1–5."),
});

const reportCommentSchema = z.object({
  commentId: z.number().int().positive(),
  lecturerId: z.number().int().positive(),
  slug: z.string().trim().min(1).max(160),
  reason: z
    .string()
    .trim()
    .min(3, "Powód zgłoszenia musi mieć co najmniej 3 znaki.")
    .max(150, "Powód zgłoszenia może mieć maksymalnie 150 znaków."),
});

const editCommentSchema = z.object({
  commentId: z.number().int().positive(),
  lecturerId: z.number().int().positive(),
  slug: z.string().trim().min(1).max(160),
  content: z
    .string()
    .trim()
    .min(3, "Komentarz musi mieć co najmniej 3 znaki.")
    .max(150, "Komentarz może mieć maksymalnie 150 znaków."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Wybierz ocenę.")
    .max(5, "Ocena musi mieścić się w zakresie 1–5."),
});

export type AddCommentState = {
  status: "idle" | "success" | "error";
  message: string;
};

export type ReportCommentState = AddCommentState;
export type EditCommentState = AddCommentState;

type LecturerReference = {
  lecturerId: number;
  slug: string;
};

type LecturerCommentReference = LecturerReference & {
  commentId: number;
};

export async function addLecturerComment(
  lecturer: LecturerReference,
  _previousState: AddCommentState,
  formData: FormData,
): Promise<AddCommentState> {
  const parsed = commentSchema.safeParse({
    lecturerId: lecturer.lecturerId,
    slug: lecturer.slug,
    content: formData.get("content"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Sprawdź treść komentarza.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "Zaloguj się, aby dodać komentarz.",
    };
  }

  try {
    const { success } = await commentRateLimit.limit(user.id);

    if (!success) {
      return {
        status: "error",
        message:
          "Osiągnięto limit 5 komentarzy na 10 minut. Spróbuj ponownie później.",
      };
    }
  } catch (error) {
    console.error("Nie udało się sprawdzić limitu komentarzy:", error);
    return {
      status: "error",
      message: "Nie udało się zweryfikować limitu. Spróbuj ponownie później.",
    };
  }

  const { lecturerId, slug, content, rating } = parsed.data;
  const { data: existingLecturer, error: lecturerError } = await supabase
    .from("lecturers")
    .select("id")
    .eq("id", lecturerId)
    .eq("slug", slug)
    .single();

  if (lecturerError || !existingLecturer) {
    return {
      status: "error",
      message: "Nie znaleziono tego wykładowcy.",
    };
  }

  const { error } = await supabase.from("lecturer_comments").insert({
    lecturer_id: lecturerId,
    user_id: user.id,
    content,
    rating,
  });

  if (error) {
    console.error("Nie udało się dodać komentarza:", error);
    return {
      status: "error",
      message: error.message.toLowerCase().includes("row-level security")
        ? "Nie masz uprawnień do dodania komentarza. Sprawdź politykę RLS."
        : "Nie udało się dodać komentarza. Spróbuj ponownie.",
    };
  }

  revalidatePath(`/lecturers/${encodeURIComponent(slug)}`);

  return {
    status: "success",
    message: "Komentarz został dodany.",
  };
}

export async function editLecturerComment(
  reference: LecturerCommentReference,
  _previousState: EditCommentState,
  formData: FormData,
): Promise<EditCommentState> {
  const parsed = editCommentSchema.safeParse({
    commentId: reference.commentId,
    lecturerId: reference.lecturerId,
    slug: reference.slug,
    content: formData.get("content"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Sprawdź treść komentarza.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "Zaloguj się, aby edytować komentarz.",
    };
  }

  try {
    const { success } = await commentRateLimit.limit(`${user.id}:edit`);

    if (!success) {
      return {
        status: "error",
        message:
          "Osiągnięto limit 5 edycji na 10 minut. Spróbuj ponownie później.",
      };
    }
  } catch (error) {
    console.error("Nie udało się sprawdzić limitu edycji komentarzy:", error);
    return {
      status: "error",
      message: "Nie udało się zweryfikować limitu. Spróbuj ponownie później.",
    };
  }

  const { commentId, lecturerId, slug, content, rating } = parsed.data;
  const { data: updatedComment, error } = await supabase
    .from("lecturer_comments")
    .update({
      content,
      rating,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("lecturer_id", lecturerId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !updatedComment) {
    console.error("Nie udało się edytować komentarza:", error);
    return {
      status: "error",
      message: error?.message.toLowerCase().includes("row-level security")
        ? "Nie masz uprawnień do edycji tego komentarza."
        : "Nie znaleziono Twojego komentarza lub nie można go edytować.",
    };
  }

  revalidatePath(`/lecturers/${encodeURIComponent(slug)}`);

  return {
    status: "success",
    message: "Komentarz został zaktualizowany.",
  };
}

export async function reportLecturerComment(
  reference: LecturerCommentReference,
  _previousState: ReportCommentState,
  formData: FormData,
): Promise<ReportCommentState> {
  const parsed = reportCommentSchema.safeParse({
    commentId: reference.commentId,
    lecturerId: reference.lecturerId,
    slug: reference.slug,
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Sprawdź powód zgłoszenia.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      message: "Zaloguj się, aby zgłosić komentarz.",
    };
  }

  try {
    const { success } = await lecturerCommentReportRateLimit.limit(user.id);

    if (!success) {
      return {
        status: "error",
        message:
          "Osiągnięto limit 3 zgłoszeń na 10 minut. Spróbuj ponownie później.",
      };
    }
  } catch (error) {
    console.error("Nie udało się sprawdzić limitu zgłoszeń komentarzy:", error);
    return {
      status: "error",
      message: "Nie udało się zweryfikować limitu. Spróbuj ponownie później.",
    };
  }

  const { commentId, lecturerId, reason } = parsed.data;
  const { data: existingComment, error: commentError } = await supabase
    .from("lecturer_comments")
    .select("id")
    .eq("id", commentId)
    .eq("lecturer_id", lecturerId)
    .maybeSingle();

  if (commentError || !existingComment) {
    return {
      status: "error",
      message: "Nie znaleziono tego komentarza.",
    };
  }

  const { error } = await supabase.from("reported_lecturer_comments").insert({
    coment_id: commentId,
    reported_by: user.id,
    reason,
  });

  if (error) {
    console.error("Nie udało się zgłosić komentarza:", error);
    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Ten komentarz został już przez Ciebie zgłoszony."
          : error.message.toLowerCase().includes("row-level security")
            ? "Nie masz uprawnień do zgłoszenia komentarza. Sprawdź politykę RLS."
            : "Nie udało się zgłosić komentarza. Spróbuj ponownie.",
    };
  }

  return {
    status: "success",
    message: "Komentarz został zgłoszony.",
  };
}
