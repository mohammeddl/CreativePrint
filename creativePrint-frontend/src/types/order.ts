import { Product, ProductVariant } from './product';

export interface OrderItem {
  id: number
  variant: ProductVariant
  quantity: number
}

export interface OrderBuyer {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface Order {
  id: number
  buyer: OrderBuyer
  items: OrderItem[]
  totalPrice: number
  status: string
  createdAt: string
}

export interface OrderStatusHistory {
  id: number
  orderId: number
  status: string
  notes: string
  updatedByName: string
  timestamp: string
}

export interface OrderStatusUpdateRequest {
  status: string
  notes: string
}

export interface OrdersQueryParams {
  page?: number
  size?: number
  search?: string
  status?: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}