import type { User } from "./user"
import type { Product } from "./product"

export interface AdminState {
  users: User[]
  pendingProducts: Product[]
  statistics: {
    totalUsers: number
    totalProducts: number
    totalSales: number
    monthlySales: { month: string; sales: number }[]
  }
  loading: boolean
  error: string | null
}

export interface ApproveRejectProductPayload {
  productId: string
  approved: boolean
}

