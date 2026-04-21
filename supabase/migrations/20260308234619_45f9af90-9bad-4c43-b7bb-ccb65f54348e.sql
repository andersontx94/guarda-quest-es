-- Ensure required topics exist for Língua Portuguesa
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111131', 'Interpretação de texto', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111132', 'Pontuação', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111133', 'Concordância nominal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111134', 'Crase', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Ensure required topics exist for Noções de Informática
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111136', 'Windows', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111137', 'Internet e navegação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111138', 'Armazenamento em nuvem', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1))
ON CONFLICT (id) DO NOTHING;