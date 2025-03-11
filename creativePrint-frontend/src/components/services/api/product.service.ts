import { api } from './axios';
import { 
  Product, 
  ProductRequest, 
  Design, 
  DesignRequest, 
  Category, 
} from '../../../types/product';
import { PageResponse } from '../../../types/order';

export const productService = {
  // Design related services
  getDesigns: async (page: number = 0, size: number = 12, search: string = ""): Promise<PageResponse<Design>> => {
    try {
      const response = await api.get('/partner/designs', {
        params: { page, size, search }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching designs:", error);
      // Return mock data for development
      return {
        content: [
          {
            id: 1,
            name: "Abstract Pattern",
            description: "Colorful abstract pattern for t-shirts",
            designUrl: "https://via.placeholder.com/300",
            createdAt: "2025-02-15T10:30:00Z",
            partnerId: 1
          },
          {
            id: 2,
            name: "Mountain Landscape",
            description: "Scenic mountain view for posters",
            designUrl: "https://via.placeholder.com/300",
            createdAt: "2025-03-01T14:20:00Z",
            partnerId: 1
          }
        ],
        totalPages: 1,
        totalElements: 2,
        size: 12,
        number: 0
      };
    }
  },

  createDesign: async (designData: DesignRequest): Promise<Design> => {
    const formData = new FormData();
    formData.append('name', designData.name);
    formData.append('description', designData.description || '');
    formData.append('designFile', designData.designFile);

    const response = await api.post('/partner/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteDesign: async (designId: number): Promise<void> => {
    await api.delete(`/partner/designs/${designId}`);
  },

  // Product related services
  getProducts: async (page: number = 0, size: number = 10, search: string = ""): Promise<PageResponse<Product>> => {
    try {
      const response = await api.get('/partner/products', {
        params: { page, size, search }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return mock data for development
      return {
        content: [
          {
            id: 1,
            name: "Abstract Pattern T-Shirt",
            description: "Comfortable cotton t-shirt with abstract design",
            basePrice: 19.99,
            category: { id: 1, name: "Clothing", description: "Apparel items" },
            design: { 
              id: 1, 
              name: "Abstract Pattern", 
              description: "Colorful abstract pattern", 
              designUrl: "https://via.placeholder.com/300",
              createdAt: "2025-02-15T10:30:00Z",
              partnerId: 1
            },
            variants: [
              { id: 1, size: "S", color: "Black", priceAdjustment: 0, stock: 25 },
              { id: 2, size: "M", color: "Black", priceAdjustment: 0, stock: 30 },
              { id: 3, size: "L", color: "Black", priceAdjustment: 2, stock: 20 }
            ],
            createdAt: "2025-02-15T10:30:00Z",
            updatedAt: "2025-02-15T10:30:00Z"
          },
          {
            id: 2,
            name: "Mountain Landscape Poster",
            description: "High-quality print of mountain landscape",
            basePrice: 24.99,
            category: { id: 2, name: "Home Decor", description: "Decoration items" },
            design: { 
              id: 2, 
              name: "Mountain Landscape", 
              description: "Scenic mountain view", 
              designUrl: "https://via.placeholder.com/300",
              createdAt: "2025-03-01T14:20:00Z",
              partnerId: 1
            },
            variants: [
              { id: 4, size: "Small (11x17)", color: "Matte", priceAdjustment: 0, stock: 40 },
              { id: 5, size: "Medium (18x24)", color: "Matte", priceAdjustment: 5, stock: 35 },
              { id: 6, size: "Large (24x36)", color: "Matte", priceAdjustment: 10, stock: 20 }
            ],
            createdAt: "2025-03-01T14:20:00Z",
            updatedAt: "2025-03-01T14:20:00Z"
          }
        ],
        totalPages: 1,
        totalElements: 2,
        size: 10,
        number: 0
      };
    }
  },

  getProduct: async (productId: number): Promise<Product> => {
    const response = await api.get(`/partner/products/${productId}`);
    return response.data;
  },

  createProduct: async (productData: ProductRequest): Promise<Product> => {
    const response = await api.post('/partner/products', productData);
    return response.data;
  },

  updateProduct: async (productId: number, productData: ProductRequest): Promise<Product> => {
    const response = await api.put(`/partner/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await api.delete(`/partner/products/${productId}`);
  },

  // Category related services
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return mock data for development
      return [
        { id: 1, name: "T-shirts", description: "Comfortable cotton t-shirts" },
        { id: 2, name: "Posters", description: "High-quality poster prints" },
        { id: 3, name: "Mugs", description: "Ceramic mugs" },
        { id: 4, name: "Phone Cases", description: "Protective phone cases" }
      ];
    }
  }
};