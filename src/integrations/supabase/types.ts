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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_updates: {
        Row: {
          created_at: string
          data_publicacao: string
          descricao: string
          id: string
          titulo: string
        }
        Insert: {
          created_at?: string
          data_publicacao?: string
          descricao: string
          id?: string
          titulo: string
        }
        Update: {
          created_at?: string
          data_publicacao?: string
          descricao?: string
          id?: string
          titulo?: string
        }
        Relationships: []
      }
      essays: {
        Row: {
          conteudo: string
          created_at: string
          erros_encontrados: Json | null
          feedback_detalhado: Json | null
          feedback_geral: string | null
          id: string
          nota_geral: number | null
          notas_por_criterio: Json | null
          status: Database["public"]["Enums"]["essay_status"]
          sugestoes_melhoria: Json | null
          tema: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          erros_encontrados?: Json | null
          feedback_detalhado?: Json | null
          feedback_geral?: string | null
          id?: string
          nota_geral?: number | null
          notas_por_criterio?: Json | null
          status?: Database["public"]["Enums"]["essay_status"]
          sugestoes_melhoria?: Json | null
          tema?: string
          titulo?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          erros_encontrados?: Json | null
          feedback_detalhado?: Json | null
          feedback_geral?: string | null
          id?: string
          nota_geral?: number | null
          notas_por_criterio?: Json | null
          status?: Database["public"]["Enums"]["essay_status"]
          sugestoes_melhoria?: Json | null
          tema?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_option_id: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_option_id: string
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_attempts_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      question_options: {
        Row: {
          id: string
          is_correct: boolean
          letter: string
          question_id: string
          text: string
        }
        Insert: {
          id?: string
          is_correct?: boolean
          letter: string
          question_id: string
          text: string
        }
        Update: {
          id?: string
          is_correct?: boolean
          letter?: string
          question_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          ano: number
          banca: string
          cargo: string
          correct_option_comment: string
          created_at: string
          dificuldade: Database["public"]["Enums"]["difficulty_level"]
          enunciado: string
          exam_tip: string
          explanation_main: string
          explicacao: string
          id: string
          legal_basis: string
          localidade: string
          option_a_comment: string
          option_b_comment: string
          option_c_comment: string
          option_d_comment: string
          option_e_comment: string
          orgao: string
          origem: string
          status: Database["public"]["Enums"]["question_status"]
          subject_id: string
          tipo: Database["public"]["Enums"]["question_type"]
          topic_id: string
          wrong_option_comment: string
        }
        Insert: {
          ano?: number
          banca?: string
          cargo?: string
          correct_option_comment?: string
          created_at?: string
          dificuldade?: Database["public"]["Enums"]["difficulty_level"]
          enunciado: string
          exam_tip?: string
          explanation_main?: string
          explicacao?: string
          id?: string
          legal_basis?: string
          localidade?: string
          option_a_comment?: string
          option_b_comment?: string
          option_c_comment?: string
          option_d_comment?: string
          option_e_comment?: string
          orgao?: string
          origem?: string
          status?: Database["public"]["Enums"]["question_status"]
          subject_id: string
          tipo?: Database["public"]["Enums"]["question_type"]
          topic_id: string
          wrong_option_comment?: string
        }
        Update: {
          ano?: number
          banca?: string
          cargo?: string
          correct_option_comment?: string
          created_at?: string
          dificuldade?: Database["public"]["Enums"]["difficulty_level"]
          enunciado?: string
          exam_tip?: string
          explanation_main?: string
          explicacao?: string
          id?: string
          legal_basis?: string
          localidade?: string
          option_a_comment?: string
          option_b_comment?: string
          option_c_comment?: string
          option_d_comment?: string
          option_e_comment?: string
          orgao?: string
          origem?: string
          status?: Database["public"]["Enums"]["question_status"]
          subject_id?: string
          tipo?: Database["public"]["Enums"]["question_type"]
          topic_id?: string
          wrong_option_comment?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_results: {
        Row: {
          id: string
          is_correct: boolean | null
          question_id: string
          selected_option_id: string | null
          simulation_id: string
        }
        Insert: {
          id?: string
          is_correct?: boolean | null
          question_id: string
          selected_option_id?: string | null
          simulation_id: string
        }
        Update: {
          id?: string
          is_correct?: boolean | null
          question_id?: string
          selected_option_id?: string | null
          simulation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_results_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulation_results_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulation_results_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          finished_at: string | null
          id: string
          started_at: string
          subject_id: string | null
          titulo: string
          total_questions: number
          user_id: string
        }
        Insert: {
          finished_at?: string | null
          id?: string
          started_at?: string
          subject_id?: string | null
          titulo?: string
          total_questions?: number
          user_id: string
        }
        Update: {
          finished_at?: string | null
          id?: string
          started_at?: string
          subject_id?: string | null
          titulo?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulations_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          current_index: number
          filters: Json
          id: string
          question_ids: string[]
          session_correct: number
          session_total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_index?: number
          filters?: Json
          id?: string
          question_ids?: string[]
          session_correct?: number
          session_total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_index?: number
          filters?: Json
          id?: string
          question_ids?: string[]
          session_correct?: number
          session_total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          id: string
          name: string
          order_num: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_num?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_num?: number
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          id: string
          name: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      difficulty_level: "facil" | "medio" | "dificil"
      essay_status: "rascunho" | "enviada" | "corrigida"
      question_status: "publicado" | "rascunho"
      question_type: "oficial" | "autoral"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
      difficulty_level: ["facil", "medio", "dificil"],
      essay_status: ["rascunho", "enviada", "corrigida"],
      question_status: ["publicado", "rascunho"],
      question_type: ["oficial", "autoral"],
    },
  },
} as const
