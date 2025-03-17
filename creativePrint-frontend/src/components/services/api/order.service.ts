import { api } from './axios';
import { Order, OrderStatusHistory } from '../../../types/order';

// Order status options for UI dropdowns
export const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAYMENT_RECEIVED", label: "Payment Received" },
  { value: "PAYMENT_FAILED", label: "Payment Failed" },
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" }
];

export interface OrderRequest {
  buyerId: string | number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  variantId: number;
  quantity: number;
}

export interface OrderCancelResponse {
  success: boolean;
  message: string;
}

export const orderService = {
  createOrder: async (request: OrderRequest): Promise<Order> => {
    try {
      const response = await api.post('/orders', request);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrderHistory: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders/history');
      return response.data;
    } catch (error) {
      console.error('Error getting order history:', error);
      throw error;
    }
  },

  getOrderById: async (orderId: string | number): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      throw error;
    }
  },

  getOrderStatusHistory: async (orderId: string | number): Promise<OrderStatusHistory[]> => {
    try {
      const response = await api.get(`/orders/${orderId}/status-history`);
      return response.data;
    } catch (error) {
      console.error('Error getting order status history:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId: string | number): Promise<OrderCancelResponse> => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Helper functions for UI
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_RECEIVED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PRODUCTION':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      case 'PAYMENT_FAILED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  formatDate: (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
};