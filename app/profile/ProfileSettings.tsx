"use client";

import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import { NotificationsForm } from "./components/NotificationsForm/NotificationForm";
import { SecurityForm } from "./components/SecurityForm/SecurityForm";
import { AlertCircle, BookOpen, Check, ChevronRight } from "lucide-react";
import { type FormEvent, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { navigation } from "@/data/profile/sideBarData";
import type { Section, ProfileSettingsProps } from "./types";
import {

  updateProfile,
  type UpdateProfileState,
} from "./actions";






export default function ProfileSettings({
  navigationBar,
  data,
  faculties,
  courses,
}: ProfileSettingsProps) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toast, setToast] = useState<UpdateProfileState | null>(null);
  const initialProfileState: UpdateProfileState = {
    status: "idle",
    message: "",
  };
  const [, profileAction, isProfilePending] = useActionState(
    async (previousState: UpdateProfileState, formData: FormData) => {
      const result = await updateProfile(previousState, formData);

      if (result.status === "success") {
        setIsEditingProfile(false);
        router.refresh();
      }

      setToast(result);
      window.setTimeout(() => setToast(null), 2800);

      return result;
    },
    initialProfileState,
  );
  const profile = data;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast({ status: "success", message: "Zmiany zostały zapisane." });
    window.setTimeout(() => setToast(null), 2400);
  }

  const initials = profile.username
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {navigationBar}

        <section className={styles.hero} aria-labelledby="profile-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Twoje konto</p>
            <h1 id="profile-title">Ustawienia profilu</h1>
            <p>
              Zarządzaj swoimi danymi, preferencjami i bezpieczeństwem konta.
            </p>
          </div>
          <div className={styles.profileSummary}>
            <div className={styles.avatar} aria-hidden="true">
              {profile.avatar_url ?? initials.toUpperCase()}
            </div>
            <div>
              <strong>{profile.username}</strong>

              {profile.semester !== null && (
                <span>{profile.semester} semestr</span>
              )}
            </div>
          </div>
        </section>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav className={styles.sectionNav} aria-label="Sekcje ustawień">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? styles.navItemActive : styles.navItem}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setSection(item.id)}
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span>{item.label}</span>
                    <ChevronRight
                      className={styles.chevron}
                      size={17}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </nav>

            {/*   <div className={styles.completionCard}>
              <div className={styles.completionIcon}>
                <BookOpen size={20} aria-hidden="true" />
              </div>
              <div>
                <strong>Profil uzupełniony w 80%</strong>
                <p>Dodaj rok studiów, aby inni łatwiej mogli Ci pomóc.</p>
              </div>
              <div
                className={styles.progress}
                aria-label="Profil uzupełniony w 80 procentach"
              >
                <span />
              </div>
            </div>*/}
          </aside>

          <section className={styles.content} aria-live="polite">
            {section === "profile" && (
              <ProfileForm
                profile={profile}
                faculties={faculties}
                courses={courses}
                isEditing={isEditingProfile}
                isPending={isProfilePending}
                onEdit={() => setIsEditingProfile(true)}
                onCancel={() => setIsEditingProfile(false)}
                action={profileAction}
              />
            )}
            {section === "notifications" && (
              <NotificationsForm onSubmit={handleSubmit} />
            )}
            {section === "security" && <SecurityForm onSubmit={handleSubmit} />}
          </section>
        </div>
      </div>

      <div
        className={`${styles.toast} ${toast ? styles.toastVisible : ""} ${toast?.status === "error" ? styles.toastError : ""}`}
        role={toast?.status === "error" ? "alert" : "status"}
      >
        {toast?.status === "error" ? (
          <AlertCircle size={18} aria-hidden="true" />
        ) : (
          <Check size={18} aria-hidden="true" />
        )}
        {toast?.message ?? "Zmiany zostały zapisane."}
      </div>
    </main>
  );
}
