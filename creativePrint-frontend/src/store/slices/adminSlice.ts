// src/store/slices/adminSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AdminState, ApproveRejectProductPayload } from "../../types/admin"
import { adminService } from "../../components/services/api/admin.service"
import toast from "react-hot-toast"

const initialState: AdminState = {
  users: [],
  pendingProducts: [],
  allProducts: [],
  statistics: {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    monthlySales: [],
  },
  loading: false,
  error: null,
  usersPagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0
  },
  productsPagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0
  }
}

export const fetchAdminData = createAsyncThunk("admin/fetchAdminData", async () => {
  try {
    const statsResponse = await adminService.getDashboardStats();
    return {
      statistics: statsResponse,
    };
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
})

export const fetchAllProducts = createAsyncThunk(
  "admin/fetchAllProducts",
  async (params: { page: number, size: number, search?: string, status?: string }, { rejectWithValue }) => {
    try {
      return await adminService.getProducts(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (params: { page: number, size: number, search?: string, role?: string, status?: string }, { rejectWithValue }) => {
    try {
      return await adminService.getUsers(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
)

export const toggleProductArchiveStatus = createAsyncThunk(
  "admin/toggleProductArchiveStatus",
  async ({ productId, archived }: { productId: number | string, archived: boolean }, { rejectWithValue }) => {
    try {
      await adminService.toggleProductArchiveStatus(productId, !archived);
      toast.success(`Product ${archived ? 'unarchived' : 'archived'} successfully`);
      return { productId, archived: !archived };
    } catch (error: any) {
      toast.error(`Failed to ${archived ? 'unarchive' : 'archive'} product`);
      return rejectWithValue(error.response?.data || `Failed to ${archived ? 'unarchive' : 'archive'} product`);
    }
  }
)

export const toggleUserActiveStatus = createAsyncThunk(
  "admin/toggleUserActiveStatus",
  async ({ userId, active }: { userId: number | string, active: boolean }, { rejectWithValue }) => {
    try {
      await adminService.updateUserStatus(userId, !active);
      toast.success(`User ${active ? 'banned' : 'activated'} successfully`);
      return { userId, active: !active };
    } catch (error: any) {
      toast.error(`Failed to ${active ? 'ban' : 'activate'} user`);
      return rejectWithValue(error.response?.data || `Failed to ${active ? 'ban' : 'activate'} user`);
    }
  }
)

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId: number | string, { rejectWithValue }) => {
    try {
      await adminService.deleteProduct(productId);
      toast.success("Product deleted successfully");
      return productId;
    } catch (error: any) {
      toast.error("Failed to delete product");
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
)

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: number | string, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted successfully");
      return userId;
    } catch (error: any) {
      toast.error("Failed to delete user");
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
)

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
        state.statistics = action.payload.statistics
        if (action.payload.users) state.users = action.payload.users
        if (action.payload.pendingProducts) state.pendingProducts = action.payload.pendingProducts
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
      
      // Handle fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.allProducts = action.payload.content
        state.productsPagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalElements
        }
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      
      // Handle fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.content
        state.usersPagination = {
          currentPage: action.payload.number,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalElements
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      
      // Handle product archive toggle
      .addCase(toggleProductArchiveStatus.fulfilled, (state, action) => {
        const { productId, archived } = action.payload
        state.allProducts = state.allProducts.map(product => 
          product.id === productId ? { ...product, archived } : product
        )
      })
      
      // Handle user active status toggle
      .addCase(toggleUserActiveStatus.fulfilled, (state, action) => {
        const { userId, active } = action.payload
        state.users = state.users.map(user => 
          user.id === userId ? { ...user, active } : user
        )
      })
      
      // Handle product deletion
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.filter(product => product.id !== action.payload)
      })
      
      // Handle user deletion
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload)
      })
  },
})

export default adminSlice.reducer