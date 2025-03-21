// src/components/services/api/product.service.ts
import { api } from "./axios";
import {
  Product,
  ProductRequest,
  Design,
  DesignRequest,
  Category,
  ProductsResponse,
} from "../../../types/product";
import { PageResponse } from "../../../types/order";

export const productService = {
  // Client-side product fetching
  getProductsCatalog: async (
    page: number = 0,
    size: number = 12,
    category: string | null = null
  ): Promise<ProductsResponse> => {
    try {
      // Build query parameters
      const params: Record<string, any> = { page, size };
      if (category) {
        params.category = category;
      }

      console.log("Fetching products with params:", params);
      const response = await api.get("/products", { params });
      console.log("API response status:", response.status);

      // Return the data if successful
      if (response.data) {
        return response.data;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error fetching product catalog:", error);
      // For development purposes, return mock data that has proper pagination structure
      const mockProducts = [
        {
          id: 1,
          name: "Abstract Pattern T-Shirt",
          description: "Comfortable cotton t-shirt with abstract design",
          price: 19.99,
          image: "https://via.placeholder.com/300",
          category: "Clothing",
          isHot: true,
          stock: 25,
        },
        {
          id: 2,
          name: "Mountain Landscape Poster",
          description: "High-quality print of mountain landscape",
          price: 24.99,
          image: "https://via.placeholder.com/300",
          category: "Home Decor",
          isHot: false,
          stock: 40,
        },
        {
          id: 3,
          name: "Ceramic Coffee Mug",
          description: "Stylish ceramic mug for your favorite beverages",
          price: 14.99,
          image: "https://via.placeholder.com/300",
          category: "Mugs",
          isHot: true,
          stock: 50,
        },
        {
          id: 4,
          name: "Phone Case",
          description: "Protective phone case with custom design",
          price: 12.99,
          image: "https://via.placeholder.com/300",
          category: "Accessories",
          isHot: false,
          stock: 100,
        },
        {
          id: 5,
          name: "Stylish Cap",
          description: "Comfortable cap with custom design",
          price: 9.99,
          image: "https://via.placeholder.com/300",
          category: "Hat",
          isHot: true,
          stock: 35,
        },
        {
          id: 6,
          name: "Large Coffee Mug",
          description: "Extra large ceramic mug for coffee lovers",
          price: 16.99,
          image: "https://via.placeholder.com/300",
          category: "Mugs",
          isHot: false,
          stock: 30,
        },
        // Add more products for pagination
        {
          id: 7,
          name: "Vintage T-Shirt",
          description: "Retro styled cotton t-shirt",
          price: 21.99,
          image: "https://via.placeholder.com/300",
          category: "Clothing",
          isHot: false,
          stock: 25,
        },
        {
          id: 8,
          name: "Designer Mug",
          description: "Premium designer mug",
          price: 19.99,
          image: "https://via.placeholder.com/300",
          category: "Mugs",
          isHot: false,
          stock: 20,
        },
        {
          id: 9,
          name: "Baseball Cap",
          description: "Classic baseball cap with custom design",
          price: 11.99,
          image: "https://via.placeholder.com/300",
          category: "Hat",
          isHot: false,
          stock: 45,
        },
        {
          id: 10,
          name: "Long Sleeve T-Shirt",
          description: "Comfortable long sleeve t-shirt",
          price: 24.99,
          image: "https://via.placeholder.com/300",
          category: "Clothing",
          isHot: false,
          stock: 35,
        },
        {
          id: 11,
          name: "Travel Mug",
          description: "Insulated travel mug",
          price: 18.99,
          image: "https://via.placeholder.com/300",
          category: "Mugs",
          isHot: false,
          stock: 50,
        },
        {
          id: 12,
          name: "Trucker Hat",
          description: "Modern trucker hat with mesh back",
          price: 13.99,
          image: "https://via.placeholder.com/300",
          category: "Hat",
          isHot: false,
          stock: 30,
        },
        {
          id: 13,
          name: "Premium T-Shirt",
          description: "High-quality cotton premium t-shirt",
          price: 29.99,
          image: "https://via.placeholder.com/300",
          category: "Clothing",
          isHot: false,
          stock: 25,
        },
        {
          id: 14,
          name: "Espresso Mug Set",
          description: "Set of 4 espresso mugs",
          price: 24.99,
          image: "https://via.placeholder.com/300",
          category: "Mugs",
          isHot: false,
          stock: 15,
        },
        {
          id: 15,
          name: "Winter Hat",
          description: "Warm winter hat with custom design",
          price: 17.99,
          image: "https://via.placeholder.com/300",
          category: "Hat",
          isHot: false,
          stock: 25,
        },
      ];

      // Extract all unique categories from the mock products
      const categories = Array.from(
        new Set(mockProducts.map((p) => p.category))
      );

      // Filter products by category if provided
      let filteredProducts = category
        ? mockProducts.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          )
        : mockProducts;

      // Implement proper pagination
      const productsPerPage = size || 12;
      const totalItems = filteredProducts.length;
      const totalPages = Math.ceil(totalItems / productsPerPage);

      // Validate page number
      const validatedPage = Math.max(0, Math.min(page, totalPages - 1));

      // Get the right slice of products for the current page
      const startIndex = validatedPage * productsPerPage;
      const endIndex = Math.min(startIndex + productsPerPage, totalItems);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      console.log(
        `Returning mock data: Page ${validatedPage + 1} of ${totalPages}, ${
          paginatedProducts.length
        } items`
      );

      return {
        products: paginatedProducts,
        totalPages: totalPages,
        totalItems: totalItems,
        currentPage: validatedPage,
        categories: categories,
      };
    }
  },
  // Get a single product by ID
  getProductDetails: async (productId: string | number): Promise<Product> => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Design related services (for partners)
  getDesigns: async (
    page: number = 0,
    size: number = 12,
    search: string = ""
  ): Promise<PageResponse<Design>> => {
    try {
      const response = await api.get("/partner/designs", {
        params: { page, size, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching designs:", error);
      // Mock data unchanged from original
      return {
        content: [
          {
            id: 1,
            name: "Abstract Pattern",
            description: "Colorful abstract pattern for t-shirts",
            designUrl: "https://via.placeholder.com/300",
            createdAt: "2025-02-15T10:30:00Z",
            partnerId: 1,
          },
          {
            id: 2,
            name: "Mountain Landscape",
            description: "Scenic mountain view for posters",
            designUrl: "https://via.placeholder.com/300",
            createdAt: "2025-03-01T14:20:00Z",
            partnerId: 1,
          },
        ],
        totalPages: 1,
        totalElements: 2,
        size: 12,
        number: 0,
      };
    }
  },

  // Rest of the original service methods...
  createDesign: async (designData: DesignRequest): Promise<Design> => {
    const formData = new FormData();
    formData.append("name", designData.name);
    formData.append("description", designData.description || "");
    formData.append("designFile", designData.designFile);

    const response = await api.post("/partner/designs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteDesign: async (designId: number): Promise<void> => {
    await api.delete(`/partner/designs/${designId}`);
  },

  // Product related services for partners
  getProducts: async (
    page: number = 0,
    size: number = 10,
    search: string = ""
  ): Promise<PageResponse<Product>> => {
    try {
      const response = await api.get("/partner/products", {
        params: { page, size, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return mock data for development - unchanged from original
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
              partnerId: 1,
            },
            variants: [
              {
                id: 1,
                size: "S",
                color: "Black",
                priceAdjustment: 0,
                stock: 25,
              },
              {
                id: 2,
                size: "M",
                color: "Black",
                priceAdjustment: 0,
                stock: 30,
              },
              {
                id: 3,
                size: "L",
                color: "Black",
                priceAdjustment: 2,
                stock: 20,
              },
            ],
            createdAt: "2025-02-15T10:30:00Z",
            updatedAt: "2025-02-15T10:30:00Z",
          },
          {
            id: 2,
            name: "Mountain Landscape Poster",
            description: "High-quality print of mountain landscape",
            basePrice: 24.99,
            category: {
              id: 2,
              name: "Home Decor",
              description: "Decoration items",
            },
            design: {
              id: 2,
              name: "Mountain Landscape",
              description: "Scenic mountain view",
              designUrl: "https://via.placeholder.com/300",
              createdAt: "2025-03-01T14:20:00Z",
              partnerId: 1,
            },
            variants: [
              {
                id: 4,
                size: "Small (11x17)",
                color: "Matte",
                priceAdjustment: 0,
                stock: 40,
              },
              {
                id: 5,
                size: "Medium (18x24)",
                color: "Matte",
                priceAdjustment: 5,
                stock: 35,
              },
              {
                id: 6,
                size: "Large (24x36)",
                color: "Matte",
                priceAdjustment: 10,
                stock: 20,
              },
            ],
            createdAt: "2025-03-01T14:20:00Z",
            updatedAt: "2025-03-01T14:20:00Z",
          },
        ],
        totalPages: 1,
        totalElements: 2,
        size: 10,
        number: 0,
      };
    }
  },

  getProduct: async (productId: number): Promise<Product> => {
    const response = await api.get(`/partner/products/${productId}`);
    return response.data;
  },

  createProduct: async (productData: ProductRequest): Promise<Product> => {
    const response = await api.post("/partner/products", productData);
    return response.data;
  },

  updateProduct: async (
    productId: number,
    productData: ProductRequest
  ): Promise<Product> => {
    const response = await api.put(
      `/partner/products/${productId}`,
      productData
    );
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await api.delete(`/partner/products/${productId}`);
  },

  // Category related services
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return mock data for development
      return [
        { id: 1, name: "T-shirts", description: "Comfortable cotton t-shirts" },
        { id: 2, name: "Posters", description: "High-quality poster prints" },
        { id: 3, name: "Mugs", description: "Ceramic mugs" },
        { id: 4, name: "Phone Cases", description: "Protective phone cases" },
      ];
    }
  },
};
