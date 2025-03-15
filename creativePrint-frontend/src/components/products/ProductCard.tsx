import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "../../store/slices/cartSlice"
import type { Product } from "../../types/product"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch()

  const productId = product.id
  const productName = product.name
  const productDescription = product.description
  const productImage = product.image || 
                      (product.design?.designUrl) || 
                      "/placeholder.svg"
  
  const productPrice = product.price || product.basePrice || 0
  
  const categoryName = typeof product.category === 'string' 
                      ? product.category 
                      : product.category?.name || ''

  const handleAddToCart = () => {
    dispatch(addToCart({ 
      product: {
        ...product,
        price: productPrice,  
        image: productImage  
      }, 
      quantity: 1 
    }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/products/${productId}`} className="block relative">
        <img 
          src={productImage} 
          alt={productName} 
          className="w-full h-48 object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
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