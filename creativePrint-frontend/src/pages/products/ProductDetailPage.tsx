import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react'
import { addToCart } from '../../store/slices/cartSlice'
import { productService } from '../../components/services/api/product.service'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import RelatedProducts from '../../components/products/RelatedProducts'
import type { Product } from '../../types/product'

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return
      
      try {
        setLoading(true)
        const productData = await productService.getProductDetails(productId)
        setProduct(productData)
      } catch (err) {
        console.error('Error fetching product details:', err)
        setError('Failed to load product details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return
    
    dispatch(addToCart({
      product,
      quantity
    }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value))
  }

  const handleGoBack = () => {
    navigate(-1)
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

 
  const productName = product.name
  const productDescription = product.description
  const productImage = product.image || 
                      (product.design?.designUrl) || 
                      "/placeholder.svg"
  
 
  const productPrice = product.price || product.basePrice || 0
  
  const categoryName = typeof product.category === 'string' 
                      ? product.category 
                      : product.category?.name || ''

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
                {/* T-shirt mockup base image */}
                <img
                  src="../../../public/assets/images/t-shirt.png"
                  alt="T-shirt mockup"
                  className="w-full h-full object-contain"
                />
                
                {/* Design overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-1/3 max-h-72 object-contain mix-blend-normal"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
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
              
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${productPrice.toFixed(2)}
                </p>
                {product.stock ? (
                  <p className="text-sm text-green-600 mt-1">
                    In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                )}
              </div>
              
              <div className="mb-6">
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
                    disabled={!product.stock}
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
                  disabled={!product.stock}
                  className={`flex-grow py-3 px-6 rounded-md text-white font-medium flex items-center justify-center ${
                    product.stock
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {product.stock ? 'Add to Cart' : 'Out of Stock'}
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
      </main>
      <Footer />
    </div>
  )
}