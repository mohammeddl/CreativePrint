import { api } from './axios';
import { Product, ProductWithVariants } from '../../../types/product';

export const enhancedProductService = {
  /**
   * Get product details without variants
   */
  getProductDetails: async (productId: string | number): Promise<Product> => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new Error('Failed to fetch product details');
    }
  },

  /**
   * Get product details with variants
   */
  getProductWithVariants: async (productId: string | number): Promise<ProductWithVariants> => {
    try {
      const response = await api.get(`/products/${productId}/with-variants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product with variants:', error);
      throw new Error('Failed to fetch product variants');
    }
  }
};