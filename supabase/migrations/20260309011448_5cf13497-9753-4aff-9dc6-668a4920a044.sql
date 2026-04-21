-- Ensure required topics exist for Lote 19
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('d2311111-1111-1111-1111-111111111231', 'Classes gramaticais', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111232', 'Vozes verbais', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111233', 'Ortografia', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111234', 'Concordância nominal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111235', 'Redação oficial', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111236', 'Internet e navegação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111237', 'Arquivos e extensões', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111238', 'Segurança da informação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111239', 'Correio eletrônico', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('d2311111-1111-1111-1111-111111111240', 'Planilhas eletrônicas', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1))
ON CONFLICT (id) DO NOTHING;