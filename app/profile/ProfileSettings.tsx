"use client";

import { ProfileForm } from "./components/ProfileForm/ProfileForm";
import { NotificationsForm } from "./components/NotificationsForm/NotificationForm";
import { SecurityForm } from "./components/SecurityForm/SecurityForm";
import { BookOpen, Check, ChevronRight } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./profile.module.css";
import { navigation } from "@/data/profile/sideBarData";
import type { Section, ProfileSettingsProps, ProfileFormType } from "./types";






export default function ProfileSettings({
  navigationBar,
  data,
}: ProfileSettingsProps) {
  const [section, setSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState<ProfileFormType>(data);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setProfile({
      full_name: String(formData.get("firstName") ?? ""),
      username: String(formData.get("username") ?? ""),
      university: String(formData.get("university") ?? ""),
      course_id: Number(formData.get("course") ?? null),
      semester: Number(formData.get("semester") ?? null),
      faculty_id: Number(formData.get("faculty") ?? null),
      interests: String(formData.get("interests") ?? "")
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean),

      avatar_url: String(formData.get("avatarUrl") ?? ""),

      github_url: String(formData.get("githubUrl") ?? ""),
      linkedin_url: String(formData.get("linkedinUrl") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      is_profile_public: formData.get("isPrivate") === "on",
    });
    setIsEditingProfile(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
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

            <div className={styles.completionCard}>
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
            </div>
          </aside>

          <section className={styles.content} aria-live="polite">
            {section === "profile" && (
              <ProfileForm
                profile={profile}
                isEditing={isEditingProfile}
                onEdit={() => setIsEditingProfile(true)}
                onCancel={() => setIsEditingProfile(false)}
                onSubmit={handleProfileSubmit}
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
        className={`${styles.toast} ${saved ? styles.toastVisible : ""}`}
        role="status"
      >
        <Check size={18} aria-hidden="true" />
        Zmiany zostały zapisane
      </div>
    </main>
  );
}
