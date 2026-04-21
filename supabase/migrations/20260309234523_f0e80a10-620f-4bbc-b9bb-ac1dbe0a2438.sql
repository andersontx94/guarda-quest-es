
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS explanation_main text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS correct_option_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS wrong_option_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS option_a_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS option_b_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS option_c_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS option_d_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS option_e_comment text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS legal_basis text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS exam_tip text NOT NULL DEFAULT '';
