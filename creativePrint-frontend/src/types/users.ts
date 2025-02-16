export interface LoginFormData {
    email: string
    password: string
  }
  
  export interface RegisterFormData {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }
  
  export interface AuthResponse {
    token: string
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
    }
  }
  
  