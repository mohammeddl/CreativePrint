import { api } from './axios';
import { 
  Order, 
  OrderStatusHistory,
  OrderStatusUpdateRequest,
  OrdersQueryParams,
  PageResponse
} from '../../../types/order';

export const orderService = {
  getOrders: async (params: OrdersQueryParams = {}): Promise<PageResponse<Order>> => {
    try {
      const response = await api.get('/partner/orders', { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Return mock data for development
      return {
        content: [
          {
            id: 1,
            buyer: { id: 101, firstName: "John", lastName: "Smith", email: "john@example.com" },
            items: [
              {
                id: 201,
                variant: {
                  id: 301,
                  size: "M",
                  color: "Black",
                  priceAdjustment: 0,
                  stock: 25,
                  product: {
                    id: 401,
                    name: "Abstract T-Shirt",
                    basePrice: 19.99,
                    design: { id: 501, name: "Abstract Pattern" }
                  }
                },
                quantity: 2
              }
            ],
            totalPrice: 39.98,
            status: "PAYMENT_RECEIVED",
            createdAt: "2025-03-01T10:30:00Z"
          },
          {
            id: 2,
            buyer: { id: 102, firstName: "Jane", lastName: "Doe", email: "jane@example.com" },
            items: [
              {
                id: 202,
                variant: {
                  id: 302,
                  size: "L",
                  color: "Blue",
                  priceAdjustment: 0,
                  stock: 15,
                  product: {
                    id: 402,
                    name: "Mountain Poster",
                    basePrice: 24.99,
                    design: { id: 502, name: "Mountain Landscape" }
                  }
                },
                quantity: 1
              }
            ],
            totalPrice: 24.99,
            status: "IN_PRODUCTION",
            createdAt: "2025-03-05T14:20:00Z"
          }
        ],
        totalPages: 1,
        totalElements: 2,
        size: 10,
        number: 0
      };
    }
  },

  getOrderStatusHistory: async (orderId: number): Promise<OrderStatusHistory[]> => {
    try {
      const response = await api.get(`/partner/orders/${orderId}/status-history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order history:", error);
      // Return mock data for development
      return [
        {
          id: 1,
          orderId: orderId,
          status: "PENDING",
          notes: "Order created",
          updatedByName: "System",
          timestamp: "2025-03-01T10:25:00Z"
        },
        {
          id: 2,
          orderId: orderId,
          status: "PENDING_PAYMENT",
          notes: "Awaiting payment",
          updatedByName: "System",
          timestamp: "2025-03-01T10:26:00Z"
        },
        {
          id: 3,
          orderId: orderId,
          status: "PAYMENT_RECEIVED",
          notes: "Payment confirmed via PayPal",
          updatedByName: "System",
          timestamp: "2025-03-01T10:30:00Z"
        }
      ];
    }
  },

  updateOrderStatus: async (orderId: number, updateRequest: OrderStatusUpdateRequest): Promise<Order> => {
    const response = await api.patch(`/partner/orders/${orderId}/status`, updateRequest);
    return response.data;
  },

  // Helper function to determine if a status transition is allowed
  canUpdateToStatus: (currentStatus: string, newStatus: string): boolean => {
    // Define allowed transitions for partners
    const allowedTransitions: Record<string, string[]> = {
      'PAYMENT_RECEIVED': ['IN_PRODUCTION'],
      'IN_PRODUCTION': ['SHIPPED'],
      'SHIPPED': ['DELIVERED']
    };
    
    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
  },

  // Get color based on status for UI display
  getStatusColor: (status: string): string => {
    switch(status) {
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_RECEIVED':
        return 'bg-blue-100 text-blue-800';
      case 'PAYMENT_FAILED':
        return 'bg-red-100 text-red-800';
      case 'IN_PRODUCTION':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  // Format date for display
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

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