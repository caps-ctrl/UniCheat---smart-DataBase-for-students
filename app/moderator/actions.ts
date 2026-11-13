"use server";

import { z } from "zod";
import { getModeratorReports } from "@/lib/queries/getModeratorReports";
import type { ModeratorReportsCursor } from "./types";

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
  // getModeratorReports sprawdza uprawnienia przy kazdym wywolaniu.
  return getModeratorReports(parsed.data);
}
