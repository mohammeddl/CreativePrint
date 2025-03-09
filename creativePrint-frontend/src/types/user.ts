export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  themePreference?: "light" | "dark"
  role?: 'CLIENT' | 'PARTNER' | 'ADMIN'
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
  themePreference?: "light" | "dark"
}

export interface UpdateUserProfileData {
  bio?: string
  website?: string
  socialMediaLinks?: string
  profilePicture?: File
}

export interface UserProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  website?: string;
  socialMediaLinks?: string;
  profilePicture?: string;
  role?: string;
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}