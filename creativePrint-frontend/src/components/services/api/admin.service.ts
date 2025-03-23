import { api } from './axios';
import type { AdminStats, AdminUser, AdminProduct, SystemSettings } from '../../../types/admin';

export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<AdminStats> => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // User Management
  getUsers: async (params: { 
    page?: number, 
    size?: number, 
    search?: string, 
    role?: string, 
    status?: string 
  }): Promise<any> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`/admin/users?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (userId: number | string): Promise<AdminUser> => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  updateUserStatus: async (userId: number | string, active: boolean): Promise<AdminUser> => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { active });
      return response.data;
    } catch (error: any) {
      console.error(`Error updating user ${userId} status:`, error);
      throw error;
    }
  },

  deleteUser: async (userId: number | string): Promise<void> => {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error: any) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Product Management
  getProducts: async (params: { 
    page?: number, 
    size?: number, 
    search?: string, 
    categoryId?: number | string, 
    status?: string 
  }): Promise<any> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`/admin/products?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (productId: number | string): Promise<AdminProduct> => {
    try {
      const response = await api.get(`/admin/products/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  toggleProductArchiveStatus: async (productId: number | string, archived: boolean): Promise<AdminProduct> => {
    try {
      const response = await api.patch(`/admin/products/${productId}/archive`, { archived });
      return response.data;
    } catch (error: any) {
      console.error(`Error updating product ${productId} archive status:`, error);
      throw error;
    }
  },

  deleteProduct: async (productId: number | string): Promise<void> => {
    try {
      await api.delete(`/admin/products/${productId}`);
    } catch (error: any) {
      console.error(`Error deleting product ${productId}:`, error);
      throw error;
    }
  },

  // Settings
  getSystemSettings: async (): Promise<SystemSettings> => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },

  updateSystemSettings: async (settings: SystemSettings): Promise<SystemSettings> => {
    try {
      const response = await api.post('/admin/settings', settings);
      return response.data;
    } catch (error: any) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  },

  // Permissions
  getRoles: async (): Promise<any[]> => {
    try {
      const response = await api.get('/admin/roles');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  getPermissions: async (): Promise<any[]> => {
    try {
      const response = await api.get('/admin/permissions');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  updateRolePermissions: async (roleId: number | string, permissions: number[]): Promise<any> => {
    try {
      const response = await api.put(`/admin/roles/${roleId}/permissions`, { permissions });
      return response.data;
    } catch (error: any) {
      console.error(`Error updating role ${roleId} permissions:`, error);
      throw error;
    }
  }
};