import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartState } from "../../types/cart"
import type { Product } from "../../types/product"


const getInitialState = (): CartState => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error("Error parsing cart from localStorage:", e);
    }
  }
  return {
    items: [],
    isOpen: false,
  };
};

const initialState: CartState = getInitialState();


const saveCartToLocalStorage = (state: CartState) => {
  
  const cartToSave = {
    ...state,
    isOpen: false
  };
  localStorage.setItem('cart', JSON.stringify(cartToSave));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload
      const existingItem = state.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }
      state.isOpen = true
      
      saveCartToLocalStorage(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string | number; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.product.id === productId)
      if (item) {
        item.quantity = quantity
      }
      
      saveCartToLocalStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload)

      saveCartToLocalStorage(state);
    },
    clearCart: (state) => {
      state.items = []
      
      saveCartToLocalStorage(state);
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart, openCart, closeCart } = cartSlice.actions
export default cartSlice.reducer