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
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      throw error;
    }
  },

  executePayPalPayment: async (paymentId: string, payerId: string): Promise<PaymentResponse> => {
    try {
      const response = await api.get(`/payments/paypal/execute?paymentId=${paymentId}&PayerID=${payerId}`);
      return response.data;
    } catch (error) {
      console.error('Error executing PayPal payment:', error);
      throw error;
    }
  },

  getPaymentByOrderId: async (orderId: number): Promise<PaymentResponse> => {
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment by order ID:', error);
      throw error;
    }
  }
};