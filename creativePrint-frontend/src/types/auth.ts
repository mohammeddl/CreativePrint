export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "CLIENT" | "PARTNER";
}

export interface AuthResponse {
  token: string;
  type: string;
  role: string;
  expiresAt: string;
}
