
-- Ensure Língua Portuguesa subject exists
INSERT INTO public.subjects (id, name, order_num) VALUES
  ('55555555-5555-5555-5555-555555555501', 'Língua Portuguesa', 10)
ON CONFLICT (id) DO NOTHING;

-- Create topics for Língua Portuguesa
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('66666666-6666-6666-6666-666666666601', 'Interpretação de texto', '55555555-5555-5555-5555-555555555501'),
  ('66666666-6666-6666-6666-666666666602', 'Pontuação', '55555555-5555-5555-5555-555555555501'),
  ('66666666-6666-6666-6666-666666666603', 'Concordância verbal', '55555555-5555-5555-5555-555555555501'),
  ('66666666-6666-6666-6666-666666666604', 'Ortografia', '55555555-5555-5555-5555-555555555501'),
  ('66666666-6666-6666-6666-666666666605', 'Crase', '55555555-5555-5555-5555-555555555501')
ON CONFLICT (id) DO NOTHING;

-- Add missing Internet e navegação topic for Noções de Informática
INSERT INTO public.topics (id, name, subject_id) VALUES
  ('44444444-4444-4444-4444-444444444411', 'Internet e navegação', '33333333-3333-3333-3333-333333333301')
ON CONFLICT (id) DO NOTHING;
