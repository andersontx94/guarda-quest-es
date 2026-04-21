-- Ensure required topics exist for Lote 12
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('b1111111-1111-1111-1111-111111111161', 'Interpretação de texto', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111162', 'Regência nominal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111163', 'Concordância verbal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111164', 'Colocação pronominal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111165', 'Semântica', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111166', 'Hardware e periféricos', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111167', 'Sistemas operacionais', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111168', 'Segurança da informação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111169', 'Internet e correio eletrônico', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('b1111111-1111-1111-1111-111111111170', 'Planilhas eletrônicas', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1))
ON CONFLICT (id) DO NOTHING;