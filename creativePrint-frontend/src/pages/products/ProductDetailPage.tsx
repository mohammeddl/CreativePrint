import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Star, Check } from 'lucide-react'
import { addToCart } from '../../store/slices/cartSlice'
import { enhancedProductService } from '../../components/services/api/enhancedProduct.service'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import RelatedProducts from '../../components/products/RelatedProducts'
import SizeGuideModal from '../../components/products/SizeGuideModal'
import type { ProductWithVariants, ProductVariant } from '../../types/product'

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  
  // State for product customization
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [sizesForSelectedColor, setSizesForSelectedColor] = useState<string[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return
      
      try {
        setLoading(true)
        const productData = await enhancedProductService.getProductWithVariants(productId)
        setProduct(productData)
        
        // Extract unique colors and sizes from variants
        if (productData.variants && productData.variants.length > 0) {
          const uniqueColors = [...new Set(productData.variants.map(v => v.color))]
          const uniqueSizes = [...new Set(productData.variants.map(v => v.size))]
          
          setAvailableColors(uniqueColors)
          setAvailableSizes(uniqueSizes)
          
          // Set initial color
          if (uniqueColors.length > 0) {
            handleColorSelect(uniqueColors[0])
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
        setError('Failed to load product details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    
    // Update available sizes for this color
    if (product && product.variants) {
      const sizesForColor = [...new Set(
        product.variants
          .filter(v => v.color === color && v.stock > 0)
          .map(v => v.size)
      )]
      
      setSizesForSelectedColor(sizesForColor)
      
      // Auto-select first size if the current selection is not available
      if (sizesForColor.length > 0 && !sizesForColor.includes(selectedSize)) {
        handleSizeSelect(sizesForColor[0])
      }
    }
  }
  
  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    
    // Find and set the selected variant
    if (product && product.variants) {
      const variant = product.variants.find(
        v => v.color === selectedColor && v.size === size
      )
      
      if (variant) {
        setSelectedVariant(variant)
      }
    }
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    
    // Create product with selected variant info
    const productToAdd = {
      ...product,
      selectedVariant,
      selectedColor,
      selectedSize,
      // Calculate price with variant adjustment
      price: product.price + (selectedVariant.priceAdjustment || 0),
      stock: selectedVariant.stock
    }
    
    dispatch(addToCart({
      product: productToAdd,
      quantity
    }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value))
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  // Handle opening the size guide
  const handleOpenSizeGuide = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSizeGuideOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error || 'Product not found'}</p>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <ArrowLeft size={18} className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Product data extraction
  const productName = product.name
  const productDescription = product.description
  const productImage = product.image || "../../../public/assets/images/default-avatar.png"
  const categoryName = product.category
  
  // Color variations for the mockup T-shirt based on selection
  const shirtColorClass = () => {
    switch(selectedColor.toLowerCase()) {
      case 'black': return 'bg-black';
      case 'white': return 'bg-white';
      case 'navy': return 'bg-blue-900';
      case 'red': return 'bg-red-600';
      case 'gray': return 'bg-gray-500';
      case 'green': return 'bg-green-600';
      case 'purple': return 'bg-purple-600';
      case 'yellow': return 'bg-yellow-400';
      case 'blue': return 'bg-blue-600';
      case 'pink': return 'bg-pink-400';
      default: return 'bg-gray-100';
    }
  };

  // Get current price (base price + variant adjustment)
  const getCurrentPrice = () => {
    if (!selectedVariant) return product.price;
    return product.price + (selectedVariant.priceAdjustment || 0);
  };

  // Check if product is in stock based on the selected variant
  const isProductInStock = () => {
    if (!selectedVariant) return false;
    return selectedVariant.stock > 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center mb-6 text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Products
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image with Mockup */}
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-full bg-gray-100">
                {/* T-shirt mockup base with dynamic color */}
                <div className={`w-full h-full flex items-center justify-center`}>
                  <img
                    src="../../../public/assets/images/t-shirt.png"
                    alt="T-shirt mockup"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                
                {/* Design overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-1/3 max-h-72 object-contain mix-blend-normal"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "../../../public/assets/images/default-avatar.png";
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div 
              className="md:w-1/2 p-6 md:p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {productName}
              </h1>
              
              <div className="flex items-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mr-4">
                  Category: <span className="font-medium">{categoryName}</span>
                </p>
                {product.isHot && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    HOT
                  </span>
                )}
              </div>
              
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    className={`${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                  4.0 (12 reviews)
                </span>
              </div>
              
              {/* Product Customization Options */}
              <div className="mt-6 space-y-6">
                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Color</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={`relative h-10 w-10 rounded-full border p-0.5 ${
                            selectedColor === color 
                              ? 'border-gray-900 dark:border-gray-100' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          aria-label={`Color: ${color}`}
                        >
                          {selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check 
                                className={`h-4 w-4 ${
                                  color.toLowerCase() === 'white'
                                    ? 'text-gray-900' 
                                    : 'text-white'
                                }`} 
                              />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Size</h3>
                      <a 
                        href="#size-guide" 
                        className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400"
                        onClick={handleOpenSizeGuide}
                      >
                        Size guide
                      </a>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-6">
                      {availableSizes.map((size) => {
                        // Check if this size is available for the selected color
                        const isAvailable = sizesForSelectedColor.includes(size);
                        
                        return (
                          <button
                            key={size}
                            onClick={() => isAvailable && handleSizeSelect(size)}
                            className={`flex items-center justify-center rounded-md border py-2 text-sm font-medium ${
                              !isAvailable 
                                ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500' 
                                : selectedSize === size
                                  ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-700'
                                  : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
                            }`}
                            disabled={!isAvailable}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getCurrentPrice().toFixed(2)}
                </div>
              </div>
              
              <div className="mb-6 mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {productDescription}
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-24 mr-4">
                  <select
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={!isProductInStock()}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!isProductInStock() || !selectedVariant}
                  className={`flex-grow py-3 px-6 rounded-md text-white font-medium flex items-center justify-center ${
                    isProductInStock() && selectedVariant
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {isProductInStock() && selectedVariant 
                    ? 'Add to Cart' 
                    : selectedVariant 
                      ? 'Out of Stock' 
                      : 'Select options'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Related Products Section */}
        <RelatedProducts 
          currentProductId={productId || ""} 
          categoryName={categoryName} 
        />
        
        {/* Size Guide Modal */}
        <SizeGuideModal 
          isOpen={isSizeGuideOpen} 
          onClose={() => setIsSizeGuideOpen(false)} 
        />
        
      </main>
      <Footer />
    </div>
  )
}