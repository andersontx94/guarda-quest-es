-- Ensure required topics exist for Lote 16
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('c1111111-1111-1111-1111-111111111201', 'Divisão regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111202', 'Gentílico', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111203', 'Formação histórica', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111204', 'Economia regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111205', 'Patrimônio histórico', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111206', 'Hidrografia', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111207', 'Turismo local', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111208', 'Clima', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111209', 'Demografia', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111210', 'Logística regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1))
ON CONFLICT (id) DO NOTHING;