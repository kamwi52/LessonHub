export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'teacher' | 'coordinator' | 'admin';
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
