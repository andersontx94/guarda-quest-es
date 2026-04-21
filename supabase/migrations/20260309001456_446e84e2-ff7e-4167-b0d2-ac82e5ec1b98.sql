-- Ensure required topics exist for Lote 13
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111171', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111172', 'Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111173', 'Crimes contra a Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111174', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111175', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111176', 'Lei de Acesso à Informação', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111177', 'LGPD', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111178', 'Estatuto Geral das Guardas Municipais', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111179', 'Lei Maria da Penha', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111180', 'Estatuto da Igualdade Racial', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1))
ON CONFLICT (id) DO NOTHING;