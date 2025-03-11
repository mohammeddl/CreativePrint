import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PlusCircle, Search, Edit, Trash, X, ExternalLink, ShoppingBag } from "lucide-react"
import { api } from "../../components/services/api/axios"
import toast from "react-hot-toast"
import { Product, ProductVariant } from "../../types/product"
import Swal from "sweetalert2"


export default function PartnerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/partner/products?page=${page}&size=10&search=${searchQuery}`)
        setProducts(response.data.content || [])
        setTotalPages(response.data.totalPages || 0)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
        
        // Use sample data if API call fails
        setProducts([
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
              createdAt: "2025-01-01T00:00:00Z",
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
            basePrice: 29.99,
            category: { id: 2, name: "Art", description: "Art prints and posters" },
            design: { 
              id: 2, 
              name: "Mountain Landscape", 
              description: "Scenic mountain view", 
              designUrl: "https://via.placeholder.com/300",
              createdAt: "2025-01-01T00:00:00Z",
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
        ])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(0) // Reset to first page when search changes
  }

  const handleDeleteProduct = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea', 
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        await api.delete(`/partner/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted.',
          icon: 'success',
          confirmButtonColor: '#9333ea'
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete product.',
          icon: 'error',
          confirmButtonColor: '#9333ea'
        });
      }
    }
  };

  const calculateTotalInventory = (variants: ProductVariant[]) => {
    return variants.reduce((total, variant) => total + variant.stock, 0)
  }

  const calculateVariantCount = (variants: ProductVariant[]) => {
    const sizes = new Set(variants.map(v => v.size))
    const colors = new Set(variants.map(v => v.color))
    
    return `${variants.length} variants (${sizes.size} sizes × ${colors.size} colors)`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Link 
          to="/dashboard/products/new" 
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="relative">
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
                  Base Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variants
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Inventory
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.design.designUrl || "https://via.placeholder.com/100"}
                          alt={product.name}
                          onError={e => (e.target as HTMLImageElement).src = "https://via.placeholder.com/100"}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.basePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateVariantCount(product.variants)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateTotalInventory(product.variants)} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/dashboard/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                      <Link 
                        to={`/products/${product.id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-sm text-gray-500 mb-6">Create your first product to start selling</p>
          <Link
            to="/dashboard/products/new"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-3 py-1 rounded-md ${page === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 rounded-md ${page === i ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`px-3 py-1 rounded-md ${page === totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}