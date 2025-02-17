import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { fetchProducts } from "../../store/slices/productSlice"
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import ProductGrid from "../../components/products/ProductGrid"
import FilterSidebar from "../../components/products/FilterSidebar"
import HotProducts from "../../components/products/HotProducts"
import type { RootState } from "../../store/store"

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { filteredItems, loading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Our Products</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
              <FilterSidebar />
            </aside>
            <div className="md:w-3/4">
              <ProductGrid products={filteredItems} />
            </div>
          </div>
          <HotProducts />
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

