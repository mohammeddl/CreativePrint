import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../components/services/api/axios'
import toast from 'react-hot-toast'

// Define the initial state interface
interface UserProfileState {
  loading: boolean
  error: string | null
  profile: {
    bio?: string
    website?: string
    socialMediaLinks?: string
    profilePicture?: string
  } | null
}

// Initial state
const initialState: UserProfileState = {
  loading: false,
  error: null,
  profile: null
}

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'userProfile/update',
  async ({ userId, formData }: { userId: string, formData: FormData }, { rejectWithValue }) => {
    try {
      // Import here to avoid circular dependency
      const { userProfileService } = await import('../../components/services/api/userProfile.service')
      const data = await userProfileService.updateUserProfile(userId, formData)
      toast.success('Profile updated successfully!')
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      toast.error(errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetch',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      // Double-check that we have a userId
      if (!userId) {
        const state = getState() as any;
        userId = state.user.userId;
        
        // If still no userId, reject
        if (!userId) {
          return rejectWithValue('User ID not found');
        }
      }
      
      console.log(`Fetching profile for user ID: ${userId}`);
      const { userProfileService } = await import('../../components/services/api/userProfile.service');
      return await userProfileService.getUserProfile(userId);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);
// Create the slice
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.loading = false
      state.error = null
      state.profile = null
    }
  },
  extraReducers: (builder) => {
    // Update Profile Reducers
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })
    
    // Fetch Profile Reducers
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })
  }
})

export const { resetProfileState } = userProfileSlice.actions
export default userProfileSlice.reducer