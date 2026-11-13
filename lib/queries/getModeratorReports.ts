import "server-only";
import type { ModerationReport, ModeratorReportsCursor, ModeratorReportsPage, ReportCursor } from "@/app/moderator/types";
import { requireModerator } from "./requireModerator";
import { mergeReportPages, reportCursor, type ReportsBatch } from "./moderatorReportPagination";

const PAGE_SIZE = 10;

type MaterialReportsPage = {
  reports: Extract<ModerationReport, { kind: "material" }>[];
  nextCursor: ReportCursor | null;
  hasMore: boolean;
};

type CommentReportsPage = {
  reports: Extract<ModerationReport, { kind: "comment" }>[];
  nextCursor: ReportCursor | null;
  hasMore: boolean;
};

export async function getModeratorReports(
  cursor: ModeratorReportsCursor | null = null,
): Promise<ModeratorReportsPage & { errors: string[] }> {
  const supabase = await requireModerator();

  async function getMaterialReports(
    cursor: ReportCursor | null = null
  ): Promise<MaterialReportsPage> {
    const { data, error } = await supabase.rpc(
      "get_material_reports_page",
      {
        p_cursor_priority: cursor?.status_priority ?? undefined,
        p_cursor_created_at: cursor?.created_at ?? undefined,
        p_cursor_id: cursor?.id ?? undefined,
        p_limit: PAGE_SIZE + 1,
      }
    ).select(`*, reporter:profiles!material_reports_reported_by_fkey(id, username),
      material:materials!material_reports_material_id_fkey(*,
        subject:subjects(name))`);

    if (error) {
      throw new Error(error.message);
    }


    const hasMore = (data?.length ?? 0) > PAGE_SIZE;

    const rows = (data ?? []).slice(0, PAGE_SIZE);
    const reports: MaterialReportsPage["reports"] = rows.map(({ reporter, material, ...report }) => {
      if (material) {
        const { subject, ...materialRow } = material;
        return { kind: "material", report, reporter, material: materialRow, subject };
      }
      return { kind: "material", report, reporter, material: null, subject: null };
    });


    const lastReport = rows.at(-1);

    const nextCursor: ReportCursor | null =
      hasMore && lastReport
        ? {
          status_priority: lastReport.status_priority ?? (lastReport.status === "pending" ? 0 : 1),
          created_at: lastReport.created_at,
          id: lastReport.id,
        }
        : null;

    return {
      reports,
      nextCursor,
      hasMore,
    };
  }



  async function getComments(
    cursor: ReportCursor | null = null,
  ): Promise<CommentReportsPage> {
    const { data, error } = await supabase.rpc(
      "get_comment_reports_page",
      {
        p_cursor_priority: cursor?.status_priority ?? undefined,
        p_cursor_created_at: cursor?.created_at ?? undefined,
        p_cursor_id: cursor?.id ?? undefined,
        p_limit: PAGE_SIZE + 1,
      },
    ).select(`*, reporter:profiles!fk_reported_by(id, username),
      comment:lecturer_comments!fk_lecturer_coment(*,
        lecturer:lecturers(first_name, last_name, academic_title))`);

    if (error) throw new Error(error.message);
    if (data?.some((row) => !row.created_at)) {
      throw new Error("Zgłoszenia komentarzy wymagają created_at do paginacji.");
    }

    const hasMore = (data?.length ?? 0) > PAGE_SIZE;
    const rows = (data ?? []).slice(0, PAGE_SIZE);
    const reports: CommentReportsPage["reports"] = rows.map(({ reporter, comment, ...report }) => {
      if (comment) {
        const { lecturer, ...commentRow } = comment;
        return { kind: "comment", report, reporter, comment: commentRow, lecturer };
      }
      return { kind: "comment", report, reporter, comment: null, lecturer: null };
    });
    const lastReport = reports.at(-1);
    const nextCursor = hasMore && lastReport ? reportCursor(lastReport) : null;
    return { reports, nextCursor, hasMore };
  }

  const emptyBatch = { reports: [], hasMore: false };
  const results = await Promise.allSettled([
    cursor?.material.done ? Promise.resolve(emptyBatch) : getMaterialReports(cursor?.material.after),
    cursor?.comment.done ? Promise.resolve(emptyBatch) : getComments(cursor?.comment.after),
  ]);
  const errors: string[] = [];
  const batches = results.map((result, index): ReportsBatch => {
    if (result.status === "fulfilled") return result.value;
    console.error("Błąd pobierania zgłoszeń moderatora", result.reason);
    errors.push(index === 0
      ? "Nie udało się pobrać zgłoszeń materiałów. Spróbuj ponownie."
      : "Nie udało się pobrać zgłoszeń komentarzy. Spróbuj ponownie.");
    // Nie oznaczamy niedostepnego zrodla jako wyczerpanego.
    return { reports: [], hasMore: true };
  });
  const page = mergeReportPages({ material: batches[0], comment: batches[1] }, cursor, PAGE_SIZE);
  return { ...page, errors };
}
