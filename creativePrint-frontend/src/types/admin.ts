// src/types/admin.ts
import type { User } from "./user"
import type { Product } from "./product"

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface AdminState {
  users: AdminUser[]
  pendingProducts: Product[]
  allProducts: AdminProduct[]
  statistics: AdminStats
  loading: boolean
  error: string | null
  usersPagination: PaginationState
  productsPagination: PaginationState
}

export interface ApproveRejectProductPayload {
  productId: string
  approved: boolean
}

export interface AdminUser extends User {
  active: boolean
  createdAt: string
}

export interface AdminProduct extends Product {
  archived?: boolean
  totalSold?: number
  totalStock?: number
}

export interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: {
    id: number
    customer: string
    total: number
    status: string
    date: string
  }[]
  monthlySales: {
    month: string
    revenue: number
  }[]
}

export interface SystemSettings {
  orderEmailNotifications: boolean
  allowUserRegistration: boolean
  maintenanceMode: boolean
  maxProductsPerPartner: number
  maxOrdersPerDay: number
  siteName: string
  companyAddress: string
  supportEmail: string
  currency: string
  defaultLanguage: string
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: number[]
}

export interface Permission {
  id: number
  name: string
  description: string
}