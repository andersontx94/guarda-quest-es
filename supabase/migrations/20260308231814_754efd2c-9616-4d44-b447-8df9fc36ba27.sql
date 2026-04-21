-- Ensure required topics exist for Língua Portuguesa
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('a1111111-1111-1111-1111-111111111101', 'Classes gramaticais', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111102', 'Regência verbal', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111103', 'Coesão textual', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111104', 'Sinonímia e vocabulário', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111105', 'Redação oficial', (SELECT id FROM public.subjects WHERE name = 'Língua Portuguesa' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Ensure required topics exist for Noções de Informática
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('a1111111-1111-1111-1111-111111111106', 'Atalhos de teclado', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111107', 'Segurança da informação', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111108', 'Redes de computadores', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111109', 'Backup', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1)),
  ('a1111111-1111-1111-1111-111111111110', 'Planilhas eletrônicas', (SELECT id FROM public.subjects WHERE name = 'Noções de Informática' LIMIT 1))
ON CONFLICT (id) DO NOTHING;