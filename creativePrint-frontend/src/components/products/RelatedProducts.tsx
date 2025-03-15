import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import ProductCard from "./ProductCard"
import type { RootState } from "../../store/store"

interface RelatedProductsProps {
  currentProductId: string | number;
  categoryName: string;
}

export default function RelatedProducts({ currentProductId, categoryName }: RelatedProductsProps) {
  const products = useSelector((state: RootState) => state.products.items)
  
 
  const relatedProducts = products.filter(product => {
    const prodCategory = typeof product.category === 'string' 
                        ? product.category 
                        : product.category?.name || '';
                        
    return prodCategory === categoryName && product.id !== currentProductId;
  });

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="mt-12 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Related Products
        </h2>
        <Link 
          to="/home" 
          className="text-purple-600 hover:text-purple-700 flex items-center text-sm font-medium"
        >
          View all <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
}