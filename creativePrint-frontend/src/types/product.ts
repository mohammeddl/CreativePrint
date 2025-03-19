export interface ProductVariant {
  id: number
  size: string
  color: string
  priceAdjustment: number
  stock: number
  product?: Product 
}
export interface ProductWithVariants {
  id: number | string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isHot: boolean;
  variants: ProductVariant[];
}
export interface ProductVariantRequest {
  size: string
  color: string
  priceAdjustment: number
  stock: number
}

export interface Design {
  id: number
  name: string
  description: string
  designUrl: string
  createdAt: string
  partnerId: number
}

export interface DesignRequest {
  name: string
  description: string
  designFile: File
}

export interface Category {
  id: number
  name: string
  description: string
}

// Extended Product interface that can handle both backend formats
export interface Product {
  id: number | string
  name: string
  description: string
  // basePrice for partner products, price for catalog products
  basePrice?: number
  price?: number
  category: Category | string
  // Design is required for partner products
  design?: Design
  // Image URL for catalog products
  image?: string
  variants?: ProductVariant[]
  createdAt?: string
  updatedAt?: string
  // For catalog display
  isHot?: boolean
  stock?: number
}

export interface ProductRequest {
  name: string
  description: string
  basePrice: number
  categoryId: number
  designId: number
  variants: ProductVariantRequest[]
}

export interface ProductVariantFormData {
  size: string;
  color: string;
  priceAdjustment: number;
  stock: number;
}

export interface ProductVariantsProps {
  variants: ProductVariantFormData[];
  basePrice: number;
  onChange: (variants: ProductVariantFormData[]) => void;
  errors: { [key: string]: string };
}

export interface ProductFormData {
  name: string;
  description: string;
  basePrice: number;
  categoryId: number;
  designId: number;
  variants: ProductVariantFormData[];
}

// New interface for catalog-specific product response
export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  categories: string[];
}

export interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  loading: boolean;
  error: string | null;
  categories: string[];
  selectedCategory: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}