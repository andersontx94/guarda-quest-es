-- Ensure required topics exist for Lote 14
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('c1111111-1111-1111-1111-111111111181', 'Interpretação de texto', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111182', 'Pontuação', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111183', 'Concordância nominal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111184', 'Crase', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111185', 'Semântica', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111186', 'Hardware e periféricos', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111187', 'Atalhos de teclado', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111188', 'Segurança da informação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111189', 'Internet e navegação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('c1111111-1111-1111-1111-111111111190', 'Planilhas eletrônicas', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1))
ON CONFLICT (id) DO NOTHING;