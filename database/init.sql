-- DCS (Digital Lesson Plan & Scheme of Work System) Database Schema
-- Initial setup script

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS plan_comments CASCADE;
DROP TABLE IF EXISTS plan_sharing CASCADE;
DROP TABLE IF EXISTS plan_versions CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Schools table
CREATE TABLE schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  school_type VARCHAR(50), -- Primary, Secondary, Academy
  admin_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'teacher', -- teacher, coordinator, admin
  subjects_taught TEXT[], -- Array of subject names
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Plans table
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  grade INTEGER NOT NULL, -- e.g., 8, 9, 10
  term INTEGER NOT NULL, -- 1, 2, 3
  week INTEGER, -- Optional: week within term
  title VARCHAR(255) NOT NULL,
  description TEXT,
  learning_objectives JSONB, -- Array of objectives
  activities TEXT,
  resources TEXT,
  assessment TEXT,
  differentiation_notes TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, in_progress, published, archived
  curriculum_alignment JSONB, -- Links to curriculum standards
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_school_id ON plans(school_id);
CREATE INDEX idx_plans_teacher_id ON plans(teacher_id);
CREATE INDEX idx_plans_subject_grade_term ON plans(school_id, subject, grade, term);
CREATE INDEX idx_plans_status ON plans(status);
CREATE INDEX idx_plans_updated_at ON plans(updated_at);

-- Plan versions (for tracking changes)
CREATE TABLE plan_versions (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content JSONB NOT NULL, -- Full plan content snapshot
  changed_by INTEGER NOT NULL REFERENCES users(id),
  change_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plan_versions_plan_id ON plan_versions(plan_id);

-- Plan sharing & permissions
CREATE TABLE plan_sharing (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  shared_with_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  shared_with_group VARCHAR(100), -- e.g., 'department', 'school'
  permission VARCHAR(50) DEFAULT 'view', -- view, comment, edit
  shared_by INTEGER NOT NULL REFERENCES users(id),
  shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plan_sharing_plan_id ON plan_sharing(plan_id);
CREATE INDEX idx_plan_sharing_user_id ON plan_sharing(shared_with_user_id);

-- Plan comments & feedback
CREATE TABLE plan_comments (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plan_comments_plan_id ON plan_comments(plan_id);
CREATE INDEX idx_plan_comments_author_id ON plan_comments(author_id);

-- Insert sample data for development
INSERT INTO schools (name, location, school_type, admin_email)
VALUES ('Development School', 'Test City', 'Secondary', 'admin@devschool.local');

INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, subjects_taught)
VALUES 
  (1, 'teacher1@devschool.local', 'hashed_password_1', 'Sarah', 'Miller', 'teacher', ARRAY['English', 'Drama']),
  (1, 'teacher2@devschool.local', 'hashed_password_2', 'Marcus', 'Johnson', 'teacher', ARRAY['Maths', 'Physics']),
  (1, 'coordinator@devschool.local', 'hashed_password_3', 'Priya', 'Patel', 'coordinator', ARRAY['Maths']),
  (1, 'admin@devschool.local', 'hashed_password_4', 'Jamal', 'Ahmed', 'admin', NULL);

-- Grant permissions on schema
GRANT USAGE ON SCHEMA public TO public;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO public;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO public;
