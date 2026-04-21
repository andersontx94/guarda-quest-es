-- Ensure required topics exist for Lote 11
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111151', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111152', 'Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111153', 'Direitos sociais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111154', 'Processo administrativo', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111155', 'Crimes contra a Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111156', 'Lei de Acesso à Informação', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111157', 'LGPD', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111158', 'Estatuto Geral das Guardas Municipais', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111159', 'Estatuto da Igualdade Racial', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111160', 'Estatuto da Criança e do Adolescente', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1))
ON CONFLICT (id) DO NOTHING;