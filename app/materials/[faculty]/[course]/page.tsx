import type { Metadata } from "next";
import { NavBar } from "@/components/layout/Navbar/NavBar";

import styles from "../../materials.module.css";
import SemesterList from "./SemesterList";

type MaterialsCoursePageProps = {
  params: Promise<{
    faculty: string;
    course: string;
  }>;
};

export const metadata: Metadata = {
  title: "Materiały studenckie | uniCheat",
  description:
    "Notatki, opracowania, zestawy zadań i materiały przekazane przez poprzednich studentów ZUT.",
};

export default async function MaterialsPage({
  params,
}: MaterialsCoursePageProps) {
  const { faculty, course } = await params;

  return (
    <main className={styles.page}>
      <div className={styles.shell}>

        <NavBar />


        <div className="p-4">  <SemesterList faculty={faculty} course={course} /></div>
      </div>
    </main>
  );
}
