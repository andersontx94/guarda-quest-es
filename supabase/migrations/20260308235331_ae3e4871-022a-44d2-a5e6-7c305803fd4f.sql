-- Ensure required topics exist for Geografia e História de Manaus (Batch 10)
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111141', 'Povos originários', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111142', 'Integração rodoviária', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111143', 'Infraestrutura aeroportuária', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111144', 'Economia regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111145', 'Patrimônio histórico', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111146', 'Hidrografia regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111147', 'Logística fluvial', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111148', 'Origem histórica', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111149', 'Patrimônio urbano', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111150', 'Centralidade regional', (SELECT id FROM public.subjects WHERE name = 'Geografia e História de Manaus' LIMIT 1))
ON CONFLICT (id) DO NOTHING;