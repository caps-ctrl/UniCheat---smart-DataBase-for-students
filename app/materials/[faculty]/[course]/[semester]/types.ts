import type { Database } from "@/lib/database.types";

export type ChannelType = "lecture" | "lab" | "exercises";

type SubjectChannel = {
    type: ChannelType;
    label: string;
};

export type Subject = {
  name: string;
  slug: string;
  subject_channels: SubjectChannel[];
  theme: Database["public"]["Enums"]["theme_type"];
  icon: Database["public"]["Enums"]["icon_type"];
};
