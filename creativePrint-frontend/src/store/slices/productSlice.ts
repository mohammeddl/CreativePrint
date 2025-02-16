import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product, ProductsState } from "../../types/product"

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  categories: [],
  selectedCategory: null,
}

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: "1",
      name: "T-Shirt",
      description: "Comfortable cotton t-shirt",
      price: 19.99,
      image: "/placeholder.svg",
      category: "Clothing",
      isHot: true,
      stock: 100,
    },
    {
      id: "2",
      name: "Mug",
      description: "Ceramic mug for your favorite drink",
      price: 9.99,
      image: "/placeholder.svg",
      category: "Accessories",
      isHot: false,
      stock: 50,
    },
    {
      id: "3",
      name: "Poster",
      description: "High-quality print poster",
      price: 24.99,
      image: "/placeholder.svg",
      category: "Home Decor",
      isHot: true,
      stock: 75,
    },
    {
      id: "4",
      name: "Hoodie",
      description: "Warm and cozy hoodie",
      price: 39.99,
      image: "/placeholder.svg",
      category: "Clothing",
      isHot: false,
      stock: 60,
    },
    {
      id: "5",
      name: "Phone Case",
      description: "Durable phone case",
      price: 14.99,
      image: "/placeholder.svg",
      category: "Accessories",
      isHot: true,
      stock: 200,
    },
  ] as Product[]
})

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
      state.filteredItems = action.payload
        ? state.items.filter((item) => item.category === action.payload)
        : state.items
    },
    // Add a new product (for admin functionality)
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload)
    },
    // Update a product (for admin functionality)
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    // Remove a product (for admin functionality)
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    // Update stock quantity
    updateStock: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const product = state.items.find((item) => item.id === action.payload.productId)
      if (product) {
        product.stock = action.payload.quantity
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = action.payload
        state.categories = Array.from(new Set(action.payload.map((item) => item.category)))
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
  },
})

export const { setSelectedCategory, addProduct, updateProduct, removeProduct, updateStock } = productSlice.actions

export default productSlice.reducer

