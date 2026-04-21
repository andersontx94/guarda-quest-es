-- Ensure required topics exist for Geografia e História de Manaus
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Localização geográfica', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111112', 'Região Norte', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111113', 'Ciclo da borracha', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111114', 'Patrimônio histórico', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111115', 'Economia regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111116', 'Demografia', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111117', 'Aspectos ambientais', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111118', 'Turismo local', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111119', 'Hidrografia regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111120', 'Importância regional de Manaus', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1))
ON CONFLICT (id) DO NOTHING;