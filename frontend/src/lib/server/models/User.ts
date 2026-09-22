import { query } from '@/lib/server/database';

export interface User {
  id: number;
  school_id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'teacher' | 'coordinator' | 'admin';
  subjects_taught?: string[] | null;
  created_at: Date;
  updated_at: Date;
}

export async function getUserById(userId: number): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function createUser(userData: {
  school_id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
}): Promise<User> {
  const result = await query(
    `INSERT INTO users (school_id, email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userData.school_id, userData.email, userData.password_hash, userData.first_name, userData.last_name, userData.role]
  );
  return result.rows[0];
}
