
CREATE TYPE public.essay_status AS ENUM ('rascunho', 'enviada', 'corrigida');

CREATE TABLE public.essays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tema text NOT NULL DEFAULT '',
  titulo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  status essay_status NOT NULL DEFAULT 'rascunho',
  nota_geral numeric,
  notas_por_criterio jsonb,
  feedback_geral text,
  feedback_detalhado jsonb,
  erros_encontrados jsonb,
  sugestoes_melhoria jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own essays" ON public.essays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own essays" ON public.essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own essays" ON public.essays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own essays" ON public.essays FOR DELETE USING (auth.uid() = user_id);
