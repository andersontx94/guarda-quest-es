export interface Subject {
  id: string;
  name: string;
  order_num: number;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  created_at: string;
  subject?: Subject;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  letter: string;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  banca: string;
  orgao: string;
  cargo: string;
  ano: number;
  localidade: string;
  subject_id: string;
  topic_id: string;
  enunciado: string;
  explicacao: string;
  explanation_main: string;
  correct_option_comment: string;
  wrong_option_comment: string;
  option_a_comment: string;
  option_b_comment: string;
  option_c_comment: string;
  option_d_comment: string;
  option_e_comment: string;
  legal_basis: string;
  exam_tip: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  origem: string;
  tipo: 'oficial' | 'autoral';
  status: 'publicado' | 'rascunho';
  created_at: string;
  subject?: Subject;
  topic?: Topic;
  question_options?: QuestionOption[];
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
  answered_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface ContentUpdate {
  id: string;
  titulo: string;
  descricao: string;
  data_publicacao: string;
  created_at: string;
}

export interface Simulation {
  id: string;
  user_id: string;
  titulo: string;
  subject_id: string | null;
  total_questions: number;
  started_at: string;
  finished_at: string | null;
}

export interface SimulationResult {
  id: string;
  simulation_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}
