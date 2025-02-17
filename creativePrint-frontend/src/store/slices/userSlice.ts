import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User, UserState, UpdateProfileData } from "../../types/user"

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
}

export const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", async () => {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg",
    themePreference: "light",
  } as User
})

export const updateProfile = createAsyncThunk("user/updateProfile", async (profileData: UpdateProfileData) => {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    ...profileData,
    id: "1",
  } as User
})

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
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user data"
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to update profile"
      })
  },
})

export const { setThemePreference } = userSlice.actions

export default userSlice.reducer

