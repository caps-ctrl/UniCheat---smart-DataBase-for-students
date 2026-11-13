"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, FileText, Flag, Inbox, MessageSquare, RotateCcw, Search, ShieldCheck, X } from "lucide-react";
import { channelLabels, kindLabels, reportKey, reportTitle, statusLabels, type ModerationReport, type ModeratorReportsPage, type ReportKind, type ReportStatus } from "./types";
import { getNextReportsPage } from "./actions";
import styles from "./moderator.module.css";

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw",
});
const formatDate = (date: string | null) => date ? dateFormatter.format(new Date(date)) : "Brak daty";

export default function ModeratorPanel({ initialReports, errors: initialErrors, nextCursor, hasMore }: {
  initialReports: ModerationReport[];
  errors: string[];
  nextCursor: ModeratorReportsPage["nextCursor"];
  hasMore: boolean;
}) {
  const [pages, setPages] = useState<ModeratorReportsPage[]>([
    { reports: initialReports, nextCursor, hasMore },
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [errors, setErrors] = useState(initialErrors);
  const [isPending, startTransition] = useTransition();
  const currentPage = pages[pageIndex];
  const reports = currentPage.reports;
  const [kind, setKind] = useState<ReportKind | "all">("all");
  const [status, setStatus] = useState<ReportStatus | "all">("pending");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(initialReports[0] ? reportKey(initialReports[0]) : null);
  const [notice, setNotice] = useState("");
  //dodac useMemo do filtered
  const filtered = reports.filter((item) => {
    const searchable = `${reportTitle(item)} ${item.report.reason} ${(item.reporter?.username ?? "Użytkownik niedostępny")} ${item.report.id} ${item.kind === "material" ? `${(item.material?.file_name ?? "")} ${(item.subject?.name ?? "")}` : (item.comment?.content ?? "")}`;
    return (kind === "all" || item.kind === kind) && (status === "all" || item.report.status === status) && searchable.toLocaleLowerCase("pl").includes(query.trim().toLocaleLowerCase("pl"));
  });
  const selected = filtered.find((item) => reportKey(item) === selectedKey) ?? filtered[0];

  function showPage(index: number) {
    setPageIndex(index);
    setSelectedKey(null);
    setNotice("");
    setErrors([]);
  }

  function nextPage() {
    if (isPending || !currentPage.hasMore || !currentPage.nextCursor) return;
    if (pages[pageIndex + 1]) {
      showPage(pageIndex + 1);
      return;
    }
    const cursor = currentPage.nextCursor;
    startTransition(async () => {
      try {
        const result = await getNextReportsPage(cursor);
        if (result.errors.length) {
          setErrors(result.errors);
          return;
        }
        setPages((current) => [...current, result]);
        showPage(pageIndex + 1);
      } catch {
        setErrors(["Nie udało się pobrać kolejnej strony. Spróbuj ponownie."]);
      }
    });
  }

  function changeStatus(nextStatus: ReportStatus) {
    if (!selected) return;
    const key = reportKey(selected);
    setPages((current) => current.map((page, index) => index !== pageIndex ? page : {
      ...page,
      reports: page.reports.map((item) => {
        if (reportKey(item) !== key) return item;
        if (item.kind === "material") {
          return { ...item, report: { ...item.report, status: nextStatus } };
        }
        return { ...item, report: { ...item.report, status: nextStatus } };
      }),
    }));
    setNotice(`Zgłoszenie #${selected.report.id}: ${statusLabels[nextStatus].toLocaleLowerCase("pl")}. Zmiana została zapisana tylko w podglądzie.`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.brand}><ShieldCheck size={23} aria-hidden="true" />uniCheat <span> / Moderacja</span></Link>
          <Link href="/profile" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Wróć do profilu</Link>
        </header>

        <section className={styles.hero} aria-labelledby="moderator-title">
          <div><p className={styles.eyebrow}>Przestrzeń moderatora</p><h1 id="moderator-title">Zadbaj o dobrą <span>społeczność.</span></h1><p>Przeglądaj zgłoszenia i pomagaj utrzymać jakość materiałów oraz dyskusji.</p></div>
          <span className={styles.demoBadge}>Zgłoszenia społeczności</span>
        </section>

        <div className={styles.demoNote}><ShieldCheck size={20} aria-hidden="true" /><p>Zgłoszenia pochodzą z bazy danych. Zmiany statusów działają na razie tylko lokalnie i znikają po odświeżeniu strony.</p></div>

        {errors.length > 0 && <div className={styles.errorNote} role="alert">{errors.map((error) => <p key={error}>{error}</p>)}<a href="/moderator">Ponów pobieranie</a></div>}

        <section className={styles.stats} aria-label="Podsumowanie zgłoszeń na bieżącej stronie">
          {(["pending", "resolved", "rejected"] as const).map((value) => (
            <button key={value} type="button" className={`${styles.stat} ${status === value ? styles.statActive : ""}`} onClick={() => setStatus(value)} aria-pressed={status === value}>
              <span className={`${styles.statIcon} ${styles[value]}`}>{value === "pending" ? <Flag size={21} /> : value === "resolved" ? <Check size={21} /> : <X size={21} />}</span>
              <span><span className={styles.statLabel}>{statusLabels[value]}</span><strong>{reports.filter((item) => item.report.status === value).length}</strong></span><ChevronRight size={18} aria-hidden="true" />
            </button>
          ))}
        </section>

        <section className={styles.workspace} aria-labelledby="reports-title">
          <div className={styles.workspaceHeading}><div><h2 id="reports-title">Centrum zgłoszeń</h2><p>Każde zgłoszenie to szansa na lepsze uniCheat.</p></div><span className={styles.total}>{reports.length} zgłoszeń na stronie</span></div>
          <div className={styles.toolbar}>
            <div className={styles.filters} role="group" aria-label="Rodzaj zgłoszenia">
              {(["all", "material", "comment"] as const).map((value) => <button type="button" key={value} aria-pressed={kind === value} className={kind === value ? styles.filterActive : styles.filter} onClick={() => setKind(value)}>{value === "all" ? "Wszystkie" : kindLabels[value]}</button>)}
            </div>
            <label className={styles.search}><Search size={17} aria-hidden="true" /><input aria-label="Szukaj zgłoszeń" placeholder="Szukaj zgłoszenia…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <label className={styles.statusSelect}>Status<select value={status} onChange={(event) => { const value = event.target.value; if (value === "all" || value === "pending" || value === "resolved" || value === "rejected") setStatus(value); }}><option value="all">Wszystkie statusy</option>{(["pending", "resolved", "rejected"] as const).map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label>
          </div>

          <div className={styles.columns}>
            <div className={styles.reportList}>
              <p className={styles.listHeading} aria-live="polite">Wyniki na stronie: {filtered.length} <span>Oczekujące najpierw</span></p>
              {filtered.map((item) => {
                const active = selected && reportKey(selected) === reportKey(item);
                const Icon = item.kind === "material" ? FileText : MessageSquare;
                return <button type="button" key={reportKey(item)} className={`${styles.reportCard} ${active ? styles.reportActive : ""}`} onClick={() => setSelectedKey(reportKey(item))} aria-pressed={Boolean(active)} aria-controls="report-details">
                  <span className={styles.reportTop}><span className={styles.kind}><Icon size={15} aria-hidden="true" />{item.kind === "material" ? "Materiał" : "Komentarz"} · #{item.report.id}</span><span className={`${styles.badge} ${styles[item.report.status]}`}>{statusLabels[item.report.status]}</span></span>
                  <strong>{reportTitle(item)}</strong><span className={styles.reasonPreview}>{item.report.reason}</span><span className={styles.reportMeta}>{item.reporter ? `@${item.reporter.username}` : "Użytkownik niedostępny"}<span><time dateTime={item.report.created_at ?? undefined} suppressHydrationWarning>{formatDate(item.report.created_at)}</time></span></span>
                </button>;
              })}
              {filtered.length === 0 && <div className={styles.empty}><Inbox size={35} aria-hidden="true" /><h3>{errors.length > 0 ? "Lista zgłoszeń jest niepełna" : "Brak zgłoszeń"}</h3><p>{errors.length > 0 ? "Część danych jest niedostępna. Ponów pobieranie." : "Zmień filtry lub wpisz inne hasło."}</p><button type="button" onClick={() => { setKind("all"); setStatus("all"); setQuery(""); }}>Wyczyść filtry</button></div>}
            </div>

            <section id="report-details" className={styles.details} aria-label="Szczegóły zgłoszenia">
              {selected ? <>
                <div className={styles.detailHeading}><p className={styles.eyebrow}>Szczegóły zgłoszenia #{selected.report.id}</p><span className={`${styles.badge} ${styles[selected.report.status]}`}>{statusLabels[selected.report.status]}</span></div>
                <h3>{reportTitle(selected)}</h3><p className={styles.detailSubtitle}>{selected.kind === "material" ? `${selected.subject?.name ?? "Przedmiot niedostępny"} · ${selected.material ? channelLabels[selected.material.channel_type] : "Kanał niedostępny"}` : "Opinia o wykładowcy"}</p>
                <dl className={styles.metadata}><div><dt>Zgłaszający</dt><dd>{selected.reporter ? `@${selected.reporter.username}` : "Użytkownik niedostępny"}</dd></div><div><dt>Data zgłoszenia</dt><dd><time dateTime={selected.report.created_at ?? undefined} suppressHydrationWarning>{formatDate(selected.report.created_at)}</time></dd></div></dl>
                <div className={styles.reasonBox}><h4><Flag size={16} aria-hidden="true" />Powód zgłoszenia</h4><p>{selected.report.reason}</p></div>
                <div className={styles.preview}><h4>{selected.kind === "material" ? "Zgłoszony materiał" : "Treść komentarza"}</h4>{selected.kind === "material" ? selected.material ? <div className={styles.file}><FileText size={28} aria-hidden="true" /><div><strong>{selected.material.file_name}</strong><span>Dodano: <time dateTime={selected.material.created_at ?? undefined} suppressHydrationWarning>{formatDate(selected.material.created_at)}</time></span><span>{selected.material.uploaded_by ? `Autor: ${selected.material.uploaded_by}` : "Autor niedostępny"}</span></div></div> : <p className={styles.detailSubtitle}>Materiał został usunięty lub nie masz dostępu do jego szczegółów.</p> : selected.comment ? <><p className={styles.rating}>Ocena: {selected.comment.rating} / 5</p><blockquote>{selected.comment.content}</blockquote><p className={styles.detailSubtitle}>Dodano: <time dateTime={selected.comment.created_at ?? undefined} suppressHydrationWarning>{formatDate(selected.comment.created_at)}</time></p></> : <p className={styles.detailSubtitle}>Komentarz został usunięty lub nie masz dostępu do jego treści.</p>}</div>
                <div className={styles.actions}><h4>Decyzja moderatora</h4><p>Zmiana statusu dotyczy zgłoszenia. Treść pozostaje w podglądzie.</p>{selected.report.status === "pending" ? <div className={styles.actionButtons}><button type="button" className={styles.resolve} onClick={() => changeStatus("resolved")}><Check size={17} aria-hidden="true" />Oznacz jako rozwiązane</button><button type="button" className={styles.reject} onClick={() => changeStatus("rejected")}><X size={17} aria-hidden="true" />Odrzuć zgłoszenie</button></div> : <button type="button" className={styles.reject} onClick={() => changeStatus("pending")}><RotateCcw size={16} aria-hidden="true" />Przywróć do oczekujących</button>}</div>
              </> : <div className={styles.empty}><ShieldCheck size={40} aria-hidden="true" /><h3>{errors.length > 0 ? "Dane niedostępne" : "Brak zgłoszeń do wyświetlenia"}</h3><p>Wybierz inne filtry, aby zobaczyć pozostałe zgłoszenia.</p></div>}
            </section>
          </div>
          <nav className={styles.pagination} aria-label="Strony zgłoszeń" aria-busy={isPending}>
            <button type="button" disabled={pageIndex === 0 || isPending} onClick={() => showPage(pageIndex - 1)}>
              <ChevronLeft size={16} aria-hidden="true" /> Poprzednia
            </button>
            <div className={styles.pageInfo}>
              <span role="status">{isPending ? "Ładowanie…" : `Strona ${pageIndex + 1}`}</span>
              <small>Filtry i liczniki dotyczą bieżącej strony.</small>
            </div>
            <button type="button" disabled={!currentPage.hasMore || !currentPage.nextCursor || isPending} onClick={nextPage}>
              Następna <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        </section>
        <p className={styles.notice} role="status">{notice}</p>
        <footer className={styles.footer}><ShieldCheck size={15} aria-hidden="true" />Małe decyzje. Lepsza społeczność.</footer>
      </div>
    </main>
  );
}
