import { api } from "./axios";

export interface DashboardStats {
  totalDesigns: number;
  totalProducts: number;
  totalOrders: number;
  recentOrders: {
    id: number;
    customer: string;
    total: number;
    status: string;
    date: string;
  }[];
  recentSales: {
    date: string;
    amount: number;
  }[];
}

export const dashboardService = {
  getPartnerDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get("/partner/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      return {
        totalDesigns: 0,
        totalProducts: 0,
        totalOrders: 0,
        recentOrders: [],
        recentSales: [],
      };
    }
  },

  // Format currency
  formatCurrency: (amount: number): string => {
    return amount.toFixed(2);
  },

  // Format date
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  },
};
