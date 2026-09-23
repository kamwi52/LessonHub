-- ============================================================================
-- LessonsHub - complete database schema + demo data
-- ============================================================================
-- How to use:
--   1. Open your Supabase project -> SQL Editor -> New query
--   2. Paste this whole file and press Run
--   This file is idempotent: running it again is safe and will repair the
--   demo accounts rather than duplicating them.
--
-- Demo accounts created by this file (password: devpass123):
--   teacher1@devschool.local      role: teacher
--   teacher2@devschool.local      role: teacher
--   coordinator@devschool.local   role: coordinator
--   admin@devschool.local         role: admin
-- ============================================================================

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'teacher',
  subjects_taught TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- plans
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  grade INTEGER NOT NULL,
  term INTEGER NOT NULL,
  week INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  learning_objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  activities TEXT,
  resources TEXT,
  assessment TEXT,
  differentiation_notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  curriculum_alignment JSONB,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Bring older databases up to date (no-ops on a fresh install)
-- ---------------------------------------------------------------------------
ALTER TABLE users  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE plans  ADD COLUMN IF NOT EXISTS curriculum_alignment JSONB;
ALTER TABLE plans  ADD COLUMN IF NOT EXISTS learning_objectives JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE plans  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email            ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_school_id        ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role             ON users(role);
CREATE INDEX IF NOT EXISTS idx_plans_teacher_id       ON plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_plans_school_id        ON plans(school_id);
CREATE INDEX IF NOT EXISTS idx_plans_status           ON plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_updated_at       ON plans(updated_at);
CREATE INDEX IF NOT EXISTS idx_plans_subject_grade_term
  ON plans(school_id, subject, grade, term);

-- ---------------------------------------------------------------------------
-- Demo accounts
-- The hash below is a real bcrypt hash of:  devpass123
-- ON CONFLICT DO UPDATE means re-running this file repairs accounts that were
-- previously seeded with a placeholder hash (which would fail every login).
-- ---------------------------------------------------------------------------
INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, subjects_taught)
VALUES
  (1, 'teacher1@devschool.local',
      '$2a$10$K3z8gFOe5Y6wYylAClOVjuFEq7OkBAFdfrBosqdttaO4raHKnHcb6',
      'John',  'Doe',         'teacher',     ARRAY['Mathematics', 'Physics']),
  (1, 'teacher2@devschool.local',
      '$2a$10$K3z8gFOe5Y6wYylAClOVjuFEq7OkBAFdfrBosqdttaO4raHKnHcb6',
      'Jane',  'Smith',       'teacher',     ARRAY['English', 'Drama']),
  (1, 'coordinator@devschool.local',
      '$2a$10$K3z8gFOe5Y6wYylAClOVjuFEq7OkBAFdfrBosqdttaO4raHKnHcb6',
      'Sarah', 'Coordinator', 'coordinator', ARRAY['Mathematics']),
  (1, 'admin@devschool.local',
      '$2a$10$K3z8gFOe5Y6wYylAClOVjuFEq7OkBAFdfrBosqdttaO4raHKnHcb6',
      'Mike',  'Admin',       'admin',       NULL)
ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      first_name    = EXCLUDED.first_name,
      last_name     = EXCLUDED.last_name,
      role          = EXCLUDED.role;

-- ---------------------------------------------------------------------------
-- Verify
-- ---------------------------------------------------------------------------
SELECT id, email, first_name, last_name, role FROM users ORDER BY id;
