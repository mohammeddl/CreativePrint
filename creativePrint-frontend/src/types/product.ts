export interface Product {
    id: string
    name: string
    description: string
    price: number
    image: string
    category: string
    isHot: boolean
    stock: number
  }
  
  export interface ProductsState {
    items: Product[]
    filteredItems: Product[]
    loading: boolean
    error: string | null
    categories: string[]
    selectedCategory: string | null
  }
  
  