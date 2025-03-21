import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, ProductsState } from "../../types/product"
import { productService } from "../../components/services/api/product.service"

const initialState: ProductsState = {
  items: [],         
  filteredItems: [], 
  hotItems: [],      
  loading: false,
  error: null,
  categories: [],
  selectedCategory: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0
}

export const fetchHotProducts = createAsyncThunk(
  "products/fetchHotProducts", 
  async () => {
    try {
      const response = await productService.getProductsCatalog(0, 100);
      return response.products.filter(product => product.isHot);
    } catch (error) {
      throw error;
    }
  }
)

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts", 
  async ({ page = 0, category = null }: { page?: number, category?: string | null }) => {
    try {
      const response = await productService.getProductsCatalog(page, 12, category);
      return response;
    } catch (error) {
      throw error;
    }
  }
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 0; 
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateStock: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const product = state.items.find((item) => item.id === action.payload.productId);
      if (product) {
        product.stock = action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Only update filteredItems (for pagination), not the entire items array
        state.filteredItems = action.payload.products;
        state.categories = action.payload.categories;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
        
        // Keep the complete items array for reference
        if (state.items.length === 0) {
          state.items = action.payload.products;
        }
        
        console.log('Updated state:', {
          filteredItemsCount: state.filteredItems.length,
          totalPages: state.totalPages,
          currentPage: state.currentPage
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      
      .addCase(fetchHotProducts.fulfilled, (state, action) => {
        state.hotItems = action.payload;
      });
  },
});

export const { 
  setSelectedCategory, 
  setCurrentPage,
  addProduct, 
  updateProduct, 
  removeProduct, 
  updateStock 
} = productSlice.actions;

export default productSlice.reducer;