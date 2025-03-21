import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import ProductCard from "./ProductCard"
import type { RootState } from "../../store/store"
import { fetchHotProducts } from "../../store/slices/productSlice"
import { AppDispatch } from "../../store/store"

export default function HotProducts() {
  const dispatch = useDispatch<AppDispatch>()
  const hotProducts = useSelector((state: RootState) => state.products.hotItems)
  const loading = useSelector((state: RootState) => state.products.loading)
  
  useEffect(() => {
    dispatch(fetchHotProducts())
  }, [dispatch])

  if (hotProducts.length === 0 && !loading) {
    return null
  }

  return (
    <motion.div 
      className="dark:bg-gray-900 py-10 px-4 my-12 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Hot Products
          </h2>
          <Link 
            to="/home" 
            className="text-purple-600 hover:text-purple-700 flex items-center text-sm font-medium"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {loading && hotProducts.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-500">Loading hot products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {hotProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} compact={true} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}