import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { User, UserState, UpdateProfileData, ChangePasswordData } from "../../types/user"

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
  } as User
})

export const updateProfile = createAsyncThunk("user/updateProfile", async (profileData: UpdateProfileData) => {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    ...profileData,
    id: "1",
    avatar: "/placeholder.svg",
  } as User
})

export const changePassword = createAsyncThunk("user/changePassword", async (passwordData: ChangePasswordData) => {
  // TODO: Replace with actual API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to change password"
      })
  },
})

export default userSlice.reducer

