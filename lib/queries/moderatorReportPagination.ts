import type {
  ModerationReport, ModeratorReportsCursor, ModeratorReportsPage, ReportCursor, ReportKind,
} from "@/app/moderator/types";

export type ReportsBatch = {
  reports: ModerationReport[];
  hasMore: boolean;
};

export function reportCursor(item: ModerationReport): ReportCursor {
  if (!item.report.created_at) {
    throw new Error("Zgłoszenie bez created_at nie może być użyte jako kursor.");
  }
  return {
    status_priority: item.report.status_priority ?? (item.report.status === "pending" ? 0 : 1),
    created_at: item.report.created_at,
    id: item.report.id,
  };
}

function compareReports(a: ModerationReport, b: ModerationReport) {
  const left = reportCursor(a);
  const right = reportCursor(b);
  const priority = left.status_priority - right.status_priority;
  if (priority) return priority;
  const milliseconds = Date.parse(right.created_at) - Date.parse(left.created_at);
  if (milliseconds) return milliseconds;
  // PostgreSQL zachowuje mikrosekundy, ktore Date.parse obcina.
  const fraction = (date: string) => (date.match(/\.(\d+)/)?.[1] ?? "").padEnd(6, "0");
  const leftFraction = fraction(left.created_at);
  const rightFraction = fraction(right.created_at);
  if (leftFraction !== rightFraction) return leftFraction > rightFraction ? -1 : 1;
  return right.id - left.id || (a.kind === b.kind ? 0 : a.kind === "material" ? -1 : 1);
}

export function mergeReportPages(
  batches: Record<ReportKind, ReportsBatch>,
  cursor: ModeratorReportsCursor | null,
  pageSize: number,
): ModeratorReportsPage {
  const reports = [...batches.material.reports, ...batches.comment.reports]
    .sort(compareReports).slice(0, pageSize);
  const streamCursor = (kind: ReportKind) => {
    const displayed = reports.filter((report) => report.kind === kind);
    const last = displayed.at(-1);
    return {
      after: last ? reportCursor(last) : cursor?.[kind].after ?? null,
      done: !batches[kind].hasMore && displayed.length === batches[kind].reports.length,
    };
  };
  const nextCursor = { material: streamCursor("material"), comment: streamCursor("comment") };
  const hasMore = !nextCursor.material.done || !nextCursor.comment.done;
  return { reports, hasMore, nextCursor: hasMore ? nextCursor : null };
}
