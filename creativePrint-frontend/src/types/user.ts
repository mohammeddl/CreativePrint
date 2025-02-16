export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  
  export interface UserState {
    currentUser: User | null
    loading: boolean
    error: string | null
  }
  
  export interface UpdateProfileData {
    firstName: string
    lastName: string
    email: string
  }
  
  export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }
  
  