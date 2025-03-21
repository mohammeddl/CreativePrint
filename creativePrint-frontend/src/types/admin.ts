import type { User } from "./user"
import type { Product } from "./product"

export interface PaginationState {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface AdminState {
  users: User[]
  pendingProducts: Product[]
  allProducts: Product[]
  statistics: {
    totalUsers: number
    totalProducts: number
    totalSales: number
    monthlySales: { month: string; sales: number }[]
  }
  loading: boolean
  error: string | null
  usersPagination: PaginationState
  productsPagination: PaginationState
}

export interface ApproveRejectProductPayload {
  productId: string
  approved: boolean
}