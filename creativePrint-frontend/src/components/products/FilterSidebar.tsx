import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Search, X } from "lucide-react"
import { setSelectedCategory } from "../../store/slices/productSlice"
import type { RootState } from "../../store/store"
import { AppDispatch } from "../../store/store"

export default function FilterSidebar() {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, selectedCategory } = useSelector((state: RootState) => state.products)
  const [isOpen, setIsOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<string[]>(categories)

  useEffect(() => {
    if (categories && categories.length > 0) {
      setFilteredCategories(
        categories.filter((category) => 
          category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [categories, searchTerm])

  const handleCategoryChange = (category: string | null) => {
    dispatch(setSelectedCategory(category))
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-purple-600 text-white">
        <h2 className="text-xl font-semibold">Filter Products</h2>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-purple-600 focus:ring-purple-500 cursor-pointer"
                    checked={selectedCategory === null}
                    onChange={() => handleCategoryChange(null)}
                  />
                  <span className="text-gray-700 dark:text-gray-300">All Categories</span>
                </label>
                {filteredCategories.map((category) => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-purple-600 focus:ring-purple-500 cursor-pointer"
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
              {filteredCategories.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-center">No categories found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}