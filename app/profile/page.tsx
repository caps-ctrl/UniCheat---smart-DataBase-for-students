import type { Metadata } from "next";

import { NavBar } from "@/components/layout/Navbar/NavBar";
import ProfileSettings from "./ProfileSettings";
import { getCurrentProfile } from "@/lib/queries/getCurrentProfile";
import { getProfileFormOptions } from "@/lib/queries/getProfileFormOptions";

export const metadata: Metadata = {
  title: "Profil użytkownika | uniCheat",
  description:
    "Zarządzaj profilem, bezpieczeństwem i preferencjami konta uniCheat.",
};

export default async function ProfilePage() {
  const [profile, options] = await Promise.all([
    getCurrentProfile(),
    getProfileFormOptions(),
  ]);

  if (!profile) {
    return <p>Uzytkownik nie jest zalogowany</p>;
  }

  if (!options) {
    return <p>Wystąpił błąd podczas pobierania profilu.</p>;
  }

  return (
    <ProfileSettings
      data={profile}
      faculties={options.faculties}
      courses={options.courses}
      navigationBar={<NavBar />}
    />
  );
}
