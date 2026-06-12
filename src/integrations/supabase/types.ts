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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          categoria: string | null
          codigo: string
          created_at: string | null
          descricao: string
          icone: string | null
          id: string
          nome: string
          requisito_extra: string | null
          requisito_tipo: string
          requisito_valor: number
          xp_bonus: number | null
        }
        Insert: {
          categoria?: string | null
          codigo: string
          created_at?: string | null
          descricao: string
          icone?: string | null
          id?: string
          nome: string
          requisito_extra?: string | null
          requisito_tipo: string
          requisito_valor: number
          xp_bonus?: number | null
        }
        Update: {
          categoria?: string | null
          codigo?: string
          created_at?: string | null
          descricao?: string
          icone?: string | null
          id?: string
          nome?: string
          requisito_extra?: string | null
          requisito_tipo?: string
          requisito_valor?: number
          xp_bonus?: number | null
        }
        Relationships: []
      }
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
      concursos: {
        Row: {
          ativo: boolean
          banca: string
          cargo: string
          created_at: string
          data_prova: string | null
          encerrado: boolean
          id: string
          nome: string
          ordem: number
          orgao: string
          slug: string
          uf: string
        }
        Insert: {
          ativo?: boolean
          banca?: string
          cargo?: string
          created_at?: string
          data_prova?: string | null
          encerrado?: boolean
          id?: string
          nome: string
          ordem?: number
          orgao?: string
          slug: string
          uf?: string
        }
        Update: {
          ativo?: boolean
          banca?: string
          cargo?: string
          created_at?: string
          data_prova?: string | null
          encerrado?: boolean
          id?: string
          nome?: string
          ordem?: number
          orgao?: string
          slug?: string
          uf?: string
        }
        Relationships: []
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
      hotmart_purchases: {
        Row: {
          amount_paid: number | null
          buyer_email: string
          buyer_name: string | null
          concurso_id: string | null
          created_at: string | null
          expires_at: string | null
          hotmart_product_id: string | null
          hotmart_transaction: string
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          buyer_email: string
          buyer_name?: string | null
          concurso_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          hotmart_product_id?: string | null
          hotmart_transaction: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          buyer_email?: string
          buyer_name?: string | null
          concurso_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          hotmart_product_id?: string | null
          hotmart_transaction?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotmart_purchases_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      lgpd_consents: {
        Row: {
          aceita_cookies_analytics: boolean
          aceita_cookies_essenciais: boolean
          aceita_privacidade: boolean
          aceita_termos: boolean
          aceito_em: string
          created_at: string | null
          id: string
          ip_address: string | null
          revogado_em: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          versao_privacidade: string
          versao_termos: string
        }
        Insert: {
          aceita_cookies_analytics?: boolean
          aceita_cookies_essenciais?: boolean
          aceita_privacidade?: boolean
          aceita_termos?: boolean
          aceito_em?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          revogado_em?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          versao_privacidade?: string
          versao_termos?: string
        }
        Update: {
          aceita_cookies_analytics?: boolean
          aceita_cookies_essenciais?: boolean
          aceita_privacidade?: boolean
          aceita_termos?: boolean
          aceito_em?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          revogado_em?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          versao_privacidade?: string
          versao_termos?: string
        }
        Relationships: []
      }
      lgpd_requests: {
        Row: {
          created_at: string | null
          descricao: string | null
          email: string
          id: string
          respondido_em: string | null
          status: string
          tipo: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          email: string
          id?: string
          respondido_em?: string | null
          status?: string
          tipo: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          email?: string
          id?: string
          respondido_em?: string | null
          status?: string
          tipo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_cor: string
          concurso_atual: string | null
          created_at: string
          id: string
          name: string
          nickname: string | null
          participar_ranking: boolean
          user_id: string
        }
        Insert: {
          avatar_cor?: string
          concurso_atual?: string | null
          created_at?: string
          id?: string
          name?: string
          nickname?: string | null
          participar_ranking?: boolean
          user_id: string
        }
        Update: {
          avatar_cor?: string
          concurso_atual?: string | null
          created_at?: string
          id?: string
          name?: string
          nickname?: string | null
          participar_ranking?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_concurso_atual_fkey"
            columns: ["concurso_atual"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
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
          concurso_id: string | null
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
          concurso_id?: string | null
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
          concurso_id?: string | null
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
            foreignKeyName: "questions_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
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
      ranking_semanal: {
        Row: {
          acertos_semana: number
          concurso_id: string | null
          created_at: string | null
          id: string
          pontuacao_semana: number
          questoes_semana: number
          semana_inicio: string
          simulados_semana: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          acertos_semana?: number
          concurso_id?: string | null
          created_at?: string | null
          id?: string
          pontuacao_semana?: number
          questoes_semana?: number
          semana_inicio: string
          simulados_semana?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          acertos_semana?: number
          concurso_id?: string | null
          created_at?: string | null
          id?: string
          pontuacao_semana?: number
          questoes_semana?: number
          semana_inicio?: string
          simulados_semana?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_semanal_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_simulados: {
        Row: {
          concurso_id: string | null
          created_at: string | null
          id: string
          media_pontuacao: number
          melhor_pontuacao: number
          pontos_ranking: number
          posicao: number | null
          simulados_aprovados: number
          streak_simulados: number
          total_acertos_simulado: number
          total_questoes_simulado: number
          total_simulados: number
          ultima_pontuacao: number
          ultimo_simulado: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          concurso_id?: string | null
          created_at?: string | null
          id?: string
          media_pontuacao?: number
          melhor_pontuacao?: number
          pontos_ranking?: number
          posicao?: number | null
          simulados_aprovados?: number
          streak_simulados?: number
          total_acertos_simulado?: number
          total_questoes_simulado?: number
          total_simulados?: number
          ultima_pontuacao?: number
          ultimo_simulado?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          concurso_id?: string | null
          created_at?: string | null
          id?: string
          media_pontuacao?: number
          melhor_pontuacao?: number
          pontos_ranking?: number
          posicao?: number | null
          simulados_aprovados?: number
          streak_simulados?: number
          total_acertos_simulado?: number
          total_questoes_simulado?: number
          total_simulados?: number
          ultima_pontuacao?: number
          ultimo_simulado?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_simulados_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
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
          concluido: boolean
          concurso_id: string | null
          finished_at: string | null
          id: string
          percentual_acerto: number | null
          pontuacao: number | null
          started_at: string
          subject_id: string | null
          tempo_segundos: number | null
          titulo: string
          total_acertos: number | null
          total_erros: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          concluido?: boolean
          concurso_id?: string | null
          finished_at?: string | null
          id?: string
          percentual_acerto?: number | null
          pontuacao?: number | null
          started_at?: string
          subject_id?: string | null
          tempo_segundos?: number | null
          titulo?: string
          total_acertos?: number | null
          total_erros?: number | null
          total_questions?: number
          user_id: string
        }
        Update: {
          concluido?: boolean
          concurso_id?: string | null
          finished_at?: string | null
          id?: string
          percentual_acerto?: number | null
          pontuacao?: number | null
          started_at?: string
          subject_id?: string | null
          tempo_segundos?: number | null
          titulo?: string
          total_acertos?: number | null
          total_erros?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulations_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
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
          concurso_id: string | null
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
          concurso_id?: string | null
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
          concurso_id?: string | null
          current_index?: number
          filters?: Json
          id?: string
          question_ids?: string[]
          session_correct?: number
          session_total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          concurso_id: string
          created_at: string
          id: string
          name: string
          num_questoes_prova: number | null
          order_num: number
          peso_prova: number | null
        }
        Insert: {
          concurso_id: string
          created_at?: string
          id?: string
          name: string
          num_questoes_prova?: number | null
          order_num?: number
          peso_prova?: number | null
        }
        Update: {
          concurso_id?: string
          created_at?: string
          id?: string
          name?: string
          num_questoes_prova?: number | null
          order_num?: number
          peso_prova?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
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
      user_achievements: {
        Row: {
          achievement_id: string
          desbloqueado_em: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          desbloqueado_em?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          desbloqueado_em?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
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
      user_scores: {
        Row: {
          concurso_id: string | null
          created_at: string | null
          dificeis_acertadas: number
          id: string
          melhor_nota_simulado: number | null
          nivel: number
          posicao_geral: number | null
          simulados_completos: number
          streak_dias: number
          titulo: string
          total_acertos: number
          total_erros: number
          total_questoes: number
          total_xp: number
          ultimo_estudo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          concurso_id?: string | null
          created_at?: string | null
          dificeis_acertadas?: number
          id?: string
          melhor_nota_simulado?: number | null
          nivel?: number
          posicao_geral?: number | null
          simulados_completos?: number
          streak_dias?: number
          titulo?: string
          total_acertos?: number
          total_erros?: number
          total_questoes?: number
          total_xp?: number
          ultimo_estudo?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          concurso_id?: string | null
          created_at?: string | null
          dificeis_acertadas?: number
          id?: string
          melhor_nota_simulado?: number | null
          nivel?: number
          posicao_geral?: number | null
          simulados_completos?: number
          streak_dias?: number
          titulo?: string
          total_acertos?: number
          total_erros?: number
          total_questoes?: number
          total_xp?: number
          ultimo_estudo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scores_concurso_id_fkey"
            columns: ["concurso_id"]
            isOneToOne: false
            referencedRelation: "concursos"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_history: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          motivo: string
          user_id: string
          xp_ganho: number
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          motivo: string
          user_id: string
          xp_ganho: number
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          motivo?: string
          user_id?: string
          xp_ganho?: number
        }
        Relationships: []
      }
    }
    Views: {
      ranking_geral: {
        Row: {
          avatar_cor: string | null
          concurso_id: string | null
          media_pontuacao: number | null
          melhor_pontuacao: number | null
          nickname: string | null
          nome_exibido: string | null
          pontos_ranking: number | null
          posicao: number | null
          simulados_aprovados: number | null
          streak_simulados: number | null
          taxa_acerto_geral: number | null
          titulo: string | null
          total_simulados: number | null
          ultima_pontuacao: number | null
          user_id: string | null
        }
        Relationships: []
      }
      ranking_semanal_atual: {
        Row: {
          acertos_semana: number | null
          avatar_cor: string | null
          concurso_id: string | null
          nickname: string | null
          nome_exibido: string | null
          pontuacao_semana: number | null
          posicao: number | null
          questoes_semana: number | null
          simulados_semana: number | null
          taxa_acerto_semana: number | null
          titulo: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      atualizar_score_questao: {
        Args: {
          p_dificuldade?: string
          p_is_correct: boolean
          p_user_id: string
        }
        Returns: Json
      }
      calcular_nivel: {
        Args: { xp: number }
        Returns: {
          nivel: number
          titulo: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      meu_status_acesso: { Args: never; Returns: Json }
      minha_posicao_ranking: { Args: { p_user_id: string }; Returns: Json }
      registrar_simulado_concluido: {
        Args: {
          p_simulation_id: string
          p_tempo_segundos?: number
          p_total_acertos: number
          p_total_questoes: number
          p_user_id: string
        }
        Returns: Json
      }
      revogar_acessos_expirados: { Args: never; Returns: undefined }
      tem_acesso_ativo: { Args: { uid: string }; Returns: boolean }
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
