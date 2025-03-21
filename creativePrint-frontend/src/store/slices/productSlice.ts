// Modified version of src/store/slices/productSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, ProductsState } from "../../types/product"
import { productService } from "../../components/services/api/product.service"

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  categories: [],
  selectedCategory: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts", 
  async ({ page = 0, category = null }: { page?: number, category?: string | null }) => {
    try {
      console.log(`Fetching products for page ${page}, category: ${category || 'all'}`);
      const response = await productService.getProductsCatalog(page, 12, category);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
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
      state.currentPage = 0; // Reset to first page when changing category
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      // Note: We don't fetch products here, that should be done in a useEffect
    },
    // Add a new product (for admin functionality)
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    // Update a product (for admin functionality)
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    // Remove a product (for admin functionality)
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // Update stock quantity
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
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
        state.categories = action.payload.categories;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
        console.log('Updated state:', {
          itemsCount: state.items.length,
          totalPages: state.totalPages,
          currentPage: state.currentPage
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
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