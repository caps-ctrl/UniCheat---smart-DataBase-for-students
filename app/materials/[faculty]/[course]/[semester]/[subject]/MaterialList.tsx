import styles from "./subject.module.css";
import type { MaterialFile } from "@/lib/queries/getMaterials";
import {
    Download,
    FileQuestion,
    FileText,
    LockKeyhole,
} from "lucide-react";
import ReportModal from "./ReportModal";
import FileModal from "./FileModal";

type MaterialListProps = {
    materials: MaterialFile[];
};


function formatMaterialDate(date: string | null) {
    if (!date) return "Data niedostępna";

    return new Intl.DateTimeFormat("pl-PL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}



export default function MaterialList({ materials }: MaterialListProps) {


    const counts: Record<string, number> = {};
    return materials.length > 0 ? (
        <div className={styles.materialsPanel}>
            <div className={styles.materialsPanelHeader}>
                <div>
                    <span className={styles.statusBadge}>Dostępne pliki</span>

                    <h3>
                        {materials.length}{" "}
                        {materials.length === 1 ? "materiał" : "materiały"}
                    </h3>
                </div>


            </div>

            <ul className={styles.materialsList}>
                {materials.map((material) => {
                    counts[material.title] = (counts[material.title] ?? 0) + 1;
                    const number = counts[material.title];

                    return (
                        <li key={material.id} className={styles.materialItem}>
                            <span
                                className={styles.materialIcon}
                                aria-hidden="true"
                            >
                                <FileText size={21} />
                            </span>

                            <div className={styles.materialCopy}>
                                <strong>{material.title}  {number !== 1 ? `(${number - 1})` : ''}</strong>
                                <span>{material.file_name} </span>

                                <time dateTime={material.created_at ?? undefined}>
                                    Dodano {formatMaterialDate(material.created_at)}
                                </time>
                            </div>

                            {material.downloadUrl && material.previewUrl ? (
                                <div className={styles.materialActions}>
                                    <FileModal
                                        materialTitle={material.title}
                                        fileName={material.file_name}
                                        previewUrl={material.previewUrl}
                                        downloadUrl={material.downloadUrl}
                                    />
                                    <a
                                        className={styles.downloadButton}
                                        href={material.downloadUrl}
                                        aria-label={`Pobierz ${material.file_name}`}
                                    >
                                        <Download size={16} aria-hidden="true" />
                                        Pobierz
                                    </a>
                                    <ReportModal
                                        materialId={material.id}
                                        materialTitle={material.title}
                                    />
                                </div>
                            ) : (
                                <span className={styles.unavailableFile}>
                                    <LockKeyhole size={14} aria-hidden="true" />
                                    Brak dostępu
                                </span>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    ) : <div className={styles.emptyMaterials}>
        <span className={styles.emptyIcon} aria-hidden="true">

        </span>
        <div>
            <span className={styles.statusBadge}>
                Katalog jest gotowy ale pusty
            </span>

        </div>
        <FileQuestion
            className={styles.emptyDecoration}
            size={86}
            aria-hidden="true"
        />
    </div>;
}
