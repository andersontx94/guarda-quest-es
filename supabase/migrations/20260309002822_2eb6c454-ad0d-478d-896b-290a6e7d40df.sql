-- Ensure required topics exist for Lote 15
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('c1111111-1111-1111-1111-111111111191', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111192', 'Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111193', 'Crimes contra a Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111194', 'Direitos políticos', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111195', 'Nacionalidade', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111196', 'Estatuto Geral das Guardas Municipais', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111197', 'Lei de Acesso à Informação', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111198', 'LGPD', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111199', 'Lei Maria da Penha', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111200', 'Estatuto da Criança e do Adolescente', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1))
ON CONFLICT (id) DO NOTHING;