import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import userProfileReducer from './slices/userProfileSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    user: userReducer,
    admin: adminReducer,
    userProfile: userProfileReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['userProfile/update/fulfilled'],
        ignoredActionPaths: ['meta.arg', 'payload.profilePicture'],
        ignoredPaths: ['userProfile.profile.profilePicture'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;