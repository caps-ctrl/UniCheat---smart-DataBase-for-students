import { ReactNode } from "react";

export type Section = "profile" | "notifications" | "security";
import type { Database } from "@/lib/database.types";


export type ProfileRow =
  Database["public"]["Tables"]["profiles"]["Row"];


export type ProfileFormType = Pick<ProfileRow,

  | "full_name"

  | "username"

  | "course_id"

  | "semester"

  | "faculty_id"

  | "interests"

  | "avatar_url"

  | "github_url"

  | "linkedin_url"

  | "bio"

  | "is_profile_public"

  | "university"

>;


export type ProfileSettingsProps = {
  navigationBar: ReactNode;
  data: ProfileFormType;
};




