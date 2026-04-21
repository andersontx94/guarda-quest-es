-- Ensure required topics exist for Lote 17
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('c1111111-1111-1111-1111-111111111211', 'Interpretação de texto', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111212', 'Pontuação', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111213', 'Concordância verbal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111214', 'Crase', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111215', 'Redação oficial', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111216', 'Windows', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111217', 'Atalhos de teclado', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111218', 'Segurança da informação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111219', 'Internet e navegação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111220', 'Planilhas eletrônicas', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1))
ON CONFLICT (id) DO NOTHING;