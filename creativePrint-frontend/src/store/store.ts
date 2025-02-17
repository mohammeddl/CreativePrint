import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice' ;
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    user: userReducer,
    admin :adminReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;