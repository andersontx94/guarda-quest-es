-- Ensure required topics exist for Lote 18
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('c1111111-1111-1111-1111-111111111221', 'Direitos e garantias fundamentais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111222', 'Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111223', 'Remédios constitucionais', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111224', 'Crimes contra a Administração Pública', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111225', 'Processo administrativo', (SELECT id FROM public.subjects WHERE name = 'Noções de Direito' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111226', 'Estatuto Geral das Guardas Municipais', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111227', 'Estatuto Geral das Guardas Municipais - Consórcio', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111228', 'Lei de Acesso à Informação', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111229', 'LGPD', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111230', 'Estatuto da Igualdade Racial', (SELECT id FROM public.subjects WHERE name = 'Legislação' LIMIT 1))
ON CONFLICT (id) DO NOTHING;