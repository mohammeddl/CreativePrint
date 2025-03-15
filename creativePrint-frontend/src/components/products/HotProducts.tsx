import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import ProductCard from "./ProductCard"
import type { RootState } from "../../store/store"

export default function HotProducts() {
  const products = useSelector((state: RootState) => state.products.items)
  const hotProducts = products.filter((product) => product.isHot)


  if (hotProducts.length === 0) {
    return null
  }

  return (
    <motion.div 
      className="my-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Hot Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotProducts.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  )
}