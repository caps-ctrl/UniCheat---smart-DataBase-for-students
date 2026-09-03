export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string | null
          faculty_id: number
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          faculty_id: number
          id?: never
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          faculty_id?: number
          id?: never
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      faculties: {
        Row: {
          created_at: string | null
          id: number
          name: string
          short_name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          name: string
          short_name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: never
          name?: string
          short_name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          course_id: number | null
          created_at: string
          faculty_id: number | null
          full_name: string | null
          github_url: string | null
          id: string
          interests: string[] | null
          is_profile_public: boolean
          linkedin_url: string | null
          semester: number | null
          university: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          course_id?: number | null
          created_at?: string
          faculty_id?: number | null
          full_name?: string | null
          github_url?: string | null
          id: string
          interests?: string[] | null
          is_profile_public?: boolean
          linkedin_url?: string | null
          semester?: number | null
          university?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          course_id?: number | null
          created_at?: string
          faculty_id?: number | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          interests?: string[] | null
          is_profile_public?: boolean
          linkedin_url?: string | null
          semester?: number | null
          university?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_courser_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          course_id: number
          created_at: string | null
          id: number
          number: number
        }
        Insert: {
          course_id: number
          created_at?: string | null
          id?: never
          number: number
        }
        Update: {
          course_id?: number
          created_at?: string | null
          id?: never
          number?: number
        }
        Relationships: [
          {
            foreignKeyName: "semesters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      subject_channels: {
        Row: {
          created_at: string | null
          id: number
          label: string
          subject_id: number
          type: Database["public"]["Enums"]["channel_type"]
        }
        Insert: {
          created_at?: string | null
          id?: never
          label: string
          subject_id: number
          type: Database["public"]["Enums"]["channel_type"]
        }
        Update: {
          created_at?: string | null
          id?: never
          label?: string
          subject_id?: number
          type?: Database["public"]["Enums"]["channel_type"]
        }
        Relationships: [
          {
            foreignKeyName: "subject_channels_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          icon: Database["public"]["Enums"]["icon_type"]
          id: number
          name: string
          semester_id: number
          slug: string
          theme: Database["public"]["Enums"]["theme_type"]
        }
        Insert: {
          created_at?: string | null
          icon: Database["public"]["Enums"]["icon_type"]
          id?: never
          name: string
          semester_id: number
          slug: string
          theme: Database["public"]["Enums"]["theme_type"]
        }
        Update: {
          created_at?: string | null
          icon?: Database["public"]["Enums"]["icon_type"]
          id?: never
          name?: string
          semester_id?: number
          slug?: string
          theme?: Database["public"]["Enums"]["theme_type"]
        }
        Relationships: [
          {
            foreignKeyName: "subjects_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      channel_type: "lecture" | "lab" | "exercises"
      icon_type: "sigma" | "atom" | "code" | "flask"
      theme_type: "sand" | "blue" | "ink" | "violet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      channel_type: ["lecture", "lab", "exercises"],
      icon_type: ["sigma", "atom", "code", "flask"],
      theme_type: ["sand", "blue", "ink", "violet"],
    },
  },
} as const
