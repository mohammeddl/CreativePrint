import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import type { User, UserState, UpdateProfileData } from "../../types/user"
import { authService } from "../../components/services/api/auth.service"
import { RegisterFormData, LoginFormData, AuthResponse } from "../../types/auth"

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  role: null,
  userId: null,
  expiresAt: null
}

// Login Thunk
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Register Thunk
export const registerUser = createAsyncThunk(
  "user/register",
  async (registrationData: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registrationData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Fetch Current User Thunk
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const userStr = localStorage.getItem('user-current');
      if (!userStr) {
        throw new Error('No user data found in local storage');
      }
      
      const userData = JSON.parse(userStr);
      return {
        id: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        themePreference: 'light' 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setThemePreference: (state, action: PayloadAction<"light" | "dark">) => {
      if (state.currentUser) {
        state.currentUser.themePreference = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    // Login Cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { 
          token, 
          role, 
          userId, 
          firstName, 
          lastName, 
          email, 
          expiresAt 
        } = action.payload;

        state.loading = false;
        state.isAuthenticated = true;
        state.token = token;
        state.role = role;
        state.userId = userId;
        state.currentUser = {
          id: userId,
          firstName,
          lastName,
          email,
          themePreference: 'light' // default theme
        };
        state.expiresAt = expiresAt;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.userId = null;
        state.expiresAt = null;
      })

      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { 
          token, 
          role, 
          userId, 
          firstName, 
          lastName, 
          email, 
          expiresAt 
        } = action.payload;

        state.loading = false;
        state.isAuthenticated = true;
        state.token = token;
        state.role = role;
        state.userId = userId;
        state.currentUser = {
          id: userId,
          firstName,
          lastName,
          email,
          themePreference: 'light' 
        };
        state.expiresAt = expiresAt;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.userId = null;
        state.expiresAt = null;
      })

      // Logout Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.userId = null;
        state.expiresAt = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Current User Cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
})

export const { setThemePreference } = userSlice.actions

export default userSlice.reducer