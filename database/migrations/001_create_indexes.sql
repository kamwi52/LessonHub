-- Migration: Create indexes for performance
-- Run after init.sql for query optimization

CREATE INDEX IF NOT EXISTS idx_plans_school_id ON plans(school_id);
CREATE INDEX IF NOT EXISTS idx_plans_teacher_id ON plans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_plans_subject_grade_term ON plans(school_id, subject, grade, term);
CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
CREATE INDEX IF NOT EXISTS idx_plans_updated_at ON plans(updated_at);

CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_plan_comments_plan_id ON plan_comments(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_comments_author_id ON plan_comments(author_id);

CREATE INDEX IF NOT EXISTS idx_plan_sharing_plan_id ON plan_sharing(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_sharing_user_id ON plan_sharing(shared_with_user_id);

CREATE INDEX IF NOT EXISTS idx_plan_versions_plan_id ON plan_versions(plan_id);
