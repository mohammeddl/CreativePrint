import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Trash,
  Archive,
  RefreshCw,
  Eye,
  Edit,
  Tag,
  PackageOpen,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../../components/services/api/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

interface AdminProduct {
  id: number | string;
  name: string;
  description: string;
  basePrice: number;
  category: {
    id: number;
    name: string;
  };
  design: {
    id: number;
    name: string;
    designUrl: string;
    creator: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
  archived: boolean;
  createdAt: string;
  totalSold: number;
  totalStock: number;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchQuery, categoryFilter, statusFilter]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Sample categories for demo/testing
      setCategories([
        { id: 1, name: 'T-Shirts' },
        { id: 2, name: 'Mugs' },
        { id: 3, name: 'Posters' },
        { id: 4, name: 'Phone Cases' }
      ]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Construct query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', '10');
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      // Make API call to get all products including archived ones
      const response = await api.get(`/admin/products?${params.toString()}`);
      
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      
      // Sample data for demo/testing
      setProducts([
        {
          id: 1,
          name: 'Abstract Pattern T-Shirt',
          description: 'Comfortable cotton t-shirt with abstract design',
          basePrice: 19.99,
          category: { id: 1, name: 'T-Shirts' },
          design: {
            id: 1,
            name: 'Abstract Pattern',
            designUrl: 'https://via.placeholder.com/150',
            creator: { id: 2, firstName: 'Jane', lastName: 'Smith' }
          },
          archived: false,
          createdAt: '2023-01-15T10:30:00Z',
          totalSold: 42,
          totalStock: 58
        },
        {
          id: 2,
          name: 'Mountain Landscape Mug',
          description: 'Ceramic mug with mountain landscape design',
          basePrice: 12.99,
          category: { id: 2, name: 'Mugs' },
          design: {
            id: 2,
            name: 'Mountain Landscape',
            designUrl: 'https://via.placeholder.com/150',
            creator: { id: 2, firstName: 'Jane', lastName: 'Smith' }
          },
          archived: true,
          createdAt: '2023-02-05T14:20:00Z',
          totalSold: 18,
          totalStock: 0
        },
        {
          id: 3,
          name: 'Cityscape Poster',
          description: 'High-quality print of urban cityscape',
          basePrice: 24.99,
          category: { id: 3, name: 'Posters' },
          design: {
            id: 3,
            name: 'Cityscape',
            designUrl: 'https://via.placeholder.com/150',
            creator: { id: 1, firstName: 'John', lastName: 'Doe' }
          },
          archived: false,
          createdAt: '2023-01-10T09:15:00Z',
          totalSold: 7,
          totalStock: 23
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleViewProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const toggleArchiveStatus = async (productId: string | number, isArchived: boolean) => {
    const action = isArchived ? 'unarchive' : 'archive';
    const title = isArchived ? 'Unarchive Product' : 'Archive Product';
    const text = isArchived 
      ? 'Are you sure you want to unarchive this product? It will be visible to customers again.'
      : 'Are you sure you want to archive this product? It will no longer be visible to customers but all data will be preserved.';
    
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed'
    });

    if (result.isConfirmed) {
      try {
        // Call API to toggle archive status
        await api.patch(`/admin/products/${productId}/archive`, { archived: !isArchived });
        
        // Update local state
        setProducts(products.map(product => 
          product.id === productId ? { ...product, archived: !isArchived } : product
        ));
        
        toast.success(`Product ${action}d successfully`);
      } catch (error) {
        console.error(`Error ${action}ing product:`, error);
        toast.error(`Failed to ${action} product`);
      }
    }
  };

  const handleDeleteProduct = async (productId: string | number) => {
    const result = await Swal.fire({
      title: 'Delete Product',
      text: 'Are you sure you want to permanently delete this product? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete product'
    });

    if (result.isConfirmed) {
      try {
        // Call API to delete product
        await api.delete(`/admin/products/${productId}`);
        
        // Update local state
        setProducts(products.filter(product => product.id !== productId));
        
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button 
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 ${product.archived ? 'bg-gray-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          src={product.design.designUrl || "https://via.placeholder.com/100"} 
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/100";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.basePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.design.creator.firstName} {product.design.creator.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.archived 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.archived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.totalStock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.totalStock > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.totalStock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleArchiveStatus(product.id, product.archived)}
                        className={`${
                          product.archived 
                            ? 'text-green-600 hover:text-green-900' 
                            : 'text-amber-600 hover:text-amber-900'
                        } p-1`}
                        title={product.archived ? 'Unarchive Product' : 'Archive Product'}
                      >
                        {product.archived ? <CheckCircle className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Product"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                      <a
                        href={`/products/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="View on Store"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchQuery || categoryFilter || statusFilter 
              ? "Try adjusting your search filters" 
              : "No products are registered in the system"}
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`px-3 py-1 rounded-md ${currentPage === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Product View Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Product Details
              </h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-60px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
                    <img
                      src={selectedProduct.design.designUrl || "https://via.placeholder.com/400"}
                      alt={selectedProduct.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400";
                      }}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Creator</h4>
                      <p className="text-sm text-gray-900">
                        {selectedProduct.design.creator.firstName} {selectedProduct.design.creator.lastName}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Design Name</h4>
                      <p className="text-sm text-gray-900">{selectedProduct.design.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created On</h4>
                      <p className="text-sm text-gray-900">{formatDate(selectedProduct.createdAt)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedProduct.archived 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedProduct.archived ? 'Archived' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-gray-500 mt-1">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Base Price</h4>
                      <p className="text-lg font-semibold text-gray-900">${selectedProduct.basePrice.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {selectedProduct.category.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Stock</h4>
                      <p className="text-gray-900">{selectedProduct.totalStock} units</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Total Sold</h4>
                      <p className="text-gray-900">{selectedProduct.totalSold} units</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Product Variants</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Variant details would be shown here</p>
                      {/* Implement variant listing */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <div>
                <button
                  onClick={() => toggleArchiveStatus(selectedProduct.id, selectedProduct.archived)}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedProduct.archived 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {selectedProduct.archived ? 'Unarchive Product' : 'Archive Product'}
                </button>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}