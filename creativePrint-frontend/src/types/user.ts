export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  themePreference: "light" | "dark"
  role?: 'CLIENT' | 'PARTNER' | 'ADMIN'
  token?: string
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
  role: 'CLIENT' | 'PARTNER' | 'ADMIN' | null;
  userId: string | null;
  expiresAt: string | null;
}
export interface UpdateProfileData {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  themePreference: "light" | "dark"
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}