import type { Enums, Tables } from "@/lib/database.types";

export type ReportStatus = Enums<"reportStatus_type">;
export type ReportKind = "material" | "comment";
type Reporter = Pick<Tables<"profiles">, "id" | "username">;

export type ReportCursor = Pick<Tables<"material_reports">, "created_at" | "id"> & {
  status_priority: number;
};

export type ReportStreamCursor = {
  after: ReportCursor | null;
  done: boolean;
};

export type ModeratorReportsCursor = Record<ReportKind, ReportStreamCursor>;

export type ModeratorReportsPage = {
  reports: ModerationReport[];
  nextCursor: ModeratorReportsCursor | null;
  hasMore: boolean;
};

export type ModerationReport =
  | {
      kind: "material";
      report: Tables<"material_reports">;
      reporter: Reporter | null;
      material: Tables<"materials"> | null;
      subject: Pick<Tables<"subjects">, "name"> | null;
    }
  | {
      kind: "comment";
      report: Tables<"reported_lecturer_comments">;
      reporter: Reporter | null;
      comment: Tables<"lecturer_comments"> | null;
      lecturer: Pick<Tables<"lecturers">, "first_name" | "last_name" | "academic_title"> | null;
    };

export const statusLabels: Record<ReportStatus, string> = {
  pending: "Oczekujące",
  resolved: "Rozwiązane",
  rejected: "Odrzucone",
};

export const kindLabels: Record<ReportKind, string> = {
  material: "Materiały",
  comment: "Komentarze",
};

export const channelLabels: Record<Enums<"channel_type">, string> = {
  lecture: "Wykład",
  lab: "Laboratorium",
  exercises: "Ćwiczenia",
};

export function reportTitle(item: ModerationReport) {
  return item.kind === "material"
    ? item.material?.title ?? "Materiał niedostępny"
    : item.lecturer
      ? [item.lecturer.academic_title, item.lecturer.first_name, item.lecturer.last_name]
          .filter(Boolean).join(" ")
      : "Wykładowca niedostępny";
}

export function reportKey(item: ModerationReport) {
  return `${item.kind}-${item.report.id}`;
}
