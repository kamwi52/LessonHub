INSERT INTO users (school_id, email, password_hash, first_name, last_name, role, subjects_taught) VALUES
  (1, 'teacher1@devschool.local', 'hashed_password_1', 'Sarah', 'Miller', 'teacher', ARRAY['English', 'Drama']),
  (1, 'teacher2@devschool.local', 'hashed_password_2', 'Marcus', 'Johnson', 'teacher', ARRAY['Maths', 'Physics']),
  (1, 'coordinator@devschool.local', 'hashed_password_3', 'Priya', 'Patel', 'coordinator', ARRAY['Maths']),
  (1, 'admin@devschool.local', 'hashed_password_4', 'Jamal', 'Ahmed', 'admin', NULL)
ON CONFLICT (email) DO NOTHING;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lessonshub_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lessonshub_user;
ALTER TABLE users OWNER TO lessonshub_user;
ALTER TABLE schools OWNER TO lessonshub_user;
ALTER TABLE plans OWNER TO lessonshub_user;
ALTER TABLE plan_versions OWNER TO lessonshub_user;
ALTER TABLE plan_sharing OWNER TO lessonshub_user;
ALTER TABLE plan_comments OWNER TO lessonshub_user;
