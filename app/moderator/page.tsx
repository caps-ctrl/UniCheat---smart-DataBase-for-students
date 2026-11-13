import type { Metadata } from "next";
import ModeratorPanel from "./ModeratorPanel";
import { getModeratorReports } from "@/lib/queries/getModeratorReports";

export const metadata: Metadata = {
  title: "Panel moderatora | uniCheat",
  description: "Przegląd zgłoszeń materiałów i komentarzy społeczności uniCheat.",
  robots: { index: false, follow: false },
};

export default async function ModeratorPage() {
  const { reports, errors, nextCursor, hasMore } = await getModeratorReports();
  return <ModeratorPanel initialReports={reports} errors={errors} nextCursor={nextCursor} hasMore={hasMore} />;
}
