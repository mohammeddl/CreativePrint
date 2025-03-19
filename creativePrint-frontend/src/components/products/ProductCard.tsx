import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "../../store/slices/cartSlice"
import type { Product } from "../../types/product"

interface ProductCardProps {
  product: Product;
  compact?: boolean; 
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const dispatch = useDispatch()

  const productId = product.id
  const productName = product.name
  const productDescription = product.description
  
  const designImage = product.design?.designUrl || product.image || "../../../public/assets/images/default-avatar.png"
  
  const mockupImage = "../../../public/assets/images/t-shirt.png" 
  
  const productPrice = product.price || product.basePrice || 0
  
  const categoryName = typeof product.category === 'string' 
                      ? product.category 
                      : product.category?.name || ''

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      product: {
        ...product,
        price: productPrice,  
        image: designImage   
      }, 
      quantity: 1 
    }))
  }

  // Compact card for hot products section
  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1">
        <Link to={`/products/${productId}`} className="block relative">
          <div className="relative h-40 bg-gray-200 overflow-hidden">
            {/* Base mockup image */}
            <img 
              src={mockupImage} 
              alt="T-shirt mockup" 
              className="w-full h-full object-cover absolute inset-0" 
            />
            
            {/* Design overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={designImage} 
                alt={productName} 
                className="w-1/3 h-auto object-contain max-h-32 mix-blend-normal" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "../../../public/assets/images/default-avatar.png";
                }}
              />
            </div>
          </div>
          
          {product.isHot && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              HOT
            </span>
          )}
        </Link>
        
        <div className="p-3">
          <Link to={`/products/${productId}`}>
            <h3 className="text-sm font-medium hover:text-purple-600 transition-colors truncate">
              {productName}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ${productPrice.toFixed(2)}
            </span>
            
            <button
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-full transition-colors"
              aria-label={`Add ${productName} to cart`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Regular card for product catalog
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/products/${productId}`} className="block relative">
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          {/* Base mockup image */}
          <img 
            src={mockupImage} 
            alt="T-shirt mockup" 
            className="w-full h-full object-cover absolute inset-0" 
          />
          
          {/* Design overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={designImage} 
              alt={productName} 
              className="w-1/3 h-auto object-contain max-h-48 mix-blend-normal" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "../../../public/assets/images/default-avatar.png";
              }}
            />
          </div>
        </div>
        
        {product.isHot && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            HOT
          </span>
        )}
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${productId}`}>
          <h3 className="text-lg font-semibold mb-1 hover:text-purple-600 transition-colors">
            {productName}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {categoryName}
        </p>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {productDescription}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ${productPrice.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center px-3 py-2 rounded transition-colors"
            aria-label={`Add ${productName} to cart`}
          >
            <ShoppingCart size={18} className="mr-1" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}