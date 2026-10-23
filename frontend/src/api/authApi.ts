import { apiRequest } from './client.js';
import { User } from '../types/index.js';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; confirmPassword?: string }) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  demoLogin: () =>
    apiRequest<AuthResponse>('/auth/demo-login', { method: 'POST' }),

  getMe: () =>
    apiRequest<{ success: boolean; user: User }>('/auth/me'),

  logout: () =>
    apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  getProfile: () =>
    apiRequest<{ success: boolean; profile: User }>('/profile'),

  updateProfile: (data: Partial<User>) =>
    apiRequest<{ success: boolean; message: string }>('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ success: boolean; message: string }>('/profile/password', { method: 'PUT', body: JSON.stringify(data) }),

  deleteAccount: () =>
    apiRequest<{ success: boolean; message: string }>('/profile', { method: 'DELETE' }),

  getAlerts: () =>
    apiRequest<{ success: boolean; count: number; alerts: any[] }>('/alerts'),

  markAlertRead: (id: string) =>
    apiRequest<{ success: boolean }>(`/alerts/${id}/read`, { method: 'PUT' })
};
