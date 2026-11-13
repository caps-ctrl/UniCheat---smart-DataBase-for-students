import type { ReactNode } from "react";
import { requireModerator } from "@/lib/queries/requireModerator";

export default async function ModeratorLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireModerator();

  return children;
}
