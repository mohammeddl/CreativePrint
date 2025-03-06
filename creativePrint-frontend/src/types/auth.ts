export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'PARTNER';
  
  // Client-specific optional fields
  shippingAddress?: string;
  billingAddress?: string;
  phoneNumber?: string;
  
  // Partner-specific optional fields
  companyName?: string;
  businessType?: 'MANUFACTURER' | 'SUPPLIER' | 'RETAILER' | 'WHOLESALER';
  taxId?: string;
  commissionRate?: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  role: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  expiresAt: string;
}