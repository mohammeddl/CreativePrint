import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AdminState, ApproveRejectProductPayload } from "../../types/admin"
import type { User } from "../../types/user"
import type { Product } from "../../types/product"

const initialState: AdminState = {
  users: [],
  pendingProducts: [],
  statistics: {
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    monthlySales: [],
  },
  loading: false,
  error: null,
}

export const fetchAdminData = createAsyncThunk("admin/fetchAdminData", async () => {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    users: [
      { id: "1", firstName: "John", lastName: "Doe", email: "john@example.com" },
      { id: "2", firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
    ] as User[],
    pendingProducts: [
      {
        id: "1",
        name: "Custom T-Shirt",
        description: "A cool t-shirt design",
        price: 19.99,
        image: "/placeholder.svg",
        category: "Clothing",
        isHot: false,
        stock: 100,
      },
      {
        id: "2",
        name: "Artistic Mug",
        description: "Beautiful mug with abstract art",
        price: 14.99,
        image: "/placeholder.svg",
        category: "Accessories",
        isHot: false,
        stock: 50,
      },
    ] as Product[],
    statistics: {
      totalUsers: 100,
      totalProducts: 500,
      totalSales: 10000,
      monthlySales: [
        { month: "Jan", sales: 1000 },
        { month: "Feb", sales: 1200 },
        { month: "Mar", sales: 1500 },
        { month: "Apr", sales: 1300 },
        { month: "May", sales: 1700 },
        { month: "Jun", sales: 1600 },
      ],
    },
  }
})

export const approveRejectProduct = createAsyncThunk(
  "admin/approveRejectProduct",
  async (payload: ApproveRejectProductPayload) => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return payload
  },
)

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
        state.pendingProducts = action.payload.pendingProducts
        state.statistics = action.payload.statistics
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch admin data"
      })
      .addCase(approveRejectProduct.fulfilled, (state, action) => {
        const { productId, approved } = action.payload
        state.pendingProducts = state.pendingProducts.filter((product) => product.id !== productId)
        if (approved) {
          state.statistics.totalProducts += 1
        }
      })
  },
})

export default adminSlice.reducer

