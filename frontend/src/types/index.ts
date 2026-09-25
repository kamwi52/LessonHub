/** Every role the platform understands. */
export type Role = 'student' | 'teacher' | 'coordinator' | 'admin';

/**
 * Roles a visitor may pick when creating their own account.
 *
 * `coordinator` and `admin` are deliberately excluded — letting anyone
 * self-register as an administrator would be a privilege-escalation hole.
 * Those accounts are provisioned directly in the database instead.
 */
export const SELF_REGISTER_ROLES: Role[] = ['student', 'teacher'];

export function isSelfRegisterRole(value: unknown): value is Role {
  return typeof value === 'string' && SELF_REGISTER_ROLES.includes(value as Role);
}

/** Human-readable names, used in the sidebar profile card and role pickers. */
export const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  teacher: 'Teacher',
  coordinator: 'Coordinator',
  admin: 'Administrator',
};

/** Roles that own and edit lesson plans. Students only read published content. */
export function canAuthorPlans(role: Role | undefined): boolean {
  return role === 'teacher' || role === 'coordinator' || role === 'admin';
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  school_id: number;
  subjects_taught: string[];
}

export interface Plan {
  id: number;
  school_id: number;
  teacher_id: number;
  subject: string;
  grade: number;
  term: number;
  week?: number;
  title: string;
  description?: string;
  learning_objectives: string[];
  activities?: string;
  resources?: string;
  assessment?: string;
  differentiation_notes?: string;
  status: 'draft' | 'in_progress' | 'published' | 'archived';
  curriculum_alignment?: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: number;
  name: string;
  location?: string;
  school_type: string;
  admin_email?: string;
}

export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
