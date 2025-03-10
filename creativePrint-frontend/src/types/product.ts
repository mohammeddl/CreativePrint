export interface ProductVariant {
  id: number
  size: string
  color: string
  priceAdjustment: number
  stock: number
  product?: Product 
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

export interface Product {
  id: number
  name: string
  description: string
  basePrice: number
  category: Category
  design: Design
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  name: string
  description: string
  basePrice: number
  categoryId: number
  designId: number
  variants: ProductVariantRequest[]
}