import { api } from './axios';

export interface PaymentRequest {
  orderId: number;
  amount: number;
  currency: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  approvalUrl: string;
  createdAt: string;
}

export const paymentService = {
  createPayPalPayment: async (request: PaymentRequest): Promise<PaymentResponse> => {
    try {
      const response = await api.post('/payments/paypal/create', request);
      return response.data;
    } catch (error: any) {
      console.error('Error creating PayPal payment:', error);
      throw error;
    }
  },

  executePayPalPayment: async (paymentId: string, payerId: string): Promise<PaymentResponse> => {
    try {
      const response = await api.get(`/payments/paypal/execute?paymentId=${paymentId}&PayerID=${payerId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error executing PayPal payment:', error);
      throw error;
    }
  },

  getPaymentByOrderId: async (orderId: number): Promise<PaymentResponse> => {
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting payment by order ID:', error);
      throw error;
    }
  },
  
  // Check if payment was successful by order ID
  checkPaymentStatus: async (orderId: number): Promise<string> => {
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return response.data.status;
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
};