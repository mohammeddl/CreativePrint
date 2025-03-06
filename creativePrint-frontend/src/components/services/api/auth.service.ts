import { api } from "./axios";
import { RegisterFormData, LoginFormData, AuthResponse } from "../../../types/auth";
import { User } from "../../../types/user";

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user-current', JSON.stringify(response.data));
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    let endpoint = '/auth/register';
    if (data.role === 'CLIENT') {
      endpoint = '/auth/register-client';
    } else if (data.role === 'PARTNER') {
      endpoint = '/auth/register-partner';
    }

    const response = await api.post<AuthResponse>(endpoint, data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await api.post("/auth/logout", null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user-current');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/users/profile");
    return response.data;
  }
};