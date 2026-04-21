-- Ensure required topics exist for Noções de Direito
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111121', 'Direitos políticos', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111122', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111123', 'Processo administrativo', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111124', 'Lei de Improbidade Administrativa', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111125', 'Crimes contra a Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Ensure required topics exist for Legislação
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111126', 'Estatuto Geral das Guardas Municipais', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111127', 'Lei Maria da Penha', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111128', 'Estatuto da Criança e do Adolescente', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111129', 'Lei de Drogas', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111130', 'Lei de Abuso de Autoridade', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1))
ON CONFLICT (id) DO NOTHING;