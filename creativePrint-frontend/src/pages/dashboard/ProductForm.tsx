import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ArrowLeft, Plus, Trash, Info, Check } from "lucide-react"
import { api } from "../../components/services/api/axios"
import toast from "react-hot-toast"

interface Design {
  id: number
  name: string
  designUrl: string
}

interface Category {
  id: number
  name: string
}

interface ProductVariant {
  size: string
  color: string
  priceAdjustment: number
  stock: number
}

interface ProductFormData {
  name: string
  description: string
  basePrice: number
  categoryId: number
  designId: number
  variants: ProductVariant[]
}

export default function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const designIdFromQuery = queryParams.get('designId')
  
  const isEditing = !!id
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [designs, setDesigns] = useState<Design[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    basePrice: 0,
    categoryId: 0,
    designId: designIdFromQuery ? parseInt(designIdFromQuery) : 0,
    variants: [{ size: "", color: "", priceAdjustment: 0, stock: 0 }]
  })

  // Fetch designs and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch designs
        const designsResponse = await api.get('/partner/designs')
        setDesigns(designsResponse.data.content || [])
        
        // Fetch categories
        const categoriesResponse = await api.get('/categories')
        setCategories(categoriesResponse.data || [])
        
        // If no categories or designs exist yet, use sample data
        if (!categoriesResponse.data?.length) {
          setCategories([
            { id: 1, name: "T-shirts" },
            { id: 2, name: "Posters" },
            { id: 3, name: "Mugs" },
            { id: 4, name: "Phone Cases" }
          ])
        }
        
        if (!designsResponse.data?.content?.length) {
          setDesigns([
            { id: 1, name: "Abstract Design", designUrl: "https://via.placeholder.com/300" },
            { id: 2, name: "Mountain Landscape", designUrl: "https://via.placeholder.com/300" }
          ])
        }
        
        // If this is first category/design, preselect it
        if (!formData.categoryId && categoriesResponse.data?.length) {
          setFormData(prev => ({ ...prev, categoryId: categoriesResponse.data[0].id }))
        }
        
        if (!formData.designId && !designIdFromQuery && designsResponse.data?.content?.length) {
          setFormData(prev => ({ ...prev, designId: designsResponse.data.content[0].id }))
        }
        
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error loading required data")
      }
    }
    
    fetchData()
  }, [designIdFromQuery, formData.categoryId, formData.designId])
  
  // If editing, fetch existing product data
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/partner/products/${id}`)
          const product = response.data
          
          setFormData({
            name: product.name,
            description: product.description,
            basePrice: product.basePrice,
            categoryId: product.category.id,
            designId: product.design.id,
            variants: product.variants.map((v: any) => ({
              size: v.size,
              color: v.color,
              priceAdjustment: v.priceAdjustment,
              stock: v.stock
            }))
          })
        } catch (error) {
          console.error("Error fetching product:", error)
          toast.error("Failed to load product data")
          navigate('/dashboard/products')
        }
      }
      
      fetchProduct()
    }
  }, [id, isEditing, navigate])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basePrice' || name === 'categoryId' || name === 'designId' 
        ? parseFloat(value) 
        : value
    }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...formData.variants]
    
    if (field === 'priceAdjustment' || field === 'stock') {
      newVariants[index][field] = typeof value === 'string' ? parseFloat(value) : value
    } else {
      newVariants[index][field] = value as string
    }
    
    setFormData(prev => ({ ...prev, variants: newVariants }))
    
    // Clear variant errors
    if (errors[`variants.${index}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`variants.${index}.${field}`]
        return newErrors
      })
    }
  }
  
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "", color: "", priceAdjustment: 0, stock: 0 }
      ]
    }))
  }
  
  const removeVariant = (index: number) => {
    if (formData.variants.length === 1) {
      toast.error("You must have at least one variant")
      return
    }
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
    
    // Remove any errors for this variant
    setErrors(prev => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`variants.${index}`)) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    }
    
    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Base price must be greater than zero"
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required"
    }
    
    if (!formData.designId) {
      newErrors.designId = "Design is required"
    }
    
    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.size.trim()) {
        newErrors[`variants.${index}.size`] = "Size is required"
      }
      
      if (!variant.color.trim()) {
        newErrors[`variants.${index}.color`] = "Color is required"
      }
      
      if (variant.stock < 0) {
        newErrors[`variants.${index}.stock`] = "Stock cannot be negative"
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const requestData = {
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        categoryId: formData.categoryId,
        designId: formData.designId,
        variants: formData.variants
      }
      
      if (isEditing) {
        await api.put(`/partner/products/${id}`, requestData)
        toast.success("Product updated successfully")
      } else {
        await api.post('/partner/products', requestData)
        toast.success("Product created successfully")
      }
      
      navigate('/dashboard/products')
    } catch (error: any) {
      console.error("Error saving product:", error)
      
      if (error.response?.data) {
        // Handle validation errors from server
        const serverErrors = error.response.data
        
        if (typeof serverErrors === 'object') {
          setErrors(serverErrors)
        } else {
          toast.error(error.response.data.message || "Failed to save product")
        }
      } else {
        toast.error("Failed to save product. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getVariantError = (index: number, field: string) => {
    return errors[`variants.${index}.${field}`]
  }
  
  const getSelectedDesign = () => {
    return designs.find(d => d.id === formData.designId)
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard/products')}
          className="p-2 mr-4 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Product" : "Create New Product"}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter product description (optional)"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="basePrice"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`block w-full pl-8 rounded-md border ${errors.basePrice ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.basePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId || ""}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="designId" className="block text-sm font-medium text-gray-700 mb-1">
                  Design*
                </label>
                <select
                  id="designId"
                  name="designId"
                  value={formData.designId || ""}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border ${errors.designId ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select Design</option>
                  {designs.map(design => (
                    <option key={design.id} value={design.id}>
                      {design.name}
                    </option>
                  ))}
                </select>
                {errors.designId && (
                  <p className="mt-1 text-sm text-red-600">{errors.designId}</p>
                )}
                {designs.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No designs found. <a href="/dashboard/designs/new" className="text-purple-600 hover:text-purple-800">Upload a design</a> first.
                  </p>
                )}
              </div>
            </div>
            
            {/* Right Column - Design Preview */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Design Preview</h3>
                {getSelectedDesign() ? (
                  <div className="flex justify-center bg-gray-100 rounded-md p-4">
                    <img 
                      src={getSelectedDesign()?.designUrl || 'https://via.placeholder.com/300'} 
                      alt="Design Preview" 
                      className="max-h-40 object-contain"
                      onError={e => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300'}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-md p-8 text-center text-gray-500">
                    No design selected
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Variants Section */}
          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variant
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-sm relative">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Remove variant"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor={`variant-${index}-size`} className="block text-xs font-medium text-gray-700 mb-1">
                        Size*
                      </label>
                      <input
                        type="text"
                        id={`variant-${index}-size`}
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        className={`block w-full text-sm rounded-md border ${getVariantError(index, 'size') ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        placeholder="S, M, L, XL..."
                      />
                      {getVariantError(index, 'size') && (
                        <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'size')}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor={`variant-${index}-color`} className="block text-xs font-medium text-gray-700 mb-1">
                        Color*
                      </label>
                      <input
                        type="text"
                        id={`variant-${index}-color`}
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className={`block w-full text-sm rounded-md border ${getVariantError(index, 'color') ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        placeholder="Black, White, Red..."
                      />
                      {getVariantError(index, 'color') && (
                        <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'color')}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor={`variant-${index}-priceAdjustment`} className="block text-xs font-medium text-gray-700 mb-1">
                        Price Adjustment
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          type="number"
                          id={`variant-${index}-priceAdjustment`}
                          value={variant.priceAdjustment}
                          onChange={(e) => handleVariantChange(index, 'priceAdjustment', e.target.value)}
                          step="0.01"
                          className="block w-full text-sm pl-8 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Additional cost for this variant
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor={`variant-${index}-stock`} className="block text-xs font-medium text-gray-700 mb-1">
                        Stock*
                      </label>
                      <input
                        type="number"
                        id={`variant-${index}-stock`}
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                        min="0"
                        className={`block w-full text-sm rounded-md border ${getVariantError(index, 'stock') ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        placeholder="0"
                      />
                      {getVariantError(index, 'stock') && (
                        <p className="mt-1 text-xs text-red-600">{getVariantError(index, 'stock')}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Display the final price for this variant */}
                  <div className="mt-2 text-sm text-gray-500">
                    Final price: ${(formData.basePrice + variant.priceAdjustment).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Pricing Tips:</p>
              <ul className="space-y-1 list-disc pl-5">
                <li>Set your base price to cover production costs and desired profit margin</li>
                <li>Use price adjustments for variants that cost more to produce (e.g., larger sizes)</li>
                <li>Monitor your competition to ensure your prices are competitive</li>
              </ul>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/products')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  <span>{isEditing ? "Update Product" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}