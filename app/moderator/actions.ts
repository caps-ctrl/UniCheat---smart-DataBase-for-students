"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getModeratorReports } from "@/lib/queries/getModeratorReports";
import type { ModeratorReportsCursor } from "./types";
import { requireModerator } from "@/lib/queries/requireModerator";

const cursorSchema = z.object({
  status_priority: z.number().int().min(0).max(1),
  created_at: z.string().datetime({ offset: true }),
  id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
});

const streamSchema = z.object({ after: cursorSchema.nullable(), done: z.boolean() });
const reportsCursorSchema = z.object({ material: streamSchema, comment: streamSchema });

export async function getNextReportsPage(cursor: ModeratorReportsCursor) {
  const parsed = reportsCursorSchema.safeParse(cursor);
  if (!parsed.success) {
    return {
      reports: [], nextCursor: null, hasMore: false,
      errors: ["Nieprawidłowy kursor strony. Odśwież panel i spróbuj ponownie."],
    };
  }

  return getModeratorReports(parsed.data);
}
const changeStatusSchema = z.object({
  table: z.enum(["material_reports", "reported_lecturer_comments"]),
  id: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  status: z.enum(["pending", "resolved", "rejected"]),
  reason: z.string().trim().min(1).max(1000).optional(),
}).strict();

type ChangeStatusInput = z.infer<typeof changeStatusSchema>;

export async function changeStatus(input: ChangeStatusInput) {
  const supabase = await requireModerator();
  const parsed = changeStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Nieprawidłowe dane akcji moderatora." };
  }

  // RPC derives moderator_id from auth.uid(), never from client input.
  const { error } = await supabase.rpc("moderate_report", {
    p_report_table: parsed.data.table,
    p_report_id: parsed.data.id,
    p_status: parsed.data.status,
    p_reason: parsed.data.reason,
  });

  if (error) {
    console.error("Błąd zmiany statusu zgłoszenia", error);
    return { success: false, message: "Nie udało się zmienić statusu zgłoszenia. Spróbuj ponownie." };
  }
  revalidatePath("/moderator");
  return {
    success: true,
    message: "Status zgłoszenia został zmieniony.",
    page: await getModeratorReports(),
  };
}

export async function acceptReport(input: Omit<ChangeStatusInput, "status">) {
  return changeStatus({ ...input, status: "resolved" });
}
