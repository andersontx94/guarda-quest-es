
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for difficulty
CREATE TYPE public.difficulty_level AS ENUM ('facil', 'medio', 'dificil');

-- Create enum for question type
CREATE TYPE public.question_type AS ENUM ('oficial', 'autoral');

-- Create enum for question status
CREATE TYPE public.question_status AS ENUM ('publicado', 'rascunho');

-- User profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Subjects (matérias)
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_num INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Topics (assuntos)
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view topics" ON public.topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage topics" ON public.topics FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Questions
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  banca TEXT NOT NULL DEFAULT '',
  orgao TEXT NOT NULL DEFAULT '',
  cargo TEXT NOT NULL DEFAULT '',
  ano INTEGER NOT NULL DEFAULT 2024,
  localidade TEXT NOT NULL DEFAULT '',
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  explicacao TEXT NOT NULL DEFAULT '',
  dificuldade difficulty_level NOT NULL DEFAULT 'medio',
  origem TEXT NOT NULL DEFAULT '',
  tipo question_type NOT NULL DEFAULT 'autoral',
  status question_status NOT NULL DEFAULT 'rascunho',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view published questions" ON public.questions FOR SELECT TO authenticated USING (status = 'publicado' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage questions" ON public.questions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Question options
CREATE TABLE public.question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  letter TEXT NOT NULL,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view options" ON public.question_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage options" ON public.question_options FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Question attempts
CREATE TABLE public.question_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id UUID NOT NULL REFERENCES public.question_options(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.question_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.question_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookmarks
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Content updates
CREATE TABLE public.content_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view updates" ON public.content_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage updates" ON public.content_updates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Simulations
CREATE TABLE public.simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL DEFAULT 'Simulado',
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  total_questions INTEGER NOT NULL DEFAULT 10,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finished_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own simulations" ON public.simulations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own simulations" ON public.simulations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own simulations" ON public.simulations FOR UPDATE USING (auth.uid() = user_id);

-- Simulation results
CREATE TABLE public.simulation_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES public.question_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN
);

ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own simulation results" ON public.simulation_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.simulations WHERE id = simulation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own simulation results" ON public.simulation_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.simulations WHERE id = simulation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update own simulation results" ON public.simulation_results FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.simulations WHERE id = simulation_id AND user_id = auth.uid())
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_questions_subject ON public.questions(subject_id);
CREATE INDEX idx_questions_topic ON public.questions(topic_id);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_question_options_question ON public.question_options(question_id);
CREATE INDEX idx_question_attempts_user ON public.question_attempts(user_id);
CREATE INDEX idx_question_attempts_question ON public.question_attempts(question_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_simulation_results_simulation ON public.simulation_results(simulation_id);
CREATE INDEX idx_topics_subject ON public.topics(subject_id);
