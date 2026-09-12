"use client";
import { SectionHeading } from "../shared/SectionHeading";
import {
  BookOpen,
  Building2,
  Camera,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  GraduationCap,
  Lock,

  MapPin,
  Settings2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import styles from "../../profile.module.css";
import type { ReactNode, SubmitEventHandler } from "react";
import { FormActions } from "../shared/FormActions";
import type { ProfileFormType } from "../../types";

import Image from "next/image";

function SocialLink({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
}) {
  const displayUrl = href?.replace(/^https?:\/\/(www\.)?/, "");

  if (!href) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 px-4 py-3.5 text-slate-400">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </span>
        <span>
          <span className="block text-xs font-bold text-slate-500">
            {label}
          </span>
          <span className="text-xs">Nie dodano profilu</span>
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_28px_-18px_rgba(5,150,105,0.45)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-slate-500">{label}</span>
        <span className="block truncate text-sm font-semibold text-slate-700">
          {displayUrl}
        </span>
      </span>
      <ExternalLink
        size={15}
        className="shrink-0 text-slate-300 transition-colors group-hover:text-emerald-600"
        aria-hidden="true"
      />
    </a>
  );
}

export function ProfileForm({
  profile,
  isEditing,
  onEdit,
  onCancel,
  onSubmit,
}: {
  profile: ProfileFormType;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}) {
  const initials = profile.username
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  const [firstName = "", ...lastNameParts] =
    profile.full_name?.split(" ") ?? [];
  const lastName = lastNameParts.join(" ");

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.headingWithAction}>
        <SectionHeading
          icon={Settings2}
          title="Dane profilu"
          description="Te informacje pomagają dopasować treści do Twoich studiów."
        />
        {!isEditing && (
          <button type="button" className={styles.editButton} onClick={onEdit}>
            <Settings2 size={16} aria-hidden="true" />
            Edytuj profil
          </button>
        )}
      </div>

      <div className={styles.avatarEditor}>
        <div className={styles.largeAvatar} aria-hidden="true">
          {initials.toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p>
            {isEditing
              ? "PNG lub JPG, maksymalnie 5 MB."
              : "Widoczne przy Twoich materiałach i komentarzach."}
          </p>
          {isEditing && (
            <label className={styles.uploadButton}>
              <Camera size={16} aria-hidden="true" />
              Zmień zdjęcie
              <input
                type="file"
                accept="image/png,image/jpeg"
                className={styles.visuallyHidden}
              />
            </label>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <input type="hidden" name="username" value={profile.username} />
          <input
            type="hidden"
            name="avatarUrl"
            value={profile.avatar_url ?? ""}
          />

          <section className="rounded-3xl border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)] sm:p-6 lg:col-span-7">
            <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <UserRound size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-emerald-700 uppercase">
                    Profil studenta
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                    Dane osobowe
                  </h3>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                <ShieldCheck size={13} aria-hidden="true" />
                E-mail zweryfikowany
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={styles.field}>
                <span>Imię</span>
                <input
                  name="firstName"
                  defaultValue={firstName}
                  autoComplete="given-name"
                />
              </label>
              <label className={styles.field}>
                <span>Nazwisko</span>
                <input
                  name="lastName"
                  defaultValue={lastName}
                  autoComplete="family-name"
                />
              </label>
              {/* <label className={`${styles.field} sm:col-span-2`}>
                <span>Adres e-mail</span>
                <div className={styles.inputWithIcon}>
                  <Mail size={17} aria-hidden="true" />
                  <input
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    autoComplete="email"
                  />
                </div>
                <small>Adres został zweryfikowany.</small>
              </label>*/}
              <label className={`${styles.field} sm:col-span-2`}>
                <span>O mnie</span>
                <textarea
                  name="bio"
                  rows={4}
                  maxLength={240}
                  defaultValue={profile.bio ?? ""}
                />
                <small>Maksymalnie 240 znaków.</small>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)] sm:p-6 lg:col-span-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Code2 size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.12em] text-emerald-700 uppercase">
                  Sieć i rozwój
                </p>
                <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  Obecność online
                </h3>
              </div>
            </div>

            <div className="grid gap-4">
              <label className={styles.field}>
                <span>Zainteresowania</span>
                <input
                  name="interests"
                  defaultValue={profile.interests?.join(", ") || ""}
                  placeholder="np. Front-end, algorytmy, AI"
                />
                <small>Oddziel zainteresowania przecinkami.</small>
              </label>
              <label className={styles.field}>
                <span>GitHub</span>
                <div className={styles.inputWithIcon}>
                  <Code2 size={17} aria-hidden="true" />
                  <input
                    name="githubUrl"
                    type="url"
                    defaultValue={profile.github_url ?? ""}
                    placeholder="https://github.com/uzytkownik"
                  />
                </div>
              </label>
              <label className={styles.field}>
                <span>LinkedIn</span>
                <div className={styles.inputWithIcon}>
                  <BriefcaseBusiness size={17} aria-hidden="true" />
                  <input
                    name="linkedinUrl"
                    type="url"
                    defaultValue={profile.linkedin_url ?? ""}
                    placeholder="https://linkedin.com/in/uzytkownik"
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[32px] border border-emerald-800/40 bg-[linear-gradient(145deg,#0f172a_0%,#064e3b_55%,#047857_100%)] p-5 text-white shadow-[0_28px_70px_-34px_rgba(4,120,87,0.9)] sm:p-7 lg:col-span-12 lg:min-h-[540px]">
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]"
              aria-hidden="true"
            >
              <Image
                src="/icons/WIZUT.svg"
                width={520}
                height={520}
                alt=""
                className="h-[82%] w-[82%] object-contain brightness-0 invert"
              />
            </div>
            <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-300/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-sky-300/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold tracking-[0.12em] text-emerald-100 uppercase backdrop-blur-sm">
                    <GraduationCap size={15} aria-hidden="true" />
                    Edycja uczelni
                  </span>

                </div>
                <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-emerald-200 uppercase">
                  Twoja uczelnia
                </p>
                <h3 className="max-w-xl text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl">
                  {profile.university ||
                    "Zachodniopomorski Uniwersytet Technologiczny w Szczecinie"}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-3xl border border-white/12 bg-slate-950/20 p-4 backdrop-blur-md sm:grid-cols-2 sm:p-5">
                <label className={styles.field}>
                  <span className="!text-emerald-100">Kierunek</span>
                  <select
                    name="course"
                    defaultValue={profile.course_id ?? 1}
                    className="!border-white/15 !bg-white/95"
                  >
                    <option value="Informatyka">Informatyka</option>
                    <option value="Automatyka i robotyka">
                      Automatyka i robotyka
                    </option>
                    <option value="Budownictwo">Budownictwo</option>
                    <option value="Zarządzanie">Zarządzanie</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span className="!text-emerald-100">Semestr</span>
                  <select
                    name="semester"
                    defaultValue={profile.semester ?? 0}
                    className="!border-white/15 !bg-white/95"
                  >
                    {Array.from({ length: 7 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1} semestr
                      </option>
                    ))}
                  </select>
                </label>
                <label className={`${styles.field} sm:col-span-2`}>
                  <span className="!text-emerald-100">Wydział</span>
                  <select
                    name="faculty"
                    defaultValue={profile.faculty_id ?? 0}
                    className="!border-white/15 !bg-white/95"
                  >
                    <option>Wydział Informatyki</option>
                  </select>
                </label>
                <label
                  className={`${styles.privacyField} !border-white/15 !bg-white/10 sm:col-span-2`}
                >
                  <span className={styles.privacyIcon}>
                    <Lock size={18} aria-hidden="true" />
                  </span>
                  <span className={styles.privacyCopy}>
                    <strong className="text-white">Profil prywatny</strong>
                    <small className="!text-emerald-100/70">
                      Tylko Ty zobaczysz pełne dane profilu i linki
                      społecznościowe.
                    </small>
                  </span>
                  <input
                    className={styles.switch}
                    name="isPrivate"
                    type="checkbox"
                    defaultChecked={profile.is_profile_public}
                    aria-label="Ustaw profil jako prywatny"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* These three cards can later move to PersonalCard, SocialCard and UniversityCard. */}
          <section className="rounded-3xl border border-slate-200 bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)] sm:p-6 lg:col-span-7">
            <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <UserRound size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-emerald-700 uppercase">
                    Profil studenta
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                    Dane osobowe
                  </h3>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                <ShieldCheck size={13} aria-hidden="true" />
                E-mail zweryfikowany
              </span>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="group rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_28px_-18px_rgba(5,150,105,0.45)] sm:p-5">
                <h3 className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                  Imię
                </h3>
                <p className="mt-1.5 text-sm leading-6 font-semibold text-slate-700">
                  {firstName || "Nie uzupełniono"}
                </p>
              </div>

              <div className="group rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_28px_-18px_rgba(5,150,105,0.45)] sm:p-5">
                <h3 className="text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                  Nazwisko
                </h3>
                <p className="mt-1.5 text-sm leading-6 font-semibold text-slate-700">
                  {lastName || "Nie uzupełniono"}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:p-5">
              <span className="mb-2 block text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                O mnie
              </span>
              <p className="m-0 text-sm leading-7 text-slate-600">
                {profile.bio ||
                  "Dodaj kilka słów o sobie i swoich zainteresowaniach."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)] sm:p-6 lg:col-span-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Code2 size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.12em] text-emerald-700 uppercase">
                  Sieć i rozwój
                </p>
                <h3 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  Obecność online
                </h3>
              </div>
            </div>

            <div className="mb-5">
              <span className="mb-2.5 block text-[11px] font-bold tracking-[0.08em] text-slate-400 uppercase">
                Zainteresowania
              </span>
              <div className="flex min-h-10 flex-wrap gap-2">
                {profile.interests?.length ? (
                  profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    Brak dodanych zainteresowań
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <SocialLink
                href={profile.github_url ?? ""}
                icon={<Code2 size={18} aria-hidden="true" />}
                label="GitHub"
              />
              <SocialLink
                href={profile.linkedin_url ?? ""}
                icon={<BriefcaseBusiness size={18} aria-hidden="true" />}
                label="LinkedIn"
              />
            </div>
          </section>

          <section className="relative mx-auto w-full  overflow-hidden rounded-[32px] border border-emerald-800/40 bg-[linear-gradient(145deg,#0f172a_0%,#064e3b_55%,#047857_100%)] p-5 text-white shadow-[0_28px_70px_-34px_rgba(4,120,87,0.9)] sm:p-7 lg:col-span-12 lg:aspect-[6/5]">
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]"
              aria-hidden="true"
            >
              <Image
                src="/icons/WIZUT.svg"
                width={520}
                height={520}
                alt=""
                className="h-[82%] w-[82%] object-contain brightness-0 invert"
              />
            </div>
            <div
              className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-300/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-sky-300/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold tracking-[0.12em] text-emerald-100 uppercase backdrop-blur-sm">
                    <GraduationCap size={15} aria-hidden="true" />
                    Karta uczelni
                  </span>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur-sm">
                    {profile.is_profile_public === false ? (
                      <Lock size={14} aria-hidden="true" />
                    ) : (
                      <ShieldCheck size={14} aria-hidden="true" />
                    )}
                    {profile.is_profile_public === false ? "Profil prywatny" : "Profil publiczny"}
                  </span>
                </div>

                <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-emerald-200 uppercase">
                  Twoja uczelnia
                </p>
                <h3 className="max-w-xl text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl">
                  {profile.university ||
                    "Zachodniopomorski Uniwersytet Technologiczny w Szczecinie"}
                </h3>
              </div>

              <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/12 bg-slate-950/20 backdrop-blur-md sm:grid-cols-2">
                <div className="border-b border-white/10 p-4 sm:border-r sm:p-5">
                  <BookOpen
                    size={18}
                    className="mb-3 text-emerald-300"
                    aria-hidden="true"
                  />
                  <span className="block text-[10px] font-bold tracking-[0.12em] text-emerald-200/80 uppercase">
                    Kierunek
                  </span>
                  <strong className="mt-1.5 block text-sm leading-6 font-semibold text-white">
                    {profile.course_id ? `Kierunek ${profile.course_id}` : "Nie uzupełniono"}
                  </strong>
                </div>
                <div className="border-b border-white/10 p-4 sm:p-5">
                  <GraduationCap
                    size={18}
                    className="mb-3 text-emerald-300"
                    aria-hidden="true"
                  />
                  <span className="block text-[10px] font-bold tracking-[0.12em] text-emerald-200/80 uppercase">
                    Semestr
                  </span>
                  <strong className="mt-1.5 block text-sm leading-6 font-semibold text-white">
                    {profile.semester
                      ? `${profile.semester} semestr`
                      : "Nie uzupełniono"}
                  </strong>
                </div>
                <div className="border-b border-white/10 p-4 sm:border-r sm:border-b-0 sm:p-5">
                  <Building2
                    size={18}
                    className="mb-3 text-emerald-300"
                    aria-hidden="true"
                  />
                  <span className="block text-[10px] font-bold tracking-[0.12em] text-emerald-200/80 uppercase">
                    Wydział
                  </span>
                  <strong className="mt-1.5 block text-sm leading-6 font-semibold text-white">
                    {profile.faculty_id ? `Wydział ${profile.faculty_id}` : "Nie uzupełniono"}
                  </strong>
                </div>
                <div className="p-4 sm:p-5">
                  <MapPin
                    size={18}
                    className="mb-3 text-emerald-300"
                    aria-hidden="true"
                  />

                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {isEditing && <FormActions onCancel={onCancel} />}
    </form>
  );
}
