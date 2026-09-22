import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = ''; // API routes are now in the same Next.js app

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const url = (error.config?.url ?? '').toString();
        const isAuthRequest = url.includes('/api/auth/login') || url.includes('/api/auth/register');
        if (error.response?.status === 401 && !isAuthRequest) {
          // Token expired or invalid on a protected call -> drop session and bounce to login.
          // Never redirect for the login call itself, or a bad password would loop.
          this.clearToken();
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on init
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', { email, password });
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    school_id: number;
  }) {
    const response = await this.client.post('/api/auth/register', data);
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
    }
    return response.data;
  }

  async logout() {
    this.clearToken();
  }

  // User endpoints
  async getMe() {
    return this.client.get('/api/users/me');
  }

  // Plan endpoints
  async getPlan(planId: number) {
    return this.client.get(`/api/plans/${planId}`);
  }

  async getPlans(params?: { limit?: number; offset?: number; status?: string }) {
    return this.client.get('/api/plans', { params });
  }

  async getPlansByGradeSubjectTerm(subject: string, grade: number, term: number) {
    return this.client.get('/api/plans/subject/details', {
      params: { subject, grade, term },
    });
  }

  async createPlan(data: Partial<import('@/types').Plan>) {
    return this.client.post('/api/plans', data);
  }

  async updatePlan(planId: number, data: Partial<import('@/types').Plan>) {
    return this.client.put(`/api/plans/${planId}`, data);
  }

  async deletePlan(planId: number) {
    return this.client.delete(`/api/plans/${planId}`);
  }

  async duplicatePlan(planId: number, newTerm: number, newWeek?: number) {
    return this.client.post(`/api/plans/${planId}/duplicate`, { newTerm, newWeek });
  }

  async exportPlanPDF(planId: number) {
    return this.client.get(`/api/plans/${planId}/export/pdf`, {
      responseType: 'blob',
    });
  }

  // Sharing endpoints
  async sharePlan(planId: number, data: { user_id?: number; group?: string; permission: string }) {
    return this.client.post(`/api/plans/${planId}/share`, data);
  }

  // Comments endpoints
  async addComment(planId: number, content: string) {
    return this.client.post(`/api/plans/${planId}/comments`, { content });
  }

  async getComments(planId: number) {
    return this.client.get(`/api/plans/${planId}/comments`);
  }
}

export const apiClient = new ApiClient();
