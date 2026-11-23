
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "courses": {
                  Row: {
                    "created_at": string | null,"faculty_id": number,"id": number,"name": string,"slug": string
                  }
                  Insert: {
                    "created_at"?: string | null,"faculty_id": number,"id"?: never,"name": string,"slug": string
                  }
                  Update: {
                    "created_at"?: string | null,"faculty_id"?: number,"id"?: never,"name"?: string,"slug"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "courses_faculty_id_fkey"
      columns: ["faculty_id"]
isOneToOne: false
      referencedRelation: "faculties"
      referencedColumns: ["id"]
    }
                  ]
                },"faculties": {
                  Row: {
                    "created_at": string | null,"id": number,"name": string,"short_name": string,"slug": string
                  }
                  Insert: {
                    "created_at"?: string | null,"id"?: never,"name": string,"short_name": string,"slug": string
                  }
                  Update: {
                    "created_at"?: string | null,"id"?: never,"name"?: string,"short_name"?: string,"slug"?: string
                  }
                  Relationships: [
                    
                  ]
                },"lecturer_comments": {
                  Row: {
                    "content": string,"created_at": string,"deleted_at": string | null,"id": number,"lecturer_id": number,"rating": number,"updated_at": string,"user_id": string
                  }
                  Insert: {
                    "content": string,"created_at"?: string,"deleted_at"?: string | null,"id"?: number,"lecturer_id": number,"rating": number,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "content"?: string,"created_at"?: string,"deleted_at"?: string | null,"id"?: number,"lecturer_id"?: number,"rating"?: number,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lecturer_comments_lecturer_id_fkey"
      columns: ["lecturer_id"]
isOneToOne: false
      referencedRelation: "lecturers"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "lecturer_comments_user_id_fkey1"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"lecturers": {
                  Row: {
                    "academic_title": string | null,"created_at": string,"email": string | null,"faculty_id": number | null,"first_name": string,"id": number,"last_name": string,"profile_url": string | null,"slug": string
                  }
                  Insert: {
                    "academic_title"?: string | null,"created_at"?: string,"email"?: string | null,"faculty_id"?: number | null,"first_name": string,"id"?: number,"last_name": string,"profile_url"?: string | null,"slug": string
                  }
                  Update: {
                    "academic_title"?: string | null,"created_at"?: string,"email"?: string | null,"faculty_id"?: number | null,"first_name"?: string,"id"?: number,"last_name"?: string,"profile_url"?: string | null,"slug"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lecturers_faculty_id_fkey"
      columns: ["faculty_id"]
isOneToOne: false
      referencedRelation: "faculties"
      referencedColumns: ["id"]
    }
                  ]
                },"material_reports": {
                  Row: {
                    "created_at": string,"id": number,"material_id": number,"reason": string,"reported_by": string,"status": Database["public"]['Enums']["reportStatus_type"],"status_priority": number | null
                  }
                  Insert: {
                    "created_at"?: string,"id"?: never,"material_id": number,"reason": string,"reported_by": string,"status"?: Database["public"]['Enums']["reportStatus_type"],"status_priority"?: never
                  }
                  Update: {
                    "created_at"?: string,"id"?: never,"material_id"?: number,"reason"?: string,"reported_by"?: string,"status"?: Database["public"]['Enums']["reportStatus_type"],"status_priority"?: never
                  }
                  Relationships: [
                    {
      foreignKeyName: "material_reports_material_id_fkey"
      columns: ["material_id"]
isOneToOne: false
      referencedRelation: "materials"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "material_reports_reported_by_fkey"
      columns: ["reported_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"materials": {
                  Row: {
                    "channel_type": Database["public"]['Enums']["channel_type"],"created_at": string,"deleted_at": string | null,"file_name": string,"file_path": string,"id": number,"subject_id": number,"title": string,"uploaded_by": string | null
                  }
                  Insert: {
                    "channel_type": Database["public"]['Enums']["channel_type"],"created_at"?: string,"deleted_at"?: string | null,"file_name": string,"file_path": string,"id"?: number,"subject_id": number,"title": string,"uploaded_by"?: string | null
                  }
                  Update: {
                    "channel_type"?: Database["public"]['Enums']["channel_type"],"created_at"?: string,"deleted_at"?: string | null,"file_name"?: string,"file_path"?: string,"id"?: number,"subject_id"?: number,"title"?: string,"uploaded_by"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "materials_subject_id_fkey"
      columns: ["subject_id"]
isOneToOne: false
      referencedRelation: "subjects"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "materials_uploaded_by_fkey"
      columns: ["uploaded_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"moderation_actions": {
                  Row: {
                    "action": string,"created_at": string | null,"id": number,"moderator_id": string | null,"reason": string | null,"report_id": number | null,"report_type": string | null
                  }
                  Insert: {
                    "action": string,"created_at"?: string | null,"id"?: never,"moderator_id"?: string | null,"reason"?: string | null,"report_id"?: number | null,"report_type"?: string | null
                  }
                  Update: {
                    "action"?: string,"created_at"?: string | null,"id"?: never,"moderator_id"?: string | null,"reason"?: string | null,"report_id"?: number | null,"report_type"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "moderation_actions_moderator_id_fkey"
      columns: ["moderator_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"bio": string | null,"course_id": number | null,"created_at": string,"faculty_id": number | null,"full_name": string,"github_url": string | null,"id": string,"interests": (string)[] | null,"is_profile_public": boolean,"linkedin_url": string | null,"role": Database["public"]['Enums']["profileRole_type"],"semester": number | null,"university": string | null,"updated_at": string,"username": string
                  }
                  Insert: {
                    "avatar_url"?: string | null,"bio"?: string | null,"course_id"?: number | null,"created_at"?: string,"faculty_id"?: number | null,"full_name": string,"github_url"?: string | null,"id": string,"interests"?: (string)[] | null,"is_profile_public"?: boolean,"linkedin_url"?: string | null,"role"?: Database["public"]['Enums']["profileRole_type"],"semester"?: number | null,"university"?: string | null,"updated_at"?: string,"username": string
                  }
                  Update: {
                    "avatar_url"?: string | null,"bio"?: string | null,"course_id"?: number | null,"created_at"?: string,"faculty_id"?: number | null,"full_name"?: string,"github_url"?: string | null,"id"?: string,"interests"?: (string)[] | null,"is_profile_public"?: boolean,"linkedin_url"?: string | null,"role"?: Database["public"]['Enums']["profileRole_type"],"semester"?: number | null,"university"?: string | null,"updated_at"?: string,"username"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "profiles_courser_id_fkey"
      columns: ["course_id"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "profiles_faculty_id_fkey"
      columns: ["faculty_id"]
isOneToOne: false
      referencedRelation: "faculties"
      referencedColumns: ["id"]
    }
                  ]
                },"reported_lecturer_comments": {
                  Row: {
                    "coment_id": number,"created_at": string | null,"id": number,"reason": string,"reported_by": string,"status": Database["public"]['Enums']["reportStatus_type"],"status_priority": number | null
                  }
                  Insert: {
                    "coment_id": number,"created_at"?: string | null,"id"?: never,"reason": string,"reported_by": string,"status"?: Database["public"]['Enums']["reportStatus_type"],"status_priority"?: never
                  }
                  Update: {
                    "coment_id"?: number,"created_at"?: string | null,"id"?: never,"reason"?: string,"reported_by"?: string,"status"?: Database["public"]['Enums']["reportStatus_type"],"status_priority"?: never
                  }
                  Relationships: [
                    {
      foreignKeyName: "fk_lecturer_coment"
      columns: ["coment_id"]
isOneToOne: false
      referencedRelation: "lecturer_comments"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "fk_reported_by"
      columns: ["reported_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"semesters": {
                  Row: {
                    "course_id": number,"created_at": string | null,"id": number,"number": number
                  }
                  Insert: {
                    "course_id": number,"created_at"?: string | null,"id"?: never,"number": number
                  }
                  Update: {
                    "course_id"?: number,"created_at"?: string | null,"id"?: never,"number"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "semesters_course_id_fkey"
      columns: ["course_id"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["id"]
    }
                  ]
                },"subject_channels": {
                  Row: {
                    "created_at": string | null,"id": number,"label": string,"subject_id": number,"type": Database["public"]['Enums']["channel_type"]
                  }
                  Insert: {
                    "created_at"?: string | null,"id"?: never,"label": string,"subject_id": number,"type": Database["public"]['Enums']["channel_type"]
                  }
                  Update: {
                    "created_at"?: string | null,"id"?: never,"label"?: string,"subject_id"?: number,"type"?: Database["public"]['Enums']["channel_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "subject_channels_subject_id_fkey"
      columns: ["subject_id"]
isOneToOne: false
      referencedRelation: "subjects"
      referencedColumns: ["id"]
    }
                  ]
                },"subject_lecturers": {
                  Row: {
                    "lecturer_id": number,"subject_id": number
                  }
                  Insert: {
                    "lecturer_id": number,"subject_id": number
                  }
                  Update: {
                    "lecturer_id"?: number,"subject_id"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "subject_lecturers_lecturer_id_fkey"
      columns: ["lecturer_id"]
isOneToOne: false
      referencedRelation: "lecturers"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "subject_lecturers_subject_id_fkey"
      columns: ["subject_id"]
isOneToOne: false
      referencedRelation: "subjects"
      referencedColumns: ["id"]
    }
                  ]
                },"subjects": {
                  Row: {
                    "created_at": string | null,"icon": Database["public"]['Enums']["icon_type"],"id": number,"name": string,"semester_id": number,"slug": string,"theme": Database["public"]['Enums']["theme_type"]
                  }
                  Insert: {
                    "created_at"?: string | null,"icon": Database["public"]['Enums']["icon_type"],"id"?: never,"name": string,"semester_id": number,"slug": string,"theme": Database["public"]['Enums']["theme_type"]
                  }
                  Update: {
                    "created_at"?: string | null,"icon"?: Database["public"]['Enums']["icon_type"],"id"?: never,"name"?: string,"semester_id"?: number,"slug"?: string,"theme"?: Database["public"]['Enums']["theme_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "subjects_semester_id_fkey"
      columns: ["semester_id"]
isOneToOne: false
      referencedRelation: "semesters"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "moderate_report": {
              Args: {
                p_reason?: string
                p_report_id: number
                p_report_table: string
                p_status: Database["public"]["Enums"]["reportStatus_type"]
              }
              Returns: undefined
            }
            "get_comment_reports_page": {
              Args: {
                p_cursor_created_at?: string
                p_cursor_id?: number
                p_cursor_priority?: number
                p_limit?: number
              }
              Returns: Database["public"]["Tables"]["reported_lecturer_comments"]["Row"][]
              SetofOptions: {
                from: "*"
                to: "reported_lecturer_comments"
                isOneToOne: false
                isSetofReturn: true
              }
            }
            "get_material_reports_page":
{ Args: { "p_cursor_created_at"?: string,"p_cursor_id"?: number,"p_cursor_priority"?: number,"p_limit"?: number }; Returns: {
              "created_at": string,
"id": number,
"material_id": number,
"reason": string,
"reported_by": string,
"status": Database["public"]['Enums']["reportStatus_type"],
"status_priority": number | null
            }[]
                          SetofOptions: {
        from: "*"
        to: "material_reports"
        isOneToOne: false
        isSetofReturn: true
      } }
          }
          Enums: {
            "channel_type": "lecture"|"lab"|"exercises","icon_type": "sigma"|"atom"|"code"|"flask","profileRole_type": "admin"|"user"|"moderator","reportStatus_type": "pending"|"resolved"|"rejected","theme_type": "sand"|"blue"|"ink"|"violet"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "channel_type": ["lecture", "lab", "exercises"],"icon_type": ["sigma", "atom", "code", "flask"],"profileRole_type": ["admin", "user", "moderator"],"reportStatus_type": ["pending", "resolved", "rejected"],"theme_type": ["sand", "blue", "ink", "violet"]
          }
        }
} as const

